import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Radio, 
  MapPin, 
  Users, 
  CheckCircle, 
  X, 
  Volume2, 
  VolumeX, 
  Compass, 
  ExternalLink,
  ShieldAlert,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useFieldNotifications } from '../../context/FieldNotificationContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { FieldTaskNotification } from '../../types/index.ts';
import { formatDistance } from '../../lib/geo.ts';

interface FieldTaskToastContainerProps {
  onNavigateToMap?: (lat?: number, lng?: number, disasterId?: string) => void;
  onNavigateToVolunteerPortal?: () => void;
}

export const FieldTaskToastContainer: React.FC<FieldTaskToastContainerProps> = ({
  onNavigateToMap,
  onNavigateToVolunteerPortal,
}) => {
  const { activeToasts, dismissToast, acceptTask, isMuted, toggleMute } = useFieldNotifications();
  const { language, t } = useLanguage();

  if (activeToasts.length === 0) return null;

  return (
    <div 
      className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[80] flex flex-col gap-3 max-w-md w-[calc(100vw-2rem)] sm:w-[420px] pointer-events-none"
      role="region"
      aria-label="Field Emergency Notifications"
    >
      {activeToasts.map((toast, idx) => (
        <FieldTaskToastCard
          key={toast.id}
          toast={toast}
          isTop={idx === 0}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onDismiss={() => dismissToast(toast.id)}
          onAccept={async () => {
            await acceptTask(toast.id);
            if (onNavigateToVolunteerPortal) {
              onNavigateToVolunteerPortal();
            }
          }}
          onViewMap={() => {
            if (onNavigateToMap) {
              onNavigateToMap(toast.locationLat, toast.locationLng, toast.disasterId);
            }
            dismissToast(toast.id);
          }}
        />
      ))}
    </div>
  );
};

interface FieldTaskToastCardProps {
  toast: FieldTaskNotification;
  isTop: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onDismiss: () => void;
  onAccept: () => Promise<void>;
  onViewMap: () => void;
}

const FieldTaskToastCard: React.FC<FieldTaskToastCardProps> = ({
  toast,
  isTop,
  isMuted,
  onToggleMute,
  onDismiss,
  onAccept,
  onViewMap,
}) => {
  const { language, t } = useLanguage();
  const [isAccepting, setIsAccepting] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(100);

  // Auto-dismiss timer with pause on hover
  useEffect(() => {
    if (isAccepted) {
      const tId = setTimeout(onDismiss, 1800);
      return () => clearTimeout(tId);
    }

    if (isHovered) return;

    const interval = 100;
    const totalDuration = 20000; // 20s
    const step = (interval / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          onDismiss();
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isHovered, isAccepted, onDismiss]);

  const handleAcceptClick = async () => {
    setIsAccepting(true);
    try {
      await onAccept();
      setIsAccepted(true);
    } catch {
      setIsAccepting(false);
    }
  };

  const isUrgent = toast.priority === 'urgent';
  const isHigh = toast.priority === 'high';

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`pointer-events-auto relative rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl border transition-all duration-300 animate-in slide-in-from-top-4 fade-in ${
        isUrgent
          ? 'bg-slate-950/95 border-red-500/80 shadow-red-950/50'
          : isHigh
          ? 'bg-slate-950/95 border-amber-500/70 shadow-amber-950/40'
          : 'bg-slate-950/95 border-blue-500/60 shadow-blue-950/30'
      }`}
    >
      {/* Top strobe alert header */}
      <div 
        className={`px-4 py-2 flex items-center justify-between border-b text-xs ${
          isUrgent 
            ? 'bg-red-500/20 border-red-500/30 text-red-200' 
            : isHigh 
            ? 'bg-amber-500/20 border-amber-500/30 text-amber-200' 
            : 'bg-blue-500/20 border-blue-500/30 text-blue-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isUrgent ? 'bg-red-400' : 'bg-amber-400'
              }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                isUrgent ? 'bg-red-500' : 'bg-amber-500'
              }`} />
            </span>
          </div>
          <span className="font-black tracking-wider text-[11px] uppercase">
            {t.fieldToastNewTask}
          </span>
          <span className="hidden sm:inline-block text-[10px] opacity-75 font-mono">
            • {toast.source}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Sound toggle button */}
          <button
            onClick={onToggleMute}
            title={isMuted ? t.fieldToastSoundMuted : t.fieldToastSoundOn}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          {/* Dismiss button */}
          <button
            onClick={onDismiss}
            title={t.fieldToastDismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-4 space-y-3">
        {/* Title and Badges */}
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide border ${
              isUrgent 
                ? 'bg-red-500/30 text-red-300 border-red-500/40' 
                : isHigh 
                ? 'bg-amber-500/30 text-amber-300 border-amber-500/40' 
                : 'bg-blue-500/30 text-blue-300 border-blue-500/40'
            }`}>
              {toast.priority.toUpperCase()}
            </span>

            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {toast.requiredSkillName}
            </span>

            {toast.distanceKm !== undefined && (
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                <Compass className="w-3 h-3 text-emerald-400" />
                <span>{formatDistance(toast.distanceKm)} {t.fieldToastDistance}</span>
              </span>
            )}
          </div>

          <h4 className="text-sm font-black text-white leading-snug">
            {toast.taskTitle}
          </h4>

          <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
            {toast.taskDescription}
          </p>
        </div>

        {/* Location & Personnel info */}
        <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5 min-w-0 pr-2">
            <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span className="truncate text-[11px] text-slate-300" title={toast.disasterAddress}>
              {toast.disasterAddress}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0 font-medium">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>{toast.volunteersNeeded} {language === 'id' ? 'personel' : 'volunteers'}</span>
          </div>
        </div>

        {/* Interactive Action Buttons */}
        {isAccepted ? (
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold animate-in zoom-in-95">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{t.fieldToastAccepted} (+35 XP)</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleAcceptClick}
              disabled={isAccepting}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/50 transition-all active:scale-95 disabled:opacity-50"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{isAccepting ? (language === 'id' ? 'Memproses...' : 'Processing...') : `${t.fieldToastAccept} (+35 XP)`}</span>
            </button>

            <button
              onClick={onViewMap}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
              title={t.fieldToastViewMap}
            >
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">{language === 'id' ? 'Peta' : 'Map'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Auto-dismiss Countdown Progress Bar */}
      {!isAccepted && (
        <div className="w-full bg-slate-900 h-1 overflow-hidden">
          <div 
            className={`h-full transition-all duration-100 ease-linear ${
              isUrgent ? 'bg-red-500' : isHigh ? 'bg-amber-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};
