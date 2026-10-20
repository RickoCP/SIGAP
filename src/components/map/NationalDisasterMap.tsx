import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { 
  Flame, 
  Waves, 
  Activity, 
  AlertTriangle, 
  MapPin, 
  Users, 
  Home, 
  ShieldAlert, 
  Compass, 
  Filter, 
  ChevronRight, 
  Maximize2,
  Wind,
  Droplets,
  Layers,
  ChevronDown,
  ChevronUp,
  Radar,
  Siren,
  BellRing
} from 'lucide-react';
import { Disaster, IndonesiaRegion, MultiHazardIncident } from '../../types/index.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { getLocalizedDisaster } from '../../i18n/translations.ts';
import { InaRiskExposureLayer } from './InaRiskExposureLayer.tsx';

interface NationalDisasterMapProps {
  disasters: Disaster[];
  onSelectDisaster: (id: string) => void;
  onNavigateToTacticalMap: (disasterId: string) => void;
  onNavigateToMultiHazard?: (incidentId?: string) => void;
}

const REGION_COORDINATES: Record<string, { center: [number, number]; zoom: number }> = {
  all: { center: [-2.5489, 118.0149], zoom: 5 },
  Sumatera: { center: [0.5897, 101.3431], zoom: 6 },
  Jawa: { center: [-7.2504, 110.1655], zoom: 7 },
  Kalimantan: { center: [-1.4326, 113.3823], zoom: 6 },
  Sulawesi: { center: [-1.4300, 121.4456], zoom: 6 },
  'Bali-NusaTenggara': { center: [-8.6500, 117.5000], zoom: 7 },
  'Maluku-Papua': { center: [-3.2000, 134.0000], zoom: 6 },
};

