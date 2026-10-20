import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Compass, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2,
  Building2, 
  Hospital, 
  School, 
  Tent, 
  MapPin, 
  ShieldAlert, 
  Flame, 
  Waves, 
  Mountain, 
  Eye, 
  EyeOff,
  Navigation
} from 'lucide-react';
import { MultiHazardIncident, CriticalFacility } from '../../types/index.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface IncidentLocationMapProps {
  incident: MultiHazardIncident;
  heightClass?: string;
  onNavigateToFullMap?: (incidentId: string) => void;
}

export const IncidentLocationMap: React.FC<IncidentLocationMapProps> = ({
  incident,
  heightClass = 'h-[440px]',
  onNavigateToFullMap
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const epicenterLayerRef = useRef<L.LayerGroup | null>(null);
  const radiusLayerRef = useRef<L.LayerGroup | null>(null);
  const polygonLayerRef = useRef<L.LayerGroup | null>(null);
  const facilitiesLayerRef = useRef<L.LayerGroup | null>(null);
  const observationsLayerRef = useRef<L.LayerGroup | null>(null);

  const [tileLayerType, setTileLayerType] = useState<'dark' | 'satellite'>('dark');
  const [showRadius, setShowRadius] = useState<boolean>(true);
  const [showFacilities, setShowFacilities] = useState<boolean>(true);
  const [showPolygon, setShowPolygon] = useState<boolean>(true);
  const [selectedFacility, setSelectedFacility] = useState<CriticalFacility | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Fullscreen change listener & Escape key handler
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 200);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        setTimeout(() => mapInstanceRef.current?.invalidateSize(), 200);
      }
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    const next = !isFullscreen;
    setIsFullscreen(next);
    if (!next && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else if (next && mapWrapperRef.current && mapWrapperRef.current.requestFullscreen) {
      mapWrapperRef.current.requestFullscreen().catch(() => {});
    }
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 250);
  };

  const { centerLat, centerLng, radiusKm, polygon, administrativeArea, province } = incident.affectedArea;
  const isCritical = incident.priority === 'P1_CRITICAL';
  const isHigh = incident.priority === 'P2_HIGH';
  const mainColor = isCritical ? '#ef4444' : isHigh ? '#f97316' : '#eab308';

  // Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
      closePopupOnClick: false
    });

    const tileUrl = tileLayerType === 'dark'
      ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

    L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);

    const radiusGroup = L.layerGroup().addTo(map);
    radiusLayerRef.current = radiusGroup;

    const polygonGroup = L.layerGroup().addTo(map);
    polygonLayerRef.current = polygonGroup;

    const obsGroup = L.layerGroup().addTo(map);
    observationsLayerRef.current = obsGroup;

    const facGroup = L.layerGroup().addTo(map);
    facilitiesLayerRef.current = facGroup;

    const epiGroup = L.layerGroup().addTo(map);
    epicenterLayerRef.current = epiGroup;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Tile Layer Switching
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    const tileUrl = tileLayerType === 'dark'
      ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

    L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);
  }, [tileLayerType]);

  // Fly to new incident center when incident changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([centerLat, centerLng], radiusKm > 20 ? 9 : radiusKm > 10 ? 11 : 12, {
      duration: 1.2
    });
  }, [incident.id, centerLat, centerLng, radiusKm]);

  // Render Map Features (Epicenter, Danger Radius, Polygon, Critical Facilities)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 1. Epicenter Marker
    if (epicenterLayerRef.current) {
      epicenterLayerRef.current.clearLayers();

      const hazardEmoji = incident.hazardType === 'WILDFIRE' ? '🔥'
        : incident.hazardType === 'VOLCANO' ? '🌋'
        : incident.hazardType === 'FLOOD' ? '🌊'
        : '⚠️';

      const iconHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="absolute -inset-3 rounded-full animate-ping pointer-events-none" style="background-color: ${mainColor}; opacity: 0.35;"></div>
          <div class="absolute -inset-1 rounded-full animate-pulse pointer-events-none" style="background-color: ${mainColor}; opacity: 0.5;"></div>
          
          <div class="relative w-10 h-10 rounded-full flex items-center justify-center text-white text-base font-bold shadow-2xl border-2 border-white ring-2 ring-slate-900" style="background: radial-gradient(circle, #ffffff 10%, ${mainColor} 90%);">
            <span>${hazardEmoji}</span>
          </div>

          <div class="absolute -bottom-6 opacity-90 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-950/95 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-700 shadow-xl flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full ${isCritical ? 'bg-red-400' : 'bg-amber-400'} animate-pulse"></span>
            <span>${incident.hazardType}</span>
          </div>
        </div>
      `;

      const epicenterMarker = L.marker([centerLat, centerLng], {
        icon: L.divIcon({
          html: iconHtml,
          className: 'epicenter-map-marker',
          iconSize: [40, 40],
          iconAnchor: [20, 20],
          popupAnchor: [0, -22]
        }),
        zIndexOffset: 1000
      });

      const popupHtml = `
        <div class="p-3 w-64 text-slate-100 font-sans text-xs">
          <div class="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800">
            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider text-white" style="background-color: ${mainColor}">
              ${incident.priority.replace('_', ' ')}
            </span>
            <span class="text-[10px] font-mono text-slate-400">
              Skor: <strong class="text-rose-400">${incident.riskScore}/100</strong>
            </span>
          </div>

          <h4 class="font-bold text-sm text-white mb-1 leading-snug">${isEn && incident.titleEn ? incident.titleEn : incident.title}</h4>
          <div class="text-[11px] text-slate-400 mb-2">📍 ${administrativeArea}, ${province}</div>

          <div class="bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-1 font-mono text-[10px]">
            <div class="flex justify-between">
              <span class="text-slate-400">${isEn ? 'Coordinates' : 'Koordinat'}:</span>
              <span class="text-slate-200">${centerLat.toFixed(4)}, ${centerLng.toFixed(4)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">${isEn ? 'Danger Radius' : 'Radius Bahaya'}:</span>
              <span class="text-amber-400 font-bold">${radiusKm} km</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">${isEn ? 'Population Exposure' : 'Warga Terdampak'}:</span>
              <span class="text-emerald-400 font-bold">${incident.exposure.estimatedPopulation.toLocaleString('id-ID')} jiwa</span>
            </div>
          </div>
        </div>
      `;

      epicenterMarker.bindPopup(popupHtml, {
        maxWidth: 280,
        autoPan: true,
        autoPanPaddingTopLeft: L.point(16, 75),
        autoPanPaddingBottomRight: L.point(16, 65)
      });

      epicenterLayerRef.current.addLayer(epicenterMarker);
    }

    // 2. Danger & Impact Radius Circle
    if (radiusLayerRef.current) {
      radiusLayerRef.current.clearLayers();
      if (showRadius && radiusKm > 0) {
        const circle = L.circle([centerLat, centerLng], {
          radius: radiusKm * 1000,
          color: mainColor,
          fillColor: mainColor,
          fillOpacity: isCritical ? 0.16 : 0.08,
          weight: 2,
          dashArray: '5, 6'
        });
        radiusLayerRef.current.addLayer(circle);
      }
    }

    // 3. Polygon Geofence (if provided by CAP/BMKG/InaRISK)
    if (polygonLayerRef.current) {
      polygonLayerRef.current.clearLayers();
      if (showPolygon && polygon && polygon.length >= 3) {
        const poly = L.polygon(polygon, {
          color: '#38bdf8',
          weight: 2,
          fillColor: '#0284c7',
          fillOpacity: 0.18,
          dashArray: '4, 4'
        });
        poly.bindTooltip(isEn ? 'Warning Geofence Zone' : 'Zona Geofence Peringatan BMKG/InaRISK', {
          sticky: true,
          className: 'bg-slate-950 text-sky-300 font-sans text-xs px-2 py-1 rounded shadow'
        });
        polygonLayerRef.current.addLayer(poly);
      }
    }

    // 4. Raw Observation Dots
    if (observationsLayerRef.current) {
      observationsLayerRef.current.clearLayers();
      if (incident.observations && incident.observations.length > 1) {
        incident.observations.forEach((obs) => {
          const obsMarker = L.circleMarker([obs.latitude, obs.longitude], {
            radius: 5,
            color: '#fbbf24',
            fillColor: '#f59e0b',
            fillOpacity: 0.85,
            weight: 1.5
          });
          obsMarker.bindTooltip(`${obs.source}: ${obs.externalId}`, {
            direction: 'top',
            className: 'bg-slate-900 text-amber-200 text-[10px] px-1.5 py-0.5 rounded'
          });
          observationsLayerRef.current?.addLayer(obsMarker);
        });
      }
    }

    // 5. Critical Facilities (InaRISK Exposure Layer)
    if (facilitiesLayerRef.current) {
      facilitiesLayerRef.current.clearLayers();
      if (showFacilities && incident.exposure.facilities) {
        incident.exposure.facilities.forEach((fac) => {
          const isHospital = fac.type === 'hospital' || fac.type === 'puskesmas';
          const isShelter = fac.type === 'shelter';
          const facColor = isHospital ? '#ef4444' : isShelter ? '#3b82f6' : '#f59e0b';
          const facEmoji = isHospital ? '🏥' : isShelter ? '⛺' : '🏫';

          const facIcon = L.divIcon({
            html: `
              <div class="relative flex items-center justify-center cursor-pointer group" style="width: 26px; height: 26px;">
                <div class="w-6 h-6 rounded-md flex items-center justify-center text-white text-[11px] font-bold shadow-lg border border-white/80 transition-transform group-hover:scale-125" style="background-color: ${facColor};">
                  <span>${facEmoji}</span>
                </div>
                <div class="absolute -bottom-5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-950 text-white text-[9px] px-1.5 py-0.2 rounded border border-slate-700 shadow-xl pointer-events-none z-50">
                  ${fac.name} (${fac.distanceKm}km)
                </div>
              </div>
            `,
            className: 'critical-facility-marker',
            iconSize: [26, 26],
            iconAnchor: [13, 13],
            popupAnchor: [0, -14]
          });

          const facMarker = L.marker([fac.latitude, fac.longitude], { icon: facIcon });

          const facPopup = `
            <div class="p-3 w-64 text-slate-100 font-sans text-xs">
              <div class="flex items-center justify-between pb-1 mb-1.5 border-b border-slate-800">
                <span class="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase" style="background-color: ${facColor}25; color: ${facColor};">
                  ${facEmoji} ${fac.type.toUpperCase()}
                </span>
                <span class="text-[10px] font-mono text-emerald-400 font-bold">
                  ${fac.status === 'operational' ? (isEn ? 'Operational' : 'Beroperasi') : fac.status}
                </span>
              </div>
              <h5 class="font-bold text-sm text-white mb-1">${fac.name}</h5>
              <div class="text-[11px] text-slate-400 mb-2">
                📍 Jarak dari Pusat: <strong class="text-amber-400 font-mono">${fac.distanceKm} km</strong>
              </div>
              ${fac.capacity ? `
                <div class="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] flex justify-between font-mono">
                  <span class="text-slate-400">${isEn ? 'Capacity' : 'Kapasitas Tampung'}:</span>
                  <span class="font-bold text-white">${fac.capacity.toLocaleString()} jiwa</span>
                </div>
              ` : ''}
            </div>
          `;

          facMarker.bindPopup(facPopup, {
            maxWidth: 270,
            autoPan: true,
            autoPanPaddingTopLeft: L.point(16, 75),
            autoPanPaddingBottomRight: L.point(16, 65)
          });

          facMarker.on('click', () => {
            setSelectedFacility(fac);
          });

          facilitiesLayerRef.current?.addLayer(facMarker);
        });
      }
    }
  }, [incident, showRadius, showFacilities, showPolygon, centerLat, centerLng, radiusKm, mainColor, isCritical, isHigh, isEn, administrativeArea, province, polygon]);

  return (
    <div 
      ref={mapWrapperRef}
      className={`relative isolate w-full ${isFullscreen ? 'sigap-fullscreen-fallback fixed inset-0 z-[9999] rounded-none !h-screen !w-screen !p-0 !m-0' : heightClass} rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl flex flex-col`}
    >
      {/* Map DOM Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" style={{ width: '100%', height: '100%' }} />

      {/* Top Map HUD Overlay */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Badge: Location Breadcrumb */}
        <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-white shadow-xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-bold text-slate-200">
            {administrativeArea}, {province}
          </span>
          <span className="font-mono text-[11px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
            {centerLat.toFixed(3)}, {centerLng.toFixed(3)}
          </span>
        </div>

        {/* Right HUD Controls: Layer Toggles & Zoom */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-xl text-xs">
          {/* Basemap Toggle */}
          <button
            onClick={() => setTileLayerType(tileLayerType === 'dark' ? 'satellite' : 'dark')}
            className={`px-2 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 cursor-pointer ${
              tileLayerType === 'satellite' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
            title={isEn ? 'Switch Basemap (Dark/Satellite)' : 'Ganti Peta Dasar (Gelap / Satelit)'}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="text-[11px]">{tileLayerType === 'dark' ? 'Satelit' : 'Dark OSM'}</span>
          </button>

          {/* Radius Toggle */}
          <button
            onClick={() => setShowRadius(!showRadius)}
            className={`px-2 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 cursor-pointer ${
              showRadius ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60' : 'text-slate-400 hover:bg-slate-800'
            }`}
            title={isEn ? 'Toggle Danger Radius Circle' : 'Tampilkan Radius Bahaya'}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-[11px]">{radiusKm}km</span>
          </button>

          {/* Facilities Toggle */}
          <button
            onClick={() => setShowFacilities(!showFacilities)}
            className={`px-2 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 cursor-pointer ${
              showFacilities ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60' : 'text-slate-400 hover:bg-slate-800'
            }`}
            title={isEn ? 'Toggle Critical Facilities (InaRISK)' : 'Tampilkan Fasilitas Kritis InaRISK'}
          >
            <Hospital className="w-3.5 h-3.5" />
            <span className="text-[11px]">{incident.exposure.facilities.length} {isEn ? 'Facs' : 'Fas'}</span>
          </button>

          {/* Fullscreen / Recenter */}
          <button
            onClick={() => mapInstanceRef.current?.flyTo([centerLat, centerLng], radiusKm > 20 ? 9 : 11)}
            className="p-1 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            title={isEn ? 'Recenter to Epicenter' : 'Fokus Ulang Episentrum'}
          >
            <Navigation className="w-3.5 h-3.5 text-blue-400" />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="p-1 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            title={isEn ? 'Zoom In' : 'Perbesar'}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="p-1 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            title={isEn ? 'Zoom Out' : 'Perkecil'}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            title={isFullscreen ? (isEn ? 'Exit Fullscreen' : 'Keluar Layar Penuh') : (isEn ? 'Fullscreen Map' : 'Layar Penuh')}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-cyan-400" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Bottom Map Legend Strip */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-auto bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 flex items-center gap-3 shadow-xl">
        <div className="flex items-center gap-1.5 font-bold text-white">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: mainColor }} />
          <span>{isEn ? 'Epicenter' : 'Episentrum Bahaya'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex items-center justify-center text-[7px]">🏥</span>
          <span>{isEn ? 'Hospitals' : 'RS/Puskesmas'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-md bg-blue-500 flex items-center justify-center text-[7px]">⛺</span>
          <span>{isEn ? 'Shelters' : 'Posko'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-md bg-amber-500 flex items-center justify-center text-[7px]">🏫</span>
          <span>{isEn ? 'Schools' : 'Sekolah'}</span>
        </div>
        {polygon && (
          <div className="flex items-center gap-1.5 text-sky-300 border-l border-slate-800 pl-2">
            <span className="w-2 h-2 rounded-sm border border-sky-400 bg-sky-400/20" />
            <span>Geofence</span>
          </div>
        )}
      </div>

      {/* Optional Quick Link to Tactical Map */}
      {onNavigateToFullMap && (
        <div className="absolute bottom-3 right-3 z-10 pointer-events-auto">
          <button
            onClick={() => onNavigateToFullMap(incident.id)}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>{isEn ? 'Open Full Tactical Map' : 'Buka di Peta Taktis Lengkap'}</span>
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
