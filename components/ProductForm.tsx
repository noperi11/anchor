type Props = {
  name: string;
  price: number;
  link: string;
  category: string;

  setName: (v: string) => void;
  setPrice: (v: number) => void;
  setLink: (v: string) => void;
  setCategory: (v: string) => void;

  onSubmit: (e: any) => void;
  submitText: string;
};

export default function ProductForm({
  name,
  price,
  link,
  category,
  setName,
  setPrice,
  setLink,
  setCategory,
  onSubmit,
  submitText,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product Name"
        className="border px-3 py-2 rounded"
      />

      <input
        value={price}
        type="number"
        onChange={(e) => setPrice(Number(e.target.value))}
        placeholder="Price"
        className="border px-3 py-2 rounded"
      />

      <input
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Product Link"
        className="border px-3 py-2 rounded"
      />

      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        className="border px-3 py-2 rounded"
      />

      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        {submitText}
      </button>

    </form>
  );
}
