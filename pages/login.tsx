"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";
import { postJson } from "../lib/apiClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await postJson("/api/login", { email, password });
    setLoading(false);

    console.log("Login response:", res);

    if (res?.error) return setError(res.error);

    localStorage.setItem("app_user", JSON.stringify(res.user));
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={submit} className="w-full max-w-md p-8 bg-gray-900 rounded-xl space-y-4">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-xl bg-gray-800"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-xl bg-gray-800"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <div className="text-red-400 mt-2">{error}</div>}
      </form>
    </div>
  );
}
