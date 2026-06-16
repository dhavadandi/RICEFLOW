import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle } from 'lucide-react';

const REGIONS = ['Garut', 'Indramayu', 'Karawang', 'Subang', 'Tasikmalaya'];
const STAGES  = ['Petani', 'Penggilingan', 'Tengkulak', 'Grosir', 'Ritel'];

const EFF: Record<string, number[]> = {
  Garut:       [0.61, 0.55, 0.48, 0.27, 0.71],
  Indramayu:   [0.72, 0.68, 0.52, 0.31, 0.76],
  Karawang:    [0.69, 0.63, 0.44, 0.25, 0.78],
  Subang:      [0.65, 0.57, 0.41, 0.29, 0.73],
  Tasikmalaya: [0.58, 0.51, 0.38, 0.22, 0.68],
};

function cellStyle(v: number) {
  if (v >= 0.70) return { bg: '#D4EDE6', color: '#0A5540' };
  if (v >= 0.40) return { bg: '#FDF5E8', color: '#7A4E00' };
  return { bg: '#FAE0D5', color: '#A83A15' };
}

const bottlenecks = [
  { region: 'Tasikmalaya', weakStage: 'Grosir', eff: 0.22, gap: 0.50, severity: 'critical' },
  { region: 'Karawang',    weakStage: 'Grosir', eff: 0.25, gap: 0.47, severity: 'critical' },
  { region: 'Garut',       weakStage: 'Grosir', eff: 0.27, gap: 0.45, severity: 'critical' },
  { region: 'Indramayu',   weakStage: 'Grosir', eff: 0.31, gap: 0.41, severity: 'high' },
  { region: 'Subang',      weakStage: 'Grosir', eff: 0.29, gap: 0.43, severity: 'critical' },
  { region: 'Tasikmalaya', weakStage: 'Tengkulak', eff: 0.38, gap: 0.34, severity: 'high' },
  { region: 'Garut',       weakStage: 'Tengkulak', eff: 0.48, gap: 0.24, severity: 'moderate' },
];

const stageComparison = STAGES.map((s, i) => ({
  stage: s,
  avgEff: parseFloat((Object.values(EFF).reduce((sum, r) => sum + r[i], 0) / 5).toFixed(3)),
  minEff: parseFloat((Math.min(...Object.values(EFF).map(r => r[i]))).toFixed(3)),
  maxEff: parseFloat((Math.max(...Object.values(EFF).map(r => r[i]))).toFixed(3)),
}));

