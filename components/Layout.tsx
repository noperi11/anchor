// components/Layout.tsx
import Link from "next/link";
import { ReactNode } from "react";
// 1. IMPORT FONT DARI NEXT/FONT/GOOGLE
import { Electrolize } from 'next/font/google'

// Definisikan Font Electrolize
const electrolize = Electrolize({ 
  subsets: ['latin'],
  weight: '400', 
  variable: '--font-electrolize', 
})


type Props = { children: ReactNode; showHeader?: boolean };

export default function Layout({ children, showHeader = true }: Props) {
  return (
    // 2. TERAPKAN FONT VARIABLE & FONT CLASS
    <div className={`min-h-screen ${electrolize.className}`}>
      {showHeader && (
        <header 
          // 3. KILLER HEADER: Sticky & Shadow
          className="sticky top-0 z-50 p-4 border-b border-b-transparent transition-all duration-300 shadow-2xl" 
        >
          {/* GLASSMORPHISM LAYER */}
          <div 
            className="glass-effect absolute inset-0 -z-10 border-b" 
            style={{
              // Border bottom pada layer kaca
              borderBottomColor: 'var(--color-border-subtle)', 
            }}
          ></div>
          
          <nav className="max-w-5xl mx-auto flex items-center justify-between relative z-10">
            <div className="flex items-center gap-8">
              {/* BRANDING/LOGO - Neon Accent */}
              <h1 
                className="text-xl font-bold uppercase" 
                style={{ color: 'var(--color-accent)' }}
              >
                Killer UI
              </h1>
              
              {/* Tautan Navigasi Utama: Menerapkan Neon Hover */}
              <Link 
                href="/dashboard" 
                className="neon-text-hover text-sm font-medium" 
              >
                Dashboard
              </Link>
              <Link 
                href="/products" 
                className="neon-text-hover text-sm font-medium"
              >
                Products
              </Link>
            </div>

            {/* Tombol Logout: Neon Hover Danger */}
            <Link
              href="/login"
              onClick={() => {
                if (typeof window !== "undefined") localStorage.removeItem("sb-token");
              }}
              style={{ color: 'var(--color-status-danger)' }}
              className="neon-text-hover text-sm font-medium" 
            >
              Logout
            </Link>
          </nav>
        </header>
      )}

      {/* Konten utama kini full width untuk mendukung lebar tabel yang penuh (jika tidak dibatasi di main) */}
      {/* Jika Anda ingin konten tetap di tengah, gunakan max-w-5xl di sini: */}
      <main className="max-w-5xl mx-auto p-6">{children}</main>
    </div>
  );
}
