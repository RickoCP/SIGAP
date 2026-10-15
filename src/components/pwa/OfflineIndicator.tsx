import React from 'react';
import { WifiOff, Database, MapPin, HardDrive, RefreshCw } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface OfflineIndicatorProps {
  onOpenCacheManager?: () => void;
  cachedTilesCount?: number;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  onOpenCacheManager,
  cachedTilesCount = 0,
}) => {
  const { isOnline, connectionInfo } = useOnlineStatus();
  const { language } = useLanguage();
  const isEn = language === 'en';

  if (isOnline && connectionInfo.effectiveType !== 'slow-2g' && connectionInfo.effectiveType !== '2g') {
    return null;
  }

  const isLowConnection = isOnline && (connectionInfo.effectiveType === 'slow-2g' || connectionInfo.effectiveType === '2g');

  return (
    <aside
      aria-label={isEn ? 'Field Disaster Network Connectivity Status' : 'Status Konektivitas Jaringan Bencana'}
      className="fixed bottom-4 left-4 z-50 max-w-md w-[calc(100vw-2rem)] sm:w-auto"
    >
      <div
        className={`flex items-center justify-between gap-3 p-3 rounded-xl shadow-2xl backdrop-blur-md border ${
          !isOnline
            ? 'bg-amber-950/90 border-amber-600/50 text-amber-200 shadow-amber-950/50'
            : 'bg-yellow-950/90 border-yellow-600/50 text-yellow-200 shadow-yellow-950/50'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              !isOnline ? 'bg-amber-600/30 text-amber-400' : 'bg-yellow-600/30 text-yellow-400'
            }`}
          >
            <WifiOff className="w-4 h-4 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-tight text-white">
                {!isOnline 
                  ? (isEn ? 'Field Offline Mode (Zero Signal Zone)' : 'Mode Offline Lapangan (Zona Tanpa Sinyal)') 
                  : (isEn ? 'Weak Cellular Signal Detected' : 'Koneksi Rendah Terdeteksi')}
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            </div>
            <p className="text-[11px] opacity-90 truncate">
              {!isOnline
                ? (isEn 
                    ? `Tactical maps & shelter data served from Service Worker cache (${cachedTilesCount > 0 ? `${cachedTilesCount} tiles cached` : 'Local'})`
                    : `Peta taktis & data posko aktif dari cache Service Worker (${cachedTilesCount > 0 ? `${cachedTilesCount} tile tersimpan` : 'Lokal'})`)
                : (isEn
                    ? `Weak network (${connectionInfo.effectiveType?.toUpperCase() || '2G'}). Prioritizing offline cache.`
                    : `Jaringan lemah (${connectionInfo.effectiveType?.toUpperCase() || '2G'}). Mengutamakan cache offline.`)}
            </p>
          </div>
        </div>

        {onOpenCacheManager && (
          <button
            onClick={onOpenCacheManager}
            className="shrink-0 px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-750 hover:bg-amber-700 text-white border border-amber-500/40 transition whitespace-nowrap shadow-sm"
          >
            {isEn ? 'Manage Maps' : 'Kelola Peta'}
          </button>
        )}
      </div>
    </aside>
  );
};
