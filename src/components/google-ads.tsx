"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export function AdSenseScript() {
  if (!clientId) return null;
  return (
    <Script
      id="google-adsense"
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
    />
  );
}

export function GoogleAdSlot({
  slot,
  format = "auto",
  className = "",
}: {
  slot?: string;
  format?: "auto" | "fluid" | "rectangle";
  className?: string;
}) {
  useEffect(() => {
    if (!clientId || !slot) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* O script tentará preencher a unidade novamente ao carregar. */
    }
  }, [slot]);
  if (!clientId || !slot) return null;
  return (
    <aside className={`ad-placement ${className}`} aria-label="Publicidade">
      <span>Publicidade</span>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