export function NetworkDEAPage() {
  const [hoveredCell, setHoveredCell] = useState<{ r: string; s: string; v: number } | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const flowData = selectedRegion
    ? STAGES.map((s, i) => ({ stage: s, value: EFF[selectedRegion][i] }))
    : STAGES.map((s, i) => ({ stage: s, value: parseFloat((Object.values(EFF).reduce((sum, r) => sum + r[i], 0) / 5).toFixed(3)) }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <p style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '3px' }}>White-Box DEA Diagnostics</p>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#262626', margin: 0 }}>Network DEA Analysis</h2>
        <p style={{ fontSize: '12px', color: '#7A7A72', marginTop: '3px' }}>5-stage network model revealing hidden sub-stage inefficiencies invisible at aggregate level.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px', alignItems: 'start' }}>
        {/* Large Heatmap */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '20px' }}>
          <div style={{ marginBottom: '14px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '3px' }}>Region × Stage Efficiency Matrix</p>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#262626', margin: 0 }}>Network DEA Heatmap</h3>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              {[{ label: '≥ 0.70 Efficient', bg: '#D4EDE6', color: '#0A5540' }, { label: '0.40–0.70 Moderate', bg: '#FDF5E8', color: '#7A4E00' }, { label: '< 0.40 Bottleneck', bg: '#FAE0D5', color: '#A83A15' }].map(l => (
                <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10.5px', color: '#7A7A72' }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: l.bg, display: 'inline-block' }} />{l.label}
                </span>
              ))}
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '3px' }}>
            <thead>
              <tr>
                <th style={{ padding: '7px 10px', textAlign: 'left', fontSize: '11px', color: '#A8A89E', fontWeight: 600, width: 120 }}>Region</th>
                {STAGES.map(s => (
                  <th key={s} style={{ padding: '7px 10px', textAlign: 'center', fontSize: '11px', color: '#7A7A72', fontWeight: 600 }}>{s}</th>
                ))}
                <th style={{ padding: '7px 10px', textAlign: 'center', fontSize: '11px', color: '#A8A89E', fontWeight: 600 }}>Avg</th>
              </tr>
            </thead>
            <tbody>
              {REGIONS.map(reg => {
                const row = EFF[reg];
                const avg = parseFloat((row.reduce((s, v) => s + v, 0) / row.length).toFixed(3));
                const avgStyle = cellStyle(avg);
                return (
                  <tr key={reg}>
                    <td
                      style={{ padding: '8px 10px', fontSize: '12.5px', fontWeight: selectedRegion === reg ? 700 : 500, color: selectedRegion === reg ? '#0F6E56' : '#262626', cursor: 'pointer' }}
                      onClick={() => setSelectedRegion(selectedRegion === reg ? null : reg)}
                    >
                      {reg}
                    </td>
                    {row.map((v, ci) => {
                      const s = cellStyle(v);
                      const isHovered = hoveredCell?.r === reg && hoveredCell?.s === STAGES[ci];
                      return (
                        <td key={ci}
                          onMouseEnter={() => setHoveredCell({ r: reg, s: STAGES[ci], v })}
                          onMouseLeave={() => setHoveredCell(null)}
                          style={{ padding: '10px 14px', textAlign: 'center', borderRadius: '5px', background: s.bg, color: s.color, fontSize: '13.5px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.01em', cursor: 'default', transform: isHovered ? 'scale(1.06)' : 'none', transition: 'transform 0.15s', outline: isHovered ? `2px solid ${s.color}44` : 'none' }}>
                          {v.toFixed(2)}
                        </td>
                      );
                    })}
                    <td style={{ padding: '10px 14px', textAlign: 'center', borderRadius: '5px', background: avgStyle.bg, color: avgStyle.color, fontSize: '13px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
                      {avg}
                    </td>
                  </tr>
                );
              })}
              {/* Stage average row */}
              <tr style={{ borderTop: '2px solid #E8E5DD' }}>
                <td style={{ padding: '8px 10px', fontSize: '11px', color: '#A8A89E', fontWeight: 600 }}>Stage avg</td>
                {stageComparison.map(s => {
                  const st = cellStyle(s.avgEff);
                  return (
                    <td key={s.stage} style={{ padding: '8px 14px', textAlign: 'center', fontSize: '12px', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', color: st.color, background: st.bg, borderRadius: '4px' }}>
                      {s.avgEff}
                    </td>
                  );
                })}
                <td />
              </tr>
            </tbody>
          </table>

          {hoveredCell && (
            <div style={{ marginTop: '10px', padding: '8px 12px', background: '#F8F7F4', borderRadius: '7px', fontSize: '11px', color: '#4A4A44' }}>
              <strong>{hoveredCell.r} · {hoveredCell.s}:</strong> Efficiency {hoveredCell.v.toFixed(2)} — {hoveredCell.v >= 0.70 ? 'Operating efficiently' : hoveredCell.v >= 0.40 ? 'Moderate — review cost structure' : 'Critical bottleneck — immediate intervention needed'}
            </div>
          )}
        </div>

        {/* Right Panel: Bottleneck Detector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <AlertTriangle size={14} strokeWidth={2} color="#C0392B" />
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#262626', margin: 0 }}>Hidden Bottleneck Detector</h3>
            </div>
            <p style={{ fontSize: '11px', color: '#7A7A72', marginBottom: '12px', lineHeight: 1.4 }}>
              Stage-region pairs with efficiency far below the network aggregate — invisible in system-level scores.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 60px 60px', gap: '8px', padding: '0 4px 7px', borderBottom: '1px solid #E8E5DD' }}>
                {['Region', 'Weak Stage', 'Eff.', 'Gap'].map(h => (
                  <span key={h} style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#A8A89E' }}>{h}</span>
                ))}
              </div>
              {bottlenecks.map((b, i) => {
                const sevColor = b.severity === 'critical' ? '#C0392B' : b.severity === 'high' ? '#C28B2C' : '#7A7A72';
                const sevBg = b.severity === 'critical' ? '#FEF0ED' : b.severity === 'high' ? '#FDF5E8' : '#F8F7F4';
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 60px 60px', gap: '8px', padding: '7px 4px', borderBottom: '1px solid #F8F7F4', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#262626' }}>{b.region}</span>
                    <span style={{ fontSize: '10px', padding: '2px 6px', background: sevBg, color: sevColor, borderRadius: '3px', fontWeight: 600, textAlign: 'center' }}>{b.weakStage}</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: sevColor }}>{b.eff.toFixed(2)}</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: '#C0392B' }}>−{b.gap.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stage Comparison */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '16px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#262626', marginBottom: '4px' }}>Stage Comparison Matrix</h3>
            <p style={{ fontSize: '11px', color: '#7A7A72', marginBottom: '12px' }}>Min / Mean / Max across 5 regencies</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {stageComparison.map(s => {
                const c = cellStyle(s.avgEff);
                return (
                  <div key={s.stage}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#262626' }}>{s.stage}</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ fontSize: '10px', color: '#C0392B', fontFamily: 'JetBrains Mono, monospace' }}>{s.minEff}</span>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: c.color, fontFamily: 'JetBrains Mono, monospace' }}>{s.avgEff}</span>
                        <span style={{ fontSize: '10px', color: '#0F6E56', fontFamily: 'JetBrains Mono, monospace' }}>{s.maxEff}</span>
                      </div>
                    </div>
                    <div style={{ height: 6, background: '#F0EDE5', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: `${s.minEff * 100}%`, width: `${(s.maxEff - s.minEff) * 100}%`, height: '100%', background: c.bg, borderRadius: 3 }} />
                      <div style={{ position: 'absolute', left: `${s.avgEff * 100 - 1}%`, width: 3, height: '100%', background: c.color, borderRadius: 2 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Network Flow */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '20px' }}>
        <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '3px' }}>
              Network Flow Diagram — {selectedRegion ?? 'All Regions (Average)'}
            </p>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#262626', margin: 0 }}>Efficiency Transmission Across Stages</h3>
          </div>
          {selectedRegion && (
            <button onClick={() => setSelectedRegion(null)} style={{ fontSize: '11px', color: '#7A7A72', background: 'none', border: '1px solid #E8E5DD', borderRadius: '5px', padding: '4px 10px', cursor: 'pointer' }}>
              Clear filter
            </button>
          )}
        </div>

        <ResponsiveContainer width="100%" height={130}>
          <BarChart data={flowData} margin={{ top: 10, right: 20, left: -14, bottom: 0 }} barCategoryGap="38%">
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(44,44,42,0.07)" />
            <XAxis dataKey="stage" tick={{ fontSize: 11, fill: '#7A7A72' }} axisLine={{ stroke: '#E8E5DD' }} tickLine={false} />
            <YAxis domain={[0, 1]} tickCount={5} tick={{ fontSize: 10, fill: '#A8A89E', fontFamily: 'JetBrains Mono, monospace' }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v: number) => [v.toFixed(3), 'Efficiency']} contentStyle={{ background: '#262626', border: 'none', borderRadius: 6, fontSize: 11, color: '#F8F7F4' }} />
            <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={60}>
              {flowData.map((d) => <Cell key={d.stage} fill={d.value >= 0.70 ? '#0F6E56' : d.value >= 0.40 ? '#C28B2C' : '#C0392B'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <p style={{ fontSize: '11px', color: '#A8A89E', marginTop: '8px', fontStyle: 'italic' }}>
          Click a region row in the heatmap above to filter by region. Grosir stage represents a systemic efficiency drop across all 5 regencies.
        </p>
      </div>
    </div>
  );
}
