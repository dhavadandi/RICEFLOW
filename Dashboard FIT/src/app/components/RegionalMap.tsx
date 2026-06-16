const regions = [
  {
    name: 'Karawang',
    value: 0.61,
    path: 'M 12 28 L 88 14 L 95 26 L 98 68 L 80 88 L 44 92 L 14 64 Z',
    labelX: 52,
    labelY: 54,
  },
  {
    name: 'Subang',
    value: 0.58,
    path: 'M 88 14 L 164 10 L 170 24 L 174 70 L 98 68 L 95 26 Z',
    labelX: 132,
    labelY: 44,
  },
  {
    name: 'Indramayu',
    value: 0.63,
    path: 'M 164 10 L 284 6 L 290 22 L 282 72 L 174 70 L 170 24 Z',
    labelX: 226,
    labelY: 40,
  },
  {
    name: 'Garut',
    value: 0.54,
    path: 'M 14 64 L 80 88 L 98 68 L 174 70 L 164 140 L 128 184 L 48 190 L 10 148 Z',
    labelX: 86,
    labelY: 138,
  },
  {
    name: 'Tasikmalaya',
    value: 0.52,
    path: 'M 174 70 L 282 72 L 292 192 L 128 184 L 164 140 Z',
    labelX: 216,
    labelY: 148,
  },
];

function getRegionColor(value: number): string {
  if (value >= 0.62) return '#2F8F73';
  if (value >= 0.58) return '#4DAA8E';
  if (value >= 0.54) return '#C28B2C';
  if (value >= 0.50) return '#D85A30';
  return '#C0392B';
}

function getLegendColor(label: string): string {
  if (label.includes('0.62')) return '#2F8F73';
  if (label.includes('0.58')) return '#4DAA8E';
  if (label.includes('0.54')) return '#C28B2C';
  if (label.includes('0.50')) return '#D85A30';
  return '#C0392B';
}

const legendItems = [
  { label: '≥ 0.62 Efficient', value: 0.62 },
  { label: '0.58–0.62 Good', value: 0.59 },
  { label: '0.54–0.58 Fair', value: 0.55 },
  { label: '0.50–0.54 At Risk', value: 0.51 },
];

export function RegionalMap() {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E8E5DD',
        borderRadius: '10px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ marginBottom: '12px' }}>
        <p style={{ fontSize: '9.5px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '3px' }}>
          Robust DEA Index
        </p>
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#262626', lineHeight: 1.3 }}>
          Regional Efficiency Map
        </h3>
        <p style={{ fontSize: '11px', color: '#7A7A72', marginTop: '2px' }}>
          West Java Province · 5 Regencies
        </p>
      </div>

      {/* SVG Map */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg
          viewBox="0 0 304 200"
          style={{ width: '100%', maxWidth: 304, height: 'auto' }}
          aria-label="West Java Regional Efficiency Map"
        >
          {/* Province outline shadow */}
          <path
            d="M 10 26 L 88 14 L 164 10 L 284 6 L 292 22 L 284 74 L 292 192 L 128 184 L 48 192 L 10 148 Z"
            fill="none"
            stroke="#D4D0C8"
            strokeWidth="1"
            strokeDasharray="3 2"
          />

          {regions.map((region) => {
            const fill = getRegionColor(region.value);
            return (
              <g key={region.name}>
                <path
                  d={region.path}
                  fill={fill}
                  fillOpacity={0.82}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
                {/* Region name */}
                <text
                  x={region.labelX}
                  y={region.labelY - 6}
                  textAnchor="middle"
                  style={{
                    fontSize: '8.5px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fill: '#FFFFFF',
                    letterSpacing: '0.02em',
                  }}
                >
                  {region.name}
                </text>
                {/* Efficiency value */}
                <text
                  x={region.labelX}
                  y={region.labelY + 8}
                  textAnchor="middle"
                  style={{
                    fontSize: '10px',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 600,
                    fill: 'rgba(255,255,255,0.95)',
                  }}
                >
                  {region.value.toFixed(2)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {legendItems.map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: getRegionColor(item.value), display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontSize: '10px', color: '#7A7A72' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
