// pages/index.tsx

"use client"; // Diperlukan untuk menggunakan hook di komponen klien

import { useEffect } from 'react';
import { useRouter } from 'next/router'; // *** Import DARI next/router ***

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Pengalihan otomatis saat komponen pertama kali dimuat
    router.push('/login');
    
    // Cleanup function tidak diperlukan di sini
  }, [router]);

  // Opsional: Tampilkan Loading atau pesan singkat saat pengalihan berlangsung
  // Kita menggunakan variabel CSS Killer UI yang sudah kita definisikan.
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center 
        bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] p-6"
    >
      <h1 className="text-4xl font-bold" style={{color: 'var(--color-accent)'}}>
        Mengalihkan...
      </h1>
      <p 
        className="mt-3 text-lg"
        style={{color: 'var(--color-text-secondary)'}}
      >
        Mohon tunggu sebentar, Anda akan diarahkan ke halaman Login.
      </p>
    </div>
  );
}