export const NationalDisasterMap: React.FC<NationalDisasterMapProps> = ({
  disasters,
  onSelectDisaster,
  onNavigateToTacticalMap,
  onNavigateToMultiHazard
}) => {
  const { language, t } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const disasterLayerRef = useRef<L.LayerGroup | null>(null);
  const radiusLayerRef = useRef<L.LayerGroup | null>(null);
  const hazardLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedDisasterId, setSelectedDisasterId] = useState<string>(disasters[0]?.id || '');
  const [isLegendExpanded, setIsLegendExpanded] = useState<boolean>(true);

  // Multi-Hazard Real-Time Incidents Sync State
  const [hazardIncidents, setHazardIncidents] = useState<MultiHazardIncident[]>([]);
  const [showMultiHazardOverlay, setShowMultiHazardOverlay] = useState<boolean>(true);
  const [showInaRiskExposure, setShowInaRiskExposure] = useState<boolean>(true);

  // Poll Multi-Hazard incidents every 12 seconds so actions in Command Center auto-update here
  const fetchHazardIncidents = async () => {
    try {
      const res = await fetch('/api/hazard/incidents');
      if (res.ok) {
        const data: MultiHazardIncident[] = await res.json();
        setHazardIncidents(data);
      }
    } catch (e) {
      console.warn('Failed to load multi-hazard incidents for national map:', e);
    }
  };

  useEffect(() => {
    fetchHazardIncidents();
    const interval = setInterval(fetchHazardIncidents, 12000);
    const handleSync = () => {
      fetchHazardIncidents();
    };
    window.addEventListener('sigap:hazard-updated', handleSync);
    return () => {
      clearInterval(interval);
      window.removeEventListener('sigap:hazard-updated', handleSync);
    };
  }, []);

  // Localize disasters collection based on active language
  const localizedDisasters = useMemo(() => {
    return disasters.map(d => getLocalizedDisaster(d, language));
  }, [disasters, language]);

  // Active disaster localized
  const activeDisaster = useMemo(() => {
    const found = localizedDisasters.find(d => d.id === selectedDisasterId);
    return found || localizedDisasters[0] || null;
  }, [localizedDisasters, selectedDisasterId]);

  // Initialize National Map
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
      maxZoom: 19,
    }).addTo(map);

    const radiusGroup = L.layerGroup().addTo(map);
    radiusLayerRef.current = radiusGroup;

    const hazardGroup = L.layerGroup().addTo(map);
    hazardLayerRef.current = hazardGroup;

    const layerGroup = L.layerGroup().addTo(map);
    disasterLayerRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Pan to selected region
  const handleRegionChange = (reg: string) => {
    setSelectedRegion(reg);
    const target = REGION_COORDINATES[reg] || REGION_COORDINATES.all;
    mapInstanceRef.current?.flyTo(target.center, target.zoom, { duration: 1.5 });
  };

  // Filtered disasters
  const filteredDisasters = localizedDisasters.filter(d => {
    if (selectedRegion !== 'all' && d.region !== selectedRegion) return false;
    if (selectedType !== 'all' && d.type !== selectedType) return false;
    if (selectedSeverity !== 'all' && d.severity !== selectedSeverity) return false;
    return true;
  });

  // Render Disaster Markers on National Map (Stable across selection to protect open popups)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = disasterLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    filteredDisasters.forEach(d => {
      const isFire = d.type === 'fire';
      const isFlood = d.type === 'flood';

      const color = d.severity === 'critical' ? '#ef4444' : d.severity === 'high' ? '#f97316' : '#eab308';
      const iconEmoji = isFire ? '🔥' : isFlood ? '🌊' : '⚠️';
      const typeLabel = isFire 
        ? (language === 'id' ? 'KARHUTLA' : 'WILDFIRE') 
        : isFlood 
        ? (language === 'id' ? 'BANJIR' : 'FLOOD') 
        : (language === 'id' ? 'GEMPA' : 'QUAKE');

      // Custom pulsing pulse icon
      const customIcon = L.divIcon({
        className: 'custom-disaster-marker',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-125">
            <span class="absolute w-8 h-8 rounded-full" style="background-color: ${color}; opacity: 0.35;"></span>
            <div class="relative w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-xl border-2" 
                 style="background-color: ${color}; border-color: rgba(255,255,255,0.8)">
              ${iconEmoji}
            </div>
            <div class="absolute -bottom-5 whitespace-nowrap bg-slate-950/90 text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-700 text-slate-200 shadow-md">
              ${d.province}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18]
      });

      const marker = L.marker([d.locationLat, d.locationLng], { icon: customIcon });

      const severityBadge = d.severity === 'critical' 
        ? (language === 'id' ? 'KRITIS' : 'CRITICAL')
        : d.severity === 'high' 
        ? (language === 'id' ? 'SIAGA TINGGI' : 'HIGH ALERT')
        : (language === 'id' ? 'WASPADA' : 'ADVISORY');

      const affectedLabel = language === 'id' ? 'Terdampak' : 'Affected';
      const soulsLabel = language === 'id' ? 'jiwa' : 'people';
      const sheltersLabel = language === 'id' ? 'Posko' : 'Shelters';
      const openTacticalBtnLabel = language === 'id' ? 'Buka Peta Taktis Operasi →' : 'Open Tactical Command Map →';

      marker.bindPopup(`
        <div class="p-2 min-w-[220px] text-slate-900 font-sans">
          <div class="flex items-center gap-1.5 mb-1">
            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase" style="background-color: ${color}20; color: ${color}">
              ${typeLabel} • ${severityBadge}
            </span>
          </div>
          <h4 class="font-bold text-xs text-slate-900 leading-tight mb-1">${language === 'en' ? (d.titleEn || d.title) : d.title}</h4>
          <p class="text-[11px] text-slate-600 mb-2 leading-relaxed line-clamp-2">${language === 'en' ? (d.descriptionEn || d.description) : d.description}</p>
          <div class="flex items-center justify-between text-[10px] text-slate-500 border-t pt-1.5 mb-2">
            <span>${affectedLabel}: <strong>${d.affectedPeople.toLocaleString()} ${soulsLabel}</strong></span>
            <span>${sheltersLabel}: <strong>${d.evacuationCenterCount}</strong></span>
          </div>
          <button 
            id="popup-btn-${d.id}"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-[11px] transition cursor-pointer shadow-sm"
          >
            ${openTacticalBtnLabel}
          </button>
        </div>
      `, {
        maxWidth: 290,
        autoPan: true,
        autoPanPaddingTopLeft: L.point(20, 100),
        autoPanPaddingBottomRight: L.point(20, 90)
      });

      marker.on('click', () => {
        setSelectedDisasterId(d.id);
        onSelectDisaster(d.id);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-${d.id}`);
        if (btn) {
          btn.onclick = () => onNavigateToTacticalMap(d.id);
        }
      });

      layer.addLayer(marker);
    });
  }, [filteredDisasters, language, onSelectDisaster, onNavigateToTacticalMap]);

  // Render Hazard Radius Rings (Updates smoothly when selected disaster changes without destroying markers or popups)
  useEffect(() => {
    const radiusLayer = radiusLayerRef.current;
    if (!radiusLayer) return;

    radiusLayer.clearLayers();

    filteredDisasters.forEach(d => {
      const isFire = d.type === 'fire';
      const isFlood = d.type === 'flood';
      const isSelected = activeDisaster?.id === d.id;
      const color = d.severity === 'critical' ? '#ef4444' : d.severity === 'high' ? '#f97316' : '#eab308';
      const radiusKm = isFire ? 15000 : isFlood ? 8000 : 25000;

      const radiusCircle = L.circle([d.locationLat, d.locationLng], {
        radius: radiusKm,
        color: color,
        fillColor: color,
        fillOpacity: isSelected ? 0.16 : 0.05,
        weight: isSelected ? 2.5 : 1,
        dashArray: isSelected ? undefined : '4, 4'
      });
      radiusLayer.addLayer(radiusCircle);
    });
  }, [filteredDisasters, activeDisaster]);

  // Render Multi-Hazard Incidents & EWS Overlay on National Map (Live synchronized with Command Center actions)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = hazardLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    if (!showMultiHazardOverlay) return;

    hazardIncidents.forEach(inc => {
      const isEwsActive = inc.responseWorkflow?.isCommunityEarlyWarningActive;
      const isCritical = inc.priority === 'P1_CRITICAL';

      let iconEmoji = '⚠️';
      let mainColor = '#f97316';
      if (inc.hazardType === 'VOLCANO') {
        iconEmoji = '🌋';
        mainColor = '#ea580c';
      } else if (inc.hazardType === 'WILDFIRE') {
        iconEmoji = '🔥';
        mainColor = '#f59e0b';
      } else if (inc.hazardType === 'EARTHQUAKE') {
        iconEmoji = '⚡';
        mainColor = '#e11d48';
      } else if (inc.hazardType === 'TSUNAMI') {
        iconEmoji = '🌊';
        mainColor = '#06b6d4';
      } else if (inc.hazardType === 'FLOOD' || inc.hazardType === 'FLASH_FLOOD') {
        iconEmoji = '🌊';
        mainColor = '#2563eb';
      }

      // 1. Draw danger geofence circle around the incident epicenter
      const radiusMeters = (inc.affectedArea.radiusKm || 10) * 1000;
      const dangerCircle = L.circle([inc.affectedArea.centerLat, inc.affectedArea.centerLng], {
        radius: radiusMeters,
        color: isEwsActive ? '#ef4444' : mainColor,
        fillColor: isEwsActive ? '#ef4444' : mainColor,
        fillOpacity: isEwsActive ? 0.22 : 0.08,
        weight: isEwsActive ? 2.5 : 1.5,
        dashArray: isEwsActive ? undefined : '5, 5'
      });
      layer.addLayer(dangerCircle);

      // 2. Custom Marker with pulsing ping when Early Warning Siren is active
      const markerHtml = isEwsActive
        ? `
          <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-125">
            <span class="absolute w-10 h-10 rounded-full bg-rose-500 animate-ping opacity-75"></span>
            <div class="relative w-9 h-9 rounded-full flex items-center justify-center text-base shadow-2xl border-2 border-white bg-rose-600 text-white font-bold">
              🚨
            </div>
            <div class="absolute -bottom-5 whitespace-nowrap bg-rose-950/95 text-[9px] font-black px-1.5 py-0.5 rounded border border-rose-500 text-rose-200 shadow-xl animate-pulse">
              ${language === 'id' ? 'EWS AKTIF' : 'EWS ACTIVE'} (${inc.priority.replace('_', ' ')})
            </div>
          </div>
        `
        : `
          <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-125">
            <span class="absolute w-8 h-8 rounded-full" style="background-color: ${mainColor}; opacity: 0.35;"></span>
            <div class="relative w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-xl border-2 border-white" style="background-color: ${mainColor}">
              ${iconEmoji}
            </div>
            <div class="absolute -bottom-5 whitespace-nowrap bg-slate-950/90 text-[9px] font-bold px-1.5 py-0.5 rounded border border-slate-700 text-slate-200 shadow-md">
              ${inc.hazardType} (${inc.riskScore})
            </div>
          </div>
        `;

      const customIcon = L.divIcon({
        className: 'custom-hazard-incident-marker',
        html: markerHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20]
      });

      const marker = L.marker([inc.affectedArea.centerLat, inc.affectedArea.centerLng], { icon: customIcon });

      const ewsStatusBadge = isEwsActive
        ? `<span class="bg-rose-950 text-rose-300 border border-rose-600 text-[10px] font-black px-1.5 py-0.5 rounded animate-pulse">${language === 'id' ? '🚨 SIRINE & PERINGATAN WARGA AKTIF' : '🚨 PUBLIC SIREN & EWS ACTIVE'}</span>`
        : `<span class="bg-slate-800 text-slate-300 text-[10px] font-bold px-1.5 py-0.5 rounded">${language === 'id' ? '⚪ Standby Komando' : '⚪ Command Standby'} (Step ${inc.responseWorkflow?.currentStep || 1}/6)</span>`;

      const title = language === 'en' && inc.titleEn ? inc.titleEn : inc.title;
      const openCommandCenterLabel = language === 'id' ? 'Buka Pusat Komando Multi-Hazard →' : 'Open Multi-Hazard Command Center →';

      marker.bindPopup(`
        <div class="p-2.5 min-w-[240px] text-slate-900 font-sans">
          <div class="flex items-center justify-between gap-1.5 mb-1.5">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
              isCritical ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
            }">
              ${inc.priority.replace('_', ' ')} • ${language === 'id' ? 'SKOR' : 'SCORE'} ${inc.riskScore}/100
            </span>
            <span class="text-[10px] text-slate-500 font-mono">Radius ${inc.affectedArea.radiusKm} km</span>
          </div>

          <h4 class="font-bold text-xs text-slate-900 leading-tight mb-1.5">${title}</h4>
          
          <div class="mb-2">
            ${ewsStatusBadge}
          </div>

          <div class="space-y-1 text-[11px] text-slate-600 border-t border-slate-200 pt-1.5 mb-2.5">
            <div class="flex justify-between">
              <span>${language === 'id' ? 'Wilayah:' : 'Region:'}</span>
              <strong class="text-slate-800">${inc.affectedArea.administrativeArea}</strong>
            </div>
            <div class="flex justify-between">
              <span>${language === 'id' ? 'Warga Terpapar:' : 'Exposed Population:'}</span>
              <strong class="text-slate-800">${inc.exposure.estimatedPopulation.toLocaleString('id-ID')} ${language === 'id' ? 'jiwa' : 'people'}</strong>
            </div>
            <div class="flex justify-between">
              <span>${language === 'id' ? 'Kelompok Rentan:' : 'Vulnerable Persons:'}</span>
              <strong class="text-amber-700">${inc.exposure.vulnerablePersons.toLocaleString('id-ID')} ${language === 'id' ? 'jiwa' : 'people'}</strong>
            </div>
          </div>

          <button 
            id="popup-btn-hazard-${inc.id}"
            class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-1.5 px-2.5 rounded-lg text-xs transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>${openCommandCenterLabel}</span>
          </button>
        </div>
      `, {
        maxWidth: 300,
        autoPan: true,
        autoPanPaddingTopLeft: L.point(20, 100),
        autoPanPaddingBottomRight: L.point(20, 90)
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-hazard-${inc.id}`);
        if (btn && onNavigateToMultiHazard) {
          btn.onclick = () => onNavigateToMultiHazard(inc.id);
        }
      });

      layer.addLayer(marker);
    });
  }, [hazardIncidents, showMultiHazardOverlay, language, onNavigateToMultiHazard]);


  // Aggregate metrics
  const totalAffected = filteredDisasters.reduce((acc, d) => acc + d.affectedPeople, 0);
  const totalEvacuationCenters = filteredDisasters.reduce((acc, d) => acc + d.evacuationCenterCount, 0);
  const totalHotspots = filteredDisasters.reduce((acc, d) => acc + (d.activeHotspots || 0), 0);

  return (
    <div className="space-y-4">
      {/* Top Header & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                {language === 'id' ? 'Pusat Komando Tanggap Bencana Nasional' : 'National Disaster Emergency Command'}
              </span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              {language === 'id' ? 'Peta Makro Bencana Seluruh Indonesia' : 'National Macro Disaster Overview Map'}
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'id' 
                ? 'Monitoring real-time bencana aktif, titik karhutla, banjir luapan, dan pergerakan tim tanggap darurat antar pulau.'
                : 'Real-time telemetry monitoring active disasters, wildfire hotspots, river floods, and volunteer dispatch across islands.'}
            </p>
          </div>

          {/* Quick Aggregate Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-xs">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                {language === 'id' ? 'Titik Kejadian' : 'Incident Points'}
              </div>
              <div className="text-lg font-black text-white tabular-nums">
                {filteredDisasters.length} <span className="text-[11px] font-normal text-slate-400">{language === 'id' ? 'Lokasi' : 'Zones'}</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                {language === 'id' ? 'Jiwa Terdampak' : 'Affected People'}
              </div>
              <div className="text-lg font-black text-amber-400 tabular-nums">
                {totalAffected.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                {language === 'id' ? 'Hotspot Karhutla' : 'Fire Hotspots'}
              </div>
              <div className="text-lg font-black text-orange-400 tabular-nums">
                {totalHotspots} <span className="text-[11px] font-normal text-slate-400">{language === 'id' ? 'Titik' : 'Points'}</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                {language === 'id' ? 'Posko Pengungsian' : 'Evacuation Shelters'}
              </div>
              <div className="text-lg font-black text-blue-400 tabular-nums">
                {totalEvacuationCenters} <span className="text-[11px] font-normal text-slate-400">{language === 'id' ? 'Posko' : 'Shelters'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-xs">
          {/* Region Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 font-medium mr-1">
              {language === 'id' ? 'Wilayah:' : 'Region:'}
            </span>
            {[
              { id: 'all', label: t.natMapAllIndonesia },
              { id: 'Sumatera', label: t.natMapSumatra },
              { id: 'Jawa', label: t.natMapJava },
              { id: 'Kalimantan', label: t.natMapKalimantan },
              { id: 'Sulawesi', label: t.natMapSulawesi },
              { id: 'Bali-NusaTenggara', label: t.natMapBaliNusa }
            ].map(reg => (
              <button
                key={reg.id}
                onClick={() => handleRegionChange(reg.id)}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedRegion === reg.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750 hover:text-white'
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>

          {/* Type & Severity Selectors + Live Multi-Hazard Sync Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowMultiHazardOverlay(!showMultiHazardOverlay)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded border text-xs font-bold transition-all cursor-pointer ${
                showMultiHazardOverlay
                  ? 'bg-rose-950/80 border-rose-500/80 text-rose-300 shadow-md ring-1 ring-rose-500/40'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title={language === 'id' ? 'Aktifkan/Nonaktifkan Tampilan Insiden Multi-Hazard & EWS Real-Time' : 'Toggle Real-Time Multi-Hazard & EWS Incidents Overlay'}
            >
              <Siren className={`w-3.5 h-3.5 ${showMultiHazardOverlay ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
              <span>
                {language === 'id'
                  ? `Multi-Hazard & EWS (${hazardIncidents.filter(i => i.responseWorkflow?.isCommunityEarlyWarningActive).length} Alarm Aktif)`
                  : `Multi-Hazard & EWS (${hazardIncidents.filter(i => i.responseWorkflow?.isCommunityEarlyWarningActive).length} Alarms Active)`}
              </span>
            </button>

            <button
              onClick={() => setShowInaRiskExposure(!showInaRiskExposure)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded border text-xs font-bold transition-all cursor-pointer ${
                showInaRiskExposure
                  ? 'bg-rose-950/80 border-rose-500/80 text-rose-300 shadow-md ring-1 ring-rose-500/40'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title={language === 'id' ? 'Aktifkan/Nonaktifkan Lapisan Kepadatan Warga Rentan BNPB InaRISK' : 'Toggle BNPB InaRISK Vulnerable Population Density Overlays'}
            >
              <ShieldAlert className={`w-3.5 h-3.5 ${showInaRiskExposure ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
              <span>
                {language === 'id' ? 'InaRISK Warga Rentan' : 'InaRISK Exposure'}
              </span>
            </button>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-800 text-slate-200 py-1 px-2.5 rounded border border-slate-700 focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
            >
              <option value="all">{t.natMapAllTypes}</option>
              <option value="fire">{t.natMapFire}</option>
              <option value="flood">{t.natMapFlood}</option>
              <option value="earthquake">{t.natMapEarthquake}</option>
            </select>

            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-slate-800 text-slate-200 py-1 px-2.5 rounded border border-slate-700 focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
            >
              <option value="all">{t.natMapAllSeverities}</option>
              <option value="critical">{t.natMapCritical}</option>
              <option value="high">{t.natMapHigh}</option>
              <option value="medium">{t.natMapMedium}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Map + Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Full Map Container */}
        <div className="lg:col-span-8 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative isolate shadow-2xl h-[680px]">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* BNPB InaRISK Vulnerable Population Density & Resource Deployment Layer */}
          <InaRiskExposureLayer
            map={mapInstanceRef.current}
            enabled={showInaRiskExposure}
            onDeployResourcesToZone={(zone) => {
              if (onNavigateToMultiHazard) {
                onNavigateToMultiHazard(zone.id);
              }
            }}
          />

          {/* Floating Map Legend (Collapsible & Non-blocking) */}
          <div className="absolute bottom-4 left-4 z-20 pointer-events-auto">
            {isLegendExpanded ? (
              <div className="bg-slate-950/90 backdrop-blur-md p-2.5 rounded-lg border border-slate-800 text-xs text-slate-300 shadow-xl space-y-1.5 min-w-[170px]">
                <div className="flex items-center justify-between font-bold text-white text-[11px] uppercase tracking-wider mb-1 border-b border-slate-800 pb-1">
                  <span>{t.natMapLegendTitle}</span>
                  <button
                    onClick={() => setIsLegendExpanded(false)}
                    className="p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title={language === 'id' ? 'Sembunyikan Legenda' : 'Collapse Legend'}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center text-[10px]">🔥</span>
                  <span>{t.natMapLegendFire}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[10px]">🌊</span>
                  <span>{t.natMapLegendFlood}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-amber-600 flex items-center justify-center text-[10px]">⚠️</span>
                  <span>{t.natMapLegendEarthquake}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-orange-600 flex items-center justify-center text-[10px]">🌋</span>
                  <span>{language === 'id' ? 'Erupsi Gunung Api' : 'Volcanic Eruption'}</span>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                  <span className="w-4 h-4 rounded-full bg-rose-600 flex items-center justify-center text-[10px] animate-pulse">🚨</span>
                  <span className="font-bold text-rose-300">{language === 'id' ? 'EWS Sirine Aktif' : 'Active EWS Sirens'}</span>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                  <span className="w-3.5 h-3.5 rounded-full bg-rose-600 flex items-center justify-center text-[8px] font-bold text-white">🛡️</span>
                  <span className="font-bold text-rose-300">{language === 'id' ? 'InaRISK Warga Rentan' : 'InaRISK Exposure'}</span>
                </div>
                <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full border border-red-400 bg-red-400/20 inline-block"></span>
                  <span>{t.natMapLegendRadius}</span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsLegendExpanded(true)}
                className="bg-slate-950/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-800 text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-all shadow-xl flex items-center gap-1.5 cursor-pointer"
                title={language === 'id' ? 'Tampilkan Legenda Peta' : 'Show Map Legend'}
              >
                <span>🗺️</span>
                <span>{t.natMapLegendTitle}</span>
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Command Center Detail & Event Feed */}
        <div className="lg:col-span-4 space-y-4">
          {activeDisaster ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                      activeDisaster.severity === 'critical' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-orange-950 text-orange-400 border border-orange-800'
                    }`}>
                      {activeDisaster.severity.toUpperCase()}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">{activeDisaster.region} • {activeDisaster.province}</span>
                  </div>
                  <h3 className="font-black text-base text-white leading-snug">{activeDisaster.title}</h3>
                </div>
              </div>

              {/* Threat Specific Telemetry */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {activeDisaster.type === 'fire' ? (
                  <>
                    <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-400" /> {t.natMapHotspots}
                      </div>
                      <div className="text-lg font-black text-orange-400">
                        {activeDisaster.activeHotspots || 68} {language === 'id' ? 'Titik' : 'Points'}
                      </div>
                    </div>
                    <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                        <Wind className="w-3 h-3 text-amber-400" /> {language === 'id' ? 'Arah Asap' : 'Haze Drift'}
                      </div>
                      <div className="text-lg font-black text-amber-300">
                        {language === 'id' ? 'Tenggara (18 km/j)' : 'SE (18 km/h)'}
                      </div>
                    </div>
                  </>
                ) : activeDisaster.type === 'flood' ? (
                  <>
                    <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-blue-400" /> {t.natMapWaterLevel}
                      </div>
                      <div className="text-lg font-black text-blue-400">{activeDisaster.waterLevelCm || 250} cm</div>
                    </div>
                    <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                        <Waves className="w-3 h-3 text-cyan-400" /> {language === 'id' ? 'Status Aliran' : 'Flow Status'}
                      </div>
                      <div className="text-lg font-black text-cyan-300">
                        {language === 'id' ? 'Siaga 1 (Deras)' : 'Alert 1 (Swift)'}
                      </div>
                    </div>
                  </>
                ) : null}

                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" /> {language === 'id' ? 'Warga Terdampak' : 'Affected People'}
                  </div>
                  <div className="text-lg font-black text-white">
                    {activeDisaster.affectedPeople.toLocaleString()} {t.natMapSouls}
                  </div>
                </div>
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                    <Home className="w-3 h-3 text-slate-400" /> {language === 'id' ? 'Titik Pengungsi' : 'Shelter Pos'}
                  </div>
                  <div className="text-lg font-black text-white">
                    {activeDisaster.evacuationCenterCount} {t.natMapHouseholds === 'KK' ? 'Posko' : 'Shelters'}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="text-xs font-semibold text-slate-300 mb-1">
                  {t.natMapDescSituation}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/40 p-2.5 rounded border border-slate-800/80">
                  {activeDisaster.description}
                </p>
              </div>

              {/* Key Needs Pills */}
              <div>
                <div className="text-xs font-semibold text-slate-300 mb-1.5">
                  {t.natMapImmediateNeeds}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeDisaster.keyNeeds.map((need, i) => (
                    <span key={i} className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-medium">
                      • {need}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => onNavigateToTacticalMap(activeDisaster.id)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  <Compass className="w-4 h-4" />
                  {t.natMapOpenTactical}
                </button>
              </div>
            </div>
          ) : null}

          {/* Active Disasters Quick List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              {t.natMapMonitoredTitle} ({filteredDisasters.length})
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {filteredDisasters.map(d => {
                const isSelected = activeDisaster?.id === d.id;
                const isFire = d.type === 'fire';
                const isFlood = d.type === 'flood';
                return (
                  <div
                    key={d.id}
                    onClick={() => {
                      setSelectedDisasterId(d.id);
                      mapInstanceRef.current?.flyTo([d.locationLat, d.locationLng], 9, { duration: 1.0 });
                    }}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-600/80 shadow-md'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0">{isFire ? '🔥' : isFlood ? '🌊' : '⚠️'}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {language === 'en' ? (d.titleEn || d.title) : d.title}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {d.province} • {d.affectedPeople.toLocaleString()} {t.natMapSouls}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
