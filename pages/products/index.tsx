"use client";

import React, { useEffect, useState } from "react";
// Hapus import { createClient } dari sini, gunakan `supabase` hanya untuk action langsung (DELETE)
import Layout from "@/components/Layout";
import AnalyticsTable from "@/components/AnalyticsTable"; 
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router"; // Tambahkan useRouter

// -----------------------------------------------------------------
// SUPABASE CLIENT & TYPES
// -----------------------------------------------------------------

// Dipertahankan di frontend hanya untuk aksi CRUD langsung (Delete)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Product = {
  ProductId: string;
  BrandName: string; 
  ProductName: string;
  Category: string;
  ProductLink: string;
  actions?: React.ReactNode; // <--- REVISI DI SINI
};

type User = {
  id: string;
  email: string;
};

// DEFINISI KOLOM UNTUK ANALYTICSTABLE
const PRODUCT_COLUMNS = [
  { key: 'ProductId', header: 'ID' },
  { key: 'ProductName', header: 'Product Name' },
  { key: 'Category', header: 'Category' },
  { key: 'ProductLink', header: 'Link' },
  { key: 'actions', header: 'Actions' }, // Kolom untuk tombol Delete
];

// -----------------------------------------------------------------
// KOMPONEN UTAMA
// -----------------------------------------------------------------

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Fungsi fetch diganti, memanggil API Route
  async function loadProducts() {
    setLoading(true);
    const stored = localStorage.getItem("app_user");
    
    if (!stored) {
      router.push("/login");
      setLoading(false);
      return;
    }

    const parsed: User = JSON.parse(stored);
    setUser(parsed);

    try {
        // Panggil API Route untuk mengambil dan memfilter data
        const response = await fetch(`/api/products-data?userId=${parsed.id}`); 
        
        if (!response.ok) {
            throw new Error('Failed to fetch products data from API.');
        }

        const data: Product[] = await response.json();
        setProducts(data);

    } catch (error) {
        console.error("Error fetching products:", error);
    } finally {
        setLoading(false);
    }
  }

  // Fungsi Delete tetap menggunakan client Supabase langsung
  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    const { error } = await supabase.from("products").delete().eq("ProductId", id);
    
    if (error) {
        console.error("Error deleting product:", error);
    } else {
        loadProducts(); // Reload data setelah penghapusan
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  // Memformat data untuk AnalyticsTable
  const formattedProductsData = products.map(product => ({
    ...product,
    // Menambahkan tombol Delete di kolom 'actions'
    actions: (
      <button 
        onClick={() => handleDelete(product.ProductId)}
        // Styling tombol Delete menggunakan Status Danger
        style={{ backgroundColor: 'var(--color-status-danger)', color: 'var(--color-text-primary)' }}
        className="py-1 px-3 rounded-md hover:opacity-80 transition text-sm"
      >
        Delete
      </button>
    ),
    // Menampilkan ProductLink sebagai link yang dapat diklik
    ProductLink: (
        <a href={product.ProductLink} target="_blank" rel="noopener noreferrer" style={{color: 'var(--color-accent)'}}>
            View Link
        </a>
    )
  }));


  if (!user) return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
      >
        Loading...
      </div>
    );

  return (
    <Layout>
      <div className="p-2">
        <div className="flex justify-between mb-8 items-center">
          <h1 className="text-3xl font-bold">Products List</h1>

          {/* Styling Tombol Create: Menggunakan warna Status Success */}
          <a
            href="/products/create"
            style={{ backgroundColor: 'var(--color-status-success)', color: 'var(--color-text-primary)' }}
            className="py-2 px-4 rounded-xl hover:opacity-90 transition font-semibold"
          >
            + New Product
          </a>
        </div>

        {loading ? (
            <div style={{ color: 'var(--color-text-secondary)' }}>Loading product list...</div>
        ) : formattedProductsData.length === 0 ? (
            <div style={{ color: 'var(--color-text-secondary)' }}>No products found. Click "+ New Product" to add one.</div>
        ) : (
            <AnalyticsTable 
                title="Registered Products" 
                columns={PRODUCT_COLUMNS} 
                data={formattedProductsData} 
            />
        )}
      </div>
    </Layout>
  );
}
