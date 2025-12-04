// pages/dashboard.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

// Buat supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Ambil user saat halaman dibuka
  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace("/login"); // redirect jika belum login
      } else {
        setUser(data.user);
      }

      setLoading(false);
    }

    loadUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return <div style={{ padding: 20 }}>Memuat dashboard...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold" }}>Dashboard</h1>

      <div style={{ marginTop: 20 }}>
        <p>Selamat datang, <b>{user?.email}</b></p>

        <button
          onClick={handleLogout}
          style={{
            marginTop: 16,
            padding: "8px 16px",
            background: "red",
            color: "white",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* Link ke halaman CRUD */}
      <div style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 20 }}>Menu CRUD</h2>
        <ul style={{ marginTop: 10 }}>
          <li>
            <a href="/dashboard/products" style={{ color: "blue" }}>
              Kelola Products →
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
