"""
Testes para o parser de eventos da Sympla.

O parser extrai eventos do HTML da página de listagem decodificando
o payload Flight (Next.js). Os dados vêm como JSON escapado e precisam
ser balanceados para extrair cada objeto de evento completo.
"""
import os
import pytest

# ── Importa o parser quando ele existir ──
try:
    from collector.sympla_parser import parse_sympla_list
except ImportError:
    parse_sympla_list = None  # RED — ainda não existe

FIXTURE = os.path.join(os.path.dirname(__file__), "fixtures", "sympla_belem_p1.html")


@pytest.mark.skipif(parse_sympla_list is None, reason="parser ainda nao implementado")
def test_parse_extracts_12_events():
    """RED: o parser deve extrair pelo menos 12 eventos da pagina de Belem."""
    with open(FIXTURE, encoding="utf-8", errors="replace") as f:
        html = f.read()
    events = parse_sympla_list(html)
    assert len(events) >= 12, f"esperado >=12, obtido {len(events)}"


@pytest.mark.skipif(parse_sympla_list is None, reason="parser ainda nao implementado")
def test_each_event_has_required_keys():
    """Cada evento deve ter os campos minimos para normalizacao."""
    with open(FIXTURE, encoding="utf-8", errors="replace") as f:
        html = f.read()
    events = parse_sympla_list(html)
    required = {"id", "name", "url", "start_date", "start_date_formats",
                 "images", "location", "organizer"}
    for ev in events:
        missing = required - set(ev.keys())
        assert not missing, f"evento {ev.get('name','?')} sem campos: {missing}"


@pytest.mark.skipif(parse_sympla_list is None, reason="parser ainda nao implementado")
def test_events_have_unique_ids():
    """IDs de evento nao devem se repetir (dedupe interno do parser)."""
    with open(FIXTURE, encoding="utf-8", errors="replace") as f:
        html = f.read()
    events = parse_sympla_list(html)
    ids = [e["id"] for e in events]
    assert len(ids) == len(set(ids)), f"IDs duplicados: {len(ids)} unicos de {len(set(ids))}"
