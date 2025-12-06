// pages/products.tsx (Revisi Final: Delete via API Route)

"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import AnalyticsTable from "@/components/AnalyticsTable";
// Hapus import { createClient } dari @supabase/supabase-js
import { useRouter } from "next/router";

// -----------------------------------------------------------------
// SUPABASE CLIENT & TYPES
// -----------------------------------------------------------------

// Hapus: const supabase = createClient(...)

// Tipe Product, User, dan PRODUCT_COLUMNS tetap sama
type Product = {
    ProductId: string; // Diasumsikan string UUID
    BrandName: string;
    ProductName: string;
    Category: string;
    ProductLink: string;
    actions?: React.ReactNode;
};

type User = {
    id: string;
    email: string;
};

const PRODUCT_COLUMNS = [
    { key: 'ProductId', header: 'ID' },
    { key: 'ProductName', header: 'Product Name' },
    { key: 'Category', header: 'Category' },
    { key: 'ProductLink', header: 'Link' },
    { key: 'actions', header: 'Actions' },
];

// -----------------------------------------------------------------
// KOMPONEN UTAMA
// -----------------------------------------------------------------

export default function ProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    // ... (Fungsi loadProducts tetap sama, karena ia memanggil /api/products-data) ...
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

    // Fungsi Delete direvisi untuk memanggil API Route
    async function handleDelete(id: string) {
        if (!id || id === 'undefined') {
            alert("Gagal menghapus: Product ID tidak valid atau hilang.");
            return;
        }

        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const response = await fetch('/api/delete-product', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ProductId: id }), // Kirim ProductId
            });

            if (!response.ok) {
                // Tangkap error dari backend (termasuk error UUID)
                const errorData = await response.json();
                console.error("API Delete Error:", errorData.error);
                alert(`Error deleting product: ${errorData.error}`);
            } else {
                // Jika berhasil (status 204), reload data
                loadProducts();
            }
        } catch (e) {
            console.error("Network request failed:", e);
            alert("A network error occurred while deleting the product.");
        }
    }

    useEffect(() => {
        loadProducts();
    }, []);

    // ... (formattedProductsData tetap sama) ...
    const formattedProductsData = products.map(product => ({
        ...product,
        actions: (
            <button
                onClick={() => handleDelete(product.ProductId)}
                disabled={!product.ProductId}
                style={{
                    backgroundColor: 'var(--color-status-danger)',
                    color: 'var(--color-text-accent)'
                }}
                className="py-1 px-3 rounded-md hover:opacity-80 transition text-sm font-semibold"
            >
                Delete
            </button>
        ),
        ProductLink: (
            <a href={product.ProductLink} target="_blank" rel="noopener noreferrer" className="neon-text-hover" style={{ color: 'var(--color-accent)' }}>
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
                    <h1 className="text-3xl font-bold uppercase" style={{ color: 'var(--color-text-primary)' }}>
                        Products List
                    </h1>

                    <a
                        href="/products/create"
                        style={{
                            backgroundColor: 'var(--color-status-success)',
                            color: 'var(--color-text-accent)'
                        }}
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
