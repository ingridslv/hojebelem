#!/usr/bin/env python3
"""
Coletor de eventos da Sympla para o hojebelem.

Fluxo completo:
  1. Baixa pagina(s) de listagem de Belem/PA
  2. Extrai eventos via Flight parser
  3. Para cada evento: busca dados BFF (organizer + tickets)
  4. Normaliza para o schema Prisma
  5. Classifica em categoria
  6. Upsert no banco (dedupe por externalId)

Execucao:
  export DATABASE_URL="postgresql://usuario:***@host:5432/hojebelem"
  python3 collector/collector.py

Variaveis de ambiente:
  DATABASE_URL            (obrigatoria) conexao PostgreSQL
  SYMPLA_BASE_URL         URL de listagem (default: eventos/belem-pa)
  COLLECTOR_MAX_PAGES     max paginas por coleta (default: 5)
  COLLECTOR_MAX_DAYS_AHEAD dias no futuro a coletar (default: 120)
  COLLECTOR_AUTO_PUBLISH  publicar automaticamente (default: true)
  COLLECTOR_CITY_ID       cityId fixo (opcional; se ausente, busca slug "belem")
  COLLECTOR_CREATED_BY_ID userId fixo (opcional; se ausente, 1o admin)
"""
import logging
import os
import time
from datetime import datetime, timedelta, timezone

import psycopg2

try:
    from sympla_parser import parse_sympla_list
    from sympla_bff import fetch_organizer, fetch_tickets
    from normalizer import normalize_event
    from db_upsert import upsert_event
except ImportError:  # modo pacote (pytest)
    from .sympla_parser import parse_sympla_list
    from .sympla_bff import fetch_organizer, fetch_tickets
    from .normalizer import normalize_event
    from .db_upsert import upsert_event

try:
    from shared import HEADERS, HTTP_TIMEOUT  # modo script
except ImportError:
    from .shared import HEADERS, HTTP_TIMEOUT  # modo pacote
import requests

# ── Configuracoes (env vars com defaults seguros, sem credenciais) ──
BASE_URL = os.environ.get(
    "SYMPLA_BASE_URL", "https://www.sympla.com.br/eventos/belem-pa"
)
MAX_PAGES = int(os.environ.get("COLLECTOR_MAX_PAGES", "5"))
MAX_DAYS_AHEAD = int(os.environ.get("COLLECTOR_MAX_DAYS_AHEAD", "120"))
AUTO_PUBLISH = os.environ.get("COLLECTOR_AUTO_PUBLISH", "true").lower() == "true"
MAX_RETRIES = 3

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("collector")


def _get_db_url() -> str:
    """Le DATABASE_URL do ambiente — falha cedo se ausente (sem credenciais no codigo)."""
    url = os.environ.get("DATABASE_URL")
    if not url:
        raise SystemExit(
            "ERRO: variavel de ambiente DATABASE_URL nao definida. "
            "Ex: export DATABASE_URL=postgresql://usuario:***@host:5432/hojebelem"
        )
    return url


def lookup_ids(db_url: str) -> tuple:
    """Busca cityId (slug 'belem') e createdById (1o usuario admin) no banco.

    Evita hardcode de IDs do seed — os IDs cuid() mudam a cada banco.
    Retorna (city_id, created_by_id). Falha cedo se nao encontrar.
    """
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    try:
        city_id = os.environ.get("COLLECTOR_CITY_ID")
        if not city_id:
            cur.execute('SELECT id FROM "City" WHERE slug = %s LIMIT 1', ("belem",))
            row = cur.fetchone()
            if not row:
                raise SystemExit("ERRO: cidade 'belem' nao encontrada no banco (rode o seed primeiro).")
            city_id = row[0]

        created_by_id = os.environ.get("COLLECTOR_CREATED_BY_ID")
        if not created_by_id:
            cur.execute('SELECT id FROM "User" WHERE role = %s ORDER BY "createdAt" LIMIT 1', ("ADMIN",))
            row = cur.fetchone()
            if not row:
                raise SystemExit("ERRO: nenhum usuario ADMIN encontrado no banco (rode o seed primeiro).")
            created_by_id = row[0]
        return city_id, created_by_id
    finally:
        cur.close()
        conn.close()


def _fetch_page(url: str) -> str:
    """Baixa uma pagina HTML com retry simples (backoff exponencial)."""
    for attempt in range(MAX_RETRIES):
        try:
            resp = requests.get(url, headers=HEADERS, timeout=HTTP_TIMEOUT)
            resp.raise_for_status()
            return resp.text
        except requests.RequestException as e:
            logger.warning("tentativa %d falhou: %s", attempt + 1, e)
            time.sleep(2 ** attempt)
    return ""


def main() -> None:
    """Executa uma coleta completa."""
    db_url = _get_db_url()
    city_id, created_by_id = lookup_ids(db_url)
    logger.info("=== iniciando coleta Sympla ===")
    all_events = []
    seen_ids = set()

    # Coleta paginada (scroll infinito da Sympla: cada page acumula mais eventos)
    for page in range(1, MAX_PAGES + 1):
        url = f"{BASE_URL}?page={page}" if page > 1 else BASE_URL
        logger.info("baixando pagina %d: %s", page, url)
        html = _fetch_page(url)
        if not html:
            logger.warning("pagina %d vazia — parando", page)
            break
        events = parse_sympla_list(html)
        new_count = 0
        for ev in events:
            ev_id = str(ev.get("id", ""))
            if ev_id and ev_id not in seen_ids:
                seen_ids.add(ev_id)
                all_events.append(ev)
                new_count += 1
        logger.info("pagina %d: %d eventos (%d novos)", page, len(events), new_count)
        if new_count == 0:
            break  # fim do scroll infinito

    logger.info("total coletado: %d eventos unicos", len(all_events))

    # Data limite: nao coletar eventos alem de MAX_DAYS_AHEAD dias
    cutoff = datetime.now(timezone.utc) + timedelta(days=MAX_DAYS_AHEAD)

    inserted = 0
    for ev in all_events:
        ev_id = ev.get("id")
        if not ev_id:
            continue

        start_str = ev.get("start_date", "")
        if start_str:
            try:
                start_dt = datetime.fromisoformat(start_str.replace("Z", "+00:00"))
                if start_dt > cutoff:
                    logger.info("pulando %s — data futura alem do limite", ev.get("name"))
                    continue
            except ValueError:
                pass

        # Dados complementares via APIs BFF (organizer + ingressos/precios)
        try:
            organizer = fetch_organizer(ev_id)
        except Exception:
            organizer = {}
        try:
            tickets = fetch_tickets(ev_id)
        except Exception:
            tickets = {"tickets": []}

        normalized = normalize_event(ev, organizer, tickets)
        normalized["cityId"] = city_id
        normalized["createdById"] = created_by_id
        normalized["isPublished"] = AUTO_PUBLISH

        # Imagem: usa URL externa da Sympla (evita rebuild do Next.js).
        # O download local (image_downloader) existe mas esta postergado.

        if upsert_event(db_url, normalized):
            inserted += 1
            logger.info("OK: %s", normalized["title"])
        else:
            logger.warning("FALHA: %s", normalized["title"])

    logger.info("=== coleta finalizada: %d inseridos/atualizados ===", inserted)


if __name__ == "__main__":
    main()
