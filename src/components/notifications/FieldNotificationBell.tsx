import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Radio, 
  CheckCircle, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  MapPin, 
  ExternalLink,
  Trash2,
  Compass
} from 'lucide-react';
import { useFieldNotifications } from '../../context/FieldNotificationContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { formatDistance } from '../../lib/geo.ts';

interface FieldNotificationBellProps {
  onNavigateToMap?: (lat?: number, lng?: number, disasterId?: string) => void;
  onNavigateToVolunteerPortal?: () => void;
}

export const FieldNotificationBell: React.FC<FieldNotificationBellProps> = ({
  onNavigateToMap,
  onNavigateToVolunteerPortal,
}) => {
  const { 
    notifications, 
    unreadCount, 
    isMuted, 
    toggleMute, 
    markAllAsRead, 
    acceptTask, 
    simulateIncomingFieldTask 
  } = useFieldNotifications();
  const { language, t } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && unreadCount > 0) {
            markAllAsRead();
          }
        }}
        className={`relative p-2 rounded-xl border transition-all ${
          unreadCount > 0
            ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20'
            : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
        }`}
        title={t.fieldToastNotificationsTitle}
        aria-label="Field Task Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-red-600 text-[9px] font-black text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <div>
                <h4 className="text-xs font-bold text-white">{t.fieldToastNotificationsTitle}</h4>
                <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                  <span>{t.fieldToastRadioOnline}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs flex items-center gap-1"
                title={isMuted ? t.fieldToastSoundMuted : t.fieldToastSoundOn}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>

              <button
                onClick={simulateIncomingFieldTask}
                className="px-2 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 transition-colors"
                title={t.fieldToastSimulateDesc}
              >
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>{language === 'id' ? 'Uji Notifikasi' : 'Simulate'}</span>
              </button>
            </div>
          </div>

          {/* List of Notifications */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-400 space-y-2">
                <Bell className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs">{t.fieldToastEmpty}</p>
                <button
                  onClick={simulateIncomingFieldTask}
                  className="text-xs font-bold text-emerald-400 hover:underline inline-flex items-center gap-1 pt-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{t.fieldToastSimulateBtn}</span>
                </button>
              </div>
            ) : (
              notifications.map((n) => {
                const isUrgent = n.priority === 'urgent';
                return (
                  <div 
                    key={n.id}
                    className={`p-3.5 transition-colors hover:bg-slate-800/40 space-y-2 ${
                      n.status === 'unread' ? 'bg-slate-800/20' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                            isUrgent ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {n.priority}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">
                            {n.requiredSkillName}
                          </span>
                          {n.distanceKm !== undefined && (
                            <span className="text-[10px] font-mono text-emerald-400">
                              • {formatDistance(n.distanceKm)}
                            </span>
                          )}
                        </div>
                        <h5 className="text-xs font-bold text-white leading-snug">{n.taskTitle}</h5>
                      </div>

                      {n.status === 'accepted' ? (
                        <span className="shrink-0 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>{language === 'id' ? 'Diterima' : 'Accepted'}</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => acceptTask(n.id)}
                          className="shrink-0 text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-2 py-1 rounded-lg transition-colors"
                        >
                          {t.fieldToastAccept}
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-300 line-clamp-2">{n.taskDescription}</p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1 truncate max-w-[200px]" title={n.disasterAddress}>
                        <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                        <span className="truncate">{n.disasterAddress}</span>
                      </span>
                      {onNavigateToMap && (
                        <button
                          onClick={() => {
                            onNavigateToMap(n.locationLat, n.locationLng, n.disasterId);
                            setIsOpen(false);
                          }}
                          className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 shrink-0"
                        >
                          <Compass className="w-3 h-3" />
                          <span>{language === 'id' ? 'Peta' : 'Map'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-2.5 bg-slate-950/80 border-t border-slate-800 text-center">
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-medium text-slate-400 hover:text-slate-200"
              >
                {language === 'id' ? 'Tandai semua sudah dibaca' : 'Mark all as read'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
