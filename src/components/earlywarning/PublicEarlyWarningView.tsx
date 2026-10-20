import React, { useState, useEffect } from 'react';
import { 
  Siren, 
  Volume2, 
  VolumeX, 
  MapPin, 
  Navigation, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  Phone, 
  Radio, 
  Heart, 
  Share2, 
  Compass, 
  ArrowRight,
  Flame,
  Droplet,
  Waves,
  Mountain,
  Zap,
  Info,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Disaster, EarlyWarningAlert, CitizenSafetyReport } from '../../types/index.ts';
import { 
  earlyWarningService, 
  evaluateCitizenProximity, 
  CitizenProximityStatus 
} from '../../services/earlyWarningService.ts';
import { fieldAudio, triggerFieldVibration } from '../../lib/fieldAlertAudio.ts';
import { CitizenSafetyCheckinModal } from './CitizenSafetyCheckinModal.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface PublicEarlyWarningViewProps {
  disasters: Disaster[];
  onNavigateToDonations?: () => void;
  onNavigateToMap?: (lat: number, lng: number) => void;
}

export const PublicEarlyWarningView: React.FC<PublicEarlyWarningViewProps> = ({
  disasters,
  onNavigateToDonations,
  onNavigateToMap
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [alerts, setAlerts] = useState<EarlyWarningAlert[]>([]);
  const [citizenReports, setCitizenReports] = useState<CitizenSafetyReport[]>([]);
  const [isSirenPlaying, setIsSirenPlaying] = useState<boolean>(false);

  // User coordinate state (Default to Jakarta Center)
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({
    lat: -6.2088,
    lng: 106.8456
  });
  const [userLocationName, setUserLocationName] = useState<string>(
    isEn ? 'Central Jakarta (Default)' : 'Jakarta Pusat (Default)'
  );
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);

  // Modal State
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState<boolean>(false);
  const [checkinInitialStatus, setCheckinInitialStatus] = useState<'safe' | 'needs_evacuation' | 'emergency_trapped'>('safe');
  const [activeGuideTab, setActiveGuideTab] = useState<'earthquake' | 'flood' | 'tsunami' | 'fire' | 'volcanic'>('flood');

  useEffect(() => {
    earlyWarningService.fetchRemoteAlerts();
    const unsubAlerts = earlyWarningService.subscribeAlerts((latestAlerts) => {
      setAlerts(latestAlerts);
    });
    const unsubReports = earlyWarningService.subscribeReports((reports) => {
      setCitizenReports(reports);
    });
    return () => {
      unsubAlerts();
      unsubReports();
      fieldAudio.stopEarlyWarningSiren();
    };
  }, []);

  // Compute live proximity evaluation
  const proximityStatus: CitizenProximityStatus = evaluateCitizenProximity(
    userCoords.lat,
    userCoords.lng,
    alerts,
    language
  );

  const toggleSiren = () => {
    if (isSirenPlaying) {
      fieldAudio.stopEarlyWarningSiren();
      setIsSirenPlaying(false);
    } else {
      fieldAudio.unlockAudio();
      fieldAudio.playEarlyWarningSiren();
      triggerFieldVibration('urgent');
      setIsSirenPlaying(true);
    }
  };

  const handleDetectGPS = () => {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      setIsDetectingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
          setUserLocationName(isEn ? 'Your Device GPS Coordinates' : 'Koordinat GPS Perangkat Anda');
          setIsDetectingLocation(false);
        },
        () => {
          setIsDetectingLocation(false);
          setUserLocationName(isEn ? 'Current Location (East Jakarta Simulation)' : 'Lokasi Terkini (Simulasi GPS Jaktim)');
          setUserCoords({ lat: -6.2255, lng: 106.8630 });
        },
        { timeout: 8000 }
      );
    }
  };

  const handleSetPresetLocation = (city: string, lat: number, lng: number) => {
    setUserLocationName(city);
    setUserCoords({ lat, lng });
  };

  const openCheckinWithStatus = (status: 'safe' | 'needs_evacuation' | 'emergency_trapped') => {
    setCheckinInitialStatus(status);
    setIsCheckinModalOpen(true);
  };

  const handleShareAlert = (alert: EarlyWarningAlert) => {
    const text = encodeURIComponent(
      isEn
        ? `⚠️ OFFICIAL BNPB/BMKG EARLY WARNING: ${alert.title}. Evacuation advice: ${alert.evacuationAdvice}. Info & Safe Shelters: https://sigap.bnpb.go.id/early-warning`
        : `⚠️ PERINGATAN DINI RESMI BNPB/BMKG: ${alert.title}. Arahan evakuasi: ${alert.evacuationAdvice}. Informasi & Posko Pengungsian SIGAP: https://sigap.bnpb.go.id/early-warning`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* SECTION 1: Master Early Warning Siren & National Emergency Bar */}
      <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-2xl border transition-all duration-300 ${
        proximityStatus.zone === 'red_danger'
          ? 'bg-gradient-to-r from-red-950 via-slate-900 to-rose-950 border-red-500/50'
          : proximityStatus.zone === 'orange_warning'
          ? 'bg-gradient-to-r from-amber-950 via-slate-900 to-red-950 border-amber-500/40'
          : 'bg-gradient-to-r from-slate-950 via-rose-950/40 to-slate-900 border-rose-500/30'
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-600 text-white animate-pulse shadow-lg">
                <Siren className="w-4 h-4" />
                <span>{isEn ? 'NATIONAL ALERT • BNPB PUSDALOPS' : 'SIAGA NASIONAL • PUSDALOPS BNPB'}</span>
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                Live Early Warning System (EWS)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isEn ? 'Community Early Warning & Evacuation System' : 'Sistem Peringatan Dini & Evakuasi Warga'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isEn
                ? 'Monitor live hazard buffer zones, access emergency evacuation routes to verified safe shelters, and submit your safety status to incident command squads.'
                : 'Pantau zona bahaya bencana secara real-time, dapatkan panduan evakuasi darurat ke titik kumpul terdekat, dan laporkan status keselamatan Anda untuk koordinasi tim SAR.'}
            </p>
          </div>

          {/* Siren Controller & Audio Test Button */}
          <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 shadow-2xl flex flex-col items-center gap-3 shrink-0 w-full sm:w-auto">
            <div className="text-center">
              <span className="text-xs font-bold text-white block">
                {isEn ? 'Emergency EWS Siren' : 'Sirene Darurat EWS'}
              </span>
              <span className="text-[10px] text-slate-400">
                {isEn ? 'Official BNPB Evacuation Audio' : 'Suara Peringatan Evakuasi BNPB'}
              </span>
            </div>

            <button
              onClick={toggleSiren}
              className={`w-full sm:w-56 py-3 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-xl ${
                isSirenPlaying
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse shadow-red-950/60'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 hover:border-red-500'
              }`}
            >
              {isSirenPlaying ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>{isEn ? 'Silence Emergency Siren' : 'Matikan Sirene Bahaya'}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-red-400" />
                  <span>{isEn ? 'Sound EWS Siren (Test)' : 'Bunyikan Sirene EWS (Tes)'}</span>
                </>
              )}
            </button>

            <span className="text-[10px] text-slate-400 text-center">
              {isEn ? 'Web Audio API • Zero External Data' : 'Audio Web API • Tanpa Kuota Tambahan'}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: Citizen Proximity Radar & Hazard Zone Detector */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              <span>{isEn ? 'Hazard Proximity Radar from Your Location' : 'Radar Jarak Bahaya dari Posisi Anda'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {isEn 
                ? 'Automated detection of whether your coordinates fall within active disaster impact perimeters'
                : 'Deteksi otomatis apakah lokasi Anda saat ini berada dalam radius bahaya bencana'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDetectGPS}
              disabled={isDetectingLocation}
              className="py-2 px-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition shadow-md flex items-center gap-2"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>
                {isDetectingLocation 
                  ? (isEn ? 'Detecting GPS...' : 'Mendeteksi...') 
                  : (isEn ? 'Use My Live GPS' : 'Gunakan GPS Saya')}
              </span>
            </button>

            {/* Quick Preset Selector */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => handleSetPresetLocation(isEn ? 'Kampung Melayu (East Jakarta)' : 'Kampung Melayu (Jaktim)', -6.2255, 106.8630)}
                className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                {isEn ? 'Jakarta (Flood)' : 'Jaktim (Banjir)'}
              </button>
              <button
                onClick={() => handleSetPresetLocation(isEn ? 'Labuan (Pandeglang Quake)' : 'Labuan (Pandeglang)', -6.4010, 105.8240)}
                className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                {isEn ? 'Labuan (Quake)' : 'Labuan (Gempa)'}
              </button>
              <button
                onClick={() => handleSetPresetLocation(isEn ? 'Pekanbaru (Riau Wildfire)' : 'Pekanbaru (Riau)', 0.5280, 101.4500)}
                className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                {isEn ? 'Riau (Fire)' : 'Riau (Karhutla)'}
              </button>
            </div>
          </div>
        </div>

        {/* Proximity Result Banner */}
        <div className={`p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
          proximityStatus.zone === 'red_danger'
            ? 'bg-red-950/60 border-red-500/60 text-red-100 shadow-xl'
            : proximityStatus.zone === 'orange_warning'
            ? 'bg-amber-950/60 border-amber-500/60 text-amber-100 shadow-xl'
            : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-2xl shrink-0 ${
              proximityStatus.zone === 'red_danger'
                ? 'bg-red-600 text-white animate-bounce'
                : proximityStatus.zone === 'orange_warning'
                ? 'bg-amber-600 text-white'
                : 'bg-emerald-600 text-white'
            }`}>
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg">
                  {isEn
                    ? proximityStatus.zone === 'red_danger' ? 'RED DANGER ZONE: EVACUATION ORDERED'
                      : proximityStatus.zone === 'orange_warning' ? 'ORANGE ADVISORY ZONE: HIGH ALERT'
                      : 'GREEN SAFE ZONE: NO IMMEDIATE THREAT'
                    : proximityStatus.zoneTitle}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-black/40 border border-white/20">
                  {userLocationName}
                </span>
              </div>

              {proximityStatus.nearestAlert ? (
                <p className="text-xs text-slate-200 leading-relaxed">
                  {isEn
                    ? `Current distance: ${proximityStatus.distanceKm} km from the epicenter of ${proximityStatus.nearestAlert.title}. Direct danger buffer: ${proximityStatus.nearestAlert.dangerRadiusKm} km.`
                    : `Jarak Anda saat ini: ${proximityStatus.distanceKm} km dari episentrum bencana ${proximityStatus.nearestAlert.title}. Radius bahaya langsung: ${proximityStatus.nearestAlert.dangerRadiusKm} km.`}
                </p>
              ) : (
                <p className="text-xs text-slate-300">
                  {isEn
                    ? 'No immediate disaster hazard detected within 50 km of your current coordinates.'
                    : 'Tidak terdeteksi ancaman bencana langsung dalam radius 50 km dari koordinat Anda.'}
                </p>
              )}
            </div>
          </div>

          {/* Evacuation Advice & Nearest Shelter Action */}
          {proximityStatus.nearestAlert && (
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-white/10 shrink-0 w-full md:w-80 space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {isEn ? 'Nearest Safe Evacuation Shelter:' : 'Titik Kumpul / Evakuasi Terdekat:'}
              </div>
              <div className="font-bold text-xs text-white">
                🏛️ {proximityStatus.nearestAlert.emergencyShelter.name}
              </div>
              <div className="text-[11px] text-slate-300 line-clamp-1">
                {proximityStatus.nearestAlert.emergencyShelter.address}
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                <span>{isEn ? `Capacity: ${proximityStatus.nearestAlert.emergencyShelter.capacity} People` : `Kapasitas: ${proximityStatus.nearestAlert.emergencyShelter.capacity} Jiwa`}</span>
                <span className="text-emerald-400 font-semibold">{isEn ? 'Medical & Food Ready' : 'Tersedia Posko Dapur & Medis'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Ribbon for Citizens */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            onClick={() => openCheckinWithStatus('safe')}
            className="py-3 px-4 rounded-2xl bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/60 font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{isEn ? '🟢 Check-in: My Family & I are Safe' : '🟢 Lapor: Saya & Keluarga Selamat'}</span>
          </button>

          <button
            onClick={() => openCheckinWithStatus('needs_evacuation')}
            className="py-3 px-4 rounded-2xl bg-amber-950 hover:bg-amber-900 text-amber-200 border border-amber-700/60 font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>{isEn ? '🟡 Request Medical Evacuation / Vulnerable' : '🟡 Butuh Evakuasi Medis / Rentan'}</span>
          </button>

          <button
            onClick={() => openCheckinWithStatus('emergency_trapped')}
            className="py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xl shadow-red-950/60 animate-pulse"
          >
            <Siren className="w-4 h-4" />
            <span>{isEn ? '🔴 Urgent SOS: Trapped (Dispatch SAR)' : '🔴 SOS Darurat Terjebak (Kirim SAR)'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 3: Active Early Warning Broadcasts Cards */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-400" />
            <span>{isEn ? 'Active Disaster Early Warning Broadcasts (BMKG / BNPB)' : 'Siaran Peringatan Dini Bencana Terkini (BMKG / BNPB)'}</span>
          </h2>
          <p className="text-xs text-slate-400">
            {isEn
              ? 'Real-time hazard updates and life-saving instructions issued by national disaster authorities'
              : 'Pembaruan berkala peringatan potensi bahaya dan tindakan penyelamatan jiwa'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {alerts.map((alert) => {
            const isAwas = alert.alertLevel === 'awas';
            const isSiaga = alert.alertLevel === 'siaga';

            return (
              <div 
                key={alert.id}
                className={`rounded-2xl p-5 border shadow-xl flex flex-col justify-between space-y-4 transition duration-200 ${
                  isAwas 
                    ? 'bg-gradient-to-b from-red-950/40 via-slate-900 to-slate-900 border-red-500/50 hover:border-red-400' 
                    : isSiaga 
                    ? 'bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/50 hover:border-amber-400'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="space-y-3">
                  {/* Badge & Source */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isAwas 
                        ? 'bg-red-600 text-white animate-pulse' 
                        : isSiaga 
                        ? 'bg-amber-600 text-white' 
                        : 'bg-yellow-600 text-slate-900 font-extrabold'
                    }`}>
                      LEVEL {isAwas ? (isEn ? '4: WARNING' : '4: AWAS') : isSiaga ? (isEn ? '3: WATCH' : '3: SIAGA') : (isEn ? '2: ADVISORY' : '2: WASPADA')}
                    </span>

                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {new Date(alert.issuedAt).toLocaleTimeString(isEn ? 'en-US' : 'id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </span>
                  </div>

                  {/* Title & Location */}
                  <div>
                    <h3 className="font-bold text-sm text-white line-clamp-2">
                      {isEn ? (alert.titleEn || alert.title) : alert.title}
                    </h3>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="truncate">{alert.locationName}</span>
                    </div>
                  </div>

                  {/* Evacuation Advice Box */}
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider block">
                      {isEn ? 'Official Evacuation Advice:' : 'Arahan Evakuasi Mandiri:'}
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {isEn ? (alert.evacuationAdviceEn || alert.evacuationAdvice) : alert.evacuationAdvice}
                    </p>
                  </div>

                  {/* Life saving action steps */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {isEn ? 'Rapid Life-Saving Action Steps:' : 'Langkah Aksi Cepat Penyelamatan Jiwa:'}
                    </span>
                    <div className="space-y-1">
                      {((isEn && alert.keyActionStepsEn && alert.keyActionStepsEn.length > 0)
                        ? alert.keyActionStepsEn
                        : alert.keyActionSteps
                      ).slice(0, 3).map((step, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => handleShareAlert(alert)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isEn ? 'Share WhatsApp' : 'Bagikan WhatsApp'}</span>
                  </button>

                  {onNavigateToMap && (
                    <button
                      onClick={() => onNavigateToMap(alert.locationLat, alert.locationLng)}
                      title={isEn ? 'Focus Map on Epicenter' : 'Fokuskan Peta'}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition"
                    >
                      <MapPin className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: Interactive Disaster Life-Saving Guide (Do's & Don'ts) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
            <span>{isEn ? 'Standard Safety Protocol & Guide (Do\'s & Don\'ts)' : 'Panduan SOP Keselamatan Jiwa Masyarakat (Do\'s & Don\'ts)'}</span>
          </h2>
          <p className="text-xs text-slate-400">
            {isEn
              ? 'Official self-rescue guidelines across common natural hazards in Indonesia'
              : 'Protokol resmi penyelamatan mandiri warga saat terjadi berbagai bencana alam di Indonesia'}
          </p>
        </div>

        {/* Hazard Selector Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'flood', label: isEn ? 'Flash Flood' : 'Banjir Bandang', icon: <Droplet className="w-3.5 h-3.5 text-blue-400" /> },
            { id: 'earthquake', label: isEn ? 'Earthquake' : 'Gempa Bumi', icon: <Zap className="w-3.5 h-3.5 text-amber-400" /> },
            { id: 'tsunami', label: 'Tsunami', icon: <Waves className="w-3.5 h-3.5 text-cyan-400" /> },
            { id: 'fire', label: isEn ? 'Wildfire / Building Fire' : 'Kebakaran & Karhutla', icon: <Flame className="w-3.5 h-3.5 text-orange-400" /> },
            { id: 'volcanic', label: isEn ? 'Volcanic Eruption' : 'Erupsi Gunung Api', icon: <Mountain className="w-3.5 h-3.5 text-rose-400" /> }
          ].map((h) => (
            <button
              key={h.id}
              onClick={() => setActiveGuideTab(h.id as any)}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                activeGuideTab === h.id
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {h.icon}
              <span>{h.label}</span>
            </button>
          ))}
        </div>

        {/* Guide Content based on Active Tab */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
          {/* DO's */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEn ? 'DO\'s: Immediate Actions to Take:' : 'Langkah yang WAJIB Dilakukan Segera:'}</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              {activeGuideTab === 'flood' && (
                <>
                  <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40">✓ {isEn ? 'Shut off main electrical breakers and disconnect gas tanks.' : 'Matikan MCB listrik dan cabut selang tabung gas rumah tangga.'}</div>
                  <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40">✓ {isEn ? 'Secure emergency go-bag (flashlights, first aid, waterproof documents).' : 'Bawa tas siaga bencana (senter, obat diare/kulit, KTP/Ijazah kedap air).'}</div>
                  <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40">✓ {isEn ? 'Evacuate immediately to second floor or designated temporary shelter.' : 'Evakuasi segera ke lantai 2 atau Posko Tempat Evakuasi Sementara (TES).'}</div>
                </>
              )}
              {activeGuideTab === 'earthquake' && (
                <>
                  <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40">✓ {isEn ? 'Drop, Cover, Hold On: Crouch beneath sturdy tables and protect neck/head.' : 'Drop, Cover, Hold On: Berlutut di bawah meja kokoh dan lindungi tengkuk kepala.'}</div>
                  <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40">✓ {isEn ? 'Move to open fields as soon as primary seismic shaking ceases.' : 'Keluar ke lapangan terbuka begitu getaran utama gempa berhenti.'}</div>
                  <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40">✓ {isEn ? 'Use emergency stairs; never use elevators or lifts.' : 'Gunakan tangga darurat, jangan pernah menggunakan elevator / lift.'}</div>
                </>
              )}
              {activeGuideTab === 'tsunami' && (
                <>
                  <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40">✓ {isEn ? 'If sea recedes abruptly after strong quake, run to elevations > 20 meters.' : 'Jika air laut surut tiba-tiba setelah gempa kuat, lari ke tempat tinggi > 20 meter.'}</div>
                  <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40">✓ {isEn ? 'Evacuate on foot or motorcycle to avoid car gridlocks.' : 'Gunakan kendaraan roda dua atau lari kaki agar tidak terjebak kemacetan mobil.'}</div>
                  <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40">✓ {isEn ? 'Do not wait for sirens if shaking persisted longer than 20 seconds.' : 'Jangan menunggu sirene resmi jika guncangan gempa berlangsung > 20 detik.'}</div>
                </>
              )}
              {activeGuideTab === 'fire' && (
                <>
                  <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40">✓ {isEn ? 'Crawl below heavy smoke; cleaner breathable air remains near the floor.' : 'Merangkak di bawah asap pekat karena udara bersih berada dekat lantai.'}</div>
                  <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40">✓ {isEn ? 'Cover mouth and nose with damp cloth to filter carbon particles.' : 'Tutup hidung dan mulut dengan kain atau masker basah untuk menyaring karbon.'}</div>
                  <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40">✓ {isEn ? 'Immediately dial Fire Department (113) or local response post.' : 'Segera hubungi pemadam kebakaran (113) dan posko relawan terdekat.'}</div>
                </>
              )}
              {activeGuideTab === 'volcanic' && (
                <>
                  <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40">✓ {isEn ? 'Wear airtight goggles and N95 particulate respirator masks.' : 'Kenakan kacamata pelindung dan masker respirator partikulat N95.'}</div>
                  <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40">✓ {isEn ? 'Clear volcanic ash from roofs to prevent structural collapse.' : 'Bersihkan atap rumah dari tumpukan abu vulkanik agar tidak runtuh.'}</div>
                  <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40">✓ {isEn ? 'Stay clear of river valleys susceptible to cold lahar debris flows.' : 'Jauhi aliran lembah dan sungai yang berpotensi dialiri lahar dingin hujan.'}</div>
                </>
              )}
            </div>
          </div>

          {/* DON'Ts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>{isEn ? 'DON\'Ts: Dangerous Behaviors to Avoid:' : 'Hal yang DILARANG KERAS / Berbahaya:'}</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-2 rounded-lg bg-rose-950/30 border border-rose-800/40">✗ {isEn ? 'Never forward unverified social media hoax videos or rumors.' : 'Jangan menyebarkan informasi hoax atau rekaman video gempa lama yang belum diverifikasi BMKG.'}</div>
              <div className="p-2 rounded-lg bg-rose-950/30 border border-rose-800/40">✗ {isEn ? 'Avoid downed electrical cables, submerged power lines, and transformer boxes.' : 'Jangan mendekati tiang listrik, kabel putus di dalam air, atau gardu transformator.'}</div>
              <div className="p-2 rounded-lg bg-rose-950/30 border border-rose-800/40">✗ {isEn ? 'Do not enter cracked buildings until certified safe by structural inspectors.' : 'Jangan kembali ke dalam rumah retak sebelum dinyatakan aman oleh tim struktural BPBD.'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: Emergency Hotlines Directory */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>{isEn ? 'National Toll-Free Emergency Disaster Hotlines' : 'Nomor Darurat Siaga Bencana Bebas Pulsa Nasional'}</span>
          </h2>
          <p className="text-xs text-slate-400">
            {isEn ? '24/7 toll-free access from all mobile and fixed operators across Indonesia' : 'Dapat dihubungi 24 jam bebas pulsa dari semua operator seluler di Indonesia'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { name: 'BASARNAS', number: '115', desc: isEn ? 'Search & Rescue' : 'Penyelamatan & SAR' },
            { name: 'BNPB PUSDALOPS', number: '117', desc: isEn ? 'Disaster Command' : 'Komando Bencana' },
            { name: isEn ? 'EMERGENCY SERVICE' : 'LAYANAN DARURAT', number: '112', desc: isEn ? 'Regional BPBD' : 'BPBD Pemda' },
            { name: isEn ? 'AMBULANCE' : 'AMBULANS / KEMENKES', number: '118', desc: isEn ? 'Medical Evac' : 'Evakuasi Medis' },
            { name: isEn ? 'FIRE BRIGADE' : 'PEMADAM KEBAKARAN', number: '113', desc: isEn ? 'Fire Rescue' : 'Damkar Lapangan' },
            { name: isEn ? 'POLICE' : 'KEPOLISIAN', number: '110', desc: isEn ? 'Security & Evac' : 'Keamanan Evakuasi' }
          ].map((hl) => (
            <a
              key={hl.number}
              href={`tel:${hl.number}`}
              className="bg-slate-950 hover:bg-slate-800/80 p-3 rounded-2xl border border-slate-800 hover:border-emerald-500/50 text-center transition block group shadow-md"
            >
              <div className="text-[10px] text-slate-400 uppercase font-semibold">{hl.name}</div>
              <div className="text-xl font-black text-emerald-400 font-mono my-0.5 group-hover:scale-105 transition">
                {hl.number}
              </div>
              <div className="text-[10px] text-slate-500">{hl.desc}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Citizen Safety Checkin Modal */}
      {isCheckinModalOpen && (
        <CitizenSafetyCheckinModal
          disasters={disasters}
          initialStatus={checkinInitialStatus}
          onClose={() => setIsCheckinModalOpen(false)}
        />
      )}

    </div>
  );
};
