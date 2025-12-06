"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Layout from "../components/Layout";
import AnalyticsTable from "../components/AnalyticsTable";
import CreditCard from "../components/CreditCard"; // Import CreditCard yang baru


// -----------------------------------------------------------------
// KOMPONEN DASHBOARD
// -----------------------------------------------------------------

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [engagements, setEngagements] = useState<Engagement[]>([]);
    const [summaryMetrics, setSummaryMetrics] = useState<SummaryMetric[]>([]);
    const [loading, setLoading] = useState(true);

    // DUMMY DATA UNTUK CREDIT CARD
    const dummyCredit = "221.90"; // Nilai Saldo

    useEffect(() => {
        // ... (Logika fetch data tetap sama) ...
        const stored = localStorage.getItem("app_user");
        if (!stored) {
          router.push("/login");
          return;
        }
    
        const parsed: User = JSON.parse(stored);
        setUser(parsed);
    
        async function fetchEngagementFromAPI() {
            // ... (Logika fetch API tetap sama) ...
          setLoading(true);
          const userId = parsed.id;
    
          try {
            const response = await fetch(`/api/engagement-data?userId=${userId}`);
            
            if (!response.ok) {
              throw new Error('Failed to fetch processed engagement data from API.');
            }
    
            const { engagements: detailedEngagements, summary: calculatedSummary } = await response.json();
            
            setEngagements(detailedEngagements);
            setSummaryMetrics(calculatedSummary); 
            
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
            <div className="min-h-screen flex items-center justify-center" 
                 style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
            >
                Loading...
            </div>
        );

    return (
        <Layout>
            <div className="p-2">
                {}
                <div className="flex justify-between items-center mb-10">
                    {/* 1. Judul Welcome */}
                    <h1 
                        className="text-3xl font-bold uppercase" 
                        style={{ color: 'var(--color-text-primary)' }}
                    >
                        Welcome, {user.email}
                    </h1>
                    
                    {/* 2. Credit Card (di sisi kanan) */}
                    <CreditCard amount={dummyCredit} />
                </div>
                {/* ---------------------------------------------------- */}

                {/* ---------------------------------------------------- */}
                {/* TABEL RINGKASAN */}
                {/* ---------------------------------------------------- */}
                
                <div className="mb-8">
                    {loading ? (
                        <div style={{ color: 'var(--color-text-secondary)' }}>Calculating summary metrics...</div>
                    ) : (
                        <AnalyticsTable 
                            title="Engagement Metrics Overview"
                            columns={SUMMARY_COLUMNS}
                            data={summaryMetrics}
                        />
                    )}
                </div>
                
                <hr className="mb-8" style={{borderColor: 'var(--color-border-subtle)'}} />

                {/* ---------------------------------------------------- */}
                {/* TABEL MENTAH */}
                {/* ---------------------------------------------------- */}
                
                <div className="mb-8">
                    {loading ? (
                        <div style={{ color: 'var(--color-text-secondary)' }}>Loading session data...</div>
                    ) : (
                        <AnalyticsTable 
                            title="Raw Session Engagement Data Table"
                            columns={ENGAGEMENT_COLUMNS}
                            data={engagements} 
                        />
                    )}
                </div>

            </div>
        </Layout>
    );
}
