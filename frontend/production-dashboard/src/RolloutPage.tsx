import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8080/api/v1';

interface RollsOutView {
  id: string;
  rollsOutId: string;
  formVersionIds: string[];
  machineIds: string[];
  quality: string;
  repetitions: number;
  status: string;
}

export default function RolloutPage() {
  const [rollsOuts, setRollsOuts] = useState<RollsOutView[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchData = async () => {
    try {
      const roRes = await fetch(`${API_BASE}/production/rolls-out`).catch(() => null);

      let apiRolls = [];
      if (roRes && roRes.ok) apiRolls = await roRes.json();
      
      const localRolls = JSON.parse(localStorage.getItem('mercury_rollsOuts') || '[]');
      
      // Merge local and API rolls (avoiding duplicates by rollsOutId if possible, but for mock appending is fine)
      const combined = [...apiRolls, ...localRolls];
      // remove duplicates by rollsOutId
      const unique = Array.from(new Map(combined.map(item => [item.rollsOutId, item])).values());
      
      setRollsOuts(unique);
    } catch (err) {
      console.error('Error fetching data', err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);


  const updateRolloutStatus = (id: string, status: string) => {
    setRollsOuts(prev => prev.map(ro => ro.id === id ? { ...ro, status } : ro));
    try {
      const localRolls = JSON.parse(localStorage.getItem('mercury_rollsOuts') || '[]');
      const updatedLocal = localRolls.map((ro: any) => ro.id === id ? { ...ro, status } : ro);
      localStorage.setItem('mercury_rollsOuts', JSON.stringify(updatedLocal));
    } catch (e) {}
  };

  return (
    <div style={{ padding: '28px', color: 'var(--text-primary)' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '24px' }}>Rolls Out</h1>

      {notification && (
        <div style={{
          padding: '12px 16px', marginBottom: '24px', borderRadius: '8px',
          background: notification.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          border: `1px solid ${notification.type === 'success' ? '#34d399' : '#f87171'}`,
          color: notification.type === 'success' ? '#34d399' : '#f87171'
        }}>
          {notification.message}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Filters */}
        <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#475569', margin: 0 }}>Filters</h2>
          </div>
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', marginBottom: '24px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Roller Barcode</label>
                <input type="text" placeholder="Search" style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem', color: '#334155', outline: 'none' }} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Form ID</label>
                <input type="text" placeholder="Search" style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem', color: '#334155', outline: 'none' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Form version ID</label>
                <input type="text" placeholder="Search" style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem', color: '#334155', outline: 'none' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Job ID</label>
                <input type="text" placeholder="Search" style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem', color: '#334155', outline: 'none' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Quality</label>
                <input type="text" placeholder="Search" style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem', color: '#334155', outline: 'none' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Width</label>
                <input type="text" placeholder="Search" style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem', color: '#334155', outline: 'none' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Height</label>
                <input type="text" placeholder="Search" style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem', color: '#334155', outline: 'none' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Created at</label>
                <div style={{ position: 'relative' }}>
                  <input type="text" placeholder="Start   -   End" style={{ width: '100%', padding: '10px 30px 10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem', color: '#94a3b8', outline: 'none', textAlign: 'center' }} />
                  <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Machine</label>
                <div style={{ position: 'relative' }}>
                  <select style={{ width: '100%', padding: '10px 30px 10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem', color: '#94a3b8', outline: 'none', appearance: 'none' }}>
                    <option value="">Search</option>
                  </select>
                  <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Status</label>
                <div style={{ position: 'relative' }}>
                  <select style={{ width: '100%', padding: '10px 30px 10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem', color: '#94a3b8', outline: 'none', appearance: 'none' }}>
                    <option value="">Search</option>
                  </select>
                  <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Sort</label>
                <div style={{ position: 'relative' }}>
                  <select style={{ width: '100%', padding: '10px 30px 10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem', color: '#334155', outline: 'none', appearance: 'none' }}>
                    <option value="">Ascending by Date needed</option>
                  </select>
                  <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1', pointerEvents: 'none' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
              </div>

            </div>

            <button style={{ background: 'transparent', border: '1px solid #0ea5e9', color: '#0ea5e9', padding: '10px 16px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              Reset filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
              <thead style={{ background: '#f9fafb' }}>
                <tr style={{ borderBottom: '1px solid #e5e7eb', color: '#475569', textAlign: 'left' }}>
                  <th style={{ padding: '16px 12px', fontWeight: 600 }}>Roller Barcode</th>
                  <th style={{ padding: '16px 12px', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '16px 12px', fontWeight: 600 }}>Form version IDS</th>
                  <th style={{ padding: '16px 12px', fontWeight: 600 }}>Thumbnails</th>
                  <th style={{ padding: '16px 12px', fontWeight: 600 }}>Creation date</th>
                  <th style={{ padding: '16px 12px', fontWeight: 600 }}>Date needed</th>
                  <th style={{ padding: '16px 12px', fontWeight: 600 }}>Quality</th>
                  <th style={{ padding: '16px 12px', fontWeight: 600 }}>Size</th>
                  <th style={{ padding: '16px 12px', fontWeight: 600 }}>Track</th>
                  <th style={{ padding: '16px 12px', fontWeight: 600 }}>Action</th>
                </tr>
              </thead>
              <tbody style={{ background: 'white' }}>
                {rollsOuts.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-tertiary)' }}>No rollouts found</td>
                  </tr>
                ) : rollsOuts.map(ro => {
                  const getImagesForFormId = (id: string): string[] => {
                    if (id.includes('10:33-0001')) return ['/form1.jpg', '/form2.jpg'];
                    if (id.includes('10:37-0001')) return ['/form2-layout.jpg', '/form2-unit.jpg'];
                    if (id.includes('Raster')) return ['/form3-layout.jpg', '/form3-unit.jpg'];
                    if (id.includes('11:03-0001')) return ['/form4-layout.jpg', '/form4-unit.png'];
                    if (id.includes('11:05-0001')) return ['/form5-layout.jpg', '/form5-unit.png'];
                    if (id.includes('11:05-0002')) return ['/form6-layout.jpg', '/form6-unit.png'];
                    if (id.includes('11:06-0001')) return ['/form7-layout.jpg', '/form7-unit.png'];
                    if (id.includes('11:28-0001')) return ['/form8-layout.jpg', '/form8-unit.png'];
                    if (id.includes('PYM_47685')) return ['/form1.jpg', '/form2.jpg'];
                    if (id.includes('PCC_59253')) return ['/form2-layout.jpg', '/form2-unit.jpg'];
                    if (id.includes('PCC_55555')) return ['/form3-layout.jpg', '/form3-unit.jpg'];
                    return ['/form1.jpg', '/form2.jpg'];
                  };
                  const fvId = ro.formVersionIds?.[0] || '';
                  const images = getImagesForFormId(fvId);
                  const isStarted = ro.status === 'STARTED';
                  const isStopped = ro.status === 'STOPPED';
                  const isPatio = (ro.quality || '').toLowerCase().includes('patio');

                  return (
                  <tr key={ro.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ color: '#0ea5e9', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 500 }}>
                        {ro.rollsOutId}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                      </div>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                        <span style={{ color: isStarted ? '#10b981' : isStopped ? '#ef4444' : '#f59e0b', fontSize: '1rem' }}>●</span>
                        {ro.status === 'NEW' ? 'Waiting for manufacturing' : ro.status}
                      </div>
                    </td>
                    <td style={{ padding: '16px 12px', color: '#475569', whiteSpace: 'normal', minWidth: '150px' }}>
                      {ro.formVersionIds?.join(', ')}
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <div style={{ width: '60px', height: '40px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                          <img src={images[0]} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} alt="Thumbnail" />
                        </div>
                        {images[1] && (
                          <div style={{ width: '60px', height: '40px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                            <img src={images[1]} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} alt="Form" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px 12px', color: '#475569' }}>09/07/2026 16:47</td>
                    <td style={{ padding: '16px 12px', color: '#475569' }}>01/07/2026</td>
                    <td style={{ padding: '16px 12px' }}>
                      <span style={{ background: isPatio ? '#10b981' : '#f59e0b', color: 'white', padding: '6px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                        {ro.quality || 'Patio, with Border'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 12px', color: '#475569' }}>1.99" x 1.48" m</td>
                    <td style={{ padding: '16px 12px' }}>
                      <span style={{ border: '1px solid #fcd34d', color: '#f59e0b', padding: '6px 10px', borderRadius: '6px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.6rem' }}>●</span> Cutting
                      </span>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button 
                            onClick={() => updateRolloutStatus(ro.id, 'STARTED')} 
                            disabled={isStarted}
                            style={{ background: 'transparent', border: 'none', color: isStarted ? '#9ca3af' : '#10b981', display: 'flex', alignItems: 'center', gap: '6px', cursor: isStarted ? 'not-allowed' : 'pointer', fontWeight: 600, padding: 0 }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill={isStarted ? '#9ca3af' : "none"} stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                            Start
                          </button>
                          <button 
                            onClick={() => updateRolloutStatus(ro.id, 'STOPPED')} 
                            disabled={isStopped}
                            style={{ background: 'transparent', border: 'none', color: isStopped ? '#9ca3af' : '#ef4444', display: 'flex', alignItems: 'center', gap: '6px', cursor: isStopped ? 'not-allowed' : 'pointer', fontWeight: 600, padding: 0 }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill={isStopped ? '#9ca3af' : "none"} stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                            Stop
                          </button>
                        </div>
                        <button style={{ background: 'transparent', border: 'none', color: '#f97316', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600, padding: 0 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                          Put all in one pallet
                        </button>
                        <button style={{ background: 'transparent', border: 'none', color: '#0ea5e9', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600, padding: 0 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                          Print
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
