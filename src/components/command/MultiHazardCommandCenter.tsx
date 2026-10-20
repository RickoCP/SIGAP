import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Activity, 
  CloudRain, 
  ShieldAlert, 
  RefreshCw, 
  Radio, 
  CheckCircle, 
  ExternalLink, 
  Send, 
  Users, 
  FileText, 
  Compass, 
  Building2, 
  School, 
  Crosshair, 
  Copy, 
  Check, 
  Share2, 
  ArrowRight, 
  ChevronRight, 
  Waves, 
  Mountain, 
  Eye, 
  Radar, 
  MapPin, 
  Map as MapIcon,
  Siren,
  Volume2,
  AlertTriangle,
  BellRing
} from 'lucide-react';
import { 
  MultiHazardIncident, 
  SourceHealth, 
  NormalizedHazardType, 
  AIRecommendation, 
  SituationReport, 
  BroadcastAlert 
} from '../../types/index.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { IncidentLocationMap } from './IncidentLocationMap.tsx';
import { earlyWarningService } from '../../services/earlyWarningService.ts';

interface MultiHazardCommandCenterProps {
  onNavigateToDisaster?: (disasterId: string) => void;
  onNavigateToVolunteers?: () => void;
  onNavigateToEarlyWarning?: () => void;
}

