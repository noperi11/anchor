// components/Header.tsx
import React from "react";


export default function Header() {
const appName = process.env.NEXT_PUBLIC_APP_NAME || "Supabase CRUD";
return (
<header 
  style={{ 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center",
    // 1. Warna Latar Belakang Header (Surface Color)
    backgroundColor: 'var(--color-bg-surface)', 
    // 2. Garis Bawah Pemisah (Subtle Border)
    borderBottom: '1px solid var(--color-border-subtle)',
    // 3. Tambahkan Padding Agar Tidak Terlalu Melekat
    padding: '1rem', // Contoh padding
  }}
>
  {/* Menggunakan warna teks utama */}
  <h1 style={{ margin: 0, color: 'var(--color-text-primary)' }}>{appName}</h1>
  {/* Menggunakan warna teks sekunder/muted untuk info tambahan */}
  <div style={{ color: 'var(--color-text-secondary)' }}>Prototype</div>
</header>
);
}
