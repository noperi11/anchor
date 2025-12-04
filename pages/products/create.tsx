import { useState } from "react";
import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CreateProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("");

  async function submit(e: any) {
    e.preventDefault();

    await supabase.from("products").insert([
      {
        name,
        price,
        link,
        category,
      },
    ]);

    window.location.href = "/products";
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Create Product</h1>

      <ProductForm
        name={name}
        price={price}
        link={link}
        category={category}
        setName={setName}
        setPrice={setPrice}
        setLink={setLink}
        setCategory={setCategory}
        onSubmit={submit}
        submitText="Create"
      />
    </Layout>
  );
}
