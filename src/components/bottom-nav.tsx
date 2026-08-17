"use client"; import Link from "next/link"; import { Compass, Heart, House, UserRound } from "lucide-react"; import { usePathname } from "next/navigation";
const links=[["/","Início",House],["/explorar","Explorar",Compass],["/wishlist","Favoritos",Heart],["/perfil","Perfil",UserRound]] as const;
export function BottomNav(){const p=usePathname();return <nav className="bottom-nav" aria-label="Navegação mobile">{links.map(([href,label,Icon])=><Link key={href} href={href} className={p===href?"active":""}><Icon/><span>{label}</span></Link>)}</nav>}
