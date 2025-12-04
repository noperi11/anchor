export default function AnalyticsTable({ data }: any) {
  return (
    <div className="bg-[#111] p-6 border border-neutral-800 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Engagement Analytics</h2>

      <table className="w-full text-left">
        <thead>
          <tr className="text-grayText border-b border-neutral-800">
            <th className="py-2">Metric</th>
            <th className="py-2">Value</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row: any) => (
            <tr key={row.id} className="border-b border-neutral-900">
              <td className="py-2">{row.metric_name}</td>
              <td className="py-2">{row.metric_value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
