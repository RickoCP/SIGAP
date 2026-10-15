import React, { useState, useEffect } from 'react';
import { 
  HardDrive, 
  Download, 
  MapPin, 
  CheckCircle2, 
  Wifi, 
  WifiOff, 
  Layers, 
  Trash2, 
  AlertTriangle, 
  RefreshCw, 
  X,
  Compass,
  Database
} from 'lucide-react';
import { Disaster } from '../../types/index.ts';
import { 
  getOfflineCacheStats, 
  precacheDisasterMapTiles, 
  clearMapTilesCache, 
  OfflineCacheStats 
} from '../../services/offlineCacheService.ts';

interface OfflineMapCacheManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  disasters: Disaster[];
  selectedDisasterId?: string | null;
  onSelectDisaster?: (id: string) => void;
  onRefreshCacheStats?: (stats: OfflineCacheStats) => void;
}

export const OfflineMapCacheManagerModal: React.FC<OfflineMapCacheManagerModalProps> = ({
  isOpen,
  onClose,
  disasters,
  selectedDisasterId,
  onSelectDisaster,
  onRefreshCacheStats,
}) => {
  const [stats, setStats] = useState<OfflineCacheStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [targetDisasterId, setTargetDisasterId] = useState<string>(selectedDisasterId || disasters[0]?.id || '');
  
  // Download progress state
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<{
    loaded: number;
    total: number;
    percent: number;
    currentUrl: string;
  } | null>(null);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoadingStats(true);
    try {
      const s = await getOfflineCacheStats();
      setStats(s);
      if (onRefreshCacheStats) onRefreshCacheStats(s);
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStats();
      if (selectedDisasterId) {
        setTargetDisasterId(selectedDisasterId);
      }
    }
  }, [isOpen, selectedDisasterId]);

  if (!isOpen) return null;

  const targetDisaster = disasters.find(d => d.id === targetDisasterId) || disasters[0];

  const handleStartPrecache = async () => {
    if (!targetDisaster) return;
    setIsDownloading(true);
    setDownloadSuccessMessage(null);

    try {
      const res = await precacheDisasterMapTiles(
        targetDisaster.locationLat,
        targetDisaster.locationLng,
        targetDisaster.title,
        (progress) => {
          setDownloadProgress(progress);
        }
      );

      if (res.success) {
        setDownloadSuccessMessage(
          `Berhasil menyimpan ${res.cachedCount} tile peta taktis untuk zona ${targetDisaster.title}. Peta siap digunakan tanpa koneksi internet!`
        );
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(null);
    }
  };

  const handleClearTiles = async () => {
    if (window.confirm('Hapus seluruh cache tile peta offline? Data yang belum tersimpan ulang akan diunduh kembali saat online.')) {
      await clearMapTilesCache();
      await fetchStats();
      setDownloadSuccessMessage('Cache tile peta berhasil dibersihkan.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Manajemen Cache Peta & Data Offline</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Service Worker Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Simpan tile peta taktis dan data posko untuk operasi relawan di zona bencana berfasilitas sinyal terbatas.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Cache Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-750">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-medium">OSM Tiles</span>
                <Layers className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="text-xl font-bold text-white">
                {stats ? stats.osmTilesCount : '...'}
              </div>
              <span className="text-[10px] text-slate-400">Peta Vektor Jalan</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-750">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-medium">Satelit Tiles</span>
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xl font-bold text-white">
                {stats ? stats.satelliteTilesCount : '...'}
              </div>
              <span className="text-[10px] text-slate-400">Citra ArcGIS</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-750">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-medium">Storage Cache</span>
                <HardDrive className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-xl font-bold text-white">
                {stats ? `${stats.storageUsedMB} MB` : '...'}
              </div>
              <span className="text-[10px] text-slate-400">Total terpakai</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-750">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-medium">Data Kritis</span>
                <Database className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-xl font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Aktif</span>
              </div>
              <span className="text-[10px] text-slate-400">Tugas & Relawan</span>
            </div>
          </div>

          {/* Success Banner */}
          {downloadSuccessMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{downloadSuccessMessage}</span>
            </div>
          )}

          {/* Download Zone Map Tiles Section */}
          <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-blue-400" />
                  Unduh Peta Offline Wilayah Bencana (Zona Siaga)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pre-cache tile peta resolusi tinggi (zoom 12-15) di sekitar episentrum agar peta tetap terbuka mulus tanpa internet.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Pilih Wilayah Operasi Tanggap Bencana
                </label>
                <select
                  value={targetDisasterId}
                  onChange={(e) => setTargetDisasterId(e.target.value)}
                  disabled={isDownloading}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {disasters.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title} ({d.address || d.province}) - Level {d.severity.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Radius Episentrum
                </label>
                <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300">
                  Episentrum 15 km (Zoom 12-15)
                </div>
              </div>
            </div>

            {/* Download Progress Bar */}
            {isDownloading && downloadProgress && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-400 font-semibold flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Mengunduh tile peta ({downloadProgress.loaded} / {downloadProgress.total})
                  </span>
                  <span className="text-slate-300 font-bold">{downloadProgress.percent}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-150"
                    style={{ width: `${downloadProgress.percent}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 truncate font-mono">
                  {downloadProgress.currentUrl}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartPrecache}
                  disabled={isDownloading || !targetDisaster}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-600/30"
                >
                  <Download className="w-4 h-4" />
                  <span>{isDownloading ? 'Sedang Mengunduh...' : 'Unduh Tile Wilayah Ini'}</span>
                </button>
                {onSelectDisaster && targetDisaster && (
                  <button
                    onClick={() => {
                      onSelectDisaster(targetDisaster.id);
                      onClose();
                    }}
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700 transition"
                  >
                    Fokus Peta ke Zona Ini
                  </button>
                )}
              </div>

              <button
                onClick={fetchStats}
                disabled={isLoadingStats}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                title="Segarkan data status cache"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingStats ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Service Worker Info & Clear Options */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p>
                Service worker menggunakan strategi <strong>CacheFirst</strong> untuk tile peta OSM dan ArcGIS sehingga setiap tile yang dilihat langsung tersimpan otomatis di perangkat hingga 30 hari.
              </p>
            </div>
            <button
              onClick={handleClearTiles}
              className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1.5 shrink-0 hover:bg-red-950/40 px-2.5 py-1.5 rounded-lg border border-red-900/40 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bersihkan Cache Peta</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
