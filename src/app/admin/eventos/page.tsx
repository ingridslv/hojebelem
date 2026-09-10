import { toggleEventPublishedAction } from "@/app/actions";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminEvents() {
  const events = await prisma.event.findMany({
    include: { categories: { include: { category: true } } },
    orderBy: { updatedAt: "desc" },
  });
  return (
    <div className="admin-page shell page-space">
      <div className="admin-heading">
        <div>
          <p>CONTEÚDO</p>
          <h1>Eventos</h1>
          <span>{events.length} eventos cadastrados</span>
        </div>
        <Link className="gradient-button" href="/admin/eventos/novo">
          <Plus /> Novo evento
        </Link>
      </div>
      <div className="admin-list">
        {events.map((event) => {
          const toggle = toggleEventPublishedAction.bind(null, event.id);
          return (
            <article key={event.id}>
              <span>{event.categories[0]?.category.icon ?? "✦"}</span>
              <div>
                <b>{event.title}</b>
                <small>
                  {event.venueName} •{" "}
                  {event.isPublished ? "Publicado" : "Rascunho"}
                </small>
              </div>
              <div className="admin-row-actions">
                <form action={toggle}>
                  <button type="submit">
                    {event.isPublished ? "Despublicar" : "Publicar"}
                  </button>
                </form>
                <Link href={`/admin/eventos/${event.id}/editar`}>Editar</Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
