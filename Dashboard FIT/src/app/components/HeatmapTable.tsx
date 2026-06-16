const regencies = ['Garut', 'Indramayu', 'Karawang', 'Subang', 'Tasikmalaya'];
const stages = ['Petani', 'Penggiling.', 'Tengkulak', 'Grosir', 'Ritel'];

const data: number[][] = [
  [0.61, 0.55, 0.48, 0.27, 0.71],
  [0.72, 0.68, 0.52, 0.31, 0.76],
  [0.69, 0.63, 0.44, 0.25, 0.78],
  [0.65, 0.57, 0.41, 0.29, 0.73],
  [0.58, 0.51, 0.38, 0.22, 0.68],
];

function getCellStyle(value: number): { background: string; color: string } {
  if (value >= 0.70) return { background: '#D4EDE6', color: '#0A5540' };
  if (value >= 0.40) return { background: '#FDF5E8', color: '#7A4E00' };
  return { background: '#FAE0D5', color: '#A83A15' };
}

export function HeatmapTable() {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '12px' }}>
        <p style={{ fontSize: '9.5px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '3px' }}>
          Network DEA · Region × Stage
        </p>
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#262626', lineHeight: 1.3 }}>
          Efficiency Heatmap
        </h3>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        {[
          { label: '≥0.70', bg: '#D4EDE6', color: '#0A5540' },
          { label: '0.40–0.70', bg: '#FDF5E8', color: '#7A4E00' },
          { label: '<0.40', bg: '#FAE0D5', color: '#A83A15' },
        ].map(l => (
          <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#7A7A72' }}>
            <span style={{ width: 9, height: 9, borderRadius: 2, background: l.bg, display: 'inline-block' }} />
            {l.label}
          </span>
        ))}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '2px' }}>
          <thead>
            <tr>
              <th style={{ padding: '5px 6px', textAlign: 'left', fontSize: '10px', color: '#A8A89E', fontWeight: 600, letterSpacing: '0.03em', whiteSpace: 'nowrap' }} />
              {stages.map(s => (
                <th key={s} style={{ padding: '5px 4px', textAlign: 'center', fontSize: '10px', color: '#7A7A72', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {regencies.map((reg, ri) => (
              <tr key={reg}>
                <td style={{ padding: '5px 6px', fontSize: '11px', color: '#262626', fontWeight: 500, whiteSpace: 'nowrap' }}>
                  {reg}
                </td>
                {data[ri].map((val, ci) => {
                  const s = getCellStyle(val);
                  return (
                    <td
                      key={ci}
                      style={{
                        padding: '6px 8px',
                        textAlign: 'center',
                        borderRadius: '4px',
                        background: s.background,
                        color: s.color,
                        fontSize: '11px',
                        fontWeight: 600,
                        fontFamily: 'JetBrains Mono, monospace',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {val.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: '10px', fontSize: '10px', color: '#A8A89E', lineHeight: 1.5, fontStyle: 'italic' }}>
        Red cells mark hidden bottlenecks invisible in system-level scores.
      </p>
    </div>
  );
}
