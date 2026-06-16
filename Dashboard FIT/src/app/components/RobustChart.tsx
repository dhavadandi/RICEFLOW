import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const robustData = [
  { region: 'Garut', value: 0.54 },
  { region: 'Indramayu', value: 0.63 },
  { region: 'Karawang', value: 0.61 },
  { region: 'Subang', value: 0.58 },
  { region: 'Tasikmalaya', value: 0.52 },
];

const TEAL = '#0F6E56';

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { value: number; payload: { region: string } }[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#262626', color: '#F8F7F4', padding: '8px 12px', borderRadius: 6, fontSize: '11px', lineHeight: 1.5 }}>
      <div style={{ fontWeight: 600, marginBottom: 2 }}>{payload[0].payload.region}</div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#4DAA8E' }}>Index: {payload[0].value.toFixed(2)}</div>
    </div>
  );
}

export function RobustChart() {
  const avg = robustData.reduce((s, d) => s + d.value, 0) / robustData.length;

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '16px' }}>
      <div style={{ marginBottom: '12px' }}>
        <p style={{ fontSize: '9.5px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '3px' }}>
          Robust DEA · Geometric Mean
        </p>
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#262626', lineHeight: 1.3 }}>
          Robust Chain Index
        </h3>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={robustData} margin={{ top: 10, right: 20, left: -14, bottom: 0 }} barCategoryGap="38%">
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(44,44,42,0.07)" />
          <XAxis
            dataKey="region"
            tick={{ fontSize: 10, fill: '#7A7A72', fontFamily: 'Inter, sans-serif' }}
            axisLine={{ stroke: '#E8E5DD' }}
            tickLine={false}
          />
          <YAxis
            domain={[0.46, 0.68]}
            tickCount={5}
            tick={{ fontSize: 10, fill: '#A8A89E', fontFamily: 'JetBrains Mono, monospace' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(15,110,86,0.05)' }} />
          <ReferenceLine
            y={avg}
            stroke="rgba(15,110,86,0.5)"
            strokeDasharray="5 3"
            label={{ value: `avg ${avg.toFixed(2)}`, fontSize: 9, fill: '#7A7A72', fontFamily: 'JetBrains Mono, monospace', position: 'insideTopRight' }}
          />
          <Bar dataKey="value" fill={TEAL} radius={[3, 3, 0, 0]} maxBarSize={38} />
        </BarChart>
      </ResponsiveContainer>

      <p style={{ marginTop: '8px', fontSize: '10px', color: '#A8A89E', lineHeight: 1.4 }}>
        Geometric mean of BCC scores under ε-perturbation bounds
      </p>
    </div>
  );
}
