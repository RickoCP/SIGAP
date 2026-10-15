import React, { useState } from 'react';
import { 
  IdCard, 
  Shield, 
  Award, 
  MapPin, 
  Phone, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Send, 
  QrCode, 
  UserPlus, 
  HeartHandshake, 
  Check, 
  Radio, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Droplet,
  Volume2,
  VolumeX,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useFieldNotifications } from '../../context/FieldNotificationContext.tsx';
import { Task, Disaster } from '../../types/index.ts';

interface VolunteerPortalProps {
  tasks: Task[];
  disasters: Disaster[];
  onOpenRegisterModal: () => void;
  onUpdateTaskStatus?: (taskId: string, newStatus: Task['status']) => void;
  onOpenRewardsTab: () => void;
  onNavigateToTacticalMap?: () => void;
}

export const VolunteerPortal: React.FC<VolunteerPortalProps> = ({
  tasks,
  disasters,
  onOpenRegisterModal,
  onUpdateTaskStatus,
  onOpenRewardsTab,
  onNavigateToTacticalMap
}) => {
  const { 
    currentUser, 
    userProfile, 
    effectiveRole, 
    isVolunteer, 
    loginWithGoogle,
    updateDutyStatus,
    claimVolunteerPoints 
  } = useAuth();
  const { language, t } = useLanguage();
  const { 
    isMuted, 
    toggleMute, 
    simulateIncomingFieldTask, 
    notifications,
    unreadCount 
  } = useFieldNotifications();

  // Field report form state
  const [reportLocation, setReportLocation] = useState('');
  const [reportNeeds, setReportNeeds] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportUrgency, setReportUrgency] = useState<'darurat' | 'tinggi' | 'sedang'>('tinggi');
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  // Filter tasks assigned to current volunteer or active
  const myAssignedTasks = tasks.slice(0, 3); // realistic demonstration pool

  const handleDutyToggle = async (status: 'standby' | 'on_duty' | 'off_duty') => {
    await updateDutyStatus(status);
  };

  const handleSubmitFieldReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDescription.trim()) return;

    setSubmittingReport(true);
    try {
      // simulate network request to /field_reports or API
      await new Promise(r => setTimeout(r, 600));
      await claimVolunteerPoints(25); // award 25 points for field report
      setReportSuccess(true);
      setReportLocation('');
      setReportNeeds('');
      setReportDescription('');
      setTimeout(() => setReportSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReport(false);
    }
  };

  const volunteerInfo = userProfile?.volunteerData || {
    name: currentUser?.displayName || 'Relawan Kemanusiaan',
    phone: '0812-3456-7890',
    city: 'Jakarta',
    organization: 'Relawan SIGAP Mandiri',
    category: 'public_community' as const,
    skills: [{ skillId: 'skill-med-1', proficiency: 'intermediate' as const }],
    bloodType: 'O+',
    status: 'available' as const,
    points: 320,
    dutyStatus: 'standby' as const,
    activeMissionCount: 1,
    completedMissionCount: 4,
    badgeCount: 2
  };

  // IF USER IS PUBLIC / GUEST (NOT YET REGISTERED)
  if (!isVolunteer) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
        {/* Hero banner for public guest */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 border border-emerald-500/30 p-8 sm:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold mb-4">
              <HeartHandshake className="w-4 h-4" />
              <span>{language === 'id' ? 'Panggilan Kemanusiaan Terbuka' : 'Open Humanitarian Call'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-4">
              {language === 'id' 
                ? 'Semua Orang Dapat Bergabung Menjadi Relawan Tanggap Bencana' 
                : 'Anyone Can Register as a Disaster Relief Volunteer'}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-medium">
              {language === 'id'
                ? 'Bencana dapat terjadi kapan saja di penjuru Indonesia. Bergabunglah dalam jaringan relawan SIGAP terpadu. Siapapun Anda—tenaga medis, tim evakuasi SAR, penyedia logistik, supir, psikososial, atau warga yang ingin membantu posko—kontribusi Anda menyelamatkan nyawa.'
                : 'Disasters strike anytime across Indonesia. Join the SIGAP volunteer network. Whether you are medical personnel, SAR search-and-rescue, logistics, drivers, or community helpers, your contribution saves lives.'}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {currentUser ? (
                <button
                  onClick={onOpenRegisterModal}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>{language === 'id' ? 'Lengkapi Profil Relawan' : 'Complete Volunteer Profile'}</span>
                </button>
              ) : (
                <button
                  onClick={async () => {
                    await loginWithGoogle();
                    onOpenRegisterModal();
                  }}
                  className="flex items-center gap-3 px-6 py-3 bg-white hover:bg-slate-100 text-slate-950 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>{language === 'id' ? 'Daftar dengan Akun Google' : 'Register with Google Account'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3 Steps explanation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg mb-4">
              1
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              {language === 'id' ? 'Autentikasi Ekosistem Google' : 'Google Authentication'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'id'
                ? 'Masuk menggunakan akun Google Anda dengan satu klik. Identitas dan email terverifikasi langsung terhubung aman.'
                : 'Sign in using your Google account in one click. Verified identity and contact safely sync.'}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg mb-4">
              2
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              {language === 'id' ? 'Pilih Keahlian & Wilayah' : 'Select Skills & Region'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'id'
                ? 'Tentukan spesialisasi (Medis, SAR, Dapur Umum, Logistik, Supir) dan kota domisili agar algoritma AI dapat mencocokkan tugas terdekat.'
                : 'Choose your specialty (Medical, SAR, Logistics, Food, Drivers) and city for smart mission matching.'}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg mb-4">
              3
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              {language === 'id' ? 'KTA Digital & Penugasan' : 'Digital ID & Missions'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'id'
                ? 'Terima Kartu Tanda Relawan resmi dengan kode QR, pantau misi posko darurat, dan kumpulkan poin reward kemanusiaan.'
                : 'Receive official Digital Volunteer ID with QR code, track active operations, and collect humanitarian rewards.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // IF USER IS REGISTERED VOLUNTEER (OR COORDINATOR)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center gap-4">
          {currentUser?.photoURL ? (
            <img 
              src={currentUser.photoURL} 
              alt="Avatar" 
              className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/50 shadow-md shadow-emerald-500/20"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center text-xl font-bold border border-emerald-500/40">
              {volunteerInfo.name[0]}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">{volunteerInfo.name}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {language === 'id' ? 'Relawan Terverifikasi' : 'Verified Volunteer'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {volunteerInfo.organization || 'Relawan SIGAP'} • {volunteerInfo.city} • Golongan Darah: {volunteerInfo.bloodType || 'O+'}
            </p>
          </div>
        </div>

        {/* Duty Status Selector */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 px-2 hidden sm:inline">
            {language === 'id' ? 'Status Siaga:' : 'Duty Status:'}
          </span>
          <button
            onClick={() => handleDutyToggle('standby')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              volunteerInfo.dutyStatus === 'standby'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-950"></span>
            <span>Standby</span>
          </button>
          <button
            onClick={() => handleDutyToggle('on_duty')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              volunteerInfo.dutyStatus === 'on_duty'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-950"></span>
            <span>Bertugas</span>
          </button>
          <button
            onClick={() => handleDutyToggle('off_duty')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              volunteerInfo.dutyStatus === 'off_duty'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            <span>Istirahat</span>
          </button>
        </div>
      </div>

      {/* Field Radio Telemetry & Real-Time Task Dispatch Alert Hub */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 shadow-xl animate-in fade-in duration-300 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                  {language === 'id' ? 'Sistem Panggilan & Notifikasi Tugas Lapangan' : 'Field Radio & Task Dispatch Toast System'}
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  {volunteerInfo.dutyStatus === 'off_duty' ? 'STANDBY LISTENER' : 'LIVE RADIO BEACON'}
                </span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1">
                    <Bell className="w-3 h-3 text-red-400" />
                    <span>{unreadCount} {language === 'id' ? 'tugas baru' : 'new tasks'}</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                {language === 'id' 
                  ? 'Saat Anda berada di lapangan, notifikasi toast dengan nada siaga taktis & getar akan muncul otomatis begitu ada panggilan tugas darurat dari Posko Komando.'
                  : 'While you are deployed in the field, audio toast notifications & haptic alerts trigger automatically whenever new emergency tasks are dispatched from Command Post.'}
              </p>
            </div>
          </div>

          {/* Action buttons & Sound controls */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {/* Audio Toggle */}
            <button
              onClick={toggleMute}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isMuted
                  ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
              }`}
              title={isMuted ? t.fieldToastSoundMuted : t.fieldToastSoundOn}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              <span className="hidden sm:inline text-[11px] font-mono">
                {isMuted ? (language === 'id' ? 'Mute' : 'Muted') : (language === 'id' ? 'Suara Aktif' : 'Sound On')}
              </span>
            </button>

            {/* Test Simulation Button */}
            <button
              onClick={simulateIncomingFieldTask}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-950/40 transition-all active:scale-95"
              title={t.fieldToastSimulateDesc}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.fieldToastSimulateBtn}</span>
            </button>

            {onNavigateToTacticalMap && (
              <button
                onClick={onNavigateToTacticalMap}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 shadow-md transition-colors"
              >
                <span>{language === 'id' ? 'Peta Taktis' : 'Tactical Map'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Digital Volunteer ID Card & Points */}
        <div className="space-y-6">
          {/* Digital ID Badge */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 border-2 border-blue-500/40 p-6 shadow-xl text-white">
            <div className="flex items-center justify-between pb-4 border-b border-blue-500/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black tracking-wider text-blue-300">KTA RELAWAN SIGAP</h4>
                  <p className="text-[9px] text-slate-400">BADAN KOORDINASI PENANGGULANGAN BENCANA</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <Check className="w-3 h-3" />
                <span>AKTIF</span>
              </div>
            </div>

            <div className="py-4 flex gap-4 items-center">
              {currentUser?.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt="Volunteer" 
                  className="w-20 h-24 object-cover rounded-xl border border-slate-700 shrink-0"
                />
              ) : (
                <div className="w-20 h-24 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center text-2xl font-black text-slate-400 shrink-0">
                  {volunteerInfo.name[0]}
                </div>
              )}
              <div className="min-w-0 space-y-1">
                <p className="text-[10px] font-semibold text-slate-400">NAMA LENGKAP</p>
                <h3 className="text-sm font-bold text-white leading-tight truncate">{volunteerInfo.name}</h3>
                <p className="text-[10px] font-semibold text-slate-400 mt-2">ID RELAWAN</p>
                <p className="text-xs font-mono font-bold text-amber-400">ID-SIGAP-{currentUser?.uid ? currentUser.uid.substring(0, 8).toUpperCase() : '88921B'}</p>
                <p className="text-[10px] text-slate-400">WILAYAH: <span className="text-slate-200 font-semibold">{volunteerInfo.city}</span></p>
              </div>
            </div>

            <div className="pt-3 border-t border-blue-500/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <QrCode className="w-8 h-8 text-slate-300" />
                <div className="text-[9px] text-slate-400">
                  <p>QR Terverifikasi</p>
                  <p className="text-slate-300 font-mono">auth.google.sigap</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">GOLONGAN DARAH</span>
                <span className="text-sm font-black text-red-400">{volunteerInfo.bloodType || 'O+'}</span>
              </div>
            </div>
          </div>

          {/* Gamification Points Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-bold text-white">
                  {language === 'id' ? 'Poin & Lencana Kemanusiaan' : 'Points & Badges'}
                </h4>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                Level 3 Responder
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-black text-white">{volunteerInfo.points}</span>
                <span className="text-xs text-slate-400 ml-1.5">XP Poin</span>
              </div>
              <button
                onClick={onOpenRewardsTab}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>Tukar Reward</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full" style={{ width: '68%' }}></div>
            </div>
            <p className="text-[11px] text-slate-400 text-right">320 / 500 XP menuju Level 4 Master Rescuer</p>
          </div>
        </div>

        {/* Right 2 Columns: Missions & Situation Report */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Missions */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">
                  {language === 'id' ? 'Misi & Tugas Lapangan Saya' : 'My Field Tasks & Missions'}
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                {myAssignedTasks.length} {language === 'id' ? 'Tugas Aktif' : 'Active Tasks'}
              </span>
            </div>

            <div className="space-y-3">
              {myAssignedTasks.map((t) => (
                <div 
                  key={t.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.priority === 'urgent' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {t.priority.toUpperCase()}
                      </span>
                      <h4 className="text-sm font-bold text-slate-200">{t.title}</h4>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{t.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>Posko Sektor B</span>
                      </span>
                      <span>Dibutuhkan: {t.volunteersNeeded} personel</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        if (onUpdateTaskStatus) {
                          onUpdateTaskStatus(t.id, 'completed');
                        }
                        claimVolunteerPoints(50);
                      }}
                      className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{language === 'id' ? 'Lapor Selesai (+50 XP)' : 'Mark Done (+50 XP)'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Ground Situation Report Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Send className="w-5 h-5 text-red-400" />
              <h3 className="text-base font-bold text-white">
                {language === 'id' ? 'Kirim Laporan Situasi Lapangan (Field SitRep)' : 'Submit Ground SitRep'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              {language === 'id'
                ? 'Laporan yang dikirim oleh relawan terverifikasi akan langsung masuk ke layar komando koordinator taktis dan peta situasi publik.'
                : 'Reports submitted by verified volunteers feed directly into coordinator tactical maps and public awareness.'}
            </p>

            {reportSuccess ? (
              <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-3 animate-in fade-in">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold">Laporan Lapangan Berhasil Dikirim ke Pusat Komando!</p>
                  <p className="text-[11px] text-emerald-400/80">Anda mendapatkan +25 XP Poin atas kontribusi informasi situasi lapangan.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitFieldReport} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {language === 'id' ? 'Titik Lokasi Pengamatan' : 'Observation Location'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jembatan Kampung Melayu RW 03"
                      value={reportLocation}
                      onChange={e => setReportLocation(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {language === 'id' ? 'Tingkat Urgensi' : 'Urgency Level'}
                    </label>
                    <select
                      value={reportUrgency}
                      onChange={e => setReportUrgency(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="darurat">🚨 Darurat (Perlu Evakuasi Cepat)</option>
                      <option value="tinggi">⚠️ Tinggi (Kekurangan Logistik/Medis)</option>
                      <option value="sedang">ℹ️ Sedang (Pemantauan Rutin)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {language === 'id' ? 'Kebutuhan Mendesak Lapangan' : 'Immediate Urgent Needs'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Perahu karet 2 unit, air mineral 20 dus, selimut bayi"
                    value={reportNeeds}
                    onChange={e => setReportNeeds(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {language === 'id' ? 'Keterangan Situasi & Catatan Relawan' : 'Observation Summary'}
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Laporkan kondisi air, korban yang terisolir, hambatan akses jalan, atau kendala lapangan lainnya..."
                    value={reportDescription}
                    onChange={e => setReportDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingReport}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-600/30 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submittingReport ? 'Mengirim...' : (language === 'id' ? 'Kirim ke Posko Komando' : 'Send to Command Post')}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
