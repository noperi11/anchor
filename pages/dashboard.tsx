"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useRouter } from "next/router";

type Engagement = {
  id: string;
  scoring: number;
  engagement: string;
  created_at: string;
};

type User = {
  id: string;
  email: string;
};

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

    // Fetch Engagement data for this user
    async function fetchEngagement() {
      setLoading(true);
      const { data, error } = await supabase
        .from("Engagement")
        .select("id, scoring, engagement, created_at")
        .eq("user_id", parsed.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching engagement:", error);
        setLoading(false);
        return;
      }

      setEngagements(data || []);
      setLoading(false);
    }

    fetchEngagement();
  }, [router]);

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.email}</h1>
      <h2 className="text-xl font-semibold mb-6">Your Engagement Analytics</h2>

      {loading ? (
        <div className="text-gray-400">Loading engagement data...</div>
      ) : engagements.length === 0 ? (
        <div className="text-gray-400">No engagement data found.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {engagements.map((e) => (
            <div key={e.id} className="p-4 bg-gray-900 rounded-xl shadow hover:shadow-lg transition">
              <p className="text-sm text-gray-400">{new Date(e.created_at).toLocaleDateString()}</p>
              <h3 className="text-lg font-bold mt-2">Score: {e.scoring}</h3>
              <p className="mt-1 text-gray-300">{e.engagement}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
