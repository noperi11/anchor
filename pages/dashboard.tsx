"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import AnalyticsTable from "../components/AnalyticsTable";

type Engagement = {
  sessionId: string;
  scoring: number;
  engagement: string;
  sessionContext: string;
  brand: string; // Tambahkan kolom Brand untuk filtering dan tampilan
};

type User = {
  id: string;
  email: string;
};

// DEFINISI KOLOM UNTUK TABEL ENGAGEMENT MENTAH
const ENGAGEMENT_COLUMNS = [
  { key: 'sessionId', header: 'Session ID' },
  { key: 'brand', header: 'Brand' }, // Tampilkan kolom Brand
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

    async function fetchUserBrandAndEngagement() {
      setLoading(true);
      const userId = parsed.id;

      // 1. FETCH PROFILE: Ambil display_name (Brand Name) dari tabel profiles
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", userId) // Filter profiles.id berdasarkan user.id
        .single();

      if (profileError || !profileData) {
        console.error("Error fetching profile or profile not found:", profileError);
        setLoading(false);
        return;
      }
      
      const userBrandName = profileData.display_name;

      // 2. FETCH ENGAGEMENT: Gunakan Brand Name untuk filter tabel Engagement
      const { data: engagementData, error: engagementError } = await supabase
        .from("Engagement")
        .select("sessionId, Brand, Scoring, Engagement, sessionContext") // Tambahkan Brand dan sessionId
        .eq("Brand", userBrandName); // FILTER PENTING: Engagement.Brand = profiles.display_name

      if (engagementError) {
        console.error("Error fetching engagement:", engagementError);
        setLoading(false);
        return;
      }

      const formattedData: Engagement[] = (engagementData || []).map((e: any) => ({
        sessionId: e.sessionId || 'N/A',
        brand: e.Brand, // Mapping kolom Brand
        scoring: e.Scoring,
        engagement: e.Engagement,
        sessionContext: e.sessionContext,
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

        {/* REVISI 1: HAPUS TOMBOL NAVIGASI */}
        {/* <div className="flex gap-4 mb-8">... Tombol dihapus ...</div> */}
        
        {/* TABEL ENGAGEMENT MENTAH (Data dari filter Brand) */}
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
                <h3 className="text-lg font-bold mt-2">Brand: {e.brand}</h3> {/* Tampilkan Brand */}
                <p className="mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                    Score: {e.scoring}
                </p>
                <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Type: {e.engagement}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
