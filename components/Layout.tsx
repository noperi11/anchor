// components/Layout.tsx
import Link from "next/link";
import { ReactNode } from "react";
// 1. IMPORT FONT DARI NEXT/FONT/GOOGLE
import { Orbit } from 'next/font/google'

// Definisikan Font orbit
const orbit = Orbit({ 
  subsets: ['latin'],
  weight: '400', 
  variable: '--font-orbit', 
})

type Props = { children: ReactNode; showHeader?: boolean };

export default function Layout({ children, showHeader = true }: Props) {
  return (
    // Terapkan font class ke container utama
    <div className={`min-h-screen ${orbit.className}`}>
      {showHeader && (
        <header 
          
          className="sticky top-0 z-50 p-4 border-b border-b-transparent transition-all duration-300 shadow-2xl" 
        >
          {/* GLASSMORPHISM LAYER */}
          <div 
            className="glass-effect absolute inset-0 -z-10 border-b" 
            style={{
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
                ANCHOR
              </h1>
              
              {/* Tautan Navigasi Utama: Neon Hover */}
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

      <main className="max-w-5xl mx-auto p-6">{children}</main>
    </div>
  );
}
