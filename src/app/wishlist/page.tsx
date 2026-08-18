import { EventSection } from "@/components/section";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Heart } from "lucide-react";

export default async function Wishlist() {
  const session = await auth();
  const saved = await prisma.wishlist.findMany({
    where: { userId: session!.user.id },
    include: {
      event: { include: { categories: { include: { category: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
  const events = saved.map(({ event }) => ({
    ...event,
    price: event.price ? Number(event.price) : null,
    category: event.categories[0]?.category ?? {
      name: "Evento",
      slug: "eventos",
      icon: "✦",
    },
  }));
  const categoryIds = [
    ...new Set(
      saved.flatMap(({ event }) =>
        event.categories.map(({ categoryId }) => categoryId),
      ),
    ),
  ];
  const recommendationsRaw = await prisma.event.findMany({
    where: {
      isPublished: true,
      id: { notIn: events.map((event) => event.id) },
      ...(categoryIds.length
        ? { categories: { some: { categoryId: { in: categoryIds } } } }
        : {}),
    },
    include: { categories: { include: { category: true } } },
    orderBy: { startAt: "asc" },
    take: 4,
  });
  const recommendations = recommendationsRaw.map((event) => ({
    ...event,
    price: event.price ? Number(event.price) : null,
    category: event.categories[0]?.category ?? {
      name: "Evento",
      slug: "eventos",
      icon: "✦",
    },
  }));
  return (
    <div className="shell page-space">
      <div className="page-intro">
        <p>GUARDADOS PARA DEPOIS</p>
        <h1>Seus favoritos</h1>
        <span>Todos os eventos que você quer viver em Belém.</span>
      </div>
      {events.length ? (
        <EventSection title="Eventos salvos" events={events} />
      ) : (
        <div className="empty-state">
          <Heart />
          <b>Sua wishlist está vazia</b>
          <p>Toque no coração de um evento para guardá-lo aqui.</p>
        </div>
      )}
      <EventSection
        eyebrow="COM BASE NOS SEUS FAVORITOS"
        title="Você também pode gostar"
        events={recommendations}
      />
    </div>
  );
}
