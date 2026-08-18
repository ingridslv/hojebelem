import { auth } from "@/auth";
import { ChevronRight, CircleHelp, Info, UserRound } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Profile() {
  const session = await auth();
  const user = session?.user?.id
    ? await prisma.user.findUnique({ where: { id: session.user.id } })
    : null;
  const name = user?.name ?? session?.user?.name ?? "Visitante";
  const avatarUrl = user?.avatarUrl ?? session?.user?.image;
  const initial = name.slice(0, 2).toUpperCase();
  const items = [
    { href: "/perfil/editar", label: "Editar perfil", icon: UserRound },
    {
      href: "/perguntas-frequentes",
      label: "Perguntas frequentes",
      icon: CircleHelp,
    },
    { href: "/sobre", label: "Sobre a plataforma", icon: Info },
  ];
  return (
    <div className="profile-page shell page-space">
      <div className="profile-head">
        <div
          className="avatar"
          style={
            avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : undefined
          }
        >
          {avatarUrl ? null : initial}
        </div>
        <h1>{session ? name : "Olá, visitante"}</h1>
        <p>
          {session?.user?.email ??
            "Entre para salvar eventos e personalizar seu perfil."}
        </p>
        {!session && (
          <Link className="gradient-button" href="/login">
            Entrar ou criar conta
          </Link>
        )}
      </div>
      <nav className="profile-menu" aria-label="Opções do perfil">
        {items.map(({ href, label, icon: Icon }) => (
          <Link href={href} key={href}>
            <Icon />
            <span>{label}</span>
            <ChevronRight />
          </Link>
        ))}
      </nav>
    </div>
  );
}
