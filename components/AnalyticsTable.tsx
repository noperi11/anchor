// components/AnalyticsTable.tsx
import React from 'react';

type Column = {
  key: string; 
  header: string;
};

type Props = {
  data: any[]; 
  columns: Column[];
  title: string; 
};

export default function AnalyticsTable({ data, columns, title }: Props) {
  
  return (
    // 1. KILLER UI CONTAINER: Ganti styling inline dengan Glassmorphism
    <div 
      className="p-6 rounded-xl overflow-hidden glass-effect" 
      // Hapus styling inline untuk bg-surface dan border-subtle karena sudah dihandle oleh .glass-effect
    >
      
      {/* 2. JUDUL: Gunakan warna aksen Neon */}
      <h2 
        className="text-2xl font-bold mb-6 tracking-wider" 
        style={{ color: 'var(--color-accent)' }}
      >
        {title}
      </h2>

      {/* 3. PERBAIKI LEBAR TABEL: w-full sudah benar, tetapi container luar menentukan batas */}
      <div className="overflow-x-auto"> {/* Tambahkan wrapper untuk scroll horizontal jika terlalu lebar */}
        <table className="w-full text-left border-collapse">
          <thead>
            {/* BARIS HEADER: Tebal, Muted, dan dengan garis yang jelas */}
            <tr 
              style={{ 
                color: 'var(--color-text-secondary)',
                borderBottomColor: 'var(--color-border-subtle)',
              }}
            >
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className="py-3 px-2 font-semibold text-sm uppercase" 
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-8 text-center" style={{color: 'var(--color-text-secondary)'}}>
                    Tidak ada data yang ditemukan.
                  </td>
                </tr>
            ) : (
              data.map((row: any, rowIndex: number) => (
                <tr 
                  key={rowIndex} 
                  className="border-b transition-all duration-200"
                  style={{ borderBottomColor: 'var(--color-border-subtle)' }}
                  // 4. KILLER EFFECT: subtle hover background dan neon border left
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderLeft = `4px solid var(--color-accent)`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderLeft = '4px solid transparent';
                  }}
                >
                  {columns.map((col) => (
                    <td 
                      key={`${rowIndex}-${col.key}`} 
                      className="py-3 px-2 text-sm"
                    >
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
