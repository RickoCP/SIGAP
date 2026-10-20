import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.heat';
import { 
  Flame, 
  Waves, 
  Activity, 
  Compass, 
  Layers, 
  Sliders, 
  Info, 
  CheckCircle2, 
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Wind
} from 'lucide-react';
import { 
  HISTORICAL_HEATMAP_POINTS, 
  HEATMAP_GRADIENTS, 
  HeatPoint, 
  HeatmapDisasterType 
} from '../../data/historicalHeatmapData.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface RegionalDisasterHeatmapProps {
  selectedProvince?: string;
  onSelectHeatPoint?: (point: HeatPoint) => void;
}

const REGION_BOUNDS: Record<string, { center: [number, number]; zoom: number }> = {
  all: { center: [-2.5489, 118.0149], zoom: 5 },
  Sumatera: { center: [0.5897, 101.3431], zoom: 6 },
  Jawa: { center: [-7.2504, 110.1655], zoom: 7 },
  Kalimantan: { center: [-1.4326, 113.3823], zoom: 6 },
  Sulawesi: { center: [-1.4300, 121.4456], zoom: 6 },
  NusaTenggara: { center: [-8.6500, 119.5000], zoom: 7 },
};

export const RegionalDisasterHeatmap: React.FC<RegionalDisasterHeatmapProps> = ({
  selectedProvince,
  onSelectHeatPoint,
}) => {
  const { language, t } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<any>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeDisasterType, setActiveDisasterType] = useState<HeatmapDisasterType>('all');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('all');
  const [showPointMarkers, setShowPointMarkers] = useState<boolean>(true);
  const [heatRadius, setHeatRadius] = useState<number>(32);
  const [heatBlur, setHeatBlur] = useState<number>(20);
  const [activePoint, setActivePoint] = useState<HeatPoint | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-2.5489, 118.0149],
      zoom: 5,
      zoomControl: false,
      minZoom: 4,
      maxZoom: 16
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Filter points based on active disaster type
  const filteredPoints = HISTORICAL_HEATMAP_POINTS.filter(p => {
    if (activeDisasterType !== 'all' && p.type !== activeDisasterType) return false;
    return true;
  });

  // Re-render Heatmap Layer and Clickable Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 1. Clear existing heat layer
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    // 2. Format points array for leaflet.heat: [lat, lng, intensity]
    const heatData = filteredPoints.map(p => [p.lat, p.lng, p.intensity]);

    // 3. Create Heat Layer with custom gradient
    const gradient = HEATMAP_GRADIENTS[activeDisasterType] || HEATMAP_GRADIENTS.all;

    const heatLayer = (L as any).heatLayer(heatData, {
      radius: heatRadius,
      blur: heatBlur,
      maxZoom: 12,
      max: 1.0,
      gradient: gradient
    });

    heatLayer.addTo(map);
    heatLayerRef.current = heatLayer;

    // 4. Update Clickable Point Markers Layer
    const markersGroup = markersLayerRef.current;
    if (markersGroup) {
      markersGroup.clearLayers();

      if (showPointMarkers) {
        filteredPoints.forEach(p => {
          const isSelected = activePoint?.name === p.name;
          const color = p.riskLevel === 'Kritis' ? '#ef4444' : p.riskLevel === 'Tinggi' ? '#f97316' : '#eab308';

          const marker = L.circleMarker([p.lat, p.lng], {
            radius: isSelected ? 8 : 5,
            fillColor: color,
            fillOpacity: isSelected ? 0.95 : 0.75,
            color: '#ffffff',
            weight: isSelected ? 2 : 1,
          });

          // Popup content
          const popupHtml = `
            <div class="p-3 w-64 text-slate-100">
              <div class="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800">
                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase text-white" style="background-color: ${color}">
                  ${p.riskLevel === 'Kritis' ? (language === 'id' ? 'Kritis' : 'Critical') : (language === 'id' ? 'Tinggi' : 'High')} • ${p.type.toUpperCase()}
                </span>
                <span class="text-[11px] font-mono text-slate-400">${p.frequency} ${language === 'id' ? 'Kejadian' : 'Events'}</span>
              </div>
              <h5 class="font-bold text-xs text-white mb-1">${language === 'en' ? (p.nameEn || p.name) : p.name}</h5>
              <div class="text-[10px] text-slate-400 mb-2">${p.province} (${p.yearRange})</div>
              <p class="text-[11px] text-slate-300 leading-snug bg-slate-950/80 p-2 rounded border border-slate-800">${language === 'en' ? (p.descriptionEn || p.description) : p.description}</p>
            </div>
          `;

          marker.bindPopup(popupHtml, { 
            maxWidth: 280,
            autoPan: true,
            autoPanPaddingTopLeft: L.point(20, 100),
            autoPanPaddingBottomRight: L.point(20, 80)
          });

          marker.on('click', () => {
            setActivePoint(p);
            if (onSelectHeatPoint) onSelectHeatPoint(p);
          });

          markersGroup.addLayer(marker);
        });
      }
    }
  }, [filteredPoints, activeDisasterType, heatRadius, heatBlur, showPointMarkers, language]);

  // Pan to selected region
  const handleRegionZoom = (regionKey: string) => {
    setSelectedRegionFilter(regionKey);
    const target = REGION_BOUNDS[regionKey] || REGION_BOUNDS.all;
    mapInstanceRef.current?.flyTo(target.center, target.zoom, { duration: 1.2 });
  };

  const criticalPointsCount = filteredPoints.filter(p => p.riskLevel === 'Kritis').length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
      {/* Header and Disaster Type Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">
              {language === 'id' ? 'Lapisan Densitas Geospasial Bencana Indonesia (Heatmap)' : 'Indonesia Disaster Geospatial Density Heatmap Layer'}
            </span>
          </div>
          <h3 className="text-lg font-black text-white">
            {t.heatmapTitle}
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl">
            {t.heatmapSubtitle}
          </p>
        </div>

        {/* Quick Census Badge */}
        <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs shrink-0">
          <div>
            <div className="text-[10px] text-slate-400 font-medium">
              {language === 'id' ? 'Titik Rawan Terdata' : 'Recorded Hotspots'}
            </div>
            <div className="text-base font-black text-white">
              {filteredPoints.length} {language === 'id' ? 'Lokasi' : 'Locations'}
            </div>
          </div>
          <div className="border-l border-slate-800 pl-3">
            <div className="text-[10px] text-slate-400 font-medium">
              {language === 'id' ? 'Zona Risiko Kritis' : 'Critical Risk Zones'}
            </div>
            <div className="text-base font-black text-red-400">{criticalPointsCount}</div>
          </div>
        </div>
      </div>

      {/* DISASTER TYPE SELECTOR PILLS */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-400 font-medium mr-1">
          {language === 'id' ? 'Pilih Bencana:' : 'Select Hazard:'}
        </span>

        <button
          onClick={() => setActiveDisasterType('all')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
            activeDisasterType === 'all'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400'
              : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <span>🌐</span> {t.disasterAll}
        </button>

        <button
          onClick={() => setActiveDisasterType('flood')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
            activeDisasterType === 'flood'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 ring-1 ring-cyan-400'
              : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <span>🌊</span> {t.disasterFlood}
        </button>

        <button
          onClick={() => setActiveDisasterType('fire')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
            activeDisasterType === 'fire'
              ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30 ring-1 ring-orange-400'
              : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <span>🔥</span> {t.disasterFire}
        </button>

        <button
          onClick={() => setActiveDisasterType('earthquake')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
            activeDisasterType === 'earthquake'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 ring-1 ring-amber-400'
              : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <span>⚠️</span> {t.disasterEarthquake}
        </button>

        <button
          onClick={() => setActiveDisasterType('landslide')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
            activeDisasterType === 'landslide'
              ? 'bg-lime-600 text-white shadow-md shadow-lime-600/30 ring-1 ring-lime-400'
              : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <span>⛰️</span> {t.disasterLandslide}
        </button>

        <button
          onClick={() => setActiveDisasterType('volcano')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
            activeDisasterType === 'volcano'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-1 ring-rose-400'
              : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <span>🌋</span> {t.disasterVolcano}
        </button>

        <button
          onClick={() => setActiveDisasterType('storm')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
            activeDisasterType === 'storm'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-1 ring-purple-400'
              : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <span>🌪️</span> {t.disasterStorm}
        </button>
      </div>

      {/* Region Navigation & Heatmap Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-950/70 p-2 rounded-lg border border-slate-800">
        {/* Region Pills */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-slate-400 font-medium mr-1">{t.filterIsland}</span>
          {[
            { key: 'all', label: t.islandAll },
            { key: 'Sumatera', label: t.islandSumatra },
            { key: 'Jawa', label: t.islandJava },
            { key: 'Kalimantan', label: t.islandKalimantan },
            { key: 'Sulawesi', label: t.islandSulawesi },
            { key: 'NusaTenggara', label: t.islandNusaTenggara }
          ].map(r => (
            <button
              key={r.key}
              onClick={() => handleRegionZoom(r.key)}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                selectedRegionFilter === r.key ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Heatmap Slider & Pins Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400">
              {language === 'id' ? 'Radius Panas:' : 'Heat Radius:'}
            </span>
            <input
              type="range"
              min="18"
              max="50"
              value={heatRadius}
              onChange={(e) => setHeatRadius(Number(e.target.value))}
              className="w-20 accent-blue-500 h-1 bg-slate-800 rounded"
            />
          </div>

          <button
            onClick={() => setShowPointMarkers(!showPointMarkers)}
            className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
              showPointMarkers ? 'bg-blue-950 text-blue-300 border-blue-800' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {showPointMarkers 
              ? (language === 'id' ? 'Titik Episentrum: Aktif' : 'Epicenter Pins: Visible') 
              : (language === 'id' ? 'Titik Episentrum: Sembunyi' : 'Epicenter Pins: Hidden')}
          </button>
        </div>
      </div>

      {/* Main Heatmap Container */}
      <div className="relative isolate w-full h-[520px] rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Heat Gradient Legend */}
        <div className="absolute bottom-4 left-4 z-20 bg-slate-950/90 backdrop-blur-md p-3 rounded-lg border border-slate-800 text-xs text-slate-300 shadow-xl space-y-2 pointer-events-none sm:pointer-events-auto">
          <div className="font-bold text-white text-[11px] uppercase tracking-wider flex items-center justify-between gap-4">
            <span>{language === 'id' ? 'Intensitas Kerawanan' : 'Hazard Vulnerability Intensity'}</span>
            <span className="text-[10px] text-slate-400 font-mono">2021 - 2026</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400">{language === 'id' ? 'Rendah' : 'Low'}</span>
            <div className="w-32 h-2.5 rounded-full overflow-hidden bg-gradient-to-r from-sky-400 via-amber-400 via-orange-500 to-red-600"></div>
            <span className="text-[10px] text-red-400 font-bold">{language === 'id' ? 'Kritis' : 'Critical'}</span>
          </div>

          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
            <span>{language === 'id' ? 'Titik merah: Lokasi kejadian berulang frekuensi tinggi' : 'Red spots: High-frequency recurrent disaster zones'}</span>
          </div>
        </div>

        {/* Active Point Quick Inspector Drawer */}
        {activePoint && (
          <div className="absolute top-4 right-4 z-20 bg-slate-950/95 backdrop-blur-md p-4 rounded-xl border border-slate-700 text-xs text-slate-200 shadow-2xl max-w-xs space-y-2 animate-in fade-in">
            <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-800">
              <div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                  activePoint.riskLevel === 'Kritis' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-orange-950 text-orange-400 border border-orange-800'
                }`}>
                  {language === 'id' ? `Zona ${activePoint.riskLevel}` : `${activePoint.riskLevel === 'Kritis' ? 'Critical' : 'High'} Risk Zone`}
                </span>
                <h4 className="font-bold text-sm text-white mt-1 leading-snug">
                  {language === 'en' ? (activePoint.nameEn || activePoint.name) : activePoint.name}
                </h4>
                <div className="text-[11px] text-slate-400">{activePoint.province}</div>
              </div>
              <button
                onClick={() => setActivePoint(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="text-xs bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px]">{language === 'id' ? 'Frekuensi Kejadian:' : 'Event Frequency:'}</span>
              <div className="font-black text-amber-400 text-sm">{activePoint.frequency} {language === 'id' ? 'Kejadian' : 'Events'} ({activePoint.yearRange})</div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-900/60 p-2 rounded border border-slate-800/80">
              {language === 'en' ? (activePoint.descriptionEn || activePoint.description) : activePoint.description}
            </p>

            <button
              onClick={() => {
                mapInstanceRef.current?.flyTo([activePoint.lat, activePoint.lng], 11, { duration: 0.8 });
              }}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-1.5 px-3 rounded text-xs transition-colors"
            >
              {language === 'id' ? 'Perbesar Lokasi Zona Ini' : 'Zoom to This Hotspot'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
