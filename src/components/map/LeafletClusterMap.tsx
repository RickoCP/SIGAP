import React, { useEffect, useRef, useState } from 'react';
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
  Maximize2
} from 'lucide-react';
import { Disaster, Volunteer, Task, Assignment, VolunteerTrackingTelemetry } from '../../types/index.ts';

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
                  <span class="text-[9px] opacity-80">${hasTasks ? 'Tugas' : 'Relawan'}</span>
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
      const badgeText = isFire ? 'KARHUTLA' : isFlood ? 'BANJIR' : d.type.toUpperCase();

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
          <h4 class="font-bold text-sm text-white mb-1">${d.title}</h4>
          <p class="text-xs text-slate-300 line-clamp-2 mb-2">${d.description}</p>
          <div class="grid grid-cols-2 gap-2 text-xs bg-slate-800/60 p-2 rounded mb-2 border border-slate-700/60">
            <div>
              <div class="text-[10px] text-slate-400">Terdampak</div>
              <div class="font-bold text-white">${d.affectedPeople.toLocaleString()} Jiwa</div>
            </div>
            <div>
              <div class="text-[10px] text-slate-400">${isFire ? 'Titik Hotspot' : 'Genangan Air'}</div>
              <div class="font-bold text-amber-400">${isFire ? (d.activeHotspots || 'Aktif') + ' Titik' : (d.waterLevelCm || 150) + ' cm'}</div>
            </div>
          </div>
          <button id="btn-select-disaster-${d.id}" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-1.5 px-3 rounded text-xs transition-colors flex items-center justify-center gap-1.5">
            Pilih Bencana Ini
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 300 });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-select-disaster-${d.id}`);
        if (btn && onSelectDisaster) {
          btn.onclick = () => {
            onSelectDisaster(d.id);
            marker.closePopup();
          };
        }
      });

      marker.on('click', () => {
        if (onSelectDisaster) onSelectDisaster(d.id);
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
  }, [disasters, selectedDisasterId, activeDisasterType]);

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
                ${isAvailable ? 'Tersedia Siaga' : 'Sedang Bertugas'}
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
              <span>🎯</span> <span>Radius: ${v.radiusKm} km</span>
            </div>
          </div>
          <button id="btn-view-volunteer-${v.id}" class="w-full bg-slate-800 hover:bg-slate-700 text-blue-400 font-medium py-1.5 px-3 rounded text-xs border border-slate-700 transition-colors">
            Lihat Profil & Riwayat Penugasan
          </button>
        </div>
      `;

      marker.bindPopup(vPopup, { maxWidth: 280 });

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
              TUGAS ${t.priority.toUpperCase()}
            </span>
            <span class="text-[11px] text-slate-400 font-mono">${t.volunteersAssigned}/${t.volunteersNeeded} Relawan</span>
          </div>
          <h5 class="font-bold text-sm text-white mb-1">${t.title}</h5>
          <p class="text-xs text-slate-300 line-clamp-2 mb-2">${t.description}</p>
          <div class="text-[11px] bg-slate-800/80 p-1.5 rounded mb-2 text-slate-300 border border-slate-700/60">
            Keahlian: <span class="font-semibold text-blue-400">${t.requiredSkillName}</span>
          </div>
          ${onOpenAIMatching ? `
            <button id="btn-match-task-${t.id}" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-1.5 px-3 rounded text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/20">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              Cocokkan Relawan dengan AI
            </button>
          ` : ''}
        </div>
      `;

      taskMarker.bindPopup(tPopup, { maxWidth: 290 });

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
  }, [volunteers, tasks, selectedDisasterId, activeVolunteerStatus, mapRadiusEnabled, isTrackingActive, telemetryList]);

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

      const cardinal = ['U', 'TL', 'T', 'TG', 'S', 'BD', 'B', 'BL'][Math.round(((tel.headingDeg %= 360) < 0 ? tel.headingDeg + 360 : tel.headingDeg) / 45) % 8];

      const popupHtml = `
        <div class="p-3 w-72 text-slate-100 font-sans">
          <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                LIVE TELEMETRI GPS
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
            <div class="text-[10px] text-slate-400">Tugas: <span class="text-white font-bold">${tel.dutyType}</span></div>
            <div class="text-[10px] text-slate-400">Tujuan: <span class="text-cyan-400 font-bold">${tel.destinationName}</span></div>
          </div>

          <div class="grid grid-cols-2 gap-1.5 text-xs font-mono tabular-nums mb-3">
            <div class="bg-slate-800/60 p-1.5 rounded border border-slate-700/60">
              <span class="text-[9px] text-slate-400 block">KECEPATAN</span>
              <span class="font-bold text-amber-400 text-sm">${tel.speedKmh} km/h</span>
            </div>
            <div class="bg-slate-800/60 p-1.5 rounded border border-slate-700/60">
              <span class="text-[9px] text-slate-400 block">ARAH KOMPAS</span>
              <span class="font-bold text-blue-400 text-sm">${tel.headingDeg}° (${cardinal})</span>
            </div>
            <div class="bg-slate-800/60 p-1.5 rounded border border-slate-700/60">
              <span class="text-[9px] text-slate-400 block">JARAK KE TUJUAN</span>
              <span class="font-bold text-emerald-400 text-sm">${tel.distanceToDestinationM} m</span>
            </div>
            <div class="bg-slate-800/60 p-1.5 rounded border border-slate-700/60">
              <span class="text-[9px] text-slate-400 block">BATERAI & SINYAL</span>
              <span class="font-bold text-slate-200 text-xs">${tel.batteryLevel}% • ${tel.signalStrength}</span>
            </div>
          </div>

          <button id="btn-follow-gps-${tel.volunteerId}" class="w-full ${isSelected ? 'bg-cyan-600 hover:bg-cyan-500' : 'bg-slate-800 hover:bg-slate-700 border border-slate-700'} text-white font-bold py-1.5 px-2 rounded text-xs transition-colors flex items-center justify-center gap-1">
            <span>${isSelected ? 'Sedang Diikuti (Kamera Terkunci ✓)' : 'Fokus Kamera & Ikuti GPS'}</span>
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 300 });

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
  }, [isTrackingActive, telemetryList, selectedTrackedVolunteerId, onSelectTrackedVolunteer]);

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

      {/* Top Controls Overlay */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto bg-slate-950/80 backdrop-blur-md p-1.5 rounded-lg border border-slate-800 shadow-lg">
          {showVolunteerFilter && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 text-[11px] px-1 font-medium">Relawan:</span>
              <button
                onClick={() => setActiveVolunteerStatus('all')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  activeVolunteerStatus === 'all' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Semua ({volunteers.length})
              </button>
              <button
                onClick={() => setActiveVolunteerStatus('available')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  activeVolunteerStatus === 'available' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Tersedia ({volunteers.filter(v => v.status === 'available').length})
              </button>
              <button
                onClick={() => setActiveVolunteerStatus('busy')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  activeVolunteerStatus === 'busy' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Bertugas ({volunteers.filter(v => v.status === 'busy').length})
              </button>
            </div>
          )}

          {showDisasterFilter && (
            <div className="hidden sm:flex items-center gap-1 text-xs pl-2 border-l border-slate-800">
              <span className="text-slate-400 text-[11px] px-1 font-medium">Bencana:</span>
              <select
                value={activeDisasterType}
                onChange={(e) => setActiveDisasterType(e.target.value)}
                className="bg-slate-900 text-slate-200 text-[11px] py-1 px-2 rounded border border-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="all">Semua Tipe Bencana</option>
                <option value="fire">Kebakaran / Karhutla 🔥</option>
                <option value="flood">Banjir & Luapan Air 🌊</option>
                <option value="earthquake">Gempa Bumi ⚠️</option>
              </select>
            </div>
          )}
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-950/80 backdrop-blur-md p-1.5 rounded-lg border border-slate-800 shadow-lg">
          <button
            onClick={() => setMapRadiusEnabled(!mapRadiusEnabled)}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
              mapRadiusEnabled ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'text-slate-400 hover:bg-slate-800'
            }`}
            title="Tampilkan Radius Jangkauan Relawan"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Radius
          </button>
          <button
            onClick={handleResetView}
            className="p-1 rounded text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            title="Reset Peta ke Titik Awal"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-1 rounded text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            title="Perbesar"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1 rounded text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            title="Perkecil"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend Ribbon at Bottom */}
      <div className="absolute bottom-3 left-3 z-20 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex items-center gap-3 shadow-lg pointer-events-none sm:pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500 border border-white inline-block"></span>
          <span>Episentrum Bencana</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
          <span>Relawan Siaga</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-blue-500 inline-block"></span>
          <span>Tugas Terbuka</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full sigap-cluster-mixed inline-flex items-center justify-center text-[8px] font-bold">#</span>
          <span>Klaster Terkelompok</span>
        </div>
        {isTrackingActive && (
          <div className="flex items-center gap-1.5 text-cyan-300 font-bold border-l border-slate-700 pl-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping inline-block"></span>
            <span>Live GPS Responders ({telemetryList.length})</span>
          </div>
        )}
      </div>
    </div>
  );
};
