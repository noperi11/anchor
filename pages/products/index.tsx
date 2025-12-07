"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import AnalyticsTable from "@/components/AnalyticsTable";
import { useRouter } from "next/router";

// -----------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------

type Product = {
    ProductId: string; // Diasumsikan string UUID
    BrandName: string;
    ProductName: string;
    Category: string;
    ProductLink: string; // Properti ini tetap di tipe data, tapi tidak ditampilkan
    actions?: React.ReactNode;
};

type User = {
    id: string;
    email: string;
};

// ********** REVISI 1: Hapus definisi kolom 'ProductLink' **********
const PRODUCT_COLUMNS = [
    { key: 'ProductId', header: 'ID' },
    { key: 'ProductName', header: 'Product Name' },
    { key: 'Category', header: 'Category' },
    { key: 'actions', header: 'Actions' },
];
// ******************************************************************

// -----------------------------------------------------------------
// KOMPONEN UTAMA
// -----------------------------------------------------------------

export default function ProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

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
                const errorData = await response.json();
                console.error("API Delete Error:", errorData.error);
                alert(`Error deleting product: ${errorData.error}`);
            } else {
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
        // ********** REVISI 2: Hapus ProductLink dari mapping **********
        // Kolom ini sekarang akan mengambil nilai default dari spread operator (...product)
        // yang hanya berupa string ProductLink, namun karena tidak ada di PRODUCT_COLUMNS,
        // kolom ini tidak akan dirender di AnalyticsTable.
        // ***************************************************************
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
                        columns={PRODUCT_COLUMNS} // Sekarang hanya 4 kolom
                        data={formattedProductsData}
                    />
                )}
            </div>
        </Layout>
    );
}
