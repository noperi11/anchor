export default function AnalyticsTable({ data }: any) {
  return (
    <div 
      // Mengganti warna hardcoded dengan variabel CSS untuk Dark Mode
      style={{
        backgroundColor: 'var(--color-bg-surface)', 
        borderColor: 'var(--color-border-subtle)',
      }}
      className="p-6 border rounded-xl"
    >
      <h2 className="text-xl font-semibold mb-4">Engagement Analytics</h2>

      <table className="w-full text-left">
        <thead>
          <tr 
            // Menggunakan warna teks sekunder untuk header kolom
            style={{ color: 'var(--color-text-secondary)' }}
            // Menggunakan subtle border untuk pemisah header
            className="border-b"
            style={{ borderBottomColor: 'var(--color-border-subtle)' }}
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
              style={{ borderBottomColor: 'var(--color-border-subtle)' }}
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
