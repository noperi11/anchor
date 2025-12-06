export default function AnalyticsTable({ data }: any) {
  return (
    <div 
      style={{
        backgroundColor: 'var(--color-bg-surface)', 
        borderColor: 'var(--color-border-subtle)',
      }}
      className="p-6 border rounded-xl"
    >
      <h2 className="text-xl font-semibold mb-4">Engagement Analytics</h2>

      <table className="w-full text-left">
        <thead>
          {/* BARIS YANG DIPERBAIKI: Menggabungkan semua styling ke dalam satu atribut style */}
          <tr 
            className="border-b"
            style={{ 
              color: 'var(--color-text-secondary)', // Warna teks sekunder
              borderBottomColor: 'var(--color-border-subtle)', // Border bawah yang lembut
            }}
          >
            <th className="py-2">Metric</th>
            <th className="py-2">Value</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row: any) => (
            <tr 
              key={row.id} 
              // Menggunakan subtle border yang sedikit lebih gelap (atau sama) untuk pemisah baris
              className="border-b"
              style={{ borderBottomColor: 'var(--color-border-subtle)' }} // Hanya satu style di sini
            >
              <td className="py-2">{row.metric_name}</td>
              <td className="py-2">{row.metric_value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
