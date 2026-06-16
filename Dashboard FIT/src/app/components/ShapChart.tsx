import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const shapData = [
  { name: 'Total cost (scale)', value: 0.076 },
  { name: 'Equipment rent share', value: 0.036 },
  { name: 'Land lease share', value: 0.022 },
  { name: 'Labor share', value: 0.016 },
];

const TERRACOTTA = '#D85A30';

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { value: number; payload: { name: string } }[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#262626', color: '#F8F7F4', padding: '8px 12px', borderRadius: 6, fontSize: '11px', lineHeight: 1.5 }}>
      <div style={{ fontWeight: 600, marginBottom: 2 }}>{payload[0].payload.name}</div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', color: TERRACOTTA }}>SHAP: {payload[0].value.toFixed(3)}</div>
    </div>
  );
}

export function ShapChart() {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '16px' }}>
      <div style={{ marginBottom: '12px' }}>
        <p style={{ fontSize: '9.5px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '3px' }}>
          Explainability · XGBoost SHAP
        </p>
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#262626', lineHeight: 1.3 }}>
          Inefficiency Drivers
        </h3>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={shapData} layout="vertical" margin={{ top: 4, right: 30, left: 8, bottom: 0 }} barCategoryGap="30%">
          <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="rgba(44,44,42,0.07)" />
          <XAxis
            type="number"
            domain={[0, 0.085]}
            tickCount={5}
            tick={{ fontSize: 10, fill: '#A8A89E', fontFamily: 'JetBrains Mono, monospace' }}
            axisLine={{ stroke: '#E8E5DD' }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            tick={{ fontSize: 10.5, fill: '#4A4A44', fontFamily: 'Inter, sans-serif' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(216,90,48,0.05)' }} />
          <Bar dataKey="value" radius={[0, 3, 3, 0]} maxBarSize={18}>
            {shapData.map((_, i) => (
              <Cell key={i} fill={TERRACOTTA} fillOpacity={1 - i * 0.15} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <p style={{ marginTop: '8px', fontSize: '10px', color: '#A8A89E', lineHeight: 1.4, fontStyle: 'italic' }}>
        Mean |SHAP| from XGBoost binary classifier · 10-fold CV
      </p>
    </div>
  );
}
