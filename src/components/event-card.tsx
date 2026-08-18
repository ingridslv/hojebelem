import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { formatEventDate, getEventStatus } from "@/lib/events";
import { FavoriteButton } from "@/components/favorite-button";
export type CardEvent = {
  id: string;
  slug: string;
  title: string;
  coverImageUrl: string;
  startAt: Date;
  endAt?: Date | null;
  venueName: string;
  price: number | null;
  statusOverride?: "CANCELLED" | "POSTPONED" | null;
  category: { name: string; slug: string; icon: string };
};
export function EventCard({ event }: { event: CardEvent }) {
  const status = getEventStatus(event),
    ended = status === "Já encerrou";
  return (
    <article className={`event-card${ended ? " event-card-ended" : ""}`}>
      <div className="event-image">
        <Link href={`/eventos/${event.slug}`} className="event-image-link">
          <Image
            src={event.coverImageUrl}
            alt={`Capa do evento ${event.title}`}
            fill
            sizes="(max-width: 768px) 82vw, 360px"
            style={
              ended
                ? { filter: "blur(4px)", transform: "scale(1.06)" }
                : undefined
            }
          />
          {ended && (
            <span className="ended-image-shade">
              <b>ENCERRADO</b>
            </span>
          )}
          <span className="category-badge">
            {event.category.icon} {event.category.name}
          </span>
        </Link>
        <FavoriteButton eventId={event.id} />
      </div>
      <div className="event-body">
        <div className="event-status">
          <CalendarDays /> {formatEventDate(event.startAt)} <span>•</span>{" "}
          <b className={ended ? "ended-status-text" : undefined}>{status}</b>
        </div>
        <h3>
          <Link href={`/eventos/${event.slug}`}>{event.title}</Link>
        </h3>
        <p>
          <MapPin /> {event.venueName}
        </p>
        <div className="event-price">
          {event.price == null ? (
            <strong>Gratuito</strong>
          ) : (
            <>
              <small>a partir de</small>
              <strong>R$ {event.price.toFixed(2).replace(".", ",")}</strong>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
