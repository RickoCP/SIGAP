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
  Minimize2,
  Wind,
  Droplets,
  Layers,
  ChevronDown,
  ChevronUp,
  Radar,
  Siren,
  BellRing,
  ZoomIn,
  ZoomOut,
  Search,
  CloudRain,
  X
} from 'lucide-react';
import { Disaster, IndonesiaRegion, MultiHazardIncident } from '../../types/index.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { getLocalizedDisaster } from '../../i18n/translations.ts';
import { InaRiskExposureLayer } from './InaRiskExposureLayer.tsx';
import { VERIFIED_GPM_IMERG_CELLS, getGpmIntensityColor } from '../../data/gpmImergData.ts';

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

const BASEMAP_TILES: Record<string, { name: string; nameId: string; icon: string; url: string; attribution: string; maxZoom?: number }> = {
  osm: {
    name: 'OpenStreetMap',
    nameId: 'Peta Jalan (OSM)',
    icon: '🗺️',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  },
  satellite: {
    name: 'ESRI Satellite',
    nameId: 'Citra Satelit ESRI',
    icon: '🛰️',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, USGS, NOAA',
    maxZoom: 19
  },
  dark: {
    name: 'ESRI Dark Gray',
    nameId: 'Mode Taktis Gelap (ESRI)',
    icon: '🌑',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
  },
  topo: {
    name: 'Topography',
    nameId: 'Topografi & Elevasi',
    icon: '🏔️',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, SRTM',
    maxZoom: 17
  }
};

