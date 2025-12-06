"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useRouter } from "next/router";

// Import komponen yang sudah kita styling
import Layout from "../components/Layout"; 
import AnalyticsTable from "../components/AnalyticsTable"; 

type Engagement = {
  userId: string;
  scoring: number;
  engagement: string;
  sessionContext: string;
};

type User = {
  id: string;
  email: string;
};

// Data dummy untuk AnalyticsTable (sesuaikan dengan data sesungguhnya)
const dummyAnalyticsData = [
  { id: 1, metric_name: 'Total Products', metric_value: '45' },
  { id: 2, metric_name: 'Avg. Engagement Score', metric_value: '7.8' },
  { id: 3, metric_name: 'Total Users', metric_value: '2,100' },
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
      const { data, error } = await supabase
        .from("Engagement")
        .select("userId, Scoring, Engagement, sessionContext")
        .eq("userId", parsed.id);

      if (error) {
        console.error("Error fetching engagement:", error);
        setLoading(false);
        return;
      }

      const formattedData: Engagement[] = (data || []).map((e: any) => ({
        userId: e.userId,
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
    // Loading State Awal
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        // Memastikan warna latar belakang mengikuti tema
        style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
      >
        Loading...
      </div>
    );

  return (
    // Membungkus seluruh konten dengan Layout. Layout akan mengatur padding dan warna global.
    <Layout>
      {/* Container utama tanpa styling warna hardcoded */}
      <div className="p-2">
        <h1 className="text-3xl font-bold mb-4">Welcome, {user.email}</h1>
        <h2 className="text-xl font-semibold mb-6">Your Dashboard</h2>

        {/* ---------------------------------------------------- */}
        {/* 1. Tombol Navigasi (Menggunakan Aksen & Status Success) */}
        {/* ---------------------------------------------------- */}
        <div className="flex gap-4 mb-8">
          <a
            href="/products"
            // Mengganti bg-blue-600 dengan warna Aksen
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-text-primary)' }}
            className="py-2 px-4 rounded-xl hover:opacity-90 transition font-semibold"
          >
            Go to Products →
          </a>

          <a
            href="/products/create"
            // Mengganti bg-green-600 dengan warna Status Success
            style={{ backgroundColor: 'var(--color-status-success)', color: 'var(--color-text-primary)' }}
            className="py-2 px-4 rounded-xl hover:opacity-90 transition font-semibold"
          >
            + Create Product
          </a>
        </div>

        {/* ---------------------------------------------------- */}
        {/* 2. Analytics Table (Menggunakan Komponen yang sudah di-styling) */}
        {/* ---------------------------------------------------- */}
        <div className="mb-8">
            <AnalyticsTable data={dummyAnalyticsData} />
        </div>

        {/* ---------------------------------------------------- */}
        {/* 3. Engagement Cards / Data View */}
        {/* ---------------------------------------------------- */}
        <h2 className="text-xl font-semibold mb-4 mt-8">User Engagement Data</h2>

        {loading ? (
          // Loading/Empty State: Mengganti text-gray-400
          <div style={{ color: 'var(--color-text-secondary)' }}>Loading engagement data...</div>
        ) : engagements.length === 0 ? (
          <div style={{ color: 'var(--color-text-secondary)' }}>No engagement data found.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {engagements.map((e, idx) => (
              <div
                key={`${e.userId}-${idx}`}
                // Mengganti bg-gray-900, text-gray-300, text-gray-400
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
