import { updateEventAction } from "@/app/actions";
import { AdminEventForm } from "@/components/admin-event-form";
import { prisma } from "@/lib/prisma";
import { formatInTimeZone } from "date-fns-tz";
import { notFound } from "next/navigation";

export default async function EditEvent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [event, categories] = await Promise.all([
    prisma.event.findUnique({ where: { id }, include: { categories: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!event) notFound();
  const action = updateEventAction.bind(null, event.id);
  return (
    <div className="admin-page shell page-space">
      <div className="page-intro">
        <p>EDITAR EVENTO</p>
        <h1>{event.title}</h1>
        <span>Atualize as informações e salve para publicar as mudanças.</span>
      </div>
      <AdminEventForm
        categories={categories}
        action={action}
        event={{
          slug: event.slug,
          title: event.title,
          description: event.description,
          categoryId: event.categories[0]?.categoryId ?? "",
          startAt: formatInTimeZone(
            event.startAt,
            "America/Belem",
            "yyyy-MM-dd'T'HH:mm",
          ),
          endAt: event.endAt
            ? formatInTimeZone(
                event.endAt,
                "America/Belem",
                "yyyy-MM-dd'T'HH:mm",
              )
            : "",
          venueName: event.venueName,
          address: event.address,
          coverImageUrl: event.coverImageUrl,
          externalPurchaseLink: event.externalPurchaseLink,
          socialLink: event.socialLink ?? "",
          price: event.price?.toString() ?? "",
          statusOverride: event.statusOverride,
          isPublished: event.isPublished,
          isFeatured: event.isFeatured,
        }}
      />
    </div>
  );
}
