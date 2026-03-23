import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Controle de Ativos",
  description: "Sistema básico para controle de materiais, equipamentos/ferramentas e veículos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-dvh bg-zinc-50 text-zinc-950">
          <header className="border-b border-zinc-200 bg-white">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4">
              <div className="flex items-baseline gap-3">
                <span className="text-lg font-semibold tracking-tight">
                  Controle de Ativos
                </span>
                <span className="hidden text-sm text-zinc-600 sm:inline">
                  Materiais • Ferramentas • Veículos
                </span>
              </div>

              <nav className="flex flex-wrap items-center gap-2 text-sm">
                <Link
                  className="rounded-md px-3 py-2 hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                  href="/"
                >
                  Início
                </Link>
                <Link
                  className="rounded-md px-3 py-2 hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                  href="/estoque"
                >
                  Materiais
                </Link>
                <Link
                  className="rounded-md px-3 py-2 hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                  href="/ferramentas"
                >
                  Ferramentas
                </Link>
                <Link
                  className="rounded-md px-3 py-2 hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                  href="/veiculos"
                >
                  Veículos
                </Link>
              </nav>
            </div>
          </header>

          <main className="mx-auto w-full max-w-5xl px-4 py-8">{children}</main>

          <footer className="border-t border-zinc-200 bg-white">
            <div className="mx-auto w-full max-w-5xl px-4 py-4 text-sm text-zinc-600">
              UX básico: navegação clara, formulários simples, estados vazios.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
