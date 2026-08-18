import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { Footer } from "@/components/footer";
import { CustomCursor } from "@/components/custom-cursor";
import { AdSenseScript } from "@/components/google-ads";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Hoje Belém — eventos em Belém",
    template: "%s | Hoje Belém",
  },
  description:
    "Descubra shows, cultura, gastronomia e experiências em Belém do Pará.",
  openGraph: { locale: "pt_BR", type: "website", siteName: "Hoje Belém" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={manrope.variable}>
      <body>
        <AdSenseScript />
        <CustomCursor />
        <Header />
        <main>{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
