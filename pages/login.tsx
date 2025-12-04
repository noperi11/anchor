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

    // simpan sesi sederhana
    localStorage.setItem("app_user", JSON.stringify(res.user));

    router.push("/dashboard");
  }

  return (
    <Layout>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          <label>Email</label>
          <input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>

        <div>
          <label>Password</label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>

        <button type="submit">Login</button>

        {error && <div style={{ color: "salmon" }}>{error}</div>}
      </form>
    </Layout>
  );
}