export const NationalDisasterMap: React.FC<NationalDisasterMapProps> = ({
  disasters,
  onSelectDisaster,
  onNavigateToTacticalMap,
  onNavigateToMultiHazard
}) => {
  const { language, t } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const disasterLayerRef = useRef<L.LayerGroup | null>(null);
  const radiusLayerRef = useRef<L.LayerGroup | null>(null);
  const hazardLayerRef = useRef<L.LayerGroup | null>(null);
  const gpmLayerRef = useRef<L.LayerGroup | null>(null);

  // Markers cache to allow programmatic opening of popups and preventing unnecessary teardowns
  const markersMapRef = useRef<Map<string, L.Marker>>(new Map());

  // Stable callback refs to ensure marker click handlers never trigger layer reconstruction
  const onSelectDisasterRef = useRef(onSelectDisaster);
  onSelectDisasterRef.current = onSelectDisaster;

  const onNavigateToTacticalMapRef = useRef(onNavigateToTacticalMap);
  onNavigateToTacticalMapRef.current = onNavigateToTacticalMap;

  const onNavigateToMultiHazardRef = useRef(onNavigateToMultiHazard);
  onNavigateToMultiHazardRef.current = onNavigateToMultiHazard;

  // Filter & Layer States
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedDisasterId, setSelectedDisasterId] = useState<string>(disasters[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLegendExpanded, setIsLegendExpanded] = useState<boolean>(true);

  // Map Feature Toggles & Basemap Switcher
  const [selectedBasemap, setSelectedBasemap] = useState<'osm' | 'satellite' | 'dark' | 'topo'>('osm');
  const [showBasemapMenu, setShowBasemapMenu] = useState<boolean>(false);
  const [showRadiusLayer, setShowRadiusLayer] = useState<boolean>(true);
  const [showGpmLayer, setShowGpmLayer] = useState<boolean>(true);
  const [showMultiHazardOverlay, setShowMultiHazardOverlay] = useState<boolean>(true);
  const [showInaRiskExposure, setShowInaRiskExposure] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  const basemapMenuRef = useRef<HTMLDivElement>(null);

  // Multi-Hazard Real-Time Incidents Sync State
  const [hazardIncidents, setHazardIncidents] = useState<MultiHazardIncident[]>([]);

  // Close basemap menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (basemapMenuRef.current && !basemapMenuRef.current.contains(e.target as Node)) {
        setShowBasemapMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fullscreen change listener & Escape key handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = Boolean(document.fullscreenElement);
      setIsFullscreen(active);
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 250);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        setTimeout(() => mapInstanceRef.current?.invalidateSize(), 200);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
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

  // Filtered disasters with search support (memoized to prevent recreating layer on marker clicks)
  const filteredDisasters = useMemo(() => {
    return localizedDisasters.filter(d => {
      if (selectedRegion !== 'all' && d.region !== selectedRegion) return false;
      if (selectedType !== 'all' && d.type !== selectedType) return false;
      if (selectedSeverity !== 'all' && d.severity !== selectedSeverity) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = (d.title && d.title.toLowerCase().includes(q)) || (d.titleEn && d.titleEn.toLowerCase().includes(q));
        const provMatch = d.province && d.province.toLowerCase().includes(q);
        const regionMatch = d.region && d.region.toLowerCase().includes(q);
        const descMatch = d.description && d.description.toLowerCase().includes(q);
        if (!titleMatch && !provMatch && !regionMatch && !descMatch) return false;
      }
      return true;
    });
  }, [localizedDisasters, selectedRegion, selectedType, selectedSeverity, searchQuery]);

  // Initialize National Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-2.5489, 118.0149],
      zoom: 5,
      zoomControl: false,
      minZoom: 4,
      maxZoom: 18,
      closePopupOnClick: false // Prevents popups from closing on map clicks/pans!
    });

    // Add scale bar
    L.control.scale({ imperial: false, metric: true, position: 'bottomright' }).addTo(map);

    // Initial Basemap
    const initialBasemap = BASEMAP_TILES[selectedBasemap] || BASEMAP_TILES.osm;
    const tileLayer = L.tileLayer(initialBasemap.url, {
      attribution: initialBasemap.attribution,
      maxZoom: initialBasemap.maxZoom || 19,
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    const radiusGroup = L.layerGroup().addTo(map);
    radiusLayerRef.current = radiusGroup;

    const gpmGroup = L.layerGroup().addTo(map);
    gpmLayerRef.current = gpmGroup;

    const hazardGroup = L.layerGroup().addTo(map);
    hazardLayerRef.current = hazardGroup;

    const layerGroup = L.layerGroup().addTo(map);
    disasterLayerRef.current = layerGroup;
    mapInstanceRef.current = map;
    setMapInstance(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      setMapInstance(null);
    };
  }, []);

  // Update Basemap Tiles when selectedBasemap changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const config = BASEMAP_TILES[selectedBasemap] || BASEMAP_TILES.osm;
    const newTile = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom || 19
    }).addTo(map);
    newTile.bringToBack();
    tileLayerRef.current = newTile;
  }, [selectedBasemap]);

  // Pan to selected region
  const handleRegionChange = (reg: string) => {
    setSelectedRegion(reg);
    const target = REGION_COORDINATES[reg] || REGION_COORDINATES.all;
    mapInstanceRef.current?.flyTo(target.center, target.zoom, { duration: 1.2 });
  };

  // Zoom helpers
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetIndonesia = () => {
    setSelectedRegion('all');
    mapInstanceRef.current?.flyTo([-2.5489, 118.0149], 5, { duration: 1.2 });
  };

  // Render Disaster Markers on National Map (STABLE: Depends strictly on filteredDisasters and language, uses refs for callbacks so it NEVER clears layers when a point is clicked!)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = disasterLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    markersMapRef.current.clear();

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
                 style="background-color: ${color}; border-color: rgba(255,255,255,0.85)">
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
      markersMapRef.current.set(d.id, marker);

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
        autoClose: true,
        closeOnClick: false,
        autoPanPaddingTopLeft: L.point(20, 100),
        autoPanPaddingBottomRight: L.point(20, 90)
      });

      marker.on('click', () => {
        setSelectedDisasterId(d.id);
        onSelectDisasterRef.current?.(d.id);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-${d.id}`);
        if (btn) {
          btn.onclick = () => onNavigateToTacticalMapRef.current?.(d.id);
        }
      });

      layer.addLayer(marker);
    });
  }, [filteredDisasters, language]);

  // Render Hazard Radius Rings (Updates smoothly without destroying markers or popups)
  useEffect(() => {
    const radiusLayer = radiusLayerRef.current;
    if (!radiusLayer) return;

    radiusLayer.clearLayers();
    if (!showRadiusLayer) return;

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
  }, [filteredDisasters, activeDisaster, showRadiusLayer]);

  // Render NASA GPM IMERG Precipitation Overlays on National Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = gpmLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    if (!showGpmLayer) return;

    VERIFIED_GPM_IMERG_CELLS.forEach(cell => {
      const colors = getGpmIntensityColor(cell.rateMmPerHour);
      const isExtreme = cell.intensityLevel === 'EXTREME';
      const isHeavy = cell.intensityLevel === 'HEAVY';

      // 1. Concentric Footprint Circle
      const radiusMeters = cell.footprintRadiusKm * 1000;
      const footprintCircle = L.circle([cell.latitude, cell.longitude], {
        radius: radiusMeters,
        color: colors.stroke,
        fillColor: colors.fill,
        fillOpacity: isExtreme ? 0.28 : isHeavy ? 0.22 : 0.15,
        weight: isExtreme ? 2 : 1.2,
        dashArray: isExtreme ? undefined : '3, 4'
      });
      layer.addLayer(footprintCircle);

      // 2. High Intensity Core for Extreme/Heavy
      if (isExtreme || isHeavy) {
        const coreCircle = L.circle([cell.latitude, cell.longitude], {
          radius: radiusMeters * 0.45,
          color: colors.stroke,
          fillColor: colors.fill,
          fillOpacity: isExtreme ? 0.42 : 0.32,
          weight: 2
        });
        layer.addLayer(coreCircle);
      }

      // 3. Interactive Marker Badge
      const customIcon = L.divIcon({
        className: 'custom-gpm-marker',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-125">
            ${isExtreme ? `<span class="absolute w-9 h-9 rounded-full animate-ping opacity-60" style="background-color: ${colors.fill}"></span>` : ''}
            <div class="relative flex items-center gap-1 px-2 py-0.5 rounded-full text-white font-mono text-[9px] font-black shadow-xl border-2 whitespace-nowrap"
                 style="background-color: ${colors.fill}; border-color: ${colors.stroke}">
              <span>🌧️ ${cell.rateMmPerHour} mm/h</span>
            </div>
            <div class="absolute -bottom-4 whitespace-nowrap bg-slate-950/90 text-[8.5px] font-bold px-1 rounded border border-cyan-800 text-cyan-200 shadow-md">
              ${cell.basinName}
            </div>
          </div>
        `,
        iconSize: [40, 24],
        iconAnchor: [20, 12],
        popupAnchor: [0, -14]
      });

      const marker = L.marker([cell.latitude, cell.longitude], { icon: customIcon });

      marker.bindPopup(`
        <div class="p-2.5 min-w-[240px] text-slate-900 font-sans">
          <div class="flex items-center justify-between gap-1 mb-1">
            <span class="text-[9px] font-black uppercase tracking-wider text-cyan-700 bg-cyan-100 px-1.5 py-0.5 rounded">
              NASA GPM IMERG Precipitation
            </span>
            <span class="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${
              cell.floodRisk === 'CRITICAL_FLASH_FLOOD' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
            }">
              ${cell.floodRisk.replace(/_/g, ' ')}
            </span>
          </div>
          <h4 class="font-bold text-xs text-slate-900 leading-tight mb-1">
            ${language === 'en' ? cell.locationNameEn : cell.locationName}
          </h4>
          <div class="text-[10px] text-slate-500 font-mono mb-2">
            ${cell.basinName} • ${cell.province}
          </div>
          <div class="grid grid-cols-3 gap-1 bg-slate-100 p-1.5 rounded text-center font-mono text-[10px] mb-2">
            <div>
              <span class="text-slate-500 text-[8px] block">${language === 'id' ? 'Intensitas' : 'Rate'}</span>
              <strong class="text-cyan-700">${cell.rateMmPerHour} mm/h</strong>
            </div>
            <div>
              <span class="text-slate-500 text-[8px] block">24h Acc</span>
              <strong class="text-amber-700">${cell.accumulated24hMm} mm</strong>
            </div>
            <div>
              <span class="text-slate-500 text-[8px] block">72h Acc</span>
              <strong class="text-rose-700">${cell.accumulated72hMm} mm</strong>
            </div>
          </div>
          <div class="text-[10.5px] text-slate-700 space-y-1 border-t pt-1.5">
            <div><strong>🌊 ${language === 'id' ? 'Dampak Hilir:' : 'Downstream:'}</strong> ${language === 'en' ? cell.downstreamImpactEn : cell.downstreamImpact}</div>
            <div class="text-slate-600"><strong>📋 ${language === 'id' ? 'Rekomendasi:' : 'Recommendation:'}</strong> ${language === 'en' ? cell.sarRecommendationEn : cell.sarRecommendation}</div>
          </div>
        </div>
      `, {
        maxWidth: 290,
        autoPan: true,
        autoClose: true,
        closeOnClick: false,
        autoPanPaddingTopLeft: L.point(20, 100),
        autoPanPaddingBottomRight: L.point(20, 90)
      });

      layer.addLayer(marker);
    });
  }, [showGpmLayer, language]);

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
        autoClose: true,
        closeOnClick: false,
        autoPanPaddingTopLeft: L.point(20, 100),
        autoPanPaddingBottomRight: L.point(20, 90)
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-hazard-${inc.id}`);
        if (btn && onNavigateToMultiHazardRef.current) {
          btn.onclick = () => onNavigateToMultiHazardRef.current?.(inc.id);
        }
      });

      layer.addLayer(marker);
    });
  }, [hazardIncidents, showMultiHazardOverlay, language]);

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
        <div className="flex flex-col gap-3 pt-3 text-xs">
          {/* Top Line: Region Buttons + Search */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
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
                { id: 'Bali-NusaTenggara', label: t.natMapBaliNusa },
                { id: 'Maluku-Papua', label: 'Maluku-Papua' }
              ].map(reg => (
                <button
                  key={reg.id}
                  onClick={() => handleRegionChange(reg.id)}
                  className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                    selectedRegion === reg.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750 hover:text-white'
                  }`}
                >
                  {reg.label}
                </button>
              ))}
            </div>

            {/* Quick Search on Map */}
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'id' ? 'Cari bencana, kota, provinsi...' : 'Search disaster, city, province...'}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg pl-8 pr-7 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Bottom Line: Layer Toggles & Dropdown Filters */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                <span>{language === 'id' ? 'Layer:' : 'Layers:'}</span>
              </span>

              {/* Multi-Hazard & EWS Toggle */}
              <button
                onClick={() => setShowMultiHazardOverlay(!showMultiHazardOverlay)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-bold transition-all cursor-pointer ${
                  showMultiHazardOverlay
                    ? 'bg-rose-950/80 border-rose-500/80 text-rose-300 shadow-md ring-1 ring-rose-500/40'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title={language === 'id' ? 'Aktifkan/Nonaktifkan Tampilan Insiden Multi-Hazard & EWS Real-Time' : 'Toggle Real-Time Multi-Hazard & EWS Incidents Overlay'}
              >
                <Siren className={`w-3.5 h-3.5 ${showMultiHazardOverlay ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
                <span>
                  {language === 'id'
                    ? `Multi-Hazard & EWS (${hazardIncidents.filter(i => i.responseWorkflow?.isCommunityEarlyWarningActive).length} Alarm)`
                    : `Multi-Hazard & EWS (${hazardIncidents.filter(i => i.responseWorkflow?.isCommunityEarlyWarningActive).length} Alarms)`}
                </span>
              </button>

              {/* InaRISK Exposure Layer Toggle */}
              <button
                onClick={() => setShowInaRiskExposure(!showInaRiskExposure)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-bold transition-all cursor-pointer ${
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

              {/* NASA GPM IMERG Precipitation Layer Toggle */}
              <button
                onClick={() => setShowGpmLayer(!showGpmLayer)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-bold transition-all cursor-pointer ${
                  showGpmLayer
                    ? 'bg-cyan-950/90 border-cyan-500/80 text-cyan-300 shadow-md ring-1 ring-cyan-500/40'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title={language === 'id' ? 'Aktifkan/Nonaktifkan Curah Hujan Real-Time NASA GPM IMERG' : 'Toggle Real-Time NASA GPM IMERG Precipitation'}
              >
                <CloudRain className={`w-3.5 h-3.5 ${showGpmLayer ? 'text-cyan-400 animate-bounce' : 'text-slate-400'}`} />
                <span>
                  {language === 'id' ? `Curah Hujan GPM (${VERIFIED_GPM_IMERG_CELLS.length})` : `GPM Rain (${VERIFIED_GPM_IMERG_CELLS.length})`}
                </span>
              </button>

              {/* Danger Radius Rings Toggle */}
              <button
                onClick={() => setShowRadiusLayer(!showRadiusLayer)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded border text-xs font-medium transition-all cursor-pointer ${
                  showRadiusLayer
                    ? 'bg-slate-800 border-blue-500/80 text-blue-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title={language === 'id' ? 'Aktifkan/Nonaktifkan Cincin Radius Bahaya' : 'Toggle Danger Perimeter Rings'}
              >
                <span>⭕ {language === 'id' ? 'Radius Bahaya' : 'Danger Radius'}</span>
              </button>
            </div>

            {/* Type & Severity Selectors */}
            <div className="flex items-center gap-2">
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
      </div>

      {/* Main Map + Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Full Map Container */}
        <div 
          ref={mapWrapperRef}
          className={`lg:col-span-8 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative isolate shadow-2xl ${
            isFullscreen ? 'sigap-fullscreen-fallback fixed inset-0 z-[9999] rounded-none !h-screen !w-screen !p-0 !m-0' : 'h-[680px]'
          }`}
        >
          <div ref={mapContainerRef} className="w-full h-full" style={{ width: '100%', height: '100%' }} />

          {/* Floating Tactical Map Controls (Top Right) */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 pointer-events-auto">
            {/* Zoom & Navigation Controls */}
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg p-1 shadow-lg flex flex-col gap-1">
              <button
                onClick={handleZoomIn}
                title={language === 'id' ? 'Perbesar Peta' : 'Zoom In'}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomOut}
                title={language === 'id' ? 'Perkecil Peta' : 'Zoom Out'}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetIndonesia}
                title={language === 'id' ? 'Pusatkan Seluruh Indonesia' : 'Reset to Indonesia Overview'}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
              >
                <Compass className="w-4 h-4" />
              </button>
              <button
                onClick={toggleFullscreen}
                title={isFullscreen ? (language === 'id' ? 'Keluar Layar Penuh' : 'Exit Fullscreen') : (language === 'id' ? 'Layar Penuh' : 'Fullscreen Map')}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Basemap Switcher Menu Button */}
            <div className="relative" ref={basemapMenuRef}>
              <button
                onClick={() => setShowBasemapMenu(!showBasemapMenu)}
                title={language === 'id' ? 'Ganti Peta Dasar (Basemap)' : 'Switch Base Map Layer'}
                className={`p-2 rounded-lg border shadow-lg backdrop-blur-md transition-all cursor-pointer flex items-center justify-center ${
                  showBasemapMenu 
                    ? 'bg-blue-600 border-blue-400 text-white shadow-blue-500/20' 
                    : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Layers className="w-4 h-4" />
              </button>

              {/* Basemap Selection Popup */}
              {showBasemapMenu && (
                <div className="absolute top-0 right-11 w-52 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-2 shadow-2xl animate-in fade-in duration-150 z-30 space-y-1 text-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 border-b border-slate-800">
                    {language === 'id' ? 'Pilih Peta Dasar' : 'Base Map Tiles'}
                  </div>
                  {Object.entries(BASEMAP_TILES).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedBasemap(key as any);
                        setShowBasemapMenu(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                        selectedBasemap === key
                          ? 'bg-blue-600/30 text-blue-300 border border-blue-500/60 font-bold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{config.icon}</span>
                        <span>{language === 'id' ? config.nameId : config.name}</span>
                      </span>
                      {selectedBasemap === key && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* BNPB InaRISK Vulnerable Population Density & Resource Deployment Layer */}
          <InaRiskExposureLayer
            map={mapInstance}
            enabled={showInaRiskExposure}
            onDeployResourcesToZone={(zone) => {
              if (onNavigateToMultiHazardRef.current) {
                onNavigateToMultiHazardRef.current(zone.id);
              }
            }}
          />

          {/* Floating Map Legend (Collapsible & Non-blocking) */}
          <div className="absolute bottom-4 left-4 z-20 pointer-events-auto">
            {isLegendExpanded ? (
              <div className="bg-slate-950/92 backdrop-blur-md p-2.5 rounded-lg border border-slate-800 text-xs text-slate-300 shadow-xl space-y-1.5 min-w-[180px]">
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
                {showMultiHazardOverlay && (
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                    <span className="w-4 h-4 rounded-full bg-rose-600 flex items-center justify-center text-[10px] animate-pulse">🚨</span>
                    <span className="font-bold text-rose-300">{language === 'id' ? 'EWS Sirine Aktif' : 'Active EWS Sirens'}</span>
                  </div>
                )}
                {showInaRiskExposure && (
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                    <span className="w-3.5 h-3.5 rounded-full bg-rose-600 flex items-center justify-center text-[8px] font-bold text-white">🛡️</span>
                    <span className="font-bold text-rose-300">{language === 'id' ? 'InaRISK Warga Rentan' : 'InaRISK Exposure'}</span>
                  </div>
                )}
                {showGpmLayer && (
                  <div className="pt-1 border-t border-slate-800 space-y-1 text-[10px]">
                    <div className="font-bold text-cyan-300 flex items-center gap-1">
                      <CloudRain className="w-3 h-3 text-cyan-400" />
                      <span>{language === 'id' ? 'Curah Hujan GPM IMERG:' : 'GPM Rain Rates:'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 font-mono text-[9px] text-slate-300 pl-1">
                      <span className="text-purple-300 font-bold">• &gt;20 mm/h ({language === 'id' ? 'Ekstrem' : 'Extreme'})</span>
                      <span className="text-orange-300">• 10-20 ({language === 'id' ? 'Lebat' : 'Heavy'})</span>
                      <span className="text-blue-300">• 2.5-10 ({language === 'id' ? 'Sedang' : 'Mod'})</span>
                      <span className="text-sky-300">• &lt;2.5 ({language === 'id' ? 'Ringan' : 'Light'})</span>
                    </div>
                  </div>
                )}
                {showRadiusLayer && (
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full border border-red-400 bg-red-400/20 inline-block"></span>
                    <span>{t.natMapLegendRadius}</span>
                  </div>
                )}
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
                  onClick={() => onNavigateToTacticalMapRef.current?.(activeDisaster.id)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  {t.natMapOpenTactical}
                </button>
              </div>
            </div>
          ) : null}

          {/* Active Disasters Quick List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {t.natMapMonitoredTitle} ({filteredDisasters.length})
              </h4>
              {searchQuery && (
                <span className="text-[10px] text-blue-400 bg-blue-950/80 border border-blue-800/60 px-1.5 py-0.5 rounded">
                  {filteredDisasters.length} {language === 'id' ? 'ditemukan' : 'found'}
                </span>
              )}
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {filteredDisasters.map(d => {
                const isSelected = activeDisaster?.id === d.id;
                const isFire = d.type === 'fire';
                const isFlood = d.type === 'flood';
                return (
                  <div
                    key={d.id}
                    onClick={() => {
                      setSelectedDisasterId(d.id);
                      onSelectDisasterRef.current?.(d.id);
                      const targetMarker = markersMapRef.current.get(d.id);
                      if (targetMarker && mapInstanceRef.current) {
                        mapInstanceRef.current.flyTo([d.locationLat, d.locationLng], 8, { duration: 0.8 });
                        setTimeout(() => {
                          targetMarker.openPopup();
                        }, 400);
                      }
                    }}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-blue-950/60 border-blue-500 shadow-md ring-1 ring-blue-500/30'
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
              {filteredDisasters.length === 0 && (
                <div className="text-center py-6 text-slate-500 text-xs">
                  {language === 'id' ? 'Tidak ada bencana yang cocok dengan filter / pencarian.' : 'No disasters match the current filter / search.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
