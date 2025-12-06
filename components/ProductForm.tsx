// components/ProductForm.tsx
import { FormEvent } from "react";

type Props = {
  productName: string;
  productLink: string;
  category: string;
  brandName: string;

  setProductName: (v: string) => void;
  setProductLink: (v: string) => void;
  setCategory: (v: string) => void;
  setBrandName: (v: string) => void;

  onSubmit: (e: FormEvent<HTMLFormElement>) => void; 
  submitText: string;
};

export default function ProductForm({
  productName,
  productLink,
  category,
  brandName,
  setProductName,
  setProductLink,
  setCategory,
  setBrandName,
  onSubmit,
  submitText,
}: Props) {
  
  // ** Definisi Custom Class untuk Neon Button **
  // Karena Tailwind tidak mendukung efek glow kompleks di class tunggal, 
  // kita definisikan styling button secara eksternal (di bawah komponen, atau bisa di globals.css)
  const neonButtonClass = `
    transition-all duration-300 ease-in-out
    shadow-lg 
    hover:shadow-[0_0_15px_var(--color-accent-darker),_0_0_25px_var(--color-accent-darker)]
    hover:scale-[1.02]
  `;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      
      {/* ---------------------------------------------------- */}
      {/* INPUT FIELD STYLING (Sudah diatur di globals.css) */}
      {/* ---------------------------------------------------- */}
      
      {/* Input Fields: Hapus styling inline karena sudah dihandle oleh globals.css */}
      <input
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        placeholder="Product Name"
        // Hapus style inline. Cukup gunakan class untuk bentuk dan padding.
        // Styling warna dan fokus (glow) sudah di globals.css.
        className="px-3 py-2 rounded" 
      />

      <input
        value={brandName}
        onChange={(e) => setBrandName(e.target.value)}
        placeholder="Brand Name"
        className="px-3 py-2 rounded"
      />

      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        className="px-3 py-2 rounded"
      />

      <input
        value={productLink}
        onChange={(e) => setProductLink(e.target.value)}
        placeholder="Product Link"
        className="px-3 py-2 rounded"
      />

      {/* ---------------------------------------------------- */}
      {/* SUBMIT BUTTON: NEON GLOW EFFECT */}
      {/* ---------------------------------------------------- */}
      <button 
        type="submit" 
        style={{ 
          // Warna latar belakang dan teks dipertahankan
          backgroundColor: 'var(--color-accent)', 
          color: 'var(--color-bg-primary)', // Gunakan warna gelap untuk teks agar kontras
        }}
        // Gabungkan kelas Tailwind dasar dengan kelas Neon Button
        className={`px-4 py-2 rounded font-bold ${neonButtonClass}`}
      >
        {submitText}
      </button>
    </form>
  );
}
