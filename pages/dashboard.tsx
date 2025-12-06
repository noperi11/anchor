"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useRouter } from "next/router";

import Layout from "../components/Layout";
import AnalyticsTable from "../components/AnalyticsTable";

type Engagement = {
  // Menambahkan kolom yang ingin ditampilkan di tabel
  sessionId: string; // <-- Kolom baru yang di-fetch
  scoring: string;
  engagement: string;
  sessionContext: string;
};

type User = {
  id: string;
  email: string;
};

// 1. DEFINISI KOLOM UNTUK TABEL ENGAGEMENT MENTAH
const ENGAGEMENT_COLUMNS = [
  { key: 'sessionId', header: 'Session ID' },
  { key: 'sessionContext', header: 'Context' },
  { key: 'engagement', header: 'Engagement Type' },
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("app_user");
    if (!stored) {
      router.push("/login");
      return;
    }

    const parsed: User = JSON.parse(stored);
    setUser(parsed);

    async function fetchEngagement() {
      setLoading(true);

      // 2. MENGUBAH QUERY SUPABASE UNTUK MENYEKAN sessionId
      const { data, error } = await supabase
        .from("Engagement")
        .select("sessionId, Scoring, Engagement, sessionContext") 
        .eq("userId", parsed.id);

      if (error) {
        console.error("Error fetching engagement:", error);
        setLoading(false);
        return;
      }

      const formattedData: Engagement[] = (data || []).map((e: any) => ({
        sessionId: e.sessionId || 'N/A', // Pastikan sessionId di mapping
        scoring: e.Scoring,
        engagement: e.Engagement,
        sessionContext: e.sessionContext,
      }));

      setEngagements(formattedData);
      setLoading(false);
    }

    fetchEngagement();
  }, [router]);

  if (!user)
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
      >
        Loading...
      </div>
    );

  return (
    <Layout>
      <div className="p-2">
        <h1 className="text-3xl font-bold mb-4">Welcome, {user.email}</h1>
        <h2 className="text-xl font-semibold mb-6">Your Dashboard</h2>

        {/* Tombol Navigasi */}
        <div className="flex gap-4 mb-8">
          <a
            href="/products"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-text-primary)' }}
            className="py-2 px-4 rounded-xl hover:opacity-90 transition font-semibold"
          >
            Go to Products →
          </a>
          <a
            href="/products/create"
            style={{ backgroundColor: 'var(--color-status-success)', color: 'var(--color-text-primary)' }}
            className="py-2 px-4 rounded-xl hover:opacity-90 transition font-semibold"
          >
            + Create Product
          </a>
        </div>

        {/* ---------------------------------------------------- */}
        {/* 3. TABEL ENGAGEMENT MENTAH */}
        {/* ---------------------------------------------------- */}
        <div className="mb-8">
            {loading ? (
                <div style={{ color: 'var(--color-text-secondary)' }}>Loading session data...</div>
            ) : (
                <AnalyticsTable 
                    title="Raw Session Engagement Data"
                    columns={ENGAGEMENT_COLUMNS}
                    data={engagements} // <-- Menggunakan data nyata
                />
            )}
        </div>
        
        {/* ---------------------------------------------------- */}
        {/* 4. BAGIAN ENGAGEMENT CARDS ASLI (DIJADIKAN TABEL BARU JIKA PERLU) */}
        {/* Kolom Scoring dan User ID (Optional) bisa ditampilkan di tabel baru di bawah ini */}
        
        <h2 className="text-xl font-semibold mb-4 mt-8">Other Engagement Metrics</h2>

        {loading ? (
          // Loading/Empty State: Mengganti text-gray-400
          <div style={{ color: 'var(--color-text-secondary)' }}>Loading additional data...</div>
        ) : engagements.length === 0 ? (
          <div style={{ color: 'var(--color-text-secondary)' }}>No additional engagement data found.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {engagements.map((e, idx) => (
              <div
                key={`${e.userId}-${idx}`}
                style={{ backgroundColor: 'var(--color-bg-surface)' }} 
                className="p-4 rounded-xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-bold mt-2">Score: {e.scoring}</h3>
                <p className="mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                    {e.engagement}
                </p>
                <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  User ID: {e.userId}
                </p>
              </div>
            ))}
          </div>
        )}
        
      </div>
    </Layout>
  );
}
