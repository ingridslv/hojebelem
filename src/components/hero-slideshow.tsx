"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  {
    src: "/images/hero-belem.png",
    alt: "Evento cultural à beira-rio em Belém",
  },
  { src: "/images/hero-musica.png", alt: "Show de música ao vivo em Belém" },
  {
    src: "/images/hero-gastronomia.png",
    alt: "Festival de gastronomia ao pôr do sol em Belém",
  },
];

export function HeroSlideshow() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % slides.length),
      5500,
    );
    return () => window.clearInterval(timer);
  }, []);
  return (
    <>
      <div className="hero-slides" aria-live="polite">
        {slides.map((slide, index) => (
          <Image
            key={slide.src}
            className={index === active ? "hero-slide active" : "hero-slide"}
            src={slide.src}
            alt={index === active ? slide.alt : ""}
            fill
            preload={index === 0}
            sizes="100vw"
          />
        ))}
      </div>
      <div className="hero-dots" aria-label="Selecionar imagem do banner">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            className={index === active ? "active" : ""}
            onClick={() => setActive(index)}
            aria-label={`Mostrar imagem ${index + 1}`}
            aria-current={index === active ? "true" : undefined}
          />
        ))}
      </div>
    </>
  );
}
