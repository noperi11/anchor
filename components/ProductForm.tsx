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

  // Ubah tipe event dari 'any' menjadi FormEvent<HTMLFormElement> untuk tipe yang lebih baik
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
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {/* ---------------------------------------------------- */}
      {/* INPUT FIELD STYLING (Menggunakan --color-bg-raised) */}
      {/* ---------------------------------------------------- */}
      
      {/* Input Field 1: Product Name */}
      <input
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        placeholder="Product Name"
        style={{
          backgroundColor: 'var(--color-bg-raised)',
          borderColor: 'var(--color-border-subtle)',
        }}
        className="border px-3 py-2 rounded"
      />

      {/* Input Field 2: Brand Name */}
      <input
        value={brandName}
        onChange={(e) => setBrandName(e.target.value)}
        placeholder="Brand Name"
        style={{
          backgroundColor: 'var(--color-bg-raised)',
          borderColor: 'var(--color-border-subtle)',
        }}
        className="border px-3 py-2 rounded"
      />

      {/* Input Field 3: Category */}
      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        style={{
          backgroundColor: 'var(--color-bg-raised)',
          borderColor: 'var(--color-border-subtle)',
        }}
        className="border px-3 py-2 rounded"
      />

      {/* Input Field 4: Product Link */}
      <input
        value={productLink}
        onChange={(e) => setProductLink(e.target.value)}
        placeholder="Product Link"
        style={{
          backgroundColor: 'var(--color-bg-raised)',
          borderColor: 'var(--color-border-subtle)',
        }}
        className="border px-3 py-2 rounded"
      />

      {/* ---------------------------------------------------- */}
      {/* SUBMIT BUTTON STYLING (Menggunakan --color-accent) */}
      {/* ---------------------------------------------------- */}
      <button 
        type="submit" 
        style={{ 
          backgroundColor: 'var(--color-accent)', 
          color: 'var(--color-text-primary)' // Menggunakan warna teks utama/putih pucat
        }}
        className="px-4 py-2 rounded font-semibold hover:opacity-90 transition"
      >
        {submitText}
      </button>
    </form>
  );
}
