import { ChevronDown, Download, User } from 'lucide-react';
import { useState } from 'react';

const regions = ['All Regions', 'Garut', 'Indramayu', 'Karawang', 'Subang', 'Tasikmalaya'];

const pageTitles: Record<string, { title: string; tags: string[] }> = {
  overview:  { title: 'Rice Supply Chain Intelligence', tags: ['West Java Province', '815 Production Units', 'DEA', 'Robust DEA', 'Network DEA', 'Machine Learning'] },
  single:    { title: 'Single Agent Analysis', tags: ['Predictive Analytics', 'XGBoost', 'SHAP', 'Unit Simulator'] },
  chain:     { title: 'Full Chain Analysis', tags: ['5-Stage Network', 'Scenario Comparison', 'Bottleneck Ranking'] },
  network:   { title: 'Network DEA', tags: ['Region × Stage Heatmap', 'Bottleneck Detector', 'Flow Diagram'] },
  regional:  { title: 'Regional Performance', tags: ['Robust DEA Index', 'Interactive Map', 'Trend Comparison'] },
  resource:  { title: 'Resource Allocation', tags: ['Priority Matrix', 'Budget Simulator', 'Investment Planning'] },
  policy:    { title: 'Policy Recommendation', tags: ['Evidence-Based', 'Impact Simulator', '5 Action Plans'] },
  explorer:  { title: 'Data Explorer', tags: ['815 DMUs', 'Advanced Filters', 'Export CSV / Excel / PDF'] },
  about:     { title: 'About Project', tags: ['FIT Competition 2026', 'Track V', 'Research Documentation'] },
};

interface Props {
  activePage: string;
}

export function TopBar({ activePage }: Props) {
  const [region, setRegion] = useState('All Regions');
  const [open, setOpen] = useState(false);
  const info = pageTitles[activePage] ?? pageTitles.overview;

  return (
    <header style={{ height: 68, background: '#FFFFFF', borderBottom: '1px solid #E8E5DD', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0, zIndex: 10 }}>
      {/* Left */}
      <div>
        <h1 style={{ fontSize: '14px', fontWeight: 600, color: '#262626', lineHeight: 1.3, margin: 0, fontFamily: 'Inter, sans-serif' }}>
          {info.title}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
          {info.tags.map(tag => (
            <span key={tag} style={{ fontSize: '10px', padding: '2px 8px', background: '#F0EDE5', color: '#5A5A52', borderRadius: '3px', fontWeight: 500 }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setOpen(p => !p)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 12px', background: '#F8F7F4', border: '1px solid #E8E5DD', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#262626', fontWeight: 500 }}>
            {region}<ChevronDown size={13} strokeWidth={2} />
          </button>
          {open && (
            <div style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', zIndex: 100, minWidth: 150, overflow: 'hidden' }}>
              {regions.map(r => (
                <button key={r} onClick={() => { setRegion(r); setOpen(false); }}
                  style={{ display: 'block', width: '100%', padding: '8px 14px', textAlign: 'left', border: 'none', background: r === region ? '#F0EDE5' : 'transparent', color: '#262626', fontSize: '12px', cursor: 'pointer', fontWeight: r === region ? 500 : 400 }}>
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: 'transparent', border: '1px solid #E8E5DD', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#262626', fontWeight: 500 }}>
          <Download size={13} strokeWidth={1.5} />Export Report
        </button>
        <button style={{ width: 34, height: 34, borderRadius: '50%', background: '#E8E5DD', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={16} strokeWidth={1.5} color="#5A5A52" />
        </button>
      </div>
    </header>
  );
}
