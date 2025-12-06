"use client";

import React, { useEffect, useState } from "react";
// import { supabase } from "../utils/supabase"; <-- Hapus import Supabase
import { useRouter } from "next/router";

// Import komponen yang sudah kita styling
import Layout from "../components/Layout";
import AnalyticsTable from "../components/AnalyticsTable";

// -----------------------------------------------------------------
// TYPES & CONSTANTS (Dipertahankan)
// -----------------------------------------------------------------

// Sesuaikan tipe data agar cocok dengan output API Route
type Engagement = {
  sessionId: string;
  scoring: number;
  engagement: string;
  sessionContext: string;
  brand: string;
  keyFact: string; // Hasil dari pemrosesan Backend
  finalEvaluation: string; // Hasil dari pemrosesan Backend
};

type User = {
  id: string;
  email: string;
};

// DEFINISI KOLOM (Dipertahankan)
const ENGAGEMENT_COLUMNS = [
  { key: 'sessionId', header: 'Session ID' },
  { key: 'brand', header: 'Brand' },
  { key: 'engagement', header: 'Type' },
  { key: 'finalEvaluation', header: 'Final Evaluation' }, 
  { key: 'keyFact', header: 'Key Fact' }, 
];


// -----------------------------------------------------------------
// KOMPONEN DASHBOARD
// -----------------------------------------------------------------

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

    // FETCH DARI API ROUTE BARU
    async function fetchEngagementFromAPI() {
      setLoading(true);
      const userId = parsed.id;

      try {
        // Panggil endpoint API Route yang baru dibuat
        const response = await fetch(`/api/engagement-data?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch processed engagement data from API.');
        }

        const data: Engagement[] = await response.json();
        setEngagements(data);

      } catch (error) {
        console.error("Error fetching data from API:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEngagementFromAPI();
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
        <h2 className="text-xl font-semibold mb-6">ANCHOR Dashboard</h2>

        {/* TABEL ENGAGEMENT MENTAH */}
        <div className="mb-8">
            {loading ? (
                <div style={{ color: 'var(--color-text-secondary)' }}>Loading session data...</div>
            ) : (
                <AnalyticsTable 
                    title="Raw Session Engagement Data"
                    columns={ENGAGEMENT_COLUMNS}
                    data={engagements} 
                />
            )}
        </div>
        
        {/* BAGIAN ENGAGEMENT CARDS ASLI */}
        <h2 className="text-xl font-semibold mb-4 mt-8">Engagement Metrics Overview</h2>

        {loading ? (
          <div style={{ color: 'var(--color-text-secondary)' }}>Loading additional data...</div>
        ) : engagements.length === 0 ? (
          <div style={{ color: 'var(--color-text-secondary)' }}>No additional engagement data found.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {engagements.map((e, idx) => (
              <div
                key={`${e.sessionId}-${idx}`}
                style={{ backgroundColor: 'var(--color-bg-surface)' }} 
                className="p-4 rounded-xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-bold mt-2">Brand: {e.brand}</h3>
                <p className="mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                    Score: {e.scoring}
                </p>
                <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Final Eval: {e.finalEvaluation}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
