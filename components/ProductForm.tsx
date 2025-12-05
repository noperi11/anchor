type Props = {
  productName: string;
  productLink: string;
  category: string;
  brandName: string;

  setProductName: (v: string) => void;
  setProductLink: (v: string) => void;
  setCategory: (v: string) => void;
  setBrandName: (v: string) => void;

  onSubmit: (e: any) => void;
  submitText: string;
};

export default function ProductForm({
  productName,
  productLink,
  category,
  brandName,
  setProductName,
  setProductLink,
  setCategory,
  setBrandName,
  onSubmit,
  submitText,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <input
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        placeholder="Product Name"
        className="border px-3 py-2 rounded"
      />

      <input
        value={brandName}
        onChange={(e) => setBrandName(e.target.value)}
        placeholder="Brand Name"
        className="border px-3 py-2 rounded"
      />

      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        className="border px-3 py-2 rounded"
      />

      <input
        value={productLink}
        onChange={(e) => setProductLink(e.target.value)}
        placeholder="Product Link"
        className="border px-3 py-2 rounded"
      />

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        {submitText}
      </button>
    </form>
  );
}
