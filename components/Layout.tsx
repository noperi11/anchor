// components/Layout.tsx
import Link from "next/link";
import { ReactNode } from "react";

type Props = { children: ReactNode; showHeader?: boolean };

export default function Layout({ children, showHeader = true }: Props) {
  return (
    // Gunakan min-h-screen, biarkan warna diatur oleh body di globals.css
    <div className="min-h-screen"> 
      {showHeader && (
        <header 
          // 1. POSITIONING & EFFECT KILLER UI (Sticky + Glassmorphism)
          className="sticky top-0 z-50 p-4 border-b border-b-transparent transition-all duration-300 backdrop-blur-sm shadow-2xl" 
          
          // ** Menggunakan class custom CSS `.glass-effect` di globals.css **
          // Kita akan mengganti styling inline Anda dengan class custom tersebut.
        >
          {/* Tambahkan class glass-effect di sini */}
          <div className="glass-effect absolute inset-0 -z-10"></div>
          
          <nav className="max-w-5xl mx-auto flex items-center justify-between relative z-10">
            <div className="flex items-center gap-8">
              {/* BRANDING/LOGO - Gunakan warna aksen Neon */}
              <h1 
                className="text-xl font-bold uppercase" 
                style={{ color: 'var(--color-accent)' }}
              >
                Killer UI
              </h1>
              
              {/* Tautan Navigasi Utama: Menerapkan Neon Hover */}
              <Link 
                href="/dashboard" 
                // ** Menerapkan class custom NEON HOVER **
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

            {/* Tombol Logout: Tetap menggunakan warna Danger, namun dengan efek hover yang lebih tajam */}
            <Link
              href="/login"
              onClick={() => {
                if (typeof window !== "undefined") localStorage.removeItem("sb-token");
              }}
              style={{ color: 'var(--color-status-danger)' }}
              // ** Menggunakan class Neon Hover untuk kesan 'pencahayaan' pada teks **
              // Atau tetap hover opacity jika Anda ingin efek yang lebih lembut.
              className="neon-text-hover text-sm font-medium" 
            >
              Logout
            </Link>
          </nav>
        </header>
      )}

      {/* Konten Utama */}
      <main className="max-w-5xl mx-auto p-6">{children}</main>
    </div>
  );
}
