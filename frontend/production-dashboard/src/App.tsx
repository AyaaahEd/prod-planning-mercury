import React, { useState, useEffect } from 'react';
import LoginPage from './LoginPage';
import type { Section } from './Sidebar';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import RolloutPage from './RolloutPage';
import RollsInPage from './RollsInPage';

// API Base URL
const API_BASE = 'http://localhost:8080/api/v1/production';

interface PlacedObject {
  orderItemId: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

interface FormView {
  id: string;
  formNumber: string;
  width: number;
  height: number;
  quality: string;
  repetition: number;
  reprint: boolean;
  status: string;
  placedObjects: PlacedObject[];
}

interface OrderItemView {
  id: string;
  orderItemId: string;
  width: number;
  height: number;
  sourceSystem: string;
  quality: string;
  border: string;
  status: string;
  reprintState: string;
  formNumber?: string;
  x?: number;
  y?: number;
}

interface JobView {
  id: string;
  jobId: string;
  machineId: string;
  formNumbers: string[];
  status: string;
}

export default function App() {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(() => {
    try {
      const session = localStorage.getItem('mercury_session');
      return session ? JSON.parse(session) : null;
    } catch { return null; }
  });

  const handleLogin = (user: { email: string; name: string }) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('mercury_session');
    setCurrentUser(null);
  };

  // ── Navigation & Selection ────────────────────────────────────────────────
  const [activeSection, setActiveSection] = useState<Section>('dashboard');


