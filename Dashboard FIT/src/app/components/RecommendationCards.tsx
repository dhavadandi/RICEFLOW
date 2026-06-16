import { Truck, Package, Wrench, Users, TrendingUp } from 'lucide-react';

const recommendations = [
  {
    icon: Truck,
    title: 'Logistics Optimization',
    body: 'Consolidate transport routes between Petani and Penggilingan stages to reduce unit logistics cost by an estimated 12–18%.',
    impact: 'Cost: –14% est.',
    tag: 'HIGH IMPACT',
    tagColor: '#0F6E56',
    tagBg: '#E8F5F1',
  },
  {
    icon: Package,
    title: 'Inventory Coordination',
    body: 'Implement demand-signal sharing between Grosir and Ritel to reduce safety-stock mismatch and warehousing overhead.',
    impact: 'Waste: –22% est.',
    tag: 'MEDIUM IMPACT',
    tagColor: '#C28B2C',
    tagBg: '#FDF5E8',
  },
  {
    icon: Wrench,
    title: 'Equipment Sharing',
    body: 'Establish cooperative machinery-sharing schemes at Penggilingan stage across Garut and Subang regencies.',
    impact: 'Rent Share: –18% est.',
    tag: 'MEDIUM IMPACT',
    tagColor: '#C28B2C',
    tagBg: '#FDF5E8',
  },
  {
    icon: Users,
    title: 'Worker Welfare Protection',
    body: 'Introduce minimum revenue-sharing floors at Tengkulak stage to reduce monopsony pressure on Petani-level units.',
    impact: 'Welfare Risk: ↓',
    tag: 'PRIORITY',
    tagColor: '#C0392B',
    tagBg: '#FEF0ED',
  },
  {
    icon: TrendingUp,
    title: 'Wholesale Intervention',
    body: 'Direct policy intervention at Grosir stage can unlock 59.1% cost-cut potential — the single highest-impact lever.',
    impact: 'Cost-Cut: 59.1%',
    tag: 'CRITICAL',
    tagColor: '#C0392B',
    tagBg: '#FEF0ED',
  },
];

export function RecommendationCards() {
  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '9.5px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E' }}>
          Recommendation Summary
        </span>
        <div style={{ flex: 1, height: 1, background: '#E8E5DD' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
        {recommendations.map((rec) => {
          const Icon = rec.icon;
          return (
            <div
              key={rec.title}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E8E5DD',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    background: '#F8F7F4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={16} strokeWidth={1.5} color="#5A5A52" />
                </div>
                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    background: rec.tagBg,
                    color: rec.tagColor,
                  }}
                >
                  {rec.tag}
                </span>
              </div>

              <div>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#262626', marginBottom: '5px', lineHeight: 1.3 }}>
                  {rec.title}
                </p>
                <p style={{ fontSize: '11px', color: '#7A7A72', lineHeight: 1.5 }}>
                  {rec.body}
                </p>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #F0EDE5' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: rec.tagColor, fontFamily: 'JetBrains Mono, monospace' }}>
                  {rec.impact}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
