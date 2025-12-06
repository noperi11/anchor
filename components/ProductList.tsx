// components/ProductList.tsx
import Link from "next/link";

export default function ProductList({ products, onDelete }: any) {
  
  // ** Definisi Custom Class untuk Neon Card Hover **
  // Ini akan memberikan efek glow pada card saat di-hover, berbeda dengan neon text.
  const neonCardHover = `
    transition-all duration-300 ease-in-out
    shadow-lg 
    hover:shadow-[0_0_10px_var(--color-accent-darker)]
    hover:scale-[1.01]
  `;
  
  return (
    <div className="space-y-4">
      {products.map((p: any) => (
        // 1. KILLER CARD: Gunakan .glass-effect dan Neon Hover
        <div
          key={p.id}
          // Hapus style inline karena akan digantikan oleh .glass-effect
          className={`
            p-5 rounded-xl flex items-center justify-between 
            glass-effect 
            ${neonCardHover}
            cursor-pointer
          `}
        >
          <div>
            {/* 2. Judul Produk: Tetap kuat dengan warna primary */}
            <h3 className="text-xl font-bold">{p.name}</h3>
            
            {/* Teks Sekunder/Muted: Gunakan warna sekunder */}
            <p 
              style={{ color: 'var(--color-text-secondary)' }} 
              className="text-sm font-light mt-1"
            >
              {p.category}
            </p>
            {/* Harga: Sedikit menonjol dengan font-semibold */}
            <p className="text-base mt-2 font-semibold">Rp {p.price}</p>
          </div>

          <div className="flex items-center gap-6">
            {/* 3. Link Edit: Menerapkan Neon Text Hover */}
            <Link
              href={`/products/${p.id}/edit`}
              style={{ color: 'var(--color-accent)' }} 
              // ** Menggunakan class custom NEON HOVER **
              className="neon-text-hover text-sm font-medium"
            >
              Edit
            </Link>

            {/* 4. Tombol Delete: Menerapkan Neon Text Hover (Warna Danger) */}
            <button
              style={{ color: 'var(--color-status-danger)' }}
              // ** Menggunakan class custom NEON HOVER **
              className="neon-text-hover text-sm font-medium"
              onClick={() => onDelete(p.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
