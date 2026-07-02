import { useState } from 'react';

export type Section =
  | 'dashboard'
  | 'planning'
  | 'machines'
  | 'forms'
  | 'form-versions'
  | 'rolls-in'
  | 'rolls-out'
  | 'jobs'
  | 'job-results'
  | 'coating-in'
  | 'coating-out'
  | 'order-items';

interface SidebarProps {
  activeSection: Section;
  onSelect: (s: Section) => void;
  onLogout: () => void;
  user: { name: string; email: string };
}

const PRODUCTION_ITEMS: { id: Section; label: string }[] = [
  { id: 'planning',      label: 'Planning' },
  { id: 'machines',      label: 'Machines' },
  { id: 'forms',         label: 'Forms' },
  { id: 'form-versions', label: 'Form Versions' },
  { id: 'rolls-in',      label: 'Rolls In' },
  { id: 'rolls-out',     label: 'Rolls Out' },
  { id: 'jobs',          label: 'Jobs' },
  { id: 'job-results',   label: 'Job-results' },
  { id: 'coating-in',    label: 'Coating In' },
  { id: 'coating-out',   label: 'Coating Out' },
];

export default function Sidebar({ activeSection, onSelect, onLogout, user }: SidebarProps) {
  const [productionOpen, setProductionOpen] = useState(true);

  const isProductionSection = PRODUCTION_ITEMS.some(i => i.id === activeSection);

  return (
    <aside style={{
      width: '240px',
      minWidth: '240px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(10, 14, 26, 0.97)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      position: 'sticky',
      top: 0,
      overflowY: 'auto',
      zIndex: 100,
    }}>

      {/* ── Logo ─────────────────────────────────────── */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '11px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', flexShrink: 0,
            boxShadow: '0 4px 14px rgba(59,130,246,0.4)'
          }}>🏭</div>
          <div>
            <div style={{
              fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.1em',
              background: 'linear-gradient(135deg, #60a5fa 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>MERCURY</div>
            <div style={{ fontSize: '0.66rem', color: '#334155', fontWeight: 600, letterSpacing: '0.08em' }}>
              FLOORING
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation ───────────────────────────────── */}
      <nav style={{ flex: 1, padding: '12px 10px' }}>

        {/* Dashboard */}
        <div style={{ marginBottom: '4px' }}>
          <div style={{
            fontSize: '0.65rem', fontWeight: 700, color: '#334155',
            letterSpacing: '0.1em', padding: '8px 10px 4px'
          }}>MENU</div>

          <NavItem
            label="Dashboard"
            icon="📊"
            isActive={activeSection === 'dashboard'}
            onClick={() => onSelect('dashboard')}
          />
        </div>

        {/* Production Planning group */}
        <div style={{ marginTop: '8px' }}>
          {/* Group header — clickable to collapse */}
          <button
            onClick={() => setProductionOpen(o => !o)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px 6px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              boxShadow: 'none',
              transform: 'none',
              borderRadius: '8px',
              transition: 'background 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '15px' }}>🏗️</span>
              <span style={{
                fontSize: '0.78rem', fontWeight: 700,
                color: isProductionSection ? '#60a5fa' : '#94a3b8',
                letterSpacing: '0.03em'
              }}>
                Production Planning
              </span>
            </div>
            <span style={{
              fontSize: '10px',
              color: '#475569',
              transition: 'transform 0.2s',
              display: 'inline-block',
              transform: productionOpen ? 'rotate(0deg)' : 'rotate(-90deg)'
            }}>▼</span>
          </button>

          {/* Sub-items */}
          {productionOpen && (
            <div style={{ paddingLeft: '12px' }}>
              {PRODUCTION_ITEMS.map(item => (
                <NavItem
                  key={item.id}
                  label={item.label}
                  isActive={activeSection === item.id}
                  onClick={() => onSelect(item.id)}
                  sub
                />
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* ── User ─────────────────────────────────────── */}
      <div style={{
        padding: '12px 10px',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px', borderRadius: '11px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.85rem', fontWeight: 800, color: 'white', flexShrink: 0
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.name}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Déconnexion"
            style={{
              background: 'transparent', border: '1px solid rgba(239,68,68,0.25)',
              color: '#ef4444', padding: '5px 7px', borderRadius: '7px',
              fontSize: '13px', boxShadow: 'none', cursor: 'pointer',
              flexShrink: 0, width: 'auto', transform: 'none'
            }}
          >⏻</button>
        </div>
      </div>
    </aside>
  );
}

/* ── Reusable nav item ────────────────────────────────────────────────────── */
function NavItem({ label, icon, isActive, onClick, sub }: {
  label: string;
  icon?: string;
  isActive: boolean;
  onClick: () => void;
  sub?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '9px',
        padding: sub ? '8px 10px' : '9px 10px',
        border: 'none',
        cursor: 'pointer',
        fontSize: sub ? '0.855rem' : '0.875rem',
        fontWeight: isActive ? 700 : 400,
        textAlign: 'left',
        transition: 'all 0.15s ease',
        background: isActive
          ? 'rgba(59,130,246,0.15)'
          : 'transparent',
        color: isActive ? '#93c5fd' : '#64748b',
        borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
        borderRadius: isActive ? '0 9px 9px 0' : '9px',
        boxShadow: 'none',
        transform: 'none',
        marginBottom: '1px'
      }}
    >
      {icon && <span style={{ fontSize: '15px' }}>{icon}</span>}
      {sub && !icon && (
        <span style={{
          width: '5px', height: '5px', borderRadius: '50%',
          background: isActive ? '#3b82f6' : '#334155',
          flexShrink: 0
        }} />
      )}
      <span>{label}</span>
    </button>
  );
}
