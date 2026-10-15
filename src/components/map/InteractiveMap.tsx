import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  Layers, 
  Flame, 
  Waves, 
  Activity, 
  MapPin, 
  User, 
  CheckCircle2, 
  Clock, 
  X,
  Sparkles,
  Network,
  Maximize2
} from 'lucide-react';
import { Disaster, Volunteer, Task, Assignment } from '../../types/index.ts';
import { calculateDistance } from '../../lib/geo.ts';
import { GoogleMapsPlacesModal } from './GoogleMapsPlacesModal.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface InteractiveMapProps {
  disasters: Disaster[];
  volunteers: Volunteer[];
  tasks: Task[];
  assignments: Assignment[];
  selectedDisasterId: string | null;
  onSelectDisaster: (id: string) => void;
  onSelectVolunteer?: (vol: Volunteer) => void;
  onOpenAIMatching?: (task: Task) => void;
  onSelectLocation?: (lat: number, lng: number) => void;
  selectionMode?: boolean;
  isTrackingActive?: boolean;
  telemetryList?: any[];
  selectedTrackedVolunteerId?: string | null;
  onSelectTrackedVolunteer?: (id: string | null) => void;
}

interface ClusterableItem {
  id: string;
  type: 'volunteer' | 'task';
  lat: number;
  lng: number;
  data: Volunteer | Task;
}

