import { useState, useMemo } from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { ChevronDown, Zap, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

const REGIONS = ['Garut', 'Indramayu', 'Karawang', 'Subang', 'Tasikmalaya'];
const STAGES  = ['Petani', 'Penggilingan', 'Tengkulak', 'Grosir', 'Ritel'];

function Sel({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#7A7A72', marginBottom: '5px' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <select value={value} onChange={e => onChange(e.target.value)}
          style={{ width: '100%', padding: '8px 28px 8px 10px', border: '1px solid #E8E5DD', borderRadius: '6px', background: '#FAFAF8', fontSize: '12px', color: '#262626', appearance: 'none', cursor: 'pointer', outline: 'none', fontFamily: 'Inter, sans-serif' }}>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown size={12} color="#7A7A72" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      </div>
    </div>
  );
}

function Slider({ label, value, onChange, min = 0, max = 30000, unit = 'IDR' }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; unit?: string }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <label style={{ fontSize: '11px', color: '#7A7A72', fontWeight: 500 }}>{label}</label>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#262626', fontFamily: 'JetBrains Mono, monospace' }}>
          {unit === 'IDR' ? `${(value / 1000).toFixed(0)}K` : `${value}%`}
        </span>
      </div>
      <input type="range" min={min} max={max} step={unit === 'IDR' ? 500 : 1} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#0F6E56', display: 'block', height: 3, cursor: 'pointer' }} />
    </div>
  );
}

