
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
  | 'order-items'
  | 'error'
  | 'reprint'
  | 'packaging';

interface SidebarProps {
  activeSection: Section;
  onSelect: (s: Section) => void;
  onLogout: () => void;
  user: { name: string; email: string };
}

const MENU_ITEMS: { id: Section; label: string }[] = [
  { id: 'dashboard',     label: 'Dashboard' },
  { id: 'planning',      label: 'Planning' },
  { id: 'machines',      label: 'Machines' },
  { id: 'forms',         label: 'Forms' },
  { id: 'form-versions', label: 'Form Versions' },
  { id: 'rolls-in',      label: 'Rolls In' },
  { id: 'rolls-out',     label: 'Rolls Out' },
  { id: 'jobs',          label: 'Jobs' },
  { id: 'job-results',   label: 'Job Results' },
  { id: 'error',         label: 'Error' },
  { id: 'reprint',       label: 'Reprint' },
  { id: 'packaging',     label: 'Packaging' },
];

export default function Sidebar({ activeSection, onSelect, onLogout, user }: SidebarProps) {
  return (
    <aside style={{
      width: '260px',
      minWidth: '260px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#ffffff',
      borderRight: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      overflowY: 'auto',
      zIndex: 100,
    }}>

      {/* ── Logo ─────────────────────────────────────── */}
      <div style={{
        padding: '24px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '8px',
            background: '#0ea5e9', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', flexShrink: 0,
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>🏭</div>
          <div>
            <div style={{
              fontSize: '1rem', fontWeight: 800, letterSpacing: '0.05em',
              color: '#0f172a'
            }}>PRODUCTION</div>
          </div>
        </div>
      </div>

      {/* ── Navigation ───────────────────────────────── */}
      <nav style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {MENU_ITEMS.map(item => (
          <NavItem
            key={item.id}
            label={item.label}
            isActive={activeSection === item.id}
            onClick={() => onSelect(item.id)}
          />
        ))}
      </nav>

      {/* ── User ─────────────────────────────────────── */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid #e5e7eb'
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: '#f1f5f9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.9rem', fontWeight: 600, color: '#475569', flexShrink: 0
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Déconnexion"
            style={{
              background: 'transparent', border: 'none',
              color: '#94a3b8', padding: '8px', borderRadius: '6px',
              cursor: 'pointer', flexShrink: 0, width: 'auto', transform: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#fee2e2';
              e.currentTarget.style.color = '#ef4444';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ── Reusable nav item ────────────────────────────────────────────────────── */
function NavItem({ label, isActive, onClick }: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'block',
        padding: '8px 16px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: isActive ? 600 : 500,
        textAlign: 'left',
        transition: 'all 0.1s ease',
        background: isActive ? '#f0f9ff' : 'transparent',
        color: isActive ? '#0284c7' : '#475569',
        borderRadius: '6px',
        boxShadow: 'none',
        transform: 'none',
      }}
      onMouseOver={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = '#f8fafc';
          e.currentTarget.style.color = '#0f172a';
        }
      }}
      onMouseOut={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#475569';
        }
      }}
    >
      {label}
    </button>
  );
}
