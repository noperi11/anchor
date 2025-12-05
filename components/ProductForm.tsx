type Props = {
  productName: string;
  category: string;
  productLink: string;
  brandName: string;

  setProductName: (v: string) => void;
  setCategory: (v: string) => void;
  setProductLink: (v: string) => void;
  setBrandName: (v: string) => void;

  onSubmit: (e: any) => void;
  submitText: string;
};

export default function ProductForm({
  productName,
  category,
  productLink,
  brandName,
  setProductName,
  setCategory,
  setProductLink,
  setBrandName,
  onSubmit,
  submitText,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">

      <input 
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        className="border px-3 py-2 rounded"
        placeholder="Product Name"
      />

      <input 
        value={brandName}
        onChange={(e) => setBrandName(e.target.value)}
        className="border px-3 py-2 rounded"
        placeholder="Brand Name"
      />

      <input 
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border px-3 py-2 rounded"
        placeholder="Category"
      />

      <input 
        value={productLink}
        onChange={(e) => setProductLink(e.target.value)}
        className="border px-3 py-2 rounded"
        placeholder="Product Link"
      />

      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        {submitText}
      </button>

    </form>
  );
}
