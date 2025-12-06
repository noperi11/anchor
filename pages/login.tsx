"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from '@/components/Layout'; // Import Layout
import { postJson } from "../lib/apiClient";

// --- Komponen Sederhana Typing Effect ---
const TypingTitle = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText(prev => prev + text[index]);
        setIndex(prev => prev + 1);
      }, 100); 
      return () => clearTimeout(timeoutId);
    }
  }, [index, text]);

  return (
    <h1 
      className="text-4xl font-bold uppercase tracking-wider mb-8" 
      style={{ color: 'var(--color-accent)' }} 
    >
      {displayedText}
      <span className="animate-pulse">_</span>
    </h1>
  );
};
// -------------------------------------------------


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await postJson("/api/login", { email, password });
    setLoading(false);

    console.log("Login response:", res);

    if (res?.error) return setError(res.error);

    localStorage.setItem("app_user", JSON.stringify(res.user));
    router.push("/dashboard");
  }

  // Definisikan class Neon Button
  const neonButtonClass = `
    transition-all duration-300 ease-in-out
    shadow-lg 
    hover:shadow-[0_0_15px_var(--color-accent-darker),_0_0_25px_var(--color-accent-darker)]
    hover:scale-[1.02]
  `;

  return (
    // 1. WRAP DENGAN LAYOUT DAN MATIKAN HEADER
    <Layout showHeader={false}> 
      {/* 2. CENTERING: min-h-[90vh] agar formulir berada di tengah vertikal */}
      <div className="flex items-center justify-center w-full min-h-[90vh]"> 
        <form 
          onSubmit={submit} 
          // 3. FORM: Terapkan Glassmorphism
          className="w-full max-w-md p-10 glass-effect rounded-2xl space-y-6"
        >
          
          <TypingTitle text="LOGIN SYSTEM" />
          
          {/* INPUT FIELDS: Styling global diterapkan di globals.css */}
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl"
          />

          {/* 4. TOMBOL SUBMIT: Neon Glow Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold ${neonButtonClass}`}
            style={{
              backgroundColor: 'var(--color-accent)', 
              color: 'var(--color-bg-primary)',
            }}
          >
            {loading ? "AUTHENTICATING..." : "LOGIN"}
          </button>
          
          {/* ERROR MESSAGE */}
          {error && 
            <div 
              className="mt-4 p-3 rounded text-center font-semibold" 
              style={{ 
                backgroundColor: 'rgba(239, 83, 80, 0.2)', 
                color: 'var(--color-status-danger)' 
              }}
            >
              {error}
            </div>
          }
        </form>
      </div>
    </Layout>
  );
}
