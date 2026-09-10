# Coletor Sympla — hojebelem

Coleta eventos de Belém/PA da Sympla e insere no banco do site automaticamente.

## Fluxo

```
sympla.com.br/eventos/belem-pa  →  parser Flight  →  APIs BFF (organizer/tickets)
        ↓
   normalizer (schema Event)  →  upsert no Postgres (dedupe por externalId)
```

## Arquivos

| Arquivo | Função |
|---|---|
| `collector.py` | Entrypoint: baixa páginas, orquestra o fluxo |
| `sympla_parser.py` | Extrai eventos do payload Flight (Next.js) da Sympla |
| `sympla_bff.py` | APIs BFF públicas da Sympla (organizador + ingressos/preços) |
| `normalizer.py` | Converte dados brutos para o schema Prisma `Event` |
| `classifier.py` | Classifica eventos por palavras-chave (Música, Teatro, etc.) |
| `db_upsert.py` | Insert/update no Postgres com dedupe por `externalId` |
| `shared.py` | Constantes compartilhadas (User-Agent, timeouts) |
| `image_downloader.py` | Download de imagens locais (postergado; usa-se URL externa) |
| `Dockerfile.collector` | Container do coletor (serviço no compose) |
| `tests/` | Testes pytest (14 testes) |

## Execução manual

```bash
export DATABASE_URL="postgresql://usuario:***@host:5432/hojebelem"
python3 collector/collector.py
```

## Variáveis de ambiente

| Variável | Default | Função |
|---|---|---|
| `DATABASE_URL` | (obrigatória) | Conexão PostgreSQL — **nunca colocar no código** |
| `SYMPLA_BASE_URL` | eventos/belem-pa | URL de listagem |
| `COLLECTOR_MAX_PAGES` | 5 | Máximo de páginas por coleta |
| `COLLECTOR_MAX_DAYS_AHEAD` | 120 | Coleta eventos até N dias no futuro |
| `COLLECTOR_AUTO_PUBLISH` | true | Publicar eventos automaticamente |
| `COLLECTOR_CITY_ID` | (busca slug `belem`) | cityId fixo opcional |
| `COLLECTOR_CREATED_BY_ID` | (busca 1º admin) | userId fixo opcional |
| `SYMPLA_USER_AGENT` | Chrome 126 | User-Agent das requisições |
| `COLLECTOR_HTTP_TIMEOUT` | 30 | Timeout das páginas (segundos) |
| `COLLECTOR_BFF_TIMEOUT` | 15 | Timeout das APIs BFF (segundos) |

## Testes

```bash
python3 -m pytest collector/tests/ -v
```

## Notas

- Os IDs do seed (`cityId`, `createdById`) são buscados dinamicamente no banco
  (cidade `belem` e 1º usuário ADMIN) — nada hardcoded.
- Imagens: usa a URL externa da Sympla (`images.sympla.com.br`) — o Next.js
  precisa de `images.sympla.com.br` em `next.config.ts` (já configurado).
- O parser depende do formato interno do Next.js da Sympla (payload Flight).
  Se a Sympla mudar a implementação, o parser quebra — os testes de fixture
  alertam.