function GaugeMeter({ prob }: { prob: number }) {
  const color = prob >= 0.65 ? '#0F6E56' : prob >= 0.40 ? '#C28B2C' : '#C0392B';
  const pct = Math.round(prob * 100);
  return (
    <div style={{ position: 'relative', width: 200, margin: '0 auto', userSelect: 'none' }}>
      <PieChart width={200} height={110}>
        <Pie data={[{ value: pct }, { value: 100 - pct }]} cx={100} cy={100} startAngle={180} endAngle={0}
          innerRadius={52} outerRadius={88} dataKey="value" strokeWidth={0}>
          <Cell fill={color} />
          <Cell fill="#F0EDE5" />
        </Pie>
      </PieChart>
      <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none' }}>
        <div style={{ fontSize: 30, fontWeight: 700, color, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.03em', lineHeight: 1 }}>
          {pct}%
        </div>
        <div style={{ fontSize: 10, color: '#7A7A72', marginTop: 2 }}>Prob. Efficient</div>
      </div>
    </div>
  );
}

function computeResult(stage: string, region: string, labor: number, material: number, equipment: number, building: number, land: number, fairShare: number) {
  const totalCost = labor + material + equipment + building + land;
  const laborR = labor / (totalCost || 1);
  const materialR = material / (totalCost || 1);
  const equipR = equipment / (totalCost || 1);
  const buildR = building / (totalCost || 1);
  const landR = land / (totalCost || 1);
  const fsScore = fairShare / 100;

  const baseEff: Record<string, Record<string, number>> = {
    Garut: { Petani: 0.61, Penggilingan: 0.55, Tengkulak: 0.48, Grosir: 0.27, Ritel: 0.71 },
    Indramayu: { Petani: 0.72, Penggilingan: 0.68, Tengkulak: 0.52, Grosir: 0.31, Ritel: 0.76 },
    Karawang: { Petani: 0.69, Penggilingan: 0.63, Tengkulak: 0.44, Grosir: 0.25, Ritel: 0.78 },
    Subang: { Petani: 0.65, Penggilingan: 0.57, Tengkulak: 0.41, Grosir: 0.29, Ritel: 0.73 },
    Tasikmalaya: { Petani: 0.58, Penggilingan: 0.51, Tengkulak: 0.38, Grosir: 0.22, Ritel: 0.68 },
  };

  const base = baseEff[region]?.[stage] ?? 0.55;
  const costPenalty = (laborR > 0.4 ? 0.1 : 0) + (equipR > 0.3 ? 0.08 : 0) + (buildR > 0.2 ? 0.05 : 0);
  const fsBonus = fsScore * 0.15;
  const prob = Math.min(0.96, Math.max(0.05, base - costPenalty + fsBonus));

  const stageSaving: Record<string, number> = { Petani: 18.6, Penggilingan: 22.3, Tengkulak: 34.7, Grosir: 59.1, Ritel: 12.4 };
  const costSaving = stageSaving[stage] ?? 20;
  const predictedOutput = Math.round(2500 + prob * 5200);
  const welfareRisk = laborR < 0.28 ? 'Low' : laborR < 0.40 ? 'Moderate' : 'High';
  const welfareColor = welfareRisk === 'Low' ? '#0F6E56' : welfareRisk === 'Moderate' ? '#C28B2C' : '#C0392B';

  const shap = [
    { driver: 'Total cost (scale)', value: parseFloat((0.06 + equipR * 0.04).toFixed(3)) },
    { driver: 'Equipment rent share', value: parseFloat((equipR * 0.08).toFixed(3)) },
    { driver: 'Fair share ratio', value: parseFloat((fsScore * 0.06).toFixed(3)) },
    { driver: 'Labor share', value: parseFloat((laborR * 0.07).toFixed(3)) },
    { driver: 'Land lease share', value: parseFloat((landR * 0.05).toFixed(3)) },
    { driver: 'Material share', value: parseFloat((materialR * 0.04).toFixed(3)) },
  ].sort((a, b) => b.value - a.value);

  const costBreakdown = [
    { name: 'Labor', value: labor, fill: '#0F6E56' },
    { name: 'Material', value: material, fill: '#2F8F73' },
    { name: 'Equipment', value: equipment, fill: '#C28B2C' },
    { name: 'Building', value: building, fill: '#D85A30' },
    { name: 'Land', value: land, fill: '#6B5B95' },
  ].filter(d => d.value > 0);

  const status = prob >= 0.65 ? 'Efficient' : prob >= 0.40 ? 'Marginal' : 'Needs Intervention';
  const statusColor = prob >= 0.65 ? '#0F6E56' : prob >= 0.40 ? '#C28B2C' : '#C0392B';
  const statusBg = prob >= 0.65 ? '#E8F5F1' : prob >= 0.40 ? '#FDF5E8' : '#FEF0ED';

  const recs = prob >= 0.65
    ? ['Maintain current cost structure and replicate to adjacent units.', 'Monitor fair-share ratio to sustain worker welfare standards.', 'Consider scaling operations to improve economies of scale.']
    : prob >= 0.40
    ? [`Reduce ${shap[0].driver} to align with regional benchmarks.`, 'Explore equipment-sharing cooperatives to lower rental overhead.', `Target ${costSaving}% cost reduction through slack elimination.`]
    : [`Urgent: restructure cost allocation at ${stage} in ${region}.`, `Enroll in Dinas Pertanian extension program for ${stage} optimization.`, `Expected cost-cut potential: ${costSaving}% — prioritize Grosir intervention.`];

  return { prob, status, statusColor, statusBg, costSaving, predictedOutput, welfareRisk, welfareColor, shap, costBreakdown, recs };
}

export function SingleAgentPage() {
  const [region, setRegion] = useState('Grosir' as string);   // intentionally a stage value to start on Grosir
  const [regionSel, setRegionSel] = useState('Garut');
  const [stageSel, setStageSel] = useState('Grosir');
  const [labor,    setLabor]    = useState(8500);
  const [material, setMaterial] = useState(14000);
  const [equip,    setEquip]    = useState(6000);
  const [building, setBuilding] = useState(3500);
  const [land,     setLand]     = useState(2500);
  const [fair,     setFair]     = useState(38);
  const [showRec,  setShowRec]  = useState(false);

  void region; // suppress unused warning

  const r = useMemo(
    () => computeResult(stageSel, regionSel, labor, material, equip, building, land, fair),
    [stageSel, regionSel, labor, material, equip, building, land, fair]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Page header */}
      <div>
        <p style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '3px' }}>Predictive Analytics</p>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#262626', margin: 0 }}>Single Agent Analysis</h2>
        <p style={{ fontSize: '12px', color: '#7A7A72', marginTop: '3px' }}>Predict efficiency classification for one production unit using the ML pipeline.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 280px', gap: '14px', alignItems: 'start' }}>

        {/* ── Left: Input Panel ── */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E' }}>Unit Profile</p>
          <Sel label="Region" value={regionSel} onChange={setRegionSel} options={REGIONS} />
          <Sel label="Stage" value={stageSel} onChange={setStageSel} options={STAGES} />
          <div style={{ height: 1, background: '#F0EDE5' }} />
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E' }}>Cost Inputs (IDR '000/unit)</p>
          <Slider label="Labor Cost" value={labor} onChange={setLabor} max={20000} />
          <Slider label="Material Cost" value={material} onChange={setMaterial} max={35000} />
          <Slider label="Equipment Rent" value={equip} onChange={setEquip} max={15000} />
          <Slider label="Building Rent" value={building} onChange={setBuilding} max={10000} />
          <Slider label="Land Rent" value={land} onChange={setLand} max={8000} />
          <div style={{ height: 1, background: '#F0EDE5' }} />
          <Slider label="Fair Share Ratio" value={fair} onChange={setFair} min={0} max={100} unit="%" />

          <div style={{ padding: '10px', background: '#F8F7F4', borderRadius: '7px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', color: '#7A7A72' }}>Total Cost</span>
              <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: '#262626' }}>
                {((labor + material + equip + building + land) / 1000).toFixed(0)}K
              </span>
            </div>
          </div>
        </div>

        {/* ── Center: Results ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Status badge */}
          <div style={{ background: r.statusBg, border: `1px solid ${r.statusColor}33`, borderRadius: '10px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {r.prob >= 0.65 ? <CheckCircle size={16} color={r.statusColor} /> : <AlertTriangle size={16} color={r.statusColor} />}
              <span style={{ fontSize: '15px', fontWeight: 700, color: r.statusColor }}>{r.status}</span>
            </div>
            <span style={{ fontSize: '11px', color: '#7A7A72' }}>{stageSel} · {regionSel}</span>
          </div>

          {/* Gauge */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '20px 16px 14px' }}>
            <GaugeMeter prob={r.prob} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '16px' }}>
              {[
                { label: 'Predicted Output', value: `${r.predictedOutput.toLocaleString()}`, unit: 'kg/cycle', color: '#262626' },
                { label: 'Cost-Cut Potential', value: `${r.costSaving}%`, unit: 'DEA slack', color: '#C28B2C' },
                { label: 'Welfare Risk', value: r.welfareRisk, unit: 'Labor share', color: r.welfareColor },
              ].map(m => (
                <div key={m.label} style={{ textAlign: 'center', padding: '10px', background: '#FAFAF8', borderRadius: '8px' }}>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: m.color, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.02em', lineHeight: 1 }}>{m.value}</p>
                  <p style={{ fontSize: '10px', fontWeight: 600, color: '#262626', marginTop: '4px' }}>{m.label}</p>
                  <p style={{ fontSize: '9.5px', color: '#A8A89E' }}>{m.unit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cost breakdown donut */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '16px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '10px' }}>Cost Breakdown</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <PieChart width={130} height={130}>
                <Pie data={r.costBreakdown} cx={65} cy={65} innerRadius={35} outerRadius={58} dataKey="value" strokeWidth={1} stroke="#FFFFFF">
                  {r.costBreakdown.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
              </PieChart>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {r.costBreakdown.map(d => {
                  const total = r.costBreakdown.reduce((s, x) => s + x.value, 0);
                  return (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: d.fill, flexShrink: 0 }} />
                      <span style={{ fontSize: '11px', color: '#4A4A44', flex: 1 }}>{d.name}</span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#262626', fontFamily: 'JetBrains Mono, monospace' }}>
                        {((d.value / total) * 100).toFixed(0)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button onClick={() => setShowRec(true)}
            style={{ width: '100%', padding: '12px', background: '#0F6E56', color: '#FFFFFF', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'Inter, sans-serif' }}>
            <Zap size={14} strokeWidth={2} />
            Generate Recommendation
          </button>

          {showRec && (
            <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '16px' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0F6E56', marginBottom: '10px' }}>Targeted Intervention Suggestions</p>
              {r.recs.map((rec, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#E8F5F1', border: '1px solid #B4DDD3', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: '#0F6E56', fontFamily: 'JetBrains Mono' }}>{i + 1}</span>
                  <p style={{ fontSize: '12px', color: '#4A4A44', lineHeight: 1.5 }}>{rec}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: SHAP ── */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '18px' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '4px' }}>SHAP Attribution</p>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#262626', marginBottom: '14px' }}>Top Inefficiency Drivers</p>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={r.shap} layout="vertical" margin={{ top: 0, right: 20, left: 8, bottom: 0 }} barCategoryGap="28%">
              <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="rgba(44,44,42,0.07)" />
              <XAxis type="number" domain={[0, 0.12]} tickCount={4}
                tick={{ fontSize: 9, fill: '#A8A89E', fontFamily: 'JetBrains Mono, monospace' }}
                axisLine={{ stroke: '#E8E5DD' }} tickLine={false} />
              <YAxis type="category" dataKey="driver" width={118}
                tick={{ fontSize: 9.5, fill: '#4A4A44', fontFamily: 'Inter, sans-serif' }}
                axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v: number) => [v.toFixed(3), 'SHAP']}
                contentStyle={{ background: '#262626', border: 'none', borderRadius: 6, fontSize: 11, color: '#F8F7F4' }}
                cursor={{ fill: 'rgba(216,90,48,0.05)' }}
              />
              <Bar dataKey="value" radius={[0, 3, 3, 0]} maxBarSize={16}>
                {r.shap.map((_, i) => <Cell key={i} fill="#D85A30" fillOpacity={1 - i * 0.12} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div style={{ marginTop: '14px', padding: '10px', background: '#FEF9F8', border: '1px solid #F5DDD5', borderRadius: '7px' }}>
            <p style={{ fontSize: '10px', fontWeight: 600, color: '#C0392B', marginBottom: '3px' }}>Highest Driver</p>
            <p style={{ fontSize: '12px', color: '#4A4A44', lineHeight: 1.4 }}>
              <strong>{r.shap[0]?.driver}</strong> — SHAP {r.shap[0]?.value.toFixed(3)} — primary contributor to predicted inefficiency.
            </p>
          </div>

          <div style={{ marginTop: '10px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '8px' }}>Stage Benchmark</p>
            {[
              { label: 'Region avg eff.', value: ({ Garut: 0.524, Indramayu: 0.598, Karawang: 0.578, Subang: 0.530, Tasikmalaya: 0.474 } as Record<string, number>)[regionSel] ?? 0.54 },
              { label: 'Stage avg eff.', value: ({ Petani: 0.650, Penggilingan: 0.588, Tengkulak: 0.470, Grosir: 0.280, Ritel: 0.732 } as Record<string, number>)[stageSel] ?? 0.55 },
              { label: 'Your unit eff.', value: r.prob },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #F8F7F4' }}>
                <span style={{ fontSize: '11px', color: '#7A7A72' }}>{label}</span>
                <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: value >= 0.65 ? '#0F6E56' : value >= 0.40 ? '#C28B2C' : '#C0392B' }}>
                  {value.toFixed(3)}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '12px', padding: '8px 10px', background: '#F8F7F4', borderRadius: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <TrendingDown size={12} color="#7A7A72" />
              <span style={{ fontSize: '10px', color: '#7A7A72' }}>
                {r.prob < ({ Petani: 0.650, Penggilingan: 0.588, Tengkulak: 0.470, Grosir: 0.280, Ritel: 0.732 } as Record<string, number>)[stageSel]
                  ? 'Below stage average — intervention recommended'
                  : 'At or above stage average — maintain practices'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
