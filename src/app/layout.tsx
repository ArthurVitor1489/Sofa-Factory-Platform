import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import CookieBanner from "@/components/shared/CookieBanner";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Estofados Arte & Conforto | Fábrica de Sofás e Móveis Premium",
  description: "Fábrica premium de móveis sob medida, sofás retráteis de luxo, poltronas decorativas e projetos corporativos de alto padrão. Solicite um orçamento.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Estofados Arte & Conforto | Fábrica de Móveis Premium",
    description: "Sofás sob medida, poltronas de luxo e projetos de interiores residenciais e comerciais de alta qualidade.",
    images: [{ url: "/images/hero_banner.png", width: 1200, height: 630, alt: "Estofados Arte & Conforto" }],
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${outfit.variable} ${playfair.variable} h-full antialiasedScroll`}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-accent selection:text-accent-foreground">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}


