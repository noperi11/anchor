import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
// Hapus import { createClient } dari "@supabase/supabase-js" jika tidak lagi digunakan
import { createClient } from "@supabase/supabase-js"; 


// Klien Supabase hanya digunakan untuk operasi READ (SELECT) di load()
// Hapus jika Anda ingin memindahkan SEMUA logika Supabase ke backend
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


export default function EditProduct() {
    const router = useRouter();
    const { id }: any = router.query; // id = ProductId

    const [product, setProduct] = useState<any>(null);

    const [productName, setProductName] = useState("");
    const [productLink, setProductLink] = useState("");
    const [category, setCategory] = useState("");
    const [brandName, setBrandName] = useState("");

    async function load() {
        if (!id) return;
        
        // Operasi READ (SELECT) tetap di frontend
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("ProductId", id)
            .single();

        if (error) {
            console.error("Load product error:", error);
            setProduct(null);
            return;
        }

        setProduct(data);

        if (data) {
            // Sesuaikan dengan kolom DB
            setProductName(data.ProductName ?? "");
            setProductLink(data.ProductLink ?? "");
            setCategory(data.Category ?? "");
            setBrandName(data.BrandName ?? "");
        }
    }

    useEffect(() => {
        if (id) load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Fungsi Submit direvisi untuk memanggil API Route (UPDATE)
    async function submit(e: any) {
        e.preventDefault();

        if (!id) {
            alert("Product ID tidak ditemukan.");
            return;
        }

        const payload = {
            ProductId: id, // Kirim ID produk yang akan diupdate
            ProductName: productName,
            ProductLink: productLink,
            Category: category,
            BrandName: brandName,
        };

        try {
            const response = await fetch("/api/edit-product", {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Update failed due to server error.");
            }

            // Jika berhasil
            router.push("/products");

        } catch (error: any) {
            console.error("Update error:", error);
            alert("Gagal update produk: " + error.message);
        }
    }

    // show loading while fetching
    if (!product && id) return <Layout>Loading...</Layout>;

    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

            <ProductForm
                productName={productName}
                productLink={productLink}
                category={category}
                brandName={brandName}
                setProductName={setProductName}
                setProductLink={setProductLink}
                setCategory={setCategory}
                setBrandName={setBrandName}
                onSubmit={submit}
                submitText="Update"
            />
        </Layout>
    );
}
