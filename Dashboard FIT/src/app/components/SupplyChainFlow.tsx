import { Sprout, Settings, ArrowLeftRight, Package, ShoppingBag, ArrowRight } from 'lucide-react';

const stages = [
  {
    id: 'petani',
    name: 'Petani',
    nameEn: 'Farmer',
    icon: Sprout,
    dmus: 163,
    avgEff: 0.682,
    scaleEff: 0.814,
    risk: 'Low',
    riskColor: '#0F6E56',
    riskBg: '#E8F5F1',
    border: '#B4DDD3',
    topBar: '#0F6E56',
  },
  {
    id: 'penggilingan',
    name: 'Penggilingan',
    nameEn: 'Rice Mill',
    icon: Settings,
    dmus: 162,
    avgEff: 0.634,
    scaleEff: 0.721,
    risk: 'Moderate',
    riskColor: '#C28B2C',
    riskBg: '#FDF5E8',
    border: '#EEDCB0',
    topBar: '#C28B2C',
  },
  {
    id: 'tengkulak',
    name: 'Tengkulak',
    nameEn: 'Trader',
    icon: ArrowLeftRight,
    dmus: 163,
    avgEff: 0.521,
    scaleEff: 0.603,
    risk: 'Moderate',
    riskColor: '#C28B2C',
    riskBg: '#FDF5E8',
    border: '#EEDCB0',
    topBar: '#C28B2C',
  },
  {
    id: 'grosir',
    name: 'Grosir',
    nameEn: 'Wholesaler',
    icon: Package,
    dmus: 164,
    avgEff: 0.412,
    scaleEff: 0.275,
    risk: 'Critical',
    riskColor: '#C0392B',
    riskBg: '#FEF0ED',
    border: '#F5C6BC',
    topBar: '#C0392B',
  },
  {
    id: 'ritel',
    name: 'Ritel',
    nameEn: 'Retail',
    icon: ShoppingBag,
    dmus: 163,
    avgEff: 0.718,
    scaleEff: 0.836,
    risk: 'Low',
    riskColor: '#0F6E56',
    riskBg: '#E8F5F1',
    border: '#B4DDD3',
    topBar: '#0F6E56',
  },
];

function EffBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ height: 4, background: '#F0EDE5', borderRadius: 2, overflow: 'hidden' }}>
      <div style={{ width: `${value * 100}%`, height: '100%', background: color, borderRadius: 2 }} />
    </div>
  );
}

export function SupplyChainFlow() {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E8E5DD',
        borderRadius: '10px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '14px' }}>
        <p style={{ fontSize: '9.5px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#A8A89E', marginBottom: '3px' }}>
          Network DEA Overview
        </p>
        <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#262626', lineHeight: 1.3 }}>
          Supply Chain Architecture
        </h2>
        <p style={{ fontSize: '11px', color: '#7A7A72', marginTop: '2px' }}>
          5-stage network · West Java Province · 815 DMUs
        </p>
      </div>

      {/* Stage flow */}
      <div style={{ display: 'flex', alignItems: 'stretch', gap: '0', flex: 1 }}>
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isGrosir = stage.id === 'grosir';
          return (
            <div key={stage.id} style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
              {/* Stage Card */}
              <div
                style={{
                  flex: 1,
                  border: `1px solid ${isGrosir ? stage.border : '#E8E5DD'}`,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: isGrosir ? '#FEF9F8' : '#FAFAF8',
                  boxShadow: isGrosir ? '0 0 0 2px rgba(192,57,43,0.12)' : 'none',
                  transition: 'box-shadow 0.2s',
                }}
              >
                {/* Colored top stripe */}
                <div style={{ height: 3, background: stage.topBar }} />

                <div style={{ padding: '12px 11px 11px' }}>
                  {/* Icon + name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '10px' }}>
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '6px',
                        background: stage.riskBg,
                        border: `1px solid ${stage.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={13} strokeWidth={1.6} color={stage.riskColor} />
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: 700, color: '#262626', lineHeight: 1.2 }}>
                        {stage.name}
                      </p>
                      <p style={{ fontSize: '9.5px', color: '#7A7A72', lineHeight: 1 }}>
                        {stage.nameEn}
                      </p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span style={{ fontSize: '9.5px', color: '#A8A89E' }}>DMUs</span>
                        <span style={{ fontSize: '10px', fontWeight: 600, color: '#262626', fontFamily: 'JetBrains Mono, monospace' }}>
                          {stage.dmus}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span style={{ fontSize: '9.5px', color: '#A8A89E' }}>Avg Eff.</span>
                        <span style={{ fontSize: '10px', fontWeight: 600, color: stage.riskColor, fontFamily: 'JetBrains Mono, monospace' }}>
                          {stage.avgEff.toFixed(3)}
                        </span>
                      </div>
                      <EffBar value={stage.avgEff} color={stage.topBar} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span style={{ fontSize: '9.5px', color: '#A8A89E' }}>Scale Eff.</span>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: isGrosir ? 700 : 600,
                          color: isGrosir ? '#C0392B' : stage.riskColor,
                          fontFamily: 'JetBrains Mono, monospace',
                        }}>
                          {stage.scaleEff.toFixed(3)}
                        </span>
                      </div>
                      <EffBar value={stage.scaleEff} color={stage.topBar} />
                    </div>
                  </div>

                  {/* Risk badge */}
                  <div style={{ marginTop: '10px' }}>
                    <span style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      letterSpacing: '0.07em',
                      textTransform: 'uppercase',
                      padding: '2px 7px',
                      borderRadius: '3px',
                      background: stage.riskBg,
                      color: stage.riskColor,
                      border: `1px solid ${stage.border}`,
                    }}>
                      {stage.risk}
                    </span>
                  </div>
                </div>
              </div>

              {/* Arrow connector */}
              {idx < stages.length - 1 && (
                <div style={{ width: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ArrowRight size={14} strokeWidth={1.5} color="#C8C6BE" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
