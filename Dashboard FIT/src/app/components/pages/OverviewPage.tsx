import { KpiCards } from '../KpiCards';
import { SupplyChainFlow } from '../SupplyChainFlow';
import { RegionalMap } from '../RegionalMap';
import { ExecutiveInsight } from '../ExecutiveInsight';
import { HeatmapTable } from '../HeatmapTable';
import { ShapChart } from '../ShapChart';
import { RobustChart } from '../RobustChart';
import { CostCutTable } from '../CostCutTable';
import { RecommendationCards } from '../RecommendationCards';
import { AlertTriangle, MapPin, Zap, FileText, Download, ArrowRight } from 'lucide-react';

function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0 12px' }}>
      <span style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#A8A89E', whiteSpace: 'nowrap' }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: '#E8E5DD' }} />
    </div>
  );
}

const alerts = [
  { icon: AlertTriangle, color: '#C0392B', bg: '#FEF0ED', border: '#F5C6BC', title: 'Critical Bottleneck', body: 'Grosir stage: Scale Eff. 0.275 across all 5 regions.', action: 'Intervene' },
  { icon: AlertTriangle, color: '#C28B2C', bg: '#FDF5E8', border: '#EEDCB0', title: 'Hidden Inefficiency', body: 'Tasikmalaya Tengkulak masked by aggregate DEA score.', action: 'Diagnose' },
  { icon: Zap, color: '#C28B2C', bg: '#FDF5E8', border: '#EEDCB0', title: 'Highest Cost Driver', body: 'Total cost (scale): SHAP 0.076 — systemic misallocation.', action: 'Analyze' },
  { icon: MapPin, color: '#0F6E56', bg: '#E8F5F1', border: '#B4DDD3', title: 'Priority Intervention', body: 'Grosir + Tasikmalaya: 59.1% cost-cut potential unrealized.', action: 'Allocate' },
];

const quickActions = [
  { icon: MapPin, label: 'Analyze Region', desc: 'Regional Performance →', nav: 'regional', color: '#0F6E56', bg: '#E8F5F1' },
  { icon: Zap, label: 'Run Simulation', desc: 'Single Agent Analysis →', nav: 'single', color: '#C28B2C', bg: '#FDF5E8' },
  { icon: FileText, label: 'Policy Report', desc: 'Policy Recommendation →', nav: 'policy', color: '#2563EB', bg: '#EFF4FE' },
  { icon: Download, label: 'Export Results', desc: 'Data Explorer →', nav: 'explorer', color: '#6B5B95', bg: '#F3F0FA' },
];

interface Props {
  onNavigate?: (page: string) => void;
}

export function OverviewPage({ onNavigate }: Props) {
  return (
    <>
      {/* KPI Cards */}
      <KpiCards />

      {/* Executive Alerts + Quick Actions */}
      <SectionLabel label="Control Tower" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'start' }}>
        {/* Alerts */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '16px' }}>
          <p style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '12px' }}>
            Executive Alerts
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {alerts.map((a) => {
              const Icon = a.icon;
              return (
                <div key={a.title} style={{ background: a.bg, border: `1px solid ${a.border}`, borderRadius: '8px', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <Icon size={13} strokeWidth={2} color={a.color} />
                    <span style={{ fontSize: '11px', fontWeight: 700, color: a.color }}>{a.title}</span>
                  </div>
                  <p style={{ fontSize: '11px', color: '#4A4A44', lineHeight: 1.4, marginBottom: '8px' }}>{a.body}</p>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: a.color, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    {a.action} <ArrowRight size={10} />
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '16px', minWidth: 180 }}>
          <p style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '12px' }}>
            Quick Actions
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {quickActions.map((q) => {
              const Icon = q.icon;
              return (
                <button
                  key={q.label}
                  onClick={() => onNavigate?.(q.nav)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 12px',
                    background: q.bg,
                    border: 'none',
                    borderRadius: '7px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  <Icon size={14} strokeWidth={1.8} color={q.color} />
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#262626', lineHeight: 1.2 }}>{q.label}</p>
                    <p style={{ fontSize: '10px', color: '#7A7A72' }}>{q.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Supply Chain Architecture */}
      <SectionLabel label="Supply Chain Architecture" />
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1.6fr 1.3fr', gap: '12px', alignItems: 'stretch' }}>
        <SupplyChainFlow />
        <RegionalMap />
        <ExecutiveInsight />
      </div>

      {/* Analytics */}
      <SectionLabel label="Analytical Deep-Dive" />
      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1.9fr 1.5fr', gap: '12px' }}>
        <HeatmapTable />
        <ShapChart />
        <RobustChart />
      </div>

      {/* Operational */}
      <SectionLabel label="Cost Reduction Intelligence" />
      <CostCutTable />

      {/* Recommendations */}
      <SectionLabel label="Recommendation Summary" />
      <RecommendationCards />

      {/* Footer */}
      <div style={{ marginTop: '28px', paddingTop: '16px', borderTop: '1px solid #E8E5DD', display: 'flex', justifyContent: 'space-between' }}>
        <p style={{ fontSize: '10.5px', color: '#A8A89E' }}>
          Source: BPS West Java Rice Supply Chain Dataset · FIT Competition 2026 · Track V
        </p>
        <p style={{ fontSize: '10px', color: '#C8C6BE', fontFamily: 'JetBrains Mono, monospace' }}>
          DEA · CCR · BCC · Network DEA · Robust DEA · XGBoost · Random Forest
        </p>
      </div>
    </>
  );
}
