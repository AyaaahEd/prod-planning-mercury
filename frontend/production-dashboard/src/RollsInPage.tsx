import React from 'react';

export default function RollsInPage() {
  const inputStyle = {
    background: 'rgba(15, 23, 42, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '6px',
    padding: '8px 12px',
    color: 'white',
    width: '100%',
    fontSize: '0.85rem'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    color: '#94a3b8',
    marginBottom: '6px',
    fontWeight: 600
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>Rolls In</h2>

      {/* Filters Section */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
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
              <span style={{ color: '#94a3b8' }}>~</span>
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
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'white', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
          0 result(s) found
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '12px', color: '#94a3b8', fontWeight: 600, fontSize: '0.85rem' }}>Roller Barcode</th>
                <th style={{ padding: '12px', color: '#94a3b8', fontWeight: 600, fontSize: '0.85rem' }}>Status</th>
                <th style={{ padding: '12px', color: '#94a3b8', fontWeight: 600, fontSize: '0.85rem' }}>Creation date</th>
                <th style={{ padding: '12px', color: '#94a3b8', fontWeight: 600, fontSize: '0.85rem' }}>Quality</th>
                <th style={{ padding: '12px', color: '#94a3b8', fontWeight: 600, fontSize: '0.85rem' }}>Choice</th>
                <th style={{ padding: '12px', color: '#94a3b8', fontWeight: 600, fontSize: '0.85rem' }}>Size</th>
                <th style={{ padding: '12px', color: '#94a3b8', fontWeight: 600, fontSize: '0.85rem', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📭</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 500, color: '#94a3b8' }}>Aucun résultat</div>
                  <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>Ajustez vos filtres pour trouver ce que vous cherchez.</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
