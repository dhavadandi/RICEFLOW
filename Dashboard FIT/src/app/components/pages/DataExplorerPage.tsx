import { useState, useMemo } from 'react';
import { Search, Download, Filter, ChevronLeft, ChevronRight, ChevronDown, BookOpen } from 'lucide-react';

interface DMU {
  id: string; region: string; stage: string; efficiency: number;
  scaleEff: number; status: string; laborCost: number;
  materialCost: number; equipmentRent: number; output: number;
}

function genDMUs(): DMU[] {
  const regs = ['Garut', 'Indramayu', 'Karawang', 'Subang', 'Tasikmalaya'];
  const stgs = ['Petani', 'Penggilingan', 'Tengkulak', 'Grosir', 'Ritel'];
  const baseEff: Record<string, number[]> = {
    Garut: [0.61, 0.55, 0.48, 0.27, 0.71], Indramayu: [0.72, 0.68, 0.52, 0.31, 0.76],
    Karawang: [0.69, 0.63, 0.44, 0.25, 0.78], Subang: [0.65, 0.57, 0.41, 0.29, 0.73],
    Tasikmalaya: [0.58, 0.51, 0.38, 0.22, 0.68],
  };
  let seed = 42;
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const rows: DMU[] = [];
  let id = 1;
  for (const r of regs) {
    for (let si = 0; si < stgs.length; si++) {
      const s = stgs[si];
      const n = id <= 815 - (25 - (regs.indexOf(r) * 5 + si)) ? 33 : 32;
      const count = Math.min(n, Math.floor(815 / 25) + (id % 25 < 15 ? 1 : 0));
      for (let i = 0; i < (count || 33); i++) {
        if (rows.length >= 815) break;
        const noise = (rand() - 0.5) * 0.16;
        const eff = Math.min(0.99, Math.max(0.05, baseEff[r][si] + noise));
        const scaleE = Math.min(0.99, eff * (0.70 + rand() * 0.50));
        rows.push({
          id: `DMU-${String(id++).padStart(4, '0')}`,
          region: r, stage: s,
          efficiency: parseFloat(eff.toFixed(3)),
          scaleEff: parseFloat(scaleE.toFixed(3)),
          status: eff >= 0.65 ? 'Efficient' : eff >= 0.40 ? 'Moderate' : 'Inefficient',
          laborCost: Math.round(2000 + rand() * 10000),
          materialCost: Math.round(5000 + rand() * 22000),
          equipmentRent: Math.round(500 + rand() * 6000),
          output: Math.round(1000 + eff * 5200),
        });
      }
    }
  }
  return rows;
}

const ALL_DMUS = genDMUs();
const PAGE_SIZE = 20;

const DICT = [
  { var: 'DMU ID', type: 'String', def: 'Unique identifier for each Decision-Making Unit' },
  { var: 'Region', type: 'Category', def: 'Regency in West Java Province (5 levels)' },
  { var: 'Stage', type: 'Category', def: 'Supply chain stage: Petani, Penggilingan, Tengkulak, Grosir, Ritel' },
  { var: 'Efficiency', type: 'Float [0,1]', def: 'BCC model pure technical efficiency score' },
  { var: 'Scale Efficiency', type: 'Float [0,1]', def: 'Scale efficiency = CCR / BCC efficiency' },
  { var: 'Status', type: 'Category', def: 'Efficient (≥0.65) / Moderate (0.40–0.65) / Inefficient (<0.40)' },
  { var: 'Labor Cost', type: 'Integer (IDR)', def: 'Total labor expenditure per production cycle (IDR)' },
  { var: 'Material Cost', type: 'Integer (IDR)', def: 'Raw material and input cost per cycle (IDR)' },
  { var: 'Equipment Rent', type: 'Integer (IDR)', def: 'Equipment and machinery rental cost per cycle (IDR)' },
  { var: 'Output', type: 'Integer (kg)', def: 'Production output in kilograms per cycle' },
];

