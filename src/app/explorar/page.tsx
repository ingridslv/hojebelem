import { CategoryGrid } from "@/components/category-grid";
import { EventSection } from "@/components/section";
import { getCategories, getEvents } from "@/lib/data";

export default async function Explore() {
  const [categories, events] = await Promise.all([
    getCategories(),
    getEvents(),
  ]);
  return (
    <div className="shell page-space">
      <div className="page-intro">
        <p>DESCUBRA BELÉM</p>
        <h1>Qual é a sua vibe?</h1>
        <span>Explore a cidade por tudo que ela tem a oferecer.</span>
      </div>
      <section id="categorias" className="all-categories">
        <CategoryGrid categories={categories} />
      </section>
      <EventSection
        title="Em destaque"
        events={events.filter((event) => event.isFeatured)}
      />
      {["musica-ao-vivo", "gastronomia", "teatro"].map((slug) => {
        const category = categories.find((item) => item.slug === slug);
        const filtered = events.filter((event) => event.category.slug === slug);
        return (
          <EventSection
            key={slug}
            title={category?.name ?? slug}
            events={filtered.length ? filtered : events.slice(0, 3)}
          />
        );
      })}
    </div>
  );
}
