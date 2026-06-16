import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend } from 'recharts';
import { TrendingUp, MapPin } from 'lucide-react';

const regionData: Record<string, {
  robust: number; avgEff: number; weakStage: string; weakEff: number;
  costSaving: number; priority: 'Critical' | 'High' | 'Medium' | 'Low';
  stageEffs: number[]; trend: number[];
}> = {
  Garut:       { robust: 0.524, avgEff: 0.524, weakStage: 'Grosir', weakEff: 0.27, costSaving: 42.1, priority: 'High',     stageEffs: [0.61, 0.55, 0.48, 0.27, 0.71], trend: [0.48, 0.50, 0.51, 0.52, 0.524] },
  Indramayu:   { robust: 0.598, avgEff: 0.598, weakStage: 'Grosir', weakEff: 0.31, costSaving: 28.4, priority: 'Medium',   stageEffs: [0.72, 0.68, 0.52, 0.31, 0.76], trend: [0.55, 0.57, 0.58, 0.59, 0.598] },
  Karawang:    { robust: 0.578, avgEff: 0.578, weakStage: 'Grosir', weakEff: 0.25, costSaving: 36.2, priority: 'High',     stageEffs: [0.69, 0.63, 0.44, 0.25, 0.78], trend: [0.53, 0.55, 0.56, 0.57, 0.578] },
  Subang:      { robust: 0.530, avgEff: 0.530, weakStage: 'Grosir', weakEff: 0.29, costSaving: 38.8, priority: 'High',     stageEffs: [0.65, 0.57, 0.41, 0.29, 0.73], trend: [0.49, 0.51, 0.52, 0.52, 0.530] },
  Tasikmalaya: { robust: 0.474, avgEff: 0.474, weakStage: 'Grosir', weakEff: 0.22, costSaving: 52.7, priority: 'Critical', stageEffs: [0.58, 0.51, 0.38, 0.22, 0.68], trend: [0.43, 0.45, 0.46, 0.47, 0.474] },
};

const STAGES = ['Petani', 'Penggilingan', 'Tengkulak', 'Grosir', 'Ritel'];

const mapRegions = [
  { name: 'Karawang',    path: 'M 12 28 L 88 14 L 95 26 L 98 68 L 80 88 L 44 92 L 14 64 Z', lx: 52, ly: 54 },
  { name: 'Subang',      path: 'M 88 14 L 164 10 L 170 24 L 174 70 L 98 68 L 95 26 Z',       lx: 132, ly: 44 },
  { name: 'Indramayu',   path: 'M 164 10 L 284 6 L 290 22 L 282 72 L 174 70 L 170 24 Z',     lx: 226, ly: 40 },
  { name: 'Garut',       path: 'M 14 64 L 80 88 L 98 68 L 174 70 L 164 140 L 128 184 L 48 190 L 10 148 Z', lx: 86, ly: 134 },
  { name: 'Tasikmalaya', path: 'M 174 70 L 282 72 L 292 192 L 128 184 L 164 140 Z',           lx: 216, ly: 148 },
];

function getMapFill(name: string, selected: string | null) {
  const v = regionData[name].robust;
  const base = v >= 0.58 ? '#2F8F73' : v >= 0.54 ? '#C28B2C' : v >= 0.50 ? '#D85A30' : '#C0392B';
  if (selected === name) return '#0F6E56';
  return base;
}

function priorityColor(p: string) {
  if (p === 'Critical') return { color: '#C0392B', bg: '#FEF0ED', border: '#F5C6BC' };
  if (p === 'High')     return { color: '#C28B2C', bg: '#FDF5E8', border: '#EEDCB0' };
  if (p === 'Medium')   return { color: '#2563EB', bg: '#EFF4FE', border: '#BFCFED' };
  return { color: '#0F6E56', bg: '#E8F5F1', border: '#B4DDD3' };
}

const rankingData = Object.entries(regionData)
  .map(([name, d]) => ({ name, value: d.robust }))
  .sort((a, b) => b.value - a.value);

