// pages/products/create.tsx

import { useState } from "react";
import Layout from "@/components/Layout";
// Asumsi ProductForm.tsx sudah ada
import ProductForm from "@/components/ProductForm"; 

// Hapus import createClient karena interaksi DB dipindahkan ke API Route

export default function CreateProduct() {
  // --- STATE UNTUK INPUT PRODUK ---
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0); 
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("");

  // --- STATE WAJIB UNTUK OTORISASI ---
  // Ini harus diambil dari dropdown Brand yang dimiliki user (misalnya dari API terpisah)
  const [brandId, setBrandId] = useState(""); 
  
  // Asumsi brandOptions adalah daftar Brand yang boleh dikelola user (dari fetch terpisah)
  const [brandOptions, setBrandOptions] = useState<any[]>([]); 


  async function submit(e: any) {
    e.preventDefault();

    if (!brandId) {
        alert("Mohon pilih Brand yang akan dikelola.");
        return;
    }
    
    // Sesuaikan nama field sesuai dengan skema database yang benar
    const productData = {
      name,
      price: Number(price), // Pastikan harga adalah angka
      url: link,            // Sesuaikan link -> url (sesuai API Anda)
      category,
      brand_id: brandId,    // Kunci penting untuk otorisasi
    };

    // --- LOGIKA UTAMA: Panggil API Backend untuk Insert yang Aman ---
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (response.ok) {
        alert("Produk berhasil ditambahkan!");
        window.location.href = "/products";
    } else {
        const errorData = await response.json();
        // Tampilkan pesan error spesifik dari backend (misalnya 'Forbidden: Not authorized')
        alert(`Gagal menambahkan produk: ${errorData.error}`);
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Create Product</h1>
      
      {/* ⚠️ NOTE: Sesuaikan ProductForm untuk menangani brandId, setBrandId, dan brandOptions */}
      <ProductForm
        name={name}
        price={price}
        link={link}
        category={category}
        brandId={brandId} 
        brandOptions={brandOptions} // Kirim options ke form
        
        setName={setName}
        setPrice={setPrice}
        setLink={setLink}
        setCategory={setCategory}
        setBrandId={setBrandId} // Setter untuk dropdown Brand
        
        onSubmit={submit}
        submitText="Create"
      />
    </Layout>
  );
}

// Catatan: Anda mungkin perlu membuat component ProductForm atau menambahkan logika
// untuk mengambil brandOptions (Brand yang dimiliki user) saat halaman ini dimuat.
