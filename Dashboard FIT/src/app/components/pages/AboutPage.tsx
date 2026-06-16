import { BookOpen, Database, Trophy, Users, CheckCircle, ArrowRight } from 'lucide-react';

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '20px', ...style }}>
      {children}
    </div>
  );
}

function CardTitle({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
      <div style={{ width: 28, height: 28, borderRadius: '7px', background: '#E8F5F1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={14} strokeWidth={1.8} color="#0F6E56" />
      </div>
      <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#262626', margin: 0 }}>{title}</h3>
    </div>
  );
}

const methodSteps = [
  { id: 'CCR', label: 'DEA CCR Model', desc: 'Constant Returns to Scale — baseline overall efficiency across 815 DMUs', color: '#0F6E56', bg: '#E8F5F1' },
  { id: 'BCC', label: 'DEA BCC Model', desc: 'Variable Returns to Scale — scale efficiency separation and pure technical efficiency', color: '#2F8F73', bg: '#EDF6F3' },
  { id: 'RDEA', label: 'Robust DEA', desc: 'ε-perturbation stability analysis — confirms ranking robustness under data uncertainty', color: '#C28B2C', bg: '#FDF5E8' },
  { id: 'NDEA', label: 'Network DEA', desc: '5-stage network model (Petani → Ritel) — reveals hidden sub-stage bottlenecks', color: '#D85A30', bg: '#FAE0D5' },
  { id: 'RF', label: 'Random Forest', desc: 'Classification (ROC-AUC 0.846) and regression (R² 0.924) on efficiency labels', color: '#2563EB', bg: '#EFF4FE' },
  { id: 'SHAP', label: 'SHAP Analysis', desc: 'Feature attribution — Total Cost (scale) identified as primary inefficiency driver', color: '#6B5B95', bg: '#F3F0FA' },
];

const dataStats = [
  { label: 'Production Units (DMUs)', value: '815', sub: 'Decision-Making Units across 5 stages' },
  { label: 'Regencies Covered', value: '5', sub: 'Garut · Indramayu · Karawang · Subang · Tasikmalaya' },
  { label: 'Supply Chain Stages', value: '5', sub: 'Petani · Penggilingan · Tengkulak · Grosir · Ritel' },
  { label: 'Input Variables', value: '7', sub: 'Labor, Material, Equipment, Building, Land, Capital, Others' },
  { label: 'Output Variables', value: '2', sub: 'Revenue, Production Output (tons)' },
  { label: 'Data Year', value: '2026', sub: 'BPS West Java Agricultural Survey' },
];

const contributions = [
  'First application of Network DEA to West Java multi-stage rice supply chains at regency level',
  'Robust DEA stability analysis confirms ranking validity under ε-perturbation across all 25 stage-region pairs',
  'ML pipeline achieves ROC-AUC 0.846 enabling predictive classification of new production units',
  'SHAP-based explainability bridges black-box ML with interpretable policy recommendations',
  'Grosir stage identified as systemic bottleneck with 59.1% cost-reduction potential — a novel finding',
  'Integrated decision-support tool enables real-time simulation for policymakers without technical expertise',
];

export function AboutPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ background: '#0F6E56', borderRadius: '12px', padding: '28px 32px', color: '#FFFFFF' }}>
        <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
          FIT Competition 2026 · Track V
        </p>
        <h1 style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '26px', fontWeight: 600, lineHeight: 1.25, margin: '0 0 10px' }}>
          RICEFLOW INTELLIGENCE
        </h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, maxWidth: 640 }}>
          An integrated decision-support platform for monitoring, diagnosing, and improving rice supply chain efficiency across West Java Province using DEA, Network DEA, Robust DEA, and Machine Learning.
        </p>
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
          {['Network DEA', 'Robust DEA', 'Random Forest', 'SHAP Analysis'].map(t => (
            <span key={t} style={{ fontSize: '11px', padding: '4px 10px', background: 'rgba(255,255,255,0.15)', borderRadius: '4px', fontWeight: 500 }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Problem Statement */}
        <Card>
          <CardTitle icon={BookOpen} title="Problem Statement & Objective" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '12px', background: '#FEF9F8', border: '1px solid #F5DDD5', borderRadius: '7px' }}>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#C0392B', marginBottom: '4px' }}>Problem</p>
              <p style={{ fontSize: '12px', color: '#4A4A44', lineHeight: 1.55 }}>
                West Java rice supply chains suffer from opaque inefficiencies that aggregate performance metrics fail to reveal. Policymakers lack actionable, stage-level diagnostic tools to prioritize interventions.
              </p>
            </div>
            <div style={{ padding: '12px', background: '#E8F5F1', border: '1px solid #B4DDD3', borderRadius: '7px' }}>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#0F6E56', marginBottom: '4px' }}>Objective</p>
              <p style={{ fontSize: '12px', color: '#4A4A44', lineHeight: 1.55 }}>
                Apply a multi-model analytical pipeline (DEA + Robust DEA + Network DEA + ML) to diagnose bottlenecks, quantify intervention impact, and deliver an interactive decision-support platform.
              </p>
            </div>
            <div style={{ padding: '12px', background: '#EFF4FE', border: '1px solid #BFCFED', borderRadius: '7px' }}>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#2563EB', marginBottom: '4px' }}>Expected Impact</p>
              <p style={{ fontSize: '12px', color: '#4A4A44', lineHeight: 1.55 }}>
                Enable Dinas Pertanian and BULOG to redirect intervention budgets toward highest-leverage stage-region combinations, targeting up to 59.1% cost reduction at the Grosir stage.
              </p>
            </div>
          </div>
        </Card>

        {/* Methodology Pipeline */}
        <Card>
          <CardTitle icon={ArrowRight} title="Methodology Pipeline" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {methodSteps.map((step, idx) => (
              <div key={step.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '6px', background: step.bg, border: `1px solid ${step.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '9px', fontWeight: 800, color: step.color, fontFamily: 'JetBrains Mono, monospace' }}>{step.id}</span>
                  </div>
                  {idx < methodSteps.length - 1 && <div style={{ width: 1, height: 8, background: '#E8E5DD', margin: '2px 0' }} />}
                </div>
                <div style={{ paddingTop: '4px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#262626', lineHeight: 1.3 }}>{step.label}</p>
                  <p style={{ fontSize: '11px', color: '#7A7A72', lineHeight: 1.4 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Dataset Summary */}
      <Card>
        <CardTitle icon={Database} title="Dataset Summary" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
          {dataStats.map((s) => (
            <div key={s.label} style={{ background: '#FAFAF8', border: '1px solid #F0EDE5', borderRadius: '8px', padding: '14px 12px' }}>
              <p style={{ fontSize: '22px', fontWeight: 700, color: '#0F6E56', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#262626', marginTop: '4px', lineHeight: 1.3 }}>{s.label}</p>
              <p style={{ fontSize: '10px', color: '#7A7A72', marginTop: '3px', lineHeight: 1.4 }}>{s.sub}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '12px', padding: '10px 14px', background: '#F8F7F4', borderRadius: '7px', fontSize: '11px', color: '#7A7A72' }}>
          <strong style={{ color: '#262626' }}>Source:</strong> BPS West Java Agricultural Survey (Sensus Pertanian) 2026 — cross-validated with Dinas Pertanian West Java regency-level data.
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Research Contributions */}
        <Card>
          <CardTitle icon={CheckCircle} title="Research Contributions" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {contributions.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#E8F5F1', border: '1px solid #B4DDD3', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px' }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#0F6E56', fontFamily: 'JetBrains Mono' }}>{i + 1}</span>
                </span>
                <p style={{ fontSize: '12px', color: '#4A4A44', lineHeight: 1.5 }}>{c}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Competition Info */}
        <Card>
          <CardTitle icon={Trophy} title="Competition Information" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Competition', value: 'FIT (Forum Ilmiah Terbesar) 2026' },
              { label: 'Track', value: 'Track V — Supply Chain & Operations Analytics' },
              { label: 'Category', value: 'Academic Data Science Competition' },
              { label: 'Target Audience', value: 'Policymakers · Food Security Agencies · Regional Governments' },
              { label: 'Platform Type', value: 'Operational Intelligence System' },
              { label: 'Analysis Period', value: '2026 West Java Agricultural Season' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '8px', borderBottom: '1px solid #F8F7F4', gap: '12px' }}>
                <span style={{ fontSize: '11px', color: '#7A7A72', flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#262626', textAlign: 'right' }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '14px', padding: '12px', background: '#0F6E56', borderRadius: '8px', color: '#FFFFFF' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.7, marginBottom: '4px' }}>Platform Mission</p>
            <p style={{ fontSize: '12px', lineHeight: 1.5 }}>
              Monitor → Diagnose → Simulate → Prioritize → Recommend → Act
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