  const [forms, setForms] = useState<FormView[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItemView[]>([]);
  const [jobs, setJobs] = useState<JobView[]>([]);
  
  // Connection / Loading Status
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  // Forms & Selections
  const [selectedFormId, setSelectedFormId] = useState<string>('');
  
  // Simulator Forms State
  const [simOrder, setSimOrder] = useState({
    orderItemId: 'PCC_1001',
    width: 1.20,
    height: 2.00,
    quality: 'Velvet',
    border: 'Overlocked'
  });
  
  // Create Job Wizard State
  const [newJob, setNewJob] = useState({
    jobId: 'JOB_' + Math.floor(Math.random() * 900 + 100),
    machineId: 'Colaris 1',
    selectedForms: [] as string[]
  });

  // Machines State
  const [machinesList, setMachinesList] = useState([
    { id: '1', name: 'Colaris', creationDate: '07/10/2020', location: 'Internal', status: 'ACTIVE' },
    { id: '2', name: 'Coating', creationDate: '07/10/2020', location: 'Internal', status: 'ACTIVE' },
    { id: '3', name: 'Cutting', creationDate: '07/10/2020', location: 'Internal', status: 'ACTIVE' },
    { id: '4', name: 'Coating+in-line Cutting', creationDate: '07/10/2020', location: 'Internal', status: 'ACTIVE' },
    { id: '5', name: 'EFI-printer', creationDate: '07/10/2020', location: 'Internal', status: 'ACTIVE' },
    { id: '6', name: 'Sewing', creationDate: '07/10/2020', location: 'Internal', status: 'ACTIVE' }
  ]);
  const [editingMachine, setEditingMachine] = useState<any>(null);

  // Bulk Planning Workflow States
  const [selectedFormIds, setSelectedFormIds] = useState<string[]>([]);
  const [formsToPlan, setFormsToPlan] = useState<any[]>([]);
  const [formVersionsList, setFormVersionsList] = useState<any[]>([]);

  // Add Reservation Modal State
  const [isAddReservationOpen, setIsAddReservationOpen] = useState<boolean>(false);
  const [newReservation, setNewReservation] = useState({ machine: 'Colaris 1', info: '', dates: [] as string[] });

  // Add Machine Modal State
  const [isAddMachineOpen, setIsAddMachineOpen] = useState<boolean>(false);
  const [newMachineForm, setNewMachineForm] = useState({
    name: '',
    process: '',
    setupTime: '',
    efficiency: '',
    type: 'Printing',
    quantity: '',
    speed: '',
    border: false,
    status: true,
    schedule: {
      Monday: { start: '', end: '' },
      Tuesday: { start: '', end: '' },
      Wednesday: { start: '', end: '' },
      Thursday: { start: '', end: '' },
      Friday: { start: '', end: '' },
      Saturday: { start: '', end: '' },
      Sunday: { start: '', end: '' }
    },
    exceptions: [] as { startDate: string, endDate: string, start: string, end: string }[]
  });

  // Forms State (Mock from XML)
  const [formsList, setFormsList] = useState([
    {
      id: '1',
      formId: 'Kader-20260206 10:33-0001',
      quality: 'UNCOATED 220gsm',
      dimension: '90.048 x 60.027',
      size: '195 x 276.144 mm',
      repetition: '9',
      printingTime: '1m 31s',
      rollType: 'K',
      printedDate: '-',
      dateNeeded: '24/03/2026',
      deliveredDate: '-',
      status: 'NEW'
    },
    {
      id: '2',
      formId: 'Kader-20260206 10:37-0001',
      quality: 'UNCOATED 220gsm',
      dimension: '90.048 x 60.027',
      size: '195 x 92.048 mm',
      repetition: '3',
      printingTime: '0m 2s',
      rollType: 'K',
      printedDate: '-',
      dateNeeded: '24/03/2026',
      deliveredDate: '-',
      status: 'NEW'
    },
    {
      id: '3',
      formId: 'Raster-20260206 10:53-0001',
      quality: 'UNCOATED 220gsm',
      dimension: '60.000 x 40.000',
      size: '195 x 40 mm',
      repetition: '3',
      printingTime: '0m 2s',
      rollType: 'R',
      printedDate: '-',
      dateNeeded: '24/02/2026',
      deliveredDate: '-',
      status: 'NEW'
    },
    {
      id: '4',
      formId: 'Kader-20260206 11:03-0001',
      quality: 'UNCOATED 220gsm',
      dimension: '60.000 x 40.000',
      size: '195 x 42 mm',
      repetition: '3',
      printingTime: '0m 2s',
      rollType: 'K',
      printedDate: '-',
      dateNeeded: '02/03/2026',
      deliveredDate: '-',
      status: 'NEW'
    },
    {
      id: '5',
      formId: 'Kader-20260206 11:05-0001',
      quality: 'UNCOATED 220gsm',
      dimension: '60.000 x 40.000',
      size: '195 x 42 mm',
      repetition: '3',
      printingTime: '0m 2s',
      rollType: 'K',
      printedDate: '-',
      dateNeeded: '02/03/2026',
      deliveredDate: '-',
      status: 'NEW'
    },
    {
      id: '6',
      formId: 'Kader-20260206 11:05-0002',
      quality: 'UNCOATED 220gsm',
      dimension: '60.000 x 40.000',
      size: '195 x 42 mm',
      repetition: '3',
      printingTime: '0m 2s',
      rollType: 'K',
      printedDate: '-',
      dateNeeded: '02/03/2026',
      deliveredDate: '-',
      status: 'NEW'
    },
    {
      id: '7',
      formId: 'Kader-20260206 11:06-0001',
      quality: 'UNCOATED 220gsm',
      dimension: '60.000 x 40.000',
      size: '195 x 42 mm',
      repetition: '3',
      printingTime: '0m 2s',
      rollType: 'K',
      printedDate: '-',
      dateNeeded: '02/03/2026',
      deliveredDate: '-',
      status: 'NEW'
    },
    {
      id: '8',
      formId: 'Raster-20260206 11:08-0001',
      quality: 'UNCOATED 220gsm',
      dimension: '185.000 x 100.000',
      size: '191 x 100 mm',
      repetition: '1',
      printingTime: '0m 2s',
      rollType: 'R',
      printedDate: '-',
      dateNeeded: '04/03/2026',
      deliveredDate: '-',
      status: 'NEW'
    },
    {
      id: '9',
      formId: 'Raster-20260206 11:09-0001',
      quality: 'UNCOATED 220gsm',
      dimension: '60.000 x 40.000',
      size: '195 x 40 mm',
      repetition: '3',
      printingTime: '0m 2s',
      rollType: 'R',
      printedDate: '-',
      dateNeeded: '02/03/2026',
      deliveredDate: '-',
      status: 'NEW'
    },
    {
      id: '10',
      formId: 'Kader-20260206 11:28-0001',
      quality: 'UNCOATED 220gsm',
      dimension: '100.000 x 45.000',
      size: '195 x 102 mm',
      repetition: '4',
      printingTime: '0m 2s',
      rollType: 'K',
      printedDate: '-',
      dateNeeded: '10/02/2026',
      deliveredDate: '-',
      status: 'NEW'
    }
  ]);

  const [notification, setNotification] = useState<{ message: string; type: 'info' | 'success' | 'error' } | null>(null);

  // Auto-clear notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Fetch Data from Spring Boot
  const fetchData = async (showLoader = false) => {
    if (showLoader) setIsRefreshing(true);
    try {
      const [resForms, resItems, resJobs] = await Promise.all([
        fetch(`${API_BASE}/forms`),
        fetch(`${API_BASE}/order-items`),
        fetch(`${API_BASE}/jobs`)
      ]);

      if (resForms.ok && resItems.ok && resJobs.ok) {
        const dataForms: FormView[] = await resForms.json();
        const dataItems: OrderItemView[] = await resItems.json();
        const dataJobs: JobView[] = await resJobs.json();

        setForms(dataForms);
        setOrderItems(dataItems);
        setJobs(dataJobs);
        setIsOnline(true);

        // Pre-select first form if none selected
        if (dataForms.length > 0 && !selectedFormId) {
          setSelectedFormId(dataForms[0].id);
        }
      } else {
        setIsOnline(false);
      }
    } catch (error) {
      console.error('Error fetching API data', error);
      setIsOnline(false);
    } finally {
      if (showLoader) setIsRefreshing(false);
    }
  };

  // Poll data every 3 seconds for dynamic reactivity
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 3000);
    return () => clearInterval(interval);
  }, [selectedFormId]);

  // Trigger simulated Order_Paid Event via Kafka
  const handleSimulateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/commands/simulate-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderItemId: simOrder.orderItemId,
          width: simOrder.width,
          height: simOrder.height,
          quality: simOrder.quality,
          border: simOrder.border
        })
      });
      if (response.ok) {
        setNotification({
          message: `Kafka order simulation sent successfully for ${simOrder.orderItemId}!`,
          type: 'success'
        });
        // Mutate order itemId to generate unique next order ID
        const num = parseInt(simOrder.orderItemId.split('_')[1] || '1000') + 1;
        const prefix = simOrder.orderItemId.split('_')[0] || 'PCC';
        setSimOrder(prev => ({ ...prev, orderItemId: `${prefix}_${num}` }));
      } else {
        const errText = await response.text();
        setNotification({ message: `Kafka simulation failed: ${errText}`, type: 'error' });
      }
    } catch (err: any) {
      setNotification({ message: `Network error: ${err.message}`, type: 'error' });
    }
  };

  // Trigger Metaboard ZIP layout sync (simulates FTP drop)
  const handleSimulateLayout = async () => {
    try {
      const response = await fetch(`${API_BASE}/commands/simulate-layout`, {
        method: 'POST'
      });
      if (response.ok) {
        const data = await response.json();
        setNotification({
          message: `Metaboard ZIP synchronization simulated! ${data.message}`,
          type: 'success'
        });
        fetchData();
      } else {
        const errText = await response.text();
        setNotification({ message: `Metaboard simulation failed: ${errText}`, type: 'error' });
      }
    } catch (err: any) {
      setNotification({ message: `Network error: ${err.message}`, type: 'error' });
    }
  };

  // Create new Production Job Wizard
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newJob.selectedForms.length === 0) {
      setNotification({ message: 'Please select at least one form sheet to print.', type: 'error' });
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/commands/create-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: newJob.jobId,
          machineId: newJob.machineId,
          formNumbers: newJob.selectedForms
        })
      });
      if (response.ok) {
        setNotification({ message: `Job ${newJob.jobId} created successfully!`, type: 'success' });
        setNewJob({
          jobId: 'JOB_' + Math.floor(Math.random() * 900 + 100),
          machineId: 'Colaris 1',
          selectedForms: []
        });
        fetchData();
      } else {
        const errText = await response.text();
        setNotification({ message: `Failed to create job: ${errText}`, type: 'error' });
      }
    } catch (err: any) {
      setNotification({ message: `Network error: ${err.message}`, type: 'error' });
    }
  };

  // Toggle form selection for Job wizard
  const toggleFormSelection = (formNum: string) => {
    setNewJob(prev => {
      const alreadySelected = prev.selectedForms.includes(formNum);
      const updated = alreadySelected
        ? prev.selectedForms.filter(f => f !== formNum)
        : [...prev.selectedForms, formNum];
      return { ...prev, selectedForms: updated };
    });
  };

  // Job status control endpoints
  const runJobCommand = async (command: 'start-job' | 'advance-cutting' | 'complete-job', jobId: string) => {
    let endpoint = '';
    if (command === 'start-job') endpoint = `start-job/${jobId}`;
    if (command === 'advance-cutting') endpoint = `advance-cutting/${jobId}`;
    if (command === 'complete-job') endpoint = `complete-job/${jobId}`;

    try {
      const response = await fetch(`${API_BASE}/commands/${endpoint}`, { method: 'POST' });
      if (response.ok) {
        setNotification({ message: `Workflow status updated for Job ${jobId}!`, type: 'success' });
        fetchData();
      } else {
        const errText = await response.text();
        setNotification({ message: `Failed to update workflow: ${errText}`, type: 'error' });
      }
    } catch (err: any) {
      setNotification({ message: `Network error: ${err.message}`, type: 'error' });
    }
  };

  // Selected Form View Object for visual sheet mapping
  const activeFormView = forms.find(f => f.id === selectedFormId);

  // Status Badge coloring mapper
  const getStatusBadgeStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return { backgroundColor: 'rgba(100, 116, 139, 0.2)', color: '#94a3b8', border: '1px solid rgba(148, 163, 184, 0.3)' };
      case 'SCHEDULED': return { backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' };
      case 'PRINTING': case 'RUNNING': return { backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' };
      case 'CUTTING': return { backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.3)' };
      case 'DONE': case 'COMPLETED': return { backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' };
      default: return { backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#e2e8f0' };
    }
  };

  // Render login page if not authenticated
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* ── LEFT SIDEBAR ── */}
      <Sidebar
        activeSection={activeSection}
        onSelect={setActiveSection}
        onLogout={handleLogout}
        user={currentUser}
      />

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-gradient)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '28px 28px' }}>
      
      {/* HEADER PANEL */}
      <header className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #60a5fa 0%, #ec4899 50%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.05em',
            marginBottom: '4px'
          }}>
            PRODUCTION PLANNING
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: 500 }}>
            Production Planning Control Center (Web-to-Print Microservice System)
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Online status */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            padding: '8px 16px', borderRadius: '9999px',
            border: '1px solid var(--panel-border)', fontSize: '0.85rem'
          }}>
            <span className={`pulse-indicator ${isOnline ? 'online' : 'offline'}`}></span>
            <span style={{ fontWeight: 600 }}>{isOnline ? 'SERVICE ALIVE' : 'CONNECTING...'}</span>
          </div>

          {/* Refresh */}
          <button onClick={() => fetchData(true)} className="secondary" disabled={isRefreshing} style={{ padding: '8px 16px' }}>
            <svg style={{ width: '16px', height: '16px', animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.253 8H18" />
            </svg>
            Refresh
          </button>

          {/* User avatar + logout */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'rgba(15,23,42,0.5)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px', padding: '8px 14px'
          }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.85rem', fontWeight: 800, color: 'white',
              flexShrink: 0, boxShadow: '0 0 10px rgba(59,130,246,0.4)'
            }}>
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                {currentUser.email}
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Se déconnecter"
              style={{
                background: 'transparent', border: '1px solid rgba(239,68,68,0.3)',
                color: '#ef4444', padding: '6px 10px', borderRadius: '8px',
                fontSize: '0.75rem', boxShadow: 'none', fontWeight: 600,
                cursor: 'pointer', marginLeft: '4px', width: 'auto'
              }}
            >
              ⏻
            </button>
          </div>
        </div>
      </header>

      {/* NOTIFICATIONS */}
      {notification && (
        <div className="glass-panel" style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderLeft: `4px solid ${notification.type === 'success' ? 'var(--success)' : notification.type === 'error' ? 'var(--error)' : 'var(--info)'}`,
          padding: '16px 24px',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: notification.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: notification.type === 'success' ? 'var(--success)' : 'var(--error)',
            fontWeight: 'bold'
          }}>
            {notification.type === 'success' ? '✓' : '!'}
          </div>
          <p style={{ margin: 0, fontWeight: 500, fontSize: '0.95rem' }}>{notification.message}</p>
        </div>
      )}

      {/* ROLLOUT PAGE ROUTING */}
      {activeSection === 'rolls-out' && <RolloutPage />}

      {/* DASHBOARD LAYOUT GRID */}
      {activeSection === 'dashboard' && <Dashboard user={currentUser} />}

      {/* SIMULATORS LAYOUT GRID */}
      {activeSection === 'simulators' && <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px', marginBottom: '32px' }}>
        
        {/* LEFT COLUMN: SIMULATORS & CONTROLS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* SIMULATOR: ORDER EVENTS (KAFKA) */}
          <div className="glass-panel">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--secondary)' }}>⚡</span> Simulator: Order Payments (Kafka)
            </h2>
            <form onSubmit={handleSimulateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>ORDER ITEM ID</label>
                <input
                  type="text"
                  value={simOrder.orderItemId}
                  onChange={e => setSimOrder({ ...simOrder, orderItemId: e.target.value })}
                  placeholder="e.g. PCC_1001"
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>WIDTH (m)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={simOrder.width}
                    onChange={e => setSimOrder({ ...simOrder, width: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>HEIGHT (m)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={simOrder.height}
                    onChange={e => setSimOrder({ ...simOrder, height: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>QUALITY</label>
                  <select
                    value={simOrder.quality}
                    onChange={e => setSimOrder({ ...simOrder, quality: e.target.value })}
                  >
                    <option value="Velvet">Velvet</option>
                    <option value="Standard-Quality">Standard</option>
                    <option value="Vinyl">Vinyl</option>
                    <option value="Silk">Silk</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>BORDER</label>
                  <select
                    value={simOrder.border}
                    onChange={e => setSimOrder({ ...simOrder, border: e.target.value })}
                  >
                    <option value="None">None</option>
                    <option value="Sewn">Sewn</option>
                    <option value="Overlocked">Overlocked</option>
                  </select>
                </div>
              </div>
              <button type="submit" style={{ marginTop: '8px' }}>
                Publish OrderPaid event
              </button>
            </form>
          </div>

          {/* SIMULATOR: METABOARD FILE SYNC (FTP) */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--info)' }}>📂</span> Simulator: Metaboard Layouts (FTP)
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
              Simulates the prepress system (Metaboard) exporting a print layout as a JDF/XML configuration packaged inside a ZIP file.
            </p>
            <button onClick={handleSimulateLayout} className="secondary" style={{ width: '100%', justifyContent: 'center' }}>
              Drop ZIP into FTP Inbound
            </button>
          </div>

          {/* WIZARD: CREATE PRODUCTION JOB */}
          <div className="glass-panel">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--success)' }}>🛠️</span> Plan Job Execution
            </h2>
            <form onSubmit={handleCreateJob} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>JOB ID</label>
                <input
                  type="text"
                  value={newJob.jobId}
                  onChange={e => setNewJob({ ...newJob, jobId: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>PRODUCTION MACHINE</label>
                <select
                  value={newJob.machineId}
                  onChange={e => setNewJob({ ...newJob, machineId: e.target.value })}
                >
                  <option value="Colaris 1">Colaris 1 (Inkjet Carpet)</option>
                  <option value="Colaris 2">Colaris 2 (Inkjet Carpet)</option>
                  <option value="ChromoJet 1">ChromoJet 1 (Heavy Carpet)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>
                  SELECT SHEETS/FORMS TO BATCH ({newJob.selectedForms.length} selected)
                </label>
                <div style={{
                  maxHeight: '130px',
                  overflowY: 'auto',
                  border: '1px solid var(--input-border)',
                  borderRadius: '8px',
                  background: 'var(--input-bg)',
                  padding: '8px'
                }}>
                  {forms.filter(f => f.status === 'PENDING').length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: '#64748b', padding: '8px', textAlign: 'center' }}>No pending sheets available</p>
                  ) : (
                    forms.filter(f => f.status === 'PENDING').map(f => (
                      <label key={f.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'background 0.2s'
                      }} className="checkbox-item">
                        <input
                          type="checkbox"
                          style={{ width: 'auto', cursor: 'pointer' }}
                          checked={newJob.selectedForms.includes(f.formNumber)}
                          onChange={() => toggleFormSelection(f.formNumber)}
                        />
                        <span>{f.formNumber} ({f.width}m × {f.height}m)</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
              <button type="submit" disabled={newJob.selectedForms.length === 0}>
                Schedule Production Job
              </button>
            </form>
          </div>

        </div>

        {/* RIGHT COLUMN: QUEUES, ACTIVE JOBS, AND VISUAL MAP */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* ACTIVE JOBS / WORKFLOW CONTROLS */}
          <div className="glass-panel" style={{ flexGrow: 1 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>⚙️</span> Production Floor queues
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {jobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: '#64748b' }}>
                  <p style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📭 Queue is empty</p>
                  <p style={{ fontSize: '0.85rem' }}>Simulate orders and forms to plan jobs.</p>
                </div>
              ) : (
                jobs.map(job => (
                  <div key={job.id} className="glass-panel" style={{
                    padding: '16px',
                    backgroundColor: 'rgba(15, 23, 42, 0.4)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>{job.jobId}</h3>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Machine: <span style={{ color: 'white', fontWeight: 500 }}>{job.machineId}</span></p>
                      </div>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        ...getStatusBadgeStyle(job.status)
                      }}>{job.status}</span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      <strong>Batch Sheets:</strong> {job.formNumbers.join(', ')}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                      {job.status === 'PENDING' && (
                        <button onClick={() => runJobCommand('start-job', job.jobId)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                          ▶ Start Printing
                        </button>
                      )}
                      {job.status === 'RUNNING' && (
                        <button onClick={() => runJobCommand('advance-cutting', job.jobId)} style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
                          ✂ Move to Cutting
                        </button>
                      )}
                      {job.status === 'CUTTING' && (
                        <button onClick={() => runJobCommand('complete-job', job.jobId)} style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'linear-gradient(135deg, var(--success) 0%, #059669 100%)' }}>
                          ✓ Finish Job
                        </button>
                      )}
                      <span style={{ flexGrow: 1 }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* VISUAL LAYOUT SHEET GRAPH */}
          <div className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>👁️</span> Visual Layout Sheet mapping
              </h2>
              <select
                value={selectedFormId}
                onChange={e => setSelectedFormId(e.target.value)}
                style={{ width: '180px', padding: '6px 12px', fontSize: '0.85rem' }}
              >
                {forms.map(f => (
                  <option key={f.id} value={f.id}>{f.formNumber}</option>
                ))}
              </select>
            </div>

            {activeFormView ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                
                {/* Visualizer canvas */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '320px',
                  background: 'radial-gradient(circle, #101726 0%, #080c14 100%)',
                  borderRadius: '12px',
                  border: '2px dashed rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  padding: '20px'
                }}>
                  {/* Container representing the layout sheet itself */}
                  {(() => {
                    const canvasW = 440;
                    const canvasH = 280;
                    // Compute aspect ratios
                    const formAspect = activeFormView.width / activeFormView.height;
                    const canvasAspect = canvasW / canvasH;

                    let sheetW = canvasW;
                    let sheetH = canvasH;

                    if (formAspect > canvasAspect) {
                      // Width bound
                      sheetW = canvasW;
                      sheetH = canvasW / formAspect;
                    } else {
                      // Height bound
                      sheetH = canvasH;
                      sheetW = canvasH * formAspect;
                    }

                    const scale = sheetW / activeFormView.width;

                    return (
                      <div style={{
                        position: 'relative',
                        width: `${sheetW}px`,
                        height: `${sheetH}px`,
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '4px',
                        boxShadow: '0 0 20px rgba(0,0,0,0.5)'
                      }}>
                        {/* Sheet dimensions overlay */}
                        <div style={{
                          position: 'absolute',
                          bottom: '-22px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '0.7rem',
                          color: '#64748b',
                          whiteSpace: 'nowrap'
                        }}>
                          Sheet dimensions: {activeFormView.width}m × {activeFormView.height}m
                        </div>
                        <div style={{
                          position: 'absolute',
                          right: '-60px',
                          top: '50%',
                          transform: 'translateY(-50%) rotate(90deg)',
                          fontSize: '0.7rem',
                          color: '#64748b',
                          whiteSpace: 'nowrap'
                        }}>
                          Status: <span style={{ color: 'white' }}>{activeFormView.status}</span>
                        </div>

                        {/* Placed objects inside */}
                        {activeFormView.placedObjects.map((obj, index) => {
                          const left = obj.x * scale;
                          const top = obj.y * scale;
                          const w = obj.width * scale;
                          const h = obj.height * scale;

                          // Color mapper for placed items
                          const colors = ['rgba(96, 165, 250, 0.3)', 'rgba(236, 72, 153, 0.3)', 'rgba(168, 85, 247, 0.3)'];
                          const borderColors = ['rgba(96, 165, 250, 0.8)', 'rgba(236, 72, 153, 0.8)', 'rgba(168, 85, 247, 0.8)'];

                          return (
                            <div
                              key={index}
                              style={{
                                position: 'absolute',
                                left: `${left}px`,
                                top: `${top}px`,
                                width: `${w}px`,
                                height: `${h}px`,
                                backgroundColor: colors[index % colors.length],
                                border: `1px solid ${borderColors[index % borderColors.length]}`,
                                borderRadius: '3px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.65rem',
                                color: 'white',
                                fontWeight: 'bold',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                cursor: 'help',
                                transition: 'all 0.2s'
                              }}
                              title={`OrderItem: ${obj.orderItemId}\nSize: ${obj.width}m × ${obj.height}m\nCoordinates: X=${obj.x}m, Y=${obj.y}m`}
                              className="placed-item"
                            >
                              <span>{obj.orderItemId}</span>
                              <span style={{ fontSize: '0.55rem', opacity: 0.8 }}>{obj.width}x{obj.height}</span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                <div style={{ width: '100%', marginTop: '24px', display: 'flex', justifyContent: 'space-around', fontSize: '0.8rem', color: '#94a3b8' }}>
                  <span>🏷️ Reprint Form: <strong style={{ color: activeFormView.reprint ? 'var(--secondary)' : 'white' }}>{activeFormView.reprint ? 'YES' : 'NO'}</strong></span>
                  <span>🧬 Quality: <strong style={{ color: 'white' }}>{activeFormView.quality}</strong></span>
                  <span>📊 Total Items: <strong style={{ color: 'white' }}>{activeFormView.placedObjects.length}</strong></span>
                </div>

              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#64748b' }}>
                <p>No layouts imported yet.</p>
                <p style={{ fontSize: '0.8rem' }}>Simulate a Metaboard FTP drop to load layout models.</p>
              </div>
            )}
          </div>
        </div>
      </div>}

      {/* ── SECTION: FORMS TABLE ── */}
      {activeSection === 'forms' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'white' }}>Forms</h2>
          </div>

          {/* Filters Section */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '0.9rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Filters</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              {[
                { label: 'Form ID', type: 'text', placeholder: 'Search' },
                { label: 'Quality', type: 'text', placeholder: 'Search' },
                { label: 'With border', type: 'select', options: ['Search'] },
                { label: 'Repetition', type: 'text', placeholder: 'Search' },
                { label: 'Date needed', type: 'dateRange', placeholder: 'Start ~ End' },
                { label: 'Dimensions (cm)', type: 'text', placeholder: 'Search' },
                { label: 'Status', type: 'select', options: ['Search'] },
                { label: 'Roll type', type: 'select', options: ['Search'] },
              ].map(filter => (
                <div key={filter.label}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>{filter.label}</label>
                  {filter.type === 'text' || filter.type === 'dateRange' ? (
                    <input 
                      type="text" 
                      placeholder={filter.placeholder} 
                      style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '8px', color: 'white', fontSize: '0.85rem' }} 
                    />
                  ) : (
                    <select style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '8px', color: 'white', fontSize: '0.85rem' }}>
                      <option style={{color: 'black'}}>{filter.options?.[0]}</option>
                    </select>
                  )}
                </div>
              ))}
              
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '8px', fontWeight: 600 }}>Reprint</label>
                <div style={{ width: '44px', height: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', position: 'relative', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <div style={{ width: '18px', height: '18px', background: '#94a3b8', borderRadius: '50%', position: 'absolute', top: '2px', left: '3px' }}></div>
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>Sort</label>
                <select style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '8px', color: 'white', fontSize: '0.85rem' }}>
                  <option style={{color: 'black'}}>form_number-desc</option>
                </select>
              </div>

            </div>
          </div>

          <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(15, 23, 42, 0.4)' }}>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>
                {formsList.length} result(s) found
              </div>
              
              {/* Top Action Bar (Bulk plan) */}
              <div style={{ display: 'flex', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '8px', overflow: 'hidden' }}>
                <button 
                  onClick={() => {
                    const selected = formsList.filter(f => selectedFormIds.includes(f.id));
                    if (selected.length > 0) {
                      setFormsToPlan(selected);
                      setActiveSection('planning');
                    }
                  }}
                  disabled={selectedFormIds.length === 0}
                  style={{ background: 'rgba(56, 189, 248, 0.2)', color: selectedFormIds.length > 0 ? '#38bdf8' : '#94a3b8', border: 'none', padding: '8px 16px', fontWeight: 600, cursor: selectedFormIds.length > 0 ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '8px', opacity: selectedFormIds.length > 0 ? 1 : 0.5 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>
                  Bulk plan form version ({selectedFormIds.length})
                </button>
                <div style={{ padding: '8px 16px', borderLeft: '1px solid rgba(56, 189, 248, 0.2)', borderRight: '1px solid rgba(56, 189, 248, 0.2)', color: '#bae6fd', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  0 minutes
                </div>
                <div style={{ padding: '8px 16px', color: '#bae6fd', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"/><path d="M4 10v4"/><path d="M8 10v4"/><path d="M12 10v4"/><path d="M16 10v4"/><path d="M20 10v4"/></svg>
                  0.00 linear meter(s)
                </div>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#e2e8f0', background: 'rgba(15, 23, 42, 0.4)' }}>
                    <th style={{ padding: '16px 12px', width: '40px' }}>
                      <input 
                        type="checkbox" 
                        style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#38bdf8' }} 
                        checked={selectedFormIds.length === formsList.length && formsList.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFormIds(formsList.map(f => f.id));
                          } else {
                            setSelectedFormIds([]);
                          }
                        }}
                      />
                    </th>
                    {[
                      'Form ID', 'Thumbnail', 'Quality', 'Dimension', 'Size', 
                      'Repetition', 'Printing time', 'Roll type', 'Printed date', 
                      'Date needed', 'Delivered date', 'Status', 'Action'
                    ].map(h => (
                      <th key={h} style={{ padding: '16px 12px', fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {formsList.map(form => (
                    <tr key={form.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '16px 12px' }}>
                        <input 
                          type="checkbox" 
                          style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#38bdf8' }} 
                          checked={selectedFormIds.includes(form.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFormIds([...selectedFormIds, form.id]);
                            } else {
                              setSelectedFormIds(selectedFormIds.filter(id => id !== form.id));
                            }
                          }}
                        />
                      </td>
                      <td style={{ padding: '16px 12px', color: '#38bdf8', fontWeight: 600 }}>{form.formId}</td>
                      <td style={{ padding: '16px 12px' }}>
                        {form.id === '1' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <img src="/form1.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <img src="/form2.jpg" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                          </div>
                        ) : form.id === '2' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <img src="/form2-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <img src="/form2-unit.jpg" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                          </div>
                        ) : form.id === '3' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <img src="/form3-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <img src="/form3-unit.jpg" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                          </div>
                        ) : form.id === '4' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <img src="/form4-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <img src="/form4-unit.png" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                          </div>
                        ) : form.id === '5' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <img src="/form5-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <img src="/form5-unit.png" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                          </div>
                        ) : form.id === '6' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <img src="/form6-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <img src="/form6-unit.png" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                          </div>
                        ) : form.id === '7' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <img src="/form7-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <img src="/form7-unit.png" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                          </div>
                        ) : form.id === '8' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <img src="/form8-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <img src="/form8-unit.png" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                          </div>
                        ) : form.id === '9' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <img src="/form9-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <img src="/form9-unit1.png" alt="Individual Form Orange" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <img src="/form9-unit2.png" alt="Individual Form Blue" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                          </div>
                        ) : (
                          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(45deg, #1e293b, #334155)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '16px 12px' }}>{form.quality}</td>
                      <td style={{ padding: '16px 12px' }}>{form.dimension}</td>
                      <td style={{ padding: '16px 12px' }}>{form.size}</td>
                      <td style={{ padding: '16px 12px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#c4b5fd', fontSize: '0.75rem', fontWeight: 600 }}>
                          {form.repetition}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px', color: '#94a3b8' }}>{form.printingTime}</td>
                      <td style={{ padding: '16px 12px' }}>{form.rollType}</td>
                      <td style={{ padding: '16px 12px', color: '#64748b' }}>{form.printedDate}</td>
                      <td style={{ padding: '16px 12px', color: '#e2e8f0' }}>{form.dateNeeded}</td>
                      <td style={{ padding: '16px 12px', color: '#64748b' }}>{form.deliveredDate}</td>
                      <td style={{ padding: '16px 12px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '4px', background: form.status === 'NEW' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(52, 211, 153, 0.1)', border: form.status === 'NEW' ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid rgba(52, 211, 153, 0.2)', color: form.status === 'NEW' ? '#bae6fd' : '#6ee7b7', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                          {form.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                        <button style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION: FORM VERSIONS TABLE ── */}
      {activeSection === 'form-versions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'white' }}>Form Versions</h2>
          </div>

          {/* Filters Section */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '0.9rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Filters</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              {[
                { label: 'Form ID', type: 'text', placeholder: 'Search' },
                { label: 'Quality', type: 'text', placeholder: 'Search' },
                { label: 'With border', type: 'select', options: ['Search'] },
                { label: 'Repetition', type: 'text', placeholder: 'Search' },
                { label: 'Date needed', type: 'dateRange', placeholder: 'Start ~ End' },
                { label: 'Dimensions (cm)', type: 'text', placeholder: 'Search' },
                { label: 'Status', type: 'select', options: ['Search'] },
                { label: 'Roll type', type: 'select', options: ['Search'] },
              ].map(filter => (
                <div key={filter.label}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>{filter.label}</label>
                  {filter.type === 'text' || filter.type === 'dateRange' ? (
                    <input 
                      type="text" 
                      placeholder={filter.placeholder} 
                      style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '8px', color: 'white', fontSize: '0.85rem' }} 
                    />
                  ) : (
                    <select style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '8px', color: 'white', fontSize: '0.85rem' }}>
                      <option style={{color: 'black'}}>{filter.options?.[0]}</option>
                    </select>
                  )}
                </div>
              ))}
              
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '8px', fontWeight: 600 }}>Reprint</label>
                <div style={{ width: '44px', height: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', position: 'relative', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <div style={{ width: '18px', height: '18px', background: '#94a3b8', borderRadius: '50%', position: 'absolute', top: '2px', left: '3px' }}></div>
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>Sort</label>
                <select style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '8px', color: 'white', fontSize: '0.85rem' }}>
                  <option style={{color: 'black'}}>form_number-desc</option>
                </select>
              </div>

            </div>
          </div>

          <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(15, 23, 42, 0.4)' }}>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>
                {formVersionsList.length} result(s) found
              </div>
              
              {/* Top Action Bar (Create rollout) */}
              <div style={{ display: 'flex', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '8px', overflow: 'hidden' }}>
                <button 
                  onClick={() => {
                    setNotification({ message: 'Rollout creation triggered', type: 'info' });
                  }}
                  style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: 'none', padding: '8px 16px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>
                  Create rollout
                </button>
                <div style={{ padding: '8px 16px', borderLeft: '1px solid rgba(56, 189, 248, 0.2)', borderRight: '1px solid rgba(56, 189, 248, 0.2)', color: '#bae6fd', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  0 minutes
                </div>
                <div style={{ padding: '8px 16px', color: '#bae6fd', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"/><path d="M4 10v4"/><path d="M8 10v4"/><path d="M12 10v4"/><path d="M16 10v4"/><path d="M20 10v4"/></svg>
                  0.00 linear meter(s)
                </div>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#e2e8f0', background: 'rgba(15, 23, 42, 0.4)' }}>
                    <th style={{ padding: '16px 12px', width: '40px' }}>
                      <input type="checkbox" style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#38bdf8' }} />
                    </th>
                    {[
                      'Form ID', 'Job ID', 'Thumbnail', 'Quality', 'Dimension', 'Size', 
                      'Repetition', 'Printing time', 'Roll type', 'Printed date', 
                      'Date needed', 'Delivered date', 'Status', 'Action'
                    ].map(h => (
                      <th key={h} style={{ padding: '16px 12px', fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {formVersionsList.map((form, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '16px 12px' }}>
                        <input type="checkbox" style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#38bdf8' }} />
                      </td>
                      <td style={{ padding: '16px 12px', color: '#38bdf8', fontWeight: 600 }}>{form.formId}</td>
                      <td style={{ padding: '16px 12px', color: '#10b981', fontWeight: 700 }}>{form.jobId}</td>
                      <td style={{ padding: '16px 12px' }}>
                        {form.id === '1' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <img src="/form1.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <img src="/form2.jpg" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                          </div>
                        ) : form.id === '2' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <img src="/form2-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <img src="/form2-unit.jpg" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                          </div>
                        ) : form.id === '3' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <img src="/form3-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <img src="/form3-unit.jpg" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                          </div>
                        ) : form.id === '4' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <img src="/form4-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <img src="/form4-unit.png" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                          </div>
                        ) : form.id === '5' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <img src="/form5-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <img src="/form5-unit.png" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                          </div>
                        ) : form.id === '6' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <img src="/form6-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <img src="/form6-unit.png" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                          </div>
                        ) : form.id === '7' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <img src="/form7-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <img src="/form7-unit.png" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                          </div>
                        ) : form.id === '8' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <img src="/form8-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <img src="/form8-unit.png" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                          </div>
                        ) : form.id === '9' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <img src="/form9-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <img src="/form9-unit1.png" alt="Individual Form Orange" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <img src="/form9-unit2.png" alt="Individual Form Blue" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                          </div>
                        ) : (
                          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(45deg, #1e293b, #334155)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '16px 12px' }}>{form.quality}</td>
                      <td style={{ padding: '16px 12px' }}>{form.dimension}</td>
                      <td style={{ padding: '16px 12px' }}>{form.size}</td>
                      <td style={{ padding: '16px 12px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#c4b5fd', fontSize: '0.75rem', fontWeight: 600 }}>
                          {form.repetition}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px', color: '#94a3b8' }}>{form.printingTime}</td>
                      <td style={{ padding: '16px 12px' }}>{form.rollType}</td>
                      <td style={{ padding: '16px 12px', color: '#64748b' }}>{form.printedDate}</td>
                      <td style={{ padding: '16px 12px', color: '#e2e8f0' }}>{form.dateNeeded}</td>
                      <td style={{ padding: '16px 12px', color: '#64748b' }}>{form.deliveredDate}</td>
                      <td style={{ padding: '16px 12px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '4px', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.2)', color: '#6ee7b7', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                          PLANNED
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                        <button style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION: JOBS TABLE ── */}
      {activeSection === 'jobs' && <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="glass-panel">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>🔧 Jobs</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#64748b' }}>
                  {['Job ID','Machine','Batch Forms','Status'].map(h => (
                    <th key={h} style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobs.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#334155' }}>Aucun job trouvé.</td></tr>
                ) : jobs.map(job => (
                  <tr key={job.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }} className="table-row">
                    <td style={{ padding: '10px 8px', fontWeight: 700 }}>{job.jobId}</td>
                    <td style={{ padding: '10px 8px' }}>{job.machineId}</td>
                    <td style={{ padding: '10px 8px', color: '#94a3b8' }}>{job.formNumbers.join(', ')}</td>
                    <td style={{ padding: '10px 8px' }}><span style={{ padding: '3px 8px', borderRadius: '999px', fontSize: '0.73rem', fontWeight: 700, ...getStatusBadgeStyle(job.status) }}>{job.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>}

      {/* ── SECTION: ORDER ITEMS ── */}          {/* ── SECTION: ORDER ITEMS ── */}
          {activeSection === 'order-items' && (
            <div className="glass-panel">
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>🛒 Order Items</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#64748b' }}>
                      {['Item ID','Dimensions','Source','Quality','Border','Reprint','Form','Status'].map(h => (
                        <th key={h} style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.length === 0 ? (
                      <tr><td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: '#334155' }}>Aucun order item trouvé.</td></tr>
                    ) : orderItems.map(item => (
                      <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }} className="table-row">
                        <td style={{ padding: '10px 8px', fontWeight: 700 }}>{item.orderItemId}</td>
                        <td style={{ padding: '10px 8px' }}>{item.width}m × {item.height}m</td>
                        <td style={{ padding: '10px 8px' }}><span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.78rem' }}>{item.sourceSystem}</span></td>
                        <td style={{ padding: '10px 8px' }}>{item.quality}</td>
                        <td style={{ padding: '10px 8px' }}>{item.border}</td>
                        <td style={{ padding: '10px 8px', color: item.reprintState === 'PROCESSED' ? 'var(--secondary)' : '#64748b' }}>{item.reprintState}</td>
                        <td style={{ padding: '10px 8px', color: item.formNumber ? 'white' : '#334155' }}>{item.formNumber ?? 'Unattached'}</td>
                        <td style={{ padding: '10px 8px' }}><span style={{ padding: '3px 8px', borderRadius: '999px', fontSize: '0.73rem', fontWeight: 700, ...getStatusBadgeStyle(item.status) }}>{item.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── SECTION: PRODUCTION PLANNING ── */}
          {activeSection === 'planning' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Top Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'white' }}>Production Planning</h2>
                <button 
                  onClick={() => setIsAddReservationOpen(true)}
                  style={{ 
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                  cursor: 'pointer'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  Add reservation
                </button>
              </div>

              {/* Filters Section */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '0.9rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Filters</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                  {['Form ID', 'Form version ID', 'Job ID', 'Job-result ID', 'Roll Out ID', 'Order ID', 'Customer', 'Design ID'].map(filter => (
                    <div key={filter}>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>{filter}</label>
                      <input 
                        type="text" 
                        placeholder="Search" 
                        style={{ 
                          width: '100%', 
                          background: 'rgba(255,255,255,0.03)', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          padding: '10px 14px', 
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '0.85rem'
                        }} 
                      />
                    </div>
                  ))}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '8px', fontWeight: 600 }}>Only reservations</label>
                    {/* Toggle switch simulation */}
                    <div style={{ 
                      width: '44px', height: '24px', 
                      background: 'rgba(255,255,255,0.1)', 
                      borderRadius: '12px', 
                      position: 'relative',
                      cursor: 'pointer',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                      <div style={{ 
                        width: '18px', height: '18px', 
                        background: '#94a3b8', 
                        borderRadius: '50%', 
                        position: 'absolute', 
                        top: '2px', left: '3px' 
                      }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Unscheduled Forms / Forms to Plan */}
              {formsToPlan.length > 0 && (
                <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--secondary)', background: 'rgba(56, 189, 248, 0.05)' }}>
                  <h3 style={{ fontSize: '1rem', color: '#38bdf8', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    Forms Pending Planning ({formsToPlan.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {formsToPlan.map(form => (
                      <div key={form.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(15,23,42,0.6)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, color: '#e2e8f0' }}>{form.formId}</div>
                          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{form.dimension} • {form.quality}</div>
                        </div>
                        
                        <div>
                          <label style={{ fontSize: '0.75rem', color: '#cbd5e1', marginRight: '8px' }}>Machine</label>
                          <select id={`machine-select-${form.id}`} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '6px 10px', borderRadius: '4px' }}>
                            <option value="Kader" style={{color: 'black'}}>Kader</option>
                            <option value="Raster" style={{color: 'black'}}>Raster</option>
                            <option value="Colaris 1" style={{color: 'black'}}>Colaris 1</option>
                          </select>
                        </div>
                        
                        <div>
                          <label style={{ fontSize: '0.75rem', color: '#cbd5e1', marginRight: '8px' }}>Start Time</label>
                          <select id={`time-select-${form.id}`} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '6px 10px', borderRadius: '4px' }}>
                            <option value="08:00" style={{color: 'black'}}>08:00</option>
                            <option value="09:00" style={{color: 'black'}}>09:00</option>
                            <option value="10:00" style={{color: 'black'}}>10:00</option>
                          </select>
                        </div>

                        <button 
                          onClick={() => {
                            const machine = (document.getElementById(`machine-select-${form.id}`) as HTMLSelectElement).value;
                            const time = (document.getElementById(`time-select-${form.id}`) as HTMLSelectElement).value;
                            const jobId = `JOB-2026-${Math.floor(Math.random() * 9000 + 1000)}`;
                            
                            // Transform to FormVersion
                            const newVersion = { ...form, jobId, scheduledMachine: machine, scheduledTime: time };
                            setFormVersionsList(prev => [...prev, newVersion]);
                            
                            // Remove from Forms List
                            setFormsList(prev => prev.filter(f => f.id !== form.id));
                            setSelectedFormIds(prev => prev.filter(id => id !== form.id));
                            
                            // Remove from pending
                            const remaining = formsToPlan.filter(f => f.id !== form.id);
                            setFormsToPlan(remaining);
                            
                            setNotification({ message: `Planned ${form.formId} on ${machine}. Job created: ${jobId}`, type: 'success' });
                            
                            // If all planned, go to formversions
                            if (remaining.length === 0) {
                              setActiveSection('form-versions');
                            }
                          }}
                          style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                          Save
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline Container */}
              <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                
                {/* Timeline Controls */}
                <div style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)',
                  background: 'rgba(15, 23, 42, 0.4)'
                }}>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>
                    0 result(s) found
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ display: 'flex', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
                      <button style={{ background: 'transparent', border: 'none', color: '#e2e8f0', padding: '8px 16px', fontSize: '0.85rem', cursor: 'pointer', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                        ← Previous
                      </button>
                      <button style={{ background: 'transparent', border: 'none', color: '#e2e8f0', padding: '8px 16px', fontSize: '0.85rem', cursor: 'pointer' }}>
                        Next →
                      </button>
                    </div>

                    <div style={{ position: 'relative' }}>
                      <input 
                        type="text" 
                        defaultValue="Select date" 
                        readOnly
                        style={{ 
                          width: '180px', 
                          background: 'rgba(255,255,255,0.03)', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          padding: '8px 14px', 
                          borderRadius: '8px',
                          color: '#94a3b8',
                          fontSize: '0.85rem',
                          textAlign: 'center'
                        }} 
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
                    <button style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                      Day
                    </button>
                    <button style={{ background: 'transparent', border: 'none', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '8px 16px', fontSize: '0.85rem', cursor: 'pointer' }}>
                      Week
                    </button>
                    <button style={{ background: 'transparent', border: 'none', color: '#94a3b8', padding: '8px 16px', fontSize: '0.85rem', cursor: 'pointer' }}>
                      Month
                    </button>
                  </div>
                </div>

                {/* Date Header */}
                <div style={{ textAlign: 'center', padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'white', margin: 0 }}>Monday, June 29, 2026</h3>
                </div>

                {/* Gantt Grid */}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                    <thead>
                      <tr style={{ background: 'rgba(15, 23, 42, 0.6)', color: '#e2e8f0' }}>
                        <th style={{ width: '150px', padding: '16px', textAlign: 'left', fontWeight: 700, borderRight: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Machines</th>
                        {['06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00'].map(hour => (
                          <th key={hour} style={{ width: '120px', padding: '12px 8px', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', borderRight: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{hour}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {['Colaris 1'].map((machine, index) => (
                        <tr key={index}>
                          <td style={{ padding: '16px', fontWeight: 600, color: '#94a3b8', borderRight: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(15,23,42,0.2)' }}>
                            {machine}
                          </td>
                          {/* Hour cells with sub-grid dashes simulated */}
                          {['06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00'].map((_hour, hIdx) => (
                            <td key={hIdx} style={{ 
                              position: 'relative',
                              height: '80px',
                              borderRight: '1px solid rgba(255,255,255,0.05)', 
                              borderBottom: '1px solid rgba(255,255,255,0.05)',
                              background: 'repeating-linear-gradient(90deg, transparent, transparent 29px, rgba(255,255,255,0.02) 29px, rgba(255,255,255,0.02) 30px)'
                            }}>
                              {/* Empty space for future colored blocks */}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

              {/* Add Reservation Modal */}
              {isAddReservationOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="glass-panel" style={{ width: '800px', maxWidth: '90%', display: 'flex', flexDirection: 'column', gap: '20px', padding: '32px', background: 'rgba(15, 23, 42, 0.95)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'white' }}>Add reservation</h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button 
                          onClick={() => {
                            setIsAddReservationOpen(false);
                            setNewReservation({ machine: 'Colaris 1', info: '', dates: [] });
                            setNotification({ message: 'Reservation saved to planning', type: 'success' });
                          }}
                          style={{ background: '#0ea5e9', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.4)' }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                          Save
                        </button>
                        <button onClick={() => setIsAddReservationOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '8px', fontWeight: 600 }}>Machine <span style={{ color: '#ef4444' }}>*</span></label>
                        <select 
                          value={newReservation.machine}
                          onChange={(e) => setNewReservation({...newReservation, machine: e.target.value})}
                          style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '12px 14px', borderRadius: '8px', color: 'white', fontSize: '0.9rem' }}
                        >
                          <option value="Colaris 1" style={{ color: 'black' }}>Colaris 1</option>
                          <option value="Colaris 2" style={{ color: 'black' }}>Colaris 2</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '8px', fontWeight: 600 }}>Information of reservation <span style={{ color: '#ef4444' }}>*</span></label>
                        <input 
                          type="text" 
                          value={newReservation.info}
                          onChange={(e) => setNewReservation({...newReservation, info: e.target.value})}
                          style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 14px', borderRadius: '8px', color: 'white', fontSize: '0.9rem' }} 
                        />
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', marginTop: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <label style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 600 }}>Reservation dates <span style={{ color: '#ef4444' }}>*</span></label>
                        <button 
                          onClick={() => {
                            const newDate = new Date().toISOString().substring(0,10) + 'T10:00';
                            setNewReservation({...newReservation, dates: [...newReservation.dates, newDate]});
                          }}
                          style={{ background: '#16a34a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                          Add date
                        </button>
                      </div>

                      {newReservation.dates.length === 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', opacity: 0.6 }}>
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                          <div style={{ marginTop: '12px', color: '#94a3b8', fontSize: '0.9rem' }}>No Data</div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {newReservation.dates.map((dateString, idx) => {
                            const [datePart, timePart] = dateString.split('T');
                            return (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                               <div style={{ flex: 1 }}>
                                 <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>Date</label>
                                 <input 
                                   type="date" 
                                   value={datePart || ''} 
                                   onChange={(e) => {
                                     const newDates = [...newReservation.dates];
                                     newDates[idx] = `${e.target.value}T${timePart || '00:00'}`;
                                     setNewReservation({...newReservation, dates: newDates});
                                   }}
                                   style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '6px', color: 'white', outline: 'none' }} 
                                 />
                               </div>
                               <div style={{ flex: 1 }}>
                                 <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>Heure</label>
                                 <input 
                                   type="time" 
                                   value={timePart || ''} 
                                   onChange={(e) => {
                                     const newDates = [...newReservation.dates];
                                     newDates[idx] = `${datePart || '2026-01-01'}T${e.target.value}`;
                                     setNewReservation({...newReservation, dates: newDates});
                                   }}
                                   style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '6px', color: 'white', outline: 'none' }} 
                                 />
                               </div>
                               <button 
                                 onClick={() => {
                                   const newDates = [...newReservation.dates];
                                   newDates.splice(idx, 1);
                                   setNewReservation({...newReservation, dates: newDates});
                                 }}
                                 style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', marginTop: '22px' }}
                               >
                                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                               </button>
                            </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ── SECTION: MACHINES ── */}
          {activeSection === 'machines' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Top Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'white' }}>Machines</h2>
                <button 
                  onClick={() => setIsAddMachineOpen(true)}
                  style={{ 
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)', cursor: 'pointer'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  Add new machine
                </button>
              </div>

              {/* Table Container */}
              <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>
                  {machinesList.length} result(s) found
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ background: 'rgba(15, 23, 42, 0.4)', color: '#e2e8f0' }}>
                        <th style={{ padding: '16px 24px', fontWeight: 700 }}>Name</th>
                        <th style={{ padding: '16px 24px', fontWeight: 700 }}>Creation date</th>
                        <th style={{ padding: '16px 24px', fontWeight: 700 }}>Location</th>
                        <th style={{ padding: '16px 24px', fontWeight: 700, textAlign: 'center' }}>Status</th>
                        <th style={{ padding: '16px 24px', fontWeight: 700, textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {machinesList.map(machine => (
                        <tr key={machine.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: '16px 24px', fontWeight: 600, color: 'white' }}>{machine.name}</td>
                          <td style={{ padding: '16px 24px', color: '#94a3b8' }}>{machine.creationDate}</td>
                          <td style={{ padding: '16px 24px', color: '#cbd5e1' }}>{machine.location}</td>
                          <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </span>
                          </td>
                          <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                              <button onClick={() => setEditingMachine(machine)} style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: '4px' }} title="Edit">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                              </button>
                              <button style={{ background: 'transparent', border: 'none', color: '#34d399', cursor: 'pointer', padding: '4px' }} title="CSV">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button style={{ 
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)', cursor: 'pointer'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  Export capacity CSV
                </button>
              </div>
            </div>
          )}

          {/* ── MODAL: ADD MACHINE ── */}
          {isAddMachineOpen && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
              <div className="glass-panel" style={{ width: '900px', maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '32px', background: 'rgba(15, 23, 42, 0.95)', animation: 'fadeIn 0.2s ease-out' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'white' }}>Add new machine</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button 
                      onClick={() => {
                        setIsAddMachineOpen(false);
                        setNotification({ message: 'Machine saved successfully', type: 'success' });
                      }} 
                      style={{ background: '#0ea5e9', color: 'white', border: 'none', padding: '8px 24px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.4)', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                      Save
                    </button>
                    <button onClick={() => setIsAddMachineOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                    </button>
                  </div>
                </div>

                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'white', margin: 0 }}>Machine info</h3>
                </div>

                {/* Row 1: Name */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '8px', fontWeight: 600 }}>Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input type="text" value={newMachineForm.name} onChange={e => setNewMachineForm({...newMachineForm, name: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '6px', color: 'white', outline: 'none' }} />
                </div>

                {/* Row 2: Process, Setup time, Efficiency */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '8px', fontWeight: 600 }}>Process <span style={{ color: '#ef4444' }}>*</span></label>
                    <select value={newMachineForm.process} onChange={e => setNewMachineForm({...newMachineForm, process: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '6px', color: 'white', outline: 'none' }}>
                      <option value="Form" style={{ color: 'black' }}>Form</option>
                      <option value="Job" style={{ color: 'black' }}>Job</option>
                      <option value="Both" style={{ color: 'black' }}>Both</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '8px', fontWeight: 600 }}>Setup time <span style={{ color: '#ef4444' }}>*</span></label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input type="number" value={newMachineForm.setupTime} onChange={e => setNewMachineForm({...newMachineForm, setupTime: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '6px', color: 'white', outline: 'none' }} />
                      <span style={{ fontSize: '0.8rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '6px 8px', borderRadius: '4px', fontWeight: 600 }}>Minutes</span>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '8px', fontWeight: 600 }}>Efficiency <span style={{ color: '#ef4444' }}>*</span></label>
                    <input type="number" value={newMachineForm.efficiency} onChange={e => setNewMachineForm({...newMachineForm, efficiency: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '6px', color: 'white', outline: 'none' }} />
                  </div>
                </div>

                {/* Row 3: Type, Quantity, Speed */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '8px', fontWeight: 600 }}>Type <span style={{ color: '#ef4444' }}>*</span></label>
                    <select value={newMachineForm.type} onChange={e => setNewMachineForm({...newMachineForm, type: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '6px', color: 'white', outline: 'none' }}>
                      <option value="Printing" style={{ color: 'black' }}>Printing</option>
                      <option value="Sewing" style={{ color: 'black' }}>Sewing</option>
                      <option value="Cutting" style={{ color: 'black' }}>Cutting</option>
                      <option value="Coating" style={{ color: 'black' }}>Coating</option>
                      <option value="Other" style={{ color: 'black' }}>Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '8px', fontWeight: 600 }}>Quantity</label>
                    <input type="number" value={newMachineForm.quantity} onChange={e => setNewMachineForm({...newMachineForm, quantity: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '6px', color: 'white', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '8px', fontWeight: 600 }}>Speed (minutes/heure)</label>
                    <input type="text" value={newMachineForm.speed} onChange={e => setNewMachineForm({...newMachineForm, speed: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '6px', color: 'white', outline: 'none' }} />
                  </div>
                </div>

                {/* Row 4: Toggles */}
                <div style={{ display: 'flex', gap: '32px', marginBottom: '32px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <div style={{ width: '40px', height: '24px', background: newMachineForm.status ? '#10b981' : 'rgba(255,255,255,0.2)', borderRadius: '12px', position: 'relative', transition: 'background 0.3s' }}>
                      <div style={{ width: '18px', height: '18px', background: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: newMachineForm.status ? '19px' : '3px', transition: 'left 0.3s' }}></div>
                    </div>
                    <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: 600 }}>Status</span>
                    <input type="checkbox" checked={newMachineForm.status} onChange={e => setNewMachineForm({...newMachineForm, status: e.target.checked})} style={{ display: 'none' }} />
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <div style={{ width: '40px', height: '24px', background: newMachineForm.border ? '#10b981' : 'rgba(255,255,255,0.2)', borderRadius: '12px', position: 'relative', transition: 'background 0.3s' }}>
                      <div style={{ width: '18px', height: '18px', background: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: newMachineForm.border ? '19px' : '3px', transition: 'left 0.3s' }}></div>
                    </div>
                    <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: 600 }}>Border (on/off)</span>
                    <input type="checkbox" checked={newMachineForm.border} onChange={e => setNewMachineForm({...newMachineForm, border: e.target.checked})} style={{ display: 'none' }} />
                  </label>
                </div>

                {/* Standard Schedule */}
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'white', margin: 0 }}>Standard Schedule <span style={{ color: '#ef4444' }}>*</span></h3>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <div key={day} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '24px', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e2e8f0' }}>{day}</div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>Select start time <span style={{ color: '#ef4444' }}>*</span></label>
                        <input type="time" value={(newMachineForm.schedule as any)[day].start} onChange={e => setNewMachineForm({...newMachineForm, schedule: {...newMachineForm.schedule, [day]: {...(newMachineForm.schedule as any)[day], start: e.target.value}}})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '6px', color: 'white', outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>Select end time <span style={{ color: '#ef4444' }}>*</span></label>
                        <input type="time" value={(newMachineForm.schedule as any)[day].end} onChange={e => setNewMachineForm({...newMachineForm, schedule: {...newMachineForm.schedule, [day]: {...(newMachineForm.schedule as any)[day], end: e.target.value}}})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '6px', color: 'white', outline: 'none' }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Schedule Exception */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'white', margin: 0 }}>Schedule exception</h3>
                  <button 
                    onClick={() => {
                      setNewMachineForm({...newMachineForm, exceptions: [...newMachineForm.exceptions, { startDate: '', endDate: '', start: '', end: '' }]});
                    }}
                    style={{ background: '#16a34a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Add new exception
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {newMachineForm.exceptions.map((exc, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem' }}>{String(idx + 1).padStart(2, '0')}.</div>
                      <div style={{ flex: 1, display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>Start date <span style={{ color: '#ef4444' }}>*</span></label>
                          <input type="date" value={exc.startDate} onChange={e => {
                            const newExcs = [...newMachineForm.exceptions];
                            newExcs[idx].startDate = e.target.value;
                            setNewMachineForm({...newMachineForm, exceptions: newExcs});
                          }} style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '6px', color: 'white', outline: 'none' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '22px', color: '#94a3b8' }}>~</div>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>Expiration date</label>
                          <input type="date" value={exc.endDate} onChange={e => {
                            const newExcs = [...newMachineForm.exceptions];
                            newExcs[idx].endDate = e.target.value;
                            setNewMachineForm({...newMachineForm, exceptions: newExcs});
                          }} style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '6px', color: 'white', outline: 'none' }} />
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>Select start time <span style={{ color: '#ef4444' }}>*</span></label>
                        <input type="time" value={exc.start} onChange={e => {
                          const newExcs = [...newMachineForm.exceptions];
                          newExcs[idx].start = e.target.value;
                          setNewMachineForm({...newMachineForm, exceptions: newExcs});
                        }} style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '6px', color: 'white', outline: 'none' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>Select end time <span style={{ color: '#ef4444' }}>*</span></label>
                        <input type="time" value={exc.end} onChange={e => {
                          const newExcs = [...newMachineForm.exceptions];
                          newExcs[idx].end = e.target.value;
                          setNewMachineForm({...newMachineForm, exceptions: newExcs});
                        }} style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '6px', color: 'white', outline: 'none' }} />
                      </div>
                      <button 
                        onClick={() => {
                          const newExcs = [...newMachineForm.exceptions];
                          newExcs.splice(idx, 1);
                          setNewMachineForm({...newMachineForm, exceptions: newExcs});
                        }}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', marginTop: '22px', padding: '8px' }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}

          {/* ── MODAL: EDIT MACHINE ── */}
          {editingMachine && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
              <div className="glass-panel" style={{ width: '450px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.2s ease-out', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Edit Machine
                  <button onClick={() => setEditingMachine(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem', padding: '4px' }}>✕</button>
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '8px', fontWeight: 600 }}>Name</label>
                    <input type="text" value={editingMachine.name} onChange={e => setEditingMachine({...editingMachine, name: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', color: 'white', fontSize: '0.95rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '8px', fontWeight: 600 }}>Location</label>
                    <input type="text" value={editingMachine.location} onChange={e => setEditingMachine({...editingMachine, location: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', color: 'white', fontSize: '0.95rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '8px', fontWeight: 600 }}>Status</label>
                    <select value={editingMachine.status} onChange={e => setEditingMachine({...editingMachine, status: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', color: 'white', fontSize: '0.95rem' }}>
                      <option value="ACTIVE" style={{ color: 'black' }}>ACTIVE</option>
                      <option value="MAINTENANCE" style={{ color: 'black' }}>MAINTENANCE</option>
                      <option value="OFFLINE" style={{ color: 'black' }}>OFFLINE</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                  <button onClick={() => setEditingMachine(null)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                  <button onClick={() => {
                    setMachinesList(prev => prev.map(m => m.id === editingMachine.id ? editingMachine : m));
                    setNotification({ message: `Machine ${editingMachine.name} updated successfully!`, type: 'success' });
                    setEditingMachine(null);
                  }} style={{ background: '#38bdf8', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(56, 189, 248, 0.4)' }}>Save Changes</button>
                </div>
              </div>
            </div>
          )}

          {/* ── SECTION: rolls-in ── */}
          {activeSection === 'rolls-in' && <RollsInPage />}

          {/* ── SECTION: placeholder pages ── */}
          {(['rolls-out','job-results','coating-in','coating-out', 'error', 'reprint', 'packaging'] as Section[]).includes(activeSection) && (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '80px 40px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚧</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '10px' }}>
                {activeSection.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </h2>
              <p style={{ color: '#475569' }}>Cette section est en cours de développement.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
