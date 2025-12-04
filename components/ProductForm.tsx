type Props = {
  name: string;
  price: number;
  link: string;
  category: string;
  onSubmit: (e: any) => void;
  setName: (v: string) => void;
  setPrice: (v: number) => void;
  setLink: (v: string) => void;
  setCategory: (v: string) => void;
  submitText?: string;
};

export default function ProductForm({
  name,
  price,
  link,
  category,
  onSubmit,
  setName,
  setPrice,
  setLink,
  setCategory,
  submitText = "Save",
}: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-[#111] p-6 rounded-xl border border-neutral-800 space-y-4"
    >
      <div>
        <label className="block mb-1 text-grayText">Product Name</label>
        <input
          className="w-full bg-dark border border-neutral-800 p-3 rounded-xl"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-grayText">Price</label>
        <input
          type="number"
          className="w-full bg-dark border border-neutral-800 p-3 rounded-xl"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-grayText">Product Link</label>
        <input
          className="w-full bg-dark border border-neutral-800 p-3 rounded-xl"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-grayText">Category</label>
        <input
          className="w-full bg-dark border border-neutral-800 p-3 rounded-xl"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-500 font-semibold w-full py-3 rounded-xl"
      >
        {submitText}
      </button>
    </form>
  );
}
