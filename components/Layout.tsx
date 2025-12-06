// components/Layout.tsx
import Link from "next/link";
import { ReactNode } from "react";

type Props = { children: ReactNode; showHeader?: boolean };

export default function Layout({ children, showHeader = true }: Props) {
  return (
    // Gunakan min-h-screen, tetapi biarkan warna diatur oleh body di globals.css
    <div className="min-h-screen"> 
      {showHeader && (
        <header 
          // Mengganti border-neutral-800 dan bg-[#111] dengan Custom Style
          style={{
            backgroundColor: 'var(--color-bg-surface)', // Latar belakang Header dari variabel
            borderBottomColor: 'var(--color-border-subtle)', // Border lembut
          }}
          className="border-b p-4"
        >
          <nav className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Tautan Navigasi Utama */}
              <Link 
                href="/dashboard" 
                className="hover:text-gray-400 transition" // Gunakan Tailwind utility umum untuk hover
              >
                Dashboard
              </Link>
              <Link 
                href="/products" 
                className="hover:text-gray-400 transition"
              >
                Products
              </Link>
            </div>

            {/* Tombol Logout menggunakan warna status Danger (Merah Lembut) */}
            <Link
              href="/login"
              onClick={() => {
                if (typeof window !== "undefined") localStorage.removeItem("sb-token");
              }}
              // Mengganti text-red-400 dengan variabel status danger
              style={{ color: 'var(--color-status-danger)' }}
              className="hover:opacity-80 transition"
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
