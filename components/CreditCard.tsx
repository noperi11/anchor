// components/CreditCard.tsx

import React from 'react';

type Props = {
    amount: string | number;
};

export default function CreditCard({ amount }: Props) {
    return (
        // Glassmorphism Card (kecil) dengan border kiri Neon Accent
        <div 
            className="glass-effect p-3 rounded-xl flex items-center justify-center 
                       border-l-4 transition-all duration-300"
            style={{ 
                borderLeftColor: 'var(--color-accent)', // Border Neon
                minWidth: '200px', // Lebar minimum agar terlihat seperti tombol/card
            }}
        >
            <p className="text-sm uppercase tracking-wider font-medium" 
               style={{ color: 'var(--color-text-secondary)' }}
            >
                Credit : 
            </p>
            {/* Nilai Credit dengan warna Neon Aksen */}
            <span 
                className="text-base font-bold ml-2"
                style={{ color: 'var(--color-accent)' }}
            >
                ${amount}
            </span>
        </div>
    );
}
