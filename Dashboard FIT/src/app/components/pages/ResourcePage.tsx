import { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DollarSign, TrendingUp, Target } from 'lucide-react';

interface BubblePoint {
  name: string; x: number; y: number; z: number; priority: number;
  fill: string; region: string; stage: string;
}

const bubbleData: BubblePoint[] = [
  { name: 'Grosir · Tasikmalaya', x: 87, y: 84, z: 164, priority: 1, fill: '#C0392B', region: 'Tasikmalaya', stage: 'Grosir' },
  { name: 'Grosir · Garut',       x: 78, y: 76, z: 158, priority: 2, fill: '#C0392B', region: 'Garut', stage: 'Grosir' },
  { name: 'Grosir · Subang',      x: 74, y: 70, z: 156, priority: 3, fill: '#D85A30', region: 'Subang', stage: 'Grosir' },
  { name: 'Grosir · Karawang',    x: 72, y: 68, z: 160, priority: 4, fill: '#D85A30', region: 'Karawang', stage: 'Grosir' },
  { name: 'Tengkulak · Tasikmalaya', x: 60, y: 58, z: 142, priority: 5, fill: '#C28B2C', region: 'Tasikmalaya', stage: 'Tengkulak' },
  { name: 'Tengkulak · Garut',    x: 52, y: 50, z: 138, priority: 6, fill: '#C28B2C', region: 'Garut', stage: 'Tengkulak' },
  { name: 'Grosir · Indramayu',   x: 48, y: 45, z: 154, priority: 7, fill: '#C28B2C', region: 'Indramayu', stage: 'Grosir' },
  { name: 'Tengkulak · Subang',   x: 40, y: 38, z: 133, priority: 8, fill: '#BA7517', region: 'Subang', stage: 'Tengkulak' },
  { name: 'Penggilingan · Tasikmalaya', x: 35, y: 32, z: 128, priority: 9, fill: '#BA7517', region: 'Tasikmalaya', stage: 'Penggilingan' },
  { name: 'Petani · Garut',       x: 22, y: 20, z: 120, priority: 10, fill: '#2F8F73', region: 'Garut', stage: 'Petani' },
  { name: 'Ritel · Indramayu',    x: 15, y: 12, z: 115, priority: 11, fill: '#0F6E56', region: 'Indramayu', stage: 'Ritel' },
  { name: 'Petani · Karawang',    x: 18, y: 16, z: 118, priority: 12, fill: '#2F8F73', region: 'Karawang', stage: 'Petani' },
];

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: BubblePoint }[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: '#262626', color: '#F8F7F4', padding: '10px 14px', borderRadius: 7, fontSize: '11px', lineHeight: 1.5 }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>Priority #{d.priority}</div>
      <div style={{ fontWeight: 600, color: d.fill }}>{d.name}</div>
      <div>Cost-Cut Potential: {d.x}%</div>
      <div>Eff. Improvement: {d.y}%</div>
      <div>DMUs: {d.z}</div>
    </div>
  );
}

const TOTAL_BUDGET = 14600;

