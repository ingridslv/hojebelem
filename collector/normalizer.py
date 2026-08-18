"""
Normalizador de eventos da Sympla para o schema Prisma do hojebelem.

Converte o dict do parser (payload Flight) + dados das APIs BFF (organizer
+ tickets) em um dict pronto para upsert no banco.
"""
import re
from datetime import datetime


def _clean_title(title: str) -> str:
    """Remove sufixo de cidade/estado do titulo (ex: '| Belem/PA')."""
    return title.split(" | ")[0].strip()


def _parse_price(tickets: dict) -> float:
    """Extrai o menor preco disponivel dos ingressos."""
    items = tickets.get("tickets", [])
    if not items:
        return 0.0
    # pega o menor preco com desconto ou preco normal
    prices = []
    for t in items:
        price = t.get("salePriceWithDiscountMonetary", {}) or t.get("salePriceMonetary", {})
        if price and price.get("decimal"):
            prices.append(float(price["decimal"]))
    return min(prices) if prices else 0.0


def normalize_event(raw: dict, organizer: dict, tickets: dict) -> dict:
    """Converte dados brutos da Sympla para o schema Event do Prisma.

    Args:
        raw: dict do parser Flight (campos: id, name, slug, url, start_date,
             end_date, images, location, etc.)
        organizer: dict da API BFF /organizer (fantasyName, name, document)
        tickets: dict da API BFF /tickets (lista de ingressos com preco)

    Returns:
        dict com campos: title, slug, externalId, source, startAt, endAt,
        venueName, address, latitude, longitude, externalPurchaseLink,
        coverImageUrl, price, description, organizerName, isPublished
    """
    loc = raw.get("location", {}) or {}
    imgs = raw.get("images", {}) or {}
    org_name = organizer.get("fantasyName") or organizer.get("name", "")

    return {
        "title": _clean_title(raw.get("name", "")),
        "slug": f"sympla-{raw.get('id', '')}",  # sympla-<id> p/ evitar colisao com slugs do seed
        "externalId": str(raw.get('id', '')),
        "source": "sympla",
        "startAt": raw.get("start_date"),
        "endAt": raw.get("end_date"),
        "venueName": loc.get("name", ""),
        "address": f"{loc.get('address', '')}, {loc.get('address_num', '')}"
                   f" - {loc.get('neighborhood', '')}".strip(", -"),
        "latitude": loc.get("lat"),
        "longitude": loc.get("lon"),
        "externalPurchaseLink": raw.get("url", ""),
        "coverImageUrl": imgs.get("original", ""),  # URL externa da Sympla (evita rebuild do Next)
        "price": _parse_price(tickets),
        "description": f"Organizado por {org_name}".strip(),
        "organizerName": org_name,
        "isPublished": True,
    }
