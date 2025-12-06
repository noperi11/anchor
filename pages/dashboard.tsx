"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useRouter } from "next/router";

// Import komponen yang sudah kita styling
import Layout from "../components/Layout";
import AnalyticsTable from "../components/AnalyticsTable";

// -----------------------------------------------------------------
// HELPER REGEX FUNCTIONS
// -----------------------------------------------------------------

// Fungsi untuk mengekstrak 'key_facts_to_remember'
const extractMemoryMarker = (contextString: string) => {
  const regex = /memory_markers key_facts_to_remember=(.*?)(?:\s|\.$)/; 
  const match = contextString.match(regex);
  
  if (match && match[1]) {
    return match[1].trim(); 
  }
  return 'Not found';
};

// Fungsi BARU untuk mengekstrak 'monitoringGuidance'
const extractMonitoringGuidance = (contextString: string) => {
  const regex = /"monitoringGuidance":\s*"([\s\S]*?)"/; 
  
  const match = contextString.match(regex);
  
  if (match && match[1]) {
    // match[1] berisi grup tangkapan (capturing group)
    // Hapus karakter escape (misalnya \n) dari teks yang diekstrak
    return match[1].replace(/\\n/g, ' ').trim(); 
  }
  return 'Not available';
};


// -----------------------------------------------------------------
// TYPES & CONSTANTS
// -----------------------------------------------------------------

type Engagement = {
  sessionId: string;
  scoring: number; // Tetap di-fetch, tapi tidak ditampilkan sebagai kolom utama
  engagement: string;
  sessionContext: string;
  brand: string;
  keyFact: string; // Hasil dari extractMemoryMarker
  finalEvaluation: string; // Hasil dari extractMonitoringGuidance (Revisi Baru)
};

type User = {
  id: string;
  email: string;
};

// DEFINISI KOLOM UNTUK TABEL ENGAGEMENT MENTAH
const ENGAGEMENT_COLUMNS = [
  { key: 'sessionId', header: 'Session ID' },
  { key: 'brand', header: 'Brand' },
  { key: 'engagement', header: 'Type' },
  // REVISI BARU: Mengganti Score dengan Final Evaluation
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

    async function fetchUserBrandAndEngagement() {
      setLoading(true);
      const userId = parsed.id;

      // 1. FETCH PROFILE: Ambil display_name (Brand Name)
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", userId)
        .single();

      if (profileError || !profileData) {
        console.error("Error fetching profile or profile not found:", profileError);
        setLoading(false);
        return;
      }
      
      const userBrandName = profileData.display_name;

      // 2. FETCH ENGAGEMENT: Gunakan Brand Name untuk filter
      const { data: engagementData, error: engagementError } = await supabase
        .from("Engagement")
        .select("sessionId, Brand, Scoring, Engagement, sessionContext") 
        .eq("Brand", userBrandName); 

      if (engagementError) {
        console.error("Error fetching engagement:", engagementError);
        setLoading(false);
        return;
      }

      const formattedData: Engagement[] = (engagementData || []).map((e: any) => ({
        sessionId: e.sessionId || 'N/A',
        brand: e.Brand,
        scoring: e.Scoring,
        engagement: e.Engagement,
        sessionContext: e.sessionContext, 
        
        // MAPPING BARU: Ekstraksi Data Khusus
        keyFact: extractMemoryMarker(e.sessionContext), 
        finalEvaluation: extractMonitoringGuidance(e.sessionContext), // <-- Mapping Revisi Final
      }));

      setEngagements(formattedData);
      setLoading(false);
    }

    fetchUserBrandAndEngagement();
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
        {/* REVISI 2: Ubah Judul */}
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
                {/* Tampilkan Final Evaluation di Cards juga */}
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
