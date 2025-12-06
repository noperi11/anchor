// components/ProductList.tsx
import Link from "next/link";

export default function ProductList({ products, onDelete }: any) {
  return (
    <div className="space-y-4">
      {products.map((p: any) => (
        <div
          key={p.id}
          // Mengganti warna hardcoded dengan variabel CSS untuk Dark Mode
          style={{
            backgroundColor: 'var(--color-bg-surface)', 
            borderColor: 'var(--color-border-subtle)',
          }}
          className="border p-5 rounded-xl flex items-center justify-between"
        >
          <div>
            <h3 className="text-lg font-semibold">{p.name}</h3>
            {/* Mengganti text-grayText dengan variabel untuk teks sekunder/muted */}
            <p 
              style={{ color: 'var(--color-text-secondary)' }} 
              className="text-sm"
            >
              {p.category}
            </p>
            <p className="text-sm mt-1">Rp {p.price}</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Link Edit menggunakan warna Aksen */}
            <Link
              href={`/products/${p.id}/edit`}
              style={{ color: 'var(--color-accent)' }} 
              className="hover:opacity-80 transition"
            >
              Edit
            </Link>

            {/* Tombol Delete menggunakan warna Status Danger */}
            <button
              style={{ color: 'var(--color-status-danger)' }}
              className="hover:opacity-80 transition"
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
