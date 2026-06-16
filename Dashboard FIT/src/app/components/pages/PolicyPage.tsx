import { useState } from 'react';
import { AlertTriangle, Clock, Calendar, Users, MapPin, Zap, ArrowRight, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

const recommendations = [
  {
    type: 'Immediate Action',
    icon: AlertTriangle,
    iconColor: '#C0392B',
    iconBg: '#FEF0ED',
    tagColor: '#C0392B',
    tagBg: '#FEF0ED',
    title: 'Emergency Grosir Stage Intervention',
    target: { region: 'All Regions', stage: 'Grosir' },
    impactScore: 9.2,
    implCost: 'Rp 2.4 Billion',
    expectedBenefit: 'Cost reduction 59.1% · Scale eff. +0.25',
    timeline: '0–3 months',
    desc: 'Deploy dedicated extension officers to Grosir-stage DMUs across all 5 regencies. Implement mandatory cost-structure reporting and establish cooperative pricing mechanisms to reduce monopsony rent extraction.',
    steps: [
      'Identify top 50 lowest-efficiency Grosir DMUs in Tasikmalaya and Garut',
      'Assign field supervisors for bi-weekly cost-structure audits',
      'Establish transparent pricing index at wholesale level',
    ],
  },
  {
    type: 'Medium-Term Action',
    icon: Clock,
    iconColor: '#C28B2C',
    iconBg: '#FDF5E8',
    tagColor: '#C28B2C',
    tagBg: '#FDF5E8',
    title: 'Tengkulak Margin Restructuring Program',
    target: { region: 'Tasikmalaya, Garut', stage: 'Tengkulak' },
    impactScore: 7.6,
    implCost: 'Rp 1.1 Billion',
    expectedBenefit: 'Cost reduction 34.7% · Network eff. +0.18',
    timeline: '3–12 months',
    desc: 'Restructure Tengkulak contractual arrangements to formalize fair-share ratios. Pilot digital traceability system linking Petani output directly to Penggilingan — reducing information asymmetry that enables excessive Tengkulak margins.',
    steps: [
      'Legal framework for minimum farmgate price agreements in Tasikmalaya',
      'Digital platform pilot connecting Petani ↔ Penggilingan in Subang',
      'Training program for Tengkulak digital record-keeping (50 units Q2)',
    ],
  },
  {
    type: 'Long-Term Action',
    icon: Calendar,
    iconColor: '#2563EB',
    iconBg: '#EFF4FE',
    tagColor: '#2563EB',
    tagBg: '#EFF4FE',
    title: 'Regional Supply Chain Modernization',
    target: { region: 'All Regions', stage: 'Full Chain' },
    impactScore: 8.8,
    implCost: 'Rp 8.7 Billion',
    expectedBenefit: 'Chain eff. +0.22 · R² ↑ · Output +18%',
    timeline: '12–36 months',
    desc: 'Comprehensive modernization covering cold-chain logistics at Penggilingan, cooperative warehouse infrastructure at Grosir, and post-harvest quality certification at Petani stage. Integrate with BULOG\'s national procurement network.',
    steps: [
      'Cold-chain facility construction at 3 Penggilingan hubs (Indramayu, Karawang)',
      'Cooperative warehouse complex at Grosir Subang and Indramayu',
      'ISO quality certification program for top 100 Petani DMUs',
    ],
  },
  {
    type: 'Worker Welfare Safeguard',
    icon: Users,
    iconColor: '#6B5B95',
    iconBg: '#F3F0FA',
    tagColor: '#6B5B95',
    tagBg: '#F3F0FA',
    title: 'Fair Share Protection for Petani-Level Workers',
    target: { region: 'Garut, Tasikmalaya', stage: 'Petani' },
    impactScore: 6.5,
    implCost: 'Rp 0.6 Billion',
    expectedBenefit: 'Labor share stabilized · Welfare Risk ↓',
    timeline: '0–6 months',
    desc: 'Establish minimum revenue-sharing floors at 38% for Petani-level DMUs in high-risk areas. Introduce social safety net monitoring integrated with this platform to flag units falling below welfare thresholds.',
    steps: [
      'Enforce minimum 38% fair-share ratio via Dinas Pertanian regulation',
      'Platform integration: auto-flag welfare-risk DMUs (labor share < 25%)',
      'Quarterly welfare audit of 200 smallest Petani DMUs in Garut',
    ],
  },
  {
    type: 'Regional Intervention Plan',
    icon: MapPin,
    iconColor: '#0F6E56',
    iconBg: '#E8F5F1',
    tagColor: '#0F6E56',
    tagBg: '#E8F5F1',
    title: 'Tasikmalaya Priority Recovery Plan',
    target: { region: 'Tasikmalaya', stage: 'Grosir + Tengkulak' },
    impactScore: 8.4,
    implCost: 'Rp 1.8 Billion',
    expectedBenefit: 'Robust DEA index 0.52 → 0.67 est.',
    timeline: '6–18 months',
    desc: 'Tasikmalaya has the lowest Robust DEA index (0.52) and the most severe hidden inefficiencies at Tengkulak and Grosir stages. Concentrated regional intervention combining cost restructuring, logistics improvement, and institutional support.',
    steps: [
      'Tasikmalaya Supply Chain Task Force — cross-agency coordination body',
      'Infrastructure: upgrade 4 main trade routes connecting farms to mills',
      'Institutional: formalize 2 cooperative associations for Grosir agents',
    ],
  },
];

const beforeAfterData = [
  { stage: 'Petani', before: 0.650, after: 0.720 },
  { stage: 'Penggilingan', before: 0.588, after: 0.660 },
  { stage: 'Tengkulak', before: 0.470, after: 0.610 },
  { stage: 'Grosir', before: 0.280, after: 0.540 },
  { stage: 'Ritel', before: 0.732, after: 0.780 },
];

export function PolicyPage() {
  const [selected, setSelected] = useState<number | null>(0);
  const [simulating, setSimulating] = useState(false);
  const [simDone, setSimDone] = useState(false);

  function runSim() {
    setSimulating(true);
    setTimeout(() => { setSimulating(false); setSimDone(true); }, 1200);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <p style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '3px' }}>Analytics to Action</p>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#262626', margin: 0 }}>Policy Recommendation Engine</h2>
        <p style={{ fontSize: '12px', color: '#7A7A72', marginTop: '3px' }}>Evidence-based intervention plans derived from DEA diagnostics and ML predictions.</p>
      </div>

      {/* Impact summary bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        {[
          { label: 'Active Recommendations', value: '5', color: '#0F6E56', bg: '#E8F5F1' },
          { label: 'Total Budget Required', value: 'Rp 14.6B', color: '#C28B2C', bg: '#FDF5E8' },
          { label: 'Expected Efficiency Gain', value: '+0.24', color: '#2563EB', bg: '#EFF4FE' },
          { label: 'Beneficiary DMUs', value: '612', color: '#6B5B95', bg: '#F3F0FA' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: '8px', padding: '14px 16px' }}>
            <p style={{ fontSize: '22px', fontWeight: 700, color: s.color, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: '11px', color: '#4A4A44', marginTop: '4px', fontWeight: 500 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '16px', alignItems: 'start' }}>
        {/* Recommendation Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recommendations.map((rec, idx) => {
            const Icon = rec.icon;
            const isOpen = selected === idx;
            return (
              <div key={idx}
                style={{ background: '#FFFFFF', border: `1px solid ${isOpen ? rec.tagColor + '55' : '#E8E5DD'}`, borderRadius: '10px', overflow: 'hidden', transition: 'border-color 0.2s' }}>
                <button onClick={() => setSelected(isOpen ? null : idx)}
                  style={{ width: '100%', padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '12px', textAlign: 'left' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '7px', background: rec.iconBg, border: `1px solid ${rec.tagColor}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <Icon size={14} strokeWidth={1.8} color={rec.iconColor} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: '3px', background: rec.tagBg, color: rec.tagColor }}>
                        {rec.type}
                      </span>
                      <span style={{ fontSize: '10px', color: '#A8A89E' }}>{rec.timeline}</span>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: rec.tagColor, fontFamily: 'JetBrains Mono, monospace' }}>
                        Impact: {rec.impactScore}/10
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#262626', margin: 0 }}>{rec.title}</p>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', color: '#7A7A72' }}>Region: <strong style={{ color: '#262626' }}>{rec.target.region}</strong></span>
                      <span style={{ fontSize: '11px', color: '#7A7A72' }}>Stage: <strong style={{ color: '#262626' }}>{rec.target.stage}</strong></span>
                      <span style={{ fontSize: '11px', color: '#7A7A72' }}>Budget: <strong style={{ color: '#262626' }}>{rec.implCost}</strong></span>
                    </div>
                  </div>
                  <ArrowRight size={14} color="#A8A89E" style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0, marginTop: 6 }} />
                </button>

                {isOpen && (
                  <div style={{ padding: '0 16px 16px 58px', borderTop: '1px solid #F0EDE5' }}>
                    <div style={{ paddingTop: '12px' }}>
                      <p style={{ fontSize: '12px', color: '#4A4A44', lineHeight: 1.6, marginBottom: '12px' }}>{rec.desc}</p>
                      <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '8px' }}>Implementation Steps</p>
                      {rec.steps.map((s, i) => (
                        <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                          <span style={{ width: 16, height: 16, borderRadius: '50%', background: rec.tagBg, border: `1px solid ${rec.tagColor}44`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: rec.tagColor, marginTop: 1 }}>{i + 1}</span>
                          <p style={{ fontSize: '12px', color: '#4A4A44', lineHeight: 1.45 }}>{s}</p>
                        </div>
                      ))}
                      <div style={{ marginTop: '10px', padding: '8px 10px', background: rec.iconBg, borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '11px', color: rec.tagColor, fontWeight: 600 }}>Expected Benefit</span>
                        <span style={{ fontSize: '11px', color: rec.tagColor, fontFamily: 'JetBrains Mono, monospace' }}>{rec.expectedBenefit}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Policy Impact Simulator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <BarChart2 size={14} strokeWidth={1.8} color="#0F6E56" />
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#262626', margin: 0 }}>Policy Impact Simulator</h3>
            </div>
            <p style={{ fontSize: '11px', color: '#7A7A72', marginBottom: '14px', lineHeight: 1.5 }}>
              Model the expected efficiency improvement if all 5 recommendations are fully implemented.
            </p>

            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={beforeAfterData} margin={{ top: 8, right: 8, left: -14, bottom: 0 }} barCategoryGap="30%">
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(44,44,42,0.07)" />
                <XAxis dataKey="stage" tick={{ fontSize: 10, fill: '#7A7A72' }} axisLine={{ stroke: '#E8E5DD' }} tickLine={false} />
                <YAxis domain={[0, 1]} tickCount={5} tick={{ fontSize: 10, fill: '#A8A89E', fontFamily: 'JetBrains Mono, monospace' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v: number, name: string) => [v.toFixed(3), name === 'before' ? 'Current' : 'Post-Intervention']}
                  contentStyle={{ background: '#262626', border: 'none', borderRadius: 6, fontSize: 11, color: '#F8F7F4' }}
                />
                <Legend formatter={v => v === 'before' ? 'Current State' : 'Post-Intervention'} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="before" fill="#D85A30" radius={[3, 3, 0, 0]} maxBarSize={20} fillOpacity={0.75} />
                <Bar dataKey="after" fill="#0F6E56" radius={[3, 3, 0, 0]} maxBarSize={20} fillOpacity={0.9} />
              </BarChart>
            </ResponsiveContainer>

            <button onClick={runSim} disabled={simulating}
              style={{ width: '100%', marginTop: '12px', padding: '10px', background: simulating ? '#7A7A72' : '#0F6E56', color: '#FFFFFF', border: 'none', borderRadius: '7px', cursor: simulating ? 'default' : 'pointer', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: 'Inter, sans-serif' }}>
              <Zap size={12} strokeWidth={2} />
              {simulating ? 'Simulating...' : 'Run Impact Simulation'}
            </button>

            {simDone && (
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { label: 'Expected Efficiency Gain', value: '+0.24 avg BCC', color: '#0F6E56' },
                  { label: 'Expected Cost Reduction', value: '−32.8% avg', color: '#C28B2C' },
                  { label: 'Chain Efficiency Score', value: '0.59 → 0.83', color: '#2563EB' },
                  { label: 'Grosir Recovery', value: '0.28 → 0.54', color: '#0F6E56' },
                ].map(m => (
                  <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', background: '#FAFAF8', borderRadius: '6px' }}>
                    <span style={{ fontSize: '11px', color: '#7A7A72' }}>{m.label}</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: m.color, fontFamily: 'JetBrains Mono, monospace' }}>{m.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Priority matrix summary */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '16px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '10px' }}>Priority Ranking</p>
            {recommendations.map((rec, idx) => {
              const Icon = rec.icon;
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', borderBottom: '1px solid #F8F7F4' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#A8A89E', fontFamily: 'JetBrains Mono', minWidth: 16 }}>P{idx + 1}</span>
                  <Icon size={12} strokeWidth={1.8} color={rec.iconColor} />
                  <span style={{ fontSize: '11px', color: '#262626', flex: 1, fontWeight: 500 }}>{rec.title.split(' ').slice(0, 3).join(' ')}…</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: rec.tagColor, fontFamily: 'JetBrains Mono, monospace' }}>{rec.impactScore}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
