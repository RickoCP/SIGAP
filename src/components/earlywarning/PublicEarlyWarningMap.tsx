import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { 
  Compass, 
  MapPin, 
  ShieldAlert, 
  Navigation, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  Home, 
  Waves, 
  Flame, 
  Activity,
  Crosshair,
  CheckCircle2,
  X
} from 'lucide-react';
import { EarlyWarningAlert } from '../../types/index.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface PublicEarlyWarningMapProps {
  alerts: EarlyWarningAlert[];
  userCoords: { lat: number; lng: number };
  userLocationName: string;
  onSelectAlert?: (alert: EarlyWarningAlert) => void;
  onSelectShelter?: (shelterName: string, lat: number, lng: number) => void;
}

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

export const PublicEarlyWarningMap: React.FC<PublicEarlyWarningMapProps> = ({
  alerts,
  userCoords,
  userLocationName,
  onSelectAlert,
  onSelectShelter
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const userLayerRef = useRef<L.LayerGroup | null>(null);
  const dangerRadiusLayerRef = useRef<L.LayerGroup | null>(null);
  const alertMarkerLayerRef = useRef<L.LayerGroup | null>(null);
  const shelterLayerRef = useRef<L.LayerGroup | null>(null);
  const proximityLineLayerRef = useRef<L.LayerGroup | null>(null);

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedBasemap, setSelectedBasemap] = useState<'osm' | 'satellite' | 'dark' | 'topo'>('osm');
  const [showBasemapMenu, setShowBasemapMenu] = useState<boolean>(false);
  const [showDangerRadius, setShowDangerRadius] = useState<boolean>(true);
  const [showShelters, setShowShelters] = useState<boolean>(true);
  const [showProximityLines, setShowProximityLines] = useState<boolean>(true);
  const [isLegendOpen, setIsLegendOpen] = useState<boolean>(true);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

  const basemapMenuRef = useRef<HTMLDivElement>(null);

  // Close basemap dropdown on outside click
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
    const handleFsChange = () => {
      const isFs = Boolean(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isFs);
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 50);
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 150);
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 300);
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 600);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        }
        setTimeout(() => mapInstanceRef.current?.invalidateSize(), 100);
        setTimeout(() => mapInstanceRef.current?.invalidateSize(), 300);
      }
    };

    const handleWindowResize = () => {
      if (isFullscreen) {
        mapInstanceRef.current?.invalidateSize();
      }
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    document.addEventListener('mozfullscreenchange', handleFsChange);
    document.addEventListener('MSFullscreenChange', handleFsChange);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleWindowResize);

    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
      document.removeEventListener('mozfullscreenchange', handleFsChange);
      document.removeEventListener('MSFullscreenChange', handleFsChange);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [isFullscreen]);

  // Handle Fullscreen toggle
  const toggleFullscreen = () => {
    const next = !isFullscreen;
    setIsFullscreen(next);

    if (!next) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    } else if (next && mapWrapperRef.current) {
      const el = mapWrapperRef.current;
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      } else if ((el as any).webkitRequestFullscreen) {
        (el as any).webkitRequestFullscreen();
      } else if ((el as any).mozRequestFullScreen) {
        (el as any).mozRequestFullScreen();
      } else if ((el as any).msRequestFullscreen) {
        (el as any).msRequestFullscreen();
      }
    }

    setTimeout(() => mapInstanceRef.current?.invalidateSize(), 50);
    setTimeout(() => mapInstanceRef.current?.invalidateSize(), 150);
    setTimeout(() => mapInstanceRef.current?.invalidateSize(), 300);
    setTimeout(() => mapInstanceRef.current?.invalidateSize(), 600);
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [userCoords.lat, userCoords.lng],
      zoom: 11,
      zoomControl: false,
      minZoom: 4,
      maxZoom: 18,
      closePopupOnClick: false
    });

    L.control.scale({ imperial: false, metric: true, position: 'bottomright' }).addTo(map);

    // Initial Basemap
    const initialConfig = BASEMAP_TILES[selectedBasemap] || BASEMAP_TILES.osm;
    const tileLayer = L.tileLayer(initialConfig.url, {
      attribution: initialConfig.attribution,
      maxZoom: initialConfig.maxZoom || 19
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Layer Groups
    dangerRadiusLayerRef.current = L.layerGroup().addTo(map);
    proximityLineLayerRef.current = L.layerGroup().addTo(map);
    shelterLayerRef.current = L.layerGroup().addTo(map);
    alertMarkerLayerRef.current = L.layerGroup().addTo(map);
    userLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Basemap Tiles
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

  // Smoothly pan map when userCoords change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([userCoords.lat, userCoords.lng], Math.max(map.getZoom(), 11), { duration: 1.2 });
  }, [userCoords.lat, userCoords.lng]);

  // Render User Location Marker & Radar Pulse
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = userLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    // User Location Pulse Icon
    const userIcon = L.divIcon({
      className: 'user-live-gps-marker',
      html: `
        <div class="relative flex flex-col items-center justify-center cursor-pointer group">
          <span class="absolute w-10 h-10 rounded-full bg-cyan-400 opacity-30 animate-ping"></span>
          <span class="absolute w-6 h-6 rounded-full bg-cyan-500 opacity-40"></span>
          <div class="relative w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white font-black shadow-2xl border-2 border-white ring-2 ring-cyan-400">
            <span class="text-xs">👤</span>
          </div>
          <div class="mt-1 whitespace-nowrap px-2 py-0.5 rounded-full shadow-lg text-[10px] font-bold text-cyan-200 bg-slate-950/95 border border-cyan-500/80 font-mono">
            ${isEn ? 'Your Position' : 'Posisi Anda'}
          </div>
        </div>
      `,
      iconSize: [100, 52],
      iconAnchor: [50, 26],
      popupAnchor: [0, -26]
    });

    const userMarker = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon, zIndexOffset: 1000 });

    const userPopupHtml = `
      <div class="p-3 max-w-[260px] text-slate-900 font-sans">
        <div class="flex items-center gap-1.5 border-b border-slate-200 pb-1.5 mb-2">
          <span class="text-base">📍</span>
          <div>
            <strong class="text-xs text-cyan-900 block font-bold">${isEn ? 'Your Current Location' : 'Lokasi Perangkat Anda'}</strong>
            <span class="text-[10px] text-slate-500">${userLocationName}</span>
          </div>
        </div>
        <div class="bg-cyan-50 border border-cyan-200 p-2 rounded-lg text-center font-mono text-[11px] text-cyan-950 mb-2 font-bold">
          ${userCoords.lat.toFixed(4)}, ${userCoords.lng.toFixed(4)}
        </div>
        <p class="text-[10px] text-slate-600 leading-snug">
          ${isEn 
            ? 'Monitored in real time against active BNPB & BMKG disaster danger buffers.' 
            : 'Dipantau secara real-time terhadap radius bahaya bencana resmi BNPB & BMKG.'}
        </p>
      </div>
    `;

    userMarker.bindPopup(userPopupHtml, {
      maxWidth: 280,
      autoPan: true,
      autoClose: false,
      closeOnClick: false
    });

    layer.addLayer(userMarker);
  }, [userCoords, userLocationName, isEn]);

  // Render Hazard Alerts, Danger Radius, and Evacuation Shelters
  useEffect(() => {
    const map = mapInstanceRef.current;
    const radiusLayer = dangerRadiusLayerRef.current;
    const markerLayer = alertMarkerLayerRef.current;
    const shelterLayer = shelterLayerRef.current;
    const proxLayer = proximityLineLayerRef.current;

    if (!map || !radiusLayer || !markerLayer || !shelterLayer || !proxLayer) return;

    radiusLayer.clearLayers();
    markerLayer.clearLayers();
    shelterLayer.clearLayers();
    proxLayer.clearLayers();

    alerts.forEach((alert) => {
      const isAwas = alert.alertLevel === 'awas';
      const isSiaga = alert.alertLevel === 'siaga';
      const color = isAwas ? '#ef4444' : isSiaga ? '#f97316' : '#eab308';
      const iconEmoji = alert.hazardType === 'flood' ? '🌊' : alert.hazardType === 'fire' ? '🔥' : alert.hazardType === 'earthquake' ? '⚠️' : '🌋';
      const levelLabel = isAwas ? (isEn ? 'RED ALERT (AWAS)' : 'AWAS TERTINGGI') : isSiaga ? (isEn ? 'ALERT (SIAGA)' : 'SIAGA TINGKAT 2') : (isEn ? 'ADVISORY' : 'WASPADA');

      // 1. Danger Buffer Circle (Multi-tier)
      if (showDangerRadius) {
        const radiusMeters = alert.dangerRadiusKm * 1000;
        const circle = L.circle([alert.locationLat, alert.locationLng], {
          interactive: false,
          radius: radiusMeters,
          color: color,
          fillColor: color,
          fillOpacity: isAwas ? 0.22 : isSiaga ? 0.16 : 0.10,
          weight: isAwas ? 2.5 : 1.5,
          dashArray: isAwas ? undefined : '5, 5'
        });
        radiusLayer.addLayer(circle);

        // Inner core danger halo for AWAS
        if (isAwas) {
          const innerCore = L.circle([alert.locationLat, alert.locationLng], {
            interactive: false,
            radius: radiusMeters * 0.45,
            color: color,
            fillColor: color,
            fillOpacity: 0.35,
            weight: 1
          });
          radiusLayer.addLayer(innerCore);
        }
      }

      // 2. Alert Epicenter Marker
      const alertIcon = L.divIcon({
        className: 'early-warning-hazard-marker',
        html: `
          <div class="relative flex flex-col items-center justify-center cursor-pointer group transition-transform duration-200 hover:scale-125">
            ${isAwas ? `<span class="absolute w-10 h-10 rounded-full animate-ping opacity-60" style="background-color: ${color}"></span>` : ''}
            <div class="relative w-9 h-9 rounded-full flex items-center justify-center text-white font-bold shadow-2xl border-2" 
                 style="background-color: ${color}; border-color: rgba(255,255,255,0.9)">
              <span class="text-sm">${iconEmoji}</span>
            </div>
            <div class="mt-1 whitespace-nowrap px-2 py-0.5 rounded shadow-md text-[9px] font-black text-white bg-slate-950/95 border border-slate-700">
              ${levelLabel}
            </div>
          </div>
        `,
        iconSize: [110, 48],
        iconAnchor: [55, 24],
        popupAnchor: [0, -24]
      });

      const alertMarker = L.marker([alert.locationLat, alert.locationLng], { icon: alertIcon });

      // Compute distance from user to this alert
      const dLat = (alert.locationLat - userCoords.lat) * (Math.PI / 180);
      const dLon = (alert.locationLng - userCoords.lng) * (Math.PI / 180);
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(userCoords.lat * (Math.PI / 180)) * Math.cos(alert.locationLat * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const distKm = (6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);

      const alertTitle = isEn ? (alert.titleEn || alert.title) : alert.title;
      const advice = isEn ? (alert.evacuationAdviceEn || alert.evacuationAdvice) : alert.evacuationAdvice;

      const alertPopupHtml = `
        <div class="p-3 max-w-[300px] text-slate-900 font-sans leading-snug">
          <div class="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2">
            <span class="text-[9px] font-black uppercase tracking-wider text-rose-600 flex items-center gap-1">
              <span>🚨</span> ${levelLabel}
            </span>
            <span class="text-[9px] font-mono font-bold text-slate-500">${alert.province}</span>
          </div>

          <h4 class="font-bold text-xs text-slate-900 mb-1 leading-tight">${alertTitle}</h4>
          <span class="text-[10px] text-slate-500 block mb-2">📍 ${alert.locationName}</span>

          <div class="grid grid-cols-2 gap-1.5 bg-slate-100 p-2 rounded-lg mb-2 text-center text-[10px]">
            <div>
              <span class="text-slate-500 block">${isEn ? 'Distance to You' : 'Jarak ke Anda'}</span>
              <strong class="text-xs font-black text-rose-600 font-mono">${distKm} km</strong>
            </div>
            <div>
              <span class="text-slate-500 block">${isEn ? 'Danger Buffer' : 'Radius Bahaya'}</span>
              <strong class="text-xs font-black text-slate-800 font-mono">${alert.dangerRadiusKm} km</strong>
            </div>
          </div>

          <p class="text-[10px] text-slate-700 bg-amber-50 border border-amber-200 p-2 rounded leading-relaxed mb-2.5">
            <strong>${isEn ? 'Guidance:' : 'Arahan:'}</strong> ${advice}
          </p>

          <button 
            id="focus-alert-btn-${alert.id}"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-2 rounded-lg text-[10px] transition cursor-pointer shadow flex items-center justify-center gap-1.5"
          >
            <span>🎯</span>
            <span>${isEn ? 'Inspect Danger Epicenter' : 'Pusatkan Episentrum Bahaya'}</span>
          </button>
        </div>
      `;

      alertMarker.bindPopup(alertPopupHtml, {
        maxWidth: 320,
        autoPan: true,
        autoClose: false,
        closeOnClick: false,
        autoPanPaddingTopLeft: L.point(20, 90),
        autoPanPaddingBottomRight: L.point(20, 90)
      });

      alertMarker.on('click', (e: any) => {
        if (e && e.originalEvent) {
          L.DomEvent.stopPropagation(e.originalEvent);
        }
        alertMarker.openPopup();
        setSelectedAlertId(alert.id);
        onSelectAlert?.(alert);
      });

      alertMarker.on('popupopen', () => {
        const popup = alertMarker.getPopup();
        const popupEl = popup?.getElement();
        if (popupEl) {
          L.DomEvent.disableClickPropagation(popupEl);
          L.DomEvent.disableScrollPropagation(popupEl);
        }
        const btn = document.getElementById(`focus-alert-btn-${alert.id}`);
        if (btn) {
          btn.onclick = (e) => {
            e.stopPropagation();
            map.flyTo([alert.locationLat, alert.locationLng], 13, { duration: 1.2 });
          };
        }
      });

      markerLayer.addLayer(alertMarker);

      // 3. Emergency Evacuation Shelter Marker (Posko Pengungsian Resmi)
      if (showShelters && alert.emergencyShelter) {
        const shelter = alert.emergencyShelter;
        const shelterIcon = L.divIcon({
          className: 'emergency-shelter-marker',
          html: `
            <div class="relative flex flex-col items-center justify-center cursor-pointer group transition-transform duration-200 hover:scale-125">
              <span class="absolute w-8 h-8 rounded-full bg-emerald-400 opacity-30"></span>
              <div class="relative w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-black shadow-xl border-2 border-white ring-2 ring-emerald-400">
                <span class="text-xs">🏛️</span>
              </div>
              <div class="mt-0.5 whitespace-nowrap px-1.5 py-0.2 rounded shadow-md text-[9px] font-bold text-emerald-100 bg-slate-950/95 border border-emerald-600 font-mono">
                ${isEn ? 'Safe Shelter' : 'Posko Aman'}
              </div>
            </div>
          `,
          iconSize: [90, 46],
          iconAnchor: [45, 23],
          popupAnchor: [0, -23]
        });

        const shelterMarker = L.marker([shelter.lat, shelter.lng], { icon: shelterIcon });

        const occupancyPercent = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);

        const shelterPopupHtml = `
          <div class="p-3 max-w-[280px] text-slate-900 font-sans leading-snug">
            <div class="flex items-center gap-1.5 border-b border-slate-200 pb-1.5 mb-2">
              <span class="text-base">🏛️</span>
              <div>
                <span class="text-[9px] font-black uppercase tracking-wider text-emerald-700 block">
                  ${isEn ? 'Official Safe Evacuation Center' : 'Posko Pengungsian Resmi BNPB'}
                </span>
                <strong class="text-xs text-slate-900 block leading-tight">${shelter.name}</strong>
              </div>
            </div>

            <p class="text-[10px] text-slate-500 mb-2">📍 ${shelter.address}</p>

            <div class="bg-emerald-50 border border-emerald-200 p-2 rounded-lg mb-2">
              <div class="flex justify-between text-[10px] mb-1">
                <span class="text-slate-600">${isEn ? 'Occupancy Quota:' : 'Kapasitas Terisi:'}</span>
                <strong class="font-mono text-emerald-900">${shelter.currentOccupancy.toLocaleString('id-ID')} / ${shelter.capacity.toLocaleString('id-ID')} (${occupancyPercent}%)</strong>
              </div>
              <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div class="bg-emerald-600 h-full rounded-full" style="width: ${Math.min(occupancyPercent, 100)}%"></div>
              </div>
              <span class="text-[9px] text-emerald-700 font-medium block mt-1">
                ${isEn ? '✓ Emergency Soup Kitchen & Medical Ready' : '✓ Dapur Umum, Logistik & Medis Siaga'}
              </span>
            </div>

            <button 
              id="shelter-navigate-btn-${alert.id}"
              class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-2 rounded-lg text-[10px] transition cursor-pointer shadow flex items-center justify-center gap-1"
            >
              <span>🧭</span>
              <span>${isEn ? 'Select Evacuation Destination' : 'Tentukan Titik Tujuan Evakuasi'}</span>
            </button>
          </div>
        `;

        shelterMarker.bindPopup(shelterPopupHtml, {
          maxWidth: 300,
          autoPan: true,
          autoClose: false,
          closeOnClick: false,
          autoPanPaddingTopLeft: L.point(20, 90),
          autoPanPaddingBottomRight: L.point(20, 90)
        });

        shelterMarker.on('click', (e: any) => {
          if (e && e.originalEvent) {
            L.DomEvent.stopPropagation(e.originalEvent);
          }
          shelterMarker.openPopup();
        });

        shelterMarker.on('popupopen', () => {
          const popup = shelterMarker.getPopup();
          const popupEl = popup?.getElement();
          if (popupEl) {
            L.DomEvent.disableClickPropagation(popupEl);
            L.DomEvent.disableScrollPropagation(popupEl);
          }
          const navBtn = document.getElementById(`shelter-navigate-btn-${alert.id}`);
          if (navBtn) {
            navBtn.onclick = (e) => {
              e.stopPropagation();
              onSelectShelter?.(shelter.name, shelter.lat, shelter.lng);
              map.flyTo([shelter.lat, shelter.lng], 14, { duration: 1.2 });
            };
          }
        });

        shelterLayer.addLayer(shelterMarker);
      }

      // 4. Proximity Line from User to Nearest Alert or Shelter
      if (showProximityLines) {
        const polyline = L.polyline([
          [userCoords.lat, userCoords.lng],
          [alert.locationLat, alert.locationLng]
        ], {
          interactive: false,
          color: color,
          weight: 2,
          dashArray: '6, 6',
          opacity: 0.65
        });
        proxLayer.addLayer(polyline);

        if (alert.emergencyShelter) {
          const shelterLine = L.polyline([
            [alert.locationLat, alert.locationLng],
            [alert.emergencyShelter.lat, alert.emergencyShelter.lng]
          ], {
            interactive: false,
            color: '#10b981',
            weight: 2,
            dashArray: '4, 4',
            opacity: 0.75
          });
          proxLayer.addLayer(shelterLine);
        }
      }
    });
  }, [alerts, userCoords, showDangerRadius, showShelters, showProximityLines, isEn, onSelectAlert, onSelectShelter]);

  // Center on user position
  const handleFocusUser = () => {
    mapInstanceRef.current?.flyTo([userCoords.lat, userCoords.lng], 13, { duration: 1.2 });
  };

  // Center on all alerts bounds
  const handleFitAllAlerts = () => {
    const map = mapInstanceRef.current;
    if (!map || alerts.length === 0) return;

    const latLngs: L.LatLngExpression[] = [
      [userCoords.lat, userCoords.lng],
      ...alerts.map(a => [a.locationLat, a.locationLng] as [number, number]),
      ...alerts.filter(a => a.emergencyShelter).map(a => [a.emergencyShelter.lat, a.emergencyShelter.lng] as [number, number])
    ];

    const bounds = L.latLngBounds(latLngs);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  };

  // Center on National Indonesia
  const handleResetIndonesia = () => {
    mapInstanceRef.current?.flyTo([-2.5489, 118.0149], 5, { duration: 1.2 });
  };

  return (
    <div 
      ref={mapWrapperRef}
      className={`relative isolate w-full ${
        isFullscreen 
          ? 'sigap-fullscreen-fallback fixed inset-0 z-[9999] rounded-none !h-screen !w-screen bg-slate-950 !p-0 !m-0' 
          : 'h-[520px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl'
      }`}
    >
      {/* Leaflet Map DOM Target */}
      <div ref={mapContainerRef} className="w-full h-full" style={{ width: '100%', height: '100%' }} />

      {/* Top Left: Operational Tactical Header */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2">
        <div className="bg-slate-950/92 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800 text-slate-100 shadow-2xl pointer-events-auto flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
          <div>
            <div className="font-extrabold text-xs text-white flex items-center gap-1.5">
              <span>{isEn ? 'Citizen EWS Geographic Map' : 'Peta Geografis Sistem Peringatan Dini'}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                {alerts.length} {isEn ? 'Alerts' : 'Peringatan'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono block">
              {isEn ? 'Real-Time Hazard Radius & Verified Shelters' : 'Radius Bahaya Real-Time & Posko Pengungsian'}
            </span>
          </div>
        </div>
      </div>

      {/* Top Right: Tactical Tools & Controls Toolbar */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none flex flex-wrap items-center justify-end gap-2">
        {/* Quick Focus Tools */}
        <div className="flex items-center gap-1 bg-slate-950/92 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-2xl pointer-events-auto">
          <button
            onClick={handleFocusUser}
            className="p-1.5 rounded-lg text-cyan-400 hover:text-cyan-200 hover:bg-slate-800 transition cursor-pointer"
            title={isEn ? 'Focus My Location' : 'Pusatkan ke Posisi Saya'}
          >
            <Navigation className="w-4 h-4" />
          </button>
          <button
            onClick={handleFitAllAlerts}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title={isEn ? 'Fit All Alerts' : 'Cakupan Seluruh Peringatan'}
          >
            <Crosshair className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetIndonesia}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer text-[11px] font-bold font-mono"
            title={isEn ? 'Reset to Indonesia Overview' : 'Lihat Seluruh Indonesia'}
          >
            🇮🇩
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-0.5 bg-slate-950/92 backdrop-blur-md p-1 rounded-xl border border-slate-800 shadow-2xl pointer-events-auto">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title={isEn ? 'Zoom In' : 'Perbesar'}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title={isEn ? 'Zoom Out' : 'Perkecil'}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Basemap Switcher Dropdown */}
        <div className="relative pointer-events-auto" ref={basemapMenuRef}>
          <button
            onClick={() => setShowBasemapMenu(!showBasemapMenu)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-950/92 backdrop-blur-md border border-slate-800 text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-900 transition shadow-2xl flex items-center gap-1.5 cursor-pointer"
            title={isEn ? 'Change Basemap' : 'Ganti Peta Dasar'}
          >
            <span>{BASEMAP_TILES[selectedBasemap]?.icon || '🗺️'}</span>
            <span className="hidden sm:inline font-mono text-[11px]">
              {isEn ? BASEMAP_TILES[selectedBasemap]?.name : BASEMAP_TILES[selectedBasemap]?.nameId}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showBasemapMenu && (
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-slate-900/98 backdrop-blur-md border border-slate-700 rounded-xl p-1.5 shadow-2xl z-30 space-y-1 animate-in fade-in">
              {Object.entries(BASEMAP_TILES).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedBasemap(key as any);
                    setShowBasemapMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition cursor-pointer ${
                    selectedBasemap === key ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="text-sm">{config.icon}</span>
                  <span className="truncate">{isEn ? config.name : config.nameId}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* FULLSCREEN BUTTON */}
        <button
          onClick={toggleFullscreen}
          className={`p-2 rounded-xl backdrop-blur-md border shadow-2xl transition cursor-pointer pointer-events-auto ${
            isFullscreen
              ? 'bg-cyan-600 text-white border-cyan-400 ring-2 ring-cyan-300'
              : 'bg-slate-950/92 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
          title={isFullscreen ? (isEn ? 'Exit Fullscreen' : 'Keluar Layar Penuh') : (isEn ? 'Fullscreen Map' : 'Layar Penuh')}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-white" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Bottom Right: Layer Toggles */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-none flex flex-wrap items-center gap-1.5 justify-end">
        <div className="bg-slate-950/92 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-2xl pointer-events-auto flex flex-wrap items-center gap-1">
          <button
            onClick={() => setShowDangerRadius(!showDangerRadius)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
              showDangerRadius ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{isEn ? 'Danger Buffers' : 'Radius Bahaya'}</span>
          </button>

          <button
            onClick={() => setShowShelters(!showShelters)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
              showShelters ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>{isEn ? 'Safe Shelters' : 'Posko Pengungsian'}</span>
          </button>

          <button
            onClick={() => setShowProximityLines(!showProximityLines)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
              showProximityLines ? 'bg-blue-950 text-blue-300 border border-blue-800' : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{isEn ? 'Proximity Lines' : 'Garis Evakuasi'}</span>
          </button>
        </div>
      </div>

      {/* Bottom Left: Collapsible Legend */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
        <div className="bg-slate-950/92 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl text-xs text-slate-300 pointer-events-auto overflow-hidden min-w-[210px]">
          <div 
            onClick={() => setIsLegendOpen(!isLegendOpen)}
            className="flex items-center justify-between px-3 py-2 font-bold text-white text-[11px] uppercase tracking-wider cursor-pointer hover:bg-slate-900 transition border-b border-slate-800/80"
          >
            <span className="flex items-center gap-1.5">
              <span>🗺️</span>
              <span>{isEn ? 'Map Legend' : 'Legenda Peta EWS'}</span>
            </span>
            {isLegendOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </div>

          {isLegendOpen && (
            <div className="p-3 space-y-1.5 animate-in fade-in text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-cyan-500 border border-white flex items-center justify-center text-[9px] shrink-0 font-bold">👤</span>
                <span>{isEn ? 'Your Position (GPS Live)' : 'Posisi Anda (GPS Terdeteksi)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-red-600 border border-white flex items-center justify-center text-[9px] shrink-0 font-bold">🚨</span>
                <span>{isEn ? 'Red Danger Zone (Evacuate)' : 'Zona Merah Awas (Segera Evakuasi)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-white flex items-center justify-center text-[9px] shrink-0 font-bold">⚠️</span>
                <span>{isEn ? 'Advisory / Watch Zone' : 'Zona Siaga / Waspada'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 border border-white flex items-center justify-center text-[9px] shrink-0 font-bold">🏛️</span>
                <span>{isEn ? 'Verified Safe Shelter' : 'Posko Pengungsian Resmi (TES)'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