interface MarkerCluster {
  id: string;
  x: number;
  y: number;
  lat: number;
  lng: number;
  items: ClusterableItem[];
  volunteerCount: number;
  taskCount: number;
  availableVolunteerCount: number;
  busyVolunteerCount: number;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  disasters,
  volunteers,
  tasks,
  assignments,
  selectedDisasterId,
  onSelectDisaster,
  onSelectVolunteer,
  onOpenAIMatching,
  onSelectLocation,
  selectionMode = false,
  isTrackingActive = false,
  telemetryList = [],
  selectedTrackedVolunteerId = null,
  onSelectTrackedVolunteer
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  // Map viewport states (Center coordinates and Zoom level)
  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: -6.22, lng: 106.84 });
  const [zoom, setZoom] = useState<number>(12); // zoom level
  const [showVolunteers, setShowVolunteers] = useState<boolean>(true);
  const [showDisasters, setShowDisasters] = useState<boolean>(true);
  const [showTasks, setShowTasks] = useState<boolean>(true);
  const [showRadius, setShowRadius] = useState<boolean>(true);
  const [clusteringEnabled, setClusteringEnabled] = useState<boolean>(true);
  const [activeVolunteerFilter, setActiveVolunteerFilter] = useState<'all' | 'available' | 'busy'>('all');

  // Modal for Google Maps Grounding
  const [isGoogleMapsModalOpen, setIsGoogleMapsModalOpen] = useState(false);

  // Selected item or cluster popover
  const [hoveredItem, setHoveredItem] = useState<{
    type: 'disaster' | 'volunteer' | 'task' | 'cluster';
    data: Disaster | Volunteer | Task | MarkerCluster;
    x: number;
    y: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number; centerLat: number; centerLng: number }>({
    x: 0,
    y: 0,
    centerLat: 0,
    centerLng: 0,
  });

  // Center on selected disaster if changed
  useEffect(() => {
    if (selectedDisasterId) {
      const d = disasters.find(item => item.id === selectedDisasterId);
      if (d) {
        setCenter({ lat: d.locationLat, lng: d.locationLng });
      }
    }
  }, [selectedDisasterId, disasters]);

  // Center on tracked volunteer if selected
  useEffect(() => {
    if (selectedTrackedVolunteerId && isTrackingActive && telemetryList.length > 0) {
      const tel = telemetryList.find(t => t.volunteerId === selectedTrackedVolunteerId);
      if (tel) {
        setCenter({ lat: tel.currentLat, lng: tel.currentLng });
      }
    }
  }, [selectedTrackedVolunteerId, isTrackingActive, telemetryList]);

  // Convert lat/lng to container pixel coordinates
  const latLngToPoint = (lat: number, lng: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scale = Math.pow(2, zoom) * 12;
    const x = width / 2 + (lng - center.lng) * scale;
    const y = height / 2 - (lat - center.lat) * scale * 1.05;
    return { x, y };
  };

  // Convert pixel click to lat/lng
  const pointToLatLng = (pxX: number, pxY: number) => {
    if (!containerRef.current) return { lat: 0, lng: 0 };
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const scale = Math.pow(2, zoom) * 12;

    const lng = center.lng + (pxX - width / 2) / scale;
    const lat = center.lat - (pxY - height / 2) / (scale * 1.05);
    return {
      lat: Math.round(lat * 10000) / 10000,
      lng: Math.round(lng * 10000) / 10000,
    };
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.map-control-btn') || (e.target as HTMLElement).closest('.map-popup')) {
      return;
    }
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      centerLat: center.lat,
      centerLng: center.lng,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const scale = Math.pow(2, zoom) * 12;

    const newLng = dragStartRef.current.centerLng - dx / scale;
    const newLat = dragStartRef.current.centerLat + dy / (scale * 1.05);

    setCenter({ lat: newLat, lng: newLng });
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMapClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    if ((e.target as HTMLElement).closest('.interactive-marker')) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const coords = pointToLatLng(clickX, clickY);

    if (selectionMode && onSelectLocation) {
      onSelectLocation(coords.lat, coords.lng);
    } else {
      setHoveredItem(null);
    }
  };

  const handleZoom = (delta: number, targetCenter?: { lat: number; lng: number }) => {
    setZoom(prev => Math.min(16, Math.max(9, prev + delta)));
    if (targetCenter) {
      setCenter(targetCenter);
    }
  };

  const resetToJakarta = () => {
    setCenter({ lat: -6.22, lng: 106.84 });
    setZoom(12);
  };

  const resetToBanten = () => {
    setCenter({ lat: -6.4022, lng: 105.8234 });
    setZoom(11);
  };

  const selectedDisaster = disasters.find(d => d.id === selectedDisasterId);

  // Filtered volunteers
  const displayedVolunteers = volunteers.filter(v => {
    if (activeVolunteerFilter === 'all') return true;
    return v.status === activeVolunteerFilter;
  });

  // Filtered tasks
  const displayedTasks = tasks.filter(t => !selectedDisasterId || t.disasterId === selectedDisasterId);

  /* ========================================================================
     Leaflet-Inspired Marker Clustering Algorithm
     ======================================================================== */
  const clusters = useMemo(() => {
    if (!clusteringEnabled || zoom >= 15) {
      return null;
    }

    const items: ClusterableItem[] = [];
    const trackedIds = isTrackingActive && telemetryList ? new Set(telemetryList.map((t: any) => t.volunteerId)) : new Set();

    if (showVolunteers) {
      displayedVolunteers.forEach(v => {
        if (trackedIds.has(v.id)) return;
        items.push({
          id: v.id,
          type: 'volunteer',
          lat: v.locationLat,
          lng: v.locationLng,
          data: v,
        });
      });
    }

    if (showTasks) {
      displayedTasks.forEach(t => {
        items.push({
          id: t.id,
          type: 'task',
          lat: t.locationLat,
          lng: t.locationLng,
          data: t,
        });
      });
    }

    // Distance threshold in pixels for clustering
    // Clusters merge if closer than 52px at current zoom level
    const clusterRadiusPx = 52;
    const result: MarkerCluster[] = [];

    for (const item of items) {
      const pt = latLngToPoint(item.lat, item.lng);
      let closestCluster: MarkerCluster | null = null;
      let minDistance = clusterRadiusPx;

      for (const c of result) {
        const dist = Math.hypot(c.x - pt.x, c.y - pt.y);
        if (dist < minDistance) {
          minDistance = dist;
          closestCluster = c;
        }
      }

      if (closestCluster) {
        closestCluster.items.push(item);
        const count = closestCluster.items.length;
        // Recalculate centroid in pixel & lat/lng coordinates
        closestCluster.x = (closestCluster.x * (count - 1) + pt.x) / count;
        closestCluster.y = (closestCluster.y * (count - 1) + pt.y) / count;
        closestCluster.lat = (closestCluster.lat * (count - 1) + item.lat) / count;
        closestCluster.lng = (closestCluster.lng * (count - 1) + item.lng) / count;

        if (item.type === 'volunteer') {
          closestCluster.volunteerCount++;
          if ((item.data as Volunteer).status === 'available') closestCluster.availableVolunteerCount++;
          else if ((item.data as Volunteer).status === 'busy') closestCluster.busyVolunteerCount++;
        } else {
          closestCluster.taskCount++;
        }
      } else {
        result.push({
          id: `cluster-${item.id}`,
          x: pt.x,
          y: pt.y,
          lat: item.lat,
          lng: item.lng,
          items: [item],
          volunteerCount: item.type === 'volunteer' ? 1 : 0,
          taskCount: item.type === 'task' ? 1 : 0,
          availableVolunteerCount: item.type === 'volunteer' && (item.data as Volunteer).status === 'available' ? 1 : 0,
          busyVolunteerCount: item.type === 'volunteer' && (item.data as Volunteer).status === 'busy' ? 1 : 0,
        });
      }
    }

    return result;
  }, [
    clusteringEnabled,
    zoom,
    center,
    showVolunteers,
    showTasks,
    displayedVolunteers,
    displayedTasks,
  ]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleMapClick}
      className="relative isolate w-full h-full min-h-[540px] bg-slate-950 overflow-hidden select-none cursor-grab active:cursor-grabbing border border-slate-800 rounded-xl"
    >
      {/* Tactical Cartographic Canvas / Grid Background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
        <defs>
          <pattern id="tactical-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" />
          </pattern>
          <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="#020617" stopOpacity="0" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.8" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#tactical-grid)" />
        <rect width="100%" height="100%" fill="url(#vignette)" />
      </svg>

      {/* SVG Layer for Radius Rings & Connection Vectors */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {selectedDisaster && showRadius && (
          <g>
            {[10, 25, 50].map((radiusKm) => {
              const dPt = latLngToPoint(selectedDisaster.locationLat, selectedDisaster.locationLng);
              const edgePt = latLngToPoint(selectedDisaster.locationLat, selectedDisaster.locationLng + radiusKm / 111);
              const pxRadius = Math.abs(edgePt.x - dPt.x);

              return (
                <g key={`radius-${radiusKm}`}>
                  <circle
                    cx={dPt.x}
                    cy={dPt.y}
                    r={pxRadius}
                    fill={radiusKm === 10 ? 'rgba(239, 68, 68, 0.04)' : 'none'}
                    stroke={radiusKm === 10 ? '#ef4444' : radiusKm === 25 ? '#f59e0b' : '#3b82f6'}
                    strokeWidth={radiusKm === 10 ? '1.5' : '1'}
                    strokeDasharray={radiusKm === 10 ? 'none' : '4,4'}
                    opacity={radiusKm === 10 ? 0.6 : 0.35}
                  />
                  <text
                    x={dPt.x + pxRadius + 4}
                    y={dPt.y - 4}
                    fill="#94a3b8"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {radiusKm} km
                  </text>
                </g>
              );
            })}

            {/* Connection vectors to assigned volunteers */}
            {assignments
              .filter(a => a.disasterId === selectedDisaster.id && a.status !== 'completed')
              .map(a => {
                const vol = volunteers.find(v => v.id === a.volunteerId);
                if (!vol) return null;
                const dPt = latLngToPoint(selectedDisaster.locationLat, selectedDisaster.locationLng);
                const vPt = latLngToPoint(vol.locationLat, vol.locationLng);

                return (
                  <line
                    key={`vector-${a.id}`}
                    x1={dPt.x}
                    y1={dPt.y}
                    x2={vPt.x}
                    y2={vPt.y}
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                    opacity="0.6"
                  />
                );
              })}
          </g>
        )}

        {/* Live Tracking Trails & Destination Lines */}
        {isTrackingActive && (
          <g className="live-tracking-trails">
            {telemetryList.map((tel: any) => {
              const currentPt = latLngToPoint(tel.currentLat, tel.currentLng);
              const pointsStr = [...tel.previousPositions, [tel.currentLat, tel.currentLng]]
                .map((p: [number, number]) => {
                  const pt = latLngToPoint(p[0], p[1]);
                  return `${pt.x},${pt.y}`;
                })
                .join(' ');

              const isSelected = selectedTrackedVolunteerId === tel.volunteerId;
              const mainColor = isSelected ? '#06b6d4' : tel.category === 'sar_official' ? '#f97316' : '#10b981';

              let destLine = null;
              if (tel.destinationLat && tel.destinationLng) {
                const destPt = latLngToPoint(tel.destinationLat, tel.destinationLng);
                destLine = (
                  <line
                    key={`dest-${tel.volunteerId}`}
                    x1={currentPt.x}
                    y1={currentPt.y}
                    x2={destPt.x}
                    y2={destPt.y}
                    stroke="#64748b"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                    opacity="0.5"
                  />
                );
              }

              return (
                <g key={`trail-group-${tel.volunteerId}`}>
                  {destLine}
                  {pointsStr && (
                    <polyline
                      points={pointsStr}
                      fill="none"
                      stroke={mainColor}
                      strokeWidth={isSelected ? '3.5' : '2'}
                      strokeDasharray={isSelected ? undefined : '3,3'}
                      strokeOpacity="0.8"
                    />
                  )}
                </g>
              );
            })}
          </g>
        )}
      </svg>

      {/* Markers Layer */}
      <div className="absolute inset-0 pointer-events-auto">
        {/* Live GPS Telemetry Responders */}
        {isTrackingActive &&
          telemetryList.map((tel: any) => {
            const pt = latLngToPoint(tel.currentLat, tel.currentLng);
            const isSelected = selectedTrackedVolunteerId === tel.volunteerId;
            const isSar = tel.category === 'sar_official';
            const mainColor = isSelected ? '#06b6d4' : isSar ? '#f97316' : '#10b981';

            return (
              <div
                key={`live-marker-${tel.volunteerId}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectTrackedVolunteer) {
                    onSelectTrackedVolunteer(isSelected ? null : tel.volunteerId);
                  }
                }}
                style={{
                  transform: `translate(${pt.x}px, ${pt.y}px) translate(-50%, -50%)`,
                }}
                className={`interactive-marker absolute cursor-pointer transition-transform duration-150 ${
                  isSelected ? 'z-40 scale-125' : 'z-30 hover:scale-110'
                }`}
              >
                <div
                  className={`absolute -inset-2.5 rounded-full ${isSelected ? 'animate-ping' : 'animate-pulse'}`}
                  style={{ backgroundColor: mainColor, opacity: 0.4 }}
                />
                <div
                  className={`relative w-8 h-8 rounded-full flex items-center justify-center text-white font-black shadow-lg border-2 ${
                    isSelected ? 'border-cyan-300 ring-2 ring-cyan-400' : 'border-slate-900'
                  }`}
                  style={{ backgroundColor: mainColor }}
                >
                  <div style={{ transform: `rotate(${tel.headingDeg}deg)` }} className="text-xs">
                    ➤
                  </div>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 bg-slate-950/90 text-white border border-slate-700 rounded text-[9px] font-mono whitespace-nowrap shadow-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{tel.speedKmh} km/h</span>
                </div>
              </div>
            );
          })}

        {/* 1. Disaster Markers (Always unclustered for critical epicenter visibility) */}
        {showDisasters &&
          disasters.map(d => {
            const { x, y } = latLngToPoint(d.locationLat, d.locationLng);
            const isSelected = d.id === selectedDisasterId;
            const isCritical = d.severity === 'critical';

            return (
              <div
                key={d.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectDisaster(d.id);
                  setHoveredItem({ type: 'disaster', data: d, x, y });
                }}
                style={{
                  transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
                }}
                className={`interactive-marker absolute cursor-pointer transition-transform duration-150 ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-110 z-20'
                }`}
              >
                <div
                  className={`absolute -inset-2 rounded-full animate-ping opacity-40 pointer-events-none ${
                    isCritical ? 'bg-red-500' : 'bg-amber-500'
                  }`}
                />

                <div
                  className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 shadow-lg transition-colors ${
                    isCritical
                      ? 'bg-red-600 border-red-300 text-white shadow-red-500/40'
                      : d.severity === 'high'
                      ? 'bg-orange-600 border-orange-300 text-white shadow-orange-500/40'
                      : 'bg-amber-600 border-amber-300 text-white shadow-amber-500/40'
                  }`}
                >
                  {d.type === 'flood' ? (
                    <Waves className="w-4 h-4" />
                  ) : d.type === 'fire' ? (
                    <Flame className="w-4 h-4" />
                  ) : (
                    <Activity className="w-4 h-4" />
                  )}
                </div>

                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 bg-slate-900/90 text-slate-200 border border-slate-700 rounded text-[10px] font-semibold whitespace-nowrap shadow-md pointer-events-none">
                  {d.title.split('-')[0].trim()}
                </div>
              </div>
            );
          })}

        {/* 2. Clustered Markers Mode */}
        {clusters !== null ? (
          clusters.map(cluster => {
            const isSingle = cluster.items.length === 1;

            if (isSingle) {
              const item = cluster.items[0];
              const { x, y } = latLngToPoint(item.lat, item.lng);

              if (item.type === 'volunteer') {
                const vol = item.data as Volunteer;
                const isAvailable = vol.status === 'available';
                const isBusy = vol.status === 'busy';

                return (
                  <div
                    key={`vol-${vol.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectVolunteer?.(vol);
                      setHoveredItem({ type: 'volunteer', data: vol, x, y });
                    }}
                    style={{ transform: `translate(${x}px, ${y}px) translate(-50%, -50%)` }}
                    className="interactive-marker absolute cursor-pointer hover:scale-125 transition-transform duration-100 z-10"
                    title={`${vol.name} (${vol.status})`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full border border-slate-900 shadow-sm ${
                        isAvailable
                          ? 'bg-emerald-500 shadow-emerald-500/40 ring-2 ring-emerald-500/30'
                          : isBusy
                          ? 'bg-amber-500 shadow-amber-500/40 ring-1 ring-amber-500/30'
                          : 'bg-slate-500 shadow-slate-500/40'
                      }`}
                    />
                  </div>
                );
              } else {
                const task = item.data as Task;
                const isUrgent = task.priority === 'urgent';

                return (
                  <div
                    key={`task-${task.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setHoveredItem({ type: 'task', data: task, x, y });
                    }}
                    style={{ transform: `translate(${x}px, ${y}px) translate(-50%, -50%)` }}
                    className="interactive-marker absolute cursor-pointer hover:scale-125 transition-transform duration-100 z-15"
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border shadow-md text-[10px] font-bold ${
                        isUrgent
                          ? 'bg-red-900/90 border-red-500 text-red-200 shadow-red-900/50'
                          : 'bg-blue-900/90 border-blue-500 text-blue-200'
                      }`}
                    >
                      <MapPin className="w-3 h-3" />
                    </div>
                  </div>
                );
              }
            }

            // Multiple items in cluster -> Leaflet-Style Concentric Cluster Badge
            const totalCount = cluster.items.length;
            const isMedium = totalCount >= 10 && totalCount < 25;
            const isLarge = totalCount >= 25;

            // Halo color theme based on cluster composition
            const haloBg = isLarge
              ? 'bg-purple-500/20 text-purple-200 border-purple-500/50'
              : isMedium
              ? 'bg-amber-500/20 text-amber-200 border-amber-500/50'
              : 'bg-emerald-500/20 text-emerald-200 border-emerald-500/50';

            const badgeBg = isLarge
              ? 'bg-purple-600 text-white shadow-purple-600/40'
              : isMedium
              ? 'bg-amber-600 text-white shadow-amber-600/40'
              : 'bg-emerald-600 text-white shadow-emerald-600/40';

            return (
              <div
                key={cluster.id}
                onClick={(e) => {
                  e.stopPropagation();
                  // Leaflet behavior: Zoom in +2 levels centered on cluster centroid!
                  handleZoom(2, { lat: cluster.lat, lng: cluster.lng });
                  setHoveredItem(null);
                }}
                onMouseEnter={(e) => {
                  setHoveredItem({
                    type: 'cluster',
                    data: cluster,
                    x: cluster.x,
                    y: cluster.y,
                  });
                }}
                style={{
                  transform: `translate(${cluster.x}px, ${cluster.y}px) translate(-50%, -50%)`,
                }}
                className="interactive-marker absolute cursor-pointer hover:scale-115 transition-transform duration-150 z-20"
              >
                {/* Outer concentric pulsing ring */}
                <div
                  className={`w-10 h-10 rounded-full border flex items-center justify-center p-1 backdrop-blur-sm ${haloBg}`}
                >
                  {/* Center Count Badge */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs font-mono tabular-nums shadow-lg border border-white/20 ${badgeBg}`}
                  >
                    {totalCount}
                  </div>
                </div>

                {/* Micro Pill below with composition indicator */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0.5 px-1 py-0.2 bg-slate-900/90 text-[9px] font-mono text-slate-300 rounded border border-slate-700 whitespace-nowrap pointer-events-none">
                  {cluster.volunteerCount > 0 ? `${cluster.volunteerCount}R` : ''}
                  {cluster.taskCount > 0 ? ` ${cluster.taskCount}T` : ''}
                </div>
              </div>
            );
          })
        ) : (
          /* 3. Unclustered Mode (Standard Individual Markers) */
          <>
            {showVolunteers &&
              displayedVolunteers.map(v => {
                const { x, y } = latLngToPoint(v.locationLat, v.locationLng);
                const isAvailable = v.status === 'available';
                const isBusy = v.status === 'busy';

                return (
                  <div
                    key={`raw-vol-${v.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectVolunteer?.(v);
                      setHoveredItem({ type: 'volunteer', data: v, x, y });
                    }}
                    style={{ transform: `translate(${x}px, ${y}px) translate(-50%, -50%)` }}
                    className="interactive-marker absolute cursor-pointer hover:scale-125 transition-transform duration-100 z-10"
                    title={`${v.name} (${v.status})`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full border border-slate-900 shadow-sm ${
                        isAvailable
                          ? 'bg-emerald-500 shadow-emerald-500/40 ring-2 ring-emerald-500/30'
                          : isBusy
                          ? 'bg-amber-500 shadow-amber-500/40 ring-1 ring-amber-500/30'
                          : 'bg-slate-500 shadow-slate-500/40'
                      }`}
                    />
                  </div>
                );
              })}

            {showTasks &&
              displayedTasks.map(t => {
                const { x, y } = latLngToPoint(t.locationLat, t.locationLng);
                const isUrgent = t.priority === 'urgent';

                return (
                  <div
                    key={`raw-task-${t.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setHoveredItem({ type: 'task', data: t, x, y });
                    }}
                    style={{ transform: `translate(${x}px, ${y}px) translate(-50%, -50%)` }}
                    className="interactive-marker absolute cursor-pointer hover:scale-125 transition-transform duration-100 z-15"
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border shadow-md text-[10px] font-bold ${
                        isUrgent
                          ? 'bg-red-900/90 border-red-500 text-red-200 shadow-red-900/50'
                          : 'bg-blue-900/90 border-blue-500 text-blue-200'
                      }`}
                    >
                      <MapPin className="w-3 h-3" />
                    </div>
                  </div>
                );
              })}
          </>
        )}
      </div>

      {/* Popover Card for Hovered/Clicked Item or Cluster */}
      {hoveredItem && (
        <div
          style={{
            left: Math.min(hoveredItem.x + 12, (containerRef.current?.clientWidth || 600) - 280),
            top: Math.max(16, hoveredItem.y - 30),
          }}
          className="map-popup absolute z-40 w-72 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 text-slate-200 shadow-2xl pointer-events-auto"
        >
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
              {hoveredItem.type === 'cluster'
                ? (isEn ? 'Marker Cluster (Leaflet Cluster)' : 'Gugus Marker (Leaflet Cluster)')
                : hoveredItem.type === 'disaster'
                ? (isEn ? 'Disaster Incident' : 'Operasi Bencana')
                : hoveredItem.type === 'volunteer'
                ? (isEn ? 'Volunteer Profile' : 'Profil Relawan')
                : (isEn ? 'Field Task' : 'Tugas Lapangan')}
            </span>
            <button
              onClick={() => setHoveredItem(null)}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {hoveredItem.type === 'cluster' && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-blue-600/20 text-blue-300 border border-blue-500/40 flex items-center justify-center font-bold text-xs font-mono">
                  {(hoveredItem.data as MarkerCluster).items.length}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {(hoveredItem.data as MarkerCluster).items.length} {isEn ? 'Clustered Locations' : 'Titik Terkelompok'}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {isEn ? 'Geographic Coordinates Cluster' : 'Gugus Wilayah Koordinat'}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] border-t border-slate-800 pt-2 font-mono tabular-nums">
                <div className="flex justify-between">
                  <span className="text-slate-400">{isEn ? 'Standby Volunteers:' : 'Relawan Siaga:'}</span>
                  <span className="text-emerald-400 font-semibold">
                    {(hoveredItem.data as MarkerCluster).availableVolunteerCount} {isEn ? 'Personnel' : 'Personel'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isEn ? 'On Duty Volunteers:' : 'Relawan Bertugas:'}</span>
                  <span className="text-amber-400 font-semibold">
                    {(hoveredItem.data as MarkerCluster).busyVolunteerCount} {isEn ? 'Personnel' : 'Personel'}
                  </span>
                </div>
                {(hoveredItem.data as MarkerCluster).taskCount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isEn ? 'Field Tasks:' : 'Tugas Lapangan:'}</span>
                    <span className="text-blue-400 font-semibold">
                      {(hoveredItem.data as MarkerCluster).taskCount} {isEn ? 'Tasks' : 'Titik Tugas'}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  const cluster = hoveredItem.data as MarkerCluster;
                  handleZoom(2, { lat: cluster.lat, lng: cluster.lng });
                  setHoveredItem(null);
                }}
                className="mt-2.5 w-full py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-center flex items-center justify-center gap-1.5"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                {isEn ? 'Zoom & Expand Cluster (+2 Zoom)' : 'Perbesar & Perluas Gugus (+2 Zoom)'}
              </button>
            </div>
          )}

          {hoveredItem.type === 'disaster' && (
            <div>
              <h4 className="text-xs font-bold text-white line-clamp-2">
                {(hoveredItem.data as Disaster).title}
              </h4>
              <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                {(hoveredItem.data as Disaster).description}
              </p>
              <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono tabular-nums">
                <span className="text-slate-400">{isEn ? 'Affected:' : 'Terdampak:'}</span>
                <span className="text-amber-400 font-semibold">
                  {(hoveredItem.data as Disaster).affectedPeople.toLocaleString('id-ID')} {isEn ? 'people' : 'jiwa'}
                </span>
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  onClick={() => onSelectDisaster((hoveredItem.data as Disaster).id)}
                  className="w-full py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-center"
                >
                  {isEn ? 'Open Full Incident' : 'Buka Operasi Lengkap'}
                </button>
              </div>
            </div>
          )}

          {hoveredItem.type === 'volunteer' && (
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold">
                  {(hoveredItem.data as Volunteer).name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {(hoveredItem.data as Volunteer).name}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {(hoveredItem.data as Volunteer).organization || (isEn ? 'Independent Volunteer' : 'Relawan Independen')}
                  </span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">{isEn ? 'Status:' : 'Status:'}</span>
                  <span
                    className={`font-semibold ${
                      (hoveredItem.data as Volunteer).status === 'available'
                        ? 'text-emerald-400'
                        : (hoveredItem.data as Volunteer).status === 'busy'
                        ? 'text-amber-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {(hoveredItem.data as Volunteer).status === 'available'
                      ? (isEn ? 'Available / Standby' : 'Tersedia Siaga')
                      : (hoveredItem.data as Volunteer).status === 'busy'
                      ? (isEn ? 'On Duty' : 'Sedang Bertugas')
                      : 'Offline'}
                  </span>
                </div>
                {selectedDisaster && (
                  <div className="flex justify-between font-mono tabular-nums">
                    <span className="text-slate-400">{isEn ? 'Distance to Incident:' : 'Jarak ke Bencana:'}</span>
                    <span className="text-blue-300 font-semibold">
                      {calculateDistance(
                        selectedDisaster.locationLat,
                        selectedDisaster.locationLng,
                        (hoveredItem.data as Volunteer).locationLat,
                        (hoveredItem.data as Volunteer).locationLng
                      ).toFixed(1)}{' '}
                      km
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-mono tabular-nums">
                  <span className="text-slate-400">{isEn ? 'Tasks Completed:' : 'Tugas Selesai:'}</span>
                  <span className="text-slate-300">
                    {(hoveredItem.data as Volunteer).completedTasksCount} {isEn ? 'assignments' : 'penugasan'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onSelectVolunteer?.(hoveredItem.data as Volunteer)}
                className="mt-2.5 w-full py-1 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              >
                {isEn ? 'View Profile Details' : 'Lihat Detail Profil'}
              </button>
            </div>
          )}

          {hoveredItem.type === 'task' && (
            <div>
              <h4 className="text-xs font-bold text-white line-clamp-2">
                {(hoveredItem.data as Task).title}
              </h4>
              <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                {(hoveredItem.data as Task).description}
              </p>
              <div className="mt-2 pt-2 border-t border-slate-800 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">{isEn ? 'Required Skill:' : 'Keahlian:'}</span>
                  <span className="text-blue-300 font-semibold truncate max-w-[150px]">
                    {(hoveredItem.data as Task).requiredSkillName}
                  </span>
                </div>
                <div className="flex justify-between font-mono tabular-nums">
                  <span className="text-slate-400">{isEn ? 'Volunteers Required:' : 'Relawan Dibutuhkan:'}</span>
                  <span className="text-white">
                    {(hoveredItem.data as Task).volunteersAssigned} /{' '}
                    {(hoveredItem.data as Task).volunteersNeeded}
                  </span>
                </div>
              </div>
              {onOpenAIMatching && (
                <button
                  onClick={() => onOpenAIMatching(hoveredItem.data as Task)}
                  className="mt-2.5 w-full py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isEn ? 'AI Volunteer Matching' : 'Pencocokan Relawan AI'}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Floating Tactical Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20 pointer-events-auto">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg p-1 shadow-lg flex flex-col gap-1">
          <button
            onClick={() => handleZoom(1)}
            title={isEn ? 'Zoom In' : 'Perbesar'}
            className="map-control-btn p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(-1)}
            title={isEn ? 'Zoom Out' : 'Perkecil'}
            className="map-control-btn p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetToJakarta}
            title={isEn ? 'Focus Jakarta' : 'Fokus Jakarta'}
            className="map-control-btn p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>

        {/* Quick View Presets */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg p-1 shadow-lg flex flex-col gap-1">
          <button
            onClick={resetToJakarta}
            className="map-control-btn px-2 py-1 text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded text-left transition-colors whitespace-nowrap"
          >
            Jabodetabek
          </button>
          <button
            onClick={resetToBanten}
            className="map-control-btn px-2 py-1 text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded text-left transition-colors whitespace-nowrap"
          >
            {isEn ? 'Banten Coast' : 'Pesisir Banten'}
          </button>
        </div>

        {/* Google Maps Grounding Quick Button */}
        {selectedDisaster && (
          <button
            onClick={() => setIsGoogleMapsModalOpen(true)}
            title={isEn ? 'Find Nearby Facilities on Google Maps' : 'Cari Faskes Terdekat Google Maps'}
            className="map-control-btn px-2.5 py-1.5 text-[11px] font-semibold text-emerald-300 bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-700/80 rounded-lg shadow-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isEn ? 'Google Maps Facilities' : 'Faskes Google Maps'}</span>
          </button>
        )}
      </div>

      {/* Layer Toggles & Marker Clustering Toggle Bar (Top Left) */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 pointer-events-auto">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg p-1.5 shadow-lg flex items-center gap-1.5 text-xs text-slate-300">
          <Layers className="w-3.5 h-3.5 text-slate-400 mr-1" />
          <button
            onClick={() => setShowDisasters(!showDisasters)}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              showDisasters ? 'bg-red-950/80 text-red-200 border border-red-800/80' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isEn ? 'Disasters' : 'Bencana'} ({disasters.length})
          </button>
          <button
            onClick={() => setShowVolunteers(!showVolunteers)}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              showVolunteers ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-800/80' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isEn ? 'Volunteers' : 'Relawan'} ({volunteers.length})
          </button>
          <button
            onClick={() => setShowTasks(!showTasks)}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              showTasks ? 'bg-blue-950/80 text-blue-200 border border-blue-800/80' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isEn ? 'Tasks' : 'Tugas'} ({tasks.length})
          </button>

          {/* Marker Clustering Toggle */}
          <button
            onClick={() => setClusteringEnabled(!clusteringEnabled)}
            className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
              clusteringEnabled
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Network className="w-3 h-3" />
            <span>Cluster: {clusteringEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setShowRadius(!showRadius)}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              showRadius ? 'bg-slate-800 text-slate-200' : 'text-slate-500 hover:text-white'
            }`}
          >
            Radius 50km
          </button>
        </div>

        {/* Volunteer status quick filter */}
        {showVolunteers && (
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg p-1 shadow-lg flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveVolunteerFilter('all')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                activeVolunteerFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isEn ? 'All' : 'Semua'}
            </button>
            <button
              onClick={() => setActiveVolunteerFilter('available')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                activeVolunteerFilter === 'available' ? 'bg-emerald-900/60 text-emerald-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isEn ? 'Standby' : 'Siaga'}
            </button>
            <button
              onClick={() => setActiveVolunteerFilter('busy')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                activeVolunteerFilter === 'busy' ? 'bg-amber-900/60 text-amber-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isEn ? 'On Duty' : 'Bertugas'}
            </button>
          </div>
        )}
      </div>

      {/* Bottom Map Info Footer */}
      <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-none text-[11px] text-slate-400 font-mono">
        <div className="bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 rounded border border-slate-800/80 tabular-nums">
          {isEn ? 'Center' : 'Pusat'}: {center.lat.toFixed(4)}°S, {center.lng.toFixed(4)}°E · Zoom {zoom}
          {clusteringEnabled && clusters ? ` · ${clusters.length} ${isEn ? 'active marker clusters' : 'gugus marker aktif'}` : ''}
        </div>
        <div className="bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 rounded border border-slate-800/80">
          {isEn ? 'Click numbered cluster badge to zoom in and inspect area' : 'Klik gugus angka untuk memperluas marker wilayah'}
        </div>
      </div>

      {/* Google Maps Places Grounding Modal */}
      {isGoogleMapsModalOpen && selectedDisaster && (
        <GoogleMapsPlacesModal
          disaster={selectedDisaster}
          onClose={() => setIsGoogleMapsModalOpen(false)}
        />
      )}
    </div>
  );
};
