import Image from "next/image";
import { Camera, MapPin } from "lucide-react";

const posts = [
  { src: "/images/hero-musica.png", alt: "Show em Belém" },
  {
    src: "/images/hero-gastronomia.png",
    alt: "Experiência gastronômica em Belém",
  },
  { src: "/images/hero-belem.png", alt: "Evento cultural em Belém" },
];

export function InstagramHighlight() {
  return (
    <section className="instagram-highlight">
      <div className="instagram-decoration" aria-hidden="true">
        <span>✦</span>
        <span>♪</span>
        <span>🪩</span>
        <span>✦</span>
      </div>
      <div className="instagram-copy">
        <p>
          <Camera /> SIGA A GENTE
        </p>
        <h2>Belém acontece no Instagram também.</h2>
        <span>
          Descubra eventos, rolês, novidades e experiências que estão
          acontecendo pela cidade.
        </span>
        <a
          href="https://www.instagram.com/hojebelem/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Seguir no Instagram <b>→</b>
        </a>
      </div>
      <div
        className="instagram-visual"
        aria-label="Prévia do perfil da Hoje Belém no Instagram"
      >
        <div className="social-float camera-float">
          <Camera />
        </div>
        <div className="social-float music-float">♫</div>
        <div className="instagram-phone">
          <div className="phone-speaker" />
          <div className="instagram-profile-head">
            <div className="mini-avatar">HB</div>
            <div>
              <b>hojebelem</b>
              <span>
                <MapPin /> Belém, Pará
              </span>
            </div>
            <button type="button" tabIndex={-1}>
              Seguir
            </button>
          </div>
          <div className="instagram-stats">
            <span>
              <b>248</b> posts
            </span>
            <span>
              <b>12,8 mil</b> seguidores
            </span>
            <span>
              <b>Belém</b> acontece aqui
            </span>
          </div>
          <div className="instagram-posts">
            {posts.map((post) => (
              <div key={post.src}>
                <Image src={post.src} alt={post.alt} fill sizes="140px" />
              </div>
            ))}
          </div>
        </div>
        <div className="mini-post">
          <Image
            src="/images/hero-musica.png"
            alt="Registro de música ao vivo"
            fill
            sizes="170px"
          />
          <span>É hoje ✦</span>
        </div>
      </div>
    </section>
  );
}
