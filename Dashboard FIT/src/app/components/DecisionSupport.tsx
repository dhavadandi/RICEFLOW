import { useState } from 'react';

function classify(labor: number, material: number, overhead: number): {
  label: string;
  color: string;
  bg: string;
  recs: string[];
} {
  const total = labor + material + overhead;
  const laborPct = total > 0 ? (labor / total) * 100 : 0;
  const overheadPct = total > 0 ? (overhead / total) * 100 : 0;

  if (laborPct > 42 || overheadPct > 36) {
    return {
      label: 'Needs Intervention',
      color: '#A83A15',
      bg: '#FAE0D5',
      recs: [
        'Restructure labor contracts to reduce fixed-cost share below 38%.',
        'Audit overhead allocation — benchmark against Indramayu benchmark units.',
        'Prioritize Grosir stage: 59.1% cost-cut potential remains unrealized.',
      ],
    };
  }
  if (laborPct > 35 || overheadPct > 28) {
    return {
      label: 'Marginal',
      color: '#7A4E00',
      bg: '#FDF0D5',
      recs: [
        'Monitor cost ratios quarterly; threshold proximity warrants attention.',
        'Explore equipment pooling to reduce fixed rental expenditure.',
        'Cross-reference with Tengkulak slack estimates (34.7% potential).',
      ],
    };
  }
  return {
    label: 'Efficient',
    color: '#0A5540',
    bg: '#D4EDE6',
    recs: [
      'Maintain current cost-structure discipline.',
      'Scale best practices to neighboring Grosir and Tengkulak units.',
      'Continue monitoring Robust DEA index (target ≥ 0.65).',
    ],
  };
}

export function DecisionSupport() {
  const [labor, setLabor] = useState(28);
  const [material, setMaterial] = useState(42);
  const [overhead, setOverhead] = useState(30);

  const result = classify(labor, material, overhead);
  const total = labor + material + overhead;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="mb-6">
        <p style={{ fontSize: '10px', letterSpacing: '0.08em', color: 'var(--muted-foreground)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 500 }}>
          Policy Tool
        </p>
        <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)', lineHeight: 1.4 }}>
          Decision Support — Cost Profile Assessment
        </h3>
        <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginTop: '4px' }}>
          Adjust cost-share inputs to simulate a production unit's efficiency classification.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Labor Share', value: labor, setter: setLabor, key: 'labor' },
          { label: 'Material Share', value: material, setter: setMaterial, key: 'material' },
          { label: 'Overhead Share', value: overhead, setter: setOverhead, key: 'overhead' },
        ].map(({ label, value, setter, key }) => (
          <div key={key}>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted-foreground)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
              {label}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="range"
                min={0}
                max={100}
                value={value}
                onChange={e => setter(Number(e.target.value))}
                style={{ flex: 1, accentColor: '#0F6E56', height: 2, cursor: 'pointer' }}
              />
              <span style={{
                fontSize: '15px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 500,
                color: 'var(--foreground)',
                minWidth: '36px',
                textAlign: 'right',
                letterSpacing: '-0.02em',
              }}>
                {value}
              </span>
            </div>
            <div style={{ marginTop: '4px', height: 3, background: 'rgba(44,44,42,0.08)', borderRadius: 2 }}>
              <div style={{ width: `${value}%`, height: '100%', background: '#0F6E56', borderRadius: 2, opacity: 0.6, transition: 'width 0.2s' }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
        {/* Status */}
        <div style={{ flexShrink: 0 }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.06em', color: 'var(--muted-foreground)', textTransform: 'uppercase', fontWeight: 500, marginBottom: '8px' }}>
            Classification
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '6px',
            background: result.bg,
            border: `1px solid ${result.color}33`,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: result.color, flexShrink: 0 }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: result.color, letterSpacing: '0.01em' }}>
              {result.label}
            </span>
          </div>
          <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
            <div>Labor: {total > 0 ? ((labor / total) * 100).toFixed(1) : 0}%</div>
            <div>Overhead: {total > 0 ? ((overhead / total) * 100).toFixed(1) : 0}%</div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, background: 'var(--border)', alignSelf: 'stretch', flexShrink: 0 }} />

        {/* Recommendations */}
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.06em', color: 'var(--muted-foreground)', textTransform: 'uppercase', fontWeight: 500, marginBottom: '10px' }}>
            Recommendations
          </p>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {result.recs.map((rec, i) => (
              <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{
                  flexShrink: 0,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'var(--muted)',
                  color: 'var(--muted-foreground)',
                  fontSize: '10px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  marginTop: '1px',
                }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--foreground)', lineHeight: 1.55 }}>
                  {rec}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
