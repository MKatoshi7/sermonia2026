import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

import { Merriweather } from "next/font/google";
import { ClientProviders } from "@/components/providers/ClientProviders";
const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-merriweather',
});

export const metadata: Metadata = {
  title: "Sermonia - Assistente Pastoral",
  description: "Sua ferramenta de criação de sermões.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${outfit.variable} ${merriweather.variable} antialiased bg-[#F8FAFC] text-slate-800`}
      >
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
