import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

function MiniSparkline({ values, color }: { values: number[]; color: string }) {
  const w = 72, h = 22;
  const min = Math.min(...values), max = Math.max(...values);
  const range = max - min || 1;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

const cards = [
  {
    label: 'Overall Chain Efficiency',
    value: '0.59',
    sub: 'Average BCC Efficiency',
    unit: 'BCC Model',
    trend: 'up',
    trendVal: '+0.03',
    color: '#0F6E56',
    spark: [0.52, 0.54, 0.53, 0.56, 0.57, 0.59],
  },
  {
    label: 'Weakest Stage',
    value: 'Grosir',
    sub: 'Scale Efficiency: 0.275',
    unit: 'Critical Bottleneck',
    trend: 'down',
    trendVal: '–0.11',
    color: '#C0392B',
    spark: [0.39, 0.35, 0.33, 0.31, 0.29, 0.275],
  },
  {
    label: 'Classifier ROC-AUC',
    value: '0.846',
    sub: 'XGBoost Classification',
    unit: '10-Fold CV',
    trend: 'up',
    trendVal: '+0.021',
    color: '#0F6E56',
    spark: [0.79, 0.81, 0.82, 0.83, 0.84, 0.846],
  },
  {
    label: 'Output Regression R²',
    value: '0.924',
    sub: 'Random Forest Regression',
    unit: 'OOB Estimate',
    trend: 'up',
    trendVal: '+0.008',
    color: '#0F6E56',
    spark: [0.90, 0.91, 0.91, 0.92, 0.922, 0.924],
  },
  {
    label: 'Potential Cost Reduction',
    value: '59.1%',
    sub: 'Highest potential at Grosir',
    unit: 'DEA Slack Analysis',
    trend: 'neutral',
    trendVal: 'Target',
    color: '#D85A30',
    spark: [45, 50, 52, 55, 57, 59.1],
  },
];

export function KpiCards() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
      {cards.map((c) => {
        const TrendIcon = c.trend === 'up' ? TrendingUp : c.trend === 'down' ? TrendingDown : Minus;
        const trendColor = c.trend === 'up' ? '#0F6E56' : c.trend === 'down' ? '#C0392B' : '#7A7A72';
        const isText = isNaN(Number(c.value.replace('%', '')));
        return (
          <div
            key={c.label}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E8E5DD',
              borderRadius: '10px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <p style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              color: '#A8A89E',
              lineHeight: 1.3,
            }}>
              {c.label}
            </p>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px' }}>
              <p style={{
                fontSize: isText ? '22px' : '26px',
                fontWeight: 700,
                color: c.color,
                lineHeight: 1,
                fontFamily: isText ? 'Inter, sans-serif' : 'JetBrains Mono, monospace',
                letterSpacing: isText ? '-0.01em' : '-0.03em',
              }}>
                {c.value}
              </p>
              <MiniSparkline values={c.spark} color={c.color} />
            </div>

            <p style={{ fontSize: '11px', color: '#7A7A72', lineHeight: 1.4 }}>
              {c.sub}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
              <span style={{ fontSize: '10px', color: '#A8A89E', fontFamily: 'JetBrains Mono, monospace' }}>
                {c.unit}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px', color: trendColor, fontWeight: 500 }}>
                <TrendIcon size={11} strokeWidth={2} />
                {c.trendVal}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
