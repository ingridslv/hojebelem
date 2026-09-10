"""
Upsert de eventos no banco PostgreSQL do hojebelem.

Insere um novo evento ou atualiza se ja existir (dedupe por externalId).
Usa SQL raw com psycopg2 — nao depende do Prisma client no Python.

Nota: todo evento coletado de fontes externas TEM externalId (e o campo
usado para dedupe). Nao ha caminho de insercao sem externalId — se
externalId estiver ausente, o upsert falha cedo.
"""
import psycopg2
from psycopg2 import sql


def upsert_event(db_url: str, event: dict) -> bool:
    """Insere ou atualiza um evento no banco.

    Args:
        db_url: string de conexao PostgreSQL
        event: dict com os campos do schema Event. OBRIGATORIO: externalId
               (usado para dedupe). Demais: title, slug, source, startAt,
               venueName, address, externalPurchaseLink, coverImageUrl,
               price, description, isPublished, cityId, createdById.

    Returns:
        True se upsert bem-sucedido, False se falhou ou externalId ausente
    """
    if not event.get("externalId"):
        return False
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        cur.execute(
            sql.SQL("""
                INSERT INTO "Event" (id, title, slug, "externalId", source,
                       "startAt", "endAt", "venueName", address,
                       "externalPurchaseLink", "coverImageUrl", price,
                       description, "isPublished", "cityId", "createdById",
                       "createdAt", "updatedAt")
                VALUES (gen_random_uuid(), %(title)s, %(slug)s,
                        %(externalId)s, %(source)s,
                        %(startAt)s, %(endAt)s, %(venueName)s, %(address)s,
                        %(externalPurchaseLink)s, %(coverImageUrl)s,
                        %(price)s, %(description)s, %(isPublished)s,
                        %(cityId)s, %(createdById)s, NOW(), NOW())
                ON CONFLICT ("externalId") DO UPDATE SET
                    title = EXCLUDED.title,
                    slug = EXCLUDED.slug,
                    "startAt" = EXCLUDED."startAt",
                    "endAt" = EXCLUDED."endAt",
                    "venueName" = EXCLUDED."venueName",
                    address = EXCLUDED.address,
                    "externalPurchaseLink" = EXCLUDED."externalPurchaseLink",
                    "coverImageUrl" = EXCLUDED."coverImageUrl",
                    price = EXCLUDED.price,
                    description = EXCLUDED.description,
                    "updatedAt" = NOW()
            """),
            event,
        )
        conn.commit()
        cur.close()
        conn.close()
        return True
    except Exception:
        return False
