import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const applicationTrend = [
  { week: 'Mar 3', applied: 4, interviews: 1 },
  { week: 'Mar 10', applied: 7, interviews: 2 },
  { week: 'Mar 17', applied: 5, interviews: 1 },
  { week: 'Mar 24', applied: 9, interviews: 3 },
  { week: 'Mar 31', applied: 6, interviews: 2 },
  { week: 'Apr 7', applied: 11, interviews: 4 },
  { week: 'Apr 14', applied: 8, interviews: 3 },
  { week: 'Apr 21', applied: 13, interviews: 5 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs text-neutral-400 mb-2 font-medium">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: entry.color }} />
          <span className="text-neutral-400">{entry.name}:</span>
          <span className="text-neutral-100 font-semibold ml-auto pl-4">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const ApplicationChart = () => (
  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 h-full">
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-neutral-100">Application Trends</h2>
      <p className="text-xs text-neutral-500 mt-1">Weekly applications & interviews over 8 weeks</p>
    </div>
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={applicationTrend} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
        <XAxis
          dataKey="week"
          tick={{ fill: '#737373', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          dy={8}
        />
        <YAxis tick={{ fill: '#737373', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#404040', strokeWidth: 1 }} />
        <Legend
          wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
          formatter={(value) => <span style={{ color: '#a3a3a3' }}>{value}</span>}
        />
        <Line
          type="monotone"
          dataKey="applied"
          name="Applied"
          stroke="#14b8a6"
          strokeWidth={2}
          dot={{ fill: '#14b8a6', r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#14b8a6', stroke: '#0d9488', strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="interviews"
          name="Interviews"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={{ fill: '#8b5cf6', r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#8b5cf6', stroke: '#7c3aed', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export { ApplicationChart };

