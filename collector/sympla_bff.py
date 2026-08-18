"""
APIs BFF da Sympla — endpoints HTTP publicos sem autenticacao.

A propria pagina de evento da Sympla chama estes endpoints para carregar
dados do organizador e tipos de ingresso. Sao acessiveis publicamente
com um HTTP GET simples.

URL base: https://event-page.svc.sympla.com.br/api/event-bff/purchase/event/{id}/
"""
import os
import requests

try:
    from shared import HEADERS, BFF_TIMEOUT  # modo script
except ImportError:
    from .shared import HEADERS, BFF_TIMEOUT  # modo pacote (pytest)

# URL base das APIs BFF (configuravel via env)
BFF_BASE = os.environ.get(
    "SYMPLA_BFF_BASE_URL",
    "https://event-page.svc.sympla.com.br/api/event-bff/purchase/event",
)


def _fetch_bff(event_id: int, path: str) -> dict:
    """Busca um endpoint BFF generico para um evento.

    Args:
        event_id: ID numerico do evento na Sympla (ex: 3483046)
        path: sufixo do endpoint (ex: "organizer", "tickets")

    Returns:
        dict com o JSON retornado pela API

    Raises:
        requests.RequestException: se a API falhar
    """
    url = f"{BFF_BASE}/{event_id}/{path}"
    resp = requests.get(url, headers=HEADERS, timeout=BFF_TIMEOUT)
    resp.raise_for_status()
    return resp.json()


def fetch_organizer(event_id: int) -> dict:
    """Busca dados do organizador de um evento.

    Returns:
        dict com: name, fantasyName, documentType, document
    """
    return _fetch_bff(event_id, "organizer")


def fetch_tickets(event_id: int) -> dict:
    """Busca tipos de ingresso e precos de um evento.

    Returns:
        dict com chave "tickets" — lista de ingressos, cada um com:
        name, salePriceMonetary, installments, availableQty, status, etc.
    """
    return _fetch_bff(event_id, "tickets")
