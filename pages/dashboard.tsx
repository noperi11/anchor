"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useRouter } from "next/router";

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.email}</h1>
      <h2 className="text-xl font-semibold mb-6">Your Engagement Analytics</h2>

      {/* 🔹 Tombol Navigasi */}
      <div className="flex gap-4 mb-8">
        <a
          href="/products"
          className="bg-blue-600 hover:bg-blue-500 py-2 px-4 rounded-xl"
        >
          Go to Products →
        </a>

        <a
          href="/products/create"
          className="bg-green-600 hover:bg-green-500 py-2 px-4 rounded-xl"
        >
          + Create Product
        </a>
      </div>

      {loading ? (
        <div className="text-gray-400">Loading engagement data...</div>
      ) : engagements.length === 0 ? (
        <div className="text-gray-400">No engagement data found.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {engagements.map((e, idx) => (
            <div
              key={`${e.userId}-${idx}`}
              className="p-4 bg-gray-900 rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-bold mt-2">Score: {e.scoring}</h3>
              <p className="mt-1 text-gray-300">{e.engagement}</p>
              <p className="mt-2 text-sm text-gray-400">
                Context: {e.sessionContext}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
