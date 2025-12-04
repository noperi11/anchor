// components/Layout.tsx
import Link from "next/link";
import { ReactNode } from "react";

type Props = { children: ReactNode; showHeader?: boolean };

export default function Layout({ children, showHeader = true }: Props) {
  return (
    <div className="min-h-screen bg-dark text-light">
      {showHeader && (
        <header className="border-b border-neutral-800 bg-[#111] p-4">
          <nav className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="hover:text-grayText transition">
                Dashboard
              </Link>
              <Link href="/products" className="hover:text-grayText transition">
                Products
              </Link>
            </div>

            <Link
              href="/login"
              onClick={() => {
                if (typeof window !== "undefined") localStorage.removeItem("sb-token");
              }}
              className="text-red-400 hover:text-red-300"
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