export function ResourcePage() {
  const [budget, setBudget] = useState(8000);
  const [selected, setSelected] = useState<string | null>(null);
  const [allocated, setAllocated] = useState(false);

  const coveredPoints = bubbleData.filter((_, i) => {
    const cumCost = bubbleData.slice(0, i + 1).reduce((s, d) => s + d.z * 20, 0) / 1000;
    return cumCost <= budget;
  });

  const expectedSaving = parseFloat(((budget / TOTAL_BUDGET) * 32.8).toFixed(1));
  const expectedEffGain = parseFloat(((budget / TOTAL_BUDGET) * 0.24).toFixed(3));

  const sel = selected ? bubbleData.find(d => d.name === selected) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <p style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '3px' }}>Investment Planning</p>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#262626', margin: 0 }}>Resource Allocation</h2>
        <p style={{ fontSize: '12px', color: '#7A7A72', marginTop: '3px' }}>Identify highest-return intervention targets. Bubble size = DMU count. Click bubble for details.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '16px', alignItems: 'start' }}>
        {/* Priority Matrix */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '20px' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '4px' }}>Strategic Priority Matrix</p>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#262626', marginBottom: '4px' }}>Cost-Cut Potential × Efficiency Improvement Potential</h3>
          <p style={{ fontSize: '11px', color: '#7A7A72', marginBottom: '14px' }}>Upper-right quadrant = highest-priority interventions. Bubble size represents DMU count.</p>

          <ResponsiveContainer width="100%" height={340}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,44,42,0.07)" />
              <XAxis type="number" dataKey="x" name="Cost-Cut Potential" domain={[0, 100]} tick={{ fontSize: 10, fill: '#A8A89E', fontFamily: 'JetBrains Mono, monospace' }} axisLine={{ stroke: '#E8E5DD' }} tickLine={false} label={{ value: 'Cost-Cut Potential (%)', position: 'insideBottom', offset: -12, fontSize: 11, fill: '#7A7A72' }} />
              <YAxis type="number" dataKey="y" name="Efficiency Improvement" domain={[0, 100]} tick={{ fontSize: 10, fill: '#A8A89E', fontFamily: 'JetBrains Mono, monospace' }} axisLine={false} tickLine={false} label={{ value: 'Efficiency Improvement Potential (%)', angle: -90, position: 'insideLeft', offset: 14, fontSize: 11, fill: '#7A7A72' }} />
              <ZAxis type="number" dataKey="z" range={[400, 2400]} />
              <Tooltip content={<CustomTooltip />} />
              <Scatter data={bubbleData} onClick={d => setSelected((d as BubblePoint).name === selected ? null : (d as BubblePoint).name)}>
                {bubbleData.map(d => (
                  <Cell key={d.name} fill={d.fill} fillOpacity={selected && selected !== d.name ? 0.25 : 0.80} stroke={selected === d.name ? '#262626' : 'transparent'} strokeWidth={2} style={{ cursor: 'pointer' }} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>

          {/* Quadrant labels */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
            {[
              { label: 'Top-Right: High Priority', desc: 'High cost saving + high efficiency gain', color: '#C0392B', bg: '#FEF0ED' },
              { label: 'Bottom-Right: Cost Focus', desc: 'High cost saving, lower efficiency gain', color: '#C28B2C', bg: '#FDF5E8' },
              { label: 'Top-Left: Eff. Focus', desc: 'Lower cost saving, high efficiency gain', color: '#2563EB', bg: '#EFF4FE' },
              { label: 'Bottom-Left: Low Priority', desc: 'Low cost saving + low efficiency gain', color: '#7A7A72', bg: '#F8F7F4' },
            ].map(q => (
              <div key={q.label} style={{ display: 'flex', gap: '6px', padding: '7px 10px', background: q.bg, borderRadius: '6px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: q.color, flexShrink: 0, marginTop: 3 }} />
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: q.color, margin: 0 }}>{q.label}</p>
                  <p style={{ fontSize: '10px', color: '#7A7A72', margin: 0 }}>{q.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Simulator + Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Budget Simulator */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <DollarSign size={14} strokeWidth={1.8} color="#0F6E56" />
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#262626', margin: 0 }}>Budget Allocation Simulator</h3>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <label style={{ fontSize: '11px', color: '#7A7A72', fontWeight: 500 }}>Intervention Budget</label>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F6E56', fontFamily: 'JetBrains Mono, monospace' }}>Rp {budget.toLocaleString()}M</span>
              </div>
              <input type="range" min={500} max={TOTAL_BUDGET} step={100} value={budget} onChange={e => { setBudget(Number(e.target.value)); setAllocated(false); }}
                style={{ width: '100%', accentColor: '#0F6E56', display: 'block', height: 3, cursor: 'pointer' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
                <span style={{ fontSize: '10px', color: '#A8A89E' }}>Rp 500M</span>
                <span style={{ fontSize: '10px', color: '#A8A89E' }}>Rp {TOTAL_BUDGET}M (max)</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              {[
                { label: 'Expected Saving', value: `${expectedSaving}%`, icon: TrendingUp, color: '#0F6E56', bg: '#E8F5F1' },
                { label: 'Efficiency Gain', value: `+${expectedEffGain}`, icon: Target, color: '#2563EB', bg: '#EFF4FE' },
                { label: 'Target DMUs', value: coveredPoints.reduce((s, d) => s + d.z, 0).toString(), icon: Target, color: '#C28B2C', bg: '#FDF5E8' },
                { label: 'Budget Coverage', value: `${((budget / TOTAL_BUDGET) * 100).toFixed(0)}%`, icon: DollarSign, color: '#6B5B95', bg: '#F3F0FA' },
              ].map(m => {
                const Icon = m.icon;
                return (
                  <div key={m.label} style={{ background: m.bg, borderRadius: '7px', padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                      <Icon size={11} strokeWidth={2} color={m.color} />
                      <span style={{ fontSize: '10px', color: m.color, fontWeight: 600 }}>{m.label}</span>
                    </div>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: m.color, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.02em', lineHeight: 1 }}>{m.value}</p>
                  </div>
                );
              })}
            </div>

            <button onClick={() => setAllocated(true)}
              style={{ width: '100%', padding: '10px', background: '#0F6E56', color: '#FFFFFF', border: 'none', borderRadius: '7px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
              Allocate Budget
            </button>
            {allocated && (
              <p style={{ fontSize: '11px', color: '#0F6E56', marginTop: '8px', textAlign: 'center' }}>
                Budget allocated to top {coveredPoints.length} stage-region pairs
              </p>
            )}
          </div>

          {/* Priority Ranking Table */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '16px' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#262626', marginBottom: '10px' }}>Priority Ranking Table</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr 48px 48px', gap: '8px', padding: '0 4px 6px', borderBottom: '1px solid #E8E5DD' }}>
                {['#', 'Target', 'Cost%', 'Eff%'].map(h => (
                  <span key={h} style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#A8A89E', textAlign: h === '#' ? 'left' : h === 'Target' ? 'left' : 'right' }}>{h}</span>
                ))}
              </div>
              {bubbleData.slice(0, 8).map((d, i) => (
                <div key={d.name} onClick={() => setSelected(d.name === selected ? null : d.name)}
                  style={{ display: 'grid', gridTemplateColumns: '24px 1fr 48px 48px', gap: '8px', padding: '6px 4px', borderRadius: '5px', background: selected === d.name ? '#E8F5F1' : 'transparent', cursor: 'pointer', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#A8A89E', fontFamily: 'JetBrains Mono' }}>P{i + 1}</span>
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: 600, color: '#262626', margin: 0, lineHeight: 1.2 }}>{d.stage}</p>
                    <p style={{ fontSize: '10px', color: '#7A7A72', margin: 0 }}>{d.region}</p>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: d.fill, textAlign: 'right', fontFamily: 'JetBrains Mono' }}>{d.x}%</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#262626', textAlign: 'right', fontFamily: 'JetBrains Mono' }}>{d.y}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected bubble detail */}
      {sel && (
        <div style={{ background: '#FFFFFF', border: `1px solid ${sel.fill}44`, borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: '3px', background: sel.fill, color: '#FFFFFF' }}>Priority #{sel.priority}</span>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#262626', margin: '6px 0 3px' }}>{sel.name}</h3>
              <p style={{ fontSize: '12px', color: '#7A7A72' }}>Stage-Region Intervention Target</p>
            </div>
            {[
              { label: 'Cost-Cut Potential', value: `${sel.x}%` },
              { label: 'Eff. Improvement', value: `${sel.y}%` },
              { label: 'DMUs Affected', value: sel.z.toString() },
              { label: 'Est. Investment', value: `Rp ${(sel.z * 20).toLocaleString()}M` },
            ].map(m => (
              <div key={m.label} style={{ padding: '10px 16px', background: '#FAFAF8', borderRadius: '8px' }}>
                <p style={{ fontSize: '10px', color: '#7A7A72', marginBottom: '3px' }}>{m.label}</p>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#262626', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.02em' }}>{m.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
