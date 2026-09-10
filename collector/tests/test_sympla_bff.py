"""
Testes para as APIs BFF da Sympla.

As APIs BFF (Backend-For-Frontend) são endpoints HTTP públicos que a própria
página da Sympla chama internamente. Elas retornam JSON sem autenticação:

  - /organizer: dados do organizador (nome, CNPJ)
  - /tickets: tipos de ingresso, preços, parcelas, disponibilidade

URL base: https://event-page.svc.sympla.com.br/api/event-bff/purchase/event/{id}/
"""
import pytest

try:
    from collector.sympla_bff import fetch_organizer, fetch_tickets
except ImportError:
    fetch_organizer = None
    fetch_tickets = None

# ID real de evento de Belem (The Black Parade) — validado no spike
EVENT_ID = 3483046


@pytest.mark.skipif(fetch_organizer is None, reason="fetch_organizer nao implementado")
def test_fetch_organizer_real():
    """Deve retornar dados do organizador para um evento real."""
    org = fetch_organizer(EVENT_ID)
    assert isinstance(org, dict)
    assert "name" in org
    assert "fantasyName" in org
    assert len(org["name"]) > 0


@pytest.mark.skipif(fetch_tickets is None, reason="fetch_tickets nao implementado")
def test_fetch_tickets_real():
    """Deve retornar lista de ingressos com preco para um evento real."""
    data = fetch_tickets(EVENT_ID)
    assert isinstance(data, dict)
    assert "tickets" in data
    tickets = data["tickets"]
    assert len(tickets) >= 1
    assert "salePriceMonetary" in tickets[0]
    assert tickets[0]["salePriceMonetary"]["decimal"] > 0
