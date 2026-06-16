import { AlertTriangle, TrendingDown, ShieldCheck, Activity, Target } from 'lucide-react';

const findings = [
  {
    id: 1,
    icon: AlertTriangle,
    severity: 'critical',
    title: 'Primary Bottleneck Identified',
    body: 'Grosir has the lowest scale efficiency (0.275) and represents the critical bottleneck in the entire supply chain.',
  },
  {
    id: 2,
    icon: TrendingDown,
    severity: 'warning',
    title: 'Hidden Inefficiencies Detected',
    body: 'Tasikmalaya shows masked inefficiency under aggregate scores. Robust DEA surfaces latent slack at Tengkulak stage.',
  },
  {
    id: 3,
    icon: ShieldCheck,
    severity: 'stable',
    title: 'Robust Ranking Confirmed',
    body: 'Robust DEA confirms regional ranking stability across ε-perturbation bounds. Indramayu remains top performer.',
  },
  {
    id: 4,
    icon: Activity,
    severity: 'warning',
    title: 'Key Inefficiency Driver',
    body: 'Total cost (scale) is the strongest SHAP driver (0.076). Cost structure misalignment is systemic, not isolated.',
  },
  {
    id: 5,
    icon: Target,
    severity: 'action',
    title: 'Highest-Impact Intervention',
    body: 'Wholesale-stage intervention yields 59.1% cost-reduction potential — the highest leverage point in the network.',
  },
];

const severityColors: Record<string, { bg: string; icon: string; border: string }> = {
  critical: { bg: '#FEF0ED', icon: '#C0392B', border: '#F5C6BC' },
  warning:  { bg: '#FDF5E8', icon: '#C28B2C', border: '#EEDCB0' },
  stable:   { bg: '#E8F5F1', icon: '#0F6E56', border: '#B4DDD3' },
  action:   { bg: '#EFF4FE', icon: '#2563EB', border: '#BFCFED' },
};

export function ExecutiveInsight() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        background: '#FFFFFF',
        border: '1px solid #E8E5DD',
        borderRadius: '10px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid #F0EDE5' }}>
        <p style={{ fontSize: '9.5px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '3px' }}>
          Analytical Summary
        </p>
        <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#262626', lineHeight: 1.3 }}>
          Executive Insight
        </h3>
        <p style={{ fontSize: '11px', color: '#7A7A72', marginTop: '2px' }}>
          5 key findings from the DEA + ML pipeline
        </p>
      </div>

      {/* Findings */}
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>
        {findings.map((f, idx) => {
          const Icon = f.icon;
          const c = severityColors[f.severity];
          return (
            <div
              key={f.id}
              style={{
                padding: '12px 16px',
                borderBottom: idx < findings.length - 1 ? '1px solid #F8F7F4' : 'none',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 28,
                  height: 28,
                  borderRadius: '6px',
                  background: c.bg,
                  border: `1px solid ${c.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={14} strokeWidth={1.8} color={c.icon} />
              </div>
              <div>
                <p style={{ fontSize: '11.5px', fontWeight: 600, color: '#262626', lineHeight: 1.3, marginBottom: '3px' }}>
                  {f.title}
                </p>
                <p style={{ fontSize: '11px', color: '#7A7A72', lineHeight: 1.5 }}>
                  {f.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 16px', borderTop: '1px solid #F0EDE5', background: '#FAFAF8' }}>
        <p style={{ fontSize: '10px', color: '#A8A89E', lineHeight: 1.4 }}>
          Generated from Network DEA, Robust DEA ε-model, and XGBoost pipeline · FIT 2026
        </p>
      </div>
    </div>
  );
}