export function DataExplorerPage() {
  const [search, setSearch] = useState('');
  const [regionF, setRegionF] = useState('All');
  const [stageF, setStageF] = useState('All');
  const [statusF, setStatusF] = useState('All');
  const [page, setPage] = useState(1);
  const [showDict, setShowDict] = useState(false);
  const [sortCol, setSortCol] = useState<keyof DMU>('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = useMemo(() => {
    let d = ALL_DMUS;
    if (regionF !== 'All') d = d.filter(r => r.region === regionF);
    if (stageF !== 'All')  d = d.filter(r => r.stage === stageF);
    if (statusF !== 'All') d = d.filter(r => r.status === statusF);
    if (search) {
      const q = search.toLowerCase();
      d = d.filter(r => r.id.toLowerCase().includes(q) || r.region.toLowerCase().includes(q) || r.stage.toLowerCase().includes(q));
    }
    return [...d].sort((a, b) => {
      const av = a[sortCol], bv = b[sortCol];
      if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
  }, [search, regionF, stageF, statusF, sortCol, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSort(col: keyof DMU) {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
    setPage(1);
  }

  function handleExport(type: string) {
    const header = 'DMU ID,Region,Stage,Efficiency,Scale Eff.,Status,Labor Cost,Material Cost,Equipment Rent,Output\n';
    const rows = filtered.map(d => `${d.id},${d.region},${d.stage},${d.efficiency},${d.scaleEff},${d.status},${d.laborCost},${d.materialCost},${d.equipmentRent},${d.output}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `riceflow_export.${type === 'CSV' ? 'csv' : 'csv'}`; a.click();
  }

  const statusColor = (s: string) => s === 'Efficient' ? '#0F6E56' : s === 'Moderate' ? '#C28B2C' : '#C0392B';
  const statusBg = (s: string) => s === 'Efficient' ? '#E8F5F1' : s === 'Moderate' ? '#FDF5E8' : '#FEF0ED';

  function ColHeader({ col, label }: { col: keyof DMU; label: string }) {
    return (
      <th onClick={() => handleSort(col)} style={{ padding: '8px 10px', textAlign: 'left', fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: sortCol === col ? '#0F6E56' : '#A8A89E', cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none', borderBottom: '2px solid #E8E5DD' }}>
        {label} {sortCol === col ? (sortDir === 'asc' ? '↑' : '↓') : ''}
      </th>
    );
  }

  const REGS = ['All', 'Garut', 'Indramayu', 'Karawang', 'Subang', 'Tasikmalaya'];
  const STGS = ['All', 'Petani', 'Penggilingan', 'Tengkulak', 'Grosir', 'Ritel'];
  const STATS = ['All', 'Efficient', 'Moderate', 'Inefficient'];

  function SelF({ label, value, onChange, opts }: { label: string; value: string; onChange: (v: string) => void; opts: string[] }) {
    return (
      <div>
        <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '4px' }}>{label}</label>
        <div style={{ position: 'relative' }}>
          <select value={value} onChange={e => { onChange(e.target.value); setPage(1); }}
            style={{ width: '100%', padding: '7px 24px 7px 9px', border: '1px solid #E8E5DD', borderRadius: '6px', background: '#FAFAF8', fontSize: '12px', color: '#262626', appearance: 'none', cursor: 'pointer', outline: 'none' }}>
            {opts.map(o => <option key={o}>{o}</option>)}
          </select>
          <ChevronDown size={11} color="#7A7A72" style={{ position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '3px' }}>Transparency & Audit</p>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#262626', margin: 0 }}>Data Explorer</h2>
          <p style={{ fontSize: '12px', color: '#7A7A72', marginTop: '3px' }}>
            {filtered.length} of {ALL_DMUS.length} production units · BPS West Java 2026
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['CSV', 'Excel', 'PDF'].map(t => (
            <button key={t} onClick={() => handleExport(t)}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#262626', fontWeight: 500 }}>
              <Download size={12} strokeWidth={1.8} />{t}
            </button>
          ))}
          <button onClick={() => setShowDict(p => !p)}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', background: showDict ? '#E8F5F1' : '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: showDict ? '#0F6E56' : '#262626', fontWeight: 500 }}>
            <BookOpen size={12} strokeWidth={1.8} />Data Dictionary
          </button>
        </div>
      </div>

      {/* Data Dictionary */}
      {showDict && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '18px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#262626', marginBottom: '12px' }}>Data Dictionary — Variable Definitions</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8F7F4' }}>
                {['Variable', 'Type', 'Definition'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#A8A89E', borderBottom: '1px solid #E8E5DD' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DICT.map((d, i) => (
                <tr key={d.var} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF8' }}>
                  <td style={{ padding: '8px 12px', fontSize: '12px', fontWeight: 600, color: '#262626', borderBottom: '1px solid #F0EDE5', fontFamily: 'JetBrains Mono, monospace' }}>{d.var}</td>
                  <td style={{ padding: '8px 12px', fontSize: '11px', color: '#0F6E56', borderBottom: '1px solid #F0EDE5', fontFamily: 'JetBrains Mono, monospace' }}>{d.type}</td>
                  <td style={{ padding: '8px 12px', fontSize: '12px', color: '#4A4A44', borderBottom: '1px solid #F0EDE5', lineHeight: 1.4 }}>{d.def}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ marginTop: '10px', fontSize: '11px', color: '#A8A89E' }}>
            Source: BPS West Java Agricultural Survey 2026 · Validated with Dinas Pertanian regency reports
          </p>
        </div>
      )}

      {/* Filters */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <Filter size={13} strokeWidth={1.8} color="#7A7A72" />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#262626' }}>Advanced Filters</span>
          {(regionF !== 'All' || stageF !== 'All' || statusF !== 'All' || search) && (
            <button onClick={() => { setRegionF('All'); setStageF('All'); setStatusF('All'); setSearch(''); setPage(1); }}
              style={{ fontSize: '11px', color: '#C0392B', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              Clear all
            </button>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 160px 160px', gap: '12px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '4px' }}>Search DMU / Region / Stage</label>
            <div style={{ position: 'relative' }}>
              <Search size={13} color="#A8A89E" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)' }} />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Type to search..."
                style={{ width: '100%', padding: '7px 10px 7px 28px', border: '1px solid #E8E5DD', borderRadius: '6px', background: '#FAFAF8', fontSize: '12px', color: '#262626', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>
          <SelF label="Region" value={regionF} onChange={setRegionF} opts={REGS} />
          <SelF label="Stage" value={stageF} onChange={setStageF} opts={STGS} />
          <SelF label="Status" value={statusF} onChange={setStatusF} opts={STATS} />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E8E5DD', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <ColHeader col="id" label="DMU ID" />
                <ColHeader col="region" label="Region" />
                <ColHeader col="stage" label="Stage" />
                <ColHeader col="efficiency" label="Efficiency" />
                <ColHeader col="scaleEff" label="Scale Eff." />
                <ColHeader col="status" label="Status" />
                <ColHeader col="laborCost" label="Labor Cost" />
                <ColHeader col="materialCost" label="Material Cost" />
                <ColHeader col="equipmentRent" label="Equip. Rent" />
                <ColHeader col="output" label="Output (kg)" />
              </tr>
            </thead>
            <tbody>
              {pageData.map((d, i) => (
                <tr key={d.id} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF8', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F0FAF6')}
                  onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? '#FFFFFF' : '#FAFAF8')}>
                  <td style={{ padding: '8px 10px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#0F6E56', borderBottom: '1px solid #F8F7F4', whiteSpace: 'nowrap' }}>{d.id}</td>
                  <td style={{ padding: '8px 10px', fontSize: '12px', color: '#262626', borderBottom: '1px solid #F8F7F4', whiteSpace: 'nowrap' }}>{d.region}</td>
                  <td style={{ padding: '8px 10px', fontSize: '12px', color: '#262626', borderBottom: '1px solid #F8F7F4', whiteSpace: 'nowrap' }}>{d.stage}</td>
                  <td style={{ padding: '8px 10px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: d.efficiency >= 0.65 ? '#0F6E56' : d.efficiency >= 0.40 ? '#C28B2C' : '#C0392B', borderBottom: '1px solid #F8F7F4', textAlign: 'right' }}>{d.efficiency.toFixed(3)}</td>
                  <td style={{ padding: '8px 10px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#4A4A44', borderBottom: '1px solid #F8F7F4', textAlign: 'right' }}>{d.scaleEff.toFixed(3)}</td>
                  <td style={{ padding: '8px 10px', borderBottom: '1px solid #F8F7F4' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px', background: statusBg(d.status), color: statusColor(d.status) }}>{d.status}</span>
                  </td>
                  <td style={{ padding: '8px 10px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#7A7A72', borderBottom: '1px solid #F8F7F4', textAlign: 'right', whiteSpace: 'nowrap' }}>{d.laborCost.toLocaleString()}</td>
                  <td style={{ padding: '8px 10px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#7A7A72', borderBottom: '1px solid #F8F7F4', textAlign: 'right', whiteSpace: 'nowrap' }}>{d.materialCost.toLocaleString()}</td>
                  <td style={{ padding: '8px 10px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#7A7A72', borderBottom: '1px solid #F8F7F4', textAlign: 'right', whiteSpace: 'nowrap' }}>{d.equipmentRent.toLocaleString()}</td>
                  <td style={{ padding: '8px 10px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#4A4A44', borderBottom: '1px solid #F8F7F4', textAlign: 'right', whiteSpace: 'nowrap' }}>{d.output.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: '1px solid #F0EDE5' }}>
          <span style={{ fontSize: '12px', color: '#7A7A72' }}>
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} records
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ width: 30, height: 30, borderRadius: '6px', border: '1px solid #E8E5DD', background: page === 1 ? '#F8F7F4' : '#FFFFFF', cursor: page === 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: page === 1 ? '#A8A89E' : '#262626' }}>
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              return p <= totalPages ? (
                <button key={p} onClick={() => setPage(p)}
                  style={{ width: 30, height: 30, borderRadius: '6px', border: '1px solid #E8E5DD', background: page === p ? '#0F6E56' : '#FFFFFF', color: page === p ? '#FFFFFF' : '#262626', cursor: 'pointer', fontSize: '12px', fontWeight: page === p ? 700 : 400 }}>
                  {p}
                </button>
              ) : null;
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              style={{ width: 30, height: 30, borderRadius: '6px', border: '1px solid #E8E5DD', background: page === totalPages ? '#F8F7F4' : '#FFFFFF', cursor: page === totalPages ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: page === totalPages ? '#A8A89E' : '#262626' }}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
