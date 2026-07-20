import { useState } from 'react';

export default function Dashboard({ user }: { user: any }) {
  const [timeRange, setTimeRange] = useState<'Day' | 'Week' | 'Month'>('Day');
  const [compareOld, setCompareOld] = useState(false);

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const username = user?.name || 'User';

  return (
    <div style={{ animation: 'fadeInUp 0.6s ease' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '28px', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
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
              background: '#e0f2fe',
              border: '1px solid rgba(0, 0, 0,0.05)',
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
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>Hello</p>
            <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{username}</h2>
          </div>

          <div style={{ marginBottom: '28px', padding: '12px 16px', background: 'var(--surface-bg)', borderRadius: '10px', width: '100%', border: '1px solid var(--surface-border)' }}>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>User group</p>
            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Super Admin</p>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Stats Cards Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {[
              { title: "JOBS EN COURS", value: "2", icon: <svg width="20" height="20" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>, color: "#3b82f6" },
              { title: "JOBS PLANIFIÉS", value: "1", icon: <svg width="20" height="20" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, color: "#64748b" },
              { title: "ERREURS OUVERTES", value: "0", icon: <svg width="20" height="20" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>, color: "#ef4444" },
              { title: "RENDEMENT (OEE)", value: "80%", icon: <svg width="20" height="20" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: "#10b981" }
            ].map((stat, i) => (
              <div key={i} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.05em' }}>{stat.title}</span>
                  {stat.icon}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 700, color: stat.color }}>{stat.value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Schedule Chart Card */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>Today Schedule</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ display: 'flex', background: 'var(--surface-bg)', border: '1px solid var(--surface-border)', borderRadius: '8px', padding: '4px' }}>
                {(['Day', 'Month'] as const).map(period => (
                  <button
                    key={period}
                    onClick={() => setTimeRange(period)}
                    style={{
                      padding: '6px 16px',
                      border: 'none',
                      background: timeRange === period ? '#0ea5e9' : 'transparent',
                      color: timeRange === period ? 'white' : 'var(--text-secondary)',
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
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                <div style={{
                  width: '40px',
                  height: '22px',
                  background: compareOld ? '#3b82f6' : 'rgba(0,0,0,0.1)',
                  borderRadius: '11px',
                  position: 'relative',
                  transition: 'background 0.3s',
                  border: '1px solid rgba(0,0,0,0.1)'
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
                    <line x1="35" y1={y} x2="100%" y2={y} stroke="var(--panel-border)" strokeWidth="1" />
                  </g>
                );
              })}
              
              {/* Lines connecting the points */}
              {[180, 140, 100, 56].map((y, i, arr) => {
                if (i === 0) return null;
                const prevY = arr[i - 1];
                const x1 = `calc(40px + (100% - 40px) * ${(i - 1) / 6})`;
                const x2 = `calc(40px + (100% - 40px) * ${i / 6})`;
                return (
                  <line key={`line-${i}`} x1={x1} y1={prevY} x2={x2} y2={y} stroke="#3b82f6" strokeWidth="2" filter="drop-shadow(0 4px 6px rgba(59,130,246,0.3))" />
                );
              })}
              {/* X Axis Points */}
              {['Mo 29-06', 'Tu 30-06', 'We 01-07', 'Th 02-07', 'Fr 03-07', 'Sa 04-07', 'Su 05-07'].map((label, i) => {
                const cx = `calc(40px + (100% - 40px) * ${i / 6})`;
                const yValues = [180, 140, 100, 56];
                return (
                  <g key={i}>
                    <text x={cx} y="310" fill="#64748b" fontSize="11" fontWeight="500" textAnchor="middle">{label}</text>
                    {(i < 4) && <circle cx={cx} cy={yValues[i]} r="4" fill="#3b82f6" filter="drop-shadow(0 0 4px rgba(59,130,246,0.6))" />}
                  </g>
                );
              })}
            </svg>
          </div>
          
        </div>

        {/* Live Pipeline Card */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 24px 0', color: 'var(--text-primary)' }}>Live Pipeline</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 1fr 1fr 100px', padding: '0 16px', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <span>Order ID</span>
              <span>Planning</span>
              <span>Production</span>
              <span>Emballage</span>
              <span style={{ textAlign: 'right' }}>Status</span>
            </div>
            
            {/* Pipeline Items */}
            {[
              { id: 'ORD-089', status: 'planning', progress: 0 },
              { id: 'ORD-090', status: 'production', progress: 50 },
              { id: 'ORD-091', status: 'production', progress: 50 },
              { id: 'ORD-092', status: 'emballage', progress: 100 },
            ].map((order, i) => (
              <div key={i} style={{ 
                display: 'grid', gridTemplateColumns: '100px 1fr 1fr 1fr 100px', alignItems: 'center',
                background: 'var(--surface-bg)', borderRadius: '8px', padding: '16px', border: '1px solid var(--surface-border)',
                boxShadow: order.status === 'production' ? 'inset 0 0 0 1px rgba(139,92,246,0.3), 0 4px 12px rgba(139,92,246,0.1)' : 'none',
                position: 'relative', overflow: 'hidden'
              }}>
                {order.status === 'production' && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: '#8b5cf6', boxShadow: '0 0 8px #8b5cf6' }} />}
                
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem', paddingLeft: order.status === 'production' ? '12px' : '0' }}>{order.id}</span>
                
                {/* Planning Step */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 8px rgba(59,130,246,0.6)' }} />
                  <div style={{ height: '2px', background: order.progress >= 50 ? '#3b82f6' : 'rgba(0,0,0,0.1)', flexGrow: 1, marginRight: '16px', transition: 'background 0.5s' }} />
                </div>
                
                {/* Production Step */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: order.progress >= 50 ? '#8b5cf6' : 'rgba(0,0,0,0.1)', boxShadow: order.progress >= 50 ? '0 0 8px rgba(139,92,246,0.6)' : 'none' }} />
                  <div style={{ height: '2px', background: order.progress >= 100 ? '#8b5cf6' : 'rgba(0,0,0,0.1)', flexGrow: 1, marginRight: '16px', transition: 'background 0.5s' }} />
                </div>
                
                {/* Emballage Step */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: order.progress >= 100 ? '#10b981' : 'rgba(0,0,0,0.1)', boxShadow: order.progress >= 100 ? '0 0 8px rgba(16,185,129,0.6)' : 'none' }} />
                </div>
                
                <span style={{ 
                  textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, padding: '4px 8px', borderRadius: '12px',
                  background: order.status === 'emballage' ? 'rgba(16,185,129,0.1)' : order.status === 'production' ? 'rgba(139,92,246,0.1)' : 'rgba(59,130,246,0.1)',
                  color: order.status === 'emballage' ? '#10b981' : order.status === 'production' ? '#a78bfa' : '#60a5fa'
                }}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        </div>
      </div>
    </div>
  );
}
