import { EventCard } from "@/components/event-card";
import { SearchForm } from "@/components/search-form";
import { CategoryFilters } from "@/components/category-filters";
import { GoogleAdSlot } from "@/components/google-ads";
import { getCategories, getEvents } from "@/lib/data";
export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    categoria?: string;
    preco?: string;
    filtros?: string;
  }>;
}) {
  const p = await searchParams;
  const [events, categories] = await Promise.all([
    getEvents({ search: p.q, category: p.categoria, price: p.preco }),
    getCategories(),
  ]);
  return (
    <div className="shell page-space">
      <div className="page-intro">
        <p>AGENDA DA CIDADE</p>
        <h1>Eventos em Belém</h1>
        <span>Encontre o próximo lugar onde você quer estar.</span>
      </div>
      <SearchForm
        defaultValue={p.q}
        categories={categories}
        defaultCategory={p.categoria}
        defaultPrice={p.preco}
        filtersOpen={p.filtros === "1" || Boolean(p.preco)}
      />
      <CategoryFilters categories={categories} selected={p.categoria} />
      <div className="results-meta">
        <b>{events.length} eventos encontrados</b>
        <select aria-label="Ordenar eventos">
          <option>Mais próximos</option>
          <option>Menor preço</option>
        </select>
      </div>
      <GoogleAdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_LIST_SLOT} />
      {events.length ? (
        <div className="event-grid">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <b>Nenhum evento encontrado</b>
          <p>Tente outro termo ou remova um dos filtros.</p>
        </div>
      )}
    </div>
  );
}
