"""
Testes para o normalizador de eventos da Sympla.

O normalizador converte o dict do payload (parser) + dados das APIs BFF
(organizer + tickets) em um dict pronto para upsert no schema Prisma.
"""
import pytest
try:
    from collector.normalizer import normalize_event
except ImportError:
    normalize_event = None

# Dados reais do spike (The Black Parade)
RAW = {
    "id": 3483046, "name": "The Black Parade | Belem/PA",
    "slug": "sympla-3483046",
    "url": "https://www.sympla.com.br/evento/the-black-parade-belem-pa/3483046",
    "start_date": "2026-08-23T01:00:00+00:00", "end_date": "2026-08-23T06:00:00+00:00",
    "start_date_formats": {"pt": "Sab, 22 Ago - 2026 · 22:00"},
    "images": {"original": "https://images.sympla.com.br/6a42b6266af4f.jpg",
               "lg": "https://images.sympla.com.br/6a42b6266af4f-lg.jpg",
               "xs": "https://images.sympla.com.br/6a42b6266af4f-xs.jpg"},
    "location": {"name": "Studio Pub", "address": "Rua Presidente Pernambuco",
                 "address_num": "277", "city": "Belem", "state": "PA",
                 "neighborhood": "Batista Campos", "zip_code": "66015-200",
                 "lat": -1.457417, "lon": -48.4924123, "country": "BRASIL"},
    "organizer": {"name": "THE BLACK PARADE", "id": "537222"},
    "event_type": "NORMAL", "duration_type": "single"
}
ORGANIZER = {"name": "40.404.300 JOAO ANTONIO SOARES FILHO",
             "fantasyName": "JOÃO ANTONIO SOARES FILHO",
             "documentType": "CNPJ", "document": "40.404.300/0001-50"}
TICKETS = {"tickets": [{"name": "Terceiro Lote", "salePriceMonetary": {"decimal": 38.99},
                         "installments": [{"installments": 1, "price": {"decimal": 38.99}}],
                         "salePriceWithDiscountMonetary": {"decimal": 38.99}}]}


@pytest.mark.skipif(normalize_event is None, reason="normalizer nao implementado")
def test_normalize_required_fields():
    """O resultado deve ter todos os campos obrigatorios do schema Event."""
    result = normalize_event(RAW, ORGANIZER, TICKETS)
    required = {"title", "slug", "externalId", "source", "startAt", "venueName",
                "address", "externalPurchaseLink"}
    # coverImageUrl e preenchido depois pelo image_downloader
    for key in required:
        assert key in result, f"campo {key} ausente"
        assert result[key], f"campo {key} vazio"


@pytest.mark.skipif(normalize_event is None, reason="normalizer nao implementado")
def test_normalize_removes_city_suffix():
    """O titulo deve remover '| Belem/PA' do final."""
    result = normalize_event(RAW, ORGANIZER, TICKETS)
    assert result["title"] == "The Black Parade"
    assert "|" not in result["title"]


@pytest.mark.skipif(normalize_event is None, reason="normalizer nao implementado")
def test_normalize_sets_source_sympla():
    """source deve ser 'sympla'."""
    result = normalize_event(RAW, ORGANIZER, TICKETS)
    assert result["source"] == "sympla"
    assert result["externalId"] == "3483046"
