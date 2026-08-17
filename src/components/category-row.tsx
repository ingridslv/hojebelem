import Link from "next/link";
export function CategoryRow({categories}:{categories:{id:string;name:string;slug:string;icon:string}[]}){return <div className="category-row">{categories.slice(0,12).map(c=><Link href={`/eventos?categoria=${c.slug}`} key={c.id} className="category-pill"><span>{c.icon}</span>{c.name}</Link>)}</div>}
