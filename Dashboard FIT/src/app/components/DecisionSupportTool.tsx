import { useState } from 'react';
import { ChevronDown, Zap } from 'lucide-react';

const stages = ['Petani', 'Penggilingan', 'Tengkulak', 'Grosir', 'Ritel'];
const regions = ['Garut', 'Indramayu', 'Karawang', 'Subang', 'Tasikmalaya'];

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

function SliderInput({ label, value, onChange, min = 0, max = 100, step = 1, unit = '' }: SliderInputProps) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '5px' }}>
        <label style={{ fontSize: '11px', color: '#7A7A72', fontWeight: 500 }}>{label}</label>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#262626', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.02em' }}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#0F6E56', height: 3, cursor: 'pointer', display: 'block' }}
      />
    </div>
  );
}

function SelectInput({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '11px', color: '#7A7A72', fontWeight: 500, marginBottom: '5px' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            width: '100%',
            padding: '7px 28px 7px 10px',
            border: '1px solid #E8E5DD',
            borderRadius: '6px',
            background: '#FAFAF8',
            fontSize: '12px',
            color: '#262626',
            appearance: 'none',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            outline: 'none',
          }}
        >
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={12} strokeWidth={2} color="#7A7A72" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      </div>
    </div>
  );
}

function classify(stage: string, region: string, labor: number, material: number, overhead: number, fairShare: number) {
  const total = labor + material + overhead || 1;
  const laborPct = (labor / total) * 100;
  const overheadPct = (overhead / total) * 100;
  const isGrosir = stage === 'Grosir';
  const isTasikmalaya = region === 'Tasikmalaya';
  const score = 100 - laborPct * 0.4 - overheadPct * 0.3 - (isGrosir ? 20 : 0) - (isTasikmalaya ? 8 : 0) + fairShare * 0.5;
  const probEfficient = Math.min(0.97, Math.max(0.05, score / 100));
  const predictedOutput = Math.round(3200 + probEfficient * 4800 - (isGrosir ? 800 : 0));
  const costSaving = isGrosir ? 59.1 : stage === 'Tengkulak' ? 34.7 : stage === 'Penggilingan' ? 22.3 : 15.0;
  const welfareRisk = laborPct < 25 ? 'Low' : laborPct < 38 ? 'Moderate' : 'High';
  const welfareRiskColor = welfareRisk === 'Low' ? '#0F6E56' : welfareRisk === 'Moderate' ? '#C28B2C' : '#C0392B';

  if (probEfficient >= 0.65) return { status: 'Efficient', statusColor: '#0F6E56', statusBg: '#E8F5F1', statusBorder: '#B4DDD3', probEfficient, predictedOutput, costSaving, welfareRisk, welfareRiskColor };
  if (probEfficient >= 0.40) return { status: 'Marginal', statusColor: '#C28B2C', statusBg: '#FDF5E8', statusBorder: '#EEDCB0', probEfficient, predictedOutput, costSaving, welfareRisk, welfareRiskColor };
  return { status: 'Needs Intervention', statusColor: '#C0392B', statusBg: '#FEF0ED', statusBorder: '#F5C6BC', probEfficient, predictedOutput, costSaving, welfareRisk, welfareRiskColor };
}

export function DecisionSupportTool() {
  const [stage, setStage] = useState('Grosir');
  const [region, setRegion] = useState('Garut');
  const [labor, setLabor] = useState(32);
  const [material, setMaterial] = useState(44);
  const [overhead, setOverhead] = useState(24);
  const [fairShare, setFairShare] = useState(38);
  const [generated, setGenerated] = useState(false);

  const result = classify(stage, region, labor, material, overhead, fairShare);

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <p style={{ fontSize: '9.5px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '3px' }}>
          Simulation Tool
        </p>
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#262626', lineHeight: 1.3 }}>
          Decision Support Tool
        </h3>
        <p style={{ fontSize: '11px', color: '#7A7A72', marginTop: '2px' }}>
          Simulate efficiency classification for a production unit
        </p>
      </div>

      {/* Inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <SelectInput label="Stage" value={stage} onChange={setStage} options={stages} />
        <SelectInput label="Region" value={region} onChange={setRegion} options={regions} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '12px', background: '#FAFAF8', borderRadius: '8px', border: '1px solid #F0EDE5' }}>
        <SliderInput label="Labor Cost" value={labor} onChange={setLabor} unit="" />
        <SliderInput label="Material Cost" value={material} onChange={setMaterial} unit="" />
        <SliderInput label="Overhead Cost" value={overhead} onChange={setOverhead} unit="" />
        <SliderInput label="Fair Share Ratio (%)" value={fairShare} onChange={setFairShare} unit="%" />
      </div>

      {/* Status Panel */}
      <div style={{ padding: '12px', background: result.statusBg, border: `1px solid ${result.statusBorder}`, borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: result.statusColor }}>
            {result.status}
          </span>
          <span style={{
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '2px 7px',
            borderRadius: '3px',
            background: result.statusColor,
            color: '#FFFFFF',
          }}>
            {stage} · {region}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {[
            { label: 'Prob. Efficient', value: `${(result.probEfficient * 100).toFixed(1)}%`, color: result.statusColor },
            { label: 'Predicted Output', value: `${result.predictedOutput.toLocaleString()}`, color: '#262626' },
            { label: 'Cost Saving Potential', value: `${result.costSaving}%`, color: '#C28B2C' },
            { label: 'Worker Welfare Risk', value: result.welfareRisk, color: result.welfareRiskColor },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.6)', borderRadius: '6px', padding: '8px 10px' }}>
              <p style={{ fontSize: '10px', color: '#7A7A72', marginBottom: '3px' }}>{label}</p>
              <p style={{ fontSize: '14px', fontWeight: 700, color, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.02em' }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={() => setGenerated(true)}
        style={{
          width: '100%',
          padding: '11px',
          background: '#0F6E56',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.01em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'background 0.15s',
          fontFamily: 'Inter, sans-serif',
        }}
        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = '#0D5E49')}
        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = '#0F6E56')}
      >
        <Zap size={14} strokeWidth={2} />
        Generate Recommendation
      </button>

      {generated && (
        <div style={{ padding: '10px 12px', background: '#F0FAF6', border: '1px solid #B4DDD3', borderRadius: '8px', fontSize: '11px', color: '#0A5540', lineHeight: 1.55 }}>
          <strong>Recommendation generated:</strong> Restructure cost allocation at <strong>{stage}</strong> in {region}. Target labor share below 35% and overhead below 28%. Consider equipment-sharing cooperative with adjacent regencies.
        </div>
      )}
    </div>
  );
}
