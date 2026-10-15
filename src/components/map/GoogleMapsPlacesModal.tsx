import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  ExternalLink, 
  X, 
  Sparkles, 
  RefreshCw
} from 'lucide-react';
import { Disaster, GroundedPlace } from '../../types/index.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface GoogleMapsPlacesModalProps {
  disaster: Disaster;
  onClose: () => void;
  lang?: 'en' | 'id';
}

export const GoogleMapsPlacesModal: React.FC<GoogleMapsPlacesModalProps> = ({
  disaster,
  onClose,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState<GroundedPlace[]>([]);
  const [analysisText, setAnalysisText] = useState<string>('');
  const [, setSource] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fetchNearbyPlaces = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/nearby-places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          disasterId: disaster.id,
          lang: isEn ? 'en' : 'id'
        }),
      });

      if (!res.ok) {
        throw new Error(isEn ? 'Failed to fetch nearby medical and shelter facilities' : 'Gagal mengambil data fasilitas terdekat');
      }
      const data = await res.json();
      setPlaces(data.places || []);
      setAnalysisText(data.text || '');
      setSource(data.source || 'gemini-3.5-flash-googleMaps');
    } catch (err: any) {
      console.error(err);
      setError(err.message || (isEn ? 'An error occurred' : 'Terjadi kesalahan'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearbyPlaces();
  }, [disaster.id, isEn]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-blue-950/50 p-5 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {isEn ? 'Healthcare & Shelters (Google Maps Grounding)' : 'Faskes & Posko Evakuasi (Google Maps Grounding)'}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  gemini-3.5-flash + Google Maps
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEn 
                  ? 'Real-time discovery of referral hospitals, emergency clinics, and evacuation shelters near the disaster zone' 
                  : 'Pencarian real-time rumah sakit rujukan, puskesmas darurat, dan posko sekitar lokasi bencana'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Location bar */}
        <div className="bg-slate-950/60 px-5 py-3 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">{isEn ? 'Target Area:' : 'Titik Sasaran:'}</span>
          <span className="font-semibold text-white truncate max-w-sm">
            {disaster.title} ({disaster.locationLat.toFixed(4)}, {disaster.locationLng.toFixed(4)})
          </span>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 text-xs">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
              <p className="text-sm font-semibold text-slate-200">
                {isEn ? 'Connecting to Google Maps Grounding via Gemini 3.5 Flash...' : 'Menghubungkan ke Google Maps Grounding via Gemini 3.5 Flash...'}
              </p>
              <p className="text-xs text-slate-400 max-w-md">
                {isEn 
                  ? `Retrieving real-time geospatial data for nearest hospitals, 24h clinics, and evacuation camps around ${disaster.address || disaster.title}.`
                  : `Mengambil data geospasial real-time rumah sakit terdekat, puskesmas 24 jam, dan titik posko pengungsian di sekitar ${disaster.address || disaster.title}.`}
              </p>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-300 space-y-3">
              <p>{error}</p>
              <button
                onClick={fetchNearbyPlaces}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {isEn ? 'Retry' : 'Coba Lagi'}
              </button>
            </div>
          ) : (
            <>
              {/* AI Narrative Context */}
              {analysisText && (
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-1.5">
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {isEn ? 'Tactical Facilities & Shelter Analysis' : 'Analisis Taktis Fasilitas Medis & Posko'}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                    {analysisText}
                  </p>
                </div>
              )}

              {/* Grounded Places List with Live Google Maps Links */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block font-mono">
                  {isEn 
                    ? `Verified Google Maps Locations (${places.length} Points Found):` 
                    : `Daftar Tautan Lokasi Google Maps (${places.length} Titik Terverifikasi):`}
                </span>

                <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl bg-slate-950/40 overflow-hidden">
                  {places.map((place, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 flex items-start justify-between gap-3 hover:bg-slate-900/60 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                          <h4 className="text-xs font-bold text-white">{place.title}</h4>
                        </div>
                        {place.address && (
                          <p className="text-[11px] text-slate-400 font-mono">
                            {place.address}
                          </p>
                        )}
                        {place.type && (
                          <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {place.type}
                          </span>
                        )}
                      </div>

                      {/* Required Clickable Google Maps Link */}
                      <a
                        href={place.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/80 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 whitespace-nowrap shadow-sm"
                      >
                        <span>{isEn ? 'Open in Google Maps' : 'Buka di Google Maps'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400 font-mono">
            {isEn ? 'Direct live links to Google Maps Platform' : 'Tautan terintegrasi langsung ke Google Maps Platform'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
          >
            {isEn ? 'Close' : 'Tutup'}
          </button>
        </div>
      </div>
    </div>
  );
};