export function RegionalPage() {
  const [selected, setSelected] = useState<string | null>('Tasikmalaya');
  const sel = selected ? regionData[selected] : null;

  const trendData = [2022, 2023, 2024, 2025, 2026].map((yr, i) => {
    const row: Record<string, number | string> = { year: yr.toString() };
    Object.entries(regionData).forEach(([name, d]) => { row[name] = d.trend[i]; });
    return row;
  });

  const trendColors: Record<string, string> = {
    Garut: '#0F6E56', Indramayu: '#2563EB', Karawang: '#C28B2C', Subang: '#6B5B95', Tasikmalaya: '#C0392B',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <p style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '3px' }}>Comparative Analytics</p>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#262626', margin: 0 }}>Regional Performance</h2>
        <p style={{ fontSize: '12px', color: '#7A7A72', marginTop: '3px' }}>Click a region on the map or table to view its full profile.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr 300px', gap: '16px', alignItems: 'start' }}>
        {/* Interactive Map */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '16px' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '4px' }}>Robust DEA Index</p>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#262626', marginBottom: '12px' }}>West Java Interactive Map</h3>
          <svg viewBox="0 0 304 200" style={{ width: '100%', height: 'auto', cursor: 'pointer' }}>
            <path d="M 10 26 L 88 14 L 164 10 L 284 6 L 292 22 L 284 74 L 292 192 L 128 184 L 48 192 L 10 148 Z" fill="none" stroke="#D4D0C8" strokeWidth="1" strokeDasharray="3 2" />
            {mapRegions.map(r => (
              <g key={r.name} onClick={() => setSelected(selected === r.name ? null : r.name)} style={{ cursor: 'pointer' }}>
                <path d={r.path} fill={getMapFill(r.name, selected)} fillOpacity={selected === r.name ? 1 : 0.80} stroke="#FFFFFF" strokeWidth={selected === r.name ? 2.5 : 1.5} />
                <text x={r.lx} y={r.ly - 7} textAnchor="middle" style={{ fontSize: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 700, fill: '#FFFFFF', pointerEvents: 'none' }}>{r.name}</text>
                <text x={r.lx} y={r.ly + 7} textAnchor="middle" style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, fill: 'rgba(255,255,255,0.95)', pointerEvents: 'none' }}>{regionData[r.name].robust.toFixed(2)}</text>
              </g>
            ))}
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '10px' }}>
            {[{ label: '≥ 0.58 Good', fill: '#2F8F73' }, { label: '0.54–0.58 Fair', fill: '#C28B2C' }, { label: '0.50–0.54 At Risk', fill: '#D85A30' }, { label: '< 0.50 Critical', fill: '#C0392B' }].map(l => (
              <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#7A7A72' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: l.fill, display: 'inline-block' }} />{l.label}
              </span>
            ))}
          </div>
        </div>

        {/* Region Profile */}
        {sel && selected ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <MapPin size={14} strokeWidth={1.8} color="#0F6E56" />
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#262626', margin: 0 }}>{selected}</h3>
                    <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: '3px', background: priorityColor(sel.priority).bg, color: priorityColor(sel.priority).color, border: `1px solid ${priorityColor(sel.priority).border}` }}>{sel.priority} Priority</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#7A7A72' }}>Regional Supply Chain Performance Report · FIT 2026</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
                {[
                  { label: 'Robust DEA Index', value: sel.robust.toFixed(3), color: sel.robust >= 0.58 ? '#0F6E56' : sel.robust >= 0.50 ? '#C28B2C' : '#C0392B' },
                  { label: 'Avg Efficiency', value: sel.avgEff.toFixed(3), color: '#262626' },
                  { label: 'Weakest Stage', value: `${sel.weakStage} (${sel.weakEff.toFixed(2)})`, color: '#C0392B' },
                  { label: 'Cost-Cut Potential', value: `${sel.costSaving}%`, color: '#C28B2C' },
                ].map(m => (
                  <div key={m.label} style={{ background: '#FAFAF8', borderRadius: '8px', padding: '12px' }}>
                    <p style={{ fontSize: '10px', color: '#7A7A72', marginBottom: '5px' }}>{m.label}</p>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: m.color, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.02em', lineHeight: 1 }}>{m.value}</p>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '10px' }}>Stage-Level Efficiency Profile</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={STAGES.map((s, i) => ({ stage: s, value: sel.stageEffs[i] }))} margin={{ top: 8, right: 10, left: -14, bottom: 0 }} barCategoryGap="36%">
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(44,44,42,0.07)" />
                  <XAxis dataKey="stage" tick={{ fontSize: 11, fill: '#7A7A72' }} axisLine={{ stroke: '#E8E5DD' }} tickLine={false} />
                  <YAxis domain={[0, 1]} tickCount={5} tick={{ fontSize: 10, fill: '#A8A89E', fontFamily: 'JetBrains Mono, monospace' }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v: number) => [v.toFixed(3), 'Efficiency']} contentStyle={{ background: '#262626', border: 'none', borderRadius: 6, fontSize: 11, color: '#F8F7F4' }} />
                  <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={48}>
                    {sel.stageEffs.map((v, i) => <Cell key={i} fill={v >= 0.70 ? '#0F6E56' : v >= 0.40 ? '#C28B2C' : '#C0392B'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '10px', color: '#A8A89E' }}>
            <MapPin size={32} strokeWidth={1} />
            <p style={{ fontSize: '13px', fontWeight: 500 }}>Click a region to view its profile</p>
          </div>
        )}

        {/* Regional Ranking */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '16px' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '12px' }}>Regional Ranking</p>
          {rankingData.map((r, idx) => {
            const d = regionData[r.name];
            const pc = priorityColor(d.priority);
            const isSelected = selected === r.name;
            return (
              <div key={r.name} onClick={() => setSelected(isSelected ? null : r.name)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 8px', borderRadius: '7px', marginBottom: '4px', cursor: 'pointer', background: isSelected ? '#E8F5F1' : 'transparent', transition: 'background 0.15s' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#A8A89E', fontFamily: 'JetBrains Mono', minWidth: 18 }}>#{idx + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: isSelected ? '#0F6E56' : '#262626' }}>{r.name}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: r.value >= 0.58 ? '#0F6E56' : r.value >= 0.50 ? '#C28B2C' : '#C0392B', fontFamily: 'JetBrains Mono, monospace' }}>{r.value.toFixed(3)}</span>
                  </div>
                  <div style={{ height: 4, background: '#F0EDE5', borderRadius: 2, marginTop: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${r.value * 100}%`, height: '100%', background: r.value >= 0.58 ? '#0F6E56' : r.value >= 0.50 ? '#C28B2C' : '#C0392B', borderRadius: 2 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                    <span style={{ fontSize: '10px', color: '#7A7A72' }}>Weak: {d.weakStage}</span>
                    <span style={{ fontSize: '9px', fontWeight: 600, padding: '1px 5px', borderRadius: 2, background: pc.bg, color: pc.color }}>{d.priority}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trend Comparison */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '20px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '4px' }}>Longitudinal Analysis</p>
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#262626', marginBottom: '14px' }}>Regional Efficiency Trend Comparison (2022–2026)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={trendData} margin={{ top: 5, right: 20, left: -14, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,44,42,0.07)" />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#7A7A72' }} axisLine={{ stroke: '#E8E5DD' }} tickLine={false} />
            <YAxis domain={[0.40, 0.65]} tick={{ fontSize: 10, fill: '#A8A89E', fontFamily: 'JetBrains Mono, monospace' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#262626', border: 'none', borderRadius: 6, fontSize: 11, color: '#F8F7F4' }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {Object.keys(regionData).map(name => (
              <Line key={name} type="monotone" dataKey={name} stroke={trendColors[name]} strokeWidth={selected === name ? 2.5 : 1.5} dot={{ r: 2 }} strokeOpacity={selected && selected !== name ? 0.3 : 1} />
            ))}
          </LineChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
          <TrendingUp size={12} color="#0F6E56" />
          <span style={{ fontSize: '11px', color: '#7A7A72' }}>All regions show gradual improvement 2022–2026. Tasikmalaya remains lowest (0.474) despite efforts — systemic intervention required.</span>
        </div>
      </div>
    </div>
  );
}
