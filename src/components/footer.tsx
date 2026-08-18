import { Camera, MapPin } from "lucide-react";
import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-confetti" aria-hidden="true">
        <span>🎵</span>
        <span>🍹</span>
        <span>🪩</span>
        <span>🎉</span>
        <span>🍻</span>
      </div>
      <div className="shell footer-main">
        <div className="footer-brand">
          <Logo />
          <p>
            Seu guia para descobrir shows, sabores, encontros e experiências em
            Belém.
          </p>
          <span>
            <MapPin /> Belém, Pará
          </span>
        </div>
        <nav aria-label="Links do rodapé">
          <b>Explore</b>
          <Link href="/eventos">Eventos</Link>
          <Link href="/explorar">Categorias</Link>
          <Link href="/wishlist">Favoritos</Link>
        </nav>
        <nav aria-label="Informações">
          <b>Informações</b>
          <Link href="/perguntas-frequentes">Perguntas frequentes</Link>
          <Link href="/sobre">Termos e condições</Link>
        </nav>
        <div className="footer-social">
          <b>Siga a Hoje Belém</b>
          <a
            href="https://www.instagram.com/hojebelem/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram da Hoje Belém"
          >
            <Camera />
            <span>@hojebelem</span>
          </a>
        </div>
      </div>
      <div className="footer-bottom shell">
        <span>© {new Date().getFullYear()} Hoje Belém</span>
        <span>Feito com ritmo, afeto e açaí 💜</span>
      </div>
    </footer>
  );
}
