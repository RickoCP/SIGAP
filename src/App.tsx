import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/layout/Navbar.tsx';
import { HeaderMetrics } from './components/layout/HeaderMetrics.tsx';
import { BMKGAlertBanner } from './components/alerts/BMKGAlertBanner.tsx';
import { InteractiveMap } from './components/map/InteractiveMap.tsx';
import { LeafletClusterMap } from './components/map/LeafletClusterMap.tsx';
import { NationalDisasterMap } from './components/map/NationalDisasterMap.tsx';
import { NationalVolunteerMap } from './components/map/NationalVolunteerMap.tsx';
import { RegionalReadinessView } from './components/analytics/RegionalReadinessView.tsx';
import { DisasterView } from './components/disasters/DisasterView.tsx';
import { CreateDisasterModal } from './components/disasters/CreateDisasterModal.tsx';
import { VolunteerDirectory } from './components/volunteers/VolunteerDirectory.tsx';
import { VolunteerProfileModal } from './components/volunteers/VolunteerProfileModal.tsx';
import { RegisterVolunteerModal } from './components/volunteers/RegisterVolunteerModal.tsx';
import { TaskManager } from './components/tasks/TaskManager.tsx';
import { CreateTaskModal } from './components/tasks/CreateTaskModal.tsx';
import { AIMatchingModal } from './components/ai/AIMatchingModal.tsx';
import { SitRepModal } from './components/ai/SitRepModal.tsx';
import { BroadcastModal } from './components/ai/BroadcastModal.tsx';
import { AnalyticsView } from './components/analytics/AnalyticsView.tsx';
import { GamificationView } from './components/volunteers/GamificationView.tsx';
import { GoogleMapsPlacesModal } from './components/map/GoogleMapsPlacesModal.tsx';
import { VolunteerPortal } from './components/volunteers/VolunteerPortal.tsx';
import { RoleAccessGateModal } from './components/auth/RoleAccessGateModal.tsx';
import { TacticalLiveTrackingPanel } from './components/map/TacticalLiveTrackingPanel.tsx';
import { ProjectPresentationView } from './components/presentation/ProjectPresentationView.tsx';
import { DocumentationView } from './components/docs/DocumentationView.tsx';
import { FieldTaskToastContainer } from './components/notifications/FieldTaskToastContainer.tsx';
import { PublicEarlyWarningView } from './components/earlywarning/PublicEarlyWarningView.tsx';
import { DisasterDonationsView } from './components/donations/DisasterDonationsView.tsx';
import { DonateModal } from './components/donations/DonateModal.tsx';
import { useRealtimeTracking } from './hooks/useRealtimeTracking.ts';
import { useAuth } from './context/AuthContext.tsx';
import { useFieldNotifications } from './context/FieldNotificationContext.tsx';
import { HardDrive, Heart, Siren } from 'lucide-react';
import { OfflineIndicator } from './components/pwa/OfflineIndicator.tsx';
import { OfflineMapCacheManagerModal } from './components/pwa/OfflineMapCacheManagerModal.tsx';
import { 
  saveCriticalDataToOfflineStorage, 
  getCriticalDataFromOfflineStorage,
  getOfflineCacheStats,
  OfflineCacheStats
} from './services/offlineCacheService.ts';

import {
  Disaster,
  Volunteer,
  Task,
  Assignment,
  BMKGAlert,
  BroadcastAlert
} from './types/index.ts';

import { useLanguage } from './context/LanguageContext.tsx';

// Pre-generated command center imagery
import commandCenterImg from './assets/images/sigap_command_center_1791810273600.jpg';
import volunteerTeamImg from './assets/images/volunteer_field_team_1791810284793.jpg';

