import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark text-light p-6">
      <h1 className="text-4xl font-bold">Welcome</h1>
      <p className="text-grayText mt-3">Please login to continue</p>

      <Link
        href="/login"
        className="mt-6 bg-blue-600 hover:bg-blue-500 py-3 px-6 rounded-xl"
      >
        Login
      </Link>
    </div>
  );
}
