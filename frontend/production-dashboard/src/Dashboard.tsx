import { useState } from 'react';

export default function Dashboard({ user }: { user: any }) {
  const [timeRange, setTimeRange] = useState<'Day' | 'Week' | 'Month'>('Day');
  const [compareOld, setCompareOld] = useState(false);

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const username = user?.name || 'User';

  return (
    <div style={{ animation: 'fadeInUp 0.6s ease' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '28px', color: 'white', letterSpacing: '-0.02em' }}>
        Dashboard
      </h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '28px' }}>
        
        {/* Profile Card */}
        <div className="glass-panel" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative background glow */}
          <div style={{
            position: 'absolute', top: '-50px', left: '-50px',
            width: '200px', height: '200px',
            background: 'radial-gradient(circle, rgba(96,165,250,0.15) 0%, transparent 70%)',
            borderRadius: '50%', pointerEvents: 'none'
          }} />

          <div style={{ alignSelf: 'center', marginBottom: '32px', position: 'relative' }}>
            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.1) 100%)',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '64px',
              fontWeight: '600',
              color: '#93c5fd',
              boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.2)'
            }}>
              {initial}
            </div>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem', fontWeight: 500 }}>Hello</p>
            <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>{username}</h2>
          </div>

          <div style={{ marginBottom: '28px', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', width: '100%', border: '1px solid rgba(255,255,255,0.03)' }}>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>User group</p>
            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#e2e8f0' }}>Super Admin</p>
          </div>

          <button style={{
            background: 'transparent',
            border: '1px solid rgba(96, 165, 250, 0.3)',
            color: '#60a5fa',
            fontWeight: '600',
            fontSize: '0.9rem',
            padding: '10px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            justifyContent: 'center',
            transition: 'all 0.2s',
            boxShadow: 'none'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(96, 165, 250, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.3)';
          }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            Edit my account
          </button>
        </div>

        {/* Turnover Chart Card */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0, color: 'white' }}>Turnover</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '4px' }}>
                {(['Day', 'Week', 'Month'] as const).map(period => (
                  <button
                    key={period}
                    onClick={() => setTimeRange(period)}
                    style={{
                      padding: '6px 16px',
                      border: 'none',
                      background: timeRange === period ? 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)' : 'transparent',
                      color: timeRange === period ? 'white' : '#94a3b8',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      borderRadius: '6px',
                      boxShadow: timeRange === period ? '0 4px 12px rgba(59,130,246,0.3)' : 'none',
                      transform: 'none'
                    }}
                  >
                    {period}
                  </button>
                ))}
              </div>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500 }}>
                <div style={{
                  width: '40px',
                  height: '22px',
                  background: compareOld ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                  borderRadius: '11px',
                  position: 'relative',
                  transition: 'background 0.3s',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    background: 'white',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '2px',
                    left: compareOld ? '20px' : '2px',
                    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }} />
                </div>
                <input
                  type="checkbox"
                  checked={compareOld}
                  onChange={(e) => setCompareOld(e.target.checked)}
                  style={{ display: 'none' }}
                />
                Compare to old
              </label>
            </div>
          </div>

          <div style={{ flexGrow: 1, width: '100%', position: 'relative', minHeight: '320px' }}>
            <div style={{ position: 'absolute', top: '-20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>
                  <div style={{ width: '24px', height: '4px', background: '#3b82f6', borderRadius: '2px', boxShadow: '0 0 8px rgba(59,130,246,0.5)' }} />
                  Days of this week
               </div>
            </div>
            
            {/* Simple SVG Chart */}
            <svg width="100%" height="100%" style={{ overflow: 'visible', marginTop: '20px' }}>
              {/* Y Axis Grid Lines */}
              {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0].map((val, i) => {
                const y = 280 - (val * 280);
                return (
                  <g key={i}>
                    <text x="25" y={y + 4} fill="#64748b" fontSize="11" fontWeight="500" textAnchor="end">{val.toFixed(1)}</text>
                    <line x1="35" y1={y} x2="100%" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  </g>
                );
              })}
              
              {/* X Axis Points */}
              {['Mo 29-06', 'Tu 30-06', 'We 01-07', 'Th 02-07', 'Fr 03-07', 'Sa 04-07', 'Su 05-07'].map((label, i) => {
                const cx = `calc(40px + (100% - 40px) * ${i / 6})`;
                return (
                  <g key={i}>
                    <text x={cx} y="310" fill="#64748b" fontSize="11" fontWeight="500" textAnchor="middle">{label}</text>
                    {(i < 4) && <circle cx={cx} cy="280" r="4" fill="#3b82f6" filter="drop-shadow(0 0 4px rgba(59,130,246,0.6))" />}
                  </g>
                );
              })}
              {/* Line connecting the points */}
              <line x1="40" y1="280" x2="calc(40px + (100% - 40px) * 0.5)" y2="280" stroke="#3b82f6" strokeWidth="2" filter="drop-shadow(0 4px 6px rgba(59,130,246,0.3))" />
            </svg>
          </div>
          
        </div>

      </div>
    </div>
  );
}
