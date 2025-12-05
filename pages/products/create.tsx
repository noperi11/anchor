// pages/products/create.tsx

import { useState } from "react";
import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";

export default function CreateProduct() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [productLink, setProductLink] = useState("");
  const [brandName, setBrandName] = useState("");

  // UserId ambil dari localStorage setelah login
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  async function submit(e: any) {
    e.preventDefault();

    if (!userId) {
      alert("User tidak ditemukan. Silakan login ulang.");
      return;
    }

    const productData = {
      UserId: userId,
      BrandName: brandName,
      ProductName: productName,
      Category: category,
      ProductLink: productLink,
    };

    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    if (response.ok) {
      alert("Produk berhasil ditambahkan!");
      window.location.href = "/dashboard";
    } else {
      const err = await response.json();
      alert("Gagal: " + err.error);
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Create Product</h1>

      <ProductForm
        productName={productName}
        setProductName={setProductName}
        category={category}
        setCategory={setCategory}
        productLink={productLink}
        setProductLink={setProductLink}
        brandName={brandName}
        setBrandName={setBrandName}
        onSubmit={submit}
        submitText="Create"
      />
    </Layout>
  );
}
