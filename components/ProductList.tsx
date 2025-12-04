import Link from "next/link";

export default function ProductList({ products, onDelete }: any) {
  return (
    <div className="space-y-4">
      {products.map((p: any) => (
        <div
          key={p.id}
          className="bg-[#111] border border-neutral-800 p-5 rounded-xl flex items-center justify-between"
        >
          <div>
            <h3 className="text-lg font-semibold">{p.name}</h3>
            <p className="text-grayText text-sm">{p.category}</p>
            <p className="text-sm mt-1">Rp {p.price}</p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href={`/products/${p.id}/edit`}
              className="text-blue-400 hover:text-blue-300"
            >
              Edit
            </Link>

            <button
              className="text-red-400 hover:text-red-300"
              onClick={() => onDelete(p.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
