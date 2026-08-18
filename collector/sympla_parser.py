"""
Parser de eventos da Sympla (página pública de listagem).

Fluxo:
  1. Recebe o HTML bruto da página (ex: sympla.com.br/eventos/belem-pa)
  2. Decodifica o payload Flight (Next.js) — self.__next_f.push(...)
  3. Extrai objetos JSON de evento balanceando chaves/campos
  4. Retorna lista de dicts com os campos do evento

Este módulo NÃO faz download — recebe o HTML bruto como entrada.
"""
import json
import re


def parse_sympla_list(html: str) -> list[dict]:
    """Extrai eventos do HTML da página de listagem da Sympla.

    A página de listagem da Sympla é um app Next.js que embute todos
    os dados dos eventos num payload Flight (self.__next_f.push(...)).
    Cada evento é um objeto JSON com campos: name, id, slug, url,
    start_date, images, location, organizer, etc.

    Args:
        html: conteúdo HTML bruto da página
              (ex: sympla.com.br/eventos/belem-pa)

    Returns:
        lista de dicts — cada evento com os campos do payload
    """
    # ── 1. Extrair os chunks do Flight ──
    # O Flight está em tags <script>self.__next_f.push([1,"..."])</script>
    chunks = []
    for m in re.finditer(
        r'self\.__next_f\.push\(\[(\d+),"((?:[^"\\]|\\.)*)"\]\)',
        html
    ):
        idx = int(m.group(1))
        try:
            # Cada chunk é uma string JSON escapada — decodifica com json.loads
            s = json.loads('"' + m.group(2) + '"')
            chunks.append(s)
        except json.JSONDecodeError:
            continue
    flight = "".join(chunks)

    # ── 2. Localizar os objetos de evento ──
    # Estratégia: achar as imagens (objeto {original, xs, lg}) e subir
    # até encontrar o objeto pai que tenha "name" e "url"
    def parse_balanced(text, start):
        """Extrai um objeto JSON completo a partir de 'start' (deve ser '{')."""
        depth = 0
        i = start
        in_str = False
        esc = False
        while i < len(text):
            c = text[i]
            if in_str:
                if esc:
                    esc = False
                elif c == '\\':
                    esc = True
                elif c == '"':
                    in_str = False
            else:
                if c == '"':
                    in_str = True
                elif c == '{':
                    depth += 1
                elif c == '}':
                    depth -= 1
                    if depth == 0:
                        return text[start:i + 1]
            i += 1
        return None

    events = []
    seen = set()
    # Cada imagem de evento segue o padrão: {"original":"...","xs":"...","lg":"..."}
    for m in re.finditer(
        r'\{"original":"[^"]+","xs":"[^"]+","lg":"[^"]+"\}',
        flight
    ):
        start = m.start()
        # Sobe até 8 níveis de objeto pai para encontrar o evento completo
        for _ in range(1, 9):
            start = flight.rfind('{', 0, start)
            if start == -1:
                break
            raw = parse_balanced(flight, start)
            if raw is None:
                break
            try:
                obj = json.loads(raw)
                if isinstance(obj, dict) and 'name' in obj and 'url' in obj:
                    url = obj.get('url', '')
                    if url not in seen:
                        seen.add(url)
                        events.append(obj)
                    break
            except json.JSONDecodeError:
                pass
            if start == 0:
                break
            start -= 1

    return events