export default function App() {
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const { isCoordinator, isVolunteer, effectiveRole } = useAuth();
  const { dispatchTaskToast } = useFieldNotifications();

  const [activeTab, setActiveTab] = useState<NavTab>('macro-map');
  const [useLeafletEngine, setUseLeafletEngine] = useState<boolean>(true);
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [bmkgAlerts, setBmkgAlerts] = useState<BMKGAlert[]>([]);
  const [selectedDisasterId, setSelectedDisasterId] = useState<string | null>(null);

  // Real-time volunteer field tracking simulation
  const {
    isTrackingActive,
    toggleTracking,
    isPaused,
    togglePause,
    simulationSpeed,
    setSimulationSpeed,
    telemetryList,
    selectedTrackedVolunteerId,
    setSelectedTrackedVolunteerId
  } = useRealtimeTracking(volunteers, tasks, selectedDisasterId);

  // Role Gatekeeper Modal state
  const [roleGateState, setRoleGateState] = useState<{
    isOpen: boolean;
    requiredRole: 'volunteer' | 'coordinator';
    featureTitle: string;
  }>({
    isOpen: false,
    requiredRole: 'coordinator',
    featureTitle: ''
  });

  // Modals state
  const [isCreateDisasterOpen, setIsCreateDisasterOpen] = useState(false);
  const [isRegisterVolunteerOpen, setIsRegisterVolunteerOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [selectedTaskForAIMatching, setSelectedTaskForAIMatching] = useState<Task | null>(null);
  const [isSitRepOpen, setIsSitRepOpen] = useState(false);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [isGoogleMapsModalOpen, setIsGoogleMapsModalOpen] = useState(false);
  const [selectedVolunteerForProfile, setSelectedVolunteerForProfile] = useState<Volunteer | null>(null);
  const [isOfflineManagerOpen, setIsOfflineManagerOpen] = useState(false);
  const [cachedTilesCount, setCachedTilesCount] = useState<number>(0);
  const [selectedDisasterForDonate, setSelectedDisasterForDonate] = useState<Disaster | null>(null);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const refreshCacheStats = async () => {
    try {
      const stats = await getOfflineCacheStats();
      setCachedTilesCount(stats.totalTilesCount);
    } catch (e) {
      console.warn('Failed to inspect offline cache stats:', e);
    }
  };

  // Fetch all initial data with offline persistence & zero-signal fallback
  const loadData = async () => {
    try {
      const [dRes, vRes, tRes, aRes, bRes] = await Promise.all([
        fetch('/api/disasters'),
        fetch('/api/volunteers'),
        fetch('/api/tasks'),
        fetch('/api/assignments'),
        fetch('/api/bmkg-alerts'),
      ]);

      const [dData, vData, tData, aData, bData] = await Promise.all([
        dRes.json(),
        vRes.json(),
        tRes.json(),
        aRes.json(),
        bRes.json(),
      ]);

      setDisasters(dData);
      setVolunteers(vData);
      setTasks(tData);
      setAssignments(aData);
      setBmkgAlerts(bData);

      // Persist snapshot to offline storage for zero-connectivity situations
      saveCriticalDataToOfflineStorage({
        disasters: dData,
        volunteers: vData,
        tasks: tData,
        assignments: aData,
      });

      if (dData.length > 0 && !selectedDisasterId) {
        setSelectedDisasterId(dData[0].id);
      }
    } catch (err) {
      console.warn('Network unavailable. Loading critical operational data from offline cache:', err);
      const offline = getCriticalDataFromOfflineStorage();
      if (offline) {
        if (offline.disasters?.length) setDisasters(offline.disasters);
        if (offline.volunteers?.length) setVolunteers(offline.volunteers);
        if (offline.tasks?.length) setTasks(offline.tasks);
        if (offline.assignments?.length) setAssignments(offline.assignments);
        if (offline.disasters?.length && !selectedDisasterId) {
          setSelectedDisasterId(offline.disasters[0].id);
        }
        showToast(isEn ? 'Offline Mode: Loaded incident command & responder data from local cache.' : 'Mode Offline: Memuat data posko & relawan dari penyimpanan lokal.');
      }
    }
  };

  useEffect(() => {
    loadData();
    refreshCacheStats();
  }, []);

  // Compute live stats
  const activeDisasters = disasters.filter(d => d.status !== 'resolved').length;
  const availableVolunteers = volunteers.filter(v => v.status === 'available').length;
  const busyVolunteers = volunteers.filter(v => v.status === 'busy').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress' || t.status === 'assigned').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const coverageRate = totalTasks > 0 ? Math.round(((totalTasks - pendingTasks) / totalTasks) * 100) : 0;

  const currentStats = {
    activeDisasters,
    availableVolunteers,
    busyVolunteers,
    totalVolunteers: volunteers.length,
    pendingTasks,
    inProgressTasks,
    completedTasks,
    totalTasks,
    coverageRate,
    avgResponseMinutes: 14.2,
  };

  // Reset demo data handler
  const handleResetDemo = async () => {
    if (confirm(t.confirmReset)) {
      try {
        const res = await fetch('/api/reset-data', { method: 'POST' });
        if (res.ok) {
          await loadData();
          showToast(t.toastResetSuccess);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Create disaster handler
  const handleCreateDisaster = async (newDisasterData: Omit<Disaster, 'id' | 'reportedAt'>) => {
    try {
      const res = await fetch('/api/disasters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDisasterData),
      });
      if (res.ok) {
        const created: Disaster = await res.json();
        setDisasters(prev => [created, ...prev]);
        setSelectedDisasterId(created.id);
        setActiveTab('disasters');
        showToast(language === 'id' 
          ? `Operasi darurat '${created.title}' berhasil diaktifkan!` 
          : `Emergency operation '${created.title}' activated!`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Register volunteer handler
  const handleRegisterVolunteer = async (newVolData: Omit<Volunteer, 'id' | 'activeTasksCount' | 'completedTasksCount' | 'joinedDate'>) => {
    try {
      const res = await fetch('/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVolData),
      });
      if (res.ok) {
        const created: Volunteer = await res.json();
        setVolunteers(prev => [created, ...prev]);
        showToast(language === 'id' 
          ? `Relawan '${created.name}' berhasil terdaftar dalam sistem SIGAP.` 
          : `Volunteer '${created.name}' registered in SIGAP system.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create task handler
  const handleCreateTask = async (newTaskData: Omit<Task, 'id' | 'createdAt' | 'volunteersAssigned' | 'status'>) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTaskData),
      });
      if (res.ok) {
        const created: Task = await res.json();
        setTasks(prev => [created, ...prev]);
        const disaster = disasters.find(d => d.id === created.disasterId);
        dispatchTaskToast(created, disaster, 'Pusdalops Komando');
        showToast(language === 'id' 
          ? `Tugas '${created.title}' berhasil diterbitkan ke lapangan.` 
          : `Field task '${created.title}' dispatched successfully.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Assign volunteer handler (called from AIMatchingModal or manual)
  const handleAssignVolunteer = async (
    taskId: string,
    volunteerId: string,
    score: number,
    reason: string
  ) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          volunteerId,
          disasterId: task.disasterId,
          matchScore: score,
          matchReason: reason,
        }),
      });

      if (res.ok) {
        const newAsg: Assignment = await res.json();
        setAssignments(prev => [...prev, newAsg]);

        // Update task volunteers count locally
        setTasks(prev =>
          prev.map(t =>
            t.id === taskId
              ? {
                  ...t,
                  volunteersAssigned: t.volunteersAssigned + 1,
                  status: t.status === 'pending' ? 'assigned' : t.status,
                }
              : t
          )
        );

        // Update volunteer status locally
        setVolunteers(prev =>
          prev.map(v =>
            v.id === volunteerId
              ? {
                  ...v,
                  status: 'busy',
                  activeTasksCount: v.activeTasksCount + 1,
                }
              : v
          )
        );

        const vol = volunteers.find(v => v.id === volunteerId);
        const disaster = disasters.find(d => d.id === task.disasterId);
        dispatchTaskToast(task, disaster, isEn ? `Assignment for ${vol?.name || 'Volunteer'}` : `Penugasan untuk ${vol?.name || 'Relawan'}`);
        showToast(isEn ? `Responder ${vol?.name || ''} successfully assigned to: ${task.title}` : `Relawan ${vol?.name || ''} berhasil ditugaskan ke: ${task.title}`);
      } else {
        const errData = await res.json();
        showToast(errData.error || (isEn ? 'Failed to assign volunteer' : 'Gagal menugaskan relawan'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update volunteer status
  const handleUpdateVolunteerStatus = async (volunteerId: string, status: Volunteer['status']) => {
    try {
      const res = await fetch(`/api/volunteers/${volunteerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setVolunteers(prev =>
          prev.map(v => (v.id === volunteerId ? { ...v, status } : v))
        );
        if (selectedVolunteerForProfile && selectedVolunteerForProfile.id === volunteerId) {
          setSelectedVolunteerForProfile(prev => prev ? { ...prev, status } : null);
        }
        showToast(isEn ? `Responder status updated to '${status}'.` : `Status relawan diperbarui menjadi '${status}'.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update task status
  const handleUpdateTaskStatus = async (taskId: string, status: Task['status']) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setTasks(prev =>
          prev.map(t => (t.id === taskId ? { ...t, status } : t))
        );
        showToast(isEn ? `Task status updated to '${status}'.` : `Status tugas diperbarui menjadi '${status}'.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update assignment status
  const handleUpdateAssignmentStatus = async (assignmentId: string, status: Assignment['status']) => {
    try {
      const res = await fetch(`/api/assignments/${assignmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setAssignments(prev =>
          prev.map(a => (a.id === assignmentId ? { ...a, status } : a))
        );
        showToast(isEn ? `Assignment status updated to '${status}'.` : `Status penugasan diperbarui menjadi '${status}'.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectedDisaster = disasters.find(d => d.id === selectedDisasterId) || disasters[0] || null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 1. Universal Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenCreateDisaster={() => {
          if (!isCoordinator) {
            setRoleGateState({
              isOpen: true,
              requiredRole: 'coordinator',
              featureTitle: language === 'id' ? 'Deklarasi Bencana Baru' : 'Declare New Disaster'
            });
            return;
          }
          setIsCreateDisasterOpen(true);
        }}
        onOpenRegisterVolunteer={() => setIsRegisterVolunteerOpen(true)}
        onResetDemo={handleResetDemo}
        onRequireRole={(role, title) => setRoleGateState({ isOpen: true, requiredRole: role, featureTitle: title })}
        onOpenOfflineManager={() => setIsOfflineManagerOpen(true)}
        cachedTilesCount={cachedTilesCount}
      />

      {/* 2. BMKG Early Warning Banner */}
      <BMKGAlertBanner
        alerts={bmkgAlerts}
        onSelectAlert={(a) => {
          setActiveTab('map');
          showToast(isEn ? `BMKG Alert: ${a.title}` : `Peringatan BMKG: ${a.title}`);
        }}
        onOpenEarlyWarningTab={() => setActiveTab('early-warning')}
      />

      {/* 3. High-Density Response Metrics Strip */}
      <HeaderMetrics stats={currentStats} />

      {/* 4. Main Application Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 0: Presentasi Proyek SIGAP Koordinator (Pitch Deck & Whitepaper) */}
        {activeTab === 'presentation' && (
          <ProjectPresentationView onNavigateToTab={setActiveTab} />
        )}

        {/* TAB BUKU PANDUAN: Dokumentasi Lengkap Cara Pakai Semua Fitur */}
        {activeTab === 'documentation' && (
          <DocumentationView onNavigateToTab={setActiveTab} />
        )}

        {/* TAB 1: Peta Besar Seluruh Bencana (National Macro Map) */}
        {activeTab === 'macro-map' && (
          <NationalDisasterMap
            disasters={disasters}
            onSelectDisaster={(id) => {
              setSelectedDisasterId(id);
              showToast(t.toastNationalSelected);
            }}
            onNavigateToTacticalMap={(id) => {
              setSelectedDisasterId(id);
              setActiveTab('map');
            }}
          />
        )}

        {/* TAB EARLY WARNING: Sistem Peringatan Dini Bencana untuk Masyarakat Umum */}
        {activeTab === 'early-warning' && (
          <PublicEarlyWarningView
            disasters={disasters}
            onNavigateToDonations={() => setActiveTab('donations')}
            onNavigateToMap={(lat, lng) => {
              setActiveTab('map');
            }}
          />
        )}

        {/* TAB DONATIONS: Pusat Donasi Kemanusiaan & Logistik Bencana */}
        {activeTab === 'donations' && (
          <DisasterDonationsView
            disasters={disasters}
            onSelectDisasterForMap={(id) => {
              setSelectedDisasterId(id);
              setActiveTab('map');
            }}
          />
        )}

        {/* TAB VOLUNTEER PORTAL: KTA Digital, Status Siaga, & Lapor Situasi */}
        {activeTab === 'volunteer-portal' && (
          <VolunteerPortal
            tasks={tasks}
            disasters={disasters}
            onOpenRegisterModal={() => setIsRegisterVolunteerOpen(true)}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onOpenRewardsTab={() => setActiveTab('rewards')}
            onNavigateToTacticalMap={() => setActiveTab('map')}
          />
        )}

        {/* TAB 2: Peta Lokasi Seluruh Relawan (National Volunteer Geospatial Map with Leaflet Clustering) */}
        {activeTab === 'volunteer-map' && (
          <NationalVolunteerMap
            volunteers={volunteers}
            disasters={disasters}
            onSelectVolunteer={(vol) => {
              setSelectedVolunteerForProfile(vol);
            }}
            onOpenBroadcastModal={(d) => {
              setSelectedDisasterId(d.id);
              setIsBroadcastOpen(true);
            }}
          />
        )}

        {/* TAB 3: Analisa Kesiapsiagaan Setiap Daerah Menghadapi Bencana (Semua Jenis Bencana) */}
        {activeTab === 'readiness' && (
          <RegionalReadinessView
            onNavigateToMacroMap={() => setActiveTab('macro-map')}
          />
        )}

        {/* TAB REWARDS: Sistem Gamifikasi Relawan & Penukaran Rewards */}
        {activeTab === 'rewards' && (
          <GamificationView
            volunteers={volunteers}
            onSelectVolunteer={(vol) => setSelectedVolunteerForProfile(vol)}
            onClaimReward={async (volunteerId, rewardId) => {
              try {
                const res = await fetch(`/api/volunteers/${volunteerId}/claim-reward`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ rewardId })
                });
                if (res.ok) {
                  const updated = await res.json();
                  setVolunteers(prev => prev.map(v => v.id === volunteerId ? updated : v));
                  setToastMessage(t.toastRewardClaimed);
                  setTimeout(() => setToastMessage(null), 4000);
                  return true;
                }
              } catch (err) {
                console.error(err);
              }
              return false;
            }}
          />
        )}

        {/* TAB 4: Peta Taktis Operasi Lapangan */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            {/* Real-time Field Volunteer Live Tracking Simulation Panel */}
            <TacticalLiveTrackingPanel
              isTrackingActive={isTrackingActive}
              onToggleTracking={toggleTracking}
              isPaused={isPaused}
              onTogglePause={togglePause}
              simulationSpeed={simulationSpeed}
              onChangeSpeed={setSimulationSpeed}
              telemetryList={telemetryList}
              selectedTrackedVolunteerId={selectedTrackedVolunteerId}
              onSelectTrackedVolunteer={setSelectedTrackedVolunteerId}
            />

            {/* Split Header with Visual Context & Tactical Command Map */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Tactical Map with Leaflet Marker Clustering */}
              <div className="lg:col-span-2 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-300">{t.tacticalMapTitle}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({tasks.filter(t => t.status !== 'completed').length} {t.openTasksCount})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsOfflineManagerOpen(true)}
                      title={isEn ? 'Download & Manage Offline Map Tiles for Field Operations' : 'Unduh & Kelola Tile Peta Offline untuk Operasi Lapangan'}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-750 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-semibold transition shadow-sm"
                    >
                      <HardDrive className="w-3 h-3 text-blue-400" />
                      <span>{language === 'id' ? 'Cache Peta Offline' : 'Offline Map Cache'}</span>
                      {cachedTilesCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[9px] font-bold">
                          {cachedTilesCount}
                        </span>
                      )}
                    </button>
                    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
                      <button
                        onClick={() => setUseLeafletEngine(true)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                          useLeafletEngine ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {t.clusterModeLeaflet}
                      </button>
                      <button
                        onClick={() => setUseLeafletEngine(false)}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                          !useLeafletEngine ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {t.clusterModeVector}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="h-[580px] relative isolate">
                  {useLeafletEngine ? (
                    <LeafletClusterMap
                      disasters={disasters}
                      volunteers={volunteers}
                      tasks={tasks}
                      assignments={assignments}
                      selectedDisasterId={selectedDisasterId}
                      onSelectDisaster={(id) => setSelectedDisasterId(id)}
                      onSelectVolunteer={(vol) => setSelectedVolunteerForProfile(vol)}
                      onOpenAIMatching={(task) => setSelectedTaskForAIMatching(task)}
                      heightClass="h-[580px]"
                      isTrackingActive={isTrackingActive}
                      telemetryList={telemetryList}
                      selectedTrackedVolunteerId={selectedTrackedVolunteerId}
                      onSelectTrackedVolunteer={setSelectedTrackedVolunteerId}
                    />
                  ) : (
                    <InteractiveMap
                      disasters={disasters}
                      volunteers={volunteers}
                      tasks={tasks}
                      assignments={assignments}
                      selectedDisasterId={selectedDisasterId}
                      onSelectDisaster={(id) => setSelectedDisasterId(id)}
                      onSelectVolunteer={(vol) => setSelectedVolunteerForProfile(vol)}
                      onOpenAIMatching={(task) => setSelectedTaskForAIMatching(task)}
                      isTrackingActive={isTrackingActive}
                      telemetryList={telemetryList}
                      selectedTrackedVolunteerId={selectedTrackedVolunteerId}
                      onSelectTrackedVolunteer={setSelectedTrackedVolunteerId}
                    />
                  )}
                </div>
              </div>

              {/* Right Column: Selected Crisis Command Deck */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
                <div>
                  <div className="relative rounded-xl overflow-hidden mb-3 border border-slate-800 h-28 bg-slate-950">
                    <img
                      src={commandCenterImg}
                      alt={isEn ? 'SIGAP Operations Command Center' : 'Pusdalops SIGAP'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-3 flex flex-col justify-end">
                      <span className="text-[10px] font-mono text-blue-300 uppercase tracking-wider">
                        {t.commandDeckSubtitle}
                      </span>
                      <h3 className="text-xs font-bold text-white line-clamp-1">
                        {t.commandDeckTitle}
                      </h3>
                    </div>
                  </div>

                  {selectedDisaster ? (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider block">
                            {t.activeCrisisFocus}
                          </span>
                          <h4 className="text-sm font-bold text-white line-clamp-1">
                            {selectedDisaster.title}
                          </h4>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800/80 font-mono uppercase">
                          {selectedDisaster.severity}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                        {selectedDisaster.description}
                      </p>

                      <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs font-mono tabular-nums">
                        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">{language === 'id' ? 'Terdampak' : 'Affected'}</span>
                          <span className="text-sm font-bold text-white">
                            {selectedDisaster.affectedPeople.toLocaleString(language === 'id' ? 'id-ID' : 'en-US')} {language === 'id' ? 'jiwa' : 'people'}
                          </span>
                        </div>
                        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">{language === 'id' ? 'Posko Pengungsi' : 'Evacuation Shelters'}</span>
                          <span className="text-sm font-bold text-blue-400">
                            {selectedDisaster.evacuationCenterCount} {t.evacuationPosko}
                          </span>
                        </div>
                      </div>

                      {/* Quick Tasks List preview */}
                      <div className="pt-2 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-medium">{t.openTasksPreview}:</span>
                          <span className="text-blue-400 font-mono text-[11px]">
                            {tasks.filter(t => t.disasterId === selectedDisaster.id && t.status !== 'completed').length} {t.openTasksCount}
                          </span>
                        </div>
                        <div className="space-y-1 max-h-36 overflow-y-auto">
                          {tasks
                            .filter(t => t.disasterId === selectedDisaster.id && t.status !== 'completed')
                            .slice(0, 3)
                            .map(taskItem => (
                              <div
                                key={taskItem.id}
                                onClick={() => setSelectedTaskForAIMatching(taskItem)}
                                className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 hover:border-blue-500/60 transition-colors cursor-pointer flex items-center justify-between text-xs"
                              >
                                <span className="font-medium text-white truncate max-w-[170px]">
                                  {taskItem.title}
                                </span>
                                <span className="text-[10px] text-blue-400 font-mono shrink-0">
                                  {t.btnMatchAI}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400">
                      {language === 'id' ? 'Pilih titik bencana pada peta.' : 'Select a crisis location on the map.'}
                    </div>
                  )}
                </div>

                {/* Command actions */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <button
                    onClick={() => {
                      if (!isCoordinator) {
                        setRoleGateState({
                          isOpen: true,
                          requiredRole: 'coordinator',
                          featureTitle: isEn ? 'AI SitRep Situational Analysis' : 'Analisis Situasi SitRep AI'
                        });
                        return;
                      }
                      setIsSitRepOpen(true);
                    }}
                    className="w-full py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 flex items-center justify-center gap-1.5"
                  >
                    {t.btnSitRep}
                  </button>
                  <button
                    onClick={() => {
                      if (!isCoordinator) {
                        setRoleGateState({
                          isOpen: true,
                          requiredRole: 'coordinator',
                          featureTitle: isEn ? 'Emergency Mass WhatsApp Broadcast' : 'Siaran Darurat WhatsApp Massal'
                        });
                        return;
                      }
                      setIsBroadcastOpen(true);
                    }}
                    className="w-full py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-blue-600/30"
                  >
                    {t.btnBroadcast}
                  </button>

                  {/* Donate for this active disaster */}
                  <button
                    onClick={() => {
                      setSelectedDisasterForDonate(selectedDisaster);
                      setIsDonateModalOpen(true);
                    }}
                    className="w-full py-2 text-xs font-semibold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-pink-600/30"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span>{language === 'id' ? 'Salurkan Donasi Bencana Ini' : 'Donate for this Disaster'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Section: Operations List Quick Jump */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {language === 'id' ? 'Status Penanganan Bencana Lapangan' : 'Active Disaster Operations Status'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {language === 'id' 
                      ? 'Beralih antar posko untuk koordinasi alokasi tim SAR, medis, dan dapur umum' 
                      : 'Switch between command posts to coordinate SAR teams, medics, and field kitchens'}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('disasters')}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  {language === 'id' ? 'Lihat Selengkapnya di Operasi Bencana →' : 'View Full Disaster Operations →'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {disasters.map(d => {
                  const assignedCount = assignments.filter(a => a.disasterId === d.id).length;
                  const isSelected = d.id === selectedDisasterId;

                  return (
                    <div
                      key={d.id}
                      onClick={() => setSelectedDisasterId(d.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-slate-950 border-blue-500 shadow-md'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-mono text-slate-400 uppercase text-[10px]">{d.type}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800/80 font-mono">
                          {d.severity.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{d.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{d.address}</p>
                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono tabular-nums text-slate-400">
                        <span>{d.affectedPeople.toLocaleString(language === 'id' ? 'id-ID' : 'en-US')} {language === 'id' ? 'jiwa' : 'people'}</span>
                        <span className="text-blue-400 font-semibold">{assignedCount} {language === 'id' ? 'relawan' : 'volunteers'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'disasters' && (
          <DisasterView
            disasters={disasters}
            selectedDisasterId={selectedDisasterId}
            tasks={tasks}
            assignments={assignments}
            volunteers={volunteers}
            onSelectDisaster={(id) => setSelectedDisasterId(id)}
            onOpenCreateTask={(disasterId) => setIsCreateTaskOpen(true)}
            onOpenAIMatching={(task) => setSelectedTaskForAIMatching(task)}
            onOpenSitRep={() => setIsSitRepOpen(true)}
            onOpenBroadcast={() => setIsBroadcastOpen(true)}
            onOpenGoogleMaps={() => setIsGoogleMapsModalOpen(true)}
            onUpdateTaskStatus={handleUpdateTaskStatus}
          />
        )}

        {activeTab === 'volunteers' && (
          <VolunteerDirectory
            volunteers={volunteers}
            selectedDisaster={selectedDisaster}
            onSelectVolunteer={(vol) => setSelectedVolunteerForProfile(vol)}
            onOpenRegisterModal={() => setIsRegisterVolunteerOpen(true)}
            onUpdateStatus={handleUpdateVolunteerStatus}
            onNavigateToRewards={() => setActiveTab('rewards')}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskManager
            tasks={tasks}
            disasters={disasters}
            assignments={assignments}
            volunteers={volunteers}
            onOpenCreateTask={() => setIsCreateTaskOpen(true)}
            onOpenAIMatching={(task) => setSelectedTaskForAIMatching(task)}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onUpdateAssignmentStatus={handleUpdateAssignmentStatus}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            disasters={disasters}
            volunteers={volunteers}
            tasks={tasks}
            assignments={assignments}
          />
        )}
      </main>

      {/* Real-time Field Task Dispatch Toast Notifications for Responders */}
      <FieldTaskToastContainer
        onNavigateToMap={(lat, lng, disasterId) => {
          setActiveTab('map');
          if (disasterId) {
            setSelectedDisasterId(disasterId);
          }
        }}
        onNavigateToVolunteerPortal={() => {
          setActiveTab('volunteer-portal');
        }}
      />

      {/* General Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[70] bg-blue-600 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-blue-400/40 animate-fade-in flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Modals */}
      {isCreateDisasterOpen && (
        <CreateDisasterModal
          onClose={() => setIsCreateDisasterOpen(false)}
          onCreate={handleCreateDisaster}
        />
      )}

      {isRegisterVolunteerOpen && (
        <RegisterVolunteerModal
          onClose={() => setIsRegisterVolunteerOpen(false)}
          onRegister={handleRegisterVolunteer}
        />
      )}

      {isCreateTaskOpen && (
        <CreateTaskModal
          disasters={disasters}
          defaultDisasterId={selectedDisasterId || undefined}
          onClose={() => setIsCreateTaskOpen(false)}
          onCreate={handleCreateTask}
        />
      )}

      {selectedTaskForAIMatching && selectedDisaster && (
        <AIMatchingModal
          disaster={selectedDisaster}
          task={selectedTaskForAIMatching}
          onAssignVolunteer={handleAssignVolunteer}
          onClose={() => setSelectedTaskForAIMatching(null)}
        />
      )}

      {isSitRepOpen && selectedDisaster && (
        <SitRepModal
          disaster={selectedDisaster}
          onClose={() => setIsSitRepOpen(false)}
        />
      )}

      {isBroadcastOpen && selectedDisaster && (
        <BroadcastModal
          disaster={selectedDisaster}
          volunteerCountInRadius={
            volunteers.filter(v => v.status !== 'offline').length
          }
          onSendBroadcast={(bc) => {
            showToast(isEn ? `Emergency broadcast to ${bc.recipientCount} responders sent via ${bc.channel.toUpperCase()}` : `Siaran darurat ke ${bc.recipientCount} relawan terkirim via ${bc.channel.toUpperCase()}`);
          }}
          onClose={() => setIsBroadcastOpen(false)}
        />
      )}

      {selectedVolunteerForProfile && (
        <VolunteerProfileModal
          volunteer={selectedVolunteerForProfile}
          selectedDisaster={selectedDisaster}
          assignments={assignments}
          tasks={tasks}
          onClose={() => setSelectedVolunteerForProfile(null)}
          onUpdateStatus={handleUpdateVolunteerStatus}
        />
      )}

      {isGoogleMapsModalOpen && selectedDisaster && (
        <GoogleMapsPlacesModal
          disaster={selectedDisaster}
          onClose={() => setIsGoogleMapsModalOpen(false)}
        />
      )}

      {/* Role Access Gatekeeper Modal */}
      <RoleAccessGateModal
        isOpen={roleGateState.isOpen}
        requiredRole={roleGateState.requiredRole}
        featureTitle={roleGateState.featureTitle}
        onClose={() => setRoleGateState(prev => ({ ...prev, isOpen: false }))}
        onOpenRegisterVolunteer={() => {
          setRoleGateState(prev => ({ ...prev, isOpen: false }));
          setIsRegisterVolunteerOpen(true);
        }}
      />

      {/* Offline Connectivity Notification Banner */}
      <OfflineIndicator
        cachedTilesCount={cachedTilesCount}
        onOpenCacheManager={() => setIsOfflineManagerOpen(true)}
      />

      {/* Offline Map Tiles & Data Cache Manager Modal */}
      <OfflineMapCacheManagerModal
        isOpen={isOfflineManagerOpen}
        onClose={() => setIsOfflineManagerOpen(false)}
        disasters={disasters}
        selectedDisasterId={selectedDisasterId}
        onSelectDisaster={(id) => {
          setSelectedDisasterId(id);
          setActiveTab('map');
        }}
        onRefreshCacheStats={(stats) => {
          setCachedTilesCount(stats.totalTilesCount);
        }}
      />

      {/* Global Disaster Relief Donation Modal */}
      {isDonateModalOpen && (
        <DonateModal
          disasters={disasters}
          selectedDisaster={selectedDisasterForDonate}
          onClose={() => {
            setIsDonateModalOpen(false);
            setSelectedDisasterForDonate(null);
          }}
          onDonationSuccess={(donation) => {
            showToast(isEn ? `Thank you! Donation of Rp ${donation.amount.toLocaleString('en-US')} transferred successfully.` : `Terima kasih! Donasi sebesar Rp ${donation.amount.toLocaleString('id-ID')} berhasil disalurkan.`);
            // Update local disaster funds
            setDisasters(prev => prev.map(d => {
              if (d.id === donation.disasterId) {
                return {
                  ...d,
                  donationCollectedIdr: (d.donationCollectedIdr || 100000000) + donation.amount,
                  donorsCount: (d.donorsCount || 300) + 1
                };
              }
              return d;
            }));
          }}
        />
      )}
    </div>
  );
}
