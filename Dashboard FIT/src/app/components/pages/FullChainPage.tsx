import { useState } from 'react';
import { Sprout, Settings, ArrowLeftRight, Package, ShoppingBag, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

const STAGES = [
  { id: 'petani',       name: 'Petani',       nameEn: 'Farmer',      icon: Sprout,        dmus: 163, avgEff: 0.650, scaleEff: 0.814, costSaving: 18.6, risk: 'Low',      riskColor: '#0F6E56', topBar: '#0F6E56', bg: '#E8F5F1', border: '#B4DDD3' },
  { id: 'penggilingan', name: 'Penggilingan', nameEn: 'Rice Mill',   icon: Settings,      dmus: 162, avgEff: 0.588, scaleEff: 0.721, costSaving: 22.3, risk: 'Moderate', riskColor: '#C28B2C', topBar: '#C28B2C', bg: '#FDF5E8', border: '#EEDCB0' },
  { id: 'tengkulak',    name: 'Tengkulak',    nameEn: 'Trader',      icon: ArrowLeftRight, dmus: 163, avgEff: 0.470, scaleEff: 0.603, costSaving: 34.7, risk: 'Moderate', riskColor: '#C28B2C', topBar: '#C28B2C', bg: '#FDF5E8', border: '#EEDCB0' },
  { id: 'grosir',       name: 'Grosir',       nameEn: 'Wholesaler',  icon: Package,       dmus: 164, avgEff: 0.280, scaleEff: 0.275, costSaving: 59.1, risk: 'Critical', riskColor: '#C0392B', topBar: '#C0392B', bg: '#FEF0ED', border: '#F5C6BC' },
  { id: 'ritel',        name: 'Ritel',        nameEn: 'Retail',      icon: ShoppingBag,   dmus: 163, avgEff: 0.718, scaleEff: 0.836, costSaving: 12.4, risk: 'Low',      riskColor: '#0F6E56', topBar: '#0F6E56', bg: '#E8F5F1', border: '#B4DDD3' },
];

const slackData: Record<string, { variable: string; slack: number }[]> = {
  petani:       [{ variable: 'Labor cost',    slack: 12.1 }, { variable: 'Land lease',    slack: 8.4 }, { variable: 'Fertilizer',   slack: 6.2 }],
  penggilingan: [{ variable: 'Equipment rent',slack: 18.6 }, { variable: 'Labor cost',    slack: 9.8 }, { variable: 'Energy cost',  slack: 7.1 }],
  tengkulak:    [{ variable: 'Transport cost',slack: 28.4 }, { variable: 'Storage cost',  slack: 14.2 }, { variable: 'Labor share',  slack: 11.0 }],
  grosir:       [{ variable: 'Margin markup', slack: 52.1 }, { variable: 'Labor cost',    slack: 18.3 }, { variable: 'Building rent',slack: 13.7 }],
  ritel:        [{ variable: 'Overhead cost', slack: 9.1 },  { variable: 'Labor cost',    slack: 5.4 },  { variable: 'Equipment',    slack: 3.8 }],
};

const scenarios = {
  current:  { label: 'Current State',   values: [0.650, 0.588, 0.470, 0.280, 0.718], color: '#D85A30' },
  improved: { label: 'Improved (DEA)',  values: [0.720, 0.660, 0.610, 0.540, 0.780], color: '#C28B2C' },
  projected:{ label: 'Projected (ML)', values: [0.755, 0.700, 0.650, 0.620, 0.810], color: '#0F6E56' },
};

const radarData = STAGES.map((s, i) => ({
  stage: s.name,
  Current:   scenarios.current.values[i],
  Improved:  scenarios.improved.values[i],
  Projected: scenarios.projected.values[i],
}));

export function FullChainPage() {
  const [activeStage, setActiveStage] = useState<string | null>('grosir');
  const [activeScenario, setActiveScenario] = useState<'current' | 'improved' | 'projected'>('current');
  const sel = STAGES.find(s => s.id === activeStage);

  const chainScore = (scen: 'current' | 'improved' | 'projected') =>
    parseFloat((scenarios[scen].values.reduce((a, b) => a * b, 1) ** (1 / 5)).toFixed(3));

  const bottleneckRank = [...STAGES].sort((a, b) => a.avgEff - b.avgEff);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <p style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '3px' }}>Supply Chain Operations</p>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#262626', margin: 0 }}>Full Chain Analysis</h2>
        <p style={{ fontSize: '12px', color: '#7A7A72', marginTop: '3px' }}>Click any stage to drill down into its slack analysis and cost reduction opportunity.</p>
      </div>

      {/* Chain Efficiency Score */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {(['current', 'improved', 'projected'] as const).map(k => {
          const sc = scenarios[k];
          const score = chainScore(k);
          const isActive = activeScenario === k;
          return (
            <button key={k} onClick={() => setActiveScenario(k)}
              style={{ background: isActive ? '#0F6E56' : '#FFFFFF', border: `1px solid ${isActive ? '#0F6E56' : '#E8E5DD'}`, borderRadius: '10px', padding: '14px 16px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: isActive ? 'rgba(255,255,255,0.7)' : '#A8A89E', marginBottom: '4px' }}>{sc.label}</p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: isActive ? '#FFFFFF' : sc.color, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {score}
              </p>
              <p style={{ fontSize: '11px', color: isActive ? 'rgba(255,255,255,0.7)' : '#7A7A72', marginTop: '4px' }}>Chain Efficiency Score (GMean)</p>
            </button>
          );
        })}
      </div>

      {/* Interactive Flow */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '18px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '12px' }}>Interactive Supply Chain Flow — click a stage to expand</p>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = activeStage === stage.id;
            const scenVal = scenarios[activeScenario].values[idx];
            return (
              <div key={stage.id} style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                <button onClick={() => setActiveStage(isActive ? null : stage.id)}
                  style={{ flex: 1, background: isActive ? stage.bg : '#FAFAF8', border: `1px solid ${isActive ? stage.border : '#E8E5DD'}`, borderRadius: '8px', cursor: 'pointer', textAlign: 'left', padding: 0, overflow: 'hidden', boxShadow: isActive ? `0 0 0 2px ${stage.riskColor}22` : 'none', transition: 'all 0.15s' }}>
                  <div style={{ height: 3, background: stage.topBar }} />
                  <div style={{ padding: '12px 11px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <div style={{ width: 24, height: 24, borderRadius: '5px', background: stage.bg, border: `1px solid ${stage.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={12} strokeWidth={1.6} color={stage.riskColor} />
                      </div>
                      <p style={{ fontSize: '12px', fontWeight: 700, color: '#262626', margin: 0 }}>{stage.name}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontSize: '9.5px', color: '#A8A89E' }}>Avg Eff.</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: stage.riskColor, fontFamily: 'JetBrains Mono, monospace' }}>{scenVal.toFixed(3)}</span>
                    </div>
                    <div style={{ height: 4, background: '#F0EDE5', borderRadius: 2, marginBottom: '4px' }}>
                      <div style={{ width: `${scenVal * 100}%`, height: '100%', background: stage.topBar, borderRadius: 2, transition: 'width 0.3s' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '9.5px', color: '#A8A89E' }}>DMUs</span>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: '#262626', fontFamily: 'JetBrains Mono, monospace' }}>{stage.dmus}</span>
                    </div>
                    <div style={{ marginTop: '6px' }}>
                      <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', padding: '2px 6px', borderRadius: '3px', background: stage.bg, color: stage.riskColor, border: `1px solid ${stage.border}` }}>{stage.risk}</span>
                    </div>
                  </div>
                </button>
                {idx < STAGES.length - 1 && (
                  <div style={{ width: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ArrowRight size={13} strokeWidth={1.5} color="#C8C6BE" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Stage Detail Drawer */}
        {sel && (
          <div style={{ marginTop: '14px', padding: '16px', background: sel.bg, border: `1px solid ${sel.border}`, borderRadius: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: sel.riskColor, marginBottom: '10px' }}>{sel.name} · Stage Detail</p>
                {[
                  { label: 'Average Efficiency', value: sel.avgEff.toFixed(3) },
                  { label: 'Scale Efficiency', value: sel.scaleEff.toFixed(3) },
                  { label: 'DMU Count', value: sel.dmus.toString() },
                  { label: 'Risk Level', value: sel.risk },
                ].map(m => (
                  <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <span style={{ fontSize: '11px', color: '#7A7A72' }}>{m.label}</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#262626', fontFamily: 'JetBrains Mono, monospace' }}>{m.value}</span>
                  </div>
                ))}
              </div>
              <div>
                <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: sel.riskColor, marginBottom: '10px' }}>Slack Analysis</p>
                {(slackData[sel.id] || []).map(s => (
                  <div key={s.variable} style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontSize: '11px', color: '#4A4A44' }}>{s.variable}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: sel.riskColor, fontFamily: 'JetBrains Mono, monospace' }}>{s.slack.toFixed(1)}%</span>
                    </div>
                    <div style={{ height: 5, background: 'rgba(0,0,0,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${s.slack}%`, height: '100%', background: sel.riskColor, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: sel.riskColor, marginBottom: '10px' }}>Cost Reduction Opportunity</p>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <p style={{ fontSize: '40px', fontWeight: 700, color: sel.riskColor, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.04em', lineHeight: 1 }}>{sel.costSaving}%</p>
                  <p style={{ fontSize: '12px', color: '#7A7A72', marginTop: '6px' }}>Average cost-cut potential across {sel.dmus} DMUs</p>
                  <p style={{ fontSize: '11px', color: '#7A7A72', marginTop: '4px' }}>Derived from DEA slack analysis</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Bottleneck Ranking */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '18px' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '4px' }}>Chain Bottleneck Ranking</p>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#262626', marginBottom: '14px' }}>Stages Ranked by Efficiency (Low → High)</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={bottleneckRank.map(s => ({ name: s.name, value: s.avgEff }))} layout="vertical" margin={{ top: 0, right: 20, left: 8, bottom: 0 }} barCategoryGap="30%">
              <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="rgba(44,44,42,0.07)" />
              <XAxis type="number" domain={[0, 1]} tickCount={5} tick={{ fontSize: 10, fill: '#A8A89E', fontFamily: 'JetBrains Mono, monospace' }} axisLine={{ stroke: '#E8E5DD' }} tickLine={false} />
              <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11, fill: '#4A4A44' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [v.toFixed(3), 'Avg Efficiency']} contentStyle={{ background: '#262626', border: 'none', borderRadius: 6, fontSize: 11, color: '#F8F7F4' }} />
              <Bar dataKey="value" radius={[0, 3, 3, 0]} maxBarSize={20}>
                {bottleneckRank.map(s => <Cell key={s.id} fill={s.avgEff >= 0.65 ? '#0F6E56' : s.avgEff >= 0.40 ? '#C28B2C' : '#C0392B'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Scenario Comparison Radar */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '18px' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '4px' }}>Scenario Comparison</p>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#262626', marginBottom: '14px' }}>Current vs Improved vs Projected</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="rgba(44,44,42,0.1)" />
              <PolarAngleAxis dataKey="stage" tick={{ fontSize: 10, fill: '#7A7A72' }} />
              <Radar name="Current" dataKey="Current" stroke="#D85A30" fill="#D85A30" fillOpacity={0.15} strokeWidth={1.5} />
              <Radar name="Improved" dataKey="Improved" stroke="#C28B2C" fill="#C28B2C" fillOpacity={0.1} strokeWidth={1.5} />
              <Radar name="Projected" dataKey="Projected" stroke="#0F6E56" fill="#0F6E56" fillOpacity={0.15} strokeWidth={1.5} />
              <Tooltip contentStyle={{ background: '#262626', border: 'none', borderRadius: 6, fontSize: 11, color: '#F8F7F4' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
