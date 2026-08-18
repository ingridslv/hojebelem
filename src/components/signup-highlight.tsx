import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarHeart, Sparkles } from "lucide-react";
import { auth } from "@/auth";

export async function SignupHighlight() {
  const session = await auth();
  const cta = session
    ? { href: "/eventos", label: "Explorar rolês" }
    : { href: "/cadastro", label: "Criar minha conta" };
  return (
    <section className="signup-highlight shell">
      <div className="signup-glow" aria-hidden="true" />
      <div className="signup-copy">
        <p>
          <Sparkles /> BELÉM TEM SEMPRE ALGO NOVO
        </p>
        <h2>Não deixe o próximo rolê passar.</h2>
        <span>
          Crie sua conta, salve seus eventos favoritos e tenha sempre uma boa
          ideia para viver a cidade.
        </span>
        <Link href={cta.href}>
          {cta.label} <ArrowUpRight />
        </Link>
      </div>
      <div className="signup-visual">
        <div className="signup-photo">
          <Image
            src="/images/hero-gastronomia.png"
            alt="Amigos vivendo uma experiência em Belém"
            fill
            sizes="420px"
          />
        </div>
        <div className="signup-event-card">
          <CalendarHeart />
          <div>
            <small>PRÓXIMO ROLÊ</small>
            <b>Belém espera por você</b>
          </div>
        </div>
        <div className="signup-floating-icons" aria-hidden="true">
          <span>🎉</span>
          <span>🍹</span>
          <span>♪</span>
        </div>
      </div>
    </section>
  );
}
