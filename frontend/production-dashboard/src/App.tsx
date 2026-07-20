import { useState, useEffect } from 'react';
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
  formVersionId: string;
  formId: string;
  pallets: string;
  quantity: number;
  jobsErrorQuantity: number;
  productionStartDate: string;
  expectedEndDate: string;
  dateNeeded: string;
  track: string;
  status: string;
  quality?: string;
}
const getQualityColor = (quality: string) => {
  if (!quality) return '#94a3b8';
  const q = quality.toLowerCase();
  if (q.includes('viva')) return '#d946ef'; // Mauve
  if (q.includes('elegance')) return '#eab308'; // Yellow
  if (q.includes('patio')) return '#10b981'; // Green
  if (q.includes('velvet')) return '#9333ea'; // Purple
  return '#94a3b8'; // Default gray
};

const renderQualityBadge = (quality: string) => {
  if (!quality) return '-';
  return (
    <span style={{ 
      background: getQualityColor(quality), 
      color: 'white', 
      padding: '4px 12px', 
      borderRadius: '8px', 
      fontWeight: 600, 
      fontSize: '0.85rem' 
    }}>
      {quality}
    </span>
  );
};

const renderFormThumbnail = (form: any) => {
  if (form.id === '1') {
    return (
      <div style={{ display: 'flex', gap: '8px' }}>
        <img src="/form1.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '50px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
        <img src="/form2.jpg" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '50px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
      </div>
    );
  } else if (form.id === '2') {
    return (
      <div style={{ display: 'flex', gap: '8px' }}>
        <img src="/form2-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '50px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
        <img src="/form2-unit.jpg" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '50px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
      </div>
    );
  } else if (form.id === '3') {
    return (
      <div style={{ display: 'flex', gap: '8px' }}>
        <img src="/form3-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '50px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
        <img src="/form3-unit.jpg" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '50px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
      </div>
    );
  } else if (form.id === '4') {
    return (
      <div style={{ display: 'flex', gap: '8px' }}>
        <img src="/form4-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '50px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
        <img src="/form4-unit.png" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '50px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
      </div>
    );
  } else if (form.id === '5') {
    return (
      <div style={{ display: 'flex', gap: '8px' }}>
        <img src="/form5-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '50px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
        <img src="/form5-unit.png" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '50px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
      </div>
    );
  } else if (form.id === '6') {
    return (
      <div style={{ display: 'flex', gap: '8px' }}>
        <img src="/form6-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '50px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
        <img src="/form6-unit.png" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '50px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
      </div>
    );
  } else if (form.id === '7') {
    return (
      <div style={{ display: 'flex', gap: '8px' }}>
        <img src="/form7-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '50px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
        <img src="/form7-unit.png" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '50px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
      </div>
    );
  } else if (form.id === '8') {
    return (
      <div style={{ display: 'flex', gap: '8px' }}>
        <img src="/form8-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '50px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
        <img src="/form8-unit.png" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '50px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
      </div>
    );
  } else if (form.id === '9') {
    return (
      <div style={{ display: 'flex', gap: '8px' }}>
        <img src="/form9-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '50px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
        <img src="/form9-unit1.png" alt="Individual Form Orange" style={{ maxWidth: '100px', maxHeight: '50px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
        <img src="/form9-unit2.png" alt="Individual Form Blue" style={{ maxWidth: '100px', maxHeight: '50px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
      </div>
    );
  }
  
  if (form.thumbnail) {
    return <img src={form.thumbnail} alt="Form Thumbnail" style={{ maxWidth: '120px', maxHeight: '50px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }} />;
  }

  return (
    <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
    </div>
  );
};

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
  const [activeSection, setActiveSection] = useState<Section>(() => {
    return (localStorage.getItem('mercury_activeSection') as Section) || 'dashboard';
  });

  useEffect(() => {
    localStorage.setItem('mercury_activeSection', activeSection);
  }, [activeSection]);



  const [orderItems, setOrderItems] = useState<OrderItemView[]>([]);
  const [jobResults, setJobResults] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('mercury_jobResults');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [packagingResults, setPackagingResults] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('mercury_packagingResults');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  useEffect(() => {
    localStorage.setItem('mercury_packagingResults', JSON.stringify(packagingResults));
  }, [packagingResults]);

  const [reprintResults] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('mercury_reprintResults');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      }
      return [
        { id: 'REP-2001', formId: 'F-900', formVersionId: '2000000900_1', jobId: 'JOB-600', designId: 'DSG-003', quality: 'Standard', size: '2.0x3.0m', quantity: 10, pallet: null, creationDate: '2026-07-16', dateNeeded: '2026-07-18', status: 'Reprint' },
        { id: 'REP-2002', formId: 'F-901', formVersionId: '2000000901_1', jobId: 'JOB-601', designId: 'DSG-004', quality: 'Premium', size: '1.5x2.5m', quantity: 8, pallet: null, creationDate: '2026-07-16', dateNeeded: '2026-07-19', status: 'Reprint' }
      ];
    } catch { return [
        { id: 'REP-2001', formId: 'F-900', formVersionId: '2000000900_1', jobId: 'JOB-600', designId: 'DSG-003', quality: 'Standard', size: '2.0x3.0m', quantity: 10, pallet: null, creationDate: '2026-07-16', dateNeeded: '2026-07-18', status: 'Reprint' },
        { id: 'REP-2002', formId: 'F-901', formVersionId: '2000000901_1', jobId: 'JOB-601', designId: 'DSG-004', quality: 'Premium', size: '1.5x2.5m', quantity: 8, pallet: null, creationDate: '2026-07-16', dateNeeded: '2026-07-19', status: 'Reprint' }
      ]; }
  });
  useEffect(() => {
    localStorage.setItem('mercury_reprintResults', JSON.stringify(reprintResults));
  }, [reprintResults]);

  const [errorResults] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('mercury_errorResults');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      }
      return [
        { id: 'ERR-1001', formId: 'F-880', formVersionId: '2000000880_1', jobId: 'JOB-500', designId: 'DSG-001', quality: 'Standard', size: '1.2x2.0m', quantity: 5, pallet: null, creationDate: '2026-07-16', dateNeeded: '2026-07-20', status: 'Error' },
        { id: 'ERR-1002', formId: 'F-881', formVersionId: '2000000881_1', jobId: 'JOB-501', designId: 'DSG-002', quality: 'Premium', size: '0.8x1.5m', quantity: 2, pallet: null, creationDate: '2026-07-16', dateNeeded: '2026-07-21', status: 'Error' }
      ];
    } catch { return [
        { id: 'ERR-1001', formId: 'F-880', formVersionId: '2000000880_1', jobId: 'JOB-500', designId: 'DSG-001', quality: 'Standard', size: '1.2x2.0m', quantity: 5, pallet: null, creationDate: '2026-07-16', dateNeeded: '2026-07-20', status: 'Error' },
        { id: 'ERR-1002', formId: 'F-881', formVersionId: '2000000881_1', jobId: 'JOB-501', designId: 'DSG-002', quality: 'Premium', size: '0.8x1.5m', quantity: 2, pallet: null, creationDate: '2026-07-16', dateNeeded: '2026-07-21', status: 'Error' }
      ]; }
  });
  useEffect(() => {
    localStorage.setItem('mercury_errorResults', JSON.stringify(errorResults));
  }, [errorResults]);
  const [selectedJobResultIds, setSelectedJobResultIds] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem('mercury_jobResults', JSON.stringify(jobResults));
  }, [jobResults]);
  const [jobs, setJobs] = useState<JobView[]>(() => {
    try {
      const saved = localStorage.getItem('mercury_jobs');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [addJobResultModal, setAddJobResultModal] = useState<JobView | null>(null);
  const [newJobResultQuantity, setNewJobResultQuantity] = useState<number>(1);
  const [viewJobModal, setViewJobModal] = useState<JobView | null>(null);
  
  // Connection / Loading Status
  
  // Forms & Selections
  const [selectedFormId, setSelectedFormId] = useState<string>('');
  


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
  const [isCreateRolloutModalOpen, setIsCreateRolloutModalOpen] = useState(false);
  const [stagedRolloutForms, setStagedRolloutForms] = useState<any[]>([]);
  const [rolloutRepetitions, setRolloutRepetitions] = useState<Record<string, number>>({});
  const [formsToPlan, setFormsToPlan] = useState<any[]>([]);
  const [formVersionsList, setFormVersionsList] = useState<any[]>(() => { 
    try {
      const saved = localStorage.getItem('mercury_formVersionsList');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Bulk Planning State
  const [planningDate, setPlanningDate] = useState<Date>(new Date());
  const [planningViewMode, setPlanningViewMode] = useState<'day'|'week'|'month'>('day');
  
  const formatDateStr = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


                const getGridColumns = () => {
    if (planningViewMode === 'day') {
      return Array.from({length: 24}, (_, i) => ({
        label: `${i.toString().padStart(2, '0')}:00`,
        value: `${i.toString().padStart(2, '0')}:00`,
        date: formatDateStr(planningDate)
      }));
    } else if (planningViewMode === 'week') {
      const d = new Date(planningDate);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      d.setDate(diff);
      const cols = [];
      for (let i = 0; i < 7; i++) {
        const cur = new Date(d);
        cur.setDate(d.getDate() + i);
        cols.push({
          label: cur.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          value: formatDateStr(cur),
          date: formatDateStr(cur)
        });
      }
      return cols;
    } else {
      const y = planningDate.getFullYear();
      const m = planningDate.getMonth();
      const daysInMonth = new Date(y, m + 1, 0).getDate();
      const cols = [];
      for (let i = 1; i <= daysInMonth; i++) {
        const cur = new Date(y, m, i);
        cols.push({
          label: i.toString(),
          value: formatDateStr(cur),
          date: formatDateStr(cur)
        });
      }
      return cols;
    }
  };
  const gridColumns = getGridColumns();

  const [provisionalPlan, setProvisionalPlan] = useState<{ machine: string, time: string, scheduledDate?: string, forms: any[] } | null>(null);
  const [isBulkPlanModalOpen, setIsBulkPlanModalOpen] = useState<boolean>(false);
  const [bulkPlanToggles, setBulkPlanToggles] = useState({ recalculation: true, lock: false });

  // Add Reservation Modal State
  const [isAddReservationOpen, setIsAddReservationOpen] = useState<boolean>(false);
  const [selectedPlannedBlock, setSelectedPlannedBlock] = useState<{ machine: string, time: string, forms: any[], scheduledDate?: string } | null>(null);
  const [newReservation, setNewReservation] = useState({ machine: 'Colaris', info: '', dates: [] as string[] });

  // Add Machine Modal State
  const [isAddMachineOpen, setIsAddMachineOpen] = useState<boolean>(false);
  const [viewingForm, setViewingForm] = useState<any | null>(null);
  const [viewFormVersion, setViewFormVersion] = useState<any | null>(null);
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
  const [formsList, setFormsList] = useState(() => {
    try {
      const saved = localStorage.getItem('mercury_formsList');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
    {
      id: '1',
      formId: 'Kader-20260206 10:33-0001',
      quality: 'Viva',
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
      quality: 'Elegance',
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
      quality: 'Patio',
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
      quality: 'Viva',
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
      quality: 'Elegance',
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
      quality: 'Patio',
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
      quality: 'Viva',
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
      quality: 'Elegance',
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
      quality: 'Patio',
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
      quality: 'Viva',
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
    ];
  });

  useEffect(() => {
    localStorage.setItem('mercury_formsList', JSON.stringify(formsList));
  }, [formsList]);

  useEffect(() => {
    localStorage.setItem('mercury_formVersionsList', JSON.stringify(formVersionsList));
  }, [formVersionsList]);

  // Temporary effect to update the 02:00 block to Viva
  useEffect(() => {
    setFormVersionsList(prev => {
      const updated = prev.map(f => {
        if (f.scheduledTime === '02:00' && f.quality === 'Elegance') {
          return { ...f, quality: 'Viva' };
        }
        return f;
      });
      // Only return new array if something changed to avoid loop
      if (JSON.stringify(updated) !== JSON.stringify(prev)) {
        return updated;
      }
      return prev;
    });
  }, []);

  const [notification, setNotification] = useState<{ message: string; type: 'info' | 'success' | 'error' } | null>(null);

  // Auto-clear notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Fetch Data from Spring Boot
  const fetchData = async () => {
    try {
      const [resForms, resItems, resJobs] = await Promise.all([
        fetch(`${API_BASE}/forms`),
        fetch(`${API_BASE}/order-items`),
        fetch(`${API_BASE}/jobs`)
      ]);

      if (resForms.ok && resItems.ok && resJobs.ok) {
        const dataForms: FormView[] = await resForms.json();
        const dataItems: OrderItemView[] = await resItems.json();
        const apiJobs: JobView[] = await resJobs.json();

        setOrderItems(dataItems);
        
        const localJobs = JSON.parse(localStorage.getItem('mercury_jobs') || '[]');
        const combinedJobs = [...apiJobs, ...localJobs];
        const uniqueJobs = Array.from(new Map(combinedJobs.map(item => [item.jobId, item])).values());
        setJobs(uniqueJobs);

        // Pre-select first form if none selected
        if (dataForms.length > 0 && !selectedFormId) {
          setSelectedFormId(dataForms[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching API data', error);
    }
  };

  // Poll data every 3 seconds for dynamic reactivity
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 3000);
    return () => clearInterval(interval);
  }, [selectedFormId, activeSection]);



  // Status Badge coloring mapper
  const getStatusBadgeStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return { backgroundColor: 'rgba(100, 116, 139, 0.2)', color: 'var(--text-secondary)', border: '1px solid rgba(148, 163, 184, 0.3)' };
      case 'SCHEDULED': return { backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' };
      case 'PRINTING': case 'RUNNING': return { backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' };
      case 'CUTTING': return { backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.3)' };
      case 'DONE': case 'COMPLETED': return { backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' };
      default: return { backgroundColor: 'var(--surface-border)', color: 'var(--text-primary)' };
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
            fontSize: '1.8rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: '4px'
          }}>
            PRODUCTION PLANNING
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>
            Production Planning Control Center (Web-to-Print Microservice System)
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>


          {/* User avatar + logout */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'var(--surface-bg)',
            border: '1px solid rgba(0, 0, 0,0.08)',
            borderRadius: '12px', padding: '8px 14px'
          }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: '#e2e8f0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.85rem', fontWeight: 700, color: '#475569',
              flexShrink: 0
            }}>
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
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
          backgroundColor: 'var(--surface-bg)',
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



      {/* ── SECTION: FORMS TABLE ── */}
      {activeSection === 'forms' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Forms</h2>
          </div>

          {/* Filters Section */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Filters</h3>
            
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
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>{filter.label}</label>
                  {filter.type === 'text' || filter.type === 'dateRange' ? (
                    <input 
                      type="text" 
                      placeholder={filter.placeholder} 
                      style={{ width: '100%', background: 'var(--surface-bg)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px 14px', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem' }} 
                    />
                  ) : (
                    <select style={{ width: '100%', background: 'var(--surface-bg)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px 14px', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                      <option style={{color: 'black'}}>{filter.options?.[0]}</option>
                    </select>
                  )}
                </div>
              ))}
              
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Reprint</label>
                <div style={{ width: '44px', height: '24px', background: 'var(--surface-border)', borderRadius: '12px', position: 'relative', cursor: 'pointer', border: '1px solid rgba(0, 0, 0,0.2)' }}>
                  <div style={{ width: '18px', height: '18px', background: '#94a3b8', borderRadius: '50%', position: 'absolute', top: '2px', left: '3px' }}></div>
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>Sort</label>
                <select style={{ width: '100%', background: 'var(--surface-bg)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px 14px', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                  <option style={{color: 'black'}}>form_number-desc</option>
                </select>
              </div>

            </div>
          </div>

          <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid rgba(0, 0, 0,0.05)', background: 'var(--surface-bg)' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
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
                  <tr style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)', color: 'var(--text-primary)', background: 'var(--surface-bg)' }}>
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
                    <tr key={form.id} style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'var(--surface-bg)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
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
                            <img src="/form1.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
                            <img src="/form2.jpg" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
                          </div>
                        ) : form.id === '2' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <img src="/form2-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
                            <img src="/form2-unit.jpg" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
                          </div>
                        ) : form.id === '3' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <img src="/form3-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
                            <img src="/form3-unit.jpg" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
                          </div>
                        ) : form.id === '4' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <img src="/form4-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
                            <img src="/form4-unit.png" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
                          </div>
                        ) : form.id === '5' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <img src="/form5-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
                            <img src="/form5-unit.png" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
                          </div>
                        ) : form.id === '6' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <img src="/form6-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
                            <img src="/form6-unit.png" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
                          </div>
                        ) : form.id === '7' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <img src="/form7-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
                            <img src="/form7-unit.png" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
                          </div>
                        ) : form.id === '8' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <img src="/form8-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
                            <img src="/form8-unit.png" alt="Individual Form" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
                          </div>
                        ) : form.id === '9' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <img src="/form9-layout.jpg" alt="Layout Sheet" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
                            <img src="/form9-unit1.png" alt="Individual Form Orange" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
                            <img src="/form9-unit2.png" alt="Individual Form Blue" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)' }} />
                          </div>
                        ) : (
                          <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '4px', border: '1px solid rgba(0, 0, 0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '16px 12px' }}>{renderQualityBadge(form.quality)}</td>
                      <td style={{ padding: '16px 12px' }}>{form.dimension}</td>
                      <td style={{ padding: '16px 12px' }}>{form.size}</td>
                      <td style={{ padding: '16px 12px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#c4b5fd', fontSize: '0.75rem', fontWeight: 600 }}>
                          {form.repetition}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px', color: 'var(--text-secondary)' }}>{form.printingTime}</td>
                      <td style={{ padding: '16px 12px' }}>{form.rollType}</td>
                      <td style={{ padding: '16px 12px', color: 'var(--text-tertiary)' }}>{form.printedDate}</td>
                      <td style={{ padding: '16px 12px', color: 'var(--text-primary)' }}>{form.dateNeeded}</td>
                      <td style={{ padding: '16px 12px', color: 'var(--text-tertiary)' }}>{form.deliveredDate}</td>
                      <td style={{ padding: '16px 12px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '4px', background: form.status === 'NEW' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(52, 211, 153, 0.1)', border: form.status === 'NEW' ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid rgba(52, 211, 153, 0.2)', color: form.status === 'NEW' ? '#bae6fd' : '#6ee7b7', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                          {form.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                        <button onClick={() => setViewingForm(form)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}>
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
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Form Versions</h2>
          </div>

          {/* Filters Section */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Filters</h3>
            
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
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>{filter.label}</label>
                  {filter.type === 'text' || filter.type === 'dateRange' ? (
                    <input 
                      type="text" 
                      placeholder={filter.placeholder} 
                      style={{ width: '100%', background: 'var(--surface-bg)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px 14px', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem' }} 
                    />
                  ) : (
                    <select style={{ width: '100%', background: 'var(--surface-bg)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px 14px', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                      <option style={{color: 'black'}}>{filter.options?.[0]}</option>
                    </select>
                  )}
                </div>
              ))}
              
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Reprint</label>
                <div style={{ width: '44px', height: '24px', background: 'var(--surface-border)', borderRadius: '12px', position: 'relative', cursor: 'pointer', border: '1px solid rgba(0, 0, 0,0.2)' }}>
                  <div style={{ width: '18px', height: '18px', background: '#94a3b8', borderRadius: '50%', position: 'absolute', top: '2px', left: '3px' }}></div>
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>Sort</label>
                <select style={{ width: '100%', background: 'var(--surface-bg)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px 14px', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                  <option style={{color: 'black'}}>form_number-desc</option>
                </select>
              </div>

            </div>
          </div>

          <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid rgba(0, 0, 0,0.05)', background: 'var(--surface-bg)' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {formVersionsList.length} result(s) found
              </div>
              
              {/* Action Bars */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  onClick={() => {
                    if (selectedFormIds.length === 0) {
                      setNotification({ message: 'Select at least one form version to delete.', type: 'error' });
                      return;
                    }
                    if (window.confirm('Are you sure you want to delete the selected form version(s)?')) {
                      // Get the form versions being deleted
                      const deletedFormVersions = formVersionsList.filter(fv => selectedFormIds.includes(fv.id));
                      
                      // Restore them to formsList
                      setFormsList(prev => {
                        const next = [...prev];
                        deletedFormVersions.forEach(fv => {
                          if (!next.find(f => f.id === fv.id)) {
                            // Strip scheduling metadata
                            const { jobId, scheduledMachine, scheduledTime, scheduledDate, isNewlyPlanned, ...originalForm } = fv;
                            next.push(originalForm);
                          }
                        });
                        localStorage.setItem('mercury_formsList', JSON.stringify(next));
                        return next;
                      });
                      
                      // Remove from formVersionsList
                      const updatedFormsList = formVersionsList.filter(fv => !selectedFormIds.includes(fv.id));
                      setFormVersionsList(updatedFormsList);
                      localStorage.setItem('mercury_formVersionsList', JSON.stringify(updatedFormsList));
                      
                      // Remove from jobs
                      setJobs(prev => {
                        const updated = prev.filter(job => !selectedFormIds.includes(job.formVersionId));
                        localStorage.setItem('mercury_jobs', JSON.stringify(updated));
                        return updated;
                      });
                      
                      // Remove from formsToPlan
                      const updatedFormsToPlan = formsToPlan.filter(f => !selectedFormIds.includes(f.id));
                      setFormsToPlan(updatedFormsToPlan);

                      // Clear selection
                      setSelectedFormIds([]);
                      setNotification({ message: 'Selected form version(s) deleted successfully.', type: 'success' });
                    }
                  }}
                  style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  Delete ({selectedFormIds.length})
                </button>

                {/* Top Action Bar (Create rollout) */}
                <div style={{ display: 'flex', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '8px', overflow: 'hidden' }}>
                <button 
                  onClick={() => {
                    if (selectedFormIds.length === 0) {
                      setNotification({ message: 'Select at least one form version to rollout.', type: 'error' });
                      return;
                    }
                    const newRepetitions: Record<string, number> = {};
                    selectedFormIds.forEach(id => newRepetitions[id] = 1);
                    setRolloutRepetitions(newRepetitions);
                    setStagedRolloutForms([]);
                    setIsCreateRolloutModalOpen(true);
                  }}
                  style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: 'none', padding: '8px 16px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                  Create Roll Out ({selectedFormIds.length})
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
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)', color: 'var(--text-primary)', background: 'var(--surface-bg)' }}>
                    <th style={{ padding: '16px 12px', width: '40px' }}>
                      <input 
                        type="checkbox" 
                        style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#38bdf8' }} 
                        checked={selectedFormIds.length > 0 && selectedFormIds.length === formVersionsList.length}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedFormIds(formVersionsList.map(f => f.id));
                          else setSelectedFormIds([]);
                        }}
                      />
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
                    <tr key={index} style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'var(--surface-bg)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '16px 12px' }}>
                        <input 
                          type="checkbox" 
                          style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#38bdf8' }} 
                          checked={selectedFormIds.includes(form.id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedFormIds(prev => [...prev, form.id]);
                            else setSelectedFormIds(prev => prev.filter(id => id !== form.id));
                          }}
                        />
                      </td>
                      <td style={{ padding: '16px 12px', color: '#38bdf8', fontWeight: 600 }}>{form.formId}</td>
                      <td style={{ padding: '16px 12px', color: '#10b981', fontWeight: 700 }}>{form.jobId}</td>
                      <td style={{ padding: '16px 12px' }}>
                        {renderFormThumbnail(form)}
                      </td>
                      <td style={{ padding: '16px 12px' }}>{renderQualityBadge(form.quality)}</td>
                      <td style={{ padding: '16px 12px' }}>{form.dimension}</td>
                      <td style={{ padding: '16px 12px' }}>{form.size}</td>
                      <td style={{ padding: '16px 12px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#c4b5fd', fontSize: '0.75rem', fontWeight: 600 }}>
                          {form.repetition}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px', color: 'var(--text-secondary)' }}>{form.printingTime}</td>
                      <td style={{ padding: '16px 12px' }}>{form.rollType}</td>
                      <td style={{ padding: '16px 12px', color: 'var(--text-tertiary)' }}>{form.printedDate}</td>
                      <td style={{ padding: '16px 12px', color: 'var(--text-primary)' }}>{form.dateNeeded}</td>
                      <td style={{ padding: '16px 12px', color: 'var(--text-tertiary)' }}>{form.deliveredDate}</td>
                      <td style={{ padding: '16px 12px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '4px', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.2)', color: '#6ee7b7', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                          PLANNED
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                        <button onClick={(e) => { e.stopPropagation(); setViewFormVersion(form); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}>
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
      {activeSection === 'jobs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Jobs</h2>
          </div>

          {/* Filters Section */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Filters</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              {[
                { label: 'Barcode', type: 'text', placeholder: 'Search' },
                { label: 'Form version ID', type: 'text', placeholder: 'Search' },
                { label: 'Form ID', type: 'text', placeholder: 'Search' },
                { label: 'Job ID', type: 'text', placeholder: 'Search' },
                { label: 'Design ID', type: 'text', placeholder: 'Search' },
                { label: 'Order item ID', type: 'text', placeholder: 'Search' },
                { label: 'Customer', type: 'text', placeholder: 'Search' },
                { label: 'Quality', type: 'text', placeholder: 'Search' },
                { label: 'Size', type: 'text', placeholder: 'Search' },
                { label: 'Machine', type: 'select', options: ['Search'] },
                { label: 'Production start date', type: 'dateRange', placeholder: 'Start ~ End' },
                { label: 'Expected end date', type: 'dateRange', placeholder: 'Start ~ End' },
                { label: 'Status', type: 'select', options: ['Search'] },
                { label: 'Quantity', type: 'text', placeholder: 'Search' },
                { label: 'Pallet', type: 'text', placeholder: 'Search' },
                { label: 'Job-result', type: 'text', placeholder: 'Search' },
              ].map(filter => (
                <div key={filter.label}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>{filter.label}</label>
                  {filter.type === 'text' || filter.type === 'dateRange' ? (
                    <input 
                      type="text" 
                      placeholder={filter.placeholder} 
                      style={{ width: '100%', background: 'var(--surface-bg)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px 14px', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem' }} 
                    />
                  ) : (
                    <select style={{ width: '100%', background: 'var(--surface-bg)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px 14px', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                      <option style={{color: 'black'}}>{filter.options?.[0]}</option>
                    </select>
                  )}
                </div>
              ))}

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>Sort</label>
                <select style={{ width: '100%', background: 'var(--surface-bg)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px 14px', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                  <option style={{color: 'black'}}>Ascending by Date nee...</option>
                </select>
              </div>
            </div>

            <button style={{ 
              background: 'transparent', color: '#0ea5e9', border: '1px solid #0ea5e9', 
              padding: '8px 16px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' 
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              Reset filters
            </button>
          </div>

          <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569' }}>
                  <th style={{ padding: '16px', textAlign: 'center', width: '40px' }}><input type="checkbox" style={{ cursor: 'pointer' }} /></th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Job ID
                      <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.5rem', lineHeight: 1 }}><span>▲</span><span>▼</span></div>
                    </div>
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Form version ID</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Form ID</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: 600 }}>Thumbnail</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Quality</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Pallets</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Quantity
                      <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.5rem', lineHeight: 1 }}><span>▲</span><span>▼</span></div>
                    </div>
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Jobs error quantity</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Production start date
                      <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.5rem', lineHeight: 1 }}><span>▲</span><span>▼</span></div>
                    </div>
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Expected end date</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Date needed
                      <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.5rem', lineHeight: 1, color: '#f97316' }}><span>▲</span><span>▼</span></div>
                    </div>
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Track</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: 600 }}>Action</th>
                </tr>
              </thead>
              <tbody style={{ background: 'white' }}>
                {jobs.length === 0 ? (
                  <tr><td colSpan={16} style={{ padding: '32px', textAlign: 'center', color: '#cbd5e1' }}>Aucun job trouvé.</td></tr>
                ) : jobs.map(job => (
                  <tr key={job.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <input type="checkbox" style={{ cursor: 'pointer', opacity: 0.5 }} />
                    </td>
                    <td style={{ padding: '16px', color: '#0ea5e9', fontWeight: 500 }}>{job.jobId}</td>
                    <td style={{ padding: '16px', color: '#475569', fontWeight: 500 }}>{job.formVersionId || '2000000206_1'}</td>
                    <td style={{ padding: '16px', color: '#475569', fontWeight: 500 }}>{job.formId || '2000000206'}</td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {renderFormThumbnail({ id: job.formVersionId || '1' })}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>{renderQualityBadge(job.quality || 'Viva')}</td>
                    <td style={{ padding: '16px', color: '#475569' }}>{job.pallets || ''}</td>
                    <td style={{ padding: '16px', color: '#475569' }}>{job.quantity || 1}</td>
                    <td style={{ padding: '16px', color: '#475569' }}>{job.jobsErrorQuantity || 0}</td>
                    <td style={{ padding: '16px', color: '#475569' }}>{job.productionStartDate || ''}</td>
                    <td style={{ padding: '16px', color: '#475569' }}>{job.expectedEndDate || ''}</td>
                    <td style={{ padding: '16px', color: '#475569', fontWeight: 500 }}>{job.dateNeeded || '19/06/2026'}</td>
                    <td style={{ padding: '16px' }}></td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', color: '#0ea5e9' }}>
                        <svg onClick={() => setViewJobModal(job)} style={{ cursor: 'pointer' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        <svg onClick={() => {
                          setAddJobResultModal(job);
                          setNewJobResultQuantity(job.quantity || 1);
                        }} style={{ cursor: 'pointer' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}

      {/* ── SECTION: JOB RESULTS TABLE ── */}
      {activeSection === 'job-results' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Job-results</h2>
          </div>

          {/* Filters Section */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Filters</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              {[
                { label: 'Job-result ID', type: 'text', placeholder: 'Search' },
                { label: 'Job ID', type: 'text', placeholder: 'Search' },
                { label: 'Form Versions ID', type: 'text', placeholder: 'Search' },
                { label: 'Form ID', type: 'text', placeholder: 'Search' },
                { label: 'Design ID', type: 'text', placeholder: 'Search' },
                { label: 'Order item ID', type: 'text', placeholder: 'Search' },
                { label: 'Order ID', type: 'text', placeholder: 'Search' },
                { label: 'Roller Barcode', type: 'text', placeholder: 'Search' },
                { label: 'PO Number', type: 'text', placeholder: 'Search' },
                { label: 'Pallet', type: 'text', placeholder: 'Search' },
                { label: 'Machine', type: 'select', options: ['Search'] },
                { label: 'Status', type: 'select', options: ['Search'] }
              ].map(filter => (
                <div key={filter.label}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>{filter.label}</label>
                  {filter.type === 'text' || filter.type === 'dateRange' ? (
                    <input 
                      type="text" 
                      placeholder={filter.placeholder} 
                      style={{ width: '100%', background: 'var(--surface-bg)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px 14px', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem' }} 
                    />
                  ) : (
                    <select style={{ width: '100%', background: 'var(--surface-bg)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px 14px', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                      <option style={{color: 'black'}}>{filter.options?.[0]}</option>
                    </select>
                  )}
                </div>
              ))}
            </div>

            <button style={{ 
              background: 'transparent', color: '#0ea5e9', border: '1px solid #0ea5e9', 
              padding: '8px 16px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', width: 'fit-content' 
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              Reset filters
            </button>
          </div>

          <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ color: '#475569', fontWeight: 500 }}>{jobResults.length} result(s) found</div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => {
                    const selected = jobResults.filter((r: any) => selectedJobResultIds.includes(r.id));
                    if (selected.length > 0) {
                      setPackagingResults((prev: any) => [...prev, ...selected]);
                      setSelectedJobResultIds([]);
                      setActiveSection('packaging');
                      if (typeof setNotification !== 'undefined') {
                        setNotification({ message: `Successfully sent ${selected.length} item(s) to Packaging`, type: 'success' });
                      }
                    } else {
                      if (typeof setNotification !== 'undefined') {
                        setNotification({ message: 'Please select at least one job result', type: 'error' });
                      }
                    }
                  }}
                  style={{ background: '#38bdf8', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                  Create Palette
                </button>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569' }}>
                  <th style={{ padding: '16px', textAlign: 'center', width: '40px' }}><input type="checkbox" style={{ cursor: 'pointer' }} /></th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Job-result ID <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.5rem', lineHeight: 1 }}><span>▲</span><span>▼</span></div></div>
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Form ID</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Form versions IDS</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: 600 }}>Thumbnail</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Job ID</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Design ID</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Quality</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Size</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Quantity <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.5rem', lineHeight: 1 }}><span>▲</span><span>▼</span></div></div>
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Pallet</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Creation date <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.5rem', lineHeight: 1 }}><span>▲</span><span>▼</span></div></div>
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Date needed</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: 600 }}>Action</th>
                </tr>
              </thead>
              <tbody style={{ background: 'white' }}>
                {jobResults.length === 0 ? (
                  <tr><td colSpan={15} style={{ padding: '32px', textAlign: 'center', color: '#cbd5e1' }}>Aucun résultat trouvé.</td></tr>
                ) : jobResults.map((res: any, idx) => (
                  <tr key={res.id || idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        style={{ cursor: 'pointer' }} 
                        checked={selectedJobResultIds.includes(res.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedJobResultIds((prev: string[]) => [...prev, res.id]);
                          else setSelectedJobResultIds((prev: string[]) => prev.filter((id: string) => id !== res.id));
                        }}
                      />
                    </td>
                    <td style={{ padding: '16px', color: '#0ea5e9', fontWeight: 500 }}>{res.id}</td>
                    <td style={{ padding: '16px', color: '#ec4899', fontWeight: 500 }}><span style={{ border: '1px solid #fbcfe8', padding: '2px 8px', borderRadius: '4px', background: 'transparent' }}>{res.formId}</span></td>
                    <td style={{ padding: '16px', color: '#f59e0b', fontWeight: 500 }}><span style={{ border: '1px solid #fde68a', padding: '2px 8px', borderRadius: '4px', background: 'transparent' }}>{res.formVersionId}</span></td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {renderFormThumbnail({ id: res.formVersionId?.split('_')[0] || res.formId || '1' })}
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: '#6366f1', fontWeight: 500 }}><span style={{ border: '1px solid #c7d2fe', padding: '2px 8px', borderRadius: '4px', background: 'transparent' }}>{res.jobId}</span></td>
                    <td style={{ padding: '16px', color: '#f97316', fontWeight: 500 }}><span style={{ border: '1px solid #ffedd5', padding: '2px 8px', borderRadius: '4px', background: 'transparent' }}>{res.designId}</span></td>
                    <td style={{ padding: '16px', color: 'white', fontWeight: 500 }}><span style={{ background: '#d97706', padding: '4px 8px', borderRadius: '4px' }}>{res.quality}</span></td>
                    <td style={{ padding: '16px', color: '#475569' }}>{res.size}</td>
                    <td style={{ padding: '16px', color: '#475569' }}>{res.quantity}</td>
                    <td style={{ padding: '16px', color: '#ef4444' }}><span style={{ border: '1px solid #fecaca', padding: '2px 8px', borderRadius: '4px', background: 'transparent' }}>{res.pallet || 'null'}</span></td>
                    <td style={{ padding: '16px', color: '#475569' }}>{res.creationDate}</td>
                    <td style={{ padding: '16px', color: '#475569' }}>{res.dateNeeded}</td>
                    <td style={{ padding: '16px', color: '#475569' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}></span>
                        {res.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', color: '#0ea5e9', cursor: 'pointer' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
            
            {/* Pagination and Action Buttons */}
            <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                <button style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '4px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{'<'}</button>
                <button style={{ background: 'white', border: '1px solid #0ea5e9', color: '#0ea5e9', borderRadius: '4px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>1</button>
                <button style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '4px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{'>'}</button>
                <span style={{ marginLeft: '12px' }}>10 / page <span style={{ fontSize: '0.7rem' }}>▼</span></span>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ── SECTION: ORDER ITEMS ── */}          {/* ── SECTION: ORDER ITEMS ── */}
          {activeSection === 'order-items' && (
            <div className="glass-panel">
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>🛒 Order Items</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(0, 0, 0,0.1)', color: 'var(--text-tertiary)' }}>
                      {['Item ID','Dimensions','Source','Quality','Border','Reprint','Form','Status'].map(h => (
                        <th key={h} style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.length === 0 ? (
                      <tr><td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: '#cbd5e1' }}>Aucun order item trouvé.</td></tr>
                    ) : orderItems.map(item => (
                      <tr key={item.id} style={{ borderBottom: '1px solid rgba(0, 0, 0,0.04)' }} className="table-row">
                        <td style={{ padding: '10px 8px', fontWeight: 700 }}>{item.orderItemId}</td>
                        <td style={{ padding: '10px 8px' }}>{item.width}m × {item.height}m</td>
                        <td style={{ padding: '10px 8px' }}><span style={{ background: 'var(--surface-border)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.78rem' }}>{item.sourceSystem}</span></td>
                        <td style={{ padding: '10px 8px' }}>{renderQualityBadge(item.quality)}</td>
                        <td style={{ padding: '10px 8px' }}>{item.border}</td>
                        <td style={{ padding: '10px 8px', color: item.reprintState === 'PROCESSED' ? 'var(--secondary)' : '#64748b' }}>{item.reprintState}</td>
                        <td style={{ padding: '10px 8px', color: item.formNumber ? 'white' : '#cbd5e1' }}>{item.formNumber ?? 'Unattached'}</td>
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
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Production Planning</h2>
                <button 
                  onClick={() => setIsAddReservationOpen(true)}
                  style={{ 
                  background: '#0ea5e9',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  cursor: 'pointer'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  Add reservation
                </button>
              </div>

              {/* Filters Section */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Filters</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                  {['Form ID', 'Form version ID', 'Job ID', 'Job-result ID', 'Roll Out ID', 'Order ID', 'Customer', 'Design ID'].map(filter => (
                    <div key={filter}>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>{filter}</label>
                      <input 
                        type="text" 
                        placeholder="Search" 
                        style={{ 
                          width: '100%', 
                          background: 'var(--surface-bg)', 
                          border: '1px solid rgba(0, 0, 0,0.1)', 
                          padding: '10px 14px', 
                          borderRadius: '8px',
                          color: 'var(--text-primary)',
                          fontSize: '0.85rem'
                        }} 
                      />
                    </div>
                  ))}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Only reservations</label>
                    {/* Toggle switch simulation */}
                    <div style={{ 
                      width: '44px', height: '24px', 
                      background: 'var(--surface-border)', 
                      borderRadius: '12px', 
                      position: 'relative',
                      cursor: 'pointer',
                      border: '1px solid rgba(0, 0, 0,0.2)'
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

              {/* Instruction for forms pending planning */}
              {formsToPlan.length > 0 && (
                <div style={{ color: '#475569', fontSize: '0.95rem', fontWeight: 500, marginBottom: '-8px' }}>
                  Select start date by clicking the empty cell
                </div>
              )}


              {/* Timeline Container */}
              <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                
                {/* Timeline Controls */}
                <div style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  padding: '16px 24px', borderBottom: '1px solid rgba(0, 0, 0,0.05)',
                  background: 'var(--surface-bg)'
                }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    0 result(s) found
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ display: 'flex', border: '1px solid rgba(0, 0, 0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
                      <button onClick={() => {
                        const newDate = new Date(planningDate);
                        if (planningViewMode === 'day') newDate.setDate(newDate.getDate() - 1);
                        if (planningViewMode === 'week') newDate.setDate(newDate.getDate() - 7);
                        if (planningViewMode === 'month') newDate.setMonth(newDate.getMonth() - 1);
                        setPlanningDate(newDate);
                      }} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', padding: '8px 16px', fontSize: '0.85rem', cursor: 'pointer', borderRight: '1px solid rgba(0, 0, 0,0.1)' }}>
                        ← Previous
                      </button>
                      <button onClick={() => {
                        const newDate = new Date(planningDate);
                        if (planningViewMode === 'day') newDate.setDate(newDate.getDate() + 1);
                        if (planningViewMode === 'week') newDate.setDate(newDate.getDate() + 7);
                        if (planningViewMode === 'month') newDate.setMonth(newDate.getMonth() + 1);
                        setPlanningDate(newDate);
                      }} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', padding: '8px 16px', fontSize: '0.85rem', cursor: 'pointer' }}>
                        Next →
                      </button>
                    </div>

                    <div style={{ position: 'relative' }}>
                      <input 
                        type="date" 
                        value={formatDateStr(planningDate)}
                        onChange={(e) => {
                          if (e.target.value) setPlanningDate(new Date(e.target.value));
                        }}
                        style={{ 
                          width: '150px', 
                          background: 'var(--surface-bg)', 
                          border: '1px solid rgba(0, 0, 0,0.1)', 
                          padding: '8px 14px', 
                          borderRadius: '8px',
                          color: 'var(--text-primary)',
                          fontSize: '0.85rem',
                          textAlign: 'center'
                        }} 
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', border: '1px solid rgba(0, 0, 0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
                    <button onClick={() => setPlanningViewMode('day')} style={{ background: planningViewMode === 'day' ? '#3b82f6' : 'transparent', color: planningViewMode === 'day' ? 'white' : 'var(--text-secondary)', border: 'none', padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                      Day
                    </button>
                    <button onClick={() => setPlanningViewMode('week')} style={{ background: planningViewMode === 'week' ? '#3b82f6' : 'transparent', border: 'none', borderLeft: '1px solid rgba(0, 0, 0,0.1)', borderRight: '1px solid rgba(0, 0, 0,0.1)', color: planningViewMode === 'week' ? 'white' : 'var(--text-secondary)', padding: '8px 16px', fontSize: '0.85rem', cursor: 'pointer' }}>
                      Week
                    </button>
                    <button onClick={() => setPlanningViewMode('month')} style={{ background: planningViewMode === 'month' ? '#3b82f6' : 'transparent', border: 'none', color: planningViewMode === 'month' ? 'white' : 'var(--text-secondary)', padding: '8px 16px', fontSize: '0.85rem', cursor: 'pointer' }}>
                      Month
                    </button>
                  </div>
                </div>

                {/* Date Header */}
                <div style={{ textAlign: 'center', padding: '20px 0', borderBottom: '1px solid rgba(0, 0, 0,0.05)' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    {planningViewMode === 'day' && planningDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    {planningViewMode === 'week' && `Week of ${planningDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
                    {planningViewMode === 'month' && planningDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                </div>

                {/* Gantt Grid */}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                    <thead>
                      <tr style={{ background: 'var(--surface-bg)', color: 'var(--text-primary)' }}>
                        <th style={{ width: '150px', padding: '16px', textAlign: 'left', fontWeight: 700, borderRight: '1px solid rgba(0, 0, 0,0.1)', borderBottom: '1px solid rgba(0, 0, 0,0.1)' }}>Machines</th>
                        {gridColumns.map(col => (
                          <th key={col.value} style={{ width: planningViewMode === 'day' ? '120px' : (planningViewMode === 'month' ? '50px' : '150px'), padding: '12px 8px', textAlign: 'center', fontWeight: 700, fontSize: '0.85rem', borderRight: '1px solid rgba(0, 0, 0,0.05)', borderBottom: '1px solid rgba(0, 0, 0,0.1)' }}>{col.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {['Colaris'].map((machine, index) => (
                        <tr key={index}>
                          <td style={{ padding: '16px', fontWeight: 600, color: 'var(--text-secondary)', borderRight: '1px solid rgba(0, 0, 0,0.1)', borderBottom: '1px solid rgba(0, 0, 0,0.05)', background: 'var(--surface-bg)' }}>
                            {machine}
                          </td>
                          {/* Hour cells with sub-grid dashes simulated */}
                          {Array.from({length: 24}, (_, i) => `${i.toString().padStart(2, '0')}:00`).map((hour, hIdx) => {
                            const blockForms = formVersionsList.filter(f => f.scheduledMachine === machine && f.scheduledTime === hour && f.scheduledDate === formatDateStr(planningDate));
                            return (
                            <td key={hIdx} style={{ 
                              position: 'relative',
                              height: '80px',
                              borderRight: '1px solid rgba(0, 0, 0,0.05)', 
                              borderBottom: '1px solid rgba(0, 0, 0,0.05)',
                              background: 'repeating-linear-gradient(90deg, transparent, transparent 29px, rgba(0, 0, 0,0.02) 29px, rgba(0, 0, 0,0.02) 30px)',
                              cursor: formsToPlan.length > 0 ? 'pointer' : 'default'
                            }}
                            onClick={() => {
                              if (formsToPlan.length > 0) {
                                setProvisionalPlan({ machine, time: hour, forms: formsToPlan, scheduledDate: formatDateStr(planningDate) });
                                setIsBulkPlanModalOpen(true);
                              }
                            }}>
                              {blockForms.length > 0 && (
                                <div
                                  onClick={(e) => { e.stopPropagation(); setSelectedPlannedBlock({ machine, time: hour, forms: blockForms, scheduledDate: formatDateStr(planningDate) }); }}
                                  style={{
                                    position: 'absolute',
                                    top: '10px',
                                    left: '4px',
                                    right: '4px',
                                    height: '60px',
                                    background: getQualityColor(blockForms[0].quality || ''),
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.1s, boxShadow 0.1s'
                                  }}
                                  onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)';
                                  }}
                                  onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'none';
                                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
                                  }}
                                >
                                  {blockForms[0].quality || 'wit'}
                                </div>
                              )}
                              {provisionalPlan?.machine === machine && provisionalPlan?.time === hour && (
                                <div style={{
                                  position: 'absolute', top: '10px', left: '4px', right: '4px', height: '60px',
                                  background: getQualityColor(provisionalPlan.forms[0].quality || ''), border: '2px dashed #fff', borderRadius: '6px',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600
                                }}>
                                  {provisionalPlan.forms[0].quality || 'Form'}
                                  <button onClick={(e) => { e.stopPropagation(); setProvisionalPlan(null); }} style={{ position: 'absolute', bottom: '4px', right: '4px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', color: '#fff' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                  </button>
                                </div>
                              )}
                            </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

              {/* Bottom Save Button removed as it's triggered immediately on cell click */}

              {/* Bulk Plan Confirmation Modal */}
              {isBulkPlanModalOpen && provisionalPlan && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9999, display: 'flex', alignItems: 'flex-start', paddingTop: '10vh', justifyContent: 'center' }}>
                  <div style={{ background: '#fff', borderRadius: '12px', width: '500px', padding: '24px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>Bulk plan form version</h3>
                      <button onClick={() => { setIsBulkPlanModalOpen(false); setProvisionalPlan(null); }} style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', color: '#64748b', cursor: 'pointer' }}>✕</button>
                    </div>
                    
                    <p style={{ color: '#334155', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.5' }}>
                      Are you sure to planify bulk form versions on <strong>{provisionalPlan.scheduledDate || formatDateStr(new Date())} {provisionalPlan.time}:00</strong>?
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div 
                          onClick={() => setBulkPlanToggles(p => ({ ...p, recalculation: !p.recalculation }))}
                          style={{ width: '36px', height: '20px', background: bulkPlanToggles.recalculation ? '#0ea5e9' : '#cbd5e1', borderRadius: '10px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
                          <div style={{ width: '16px', height: '16px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: bulkPlanToggles.recalculation ? '18px' : '2px', transition: 'left 0.2s' }}></div>
                        </div>
                        <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>Recalculation</span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div 
                          onClick={() => setBulkPlanToggles(p => ({ ...p, lock: !p.lock }))}
                          style={{ width: '36px', height: '20px', background: bulkPlanToggles.lock ? '#0ea5e9' : '#cbd5e1', borderRadius: '10px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
                          <div style={{ width: '16px', height: '16px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: bulkPlanToggles.lock ? '18px' : '2px', transition: 'left 0.2s' }}></div>
                        </div>
                        <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>Lock form version</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                      <button onClick={() => { setIsBulkPlanModalOpen(false); setProvisionalPlan(null); }} style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                      <button onClick={() => {
                        const jobId = `JOB-2026-${Math.floor(Math.random() * 9000 + 1000)}`;
                        const newVersions = provisionalPlan.forms.map(form => ({
                          ...form, 
                          jobId, 
                          scheduledMachine: provisionalPlan.machine, 
                          scheduledTime: provisionalPlan.time,
                          scheduledDate: provisionalPlan.scheduledDate || formatDateStr(new Date()),
                          isNewlyPlanned: true // For highlighting
                        }));
                        setFormVersionsList(prev => {
                          const next = [...prev, ...newVersions];
                          localStorage.setItem('mercury_formVersionsList', JSON.stringify(next));
                          return next;
                        });
                        
                        // Create and save the new Job
                        const newJob: JobView = {
                          id: jobId,
                          jobId: jobId,
                          formVersionId: provisionalPlan.forms[0]?.id || '',
                          formId: provisionalPlan.forms[0]?.formId || '',
                          pallets: '',
                          quantity: provisionalPlan.forms.length > 0 ? 1 : 0,
                          jobsErrorQuantity: 0,
                          productionStartDate: '',
                          expectedEndDate: '',
                          dateNeeded: provisionalPlan.forms[0]?.dateNeeded || '19/06/2026',
                          track: '',
                          status: 'PLANNED',
                          quality: provisionalPlan.forms[0]?.quality || ''
                        };
                        setJobs(prev => {
                          const next = [newJob, ...prev];
                          localStorage.setItem('mercury_jobs', JSON.stringify(next));
                          return next;
                        });
                        
                        // Clear out state
                        setFormsList(prev => prev.filter(f => !provisionalPlan.forms.find(pf => pf.id === f.id)));
                        setSelectedFormIds([]);
                        setFormsToPlan([]);
                        setProvisionalPlan(null);
                        setIsBulkPlanModalOpen(false);
                        
                        setNotification({ message: `Successfully planned ${newVersions.length} form(s) on ${provisionalPlan.machine} at ${provisionalPlan.time}`, type: 'success' });
                      }} style={{ background: '#0ea5e9', border: 'none', padding: '8px 16px', borderRadius: '6px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Grouped form versions Modal */}
              {selectedPlannedBlock && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9999, display: 'flex', alignItems: 'flex-start', paddingTop: '10vh', justifyContent: 'center' }}>
                  <div style={{ background: 'var(--surface-bg)', borderRadius: '12px', width: '1000px', maxWidth: '95vw', padding: '24px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Grouped form versions</h3>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '36px', height: '20px', background: '#cbd5e1', borderRadius: '10px', position: 'relative', cursor: 'pointer' }}>
                            <div style={{ width: '16px', height: '16px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px' }}></div>
                          </div>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Lock form version</span>
                        </div>
                        
                        <button onClick={() => {
                           // Replan logic
                           const formsToReplan = selectedPlannedBlock.forms;
                           setFormVersionsList(prev => prev.filter(f => !formsToReplan.find(pf => pf.id === f.id)));
                           setFormsToPlan(prev => {
                             const newArray = [...prev];
                             formsToReplan.forEach(f => {
                               if (!newArray.find(existing => existing.id === f.id)) {
                                 newArray.push(f);
                               }
                             });
                             return newArray;
                           });
                           setSelectedPlannedBlock(null);
                           setNotification({ message: 'Forms moved back to planning queue', type: 'info' });
                        }} style={{ background: '#0ea5e9', border: 'none', padding: '8px 16px', borderRadius: '6px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          Replan
                        </button>
                        
                        <button onClick={() => setSelectedPlannedBlock(null)} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', color: '#64748b', cursor: 'pointer', lineHeight: 1 }}>✕</button>
                      </div>
                    </div>
                    
                    <div style={{ overflowX: 'auto', border: '1px solid rgba(0, 0, 0,0.1)', borderRadius: '8px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                        <thead>
                          <tr style={{ background: 'var(--surface-border)', color: 'var(--text-secondary)' }}>
                            {['Form version ID', 'Thumbnail', 'Repetition', 'Dimensions', 'Linear meter', 'Roll type', 'Date needed', 'Action'].map(h => (
                              <th key={h} style={{ padding: '16px 12px', fontWeight: 700, whiteSpace: 'nowrap', borderRight: '1px solid rgba(0,0,0,0.05)' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPlannedBlock.forms.map((form, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)', background: 'var(--surface-bg)' }}>
                              <td style={{ padding: '16px 12px', color: '#0ea5e9', fontWeight: 600, borderRight: '1px solid rgba(0,0,0,0.05)' }}>{form.formId || `FV-${Math.floor(Math.random() * 1000)}`}</td>
                              <td style={{ padding: '16px 12px', borderRight: '1px solid rgba(0,0,0,0.05)' }}>
                                {renderFormThumbnail(form)}
                              </td>
                              <td style={{ padding: '16px 12px', borderRight: '1px solid rgba(0,0,0,0.05)', color: 'var(--text-secondary)' }}>{form.repetition || '-'}</td>
                              <td style={{ padding: '16px 12px', borderRight: '1px solid rgba(0,0,0,0.05)', color: 'var(--text-secondary)' }}>{form.dimension || '-'}</td>
                              <td style={{ padding: '16px 12px', borderRight: '1px solid rgba(0,0,0,0.05)' }}>
                                <span style={{ background: '#fdf4ff', color: '#d946ef', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>{form.size || '-'}</span>
                              </td>
                              <td style={{ padding: '16px 12px', borderRight: '1px solid rgba(0,0,0,0.05)' }}>
                                <span style={{ background: '#fff7ed', color: '#f97316', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>{form.rollType || '-'}</span>
                              </td>
                              <td style={{ padding: '16px 12px', borderRight: '1px solid rgba(0,0,0,0.05)', color: 'var(--text-secondary)' }}>{form.dateNeeded || '-'}</td>
                              <td style={{ padding: '16px 12px' }}>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setViewFormVersion(form); }}
                                  style={{
                                    background: 'transparent',
                                    border: '1px solid rgba(14, 165, 233, 0.2)',
                                    color: '#0ea5e9',
                                    padding: '6px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease',
                                    outline: 'none'
                                  }}
                                  onMouseOver={(e) => { e.currentTarget.style.background = '#f0f9ff'; e.currentTarget.style.borderColor = '#0ea5e9'; }}
                                  onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.2)'; }}
                                >
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
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


              {/* Add Reservation Modal */}
              {isAddReservationOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="glass-panel" style={{ width: '800px', maxWidth: '90%', display: 'flex', flexDirection: 'column', gap: '20px', padding: '32px', background: 'var(--surface-bg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--primary)' }}>Add reservation</h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button 
                          onClick={() => {
                            setIsAddReservationOpen(false);
                            setNewReservation({ machine: 'Colaris 1', info: '', dates: [] });
                            setNotification({ message: 'Reservation saved to planning', type: 'success' });
                          }}
                          style={{ background: '#0ea5e9', color: 'var(--text-primary)', border: 'none', padding: '8px 20px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.4)' }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                          Save
                        </button>
                        <button onClick={() => setIsAddReservationOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: 600 }}>Machine <span style={{ color: '#ef4444' }}>*</span></label>
                        <select 
                          value={newReservation.machine}
                          onChange={(e) => setNewReservation({...newReservation, machine: e.target.value})}
                          style={{ width: '100%', background: 'var(--surface-border)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '12px 14px', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                        >
                          <option value="Colaris" style={{ color: 'black' }}>Colaris</option>
                          <option value="Cutting" style={{ color: 'black' }}>Cutting</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: 600 }}>Information of reservation <span style={{ color: '#ef4444' }}>*</span></label>
                        <input 
                          type="text" 
                          value={newReservation.info}
                          onChange={(e) => setNewReservation({...newReservation, info: e.target.value})}
                          style={{ width: '100%', background: 'var(--surface-border)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '12px 14px', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.9rem' }} 
                        />
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(0, 0, 0,0.1)', paddingTop: '20px', marginTop: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <label style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>Reservation dates <span style={{ color: '#ef4444' }}>*</span></label>
                        <button 
                          onClick={() => {
                            const newDate = new Date().toISOString().substring(0,10) + 'T10:00';
                            setNewReservation({...newReservation, dates: [...newReservation.dates, newDate]});
                          }}
                          style={{ background: 'var(--primary)', color: 'var(--text-primary)', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                          Add date
                        </button>
                      </div>

                      {newReservation.dates.length === 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', opacity: 0.6 }}>
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                          <div style={{ marginTop: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No Data</div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {newReservation.dates.map((dateString, idx) => {
                            const [datePart, timePart] = dateString.split('T');
                            return (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--surface-border)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(0, 0, 0,0.1)' }}>
                               <div style={{ flex: 1 }}>
                                 <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary)', marginBottom: '6px', fontWeight: 600 }}>Date</label>
                                 <input 
                                   type="date" 
                                   value={datePart || ''} 
                                   onChange={(e) => {
                                     const newDates = [...newReservation.dates];
                                     newDates[idx] = `${e.target.value}T${timePart || '00:00'}`;
                                     setNewReservation({...newReservation, dates: newDates});
                                   }}
                                   style={{ width: '100%', background: 'var(--surface-bg)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px 14px', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }} 
                                 />
                               </div>
                               <div style={{ flex: 1 }}>
                                 <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary)', marginBottom: '6px', fontWeight: 600 }}>Heure</label>
                                 <input 
                                   type="time" 
                                   value={timePart || ''} 
                                   onChange={(e) => {
                                     const newDates = [...newReservation.dates];
                                     newDates[idx] = `${datePart || '2026-01-01'}T${e.target.value}`;
                                     setNewReservation({...newReservation, dates: newDates});
                                   }}
                                   style={{ width: '100%', background: 'var(--surface-bg)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px 14px', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }} 
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

              {/* Grouped Form Versions Modal */}
              {selectedPlannedBlock && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="glass-panel" style={{ width: '1200px', maxWidth: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', gap: '20px', padding: '0', background: 'var(--surface-bg)', overflow: 'hidden' }}>
                    
                    {/* Modal Header */}
                    <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Grouped form versions</h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                          <div style={{ width: '44px', height: '24px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', position: 'relative' }}>
                            <div style={{ width: '18px', height: '18px', background: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: '3px' }} />
                          </div>
                          Lock form version
                        </label>
                        <button style={{ background: '#0ea5e9', color: 'white', border: 'none', padding: '8px 24px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.4)' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.92-10.26l5.08-5.08"/></svg>
                          Replan
                        </button>
                        <button onClick={() => setSelectedPlannedBlock(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                        </button>
                      </div>
                    </div>

                    {/* Modal Body / Table */}
                    <div style={{ overflowY: 'auto', padding: '0 32px 32px 32px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                        <thead style={{ position: 'sticky', top: 0, background: 'var(--surface-bg)', zIndex: 10 }}>
                          <tr style={{ color: 'var(--text-primary)' }}>
                            <th style={{ padding: '16px', fontWeight: 700, borderBottom: '2px solid rgba(0,0,0,0.1)' }}>Form version ID</th>
                            <th style={{ padding: '16px', fontWeight: 700, borderBottom: '2px solid rgba(0,0,0,0.1)' }}>Thumbnail</th>
                            <th style={{ padding: '16px', fontWeight: 700, borderBottom: '2px solid rgba(0,0,0,0.1)' }}>Repetition</th>
                            <th style={{ padding: '16px', fontWeight: 700, borderBottom: '2px solid rgba(0,0,0,0.1)' }}>Dimensions</th>
                            <th style={{ padding: '16px', fontWeight: 700, borderBottom: '2px solid rgba(0,0,0,0.1)' }}>Linear meter</th>
                            <th style={{ padding: '16px', fontWeight: 700, borderBottom: '2px solid rgba(0,0,0,0.1)' }}>Customer</th>
                            <th style={{ padding: '16px', fontWeight: 700, borderBottom: '2px solid rgba(0,0,0,0.1)' }}>Roll type</th>
                            <th style={{ padding: '16px', fontWeight: 700, borderBottom: '2px solid rgba(0,0,0,0.1)' }}>Date needed</th>
                            <th style={{ padding: '16px', fontWeight: 700, borderBottom: '2px solid rgba(0,0,0,0.1)', textAlign: 'center' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPlannedBlock.forms.map((form, i) => (
                            <tr key={i} style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                              <td style={{ padding: '16px', color: '#0ea5e9', fontWeight: 600 }}>{form.formId}</td>
                              <td style={{ padding: '16px' }}>
                                {renderFormThumbnail(form)}
                              </td>
                              <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{form.repetition || '0/1'}</td>
                              <td style={{ padding: '16px', color: 'var(--text-primary)', fontWeight: 500 }}>{form.dimension || '-'}</td>
                              <td style={{ padding: '16px' }}>
                                <span style={{ background: '#e879f9', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>{form.size || '-'}</span>
                              </td>
                              <td style={{ padding: '16px' }}>
                                <span style={{ background: '#2dd4bf', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>{form.customer || '-'}</span>
                              </td>
                              <td style={{ padding: '16px' }}>
                                <span style={{ background: '#fb923c', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>{form.rollType || '-'}</span>
                              </td>
                              <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{form.dateNeeded || '-'}</td>
                              <td style={{ padding: '16px', textAlign: 'center' }}>
                                <button onClick={() => setViewFormVersion(form)} style={{ background: 'transparent', border: 'none', color: '#0ea5e9', cursor: 'pointer' }}>
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
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

            </div>
          )}

          {/* ── SECTION: MACHINES ── */}
          {activeSection === 'machines' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Top Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Machines</h2>
                <button 
                  onClick={() => setIsAddMachineOpen(true)}
                  style={{ 
                  background: '#0ea5e9',
                  color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', cursor: 'pointer'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  Add new machine
                </button>
              </div>

              {/* Table Container */}
              <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(0, 0, 0,0.05)', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {machinesList.length} result(s) found
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--surface-bg)', color: 'var(--text-primary)' }}>
                        <th style={{ padding: '16px 24px', fontWeight: 700 }}>Name</th>
                        <th style={{ padding: '16px 24px', fontWeight: 700 }}>Creation date</th>
                        <th style={{ padding: '16px 24px', fontWeight: 700 }}>Location</th>
                        <th style={{ padding: '16px 24px', fontWeight: 700, textAlign: 'center' }}>Status</th>
                        <th style={{ padding: '16px 24px', fontWeight: 700, textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {machinesList.map(machine => (
                        <tr key={machine.id} style={{ borderBottom: '1px solid rgba(0, 0, 0,0.05)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'var(--surface-bg)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-primary)' }}>{machine.name}</td>
                          <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{machine.creationDate}</td>
                          <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{machine.location}</td>
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
                  background: '#0ea5e9',
                  color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', cursor: 'pointer'
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
              <div className="glass-panel" style={{ width: '900px', maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '32px', background: 'var(--surface-bg)', animation: 'fadeIn 0.2s ease-out' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--primary)' }}>Add new machine</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button 
                      onClick={() => {
                        setIsAddMachineOpen(false);
                        setNotification({ message: 'Machine saved successfully', type: 'success' });
                      }} 
                      style={{ background: '#0ea5e9', color: 'var(--text-primary)', border: 'none', padding: '8px 24px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.4)', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                      Save
                    </button>
                    <button onClick={() => setIsAddMachineOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                    </button>
                  </div>
                </div>

                <div style={{ borderBottom: '1px solid rgba(0, 0, 0,0.1)', paddingBottom: '12px', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', margin: 0 }}>Machine info</h3>
                </div>

                {/* Row 1: Name */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: 600 }}>Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input type="text" value={newMachineForm.name} onChange={e => setNewMachineForm({...newMachineForm, name: e.target.value})} style={{ width: '100%', background: 'var(--surface-border)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px 14px', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }} />
                </div>

                {/* Row 2: Process, Setup time, Efficiency */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: 600 }}>Process <span style={{ color: '#ef4444' }}>*</span></label>
                    <select value={newMachineForm.process} onChange={e => setNewMachineForm({...newMachineForm, process: e.target.value})} style={{ width: '100%', background: 'var(--surface-border)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px 14px', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}>
                      <option value="Form" style={{ color: 'black' }}>Form</option>
                      <option value="Job" style={{ color: 'black' }}>Job</option>
                      <option value="Both" style={{ color: 'black' }}>Both</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: 600 }}>Setup time <span style={{ color: '#ef4444' }}>*</span></label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input type="number" value={newMachineForm.setupTime} onChange={e => setNewMachineForm({...newMachineForm, setupTime: e.target.value})} style={{ width: '100%', background: 'var(--surface-border)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px 14px', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }} />
                      <span style={{ fontSize: '0.8rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '6px 8px', borderRadius: '4px', fontWeight: 600 }}>Minutes</span>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: 600 }}>Efficiency <span style={{ color: '#ef4444' }}>*</span></label>
                    <input type="number" value={newMachineForm.efficiency} onChange={e => setNewMachineForm({...newMachineForm, efficiency: e.target.value})} style={{ width: '100%', background: 'var(--surface-border)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px 14px', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }} />
                  </div>
                </div>

                {/* Row 3: Type, Quantity, Speed */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: 600 }}>Type <span style={{ color: '#ef4444' }}>*</span></label>
                    <select value={newMachineForm.type} onChange={e => setNewMachineForm({...newMachineForm, type: e.target.value})} style={{ width: '100%', background: 'var(--surface-border)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px 14px', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}>
                      <option value="Printing" style={{ color: 'black' }}>Printing</option>
                      <option value="Sewing" style={{ color: 'black' }}>Sewing</option>
                      <option value="Cutting" style={{ color: 'black' }}>Cutting</option>
                      <option value="Coating" style={{ color: 'black' }}>Coating</option>
                      <option value="Other" style={{ color: 'black' }}>Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: 600 }}>Quantity</label>
                    <input type="number" value={newMachineForm.quantity} onChange={e => setNewMachineForm({...newMachineForm, quantity: e.target.value})} style={{ width: '100%', background: 'var(--surface-border)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px 14px', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: 600 }}>Speed (minutes/heure)</label>
                    <input type="text" value={newMachineForm.speed} onChange={e => setNewMachineForm({...newMachineForm, speed: e.target.value})} style={{ width: '100%', background: 'var(--surface-border)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px 14px', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }} />
                  </div>
                </div>

                {/* Row 4: Toggles */}
                <div style={{ display: 'flex', gap: '32px', marginBottom: '32px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <div style={{ width: '40px', height: '24px', background: newMachineForm.status ? '#10b981' : 'var(--surface-border-active)', borderRadius: '12px', position: 'relative', transition: 'background 0.3s' }}>
                      <div style={{ width: '18px', height: '18px', background: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: newMachineForm.status ? '19px' : '3px', transition: 'left 0.3s' }}></div>
                    </div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>Status</span>
                    <input type="checkbox" checked={newMachineForm.status} onChange={e => setNewMachineForm({...newMachineForm, status: e.target.checked})} style={{ display: 'none' }} />
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <div style={{ width: '40px', height: '24px', background: newMachineForm.border ? '#10b981' : 'var(--surface-border-active)', borderRadius: '12px', position: 'relative', transition: 'background 0.3s' }}>
                      <div style={{ width: '18px', height: '18px', background: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: newMachineForm.border ? '19px' : '3px', transition: 'left 0.3s' }}></div>
                    </div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>Border (on/off)</span>
                    <input type="checkbox" checked={newMachineForm.border} onChange={e => setNewMachineForm({...newMachineForm, border: e.target.checked})} style={{ display: 'none' }} />
                  </label>
                </div>

                {/* Standard Schedule */}
                <div style={{ borderBottom: '1px solid rgba(0, 0, 0,0.1)', paddingBottom: '12px', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', margin: 0 }}>Standard Schedule <span style={{ color: '#ef4444' }}>*</span></h3>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <div key={day} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '24px', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)' }}>{day}</div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary)', marginBottom: '6px', fontWeight: 600 }}>Select start time <span style={{ color: '#ef4444' }}>*</span></label>
                        <input type="time" value={(newMachineForm.schedule as any)[day].start} onChange={e => setNewMachineForm({...newMachineForm, schedule: {...newMachineForm.schedule, [day]: {...(newMachineForm.schedule as any)[day], start: e.target.value}}})} style={{ width: '100%', background: 'var(--surface-border)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px 14px', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary)', marginBottom: '6px', fontWeight: 600 }}>Select end time <span style={{ color: '#ef4444' }}>*</span></label>
                        <input type="time" value={(newMachineForm.schedule as any)[day].end} onChange={e => setNewMachineForm({...newMachineForm, schedule: {...newMachineForm.schedule, [day]: {...(newMachineForm.schedule as any)[day], end: e.target.value}}})} style={{ width: '100%', background: 'var(--surface-border)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px 14px', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Schedule Exception */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0, 0, 0,0.1)', paddingBottom: '12px', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', margin: 0 }}>Schedule exception</h3>
                  <button 
                    onClick={() => {
                      setNewMachineForm({...newMachineForm, exceptions: [...newMachineForm.exceptions, { startDate: '', endDate: '', start: '', end: '' }]});
                    }}
                    style={{ background: 'var(--primary)', color: 'var(--text-primary)', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Add new exception
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {newMachineForm.exceptions.map((exc, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--surface-border)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(0, 0, 0,0.1)' }}>
                      <div style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>{String(idx + 1).padStart(2, '0')}.</div>
                      <div style={{ flex: 1, display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary)', marginBottom: '6px', fontWeight: 600 }}>Start date <span style={{ color: '#ef4444' }}>*</span></label>
                          <input type="date" value={exc.startDate} onChange={e => {
                            const newExcs = [...newMachineForm.exceptions];
                            newExcs[idx].startDate = e.target.value;
                            setNewMachineForm({...newMachineForm, exceptions: newExcs});
                          }} style={{ width: '100%', background: 'var(--surface-bg)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '22px', color: 'var(--text-secondary)' }}>~</div>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary)', marginBottom: '6px', fontWeight: 600 }}>Expiration date</label>
                          <input type="date" value={exc.endDate} onChange={e => {
                            const newExcs = [...newMachineForm.exceptions];
                            newExcs[idx].endDate = e.target.value;
                            setNewMachineForm({...newMachineForm, exceptions: newExcs});
                          }} style={{ width: '100%', background: 'var(--surface-bg)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }} />
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary)', marginBottom: '6px', fontWeight: 600 }}>Select start time <span style={{ color: '#ef4444' }}>*</span></label>
                        <input type="time" value={exc.start} onChange={e => {
                          const newExcs = [...newMachineForm.exceptions];
                          newExcs[idx].start = e.target.value;
                          setNewMachineForm({...newMachineForm, exceptions: newExcs});
                        }} style={{ width: '100%', background: 'var(--surface-bg)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary)', marginBottom: '6px', fontWeight: 600 }}>Select end time <span style={{ color: '#ef4444' }}>*</span></label>
                        <input type="time" value={exc.end} onChange={e => {
                          const newExcs = [...newMachineForm.exceptions];
                          newExcs[idx].end = e.target.value;
                          setNewMachineForm({...newMachineForm, exceptions: newExcs});
                        }} style={{ width: '100%', background: 'var(--surface-bg)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }} />
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
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Edit Machine
                  <button onClick={() => setEditingMachine(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem', padding: '4px' }}>✕</button>
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Name</label>
                    <input type="text" value={editingMachine.name} onChange={e => setEditingMachine({...editingMachine, name: e.target.value})} style={{ width: '100%', background: 'var(--surface-border)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '12px', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.95rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Location</label>
                    <input type="text" value={editingMachine.location} onChange={e => setEditingMachine({...editingMachine, location: e.target.value})} style={{ width: '100%', background: 'var(--surface-border)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '12px', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.95rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Status</label>
                    <select value={editingMachine.status} onChange={e => setEditingMachine({...editingMachine, status: e.target.value})} style={{ width: '100%', background: 'var(--surface-border)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '12px', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                      <option value="ACTIVE" style={{ color: 'black' }}>ACTIVE</option>
                      <option value="MAINTENANCE" style={{ color: 'black' }}>MAINTENANCE</option>
                      <option value="OFFLINE" style={{ color: 'black' }}>OFFLINE</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                  <button onClick={() => setEditingMachine(null)} style={{ background: 'transparent', border: '1px solid rgba(0, 0, 0,0.2)', color: 'var(--text-primary)', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                  <button onClick={() => {
                    setMachinesList(prev => prev.map(m => m.id === editingMachine.id ? editingMachine : m));
                    setNotification({ message: `Machine ${editingMachine.name} updated successfully!`, type: 'success' });
                    setEditingMachine(null);
                  }} style={{ background: '#38bdf8', color: 'var(--text-primary)', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(56, 189, 248, 0.4)' }}>Save Changes</button>
                </div>
              </div>
            </div>
          )}
          {/* ── SECTION: rolls-in ── */}
          {activeSection === 'rolls-in' && <RollsInPage />}

          {/* ── SECTION: PACKAGING TABLE ── */}
      {activeSection === 'packaging' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Packaging</h2>
          </div>

          {/* Filters Section */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Filters</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              {[
                { label: 'Job-result ID', type: 'text', placeholder: 'Search' },
                { label: 'Job ID', type: 'text', placeholder: 'Search' },
                { label: 'Form Versions ID', type: 'text', placeholder: 'Search' },
                { label: 'Form ID', type: 'text', placeholder: 'Search' },
                { label: 'Design ID', type: 'text', placeholder: 'Search' },
                { label: 'Order item ID', type: 'text', placeholder: 'Search' },
                { label: 'Order ID', type: 'text', placeholder: 'Search' },
                { label: 'Roller Barcode', type: 'text', placeholder: 'Search' },
                { label: 'PO Number', type: 'text', placeholder: 'Search' },
                { label: 'Pallet', type: 'text', placeholder: 'Search' },
                { label: 'Machine', type: 'select', options: ['Search'] },
                { label: 'Status', type: 'select', options: ['Search'] }
              ].map(filter => (
                <div key={filter.label}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>{filter.label}</label>
                  {filter.type === 'text' || filter.type === 'dateRange' ? (
                    <input 
                      type="text" 
                      placeholder={filter.placeholder} 
                      style={{ width: '100%', background: 'var(--surface-bg)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px 14px', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem' }} 
                    />
                  ) : (
                    <select style={{ width: '100%', background: 'var(--surface-bg)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px 14px', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                      <option style={{color: 'black'}}>{filter.options?.[0]}</option>
                    </select>
                  )}
                </div>
              ))}
            </div>

            <button style={{ 
              background: 'transparent', color: '#0ea5e9', border: '1px solid #0ea5e9', 
              padding: '8px 16px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', width: 'fit-content' 
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              Reset filters
            </button>
          </div>

          <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ color: '#475569', fontWeight: 500 }}>{packagingResults.length} result(s) found</div>
              <div style={{ display: 'flex', gap: '12px' }}>
                
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569' }}>
                  <th style={{ padding: '16px', textAlign: 'center', width: '40px' }}><input type="checkbox" style={{ cursor: 'pointer' }} /></th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Job-result ID <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.5rem', lineHeight: 1 }}><span>▲</span><span>▼</span></div></div>
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Form ID</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Form versions IDS</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: 600 }}>Thumbnail</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Job ID</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Design ID</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Quality</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Size</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Quantity <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.5rem', lineHeight: 1 }}><span>▲</span><span>▼</span></div></div>
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Pallet</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Creation date <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.5rem', lineHeight: 1 }}><span>▲</span><span>▼</span></div></div>
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Date needed</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: 600 }}>Action</th>
                </tr>
              </thead>
              <tbody style={{ background: 'white' }}>
                {packagingResults.length === 0 ? (
                  <tr><td colSpan={15} style={{ padding: '32px', textAlign: 'center', color: '#cbd5e1' }}>Aucun résultat trouvé.</td></tr>
                ) : packagingResults.map((res: any, idx) => (
                  <tr key={res.id || idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        style={{ cursor: 'pointer' }} 
                        
                        />
                    </td>
                    <td style={{ padding: '16px', color: '#0ea5e9', fontWeight: 500 }}>{res.id}</td>
                    <td style={{ padding: '16px', color: '#ec4899', fontWeight: 500 }}><span style={{ border: '1px solid #fbcfe8', padding: '2px 8px', borderRadius: '4px', background: 'transparent' }}>{res.formId}</span></td>
                    <td style={{ padding: '16px', color: '#f59e0b', fontWeight: 500 }}><span style={{ border: '1px solid #fde68a', padding: '2px 8px', borderRadius: '4px', background: 'transparent' }}>{res.formVersionId}</span></td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {renderFormThumbnail({ id: res.formVersionId?.split('_')[0] || res.formId || '1' })}
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: '#6366f1', fontWeight: 500 }}><span style={{ border: '1px solid #c7d2fe', padding: '2px 8px', borderRadius: '4px', background: 'transparent' }}>{res.jobId}</span></td>
                    <td style={{ padding: '16px', color: '#f97316', fontWeight: 500 }}><span style={{ border: '1px solid #ffedd5', padding: '2px 8px', borderRadius: '4px', background: 'transparent' }}>{res.designId}</span></td>
                    <td style={{ padding: '16px', color: 'white', fontWeight: 500 }}><span style={{ background: '#d97706', padding: '4px 8px', borderRadius: '4px' }}>{res.quality}</span></td>
                    <td style={{ padding: '16px', color: '#475569' }}>{res.size}</td>
                    <td style={{ padding: '16px', color: '#475569' }}>{res.quantity}</td>
                    <td style={{ padding: '16px', color: '#ef4444' }}><span style={{ border: '1px solid #fecaca', padding: '2px 8px', borderRadius: '4px', background: 'transparent' }}>{res.pallet || 'null'}</span></td>
                    <td style={{ padding: '16px', color: '#475569' }}>{res.creationDate}</td>
                    <td style={{ padding: '16px', color: '#475569' }}>{res.dateNeeded}</td>
                    <td style={{ padding: '16px', color: '#475569' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}></span>
                        {res.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', color: '#0ea5e9', cursor: 'pointer' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
            
            {/* Pagination and Action Buttons */}
            <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                <button style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '4px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{'<'}</button>
                <button style={{ background: 'white', border: '1px solid #0ea5e9', color: '#0ea5e9', borderRadius: '4px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>1</button>
                <button style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '4px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{'>'}</button>
                <span style={{ marginLeft: '12px' }}>10 / page <span style={{ fontSize: '0.7rem' }}>▼</span></span>
              </div>

            </div>

          </div>
        </div>
      )}

      
          {/* ── SECTION: REPRINT TABLE ── */}
      {activeSection === 'reprint' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Reprint</h2>
          </div>

          {/* Filters Section */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Filters</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              {[
                { label: 'Job-result ID', type: 'text', placeholder: 'Search' },
                { label: 'Job ID', type: 'text', placeholder: 'Search' },
                { label: 'Form Versions ID', type: 'text', placeholder: 'Search' },
                { label: 'Form ID', type: 'text', placeholder: 'Search' },
                { label: 'Design ID', type: 'text', placeholder: 'Search' },
                { label: 'Order item ID', type: 'text', placeholder: 'Search' },
                { label: 'Order ID', type: 'text', placeholder: 'Search' },
                { label: 'Roller Barcode', type: 'text', placeholder: 'Search' },
                { label: 'PO Number', type: 'text', placeholder: 'Search' },
                { label: 'Pallet', type: 'text', placeholder: 'Search' },
                { label: 'Machine', type: 'select', options: ['Search'] },
                { label: 'Status', type: 'select', options: ['Search'] }
              ].map(filter => (
                <div key={filter.label}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>{filter.label}</label>
                  {filter.type === 'text' || filter.type === 'dateRange' ? (
                    <input 
                      type="text" 
                      placeholder={filter.placeholder} 
                      style={{ width: '100%', background: 'var(--surface-bg)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px 14px', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem' }} 
                    />
                  ) : (
                    <select style={{ width: '100%', background: 'var(--surface-bg)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px 14px', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                      <option style={{color: 'black'}}>{filter.options?.[0]}</option>
                    </select>
                  )}
                </div>
              ))}
            </div>

            <button style={{ 
              background: 'transparent', color: '#0ea5e9', border: '1px solid #0ea5e9', 
              padding: '8px 16px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', width: 'fit-content' 
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              Reset filters
            </button>
          </div>

          <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ color: '#475569', fontWeight: 500 }}>{reprintResults.length} result(s) found</div>
              <div style={{ display: 'flex', gap: '12px' }}>
                
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569' }}>
                  <th style={{ padding: '16px', textAlign: 'center', width: '40px' }}><input type="checkbox" style={{ cursor: 'pointer' }} /></th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Job-result ID <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.5rem', lineHeight: 1 }}><span>▲</span><span>▼</span></div></div>
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Form ID</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Form versions IDS</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: 600 }}>Thumbnail</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Job ID</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Design ID</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Quality</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Size</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Quantity <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.5rem', lineHeight: 1 }}><span>▲</span><span>▼</span></div></div>
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Pallet</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Creation date <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.5rem', lineHeight: 1 }}><span>▲</span><span>▼</span></div></div>
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Date needed</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: 600 }}>Action</th>
                </tr>
              </thead>
              <tbody style={{ background: 'white' }}>
                {reprintResults.length === 0 ? (
                  <tr><td colSpan={15} style={{ padding: '32px', textAlign: 'center', color: '#cbd5e1' }}>Aucun résultat trouvé.</td></tr>
                ) : reprintResults.map((res: any, idx) => (
                  <tr key={res.id || idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        style={{ cursor: 'pointer' }} 
                        
                        />
                    </td>
                    <td style={{ padding: '16px', color: '#0ea5e9', fontWeight: 500 }}>{res.id}</td>
                    <td style={{ padding: '16px', color: '#ec4899', fontWeight: 500 }}><span style={{ border: '1px solid #fbcfe8', padding: '2px 8px', borderRadius: '4px', background: 'transparent' }}>{res.formId}</span></td>
                    <td style={{ padding: '16px', color: '#f59e0b', fontWeight: 500 }}><span style={{ border: '1px solid #fde68a', padding: '2px 8px', borderRadius: '4px', background: 'transparent' }}>{res.formVersionId}</span></td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {renderFormThumbnail({ id: res.formVersionId?.split('_')[0] || res.formId || '1' })}
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: '#6366f1', fontWeight: 500 }}><span style={{ border: '1px solid #c7d2fe', padding: '2px 8px', borderRadius: '4px', background: 'transparent' }}>{res.jobId}</span></td>
                    <td style={{ padding: '16px', color: '#f97316', fontWeight: 500 }}><span style={{ border: '1px solid #ffedd5', padding: '2px 8px', borderRadius: '4px', background: 'transparent' }}>{res.designId}</span></td>
                    <td style={{ padding: '16px', color: 'white', fontWeight: 500 }}><span style={{ background: '#d97706', padding: '4px 8px', borderRadius: '4px' }}>{res.quality}</span></td>
                    <td style={{ padding: '16px', color: '#475569' }}>{res.size}</td>
                    <td style={{ padding: '16px', color: '#475569' }}>{res.quantity}</td>
                    <td style={{ padding: '16px', color: '#ef4444' }}><span style={{ border: '1px solid #fecaca', padding: '2px 8px', borderRadius: '4px', background: 'transparent' }}>{res.pallet || 'null'}</span></td>
                    <td style={{ padding: '16px', color: '#475569' }}>{res.creationDate}</td>
                    <td style={{ padding: '16px', color: '#475569' }}>{res.dateNeeded}</td>
                    <td style={{ padding: '16px', color: '#475569' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}></span>
                        {res.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', color: '#0ea5e9', cursor: 'pointer' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
            
            {/* Pagination and Action Buttons */}
            <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                <button style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '4px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{'<'}</button>
                <button style={{ background: 'white', border: '1px solid #0ea5e9', color: '#0ea5e9', borderRadius: '4px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>1</button>
                <button style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '4px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{'>'}</button>
                <span style={{ marginLeft: '12px' }}>10 / page <span style={{ fontSize: '0.7rem' }}>▼</span></span>
              </div>

            </div>

          </div>
        </div>
      )}

      
          
{/* ── SECTION: ERROR TABLE ── */}
      {activeSection === 'error' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Error</h2>
          </div>

          {/* Filters Section */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Filters</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              {[
                { label: 'Job-result ID', type: 'text', placeholder: 'Search' },
                { label: 'Job ID', type: 'text', placeholder: 'Search' },
                { label: 'Form Versions ID', type: 'text', placeholder: 'Search' },
                { label: 'Form ID', type: 'text', placeholder: 'Search' },
                { label: 'Design ID', type: 'text', placeholder: 'Search' },
                { label: 'Order item ID', type: 'text', placeholder: 'Search' },
                { label: 'Order ID', type: 'text', placeholder: 'Search' },
                { label: 'Roller Barcode', type: 'text', placeholder: 'Search' },
                { label: 'PO Number', type: 'text', placeholder: 'Search' },
                { label: 'Pallet', type: 'text', placeholder: 'Search' },
                { label: 'Machine', type: 'select', options: ['Search'] },
                { label: 'Status', type: 'select', options: ['Search'] }
              ].map(filter => (
                <div key={filter.label}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>{filter.label}</label>
                  {filter.type === 'text' || filter.type === 'dateRange' ? (
                    <input 
                      type="text" 
                      placeholder={filter.placeholder} 
                      style={{ width: '100%', background: 'var(--surface-bg)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px 14px', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem' }} 
                    />
                  ) : (
                    <select style={{ width: '100%', background: 'var(--surface-bg)', border: '1px solid rgba(0, 0, 0,0.1)', padding: '10px 14px', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                      <option style={{color: 'black'}}>{filter.options?.[0]}</option>
                    </select>
                  )}
                </div>
              ))}
            </div>

            <button style={{ 
              background: 'transparent', color: '#0ea5e9', border: '1px solid #0ea5e9', 
              padding: '8px 16px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', width: 'fit-content' 
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              Reset filters
            </button>
          </div>

          <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ color: '#475569', fontWeight: 500 }}>{errorResults.length} result(s) found</div>
              <div style={{ display: 'flex', gap: '12px' }}>
                
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569' }}>
                  <th style={{ padding: '16px', textAlign: 'center', width: '40px' }}><input type="checkbox" style={{ cursor: 'pointer' }} /></th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Job-result ID <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.5rem', lineHeight: 1 }}><span>▲</span><span>▼</span></div></div>
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Form ID</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Form versions IDS</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: 600 }}>Thumbnail</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Job ID</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Design ID</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Quality</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Size</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Quantity <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.5rem', lineHeight: 1 }}><span>▲</span><span>▼</span></div></div>
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Pallet</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Creation date <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.5rem', lineHeight: 1 }}><span>▲</span><span>▼</span></div></div>
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Date needed</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: 600 }}>Action</th>
                </tr>
              </thead>
              <tbody style={{ background: 'white' }}>
                {errorResults.length === 0 ? (
                  <tr><td colSpan={15} style={{ padding: '32px', textAlign: 'center', color: '#cbd5e1' }}>Aucun résultat trouvé.</td></tr>
                ) : errorResults.map((res: any, idx) => (
                  <tr key={res.id || idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        style={{ cursor: 'pointer' }} 
                        
                        />
                    </td>
                    <td style={{ padding: '16px', color: '#0ea5e9', fontWeight: 500 }}>{res.id}</td>
                    <td style={{ padding: '16px', color: '#ec4899', fontWeight: 500 }}><span style={{ border: '1px solid #fbcfe8', padding: '2px 8px', borderRadius: '4px', background: 'transparent' }}>{res.formId}</span></td>
                    <td style={{ padding: '16px', color: '#f59e0b', fontWeight: 500 }}><span style={{ border: '1px solid #fde68a', padding: '2px 8px', borderRadius: '4px', background: 'transparent' }}>{res.formVersionId}</span></td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {renderFormThumbnail({ id: res.formVersionId?.split('_')[0] || res.formId || '1' })}
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: '#6366f1', fontWeight: 500 }}><span style={{ border: '1px solid #c7d2fe', padding: '2px 8px', borderRadius: '4px', background: 'transparent' }}>{res.jobId}</span></td>
                    <td style={{ padding: '16px', color: '#f97316', fontWeight: 500 }}><span style={{ border: '1px solid #ffedd5', padding: '2px 8px', borderRadius: '4px', background: 'transparent' }}>{res.designId}</span></td>
                    <td style={{ padding: '16px', color: 'white', fontWeight: 500 }}><span style={{ background: '#d97706', padding: '4px 8px', borderRadius: '4px' }}>{res.quality}</span></td>
                    <td style={{ padding: '16px', color: '#475569' }}>{res.size}</td>
                    <td style={{ padding: '16px', color: '#475569' }}>{res.quantity}</td>
                    <td style={{ padding: '16px', color: '#ef4444' }}><span style={{ border: '1px solid #fecaca', padding: '2px 8px', borderRadius: '4px', background: 'transparent' }}>{res.pallet || 'null'}</span></td>
                    <td style={{ padding: '16px', color: '#475569' }}>{res.creationDate}</td>
                    <td style={{ padding: '16px', color: '#475569' }}>{res.dateNeeded}</td>
                    <td style={{ padding: '16px', color: '#475569' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}></span>
                        {res.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', color: '#0ea5e9', cursor: 'pointer' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
            
            {/* Pagination and Action Buttons */}
            <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                <button style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '4px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{'<'}</button>
                <button style={{ background: 'white', border: '1px solid #0ea5e9', color: '#0ea5e9', borderRadius: '4px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>1</button>
                <button style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '4px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{'>'}</button>
                <span style={{ marginLeft: '12px' }}>10 / page <span style={{ fontSize: '0.7rem' }}>▼</span></span>
              </div>

            </div>

          </div>
        </div>
      )}

      
          


        </div>
      </div>

              {/* View Form Version Modal */}
              {viewFormVersion && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="glass-panel" style={{ width: '900px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', background: 'var(--surface-bg)', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px', borderBottom: '1px solid var(--surface-border)' }}>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>View form version</h2>
                      <button onClick={() => setViewFormVersion(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                      </button>
                    </div>

                    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                      {/* Section: Form version */}
                      <div style={{ border: '1px solid var(--surface-border)', borderRadius: '8px', overflow: 'hidden' }}>
                        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-border)', borderBottom: '1px solid var(--surface-border)' }}>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Form version</h3>
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <button style={{ background: '#38bdf8', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                              Create Palette
                            </button>
                            <button 
                              onClick={() => {
                                // Remove from formVersionsList
                                setFormVersionsList(prev => {
                                  const next = prev.filter(f => f.id !== viewFormVersion.id);
                                  localStorage.setItem('mercury_formVersionsList', JSON.stringify(next));
                                  return next;
                                });
                                
                                // Restore to formsList
                                setFormsList(prev => {
                                  if (prev.find(f => f.id === viewFormVersion.id)) return prev;
                                  const { jobId, scheduledMachine, scheduledTime, scheduledDate, isNewlyPlanned, ...originalForm } = viewFormVersion;
                                  const next = [...prev, originalForm];
                                  localStorage.setItem('mercury_formsList', JSON.stringify(next));
                                  return next;
                                });
                                
                                // Remove from Jobs
                                setJobs(prev => {
                                  const updated = prev.filter(job => job.formVersionId !== viewFormVersion.id);
                                  localStorage.setItem('mercury_jobs', JSON.stringify(updated));
                                  return updated;
                                });
                                
                                setSelectedPlannedBlock(prev => {
                                  if (!prev) return null;
                                  const updatedForms = prev.forms.filter(f => f.id !== viewFormVersion.id);
                                  return updatedForms.length === 0 ? null : { ...prev, forms: updatedForms };
                                });
                                setViewFormVersion(null);
                              }}
                              style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 16px', borderRadius: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                              onMouseOver={(e) => { e.currentTarget.style.background = '#fef2f2'; }}
                              onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                              Delete
                            </button>

                            <button 
                              onClick={() => {
                                setJobs(prev => {
                                  const updated = prev.map(job => job.formVersionId === viewFormVersion.id ? { ...job, status: 'IN_PROGRESS' } : job);
                                  localStorage.setItem('mercury_jobs', JSON.stringify(updated));
                                  return updated;
                                });
                                setNotification({ message: 'Job status updated to IN_PROGRESS', type: 'success' });
                              }}
                              style={{ background: '#22c55e', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                              Start
                            </button>
                            <button 
                              onClick={() => {
                                setJobs(prev => {
                                  const updated = prev.map(job => job.formVersionId === viewFormVersion.id ? { ...job, status: 'DONE' } : job);
                                  localStorage.setItem('mercury_jobs', JSON.stringify(updated));
                                  return updated;
                                });
                                setNotification({ message: 'Job status updated to DONE', type: 'success' });
                              }}
                              style={{ background: '#f87171', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                              Stop
                            </button>
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--surface-border)' }}>
                          <div style={{ background: 'var(--surface-bg)', padding: '16px 24px' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Form ID</div>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{viewFormVersion.formId || viewFormVersion.id || '-'}</div>
                          </div>
                          <div style={{ background: 'var(--surface-bg)', padding: '16px 24px' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Quality</div>
                            <div><span style={{ background: '#d97706', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>{viewFormVersion.quality || '-'}</span></div>
                          </div>
                          <div style={{ background: 'var(--surface-bg)', padding: '16px 24px' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Repetition</div>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{viewFormVersion.repetition || '-'}</div>
                          </div>
                          <div style={{ background: 'var(--surface-bg)', padding: '16px 24px' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Creation date</div>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{viewFormVersion.printedDate || '-'}</div>
                          </div>
                          <div style={{ background: 'var(--surface-bg)', padding: '16px 24px' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Production start date</div>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{viewFormVersion.scheduledDate || '-'}</div>
                          </div>
                          <div style={{ background: 'var(--surface-bg)', padding: '16px 24px' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Expected end date</div>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{viewFormVersion.scheduledDate || '-'}</div>
                          </div>
                          <div style={{ background: 'var(--surface-bg)', padding: '16px 24px' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Dimensions (m)</div>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{viewFormVersion.dimension || '-'}</div>
                          </div>
                          <div style={{ background: 'var(--surface-bg)', padding: '16px 24px' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Date needed</div>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{viewFormVersion.dateNeeded || '-'}</div>
                          </div>
                        </div>
                      </div>

                      {/* Section: Jobs */}
                      <div style={{ border: '1px solid var(--surface-border)', borderRadius: '8px', overflow: 'hidden' }}>
                        <div style={{ padding: '16px 24px', background: 'var(--surface-border)', borderBottom: '1px solid var(--surface-border)' }}>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Jobs</h3>
                        </div>
                        <div style={{ padding: '24px', background: 'var(--surface-bg)' }}>
                          <div style={{ border: '1px solid var(--surface-border)', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
                            <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>Job: <span style={{ fontWeight: 700 }}>{viewFormVersion.jobId || '-'}</span></h4>
                            <div style={{ display: 'flex', gap: '24px' }}>
                              <div style={{ flexShrink: 0, display: 'flex', alignItems: 'flex-start' }}>
                                {renderFormThumbnail(viewFormVersion)}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                <div>Size: <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{viewFormVersion.size || '-'}</span></div>
                                <div>Quantity: <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{viewFormVersion.repetition || '-'}</span></div>
                                <div>Date needed: <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{viewFormVersion.dateNeeded || '-'}</span></div>
                                <div>Order item ID: <span style={{ fontWeight: 700, color: '#0ea5e9' }}>{viewFormVersion.jobId || '-'}</span></div>
                                <div>Order ID: <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{viewFormVersion.jobId || '-'}</span></div>
                                <div>Design ID: <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{viewFormVersion.formId || viewFormVersion.id || '-'}</span></div>
                                <div>Exact quantity : <span style={{ fontWeight: 700, color: '#ef4444' }}>Yes</span></div>
                                <div style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
                                  <button style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: '4px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                    Report error
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section: Steps */}
                      <div style={{ border: '1px solid var(--surface-border)', borderRadius: '8px', overflow: 'hidden' }}>
                        <div style={{ padding: '16px 24px', background: 'var(--surface-border)', borderBottom: '1px solid var(--surface-border)' }}>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Steps</h3>
                        </div>
                        <div style={{ padding: '24px 48px', background: 'var(--surface-bg)', display: 'flex', flexDirection: 'column' }}>
                          {(() => {
                            const job = jobs.find(j => j.formVersionId === viewFormVersion.id);
                            const statusLabel = job ? (job.status === 'IN_PROGRESS' ? 'In progress' : (job.status === 'DONE' ? 'Done' : 'Waiting for manufacturing')) : 'Waiting for manufacturing';
                            const statusStyles = statusLabel === 'In progress' ? { bg: '#dbeafe', color: '#2563eb', border: '#bfdbfe', dot: '#3b82f6' } :
                                                 statusLabel === 'Done' ? { bg: '#dcfce7', color: '#16a34a', border: '#bbf7d0', dot: '#22c55e' } :
                                                 { bg: '#fef3c7', color: '#d97706', border: '#fde68a', dot: '#f59e0b' };
                            return (
                              <div style={{ position: 'relative', paddingLeft: '24px', paddingBottom: '32px' }}>
                                <div style={{ position: 'absolute', left: '5px', top: '24px', bottom: 0, width: '2px', background: '#e2e8f0' }}></div>
                                <div style={{ position: 'absolute', left: 0, top: '5px', width: '12px', height: '12px', borderRadius: '50%', border: `2px solid ${statusStyles.dot}`, background: 'white', zIndex: 1 }}></div>
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Colaris</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                  {viewFormVersion.scheduledDate || '-'} {viewFormVersion.scheduledTime || '-'}
                                </div>
                                <span style={{ display: 'inline-block', background: statusStyles.bg, color: statusStyles.color, border: `1px solid ${statusStyles.border}`, padding: '4px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>{statusLabel}</span>
                              </div>
                            );
                          })()}

                          <div style={{ position: 'relative', paddingLeft: '24px' }}>
                            <div style={{ position: 'absolute', left: 0, top: '5px', width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #f59e0b', background: 'white', zIndex: 1 }}></div>
                            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Cutting</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                              {viewFormVersion.scheduledDate || '-'} {
                                viewFormVersion.scheduledTime ? 
                                `${String(Math.floor((parseInt(viewFormVersion.scheduledTime.split(':')[0])*60 + parseInt(viewFormVersion.scheduledTime.split(':')[1]) + 8) / 60)).padStart(2, '0')}:${String((parseInt(viewFormVersion.scheduledTime.split(':')[0])*60 + parseInt(viewFormVersion.scheduledTime.split(':')[1]) + 8) % 60).padStart(2, '0')}`
                                : '-'
                              }
                            </div>
                            <span style={{ display: 'inline-block', background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a', padding: '4px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>Waiting for manufacturing</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}
      {/* ── VIEW FORM MODAL ── */}
      {viewingForm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            background: '#ffffff', width: '100%', maxWidth: '900px', maxHeight: '90vh',
            borderRadius: '12px', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 24px', borderBottom: '1px solid #e5e7eb'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>View form</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <input
                  type="text"
                  placeholder="Repetition"
                  defaultValue={viewingForm.repetition}
                  style={{
                    padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', width: '120px'
                  }}
                />
                <button style={{
                  background: '#0ea5e9', color: 'white', border: 'none', padding: '8px 16px',
                  borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  Plan form version
                </button>
                <button
                  onClick={() => setViewingForm(null)}
                  style={{ background: 'transparent', border: 'none', fontSize: '1.25rem', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Form infos */}
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', fontSize: '1rem', fontWeight: 600, color: '#334155' }}>
                  Form infos
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: '#ffffff' }}>
                  <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb' }}>
                    <div style={{ width: '40%', padding: '12px 16px', color: '#64748b', fontSize: '0.85rem' }}>Form ID</div>
                    <div style={{ width: '60%', padding: '12px 16px', fontWeight: 700, color: '#0f172a', borderLeft: '1px solid #e5e7eb' }}>{viewingForm.formId}</div>
                  </div>
                  <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb' }}>
                    <div style={{ width: '40%', padding: '12px 16px', color: '#64748b', fontSize: '0.85rem' }}>Quality</div>
                    <div style={{ width: '60%', padding: '12px 16px', color: '#0f172a', borderLeft: '1px solid #e5e7eb' }}>{renderQualityBadge(viewingForm.quality)}</div>
                  </div>
                  <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
                    <div style={{ width: '40%', padding: '12px 16px', color: '#64748b', fontSize: '0.85rem' }}>Dimensions (m)</div>
                    <div style={{ width: '60%', padding: '12px 16px', fontWeight: 700, color: '#0f172a', borderLeft: '1px solid #e5e7eb' }}>{viewingForm.dimension}</div>
                  </div>
                  
                  <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb' }}>
                    <div style={{ width: '40%', padding: '12px 16px', color: '#64748b', fontSize: '0.85rem' }}>Printing time</div>
                    <div style={{ width: '60%', padding: '12px 16px', fontWeight: 700, color: '#0f172a', borderLeft: '1px solid #e5e7eb' }}>{viewingForm.printingTime}</div>
                  </div>
                  <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb' }}>
                    <div style={{ width: '40%', padding: '12px 16px', color: '#64748b', fontSize: '0.85rem' }}>Repetition</div>
                    <div style={{ width: '60%', padding: '12px 16px', fontWeight: 700, color: '#0f172a', borderLeft: '1px solid #e5e7eb' }}>{viewingForm.repetition}</div>
                  </div>
                  <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
                    <div style={{ width: '40%', padding: '12px 16px', color: '#64748b', fontSize: '0.85rem' }}>Customer</div>
                    <div style={{ width: '60%', padding: '12px 16px', color: '#0f172a', borderLeft: '1px solid #e5e7eb' }}>-</div>
                  </div>

                  <div style={{ display: 'flex', borderRight: '1px solid #e5e7eb' }}>
                    <div style={{ width: '40%', padding: '12px 16px', color: '#64748b', fontSize: '0.85rem' }}>Date needed</div>
                    <div style={{ width: '60%', padding: '12px 16px', color: '#0f172a', borderLeft: '1px solid #e5e7eb' }}>{viewingForm.dateNeeded}</div>
                  </div>
                  <div style={{ display: 'flex', borderRight: '1px solid #e5e7eb' }}>
                    <div style={{ width: '40%', padding: '12px 16px', color: '#64748b', fontSize: '0.85rem' }}>Delivery date</div>
                    <div style={{ width: '60%', padding: '12px 16px', color: '#0f172a', borderLeft: '1px solid #e5e7eb' }}>{viewingForm.deliveredDate}</div>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <div style={{ width: '40%', padding: '12px 16px', color: '#64748b', fontSize: '0.85rem' }}></div>
                    <div style={{ width: '60%', padding: '12px 16px', color: '#0f172a', borderLeft: '1px solid #e5e7eb' }}></div>
                  </div>
                </div>
              </div>

              {/* Order items */}
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', fontSize: '1rem', fontWeight: 600, color: '#334155' }}>
                  Order items
                </div>
                <div style={{ padding: '24px', background: '#fafafa' }}>
                  
                  {/* Single Mocked Order Item Card */}
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', width: 'fit-content', background: '#ffffff' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem', color: '#334155' }}>
                      Order item ID: 
                      <span style={{ padding: '4px 10px', background: '#f0f9ff', color: '#0ea5e9', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid #bae6fd' }}>
                        PYM_47685-2
                      </span>
                    </div>
                    <div style={{ padding: '20px', display: 'flex', gap: '24px' }}>
                      <div style={{ width: '160px', height: '220px', background: '#1e293b', borderRadius: '6px', color: '#94a3b8', padding: '12px', fontSize: '0.65rem' }}>
                        <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>⚪ Material</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span>Material:</span> <span>(undefined)</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}><span>Cutting mode:</span> <span>Standard</span></div>
                        <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>⚙️ Machining stops</div>
                        <div>☑ (none) - MediaBox</div>
                        <div>☑ (none) - PDF: CutContour</div>
                        <div>☑ (none) - PDF: regmark</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#475569' }}>
                        <div>Size: <strong style={{ color: '#0f172a' }}>{viewingForm.size}</strong></div>
                        <div>Quantity: <strong style={{ color: '#0f172a' }}>0</strong></div>
                        <div>Date needed: <strong style={{ color: '#0f172a' }}>{viewingForm.dateNeeded}</strong></div>
                        <div>Order ID:</div>
                        <div>Design ID:</div>
                        <div>Customer:</div>
                        <div>Exact quantity : <strong style={{ color: '#ef4444' }}>Yes</strong></div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Section: Steps */}
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', fontSize: '1rem', fontWeight: 600, color: '#334155' }}>
                  Steps
                </div>
                <div style={{ padding: '24px 48px', background: '#fafafa', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', paddingLeft: '24px', paddingBottom: '32px' }}>
                    <div style={{ position: 'absolute', left: '5px', top: '24px', bottom: 0, width: '2px', background: '#e2e8f0' }}></div>
                    <div style={{ position: 'absolute', left: 0, top: '5px', width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #f59e0b', background: 'white', zIndex: 1 }}></div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Colaris</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      {viewingForm.dateNeeded || '2026-06-19'} {viewingForm.scheduledTime || '07:00'}
                    </div>
                    <span style={{ display: 'inline-block', background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a', padding: '4px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>Waiting for manufacturing</span>
                  </div>
                  
                  <div style={{ position: 'relative', paddingLeft: '24px', paddingBottom: '32px' }}>
                    <div style={{ position: 'absolute', left: '5px', top: '24px', bottom: 0, width: '2px', background: '#e2e8f0' }}></div>
                    <div style={{ position: 'absolute', left: 0, top: '5px', width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #f59e0b', background: 'white', zIndex: 1 }}></div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Coating</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      {viewingForm.dateNeeded || '2026-06-19'} {
                        viewingForm.scheduledTime ? 
                        `${String(Math.floor((parseInt(viewingForm.scheduledTime.split(':')[0])*60 + parseInt(viewingForm.scheduledTime.split(':')[1]) + 8) / 60)).padStart(2, '0')}:${String((parseInt(viewingForm.scheduledTime.split(':')[0])*60 + parseInt(viewingForm.scheduledTime.split(':')[1]) + 8) % 60).padStart(2, '0')}`
                        : '07:08'
                      }
                    </div>
                    <span style={{ display: 'inline-block', background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a', padding: '4px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>Waiting for manufacturing</span>
                  </div>

                  <div style={{ position: 'relative', paddingLeft: '24px' }}>
                    <div style={{ position: 'absolute', left: 0, top: '5px', width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #f59e0b', background: 'white', zIndex: 1 }}></div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Cutting</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      {viewingForm.dateNeeded || '2026-06-19'} {
                        viewingForm.scheduledTime ? 
                        `${String(Math.floor((parseInt(viewingForm.scheduledTime.split(':')[0])*60 + parseInt(viewingForm.scheduledTime.split(':')[1]) + 8) / 60)).padStart(2, '0')}:${String((parseInt(viewingForm.scheduledTime.split(':')[0])*60 + parseInt(viewingForm.scheduledTime.split(':')[1]) + 8) % 60).padStart(2, '0')}`
                        : '07:08'
                      }
                    </div>
                    <span style={{ display: 'inline-block', background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a', padding: '4px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>Waiting for manufacturing</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ── CREATE ROLL OUT MODAL ── */}
      {isCreateRolloutModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#ffffff', width: '1000px', maxWidth: '95%', maxHeight: '90vh', borderRadius: '12px', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            
            {/* Header */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#334155' }}>Create Roll Out</h2>
              <button 
                onClick={() => {
                  setIsCreateRolloutModalOpen(false);
                  setSelectedFormIds([]);
                  setStagedRolloutForms([]);
                }} 
                style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', color: '#94a3b8', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              {/* Left Side: Selected form versions */}
              <div style={{ flex: 1, padding: '24px', borderRight: '1px solid #e5e7eb', overflowY: 'auto' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: '#334155' }}>Selected form versions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {formVersionsList.filter(f => selectedFormIds.includes(f.id)).map(form => (
                    <div key={form.id} style={{ display: 'flex', gap: '16px', border: '1px solid #e5e7eb', padding: '12px', borderRadius: '8px', alignItems: 'center' }}>
                      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', minWidth: '150px' }}>
                        {renderFormThumbnail(form)}
                      </div>
                      <div style={{ flex: 1, fontSize: '0.85rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div><span style={{ color: '#64748b', fontSize: '0.8rem' }}>ID:</span> <span style={{ color: '#0ea5e9', fontWeight: 600 }}>{form.formId}</span></div>
                        <div><span style={{ color: '#64748b', fontSize: '0.8rem' }}>Quality:</span> <span style={{ color: '#0ea5e9' }}>{form.quality}</span></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span><span style={{ color: '#64748b', fontSize: '0.8rem' }}>Repetition:</span> <span style={{ color: '#10b981', fontWeight: 600 }}>{stagedRolloutForms.filter(sf => sf.id === form.id).reduce((sum, sf) => sum + sf.rep, 0)}/{form.repetition}</span></span>
                          <input 
                            type="number" 
                            min="1"
                            value={rolloutRepetitions[form.id] === undefined ? 1 : rolloutRepetitions[form.id]}
                            onChange={(e) => setRolloutRepetitions({...rolloutRepetitions, [form.id]: e.target.value === '' ? '' : parseInt(e.target.value)})}
                            style={{ width: '60px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none' }}
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          const rep = rolloutRepetitions[form.id] || 1;
                          setStagedRolloutForms([...stagedRolloutForms, { ...form, rep, stagedId: Math.random().toString() }]);
                        }}
                        style={{ background: 'transparent', border: 'none', color: '#0ea5e9', cursor: 'pointer', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Roll Out */}
              <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', background: '#fafafa', overflowY: 'auto' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: '#334155' }}>Roll Out</h3>
                {stagedRolloutForms.length === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#cbd5e1' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    <span style={{ marginTop: '8px', fontWeight: 500 }}>No Data</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {stagedRolloutForms.map((stagedForm, i) => (
                      <div key={i} style={{ display: 'flex', gap: '16px', border: '1px solid #e5e7eb', padding: '12px', borderRadius: '8px', alignItems: 'center', background: 'white' }}>
                        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', minWidth: '150px' }}>
                          {renderFormThumbnail(stagedForm)}
                        </div>
                        <div style={{ flex: 1, fontSize: '0.85rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div><span style={{ color: '#64748b', fontSize: '0.8rem' }}>ID:</span> <span style={{ color: '#0ea5e9', fontWeight: 600 }}>{stagedForm.formId}</span></div>
                          <div><span style={{ color: '#64748b', fontSize: '0.8rem' }}>Repetition:</span> <span style={{ color: '#10b981', fontWeight: 600 }}>{stagedForm.rep}</span></div>
                        </div>
                        <button 
                          onClick={() => setStagedRolloutForms(stagedRolloutForms.filter(sf => sf.stagedId !== stagedForm.stagedId))}
                          style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px' }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
              <button 
                onClick={() => {
                  setIsCreateRolloutModalOpen(false);
                  setSelectedFormIds([]);
                  setStagedRolloutForms([]);
                }} 
                style={{ background: 'white', border: '1px solid #cbd5e1', color: '#475569', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Cancel
              </button>
              <button onClick={() => setStagedRolloutForms([])} style={{ background: '#ef4444', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                Delete all
              </button>
              <button 
                onClick={() => {
                  if (stagedRolloutForms.length === 0) {
                    setNotification({ message: 'Add at least one form to rollout', type: 'error' });
                    return;
                  }
                  
                  const rolloutId = 'RO_' + Math.floor(Math.random() * 9000000000000 + 1000000000000);
                  
                  // Save API call
                  fetch('http://localhost:8080/api/v1/rolls-out', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      rollsOutId: rolloutId,
                      formVersionIds: stagedRolloutForms.map(f => f.formId || f.id),
                      machineIds: ['Machine 1'],
                      repetitions: 1
                    })
                  }).catch(() => {});

                  // Save to local storage to show in RolloutPage
                  try {
                    const localRolls = JSON.parse(localStorage.getItem('mercury_rollsOuts') || '[]');
                    localRolls.push({
                      id: Math.random().toString(),
                      rollsOutId: rolloutId,
                      quality: stagedRolloutForms[0]?.quality || 'Viva',
                      formVersionIds: stagedRolloutForms.map(f => f.formId || f.id),
                      machineIds: ['Machine 1'],
                      repetitions: 1,
                      status: 'NEW'
                    });
                    localStorage.setItem('mercury_rollsOuts', JSON.stringify(localRolls));
                  } catch (e) {}
                  
                  // Generate PDF UI
                  const printWindow = window.open('', '', 'width=1000,height=800');
                  if (printWindow) {
                    const f = stagedRolloutForms[0];
                    const rollQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${rolloutId}`;
                    const qrData = `ID: ${f.formId}\nQuality: ${f.quality}\nRepetition: ${f.rep}\nWidth: ${f.width || 'N/A'}\nHeight: ${f.height || 'N/A'}`;
                    const formQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
                    
                    const imgMap: Record<string, string[]> = {
                      '1': ['/form1.jpg', '/form2.jpg'],
                      '2': ['/form2-layout.jpg', '/form2-unit.jpg'],
                      '3': ['/form3-layout.jpg', '/form3-unit.jpg'],
                      '4': ['/form4-layout.jpg', '/form4-unit.png'],
                      '5': ['/form5-layout.jpg', '/form5-unit.png'],
                      '6': ['/form6-layout.jpg', '/form6-unit.png'],
                      '7': ['/form7-layout.jpg', '/form7-unit.png'],
                      '8': ['/form8-layout.jpg', '/form8-unit.png'],
                      '9': ['/form9-layout.jpg', '/form9-unit1.png', '/form9-unit2.png']
                    };
                    const images = imgMap[f.id] || (f.thumbnail ? [f.thumbnail] : []);
                    const thumbnailHtml = `<div style="display: flex; gap: 8px;">${images.map(src => `<img src="${window.location.origin}${src}" style="max-width: 150px; max-height: 100px; object-fit: contain; border-radius: 4px; border: 1px solid rgba(0,0,0,0.1);" />`).join('')}</div>`;

                    printWindow.document.write(`
                      <html>
                        <head>
                          <title>Rollout ${rolloutId}</title>
                          <style>
                            @page { size: A4 landscape; margin: 0; }
                            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #f3f4f6; display: flex; justify-content: center; align-items: flex-start; height: 100vh; }
                            .page-container { width: 100%; max-width: 1122px; background: white; min-height: 793px; box-sizing: border-box; display: flex; flex-direction: column; }
                            
                            .header { background: #f59e0b; padding: 20px; display: flex; justify-content: center; gap: 30px; color: black; font-size: 24px; font-weight: 500; }
                            
                            .roll-info { display: flex; flex-direction: column; align-items: center; padding: 20px 0; border-bottom: 2px solid #e5e7eb; }
                            .roll-details { text-align: center; font-size: 14px; font-weight: 600; margin-bottom: 15px; }
                            .qr-section { display: flex; align-items: center; gap: 40px; }
                            
                            .form-section { padding: 40px; display: flex; justify-content: space-between; align-items: flex-start; }
                            
                            .form-details { font-size: 13px; font-weight: 600; line-height: 1.6; color: #1f2937; }
                            .form-details span { font-weight: 400; }
                            .customer { margin-top: 20px; }
                            
                            .job-box { border: 1px solid #d1d5db; width: 300px; margin-top: 30px; font-size: 11px; }
                            .job-box-header { padding: 5px 10px; border-bottom: 1px solid #d1d5db; font-weight: bold; background: #f9fafb; }
                            .job-box-body { display: flex; padding: 10px; gap: 15px; }
                            .job-box-img { width: 50px; height: 35px; background: #e11d48; display:flex; align-items:center; justify-content:center; }
                            .job-box-img img { max-height: 100%; max-width: 100%; }
                            .job-box-info { line-height: 1.4; }
                            .job-box-info b { color: #111827; }
                            
                          </style>
                        </head>
                        <body>
                          <div class="page-container">
                            
                            <!-- Top Banner -->
                            <div class="header">
                              <span>Cutting</span>
                              <span>${f.quality || 'Viva'}</span>
                              <span>Border</span>
                            </div>
                            
                            <!-- Roll Information -->
                            <div class="roll-info">
                              <div class="roll-details">
                                <div>Roll : ${rolloutId}</div>
                                <div>Dimension : 1.99 x 1.48m</div>
                              </div>
                              <div class="qr-section">
                                <img src="${rollQrCodeUrl}" width="150" height="150" alt="Roll QR" />
                                <div style="font-size: 48px; letter-spacing: 2px;">PYM</div>
                              </div>
                              <div style="font-size: 28px; font-weight: bold; letter-spacing: 2px; margin-top: 10px;">${rolloutId}</div>
                            </div>
                            
                            <!-- Form Details Section -->
                            <div class="form-section">
                              <div style="display:flex; flex-direction:column;">
                                <div class="form-details">
                                  <div>${f.formId}</div>
                                  <div>Repetition : <span>${f.rep}</span></div>
                                  <div>${f.quality || 'Viva'}</div>
                                  <div>Border</div>
                                  <div>Reprint : <span>No</span></div>
                                  <div>Date Needed : <span>01/07/2026</span></div>
                                  <div class="customer">Customer: Bannerstop GmbH</div>
                                </div>
                                
                                <div class="job-box">
                                  <div class="job-box-header">Job ID: PYM_60212-1-1</div>
                                  <div class="job-box-body">
                                    <div class="job-box-img">
                                      <img src="https://placehold.co/50x35?text=B" />
                                    </div>
                                    <div class="job-box-info">
                                      <div>Size: <b>197x143</b></div>
                                      <div>Ordered quantity: <b>1</b></div>
                                      <div>Quantity in Roll: <b>1</b></div>
                                      <div>Order ID: <b>60212</b></div>
                                      <div>Exact Quantity: <b>Yes</b></div>
                                      <div>Destination: <b>-</b></div>
                                      <div>Description: <b>${f.quality || 'Viva'}, 200 x 146 cm, Mit rand (2,5 cm)</b></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div style="margin-top: 20px;">
                                ${thumbnailHtml}
                              </div>
                              
                              <div style="display: flex; flex-direction: column; align-items: center;">
                                <img src="${formQrCodeUrl}" width="150" height="150" alt="Form QR" />
                                <div style="font-size: 18px; font-weight: bold; margin-top: 5px;">${f.formId}</div>
                              </div>
                            </div>

                          </div>
                          <script>
                            window.onload = function() { setTimeout(function() { window.print(); }, 500); }
                          </script>
                        </body>
                      </html>
                    `);
                    printWindow.document.close();
                  }

                  setNotification({ message: 'Rollout saved and PDF generated!', type: 'success' });
                  setIsCreateRolloutModalOpen(false);
                  setSelectedFormIds([]);
                  setStagedRolloutForms([]);
                }}
                style={{ background: '#0ea5e9', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Job-result Modal ── */}
      {addJobResultModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: '8px', width: '800px', maxWidth: '90vw', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>Add Job-result</h2>
              <button onClick={() => setAddJobResultModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Top Info Section */}
            <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
              {/* Left: Thumbnail */}
              <div style={{ width: '200px', height: '400px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                {(() => {
                  const matchedForm = formsList?.find((f: any) => f.formId === addJobResultModal.formId || f.id === addJobResultModal.formVersionId?.split('_')[0]) || { id: addJobResultModal.formVersionId?.split('_')[0] || addJobResultModal.formId || '1' };
                  if (matchedForm.thumbnail) {
                    return <img src={matchedForm.thumbnail} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '16px' }} />;
                  }
                  const id = matchedForm.id;
                  let imgSrc = `/form${id}-unit.png`;
                  if (id === '1') imgSrc = '/form1.jpg';
                  else if (['2', '3'].includes(id)) imgSrc = `/form${id}-unit.jpg`;
                  else if (id === '9') imgSrc = '/form9-unit1.png';
                  return <img src={imgSrc} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '16px' }} onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/200x400/1e293b/ffffff?text=Dart+Design'; }} />;
                })()}
              </div>
              {/* Right: Info */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
                <div><span style={{ color: '#64748b', display: 'inline-block', width: '120px' }}>Job ID:</span> <b>{addJobResultModal.jobId}</b></div>
                <div><span style={{ color: '#64748b', display: 'inline-block', width: '120px' }}>Size:</span> <b>92x243 cm</b></div>
                <div><span style={{ color: '#64748b', display: 'inline-block', width: '120px' }}>Order item ID:</span> <b style={{ color: '#0ea5e9' }}>{addJobResultModal.jobId?.replace('JOB', 'PCC')?.slice(0, -2) || 'PCC_59253-1'}</b></div>
                <div><span style={{ color: '#64748b', display: 'inline-block', width: '120px' }}>Date needed:</span> <b>{addJobResultModal.dateNeeded}</b></div>
                <div><span style={{ color: '#64748b', display: 'inline-block', width: '120px' }}>Order ID:</span> <b>{addJobResultModal.jobId?.split('-')[1] || addJobResultModal.jobId?.split('_')[1]?.split('-')[0] || '59253'}</b></div>
                <div><span style={{ color: '#64748b', display: 'inline-block', width: '120px' }}>Design ID:</span> <b>011308-1-1</b></div>
                <div><span style={{ color: '#64748b', display: 'inline-block', width: '120px' }}>Customer:</span> <b>ZWIBO B.V.</b></div>
              </div>
            </div>

            {/* Bottom Quantities */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', display: 'flex', marginBottom: '16px' }}>
              <div style={{ flex: 1, padding: '12px 16px', background: '#f8fafc', color: '#64748b', fontWeight: 500, borderRight: '1px solid #e2e8f0' }}>Job quantity</div>
              <div style={{ width: '100px', padding: '12px 16px', fontWeight: 'bold', textAlign: 'center', borderRight: '1px solid #e2e8f0', color: '#1e293b' }}>{addJobResultModal.quantity || 1}</div>
              <div style={{ flex: 1, padding: '12px 16px', background: '#f8fafc', color: '#64748b', fontWeight: 500, borderRight: '1px solid #e2e8f0' }}>Job-result quantity</div>
              <div style={{ width: '100px', padding: '12px 16px', fontWeight: 'bold', textAlign: 'center', color: '#1e293b' }}>0</div>
            </div>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ color: '#475569', fontWeight: 600 }}>New Job-result quantity <span style={{ color: '#ef4444' }}>*</span></div>
              <input 
                type="number" 
                value={newJobResultQuantity} 
                onChange={e => setNewJobResultQuantity(parseInt(e.target.value) || 0)}
                style={{ width: '80px', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => {
                  const newJobResult = {
                    id: `PCC_${addJobResultModal.jobId?.split('-')[1] || addJobResultModal.jobId?.split('_')[1]?.split('-')[0] || '59253'}-1-1-1`,
                    jobId: addJobResultModal.jobId,
                    formId: addJobResultModal.formId || '2000000206',
                    formVersionId: addJobResultModal.formVersionId || '2000000206_1',
                    designId: '011308-1-1',
                    quality: 'Impact Pro',
                    size: '92x243 cm',
                    quantity: `${newJobResultQuantity}/${addJobResultModal.quantity || 1}`,
                    pallet: null,
                    creationDate: new Date().toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                    dateNeeded: addJobResultModal.dateNeeded || '2026-06-19',
                    status: 'Done'
                  };
                  setJobResults(prev => [...prev, newJobResult]);
                  setNotification({ message: 'Job-result saved!', type: 'success' });
                  setAddJobResultModal(null);
              }} style={{ background: '#0ea5e9', color: 'white', border: 'none', padding: '8px 24px', borderRadius: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                Save
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── View Job Modal ── */}
      {viewJobModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: '8px', width: '1000px', maxWidth: '90vw', padding: '0', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            {/* Header */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '1.2rem', color: '#1e293b' }}>Job ID: <b>{viewJobModal.jobId}</b></div>
              <button onClick={() => setViewJobModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '1.1rem', color: '#64748b' }}>Job infos</div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => {
                    const updated = jobs.map(j => j.id === viewJobModal.id ? { ...j, status: 'IN_PROGRESS' } : j);
                    setJobs(updated);
                    localStorage.setItem('mercury_jobs', JSON.stringify(updated));
                    setViewJobModal({ ...viewJobModal, status: 'IN_PROGRESS' });
                    setNotification({ message: 'Job started!', type: 'success' });
                  }} style={{ background: '#4ade80', color: 'white', border: 'none', padding: '8px 24px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    Start
                  </button>
                  <button onClick={() => {
                    const updated = jobs.map(j => j.id === viewJobModal.id ? { ...j, status: 'DONE' } : j);
                    setJobs(updated);
                    localStorage.setItem('mercury_jobs', JSON.stringify(updated));
                    setViewJobModal({ ...viewJobModal, status: 'DONE' });
                    setNotification({ message: 'Job stopped!', type: 'success' });
                  }} style={{ background: '#fb7185', color: 'white', border: 'none', padding: '8px 24px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                    Stop
                  </button>
                </div>
              </div>

              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '16px', borderRight: '1px solid #e2e8f0', color: '#64748b' }}>Job ID</td>
                      <td style={{ padding: '16px', borderRight: '1px solid #e2e8f0', fontWeight: 'bold', color: '#1e293b' }}>{viewJobModal.jobId}</td>
                      <td style={{ padding: '16px', borderRight: '1px solid #e2e8f0', color: '#64748b' }}>Job quantity</td>
                      <td style={{ padding: '16px', borderRight: '1px solid #e2e8f0', fontWeight: 'bold', color: '#1e293b' }}>{viewJobModal.quantity || 1}</td>
                      <td style={{ padding: '16px', borderRight: '1px solid #e2e8f0', color: '#64748b' }}>Thumbnail</td>
                      <td style={{ padding: '16px' }} rowSpan={2}>
                        <div style={{ display: 'flex', justifyContent: 'center', background: '#1e293b', borderRadius: '4px', padding: '8px' }}>
                          {(() => {
                            const matchedForm = formsList?.find((f: any) => f.formId === viewJobModal.formId || f.id === viewJobModal.formVersionId?.split('_')[0]) || { id: viewJobModal.formVersionId?.split('_')[0] || viewJobModal.formId || '1' };
                            if (matchedForm.thumbnail) {
                              return <img src={matchedForm.thumbnail} alt="Thumbnail" style={{ maxHeight: '160px', borderRadius: '4px', objectFit: 'contain' }} />;
                            }
                            const id = matchedForm.id;
                            let imgSrc = `/form${id}-unit.png`;
                            if (id === '1') imgSrc = '/form1.jpg';
                            else if (['2', '3'].includes(id)) imgSrc = `/form${id}-unit.jpg`;
                            else if (id === '9') imgSrc = '/form9-unit1.png';
                            return <img src={imgSrc} alt="Thumbnail" style={{ maxHeight: '160px', borderRadius: '4px', objectFit: 'contain' }} onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/100x200/1e293b/ffffff?text=Dart'; }} />;
                          })()}
                        </div>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '16px', borderRight: '1px solid #e2e8f0', color: '#64748b' }}>Size</td>
                      <td style={{ padding: '16px', borderRight: '1px solid #e2e8f0', fontWeight: 'bold', color: '#1e293b' }}>92x243 cm</td>
                      <td style={{ padding: '16px', borderRight: '1px solid #e2e8f0', color: '#64748b' }}>Quality</td>
                      <td style={{ padding: '16px', borderRight: '1px solid #e2e8f0' }}>
                        <span style={{ background: '#d97706', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>Impact Pro</span>
                      </td>
                      <td style={{ padding: '16px', borderRight: '1px solid #e2e8f0', color: '#64748b' }}>Order item Quantity</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '16px', borderRight: '1px solid #e2e8f0', color: '#64748b' }}>Date needed</td>
                      <td style={{ padding: '16px', borderRight: '1px solid #e2e8f0', fontWeight: 'bold', color: '#1e293b' }}>{viewJobModal.dateNeeded}</td>
                      <td style={{ padding: '16px', borderRight: '1px solid #e2e8f0', color: '#64748b' }}>Order ID</td>
                      <td style={{ padding: '16px', borderRight: '1px solid #e2e8f0', fontWeight: 'bold', color: '#1e293b' }}>{viewJobModal.jobId?.split('-')[1] || viewJobModal.jobId?.split('_')[1]?.split('-')[0] || '59253'}</td>
                      <td style={{ padding: '16px', borderRight: '1px solid #e2e8f0', color: '#64748b' }}>Customer</td>
                      <td style={{ padding: '16px', fontWeight: 'bold', color: '#1e293b' }}>ZWIBO B.V.</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '16px', borderRight: '1px solid #e2e8f0', color: '#64748b' }}>Jobs error quantity</td>
                      <td style={{ padding: '16px', borderRight: '1px solid #e2e8f0', fontWeight: 'bold', color: '#1e293b' }}>{viewJobModal.jobsErrorQuantity || 0}</td>
                      <td style={{ padding: '16px', borderRight: '1px solid #e2e8f0', color: '#64748b' }}>Exact quantity</td>
                      <td style={{ padding: '16px', borderRight: '1px solid #e2e8f0', fontWeight: 'bold', color: '#ef4444' }}>Yes</td>
                      <td style={{ padding: '16px', borderRight: '1px solid #e2e8f0' }}></td>
                      <td style={{ padding: '16px' }}></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button style={{ background: 'white', color: '#ef4444', border: '1px solid #ef4444', padding: '8px 24px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  Report error
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
