import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import { 
  Flame, 
  Waves, 
  Activity, 
  MapPin, 
  User, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Phone,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronDown,
  ChevronUp,
  ShieldAlert
} from 'lucide-react';
import { Disaster, Volunteer, Task, Assignment, VolunteerTrackingTelemetry, HazardObservation } from '../../types/index.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { FirmsLayer } from './FirmsLayer.tsx';
import { InaRiskExposureLayer } from './InaRiskExposureLayer.tsx';

interface LeafletClusterMapProps {
  disasters: Disaster[];
  volunteers: Volunteer[];
  tasks: Task[];
  assignments?: Assignment[];
  selectedDisasterId?: string | null;
  onSelectDisaster?: (id: string) => void;
  onSelectVolunteer?: (vol: Volunteer) => void;
  onOpenAIMatching?: (task: Task) => void;
  center?: [number, number];
  zoom?: number;
  heightClass?: string;
  showDisasterFilter?: boolean;
  showVolunteerFilter?: boolean;
  showRadius?: boolean;
  isTrackingActive?: boolean;
  telemetryList?: VolunteerTrackingTelemetry[];
  selectedTrackedVolunteerId?: string | null;
  onSelectTrackedVolunteer?: (id: string | null) => void;
}

export const LeafletClusterMap: React.FC<LeafletClusterMapProps> = ({
  disasters,
  volunteers,
  tasks,
  selectedDisasterId,
  onSelectDisaster,
  onSelectVolunteer,
  onOpenAIMatching,
  center = [-6.225, 106.85],
  zoom = 12,
  heightClass = 'h-[620px]',
  showDisasterFilter = true,
  showVolunteerFilter = true,
  showRadius = true,
  isTrackingActive = false,
  telemetryList = [],
  selectedTrackedVolunteerId = null,
  onSelectTrackedVolunteer
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const clusterGroupRef = useRef<any>(null);
  const disasterLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const radiusLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const trackingLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeVolunteerStatus, setActiveVolunteerStatus] = useState<'all' | 'available' | 'busy'>('all');
  const [activeDisasterType, setActiveDisasterType] = useState<string>('all');
  const [tileLayerType, setTileLayerType] = useState<'dark' | 'standard'>('dark');
  const [mapRadiusEnabled, setMapRadiusEnabled] = useState<boolean>(showRadius);
  const [firmsLayerEnabled, setFirmsLayerEnabled] = useState<boolean>(true);
  const [firmsClustering, setFirmsClustering] = useState<boolean>(true);
  const [firmsMinFrp, setFirmsMinFrp] = useState<number>(0);
  const [firmsCount, setFirmsCount] = useState<number>(0);
  const [visibleFirmsCount, setVisibleFirmsCount] = useState<number>(0);
  const [highestFrp, setHighestFrp] = useState<number>(0);
  const [isLegendExpanded, setIsLegendExpanded] = useState<boolean>(true);

  // BNPB InaRISK Exposure Layer State
  const [inaRiskLayerEnabled, setInaRiskLayerEnabled] = useState<boolean>(true);
  const [inaRiskFilter, setInaRiskFilter] = useState<'ALL' | 'EKSTREM' | 'TINGGI'>('ALL');
  const [inaRiskZoneCount, setInaRiskZoneCount] = useState<number>(0);
  const [highestVulnerableDensity, setHighestVulnerableDensity] = useState<number>(0);

  // Stable callbacks for FirmsLayer to prevent unneeded re-rendering cycles
  const handleHotspotsLoaded = useCallback((count: number, maxFrp: number) => {
    setFirmsCount(count);
    setHighestFrp(maxFrp);
  }, []);

  const handleVisibleCountChange = useCallback((visible: number) => {
    setVisibleFirmsCount(visible);
  }, []);

  const handleSelectHotspot = useCallback((h: HazardObservation) => {
    // If there is an active wildfire in the disaster list, focus it
    const fireDisaster = disasters.find(d => d.type === 'fire');
    if (fireDisaster && onSelectDisaster) {
      onSelectDisaster(fireDisaster.id);
    }
  }, [disasters, onSelectDisaster]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Create map
    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: false,
    });

    // Humanitarian command center basemap: OpenStreetMap or Satellite Imagery
    const tileUrl = tileLayerType === 'dark' 
      ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

    const tiles = L.tileLayer(tileUrl, {
      attribution: tileLayerType === 'dark'
        ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        : 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 19,
    }).addTo(map);

    // Marker Cluster Group
    const clusterGroup = (L as any).markerClusterGroup ? (L as any).markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 45,
      spiderfyOnMaxZoom: true,
      zoomToBoundsOnClick: true,
      iconCreateFunction: (cluster: any) => {
        const count = cluster.getChildCount();
        const markers = cluster.getAllChildMarkers();
        const hasVolunteers = markers.some((m: any) => m.options?.itemType === 'volunteer');
        const hasTasks = markers.some((m: any) => m.options?.itemType === 'task');

        const className = hasTasks && hasVolunteers
          ? 'sigap-cluster-mixed'
          : hasTasks 
          ? 'sigap-cluster-disaster' 
          : 'sigap-cluster-volunteer';

        return L.divIcon({
          html: `<div class="${className} w-10 h-10 flex flex-col items-center justify-center text-xs font-bold text-white shadow-lg">
                  <span>${count}</span>
                  <span class="text-[9px] opacity-80">${hasTasks ? (isEn ? 'Tasks' : 'Tugas') : (isEn ? 'Volunteers' : 'Relawan')}</span>
                 </div>`,
          className: 'custom-cluster-marker',
          iconSize: L.point(40, 40)
        });
      }
    }) : L.layerGroup();

    map.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;

    const disasterGroup = L.layerGroup().addTo(map);
    disasterLayerGroupRef.current = disasterGroup;

    const radiusGroup = L.layerGroup().addTo(map);
    radiusLayerGroupRef.current = radiusGroup;

    const trackingGroup = L.layerGroup().addTo(map);
    trackingLayerGroupRef.current = trackingGroup;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center when selected disaster changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (selectedDisasterId) {
      const d = disasters.find(item => item.id === selectedDisasterId);
      if (d) {
        mapInstanceRef.current.flyTo([d.locationLat, d.locationLng], 14, {
          duration: 1.2
        });
      }
    }
  }, [selectedDisasterId, disasters]);

  // Render Disaster Markers and Radius
  useEffect(() => {
    const map = mapInstanceRef.current;
    const disasterGroup = disasterLayerGroupRef.current;
    if (!map || !disasterGroup) return;

    disasterGroup.clearLayers();

    const filteredDisasters = disasters.filter(d => {
      if (activeDisasterType !== 'all' && d.type !== activeDisasterType) return false;
      return true;
    });

    filteredDisasters.forEach(d => {
      const isSelected = selectedDisasterId === d.id;
      const isFire = d.type === 'fire';
      const isFlood = d.type === 'flood';

      const color = d.severity === 'critical' ? '#ef4444' : d.severity === 'high' ? '#f97316' : '#eab308';
      const badgeText = isFire ? (isEn ? 'WILDFIRE' : 'KARHUTLA') : isFlood ? (isEn ? 'FLOOD' : 'BANJIR') : d.type.toUpperCase();

      const iconHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="absolute -inset-2 rounded-full ${isSelected ? 'animate-ping' : ''}" style="background-color: ${color}; opacity: 0.35;"></div>
          <div class="relative w-9 h-9 rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2 border-white" style="background-color: ${color};">
            ${isFire ? '🔥' : isFlood ? '🌊' : '⚠️'}
          </div>
          <div class="absolute -bottom-5 whitespace-nowrap bg-slate-900/90 text-white text-[10px] px-1.5 py-0.5 rounded border border-slate-700 shadow font-medium">
            ${badgeText}
          </div>
        </div>
      `;

      const marker = L.marker([d.locationLat, d.locationLng], {
        icon: L.divIcon({
          html: iconHtml,
          className: 'disaster-custom-icon',
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        })
      });

      // Rich Popup
      const popupHtml = `
        <div class="p-3 w-72 text-slate-100">
          <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider text-white" style="background-color: ${color}">
              ${d.severity.toUpperCase()} • ${badgeText}
            </span>
            <span class="text-xs text-slate-400 font-mono">${d.province}</span>
          </div>
          <h4 class="font-bold text-sm text-white mb-1">${isEn ? (d.titleEn || d.title) : d.title}</h4>
          <p class="text-xs text-slate-300 line-clamp-2 mb-2">${isEn ? (d.descriptionEn || d.description) : d.description}</p>
          <div class="grid grid-cols-2 gap-2 text-xs bg-slate-800/60 p-2 rounded mb-2 border border-slate-700/60">
            <div>
              <div class="text-[10px] text-slate-400">${isEn ? 'Affected' : 'Terdampak'}</div>
              <div class="font-bold text-white">${d.affectedPeople.toLocaleString()} ${isEn ? 'People' : 'Jiwa'}</div>
            </div>
            <div>
              <div class="text-[10px] text-slate-400">${isFire ? (isEn ? 'Hotspots' : 'Titik Hotspot') : (isEn ? 'Water Depth' : 'Genangan Air')}</div>
              <div class="font-bold text-amber-400">${isFire ? (d.activeHotspots || (isEn ? 'Active' : 'Aktif')) + (isEn ? ' Spots' : ' Titik') : (d.waterLevelCm || 150) + ' cm'}</div>
            </div>
          </div>
          <button id="btn-select-disaster-${d.id}" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-1.5 px-3 rounded text-xs transition-colors flex items-center justify-center gap-1.5">
            ${isEn ? 'Select This Incident' : 'Pilih Bencana Ini'}
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, { 
        maxWidth: 300,
        autoPan: true,
        autoPanPaddingTopLeft: L.point(20, 145),
        autoPanPaddingBottomRight: L.point(20, 85)
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-select-disaster-${d.id}`);
        if (btn && onSelectDisaster) {
          btn.onclick = () => {
            onSelectDisaster(d.id);
            marker.closePopup();
          };
        }
      });

      disasterGroup.addLayer(marker);

      // Add hazard impact radius circle
      const radiusKm = d.severity === 'critical' ? 3.5 : 2.0;
      const circle = L.circle([d.locationLat, d.locationLng], {
        radius: radiusKm * 1000,
        color: color,
        fillColor: color,
        fillOpacity: 0.12,
        weight: 1.5,
        dashArray: '4, 6'
      });
      disasterGroup.addLayer(circle);
    });
  }, [disasters, selectedDisasterId, activeDisasterType, isEn]);

  // Render Clustered Volunteers and Tasks
  useEffect(() => {
    const clusterGroup = clusterGroupRef.current;
    const radiusGroup = radiusLayerGroupRef.current;
    if (!clusterGroup || !radiusGroup) return;

    clusterGroup.clearLayers();
    radiusGroup.clearLayers();

    const trackedIds = isTrackingActive && telemetryList ? new Set(telemetryList.map(t => t.volunteerId)) : new Set();

    // 1. Volunteer Markers
    const filteredVolunteers = volunteers.filter(v => {
      if (trackedIds.has(v.id)) return false;
      if (activeVolunteerStatus !== 'all' && v.status !== activeVolunteerStatus) return false;
      return true;
    });

    filteredVolunteers.forEach(v => {
      const isAvailable = v.status === 'available';
      const isBusy = v.status === 'busy';
      const statusColor = isAvailable ? '#10b981' : isBusy ? '#f59e0b' : '#64748b';

      const volunteerHtml = `
        <div class="relative cursor-pointer group">
          <div class="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md border-2 border-slate-900 transition-transform group-hover:scale-110" style="background-color: ${statusColor};">
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
          <span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-slate-900 ${isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}"></span>
        </div>
      `;

      const marker = L.marker([v.locationLat, v.locationLng], {
        itemType: 'volunteer',
        icon: L.divIcon({
          html: volunteerHtml,
          className: 'volunteer-cluster-item',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        })
      } as any);

      const vPopup = `
        <div class="p-3 w-64 text-slate-100">
          <div class="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800">
            <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs" style="background-color: ${statusColor};">
              ${v.name.slice(0, 2).toUpperCase()}
            </div>
            <div class="flex-1 min-w-0">
              <h5 class="font-bold text-sm text-white truncate">${v.name}</h5>
              <span class="text-[10px] px-1.5 py-0.5 rounded font-medium ${isAvailable ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}">
                ${isAvailable ? (isEn ? 'Available / Standby' : 'Tersedia Siaga') : (isEn ? 'On Duty' : 'Sedang Bertugas')}
              </span>
            </div>
          </div>
          <div class="text-xs text-slate-300 mb-2">
            <div class="flex items-center gap-1.5 text-slate-400 mb-1">
              <span>📍</span> <span>${v.city || v.address}</span>
            </div>
            <div class="flex items-center gap-1.5 text-slate-400 mb-1">
              <span>📞</span> <span>${v.phone}</span>
            </div>
            <div class="flex items-center gap-1.5 text-slate-400">
              <span>🎯</span> <span>${isEn ? 'Coverage' : 'Radius'}: ${v.radiusKm} km</span>
            </div>
          </div>
          <button id="btn-view-volunteer-${v.id}" class="w-full bg-slate-800 hover:bg-slate-700 text-blue-400 font-medium py-1.5 px-3 rounded text-xs border border-slate-700 transition-colors">
            ${isEn ? 'View Profile & Duty History' : 'Lihat Profil & Riwayat Penugasan'}
          </button>
        </div>
      `;

      marker.bindPopup(vPopup, { 
        maxWidth: 280,
        autoPan: true,
        autoPanPaddingTopLeft: L.point(20, 145),
        autoPanPaddingBottomRight: L.point(20, 85)
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-view-volunteer-${v.id}`);
        if (btn && onSelectVolunteer) {
          btn.onclick = () => {
            onSelectVolunteer(v);
            marker.closePopup();
          };
        }
      });

      clusterGroup.addLayer(marker);

      // Coverage radius circle if enabled
      if (mapRadiusEnabled && isAvailable) {
        const radiusCircle = L.circle([v.locationLat, v.locationLng], {
          radius: v.radiusKm * 1000,
          color: '#10b981',
          fillColor: '#10b981',
          fillOpacity: 0.04,
          weight: 0.8,
          dashArray: '3, 6'
        });
        radiusGroup.addLayer(radiusCircle);
      }
    });

    // 2. Task Markers (Filtered to selected disaster if any)
    const filteredTasks = tasks.filter(t => {
      if (selectedDisasterId && t.disasterId !== selectedDisasterId) return false;
      return t.status !== 'completed';
    });

    filteredTasks.forEach(t => {
      const isUrgent = t.priority === 'urgent';
      const isHigh = t.priority === 'high';
      const taskColor = isUrgent ? '#ef4444' : isHigh ? '#f97316' : '#3b82f6';

      const taskHtml = `
        <div class="relative cursor-pointer group">
          <div class="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold shadow-md border-2 border-slate-900 transition-transform group-hover:scale-110" style="background-color: ${taskColor};">
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/></svg>
          </div>
          <span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${isUrgent ? 'bg-red-500 animate-ping' : 'bg-transparent'}"></span>
        </div>
      `;

      const taskMarker = L.marker([t.locationLat, t.locationLng], {
        itemType: 'task',
        icon: L.divIcon({
          html: taskHtml,
          className: 'task-cluster-item',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        })
      } as any);

      const tPopup = `
        <div class="p-3 w-68 text-slate-100">
          <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider text-white" style="background-color: ${taskColor}">
              ${isEn ? 'TASK' : 'TUGAS'} ${t.priority.toUpperCase()}
            </span>
            <span class="text-[11px] text-slate-400 font-mono">${t.volunteersAssigned}/${t.volunteersNeeded} ${isEn ? 'Volunteers' : 'Relawan'}</span>
          </div>
          <h5 class="font-bold text-sm text-white mb-1">${isEn ? (t.titleEn || t.title) : t.title}</h5>
          <p class="text-xs text-slate-300 line-clamp-2 mb-2">${isEn ? (t.descriptionEn || t.description) : t.description}</p>
          <div class="text-[11px] bg-slate-800/80 p-1.5 rounded mb-2 text-slate-300 border border-slate-700/60">
            ${isEn ? 'Skill Required:' : 'Keahlian:'} <span class="font-semibold text-blue-400">${isEn ? (t.requiredSkillNameEn || t.requiredSkillName) : t.requiredSkillName}</span>
          </div>
          ${onOpenAIMatching ? `
            <button id="btn-match-task-${t.id}" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-1.5 px-3 rounded text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/20">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              ${isEn ? 'Match Volunteers with AI' : 'Cocokkan Relawan dengan AI'}
            </button>
          ` : ''}
        </div>
      `;

      taskMarker.bindPopup(tPopup, { 
        maxWidth: 290,
        autoPan: true,
        autoPanPaddingTopLeft: L.point(20, 145),
        autoPanPaddingBottomRight: L.point(20, 85)
      });

      taskMarker.on('popupopen', () => {
        const btn = document.getElementById(`btn-match-task-${t.id}`);
        if (btn && onOpenAIMatching) {
          btn.onclick = () => {
            onOpenAIMatching(t);
            taskMarker.closePopup();
          };
        }
      });

      clusterGroup.addLayer(taskMarker);
    });
  }, [volunteers, tasks, selectedDisasterId, activeVolunteerStatus, mapRadiusEnabled, isTrackingActive, telemetryList, isEn]);

  // Render Real-time Live Tracking Telemetry (Breadcrumb Trails & High-Tech Beacons)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const trackingGroup = trackingLayerGroupRef.current;
    if (!map || !trackingGroup) return;

    trackingGroup.clearLayers();

    if (!isTrackingActive || !telemetryList || telemetryList.length === 0) return;

    telemetryList.forEach((tel) => {
      const isSelected = selectedTrackedVolunteerId === tel.volunteerId;
      const isSar = tel.category === 'sar_official';
      const mainColor = isSelected ? '#06b6d4' : isSar ? '#f97316' : '#10b981';

      // 1. Breadcrumb History Polyline
      const trail = [...tel.previousPositions, [tel.currentLat, tel.currentLng] as [number, number]];
      if (trail.length >= 2) {
        const polyline = L.polyline(trail, {
          color: mainColor,
          weight: isSelected ? 4 : 2.5,
          opacity: 0.85,
          dashArray: isSelected ? undefined : '3, 5',
          lineCap: 'round',
          lineJoin: 'round'
        });
        trackingGroup.addLayer(polyline);
      }

      // 2. Waypoint Destination Line
      if (tel.destinationLat && tel.destinationLng) {
        const targetLine = L.polyline(
          [[tel.currentLat, tel.currentLng], [tel.destinationLat, tel.destinationLng]],
          {
            color: '#64748b',
            weight: 1.5,
            opacity: 0.55,
            dashArray: '3, 6'
          }
        );
        trackingGroup.addLayer(targetLine);
      }

      // 3. High-Tech Tactical Beacon Marker
      const markerHtml = `
        <div class="relative cursor-pointer group flex items-center justify-center">
          <div class="absolute -inset-3 rounded-full ${isSelected ? 'animate-ping' : 'animate-pulse'}" style="background-color: ${mainColor}; opacity: 0.4;"></div>
          
          <div class="relative w-8 h-8 rounded-full flex items-center justify-center text-white font-black shadow-xl border-2 ${isSelected ? 'border-cyan-300 ring-2 ring-cyan-400' : 'border-slate-900'}" style="background-color: ${mainColor};">
            <div style="transform: rotate(${tel.headingDeg}deg); transition: transform 0.3s ease-out;" class="flex items-center justify-center text-xs">
              ➤
            </div>
          </div>

          <div class="absolute -bottom-5 whitespace-nowrap bg-slate-950/95 text-white text-[9px] font-mono px-1.5 py-0.5 rounded border border-slate-700 shadow-lg flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>${tel.speedKmh} km/h</span>
          </div>
        </div>
      `;

      const marker = L.marker([tel.currentLat, tel.currentLng], {
        icon: L.divIcon({
          html: markerHtml,
          className: 'tactical-tracking-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        }),
        zIndexOffset: isSelected ? 1200 : 800
      });

      const cardinal = isEn 
        ? ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(((tel.headingDeg %= 360) < 0 ? tel.headingDeg + 360 : tel.headingDeg) / 45) % 8]
        : ['U', 'TL', 'T', 'TG', 'S', 'BD', 'B', 'BL'][Math.round(((tel.headingDeg %= 360) < 0 ? tel.headingDeg + 360 : tel.headingDeg) / 45) % 8];

      const popupHtml = `
        <div class="p-3 w-72 text-slate-100 font-sans">
          <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                ${isEn ? 'LIVE GPS TELEMETRY' : 'LIVE TELEMETRI GPS'}
              </span>
            </div>
            <span class="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
              ${tel.lastPing}
            </span>
          </div>

          <div class="flex items-center gap-2 mb-2">
            <div class="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black shadow" style="background-color: ${mainColor};">
              ${tel.volunteerName.slice(0, 2).toUpperCase()}
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="font-bold text-sm text-white truncate">${tel.volunteerName}</h4>
              <p class="text-[10px] text-slate-400 truncate">${tel.sarUnitOrRole || tel.organization}</p>
            </div>
          </div>

          <div class="bg-slate-950/80 p-2 rounded-lg border border-slate-800 mb-2 space-y-1">
            <div class="text-[10px] text-slate-400">${isEn ? 'Task:' : 'Tugas:'} <span class="text-white font-bold">${tel.dutyType}</span></div>
            <div class="text-[10px] text-slate-400">${isEn ? 'Destination:' : 'Tujuan:'} <span class="text-cyan-400 font-bold">${tel.destinationName}</span></div>
          </div>

          <div class="grid grid-cols-2 gap-1.5 text-xs font-mono tabular-nums mb-3">
            <div class="bg-slate-800/60 p-1.5 rounded border border-slate-700/60">
              <span class="text-[9px] text-slate-400 block">${isEn ? 'SPEED' : 'KECEPATAN'}</span>
              <span class="font-bold text-amber-400 text-sm">${tel.speedKmh} km/h</span>
            </div>
            <div class="bg-slate-800/60 p-1.5 rounded border border-slate-700/60">
              <span class="text-[9px] text-slate-400 block">${isEn ? 'HEADING' : 'ARAH KOMPAS'}</span>
              <span class="font-bold text-blue-400 text-sm">${tel.headingDeg}° (${cardinal})</span>
            </div>
            <div class="bg-slate-800/60 p-1.5 rounded border border-slate-700/60">
              <span class="text-[9px] text-slate-400 block">${isEn ? 'DISTANCE' : 'JARAK KE TUJUAN'}</span>
              <span class="font-bold text-emerald-400 text-sm">${tel.distanceToDestinationM} m</span>
            </div>
            <div class="bg-slate-800/60 p-1.5 rounded border border-slate-700/60">
              <span class="text-[9px] text-slate-400 block">${isEn ? 'BATTERY & SIGNAL' : 'BATERAI & SINYAL'}</span>
              <span class="font-bold text-slate-200 text-xs">${tel.batteryLevel}% • ${tel.signalStrength}</span>
            </div>
          </div>

          <button id="btn-follow-gps-${tel.volunteerId}" class="w-full ${isSelected ? 'bg-cyan-600 hover:bg-cyan-500' : 'bg-slate-800 hover:bg-slate-700 border border-slate-700'} text-white font-bold py-1.5 px-2 rounded text-xs transition-colors flex items-center justify-center gap-1">
            <span>${isSelected ? (isEn ? 'Tracking Live (Camera Locked ✓)' : 'Sedang Diikuti (Kamera Terkunci ✓)') : (isEn ? 'Focus & Follow GPS' : 'Fokus Kamera & Ikuti GPS')}</span>
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, { 
        maxWidth: 300,
        autoPan: true,
        autoPanPaddingTopLeft: L.point(20, 145),
        autoPanPaddingBottomRight: L.point(20, 85)
      });

      marker.on('popupopen', () => {
        const followBtn = document.getElementById(`btn-follow-gps-${tel.volunteerId}`);
        if (followBtn && onSelectTrackedVolunteer) {
          followBtn.onclick = () => {
            onSelectTrackedVolunteer(isSelected ? null : tel.volunteerId);
          };
        }
      });

      marker.on('click', () => {
        if (onSelectTrackedVolunteer) {
          onSelectTrackedVolunteer(tel.volunteerId);
        }
      });

      trackingGroup.addLayer(marker);
    });

    // Auto follow camera if selected
    if (selectedTrackedVolunteerId) {
      const activeTel = telemetryList.find(t => t.volunteerId === selectedTrackedVolunteerId);
      if (activeTel) {
        map.panTo([activeTel.currentLat, activeTel.currentLng], {
          animate: true,
          duration: 0.5
        });
      }
    }
  }, [isTrackingActive, telemetryList, selectedTrackedVolunteerId, onSelectTrackedVolunteer, isEn]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetView = () => {
    mapInstanceRef.current?.setView(center, zoom);
  };

  return (
    <div className={`relative isolate w-full ${heightClass} rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl`}>
      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* NASA FIRMS Real-time Wildfire Hotspots Pulsing Layer (High-Performance Clustering & Bounds Filter) */}
      <FirmsLayer
        map={mapInstanceRef.current}
        enabled={firmsLayerEnabled}
        minFrp={firmsMinFrp}
        useClustering={firmsClustering}
        onSelectHotspot={handleSelectHotspot}
        onHotspotsLoaded={handleHotspotsLoaded}
        onVisibleCountChange={handleVisibleCountChange}
      />

      {/* BNPB InaRISK Vulnerable Population Density & Resource Deployment Layer */}
      <InaRiskExposureLayer
        map={mapInstanceRef.current}
        enabled={inaRiskLayerEnabled}
        minVulnerability={inaRiskFilter}
        onZoneCountChange={(count, density) => {
          setInaRiskZoneCount(count);
          setHighestVulnerableDensity(density);
        }}
        onDeployResourcesToZone={(zone) => {
          if (onSelectDisaster) {
            const matchingDisaster = disasters.find(d => 
              Math.hypot(d.locationLat - zone.centerLat, d.locationLng - zone.centerLng) < 1.2
            );
            if (matchingDisaster) onSelectDisaster(matchingDisaster.id);
          }
        }}
      />

      {/* Top Controls Overlay */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto bg-slate-950/80 backdrop-blur-md p-1.5 rounded-lg border border-slate-800 shadow-lg">
          {showVolunteerFilter && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 text-[11px] px-1 font-medium">{isEn ? 'Volunteers:' : 'Relawan:'}</span>
              <button
                onClick={() => setActiveVolunteerStatus('all')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  activeVolunteerStatus === 'all' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {isEn ? 'All' : 'Semua'} ({volunteers.length})
              </button>
              <button
                onClick={() => setActiveVolunteerStatus('available')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  activeVolunteerStatus === 'available' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {isEn ? 'Available' : 'Tersedia'} ({volunteers.filter(v => v.status === 'available').length})
              </button>
              <button
                onClick={() => setActiveVolunteerStatus('busy')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  activeVolunteerStatus === 'busy' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {isEn ? 'On Duty' : 'Bertugas'} ({volunteers.filter(v => v.status === 'busy').length})
              </button>
            </div>
          )}

          {showDisasterFilter && (
            <div className="hidden sm:flex items-center gap-1 text-xs pl-2 border-l border-slate-800">
              <span className="text-slate-400 text-[11px] px-1 font-medium">{isEn ? 'Disaster:' : 'Bencana:'}</span>
              <select
                value={activeDisasterType}
                onChange={(e) => setActiveDisasterType(e.target.value)}
                className="bg-slate-900 text-slate-200 text-[11px] py-1 px-2 rounded border border-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="all">{isEn ? 'All Incident Types' : 'Semua Tipe Bencana'}</option>
                <option value="fire">{isEn ? 'Wildfire / Forest Fire 🔥' : 'Kebakaran / Karhutla 🔥'}</option>
                <option value="flood">{isEn ? 'Flood & Inundation 🌊' : 'Banjir & Luapan Air 🌊'}</option>
                <option value="earthquake">{isEn ? 'Earthquake ⚠️' : 'Gempa Bumi ⚠️'}</option>
              </select>
            </div>
          )}
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-950/80 backdrop-blur-md p-1.5 rounded-lg border border-slate-800 shadow-lg">
          {/* NASA FIRMS Hotspot Pulsing Layer Toggle */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFirmsLayerEnabled(!firmsLayerEnabled)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1.5 ${
                firmsLayerEnabled 
                  ? 'bg-amber-950/90 text-amber-300 border border-amber-700/80 shadow-md' 
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
              title={isEn ? 'Toggle NASA FIRMS VIIRS Active Fire Hotspots' : 'Tampilkan Titik Api Satelit NASA FIRMS (VIIRS)'}
            >
              <Flame className={`w-3.5 h-3.5 ${firmsLayerEnabled ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
              <span>{isEn ? 'NASA FIRMS' : 'Hotspot NASA'}</span>
              {firmsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold">
                  {visibleFirmsCount > 0 ? `${visibleFirmsCount}` : firmsCount}
                </span>
              )}
            </button>

            {firmsLayerEnabled && (
              <>
                <button
                  onClick={() => setFirmsClustering(!firmsClustering)}
                  className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors flex items-center gap-1 ${
                    firmsClustering 
                      ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50' 
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                  title={isEn ? 'Switch between Fast Clusters (60fps) and Individual Hotspots' : 'Beralih antara Mode Klaster Cepat (60fps) dan Titik Pencar'}
                >
                  <span>{firmsClustering ? (isEn ? '⚡ Cluster 60fps' : '⚡ Klaster 60fps') : (isEn ? 'Points' : 'Pencar')}</span>
                </button>

                <select
                  value={firmsMinFrp}
                  onChange={(e) => setFirmsMinFrp(Number(e.target.value))}
                  className="bg-slate-900 text-amber-300 text-[10px] py-1 px-1.5 rounded border border-amber-800/80 focus:outline-none"
                  title={isEn ? 'Filter by Fire Radiative Power (MW)' : 'Filter Kekuatan Titik Api (MW)'}
                >
                  <option value="0">{isEn ? 'All FRP' : 'Semua FRP'}</option>
                  <option value="15">{isEn ? '≥15 MW' : '≥15 MW'}</option>
                  <option value="25">{isEn ? '≥25 MW' : '≥25 MW (Tinggi)'}</option>
                  <option value="40">{isEn ? '≥40 MW' : '≥40 MW (Kritis)'}</option>
                </select>
              </>
            )}
          </div>

          {/* BNPB InaRISK Vulnerable Population Density Overlay Toggle */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setInaRiskLayerEnabled(!inaRiskLayerEnabled)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1.5 ${
                inaRiskLayerEnabled 
                  ? 'bg-rose-950/90 text-rose-300 border border-rose-700/80 shadow-md ring-1 ring-rose-500/40' 
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
              title={isEn ? 'Toggle BNPB InaRISK Vulnerable Population Density & Resource Deployment Overlays' : 'Tampilkan Lapisan Kepadatan Warga Rentan BNPB InaRISK untuk Prioritas Logistik'}
            >
              <ShieldAlert className={`w-3.5 h-3.5 ${inaRiskLayerEnabled ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
              <span>{isEn ? 'InaRISK Exposure' : 'InaRISK BNPB'}</span>
              {inaRiskLayerEnabled && inaRiskZoneCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[9px] font-bold">
                  {inaRiskZoneCount} {isEn ? 'Zones' : 'Zona'}
                </span>
              )}
            </button>

            {inaRiskLayerEnabled && (
              <select
                value={inaRiskFilter}
                onChange={(e) => setInaRiskFilter(e.target.value as any)}
                className="bg-slate-900 text-rose-300 text-[10px] py-1 px-1.5 rounded border border-rose-800/80 focus:outline-none"
                title={isEn ? 'Filter by Vulnerability Severity' : 'Filter Tingkat Kerentanan'}
              >
                <option value="ALL">{isEn ? 'All Levels' : 'Semua Level'}</option>
                <option value="TINGGI">{isEn ? 'High+ (≥0.75)' : 'Tinggi+ (≥0.75)'}</option>
                <option value="EKSTREM">{isEn ? 'Extreme Only (>0.85)' : 'Hanya Ekstrem (>0.85)'}</option>
              </select>
            )}
          </div>

          <button
            onClick={() => setMapRadiusEnabled(!mapRadiusEnabled)}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
              mapRadiusEnabled ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'text-slate-400 hover:bg-slate-800'
            }`}
            title={isEn ? 'Toggle Volunteer Coverage Radius' : 'Tampilkan Radius Jangkauan Relawan'}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            {isEn ? 'Radius' : 'Radius'}
          </button>
          <button
            onClick={handleResetView}
            className="p-1 rounded text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            title={isEn ? 'Reset Map View' : 'Reset Peta ke Titik Awal'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-1 rounded text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            title={isEn ? 'Zoom In' : 'Perbesar'}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1 rounded text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            title={isEn ? 'Zoom Out' : 'Perkecil'}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend Ribbon at Bottom (Smart Collapsible & Non-blocking) */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-auto">
        {isLegendExpanded ? (
          <div className="bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex flex-wrap items-center gap-3 shadow-2xl transition-all">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-white inline-block"></span>
              <span>{isEn ? 'Disaster' : 'Bencana'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span>{isEn ? 'Volunteer' : 'Relawan'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-md bg-blue-500 inline-block"></span>
              <span>{isEn ? 'Task' : 'Tugas'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full sigap-cluster-mixed inline-flex items-center justify-center text-[7.5px] font-bold">#</span>
              <span>{isEn ? 'Cluster' : 'Klaster'}</span>
            </div>
            {firmsLayerEnabled && firmsCount > 0 && (
              <div className="flex items-center gap-1.5 text-amber-300 font-bold border-l border-slate-700 pl-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse inline-block"></span>
                <span>{isEn ? 'NASA FIRMS' : 'Hotspot NASA'} ({visibleFirmsCount > 0 ? `${visibleFirmsCount} ${isEn ? 'in view' : 'di layar'}` : `${firmsCount}`})</span>
              </div>
            )}
            {inaRiskLayerEnabled && inaRiskZoneCount > 0 && (
              <div className="flex items-center gap-1.5 text-rose-300 font-bold border-l border-slate-700 pl-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 border border-white inline-block"></span>
                <span>{isEn ? 'InaRISK Exposure' : 'InaRISK Rentan'} ({inaRiskZoneCount} {isEn ? 'Zones' : 'Zona'})</span>
              </div>
            )}
            {isTrackingActive && telemetryList.length > 0 && (
              <div className="flex items-center gap-1.5 text-cyan-300 font-bold border-l border-slate-700 pl-2.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse inline-block"></span>
                <span>GPS ({telemetryList.length})</span>
              </div>
            )}
            <button
              onClick={() => setIsLegendExpanded(false)}
              className="ml-1 p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={isEn ? 'Collapse Legend' : 'Sembunyikan Legenda'}
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsLegendExpanded(true)}
            className="bg-slate-950/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-800 text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-all shadow-xl flex items-center gap-1.5 cursor-pointer"
            title={isEn ? 'Show Legend' : 'Tampilkan Legenda Peta'}
          >
            <span className="text-xs">🗺️</span>
            <span>{isEn ? 'Legend' : 'Legenda'}</span>
            {firmsLayerEnabled && firmsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold">
                🔥 {visibleFirmsCount > 0 ? visibleFirmsCount : firmsCount}
              </span>
            )}
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          </button>
        )}
      </div>
    </div>
  );
};
