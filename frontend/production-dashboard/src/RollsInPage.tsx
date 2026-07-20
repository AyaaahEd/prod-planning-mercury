import { useState } from 'react';

export default function RollsInPage() {
  const [rollsIn] = useState([
    { id: '1', barcode: 'QR_839210', status: 'NEW', creationDate: '07/07/2026 08:30', quality: 'viva', choice: 'first choice', size: '2.00 x 50.00' },
    { id: '2', barcode: 'QR_839211', status: 'NEW', creationDate: '07/07/2026 09:15', quality: 'viva', choice: 'first choice', size: '1.50 x 25.00' },
    { id: '3', barcode: 'QR_839212', status: 'NEW', creationDate: '07/07/2026 10:00', quality: 'viva', choice: 'first choice', size: '4.00 x 30.00' },
    { id: '4', barcode: 'QR_839213', status: 'NEW', creationDate: '07/07/2026 10:45', quality: 'viva', choice: 'first choice', size: '2.50 x 40.00' },
    { id: '5', barcode: 'QR_839214', status: 'NEW', creationDate: '07/07/2026 11:20', quality: 'viva', choice: 'first choice', size: '3.00 x 60.00' },
  ]);
  const inputStyle = {
    background: 'var(--surface-bg)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '6px',
    padding: '8px 12px',
    color: 'var(--text-primary)',
    width: '100%',
    fontSize: '0.85rem'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    marginBottom: '6px',
    fontWeight: 600
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Rolls In</h2>

      {/* Filters Section */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '20px', borderBottom: '1px solid rgba(0, 0, 0,0.1)', paddingBottom: '12px' }}>
          Filters
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={labelStyle}>Roller Barcode</label>
            <input type="text" placeholder="Search" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Quality</label>
            <input type="text" placeholder="Search" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Width</label>
            <input type="text" placeholder="Search" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Height</label>
            <input type="text" placeholder="Search" style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelStyle}>Created at</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="text" placeholder="Start" style={inputStyle} />
              <span style={{ color: 'var(--text-secondary)' }}>~</span>
              <input type="text" placeholder="End" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select style={inputStyle}>
              <option value="">Search</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Sort</label>
            <select style={inputStyle}>
              <option value="">Descending by Creation date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '20px', borderBottom: '1px solid rgba(0, 0, 0,0.1)', paddingBottom: '12px' }}>
          {rollsIn.length} result(s) found
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(0, 0, 0,0.1)' }}>
                <th style={{ padding: '12px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Roller Barcode</th>
                <th style={{ padding: '12px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Status</th>
                <th style={{ padding: '12px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Creation date</th>
                <th style={{ padding: '12px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Quality</th>
                <th style={{ padding: '12px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Choice</th>
                <th style={{ padding: '12px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Size</th>
                <th style={{ padding: '12px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rollsIn.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📭</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Aucun résultat</div>
                    <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>Ajustez vos filtres pour trouver ce que vous cherchez.</div>
                  </td>
                </tr>
              ) : (
                rollsIn.map(roll => (
                  <tr key={roll.id} style={{ borderBottom: '1px solid rgba(0, 0, 0,0.05)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'var(--surface-bg)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '16px 12px', fontWeight: 600, color: 'var(--text-primary)' }}>{roll.barcode}</td>
                    <td style={{ padding: '16px 12px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)', color: '#0ea5e9', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                        {roll.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 12px', color: 'var(--text-secondary)' }}>{roll.creationDate}</td>
                    <td style={{ padding: '16px 12px', color: 'var(--text-primary)' }}>{roll.quality}</td>
                    <td style={{ padding: '16px 12px', color: 'var(--text-primary)' }}>{roll.choice}</td>
                    <td style={{ padding: '16px 12px', color: 'var(--text-primary)' }}>{roll.size} m</td>
                    <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                      <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
