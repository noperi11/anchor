import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import ProductList from "@/components/ProductList";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);

  async function load() {
    const { data } = await supabase.from("products").select("*");
    setProducts(data || []);
  }

  async function handleDelete(id: any) {
    await supabase.from("products").delete().eq("id", id);
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Layout>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>

        <a
          href="/products/create"
          className="bg-blue-600 hover:bg-blue-500 py-2 px-4 rounded-xl"
        >
          + New Product
        </a>
      </div>

      <ProductList products={products} onDelete={handleDelete} />
    </Layout>
  );
}
