import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8080/api/v1';

interface FormVersionView {
  id: string;
  formVersionId: string;
  formId: string;
  status: string;
  testPrint: boolean;
  cutInPrintDirection: boolean;
}

interface FormView {
  id: string;
  formNumber: string;
  quality: string;
}

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
  const [formVersions, setFormVersions] = useState<FormVersionView[]>([]);
  const [forms, setForms] = useState<FormView[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // New Rollout Form State
  const [newRollout, setNewRollout] = useState({
    rollsOutId: 'RO_' + Math.floor(Math.random() * 9000 + 1000),
    selectedFormVersions: [] as string[],
    machineIds: 'Machine 1', // comma separated input
    repetitions: 1
  });

  const fetchData = async () => {
    try {
      const [roRes, fvRes, fRes] = await Promise.all([
        fetch(`${API_BASE}/production/rolls-out`),
        fetch(`${API_BASE}/production/form-versions`),
        fetch(`${API_BASE}/production/forms`)
      ]);

      if (roRes.ok) setRollsOuts(await roRes.json());
      if (fvRes.ok) setFormVersions(await fvRes.json());
      if (fRes.ok) setForms(await fRes.json());
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

  const handleCreateRollout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRollout.selectedFormVersions.length === 0) {
      setNotification({ message: 'Select at least one FormVersion', type: 'error' });
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/rolls-out`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rollsOutId: newRollout.rollsOutId,
          formVersionIds: newRollout.selectedFormVersions,
          machineIds: newRollout.machineIds.split(',').map(s => s.trim()).filter(s => s),
          repetitions: newRollout.repetitions
        })
      });

      if (response.ok) {
        setNotification({ message: 'Rollout created successfully!', type: 'success' });
        setNewRollout({
          rollsOutId: 'RO_' + Math.floor(Math.random() * 9000 + 1000),
          selectedFormVersions: [],
          machineIds: 'Machine 1',
          repetitions: 1
        });
        fetchData();
      } else {
        const err = await response.text();
        setNotification({ message: `Error: ${err}`, type: 'error' });
      }
    } catch (err: any) {
      setNotification({ message: `Network error: ${err.message}`, type: 'error' });
    }
  };

  const toggleSelection = (fvId: string) => {
    setNewRollout(prev => {
      const isSelected = prev.selectedFormVersions.includes(fvId);
      return {
        ...prev,
        selectedFormVersions: isSelected 
          ? prev.selectedFormVersions.filter(id => id !== fvId)
          : [...prev.selectedFormVersions, fvId]
      };
    });
  };

  const getQuality = (fv: FormVersionView) => {
    const form = forms.find(f => f.formNumber === fv.formId);
    return form ? form.quality : 'Unknown';
  };

  return (
    <div style={{ padding: '28px', color: 'white' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '24px' }}>Rollouts Management</h1>

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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        
        {/* Create Form */}
        <div className="glass-panel" style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Create New Rollout</h2>
          <form onSubmit={handleCreateRollout} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>ROLLOUT ID</label>
              <input 
                type="text" value={newRollout.rollsOutId} 
                onChange={e => setNewRollout({...newRollout, rollsOutId: e.target.value})} 
                required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>MACHINES (comma separated)</label>
              <input 
                type="text" value={newRollout.machineIds} 
                onChange={e => setNewRollout({...newRollout, machineIds: e.target.value})} 
                placeholder="Machine 1, Machine 2"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>REPETITIONS</label>
              <input 
                type="number" min="1" value={newRollout.repetitions} 
                onChange={e => setNewRollout({...newRollout, repetitions: parseInt(e.target.value) || 1})} 
                required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>SELECT FORM VERSIONS</label>
              <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #334155', borderRadius: '4px', background: '#0f172a', padding: '8px' }}>
                {formVersions.length === 0 ? <p style={{ fontSize: '0.85rem', color: '#64748b' }}>No form versions available</p> : null}
                {formVersions.map(fv => (
                  <label key={fv.formVersionId} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={newRollout.selectedFormVersions.includes(fv.formVersionId)}
                      onChange={() => toggleSelection(fv.formVersionId)}
                    />
                    <span style={{ fontSize: '0.9rem' }}>{fv.formVersionId} <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>({getQuality(fv)})</span></span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" style={{ padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              Create Rollout
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="glass-panel" style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Rollouts Table</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8', textAlign: 'left' }}>
                <th style={{ padding: '12px 8px' }}>ID</th>
                <th style={{ padding: '12px 8px' }}>Quality</th>
                <th style={{ padding: '12px 8px' }}>Form Versions</th>
                <th style={{ padding: '12px 8px' }}>Machines</th>
                <th style={{ padding: '12px 8px' }}>Reps</th>
                <th style={{ padding: '12px 8px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rollsOuts.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>No rollouts found</td>
                </tr>
              ) : rollsOuts.map(ro => (
                <tr key={ro.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 8px', fontWeight: 600 }}>{ro.rollsOutId}</td>
                  <td style={{ padding: '12px 8px' }}>{ro.quality || 'N/A'}</td>
                  <td style={{ padding: '12px 8px', color: '#93c5fd' }}>{ro.formVersionIds?.join(', ')}</td>
                  <td style={{ padding: '12px 8px' }}>{ro.machineIds?.join(', ')}</td>
                  <td style={{ padding: '12px 8px' }}>{ro.repetitions}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700,
                      background: ro.status === 'NEW' ? 'rgba(59, 130, 246, 0.2)' : 
                                  ro.status === 'STARTED' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                      color: ro.status === 'NEW' ? '#60a5fa' : 
                             ro.status === 'STARTED' ? '#fbbf24' : '#34d399'
                    }}>
                      {ro.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
