import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function CategoryFilters({
  categories,
  selected,
}: {
  categories: { id: string; name: string; slug: string; icon: string }[];
  selected?: string;
}) {
  return (
    <div className="category-filter-area">
      <div className="filter-scroll">
        <Link href="/eventos" className={!selected ? "selected" : ""}>
          Todos
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/eventos?categoria=${category.slug}`}
            className={selected === category.slug ? "selected" : ""}
          >
            {category.icon} {category.name}
          </Link>
        ))}
      </div>
      <Link className="categories-toggle" href="/explorar#categorias">
        <ChevronRight /> Ver todas as categorias
      </Link>
    </div>
  );
}
