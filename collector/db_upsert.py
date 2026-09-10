"""
Upsert de eventos no banco PostgreSQL do hojebelem.

Insere um novo evento ou atualiza se ja existir (dedupe por externalId).
Tambem relaciona o evento com sua categoria em EventCategory.
"""
import psycopg2
from psycopg2 import sql


def upsert_event(db_url: str, event: dict) -> bool:
    """Insere/atualiza um evento e relaciona sua categoria."""

    if not event.get("externalId"):
        return False

    conn = None
    cur = None

    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()

        # 1. Insere ou atualiza o evento.
        cur.execute(
            sql.SQL("""
                INSERT INTO "Event" (
                    id, title, slug, "externalId", source,
                    "startAt", "endAt", "venueName", address,
                    "externalPurchaseLink", "coverImageUrl", price,
                    description, "isPublished", "cityId", "createdById",
                    "createdAt", "updatedAt"
                )
                VALUES (
                    gen_random_uuid(), %(title)s, %(slug)s,
                    %(externalId)s, %(source)s,
                    %(startAt)s, %(endAt)s, %(venueName)s, %(address)s,
                    %(externalPurchaseLink)s, %(coverImageUrl)s,
                    %(price)s, %(description)s, %(isPublished)s,
                    %(cityId)s, %(createdById)s, NOW(), NOW()
                )
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
                    "isPublished" = EXCLUDED."isPublished",
                    "updatedAt" = NOW()
                RETURNING id
            """),
            event,
        )

        event_id = cur.fetchone()[0]

        # 2. Busca a categoria pelo nome.
        category_name = event.get("categoryName")

        if category_name:
            cur.execute(
                """
                SELECT id
                FROM "Category"
                WHERE LOWER(name) = LOWER(%s)
                LIMIT 1
                """,
                (category_name,),
            )

            category_row = cur.fetchone()

            if category_row:
                category_id = category_row[0]

                # 3. Remove categorias anteriores deste evento.
                cur.execute(
                    """
                    DELETE FROM "EventCategory"
                    WHERE "eventId" = %s
                    """,
                    (event_id,),
                )

                # 4. Relaciona o evento com a nova categoria.
                cur.execute(
                    """
                    INSERT INTO "EventCategory" ("eventId", "categoryId")
                    VALUES (%s, %s)
                    ON CONFLICT ("eventId", "categoryId") DO NOTHING
                    """,
                    (event_id, category_id),
                )

        conn.commit()

        return True

    except Exception:
        if conn:
            conn.rollback()
        return False

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()