export const MultiHazardCommandCenter: React.FC<MultiHazardCommandCenterProps> = ({
  onNavigateToDisaster,
  onNavigateToVolunteers,
  onNavigateToEarlyWarning
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [sourcesHealth, setSourcesHealth] = useState<SourceHealth[]>([]);
  const [incidents, setIncidents] = useState<MultiHazardIncident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<MultiHazardIncident | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [filterHazard, setFilterHazard] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Pipeline Action states
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [isMatching, setIsMatching] = useState(false);
  const [matchedVolunteers, setMatchedVolunteers] = useState<AIRecommendation[]>([]);
  const [isGeneratingSitRep, setIsGeneratingSitRep] = useState(false);
  const [sitRepData, setSitRepData] = useState<SituationReport | null>(null);
  const [isGeneratingBroadcast, setIsGeneratingBroadcast] = useState(false);
  const [broadcastData, setBroadcastData] = useState<BroadcastAlert | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Community Early Warning & Evacuation Activation State
  const [isTogglingEarlyWarning, setIsTogglingEarlyWarning] = useState<boolean>(false);
  const [earlyWarningNotification, setEarlyWarningNotification] = useState<{ type: 'success' | 'info'; message: string } | null>(null);

  // Fetch sources health & incidents
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [healthRes, incidentsRes] = await Promise.all([
        fetch('/api/hazard/sources/health'),
        fetch('/api/hazard/incidents')
      ]);

      if (healthRes.ok) {
        const hData = await healthRes.json();
        setSourcesHealth(hData);
      }
      if (incidentsRes.ok) {
        const iData: MultiHazardIncident[] = await incidentsRes.json();
        setIncidents(iData);
        if (iData.length > 0 && !selectedIncident) {
          setSelectedIncident(iData[0]);
          setActiveStep(iData[0].responseWorkflow?.currentStep || 1);
        }
      }
    } catch (err) {
      console.error('Failed to load multi-hazard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Auto-refresh health every 45s
    const interval = setInterval(loadData, 45000);
    return () => clearInterval(interval);
  }, []);

  // Update selected incident state when changing incident
  const handleSelectIncident = (inc: MultiHazardIncident) => {
    setSelectedIncident(inc);
    setActiveStep(inc.responseWorkflow?.currentStep || 1);
    setMatchedVolunteers([]);
    setSitRepData(inc.responseWorkflow?.sitRep || null);
    setBroadcastData(inc.responseWorkflow?.broadcast || null);
    setEarlyWarningNotification(null);
  };

  // Sync sources manually
  const handleSyncAll = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch('/api/hazard/sync', { method: 'POST' });
      if (res.ok) {
        await loadData();
        window.dispatchEvent(new CustomEvent('sigap:hazard-updated'));
      }
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Step 4: AI Volunteer Matching
  const handleRunVolunteerMatch = async () => {
    if (!selectedIncident) return;
    try {
      setIsMatching(true);
      const res = await fetch(`/api/hazard/incidents/${selectedIncident.id}/match-volunteers`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setMatchedVolunteers(data.recommendations || []);
        setActiveStep(4);
        window.dispatchEvent(new CustomEvent('sigap:hazard-updated'));
      }
    } catch (err) {
      console.error('Match failed:', err);
    } finally {
      setIsMatching(false);
    }
  };

  // Step 5: Generate SitRep
  const handleGenerateSitRep = async () => {
    if (!selectedIncident) return;
    try {
      setIsGeneratingSitRep(true);
      const res = await fetch(`/api/hazard/incidents/${selectedIncident.id}/generate-sitrep`, {
        method: 'POST'
      });
      if (res.ok) {
        const data: SituationReport = await res.json();
        setSitRepData(data);
        setActiveStep(5);
        window.dispatchEvent(new CustomEvent('sigap:hazard-updated'));
      }
    } catch (err) {
      console.error('SitRep failed:', err);
    } finally {
      setIsGeneratingSitRep(false);
    }
  };

  // Step 6: Generate Broadcast
  const handleGenerateBroadcast = async () => {
    if (!selectedIncident) return;
    try {
      setIsGeneratingBroadcast(true);
      const res = await fetch(`/api/hazard/incidents/${selectedIncident.id}/generate-broadcast`, {
        method: 'POST'
      });
      if (res.ok) {
        const data: BroadcastAlert = await res.json();
        setBroadcastData(data);
        setActiveStep(6);
        window.dispatchEvent(new CustomEvent('sigap:hazard-updated'));
      }
    } catch (err) {
      console.error('Broadcast failed:', err);
    } finally {
      setIsGeneratingBroadcast(false);
    }
  };

  // Community Early Warning & Evacuation System Handlers
  const handleActivateCommunityEarlyWarning = async () => {
    if (!selectedIncident) return;
    try {
      setIsTogglingEarlyWarning(true);
      const res = await fetch(`/api/hazard/incidents/${selectedIncident.id}/activate-early-warning`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.alert) {
          earlyWarningService.addOrUpdateAlert(data.alert);
        }
        const updated = data.incident || {
          ...selectedIncident,
          responseWorkflow: {
            ...selectedIncident.responseWorkflow,
            isCommunityEarlyWarningActive: true,
            earlyWarningId: data.alert?.id,
            communityEarlyWarningActivatedAt: new Date().toISOString()
          }
        };
        setSelectedIncident(updated);
        setIncidents(prev => prev.map(inc => inc.id === updated.id ? updated : inc));
        setEarlyWarningNotification({
          type: 'success',
          message: isEn 
            ? 'Community Early Warning & Evacuation System ACTIVATED! Danger sirens and safe shelter routing are now live for exposed citizens.' 
            : 'Sistem Peringatan Dini & Evakuasi Warga Komunitas BERHASIL DIAKTIFKAN! Alarm sirine bahaya dan perimeter evakuasi kini aktif untuk warga.'
        });
        window.dispatchEvent(new CustomEvent('sigap:hazard-updated'));
      }
    } catch (err) {
      console.error('Failed to activate community early warning:', err);
    } finally {
      setIsTogglingEarlyWarning(false);
    }
  };

  const handleDeactivateCommunityEarlyWarning = async () => {
    if (!selectedIncident) return;
    try {
      setIsTogglingEarlyWarning(true);
      const res = await fetch(`/api/hazard/incidents/${selectedIncident.id}/deactivate-early-warning`, {
        method: 'POST'
      });
      if (res.ok) {
        const alertId = selectedIncident.responseWorkflow?.earlyWarningId || `ew-${selectedIncident.id}`;
        earlyWarningService.removeAlert(alertId);

        const updated = {
          ...selectedIncident,
          responseWorkflow: {
            ...selectedIncident.responseWorkflow,
            isCommunityEarlyWarningActive: false
          }
        };
        setSelectedIncident(updated);
        setIncidents(prev => prev.map(inc => inc.id === updated.id ? updated : inc));
        setEarlyWarningNotification({
          type: 'info',
          message: isEn 
            ? 'Community Early Warning has been deactivated and restored to normal standby.' 
            : 'Peringatan Dini Warga telah dinonaktifkan (status siaga publik dicabut).'
        });
        window.dispatchEvent(new CustomEvent('sigap:hazard-updated'));
      }
    } catch (err) {
      console.error('Failed to deactivate community early warning:', err);
    } finally {
      setIsTogglingEarlyWarning(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // Filtered incidents
  const filteredIncidents = incidents.filter(inc => {
    if (filterHazard !== 'all' && inc.hazardType !== filterHazard) return false;
    if (filterPriority !== 'all' && inc.priority !== filterPriority) return false;
    return true;
  });

  const getHazardBadge = (type: NormalizedHazardType) => {
    switch (type) {
      case 'WILDFIRE':
        return {
          icon: <Flame className="w-3.5 h-3.5 text-amber-400" />,
          label: isEn ? 'Wildfire / Hotspot' : 'Karhutla / Hotspot',
          bg: 'bg-amber-950/70 border-amber-800 text-amber-300'
        };
      case 'EARTHQUAKE':
        return {
          icon: <Activity className="w-3.5 h-3.5 text-rose-400" />,
          label: isEn ? 'Earthquake' : 'Gempabumi',
          bg: 'bg-rose-950/70 border-rose-800 text-rose-300'
        };
      case 'TSUNAMI':
        return {
          icon: <Waves className="w-3.5 h-3.5 text-cyan-400" />,
          label: isEn ? 'Tsunami Warning' : 'Potensi Tsunami',
          bg: 'bg-cyan-950/70 border-cyan-800 text-cyan-300'
        };
      case 'VOLCANO':
        return {
          icon: <Mountain className="w-3.5 h-3.5 text-orange-400" />,
          label: isEn ? 'Volcanic Activity' : 'Erupsi Gunung Api',
          bg: 'bg-orange-950/70 border-orange-800 text-orange-300'
        };
      case 'FLOOD':
      case 'FLASH_FLOOD':
        return {
          icon: <CloudRain className="w-3.5 h-3.5 text-blue-400" />,
          label: isEn ? 'Flood / Inundation' : 'Banjir Luapan',
          bg: 'bg-blue-950/70 border-blue-800 text-blue-300'
        };
      default:
        return {
          icon: <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />,
          label: type,
          bg: 'bg-slate-900 border-slate-700 text-slate-300'
        };
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* =========================================================================
          SECTION 1: COMMAND CENTER HEADER & SOURCE ADAPTER HEALTH TELEMETRY
         ========================================================================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-600/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-950/80 border border-red-700/60 text-red-300">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                {isEn ? 'LIVE MULTI-HAZARD COMMAND' : 'KOMANDO MULTI-HAZARD SIAGA AKTIF'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {isEn ? 'BNPB, BMKG, NASA & PVMBG Feeds' : 'Sinkronisasi Resmi BNPB, BMKG, NASA & PVMBG'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Radar className="w-7 h-7 text-red-400 animate-spin-slow" />
              {isEn ? 'AI-Powered Disaster Command Center' : 'Pusat Komando Bencana AI Multi-Hazard'}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              {isEn 
                ? 'Automated end-to-end pipeline: Detect Threat → Identify Affected Area → Calculate Exposure → Score Risk & Priority → AI Volunteer Matching → Situation Report (SitRep) → Emergency Broadcast.'
                : 'Pipeline terpadu otomatis: Deteksi Ancaman → Identifikasi Area Terdampak → Hitung Exposure Warga → Tentukan Skor Risiko & Prioritas → Pencocokan AI Relawan → Susun SitRep → Siaran Darurat.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleSyncAll}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/25 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? (isEn ? 'Syncing Feeds...' : 'Sinkronisasi...') : (isEn ? 'Sync All Radar Sources' : 'Sinkronkan Semua Sumber')}</span>
            </button>
          </div>
        </div>

        {/* 6 Source Adapter Badges */}
        <div className="mt-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>{isEn ? 'Provider-Agnostic Source Health Status' : 'Status Kesehatan Integrasi Sumber Data Bencana'}</span>
            <span className="text-[11px] text-slate-500 font-normal">
              {isEn ? 'Isolated Architecture (Fault-Tolerant)' : 'Arsitektur Terisolasi & Toleran Kegagalan'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {sourcesHealth.map((src) => {
              const isOnline = src.status === 'ONLINE';
              return (
                <div 
                  key={src.source}
                  className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                    isOnline 
                      ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700' 
                      : 'bg-red-950/20 border-red-900/40 text-red-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-mono text-[10px] font-bold text-slate-300 truncate">
                      {src.source.replace('_', ' ')}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                  </div>
                  <div className="text-[11px] font-medium text-slate-200 line-clamp-1" title={isEn ? src.nameEn : src.name}>
                    {isEn ? src.nameEn : src.name}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-400">
                    <span>{src.recordsCount} {isEn ? 'pts' : 'titik'}</span>
                    <span className="font-mono text-emerald-400">{src.latencyMs}ms</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: OPERATIONAL SUMMARY COUNTERS
         ========================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">{isEn ? 'Active Hazard Incidents' : 'Total Insiden Bencana Aktif'}</div>
          <div className="text-2xl font-bold text-white mt-1 flex items-baseline gap-2">
            <span>{incidents.length}</span>
            <span className="text-xs text-rose-400 font-normal">
              {incidents.filter(i => i.priority === 'P1_CRITICAL').length} {isEn ? 'Critical P1' : 'Kritis P1'}
            </span>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">{isEn ? 'Estimated Population Exposure' : 'Estimasi Populasi Terdampak'}</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {incidents.reduce((acc, i) => acc + (i.exposure?.estimatedPopulation || 0), 0).toLocaleString('id-ID')}
            <span className="text-xs text-slate-400 ml-1.5 font-normal">{isEn ? 'people' : 'jiwa'}</span>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">{isEn ? 'Critical Health & Shelter Facilities' : 'Fasilitas Medis & Pengungsian'}</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {incidents.reduce((acc, i) => acc + (i.exposure?.facilities?.length || 0), 0)}
            <span className="text-xs text-slate-400 ml-1.5 font-normal">{isEn ? 'facilities' : 'fasilitas InaRISK'}</span>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">{isEn ? 'Active Disaster Observatories' : 'Sensor Radar Telemetri Terhubung'}</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">
            {sourcesHealth.filter(s => s.status === 'ONLINE').length} / {sourcesHealth.length}
            <span className="text-xs text-slate-400 ml-1.5 font-normal">{isEn ? 'online' : 'aktif'}</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: MAIN DUAL-PANEL WORKSPACE (INCIDENTS LIST & END-TO-END STEPPER)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Filter & Incident Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>{isEn ? 'Active Incidents' : 'Daftar Insiden Terverifikasi'}</span>
              </h2>
              <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                {filteredIncidents.length}
              </span>
            </div>

            {/* Filter Pills */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {['all', 'WILDFIRE', 'EARTHQUAKE', 'VOLCANO', 'FLOOD'].map((h) => (
                  <button
                    key={h}
                    onClick={() => setFilterHazard(h)}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                      filterHazard === h 
                        ? 'bg-blue-600 text-white font-semibold' 
                        : 'bg-slate-800/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    {h === 'all' ? (isEn ? 'All Hazards' : 'Semua Bahaya') : h}
                  </button>
                ))}
              </div>
            </div>

            {/* Incident Cards */}
            <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
              {isLoading ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-400" />
                  {isEn ? 'Loading synthesized incidents...' : 'Memuat data insiden multi-hazard...'}
                </div>
              ) : filteredIncidents.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  {isEn ? 'No incidents matching filters' : 'Tidak ada insiden yang cocok'}
                </div>
              ) : (
                filteredIncidents.map((inc) => {
                  const isSelected = selectedIncident?.id === inc.id;
                  const badge = getHazardBadge(inc.hazardType);
                  const isCritical = inc.priority === 'P1_CRITICAL';

                  return (
                    <div
                      key={inc.id}
                      onClick={() => handleSelectIncident(inc)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${badge.bg}`}>
                          {badge.icon}
                          {badge.label}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {inc.responseWorkflow?.isCommunityEarlyWarningActive && (
                            <span className="flex items-center gap-1 text-[9px] font-bold text-rose-300 bg-rose-950/90 px-1.5 py-0.5 rounded border border-rose-700 animate-pulse">
                              <Siren className="w-2.5 h-2.5 text-rose-400" />
                              <span>{isEn ? 'Warning Active' : 'Sirine Aktif'}</span>
                            </span>
                          )}
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isCritical ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {inc.priority.replace('_', ' ')}
                          </span>
                          <span className="text-xs font-mono font-bold text-white bg-slate-800 px-1.5 py-0.5 rounded">
                            {inc.riskScore}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
                        {isEn && inc.titleEn ? inc.titleEn : inc.title}
                      </h3>

                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-1 line-clamp-1">
                        <Compass className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{inc.affectedArea.administrativeArea} ({inc.affectedArea.province})</span>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                        <span>{inc.exposure.estimatedPopulation.toLocaleString('id-ID')} {isEn ? 'exposed' : 'jiwa terpapar'}</span>
                        <span className="text-blue-400 font-medium flex items-center gap-0.5">
                          {isEn ? 'Step' : 'Tahap'} {inc.responseWorkflow?.currentStep || 1}/6
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive End-to-End Stepper & Action Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedIncident ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl">
              {/* Incident Header & Risk Gauge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      ID: {selectedIncident.id}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      selectedIncident.priority === 'P1_CRITICAL' 
                        ? 'bg-red-500/20 text-red-300 border border-red-500/50 animate-pulse' 
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                    }`}>
                      {selectedIncident.priority.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400">
                      {isEn ? 'Radius' : 'Radius Bahaya'}: {selectedIncident.affectedArea.radiusKm} km
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {isEn && selectedIncident.titleEn ? selectedIncident.titleEn : selectedIncident.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => setActiveStep(2)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeStep === 2 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400' 
                        : 'bg-slate-950/80 border border-slate-800 text-cyan-300 hover:bg-slate-800 hover:text-white'
                    }`}
                    title={isEn ? 'View Incident Location Map & Danger Geofence' : 'Lihat Peta Lokasi Kejadian & Geofence Bahaya'}
                  >
                    <Compass className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isEn ? 'Incident Map' : 'Peta Lokasi Kejadian'}</span>
                  </button>

                  <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-xl">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">
                        {isEn ? 'Composite Risk Score' : 'Skor Risiko Komposit'}
                      </div>
                      <div className="text-2xl font-black text-rose-400 font-mono">
                        {selectedIncident.riskScore}<span className="text-xs text-slate-500">/100</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full border-4 border-rose-500 flex items-center justify-center text-xs font-bold text-white">
                      {selectedIncident.riskScore}%
                    </div>
                  </div>
                </div>
              </div>

              {/* The 6-Step Command Center Workflow Stepper */}
              <div className="py-4 border-b border-slate-800">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                  {isEn ? 'Command Center 6-Step Pipeline' : 'Tahapan Alur Komando Tanggap Darurat'}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {[
                    { step: 1, label: isEn ? '1. Detect' : '1. Deteksi' },
                    { step: 2, label: isEn ? '2. Area' : '2. Area' },
                    { step: 3, label: isEn ? '3. Exposure' : '3. Exposure' },
                    { step: 4, label: isEn ? '4. Matching' : '4. Relawan' },
                    { step: 5, label: isEn ? '5. SitRep' : '5. SitRep' },
                    { step: 6, label: isEn ? '6. Broadcast' : '6. Siaran' }
                  ].map((s) => {
                    const isActive = activeStep === s.step;
                    const isCompleted = activeStep > s.step;
                    return (
                      <button
                        key={s.step}
                        onClick={() => setActiveStep(s.step as any)}
                        className={`px-2.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400'
                            : isCompleted
                            ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                            : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {isCompleted && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                        <span>{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP CONTENT CONTAINER */}
              <div className="mt-5 space-y-4">
                {/* ----------------- STEP 1: DETECT THREAT ----------------- */}
                {activeStep === 1 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Radar className="w-4 h-4 text-blue-400" />
                        <span>{isEn ? 'Step 1: Threat Detection & Telemetry' : 'Langkah 1: Deteksi Ancaman & Data Telemetri'}</span>
                      </h3>
                      <button
                        onClick={() => setActiveStep(2)}
                        className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                      >
                        <span>{isEn ? 'Next: Identify Area' : 'Lanjut: Identifikasi Area'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="font-semibold text-slate-300 uppercase text-[11px] tracking-wider">
                          {isEn ? 'Source Observations' : 'Observasi Telemetri Masuk'}
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between py-1 border-b border-slate-900">
                            <span className="text-slate-400">{isEn ? 'Hazard Category' : 'Kategori Bahaya'}:</span>
                            <span className="font-bold text-white">{selectedIncident.hazardType}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-900">
                            <span className="text-slate-400">{isEn ? 'Observations Count' : 'Jumlah Titik Observasi'}:</span>
                            <span className="font-bold text-white">{selectedIncident.observationCount}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-900">
                            <span className="text-slate-400">{isEn ? 'Detection Timestamp' : 'Waktu Deteksi'}:</span>
                            <span className="font-mono text-slate-300">{new Date(selectedIncident.createdAt).toLocaleString(isEn ? 'en-US' : 'id-ID')}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-400">{isEn ? 'Status' : 'Status Kejadian'}:</span>
                            <span className="font-bold text-emerald-400 uppercase">{selectedIncident.status}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="font-semibold text-slate-300 uppercase text-[11px] tracking-wider">
                          {isEn ? 'Specific Sensor Telemetry' : 'Parameter Spesifik Sensor'}
                        </div>
                        {selectedIncident.observations.map((obs, idx) => (
                          <div key={idx} className="space-y-1 text-slate-300">
                            <div className="text-[11px] text-blue-400 font-bold">{obs.source} ({obs.externalId})</div>
                            {obs.details.magnitude && (
                              <div>Magnitude: <strong className="text-rose-400 font-mono">M{obs.details.magnitude}</strong> (Kedalaman: {obs.details.depthKm} km)</div>
                            )}
                            {obs.details.frp && (
                              <div>Fire Radiative Power (FRP): <strong className="text-amber-400 font-mono">{obs.details.frp} MW</strong> (Satelit: {obs.details.satellite})</div>
                            )}
                            {obs.details.activityLevel && (
                              <div>Tingkat Aktivitas Vulkanik: <strong className="text-orange-400">{obs.details.activityLevel}</strong></div>
                            )}
                            {obs.details.capEvent && (
                              <div>CAP Warning: <strong className="text-blue-300">{obs.details.capEvent}</strong></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Spatial Map Callout */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/60 to-slate-950 border border-blue-800/50 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                          <Compass className="w-5 h-5 animate-spin-slow" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>{isEn ? 'Incident Location Geocoded' : 'Lokasi Kejadian Terpetakan Spasial'}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-950 text-red-300 border border-red-800/80 font-mono">
                              {selectedIncident.affectedArea.radiusKm} km radius
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-300 mt-0.5">
                            📍 {selectedIncident.affectedArea.administrativeArea}, {selectedIncident.affectedArea.province} ({selectedIncident.affectedArea.centerLat.toFixed(4)}, {selectedIncident.affectedArea.centerLng.toFixed(4)})
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveStep(2)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <MapIcon className="w-3.5 h-3.5" />
                        <span>{isEn ? 'View Location Map' : 'Buka Peta Lokasi'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ----------------- STEP 2: IDENTIFY AFFECTED AREA & LOCATION MAP ----------------- */}
                {activeStep === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Compass className="w-5 h-5 text-blue-400" />
                        <div>
                          <h3 className="text-base font-bold text-white">
                            {isEn ? 'Step 2: Interactive Incident Location Map & Danger Geofence' : 'Langkah 2: Peta Detail Lokasi Kejadian, Geofence & Fasilitas Kritis'}
                          </h3>
                          <p className="text-xs text-slate-400">
                            {isEn 
                              ? 'Interactive spatial telemetry plotting epicenter, danger perimeter, geofence, and InaRISK critical facilities.'
                              : 'Pemetaan spasial interaktif episentrum bencana, perimeter bahaya operasional, poligon geofence, dan fasilitas vital InaRISK.'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveStep(3)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md cursor-pointer shrink-0"
                      >
                        <span>{isEn ? 'Next: Calculate Exposure' : 'Lanjut: Hitung Exposure'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Interactive Incident Location Leaflet Map */}
                    <IncidentLocationMap 
                      incident={selectedIncident} 
                      heightClass="h-[460px]"
                      onNavigateToFullMap={onNavigateToDisaster}
                    />

                    {/* Spatial Telemetry & Metrics */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 font-medium">{isEn ? 'Center Coordinates' : 'Koordinat Episentrum / Titik Pusat'}</span>
                          <div className="font-mono text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                            <span>{selectedIncident.affectedArea.centerLat.toFixed(4)}, {selectedIncident.affectedArea.centerLng.toFixed(4)}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 mt-0.5 block">{isEn ? 'WGS84 Geodetic Datum' : 'Sistem Koordinat Geodetik WGS84'}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 font-medium">{isEn ? 'Operational Danger Radius' : 'Radius Bahaya Operasional'}</span>
                          <div className="font-mono text-sm font-bold text-rose-400 mt-1">
                            {selectedIncident.affectedArea.radiusKm} km <span className="text-xs text-slate-400 font-normal">({Math.round(Math.PI * Math.pow(selectedIncident.affectedArea.radiusKm, 2))} km² luas bahaya)</span>
                          </div>
                          <span className="text-[10px] text-slate-500 mt-0.5 block">{isEn ? 'SOP Evacuation Perimeter' : 'Perimeter Evakuasi Standar SOP'}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 font-medium">{isEn ? 'Administrative Jurisdiction' : 'Yurisdiksi Wilayah'}</span>
                          <div className="text-sm font-bold text-white mt-1">
                            {selectedIncident.affectedArea.administrativeArea}
                          </div>
                          <span className="text-[10px] text-slate-500 mt-0.5 block">{selectedIncident.affectedArea.province}</span>
                        </div>
                      </div>

                      {/* InaRISK Critical Facilities Inside Danger Perimeter */}
                      {selectedIncident.exposure.facilities && selectedIncident.exposure.facilities.length > 0 && (
                        <div className="pt-2">
                          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-blue-400" />
                              <span>{isEn ? 'InaRISK Critical Facilities Within Danger Zone' : 'Fasilitas Kritis InaRISK dalam Zona Bahaya'}</span>
                            </span>
                            <span className="text-slate-400 font-mono text-[11px]">
                              {selectedIncident.exposure.facilities.length} {isEn ? 'facilities plotted' : 'fasilitas terpetakan'}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {selectedIncident.exposure.facilities.slice(0, 6).map((fac) => {
                              const isHospital = fac.type === 'hospital' || fac.type === 'puskesmas';
                              const isShelter = fac.type === 'shelter';
                              const icon = isHospital ? '🏥' : isShelter ? '⛺' : '🏫';
                              return (
                                <div key={fac.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex items-start gap-2.5">
                                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-sm shrink-0">
                                    {icon}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="font-bold text-white text-xs truncate" title={fac.name}>{fac.name}</div>
                                    <div className="text-[11px] text-slate-400 flex items-center justify-between mt-0.5">
                                      <span className="font-mono text-amber-400">{fac.distanceKm} km {isEn ? 'away' : 'dari pusat'}</span>
                                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase font-semibold">
                                        {fac.status}
                                      </span>
                                    </div>
                                    {fac.capacity && (
                                      <div className="text-[10px] text-slate-500 mt-0.5">
                                        {isEn ? 'Capacity' : 'Kapasitas'}: {fac.capacity} jiwa
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* CAP Polygon Coordinates */}
                      {selectedIncident.affectedArea.polygon && (
                        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                          <span className="font-semibold text-slate-300 block mb-1">
                            {isEn ? 'CAP Warning Polygon Geofence Coordinates:' : 'Poligon Geofence Area BMKG CAP Terdeteksi:'}
                          </span>
                          <div className="font-mono text-[11px] text-sky-400 break-all bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                            {JSON.stringify(selectedIncident.affectedArea.polygon)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ----------------- STEP 3: CALCULATE EXPOSURE & RISK ----------------- */}
                {activeStep === 3 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-400" />
                        <span>{isEn ? 'Step 3: InaRISK Exposure & Environmental Context' : 'Langkah 3: Kalkulasi Exposure InaRISK & Konteks Lingkungan'}</span>
                      </h3>
                      <button
                        onClick={handleRunVolunteerMatch}
                        disabled={isMatching}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs cursor-pointer shadow-md disabled:opacity-50"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{isMatching ? (isEn ? 'Matching...' : 'Mencocokkan...') : (isEn ? 'Match Volunteers (Step 4)' : 'Cocokkan Relawan (Langkah 4)')}</span>
                      </button>
                    </div>

                    {/* Population & Vulnerability Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-400">{isEn ? 'Estimated Population' : 'Populasi Terpapar'}</span>
                        <div className="text-lg font-bold text-white mt-1">
                          {selectedIncident.exposure.estimatedPopulation.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-400">{isEn ? 'Households (KK)' : 'Kepala Keluarga (KK)'}</span>
                        <div className="text-lg font-bold text-white mt-1">
                          {selectedIncident.exposure.households.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-400">{isEn ? 'Vulnerable (Children/Elderly)' : 'Warga Rentan (Lansia/Balita)'}</span>
                        <div className="text-lg font-bold text-amber-400 mt-1">
                          {selectedIncident.exposure.vulnerablePersons.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-400">{isEn ? 'InaRISK Capacity Score' : 'Skor Kapasitas BPBD'}</span>
                        <div className="text-lg font-bold text-emerald-400 mt-1">
                          {selectedIncident.inaRiskContext.capacityScore}/100
                        </div>
                      </div>
                    </div>

                    {/* Critical Facilities List */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                        <span>{isEn ? 'Critical Infrastructure Catalog (InaRISK)' : 'Infrastruktur Kritis di Zona Bahaya (InaRISK)'}</span>
                        <span className="text-[11px] text-slate-500 font-normal">
                          {selectedIncident.exposure.facilities.length} {isEn ? 'identified' : 'terdata'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {selectedIncident.exposure.facilities.map((fac) => (
                          <div key={fac.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {fac.type === 'hospital' || fac.type === 'puskesmas' ? (
                                <Building2 className="w-4 h-4 text-rose-400 shrink-0" />
                              ) : fac.type === 'school' ? (
                                <School className="w-4 h-4 text-amber-400 shrink-0" />
                              ) : (
                                <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
                              )}
                              <div>
                                <div className="font-semibold text-white">{fac.name}</div>
                                <div className="text-[10px] text-slate-400 capitalize">{fac.type} • {fac.distanceKm} km</div>
                              </div>
                            </div>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                              {fac.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Environmental Context (NASA GPM & BMKG Weather) */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                      <div className="font-semibold text-slate-300 uppercase text-[11px] tracking-wider mb-1">
                        {isEn ? 'Environmental Telemetry (BMKG & NASA GPM IMERG)' : 'Kondisi Lingkungan (BMKG & NASA GPM IMERG)'}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div className="p-2 rounded bg-slate-900">
                          <span className="text-slate-400">{isEn ? 'Weather' : 'Cuaca'}:</span>
                          <div className="font-bold text-white mt-0.5">{selectedIncident.environmentalContext.weatherCondition}</div>
                        </div>
                        <div className="p-2 rounded bg-slate-900">
                          <span className="text-slate-400">{isEn ? 'Wind' : 'Angin'}:</span>
                          <div className="font-bold text-white mt-0.5">{selectedIncident.environmentalContext.windSpeedKmh} km/h ({selectedIncident.environmentalContext.windDirection})</div>
                        </div>
                        <div className="p-2 rounded bg-slate-900">
                          <span className="text-slate-400">{isEn ? 'GPM 24h Rain' : 'Hujan GPM 24 Jam'}:</span>
                          <div className="font-bold text-cyan-400 mt-0.5">{selectedIncident.environmentalContext.gpmRainfallLast24hMm} mm</div>
                        </div>
                        <div className="p-2 rounded bg-slate-900">
                          <span className="text-slate-400">{isEn ? 'GPM 72h Acc' : 'Akumulasi 72 Jam'}:</span>
                          <div className="font-bold text-blue-400 mt-0.5">{selectedIncident.environmentalContext.gpmAccumulatedRainfall72hMm} mm</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ----------------- STEP 4: AI VOLUNTEER MATCHING ----------------- */}
                {activeStep === 4 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span>{isEn ? 'Step 4: AI Intelligent Volunteer Matching' : 'Langkah 4: Pencocokan Cerdas Relawan (Gemini AI)'}</span>
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleRunVolunteerMatch}
                          disabled={isMatching}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 inline mr-1 ${isMatching ? 'animate-spin' : ''}`} />
                          {isEn ? 'Re-match' : 'Cocokkan Ulang'}
                        </button>
                        <button
                          onClick={handleGenerateSitRep}
                          disabled={isGeneratingSitRep}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs cursor-pointer shadow-md"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{isGeneratingSitRep ? (isEn ? 'Drafting...' : 'Menyusun...') : (isEn ? 'Generate SitRep (Step 5)' : 'Susun SitRep (Langkah 5)')}</span>
                        </button>
                      </div>
                    </div>

                    {isMatching ? (
                      <div className="p-8 text-center text-slate-400 text-sm bg-slate-950 rounded-xl border border-slate-800">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-400" />
                        {isEn ? 'Ranking candidate volunteers by GPS proximity & certifications...' : 'Menganalisis kecocokan relawan terdekat berdasarkan sertifikasi & ketersediaan...'}
                      </div>
                    ) : matchedVolunteers.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-sm bg-slate-950 rounded-xl border border-slate-800">
                        <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                        <p>{isEn ? 'Click "Match Volunteers" to run Gemini AI matching engine.' : 'Klik tombol pencocokan untuk memulai perangkingan relawan.'}</p>
                        <button
                          onClick={handleRunVolunteerMatch}
                          className="mt-3 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
                        >
                          {isEn ? 'Run AI Matching' : 'Jalankan Pencocokan AI'}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <div className="text-xs text-slate-400">
                          {isEn 
                            ? `Found ${matchedVolunteers.length} qualified responders within mobilization perimeter:` 
                            : `Ditemukan ${matchedVolunteers.length} relawan siaga memenuhi kualifikasi operasi:`}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {matchedVolunteers.map((vol, index) => (
                            <div key={vol.volunteerId} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 text-xs font-bold flex items-center justify-center font-mono">
                                    {index + 1}
                                  </span>
                                  <span className="font-bold text-white text-xs">{vol.volunteerName}</span>
                                </div>
                                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                                  {Math.round(vol.score * 100)}% Match
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                                <span>{vol.primarySkill}</span>
                                <span className="font-mono text-slate-300">{vol.distanceKm.toFixed(1)} km</span>
                              </div>
                              <p className="text-[11px] text-slate-300 bg-slate-900/80 p-2 rounded border border-slate-800/80 leading-relaxed">
                                {vol.reasoning}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ----------------- STEP 5: GENERATE SITREP ----------------- */}
                {activeStep === 5 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <span>{isEn ? 'Step 5: Official BNPB/BPBD Situation Report (SitRep)' : 'Langkah 5: Laporan Situasi Resmi BNPB / BPBD (SitRep)'}</span>
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleGenerateSitRep}
                          disabled={isGeneratingSitRep}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 inline mr-1 ${isGeneratingSitRep ? 'animate-spin' : ''}`} />
                          {isEn ? 'Re-generate' : 'Susun Ulang'}
                        </button>
                        <button
                          onClick={handleGenerateBroadcast}
                          disabled={isGeneratingBroadcast}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs cursor-pointer shadow-md"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isGeneratingBroadcast ? (isEn ? 'Composing...' : 'Menyusun...') : (isEn ? 'Compose Broadcast (Step 6)' : 'Susun Broadcast (Langkah 6)')}</span>
                        </button>
                      </div>
                    </div>

                    {isGeneratingSitRep ? (
                      <div className="p-8 text-center text-slate-400 text-sm bg-slate-950 rounded-xl border border-slate-800">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-400" />
                        {isEn ? 'Drafting standard BNPB/BPBD Situation Report...' : 'Menyusun draf laporan resmi BNPB/BPBD...'}
                      </div>
                    ) : !sitRepData ? (
                      <div className="p-8 text-center text-slate-400 text-sm bg-slate-950 rounded-xl border border-slate-800">
                        <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                        <p>{isEn ? 'No SitRep generated yet.' : 'Belum ada SitRep yang dibuat untuk insiden ini.'}</p>
                        <button
                          onClick={handleGenerateSitRep}
                          className="mt-3 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
                        >
                          {isEn ? 'Draft SitRep Now' : 'Susun SitRep Sekarang'}
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3.5 text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <span className="font-mono text-slate-400">TIMESTAMP: {sitRepData.timestamp}</span>
                          <button
                            onClick={() => copyToClipboard(JSON.stringify(sitRepData, null, 2), 'sitrep')}
                            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                          >
                            {copiedText === 'sitrep' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedText === 'sitrep' ? (isEn ? 'Copied!' : 'Tersalin!') : (isEn ? 'Copy SitRep' : 'Salin SitRep')}</span>
                          </button>
                        </div>

                        <div>
                          <div className="font-semibold text-slate-300 uppercase text-[11px] mb-1">
                            {isEn ? 'Executive Summary' : 'Ringkasan Eksekutif'}
                          </div>
                          <p className="text-slate-200 leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800">
                            {sitRepData.executiveSummary}
                          </p>
                        </div>

                        <div>
                          <div className="font-semibold text-slate-300 uppercase text-[11px] mb-1">
                            {isEn ? 'Operational Priorities' : 'Prioritas Operasional Lapangan'}
                          </div>
                          <ul className="space-y-1 list-disc list-inside text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800">
                            {sitRepData.operationalPriorities.map((p, idx) => (
                              <li key={idx} className="leading-relaxed">{p}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <div className="font-semibold text-slate-300 uppercase text-[11px] mb-1">
                            {isEn ? 'Recommended Team Allocations' : 'Alokasi Regu Relawan'}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {sitRepData.recommendedTeamAllocations.map((team, idx) => (
                              <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
                                <div>
                                  <div className="font-bold text-white">{team.role}</div>
                                  <div className="text-[10px] text-amber-400">{team.urgency}</div>
                                </div>
                                <span className="font-mono text-sm font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                                  {team.count} {isEn ? 'prs' : 'org'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="font-semibold text-slate-300 uppercase text-[11px] mb-1">
                            {isEn ? 'Government & Inter-Agency Liaison' : 'Koordinasi Antar-Lembaga'}
                          </div>
                          <p className="text-slate-400 italic bg-slate-900/50 p-2.5 rounded border border-slate-850">
                            {sitRepData.governmentLiaisonNotes}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ----------------- STEP 6: EMERGENCY BROADCAST & COMMUNITY EARLY WARNING ----------------- */}
                {activeStep === 6 && (
                  <div className="space-y-6">
                    {/* Notification Banner */}
                    {earlyWarningNotification && (
                      <div className={`p-4 rounded-xl border flex items-start justify-between gap-3 shadow-lg transition-all ${
                        earlyWarningNotification.type === 'success'
                          ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
                          : 'bg-blue-950/70 border-blue-500/60 text-blue-200'
                      }`}>
                        <div className="flex items-center gap-3">
                          <Siren className={`w-5 h-5 shrink-0 ${earlyWarningNotification.type === 'success' ? 'text-emerald-400 animate-bounce' : 'text-blue-400'}`} />
                          <div className="text-xs font-semibold leading-relaxed">
                            {earlyWarningNotification.message}
                          </div>
                        </div>
                        <button
                          onClick={() => setEarlyWarningNotification(null)}
                          className="text-slate-400 hover:text-white text-xs font-bold px-2 py-0.5 rounded cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {/* =========================================================================
                        SUB-SECTION 1: AKTIVASI KE COMMUNITY EARLY WARNING & EVACUATION SYSTEM
                       ========================================================================= */}
                    <div className={`rounded-2xl p-5 border transition-all shadow-xl relative overflow-hidden ${
                      selectedIncident.responseWorkflow?.isCommunityEarlyWarningActive
                        ? 'bg-gradient-to-br from-rose-950/60 via-slate-900 to-slate-950 border-rose-500/70 shadow-rose-950/50 ring-1 ring-rose-500/40'
                        : 'bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border-amber-500/40'
                    }`}>
                      {/* Top Glowing Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-800/80">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            selectedIncident.responseWorkflow?.isCommunityEarlyWarningActive
                              ? 'bg-rose-500/20 border border-rose-500/50 text-rose-400 animate-pulse'
                              : 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                          }`}>
                            <Siren className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white flex items-center gap-2">
                              <span>{isEn ? 'Community Early Warning & Evacuation System' : 'Aktivasi ke Community Early Warning & Evacuation System'}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider bg-slate-800 text-slate-300">
                                {isEn ? 'Citizen Public Alert' : 'Sistem Publik Warga'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {isEn 
                                ? 'Broadcasts audible emergency sirens, danger geofencing, and evacuation routes directly to citizens.' 
                                : 'Menerbitkan sinyal darurat, alarm sirine audio, batas geofence bahaya, dan rute evakuasi langsung ke perangkat warga.'}
                            </p>
                          </div>
                        </div>

                        {/* Live Status Pill */}
                        <div className="shrink-0">
                          {selectedIncident.responseWorkflow?.isCommunityEarlyWarningActive ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950 text-rose-300 border border-rose-600/80 text-xs font-bold animate-pulse shadow-md">
                              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                              <span>{isEn ? '🔴 SIREN & PUBLIC ALERT ACTIVE' : '🔴 STATUS SIAGA / AWAS PUBLIK AKTIF'}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 text-slate-300 border border-slate-700 text-xs font-medium">
                              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                              <span>{isEn ? '⚪ STANDBY (Not Yet Triggered)' : '⚪ STANDBY (Belum Diaktifkan)'}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content Grid: Impact Metrics & Protected Evacuation Parameters */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
                        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                            {isEn ? 'Protected Danger Perimeter' : 'Perimeter Radius Bahaya'}
                          </div>
                          <div className="text-xl font-black text-rose-400 font-mono mt-0.5">
                            {selectedIncident.affectedArea.radiusKm} km
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            📍 {selectedIncident.affectedArea.administrativeArea}
                          </div>
                        </div>

                        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                            {isEn ? 'Target Population at Risk' : 'Target Warga Terpapar'}
                          </div>
                          <div className="text-xl font-black text-amber-400 font-mono mt-0.5">
                            {selectedIncident.exposure.estimatedPopulation.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-400">{isEn ? 'people' : 'jiwa'}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {selectedIncident.exposure.vulnerablePersons.toLocaleString('id-ID')} {isEn ? 'vulnerable persons' : 'kelompok rentan'}
                          </div>
                        </div>

                        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                            {isEn ? 'Designated Assembly / Shelter' : 'Titik Kumpul / Shelter Utama'}
                          </div>
                          <div className="text-xs font-bold text-white mt-1 line-clamp-1">
                            {selectedIncident.exposure.facilities.find(f => f.type === 'shelter' || f.type === 'school')?.name || `Posko Induk ${selectedIncident.affectedArea.administrativeArea}`}
                          </div>
                          <div className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1 font-medium">
                            <CheckCircle className="w-3 h-3" />
                            <span>{isEn ? 'InaRISK Verified Safe Zone' : 'Zona Aman Terverifikasi InaRISK'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Official Warning Text Preview that Citizens Will Receive */}
                      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
                        <div className="font-semibold text-slate-300 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <BellRing className="w-3.5 h-3.5 text-rose-400" />
                            {isEn ? 'Citizen Evacuation Broadcast Notice' : 'Teks Instruksi Evakuasi untuk Masyarakat'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {selectedIncident.priority === 'P1_CRITICAL' ? 'TINGKAT: AWAS (RED ALERT)' : 'TINGKAT: SIAGA (WARNING)'}
                          </span>
                        </div>
                        <p className="text-slate-300 leading-relaxed font-sans">
                          {selectedIncident.priority === 'P1_CRITICAL'
                            ? `[STATUS AWAS TERTINGGI] ${selectedIncident.title}. Estimasi ${selectedIncident.exposure.estimatedPopulation.toLocaleString('id-ID')} jiwa dalam zona ancaman radius ${selectedIncident.affectedArea.radiusKm} km. Warga diminta segera melakukan evakuasi teratur menuju posko rujukan dan mengaktifkan Safety Check-in!`
                            : `[STATUS SIAGA EVAKUASI] ${selectedIncident.title}. Warga di ${selectedIncident.affectedArea.administrativeArea} dihimbau waspada penuh, mematikan sumber listrik/gas, dan bersiap menuju titik kumpul terdekat bila situasi meningkat.`}
                        </p>
                      </div>

                      {/* Interactive Trigger / Deactivation CTA */}
                      <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="text-xs text-slate-400 flex items-center gap-1.5">
                          <Volume2 className="w-4 h-4 text-rose-400" />
                          <span>
                            {isEn
                              ? 'Triggering will alert all connected mobile & web citizens inside the geofence perimeter.'
                              : 'Mengaktifkan fitur ini akan membunyikan sirine dan memicu rute evakuasi di aplikasi seluruh warga terjangkau.'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          {selectedIncident.responseWorkflow?.isCommunityEarlyWarningActive ? (
                            <>
                              {onNavigateToEarlyWarning && (
                                <button
                                  onClick={onNavigateToEarlyWarning}
                                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                                  title={isEn ? 'Navigate to Citizen Public Early Warning View' : 'Buka Halaman Peringatan Dini Warga'}
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span>{isEn ? 'View in Community Early Warning' : 'Lihat di Peringatan Dini Warga'}</span>
                                </button>
                              )}

                              <button
                                onClick={handleDeactivateCommunityEarlyWarning}
                                disabled={isTogglingEarlyWarning}
                                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/80 text-rose-300 border border-slate-700 hover:border-rose-700 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                              >
                                <RefreshCw className={`w-3.5 h-3.5 ${isTogglingEarlyWarning ? 'animate-spin' : ''}`} />
                                <span>{isEn ? 'Deactivate Public Warning' : 'Nonaktifkan Peringatan Dini'}</span>
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={handleActivateCommunityEarlyWarning}
                              disabled={isTogglingEarlyWarning}
                              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 hover:from-red-500 hover:to-orange-500 active:from-red-700 active:to-orange-700 text-white font-bold text-xs shadow-lg shadow-rose-600/40 flex items-center gap-2 transition-all cursor-pointer animate-pulse hover:animate-none"
                            >
                              <Siren className={`w-4 h-4 ${isTogglingEarlyWarning ? 'animate-spin' : ''}`} />
                              <span>
                                {isTogglingEarlyWarning
                                  ? (isEn ? 'Activating Community System...' : 'Mengaktifkan Sistem Warga...')
                                  : (isEn ? '🚨 Activate Community Early Warning & Evacuation Now' : '🚨 Aktifkan ke Community Early Warning & Evacuation System Sekarang')}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* =========================================================================
                        SUB-SECTION 2: SIARAN OPERASIONAL RELAWAN & TIM SIAGA LAPANGAN (WHATSAPP)
                       ========================================================================= */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <Send className="w-4 h-4 text-emerald-400" />
                          <h4 className="text-sm font-bold text-white">
                            {isEn ? 'Tactical Field Responder Broadcast (WhatsApp)' : 'Siaran Taktis Relawan & Unit Siaga (WhatsApp / SMS)'}
                          </h4>
                        </div>
                        <button
                          onClick={handleGenerateBroadcast}
                          disabled={isGeneratingBroadcast}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer flex items-center gap-1.5"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingBroadcast ? 'animate-spin' : ''}`} />
                          <span>{isEn ? 'Re-compose' : 'Susun Ulang'}</span>
                        </button>
                      </div>

                      {isGeneratingBroadcast ? (
                        <div className="p-8 text-center text-slate-400 text-sm bg-slate-950 rounded-xl border border-slate-800">
                          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" />
                          {isEn ? 'Composing tactical WhatsApp broadcast...' : 'Menyusun teks siaran darurat WhatsApp...'}
                        </div>
                      ) : !broadcastData ? (
                        <div className="p-8 text-center text-slate-400 text-sm bg-slate-950 rounded-xl border border-slate-800">
                          <Send className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                          <p>{isEn ? 'No broadcast drafted yet.' : 'Belum ada draf siaran darurat untuk insiden ini.'}</p>
                          <button
                            onClick={handleGenerateBroadcast}
                            className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer"
                          >
                            {isEn ? 'Compose Broadcast Now' : 'Susun Siaran Sekarang'}
                          </button>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3.5 text-xs">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800 uppercase">
                                {broadcastData.channel}
                              </span>
                              <span className="text-slate-400">
                                {broadcastData.recipientCount} {isEn ? 'volunteers targeted' : 'relawan terjangkau'}
                              </span>
                            </div>

                            <button
                              onClick={() => copyToClipboard(broadcastData.message, 'broadcast')}
                              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                            >
                              {copiedText === 'broadcast' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedText === 'broadcast' ? (isEn ? 'Copied!' : 'Tersalin!') : (isEn ? 'Copy Message' : 'Salin Pesan')}</span>
                            </button>
                          </div>

                          {/* WhatsApp Bubble Preview */}
                          <div className="bg-[#0b141a] p-4 rounded-xl border border-emerald-900/30 font-sans text-slate-100 whitespace-pre-line leading-relaxed shadow-inner">
                            {broadcastData.message}
                          </div>

                          {/* Direct WhatsApp Share Button */}
                          <div className="flex justify-end pt-2">
                            <a
                              href={`https://wa.me/?text=${encodeURIComponent(broadcastData.message)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                            >
                              <Share2 className="w-4 h-4" />
                              <span>{isEn ? 'Broadcast via WhatsApp Now' : 'Kirim Siaran via WhatsApp Sekarang'}</span>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
              <Eye className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-base font-semibold text-slate-300">{isEn ? 'Select an incident to launch pipeline' : 'Pilih insiden untuk membuka alur komando'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
