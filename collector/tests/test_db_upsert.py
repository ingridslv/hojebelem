"""
Testes para o upsert de eventos no Postgres.
"""
import os, pytest
try:
    from collector.db_upsert import upsert_event
except ImportError:
    upsert_event = None

DB_URL = os.environ.get("DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/hojebelem")

EVENT = {
    "title": "Test Event", "slug": "test-event-999",
    "externalId": "test-999", "source": "sympla",
    "startAt": "2026-12-01T20:00:00+00:00", "venueName": "Test Venue",
    "address": "Rua Teste 123", "externalPurchaseLink": "https://sympla.com.br/test",
    "coverImageUrl": "/uploads/test.jpg", "description": "Test description",
    "cityId": "cmsy3kuy30000ob55w5dibt8t", "createdById": "cmsy3kvcb0001ob5530um4zg8", "isPublished": True,
    "endAt": None, "latitude": None, "longitude": None, "price": None
}

@pytest.mark.skipif(upsert_event is None, reason="upsert nao implementado")
def test_upsert_new_event():
    result = upsert_event(DB_URL, EVENT)
    assert result is True

@pytest.mark.skipif(upsert_event is None, reason="upsert nao implementado")
def test_upsert_duplicate():
    """Mesmo externalId deve fazer update, nao inserir duplicata."""
    result = upsert_event(DB_URL, EVENT)
    assert result is True  # update bem-sucedido
