"use client";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
type CategoryOption = { id: string; name: string; slug: string; icon: string };
export function SearchForm({
  defaultValue = "",
  categories = [],
  defaultCategory = "",
  defaultPrice = "",
  filtersOpen = false,
}: {
  defaultValue?: string;
  categories?: CategoryOption[];
  defaultCategory?: string;
  defaultPrice?: string;
  filtersOpen?: boolean;
}) {
  const [open, setOpen] = useState(filtersOpen);
  const router = useRouter();
  function toggleFilters() {
    if (!categories.length) {
      router.push("/eventos?filtros=1");
      return;
    }
    setOpen((current) => !current);
  }
  return (
    <form
      action="/eventos"
      className={`search-form${open ? " search-form-open" : ""}`}
    >
      <div className="search-main">
        <Search />
        <input
          name="q"
          defaultValue={defaultValue}
          aria-label="Pesquisar eventos"
          placeholder="Busque eventos, lugares ou categorias"
        />
        <button type="submit" aria-label="Pesquisar">
          Buscar
        </button>
        <button
          type="button"
          className="filter-button"
          aria-label="Filtros avançados"
          aria-expanded={open}
          onClick={toggleFilters}
        >
          <SlidersHorizontal />
        </button>
      </div>
      {open && categories.length > 0 && (
        <div className="advanced-filters">
          <label>
            Categoria
            <select name="categoria" defaultValue={defaultCategory}>
              <option value="">Todas as categorias</option>
              {categories.map((category) => (
                <option value={category.slug} key={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Preço
            <select name="preco" defaultValue={defaultPrice}>
              <option value="">Qualquer preço</option>
              <option value="gratuito">Gratuitos</option>
              <option value="pago">Pagos</option>
            </select>
          </label>
          <button type="submit">Aplicar filtros</button>
        </div>
      )}
    </form>
  );
}
