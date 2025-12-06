"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Layout from "../components/Layout";
import AnalyticsTable from "../components/AnalyticsTable";

// -----------------------------------------------------------------
// TYPES & CONSTANTS
// -----------------------------------------------------------------

// Sesuaikan tipe data agar cocok dengan output API Route
type Engagement = {
  sessionId: string;
  scoring: number;
  engagement: string;
  sessionContext: string;
  brand: string;
  keyFact: string; 
  finalEvaluation: string; 
};

type User = {
  id: string;
  email: string;
};

type SummaryMetric = {
    metric: string;
    value: string | number;
};

// DEFINISI KOLOM RINGKASAN (Dipertahankan)
const SUMMARY_COLUMNS = [
  { key: 'metric', header: 'Metric' },
  { key: 'value', header: 'Value' },
];

// DEFINISI KOLOM UNTUK TABEL MENTAH (Dipertahankan)
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
  // State baru untuk menyimpan data ringkasan dari backend
  const [summaryMetrics, setSummaryMetrics] = useState<SummaryMetric[]>([]);
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
        const response = await fetch(`/api/engagement-data?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch processed engagement data from API.');
        }

        // DESTRUCTURE response dari API Route yang terstruktur
        const { engagements: detailedEngagements, summary: calculatedSummary } = await response.json();
        
        setEngagements(detailedEngagements);
        setSummaryMetrics(calculatedSummary); // Set data ringkasan yang sudah dihitung
        
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

        {/* ---------------------------------------------------- */}
        {/* 1. TABEL RINGKASAN (Menggunakan state summaryMetrics) */}
        {/* ---------------------------------------------------- */}
        <h2 className="text-xl font-semibold mb-4 mt-4">Engagement Metrics Overview</h2>
        <div className="mb-8">
            {loading ? (
                <div style={{ color: 'var(--color-text-secondary)' }}>Calculating summary metrics...</div>
            ) : (
                <AnalyticsTable 
                    title=""
                    columns={SUMMARY_COLUMNS}
                    data={summaryMetrics} // Data sudah dihitung oleh Backend
                />
            )}
        </div>
        
        <hr className="mb-8" style={{borderColor: 'var(--color-border-subtle)'}} />

        {/* ---------------------------------------------------- */}
        {/* 2. TABEL MENTAH */}
        {/* ---------------------------------------------------- */}
        <h2 className="text-xl font-semibold mb-4 mt-8">Raw Session Engagement Data Table</h2>
        <div className="mb-8">
            {loading ? (
                <div style={{ color: 'var(--color-text-secondary)' }}>Loading session data...</div>
            ) : (
                <AnalyticsTable 
                    title=""
                    columns={ENGAGEMENT_COLUMNS}
                    data={engagements} 
                />
            )}
        </div>

      </div>
    </Layout>
  );
}
