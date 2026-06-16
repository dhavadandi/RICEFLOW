import {
  LayoutDashboard,
  User,
  GitBranch,
  Share2,
  MapPin,
  BarChart3,
  FileText,
  Database,
  Info,
} from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'single', label: 'Single Agent Analysis', icon: User },
  { id: 'chain', label: 'Full Chain Analysis', icon: GitBranch },
  { id: 'network', label: 'Network DEA', icon: Share2 },
  { id: 'regional', label: 'Regional Performance', icon: MapPin },
  { id: 'resource', label: 'Resource Allocation', icon: BarChart3 },
  { id: 'policy', label: 'Policy Recommendation', icon: FileText },
  { id: 'explorer', label: 'Data Explorer', icon: Database },
  { id: 'about', label: 'About Project', icon: Info },
];

const footerStats = [
  { label: 'Production Units', value: '815' },
  { label: 'Regions', value: '5' },
  { label: 'Supply Chain Stages', value: '5' },
  { label: 'Year', value: '2026' },
];

interface Props {
  active: string;
  onSelect: (id: string) => void;
}

export function Sidebar({ active, onSelect }: Props) {
  return (
    <aside
      style={{
        width: 240,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        background: '#FFFFFF',
        borderRight: '1px solid #E8E5DD',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid #F0EDE5' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0' }}>
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '17px',
            fontWeight: 700,
            color: '#0F6E56',
            letterSpacing: '-0.02em',
          }}>
            RICEFLOW
          </span>
        </div>
        <div style={{
          fontSize: '9px',
          fontWeight: 600,
          letterSpacing: '0.14em',
          color: '#7A7A72',
          marginTop: '2px',
          textTransform: 'uppercase',
        }}>
          INTELLIGENCE
        </div>
        <div style={{
          marginTop: '6px',
          fontSize: '10px',
          color: '#A8A89E',
          lineHeight: 1.4,
        }}>
          Supply Chain Decision Support
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 10px', scrollbarWidth: 'none' }}>
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '2px',
                textAlign: 'left',
                background: isActive ? '#0F6E56' : 'transparent',
                color: isActive ? '#FFFFFF' : '#4A4A44',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = '#F0EDE5';
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
            >
              <Icon size={15} strokeWidth={isActive ? 2 : 1.5} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '12.5px', fontWeight: isActive ? 500 : 400, lineHeight: 1.3 }}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer Data Card */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid #F0EDE5' }}>
        <p style={{ fontSize: '9.5px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '10px' }}>
          Dataset Summary
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {footerStats.map(({ label, value }) => (
            <div key={label} style={{ background: '#F8F7F4', borderRadius: '6px', padding: '8px 10px' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#262626', lineHeight: 1, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.02em' }}>
                {value}
              </div>
              <div style={{ fontSize: '10px', color: '#7A7A72', marginTop: '3px', lineHeight: 1.3 }}>
                {label}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '10px', color: '#A8A89E' }}>Last Updated</span>
          <span style={{ fontSize: '10px', fontWeight: 600, color: '#7A7A72' }}>Aug 2026</span>
        </div>
      </div>
    </aside>
  );
}
