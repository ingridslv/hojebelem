import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  ExternalLink,
  MapPin,
} from "lucide-react";
import { getEvent } from "@/lib/data";
import {
  formatEventDate,
  formatEventTime,
  getEventStatus,
  isEventEnded,
} from "@/lib/events";
import { ShareButton } from "@/components/share-button";
import { FavoriteButton } from "@/components/favorite-button";
import { GoogleAdSlot } from "@/components/google-ads";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const e = await getEvent((await params).slug);
  if (!e) return { title: "Evento não encontrado" };
  return {
    title: e.title,
    description: e.description.slice(0, 150),
    alternates: { canonical: `/eventos/${e.slug}` },
    openGraph: {
      title: e.title,
      description: e.description.slice(0, 150),
      images: [e.coverImageUrl],
    },
  };
}

export default async function EventDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const e = await getEvent((await params).slug);
  if (!e) notFound();
  const ended = isEventEnded(e);
  return (
    <div className={`detail-page${ended ? " detail-page-ended" : ""}`}>
      <div className="detail-cover">
        <Image
          src={e.coverImageUrl}
          alt={`Capa de ${e.title}`}
          fill
          preload
          sizes="100vw"
          style={
            ended
              ? { filter: "blur(6px)", transform: "scale(1.04)" }
              : undefined
          }
        />
        <div className="detail-shade" />
        {ended && <div className="detail-ended-badge">ENCERRADO</div>}
        <div className="detail-actions shell">
          <Link href="/eventos" className="circle-action" aria-label="Voltar">
            <ArrowLeft />
          </Link>
          <div>
            <ShareButton />
            <FavoriteButton eventId={e.id} className="circle-action" />
          </div>
        </div>
        <div className="detail-title shell">
          <span className="category-badge">
            {e.category.icon} {e.category.name}
          </span>
          <h1>{e.title}</h1>
          <p>
            <MapPin /> {e.venueName}, Belém
          </p>
        </div>
      </div>
      <div className="detail-layout shell">
        <article className="detail-content">
          <div className="detail-facts">
            <div>
              <CalendarDays />
              <span>
                <small>DATA</small>
                <b>
                  {formatEventDate(e.startAt)} • {getEventStatus(e)}
                </b>
              </span>
            </div>
            <div>
              <Clock3 />
              <span>
                <small>HORÁRIO</small>
                <b>{formatEventTime(e.startAt)}</b>
              </span>
            </div>
            <div>
              <MapPin />
              <span>
                <small>LOCAL</small>
                <b>{e.venueName}</b>
              </span>
            </div>
          </div>
          <section>
            <p className="eyebrow">SOBRE O EVENTO</p>
            <h2>Uma experiência para viver Belém</h2>
            <p className="description">{e.description}</p>
          </section>
          <GoogleAdSlot
            slot={process.env.NEXT_PUBLIC_ADSENSE_DETAIL_SLOT}
            format="rectangle"
          />
          <section>
            <p className="eyebrow">ONDE VAI SER</p>
            <h2>{e.venueName}</h2>
            <p>{e.address}</p>
          </section>
        </article>
        <aside className={`booking-card${ended ? " booking-card-ended" : ""}`}>
          <p>Ingresso</p>
          <div>
            {e.price == null ? (
              <strong>Gratuito</strong>
            ) : (
              <>
                <small>a partir de</small>
                <strong>R$ {e.price.toFixed(2).replace(".", ",")}</strong>
              </>
            )}
          </div>
          {ended ? (
            <button className="ended-booking-button" type="button" disabled>
              Evento encerrado
            </button>
          ) : (
            <a
              className="gradient-button"
              href={e.externalPurchaseLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Reservar agora <ExternalLink />
            </a>
          )}
          {!ended && e.socialLink && (
            <a
              className="secondary-button"
              href={e.socialLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver evento
            </a>
          )}
          <small>
            {ended
              ? "A venda de ingressos não está mais disponível."
              : "Você será direcionado para a plataforma do organizador."}
          </small>
        </aside>
      </div>
      <div className={`mobile-book${ended ? " mobile-book-ended" : ""}`}>
        <div>
          <small>Ingresso</small>
          <b>
            {ended
              ? "Encerrado"
              : e.price == null
                ? "Gratuito"
                : `R$ ${e.price.toFixed(2).replace(".", ",")}`}
          </b>
        </div>
        {ended ? (
          <button type="button" disabled>
            Evento encerrado
          </button>
        ) : (
          <a
            href={e.externalPurchaseLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Reservar agora
          </a>
        )}
      </div>
    </div>
  );
}
