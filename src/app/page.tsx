import Link from "next/link";
import { ArrowUpRight, MapPin, Sparkles } from "lucide-react";
import { SearchForm } from "@/components/search-form";
import { CategoryRow } from "@/components/category-row";
import { EventSection } from "@/components/section";
import { getCategories, getEvents } from "@/lib/data";
import { getEventStatus } from "@/lib/events";
import { HeroSlideshow } from "@/components/hero-slideshow";
import { InstagramHighlight } from "@/components/instagram-highlight";
import { SignupHighlight } from "@/components/signup-highlight";
import { GoogleAdSlot } from "@/components/google-ads";
export default async function Home() {
  const [events, categories] = await Promise.all([
    getEvents(),
    getCategories(),
  ]);
  const today = events.filter((e) => getEventStatus(e) === "É Hoje"),
    tomorrow = events.filter((e) => getEventStatus(e) === "É amanhã");
  return (
    <>
      <section className="hero">
        <HeroSlideshow />
        <div className="hero-overlay" />
        <div className="hero-floaters" aria-hidden="true">
          <span>🎵</span>
          <span>🪩</span>
          <span>🍹</span>
          <span>🎉</span>
        </div>
        <div className="hero-copy">
          <p className="location">
            <MapPin /> Belém, Pará
          </p>
          <span className="hero-kicker">
            <Sparkles /> Sua cidade acontece aqui
          </span>
          <h1>
            Descubra o que
            <br />
            acontece em <em>Belém.</em>
          </h1>
          <p>
            Shows, sabores, encontros e experiências para viver a cidade do seu
            jeito.
          </p>
          <SearchForm />
          <Link className="hero-link" href="/explorar">
            Explorar todos os eventos <ArrowUpRight />
          </Link>
        </div>
      </section>
      <div className="shell">
        <section className="categories-section">
          <div className="section-heading">
            <div>
              <p>ENCONTRE SEU ROLÊ</p>
              <h2>Explore por categoria</h2>
            </div>
            <Link href="/explorar">Ver todas →</Link>
          </div>
          <CategoryRow categories={categories} />
        </section>
        <EventSection
          eyebrow="ACONTECE AGORA"
          title="Hoje em Belém"
          events={today.length ? today : events.slice(0, 3)}
        />
        <EventSection
          eyebrow="PROGRAME-SE"
          title="Amanhã"
          events={tomorrow.length ? tomorrow : events.slice(1, 4)}
        />
        <GoogleAdSlot
          slot={process.env.NEXT_PUBLIC_ADSENSE_HOME_SLOT}
          className="ad-home"
        />
        <InstagramHighlight />
        <EventSection
          eyebrow="ESCOLHAS DA CURADORIA"
          title="Destaques da semana"
          events={events
            .filter((e) => e.isFeatured)
            .concat(events.filter((e) => !e.isFeatured))
            .slice(0, 4)}
        />
      </div>
      <SignupHighlight />
    </>
  );
}
