import type { Metadata, Viewport } from "next";
import { notFound } from 'next/navigation';
import { Inter } from "next/font/google";
import { locales } from '@/i18n/config';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { NavbarProvider } from '@/components/layout/NavbarProvider';
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Casa Branca Consultoria Imobiliária",
  description: "Sistema de Gestão Imobiliária Completo",
  keywords: "imóveis, gestão, CRM, vendas, aluguel, consultoria imobiliária",
  authors: [{ name: "Casa Branca Consultoria" }],
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2563eb",
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  return (
    <ThemeProvider>
      <div className={`font-inter bg-background min-h-screen ${inter.variable}`}>
        <NavbarProvider>
          {children}
        </NavbarProvider>
      </div>
    </ThemeProvider>
  );
}
