// pages/login.tsx
import React, { useState } from "react";
import Layout from "../components/Layout";
import { postJson } from "../lib/apiClient";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await postJson("/api/login", { email, password });
    if (res?.error) return setError(res.error);
    localStorage.setItem("app_user", JSON.stringify(res.user));
    router.push("/dashboard");
  }

  return (
    <Layout showHeader={false}>
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-md bg-[#0f0f0f] border border-neutral-800 rounded-2xl p-8 shadow-md">
          <h1 className="text-2xl font-bold mb-4">Sign in</h1>
          <p className="text-sm text-grayText mb-6">Masuk untuk melihat dashboard kamu</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm text-grayText mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl bg-dark border border-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-grayText mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-xl bg-dark border border-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold"
            >
              Login
            </button>

            {error && <div className="text-sm text-rose-400 mt-2">{error}</div>}
          </form>
        </div>
      </div>
    </Layout>
  );
}
