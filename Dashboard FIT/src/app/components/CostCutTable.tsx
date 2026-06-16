const costCutData = [
  { stage: 'Grosir', pct: 59.1, highlight: true },
  { stage: 'Tengkulak', pct: 34.7, highlight: false },
  { stage: 'Penggilingan', pct: 22.3, highlight: false },
  { stage: 'Petani', pct: 18.6, highlight: false },
  { stage: 'Ritel', pct: 12.4, highlight: false },
];

export function CostCutTable() {
  const max = costCutData[0].pct;

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '20px' }}>
      <div style={{ marginBottom: '14px' }}>
        <p style={{ fontSize: '9.5px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '3px' }}>
          DEA Slacks · BCC Model
        </p>
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#262626', lineHeight: 1.3 }}>
          Cost Reduction Opportunity
        </h3>
      </div>

      {/* Header row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 64px 90px', gap: '8px', padding: '0 0 8px', borderBottom: '1px solid #E8E5DD' }}>
        <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#A8A89E' }}>Stage</span>
        <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#A8A89E', textAlign: 'right' }}>Potential</span>
        <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#A8A89E' }}>Visualization</span>
      </div>

      {costCutData.map((row) => (
        <div
          key={row.stage}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 64px 90px',
            gap: '8px',
            padding: '11px 0',
            borderBottom: '1px solid #F8F7F4',
            alignItems: 'center',
            background: row.highlight ? 'rgba(192,57,43,0.03)' : 'transparent',
            marginLeft: row.highlight ? '-8px' : '0',
            paddingLeft: row.highlight ? '8px' : '0',
            borderRadius: row.highlight ? '6px' : 0,
          } as React.CSSProperties}
        >
          <span style={{ fontSize: '13px', fontWeight: row.highlight ? 700 : 500, color: row.highlight ? '#C0392B' : '#262626' }}>
            {row.stage}
          </span>
          <span style={{
            fontSize: '14px',
            fontWeight: row.highlight ? 700 : 600,
            fontFamily: 'JetBrains Mono, monospace',
            color: row.highlight ? '#C0392B' : '#262626',
            textAlign: 'right',
            letterSpacing: '-0.02em',
          }}>
            {row.pct.toFixed(1)}%
          </span>
          <div style={{ height: 6, background: '#F0EDE5', borderRadius: 3, overflow: 'hidden' }}>
            <div
              style={{
                width: `${(row.pct / max) * 100}%`,
                height: '100%',
                background: row.highlight ? '#C0392B' : '#0F6E56',
                borderRadius: 3,
              }}
            />
          </div>
        </div>
      ))}

      <p style={{ marginTop: '12px', fontSize: '10.5px', color: '#A8A89E', lineHeight: 1.5 }}>
        Mean slack-to-observed ratio across all DMUs per stage. Grosir shows highest intervention leverage.
      </p>
    </div>
  );
}
