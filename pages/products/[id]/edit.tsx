import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditProduct() {
  const router = useRouter();
  const { id }: any = router.query;

  const [product, setProduct] = useState<any>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("");

  async function load() {
    const { data } = await supabase.from("products").select("*").eq("id", id).single();
    setProduct(data);

    if (data) {
      setName(data.name);
      setPrice(data.price);
      setLink(data.link);
      setCategory(data.category);
    }
  }

  useEffect(() => {
    if (id) load();
  }, [id]);

  async function submit(e: any) {
    e.preventDefault();

    await supabase
      .from("products")
      .update({
        name,
        price,
        link,
        category,
      })
      .eq("id", id);

    router.push("/products");
  }

  if (!product) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

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
        submitText="Update"
      />
    </Layout>
  );
}
