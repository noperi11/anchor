import React from 'react';

// Definisikan tipe untuk data dan kolom agar lebih aman
type Column = {
  key: string; // Kunci properti yang akan diambil dari objek data
  header: string; // Teks yang ditampilkan di header tabel
};

type Props = {
  data: any[]; // Array of objects (e.g., Engagement[])
  columns: Column[]; // Array of column definitions
  title: string; // Judul Tabel
};

export default function AnalyticsTable({ data, columns, title }: Props) {
  // Semua styling Dark Mode sudah konsisten
  return (
    <div 
      style={{
        backgroundColor: 'var(--color-bg-surface)', 
        borderColor: 'var(--color-border-subtle)',
      }}
      className="p-6 border rounded-xl"
    >
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      <table className="w-full text-left">
        <thead>
          {/* BARIS HEADER */}
          <tr 
            className="border-b"
            style={{ 
              color: 'var(--color-text-secondary)',
              borderBottomColor: 'var(--color-border-subtle)',
            }}
          >
            {/* Menggunakan COLUMNS yang dinamis */}
            {columns.map((col) => (
              <th key={col.key} className="py-2">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* Menangani Data Kosong */}
          {data.length === 0 ? (
             <tr>
                <td colSpan={columns.length} className="py-4 text-center" style={{color: 'var(--color-text-secondary)'}}>
                  Tidak ada data yang ditemukan.
                </td>
             </tr>
          ) : (
             // Memetakan baris data
            data.map((row: any, rowIndex: number) => (
              <tr 
                key={rowIndex} 
                className="border-b"
                style={{ borderBottomColor: 'var(--color-border-subtle)' }}
              >
                {/* Memetakan sel data berdasarkan key kolom */}
                {columns.map((col) => (
                  <td key={`${rowIndex}-${col.key}`} className="py-2">
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
