import Link from "next/link";

export function CategoryGrid({
  categories,
}: {
  categories: { id: string; name: string; slug: string; icon: string }[];
}) {
  return (
    <div className="category-grid">
      {categories.map((category) => (
        <Link
          href={`/eventos?categoria=${category.slug}`}
          key={category.id}
          className="category-grid-item"
        >
          <span>{category.icon}</span>
          <b>{category.name}</b>
        </Link>
      ))}
    </div>
  );
}
