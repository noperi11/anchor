export default function ProductList({ products, onDelete }: any) {
  
  // ** Definisi Custom Class untuk Neon Card Hover **
  // Class ini dipertahankan, tetapi efeknya hanya akan berlaku pada div card, bukan pada link/button.
  const neonCardHover = `
    transition-all duration-300 ease-in-out
    shadow-lg 
    hover:shadow-[0_0_10px_var(--color-accent-darker)]
    hover:scale-[1.01]
  `;
  
  return (
    <div className="space-y-4">
      {products.map((p: any) => (
        // Pembungkus Tunggal (Parent Element) dengan Key
        <div 
          key={p.id} // Key wajib untuk elemen hasil map
          className={`
            p-4 rounded-lg 
            border border-gray-700 
            bg-gray-900 
            ${neonCardHover}
          `}
        >
          
          {/* DIV 1: Detail Produk (Hanya menampilkan data) */}
          <div>
            {/* 1. Judul Produk: Tetap kuat dengan warna primary */}
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

          {/* DIV 2: Aksi (DIHAPUS!) */}
          {/* Bagian <div className="flex items-center gap-6 mt-4">...</div> sudah dihapus */}
        </div>
      ))}
    </div>
  );
}
