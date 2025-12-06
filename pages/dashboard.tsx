"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useRouter } from "next/router";

// Import komponen yang sudah kita styling
import Layout from "../components/Layout";
import AnalyticsTable from "../components/AnalyticsTable";

type Engagement = {
  sessionId: string; // Tambahkan sessionId (asumsi ini kolom baru yang ingin Anda fetch)
  scoring: number;
  engagement: string;
  sessionContext: string;
  // userId: string; <-- Dihapus karena tidak ada di tabel Engagement
};

type User = {
  id: string;
  email: string;
};

// 1. DEFINISI KOLOM UNTUK TABEL ENGAGEMENT MENTAH
const ENGAGEMENT_COLUMNS = [
  { key: 'sessionId', header: 'Session ID' },
  { key: 'scoring', header: 'Score' },
  { key: 'engagement', header: 'Type' },
  { key: 'sessionContext', header: 'Context' },
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

      // 2. MENGUBAH QUERY SUPABASE: Hapus 'userId' dari kolom yang di-select
      const { data, error } = await supabase
        .from("Engagement")
        // Select kolom yang Anda miliki: sessionId, Scoring, Engagement, sessionContext
        .select("sessionId, Scoring, Engagement, sessionContext") 
        .eq("userId", parsed.id); // <-- Masih menggunakan userId di WHERE clause untuk filtering

      if (error) {
        console.error("Error fetching engagement:", error);
        setLoading(false);
        return;
      }

      const formattedData: Engagement[] = (data || []).map((e: any) => ({
        sessionId: e.sessionId || 'N/A', // Mapping sessionId
        // userId: e.userId, <-- Dihapus dari mapping
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

        {/* Tombol Navigasi (Styling Dark Mode) */}
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
        {/* TABEL ENGAGEMENT MENTAH (MENGGANTIKAN DUMMY DATA) */}
        {/* ---------------------------------------------------- */}
        <div className="mb-8">
            {loading ? (
                <div style={{ color: 'var(--color-text-secondary)' }}>Loading session data...</div>
            ) : (
                <AnalyticsTable 
                    title="Raw Session Engagement Data"
                    columns={ENGAGEMENT_COLUMNS} // Menggunakan definisi kolom baru
                    data={engagements} // <-- Menggunakan data yang di-fetch
                />
            )}
        </div>
        
        {/* ---------------------------------------------------- */}
        {/* BAGIAN ENGAGEMENT CARDS ASLI (Dipertahankan di bawah) */}
        {/* ---------------------------------------------------- */}
        <h2 className="text-xl font-semibold mb-4 mt-8">User Engagement Data (Cards)</h2>

        {loading ? (
          <div style={{ color: 'var(--color-text-secondary)' }}>Loading additional data...</div>
        ) : engagements.length === 0 ? (
          <div style={{ color: 'var(--color-text-secondary)' }}>No additional engagement data found.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {engagements.map((e, idx) => (
              <div
                key={`${e.sessionId}-${idx}`} // Menggunakan sessionId untuk key
                style={{ backgroundColor: 'var(--color-bg-surface)' }} 
                className="p-4 rounded-xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-bold mt-2">Score: {e.scoring}</h3>
                <p className="mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                    {e.engagement}
                </p>
                <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Context: {e.sessionContext}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
