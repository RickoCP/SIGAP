import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import { 
  Users, 
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  Award, 
  CheckCircle2, 
  Clock, 
  Compass, 
  Flame, 
  Waves, 
  Layers, 
  ShieldCheck, 
  Send,
  Maximize2
} from 'lucide-react';
import { Volunteer, SkillCategory, Disaster } from '../../types/index.ts';
import { SEED_SKILLS } from '../../data/seedData.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface NationalVolunteerMapProps {
  volunteers: Volunteer[];
  disasters: Disaster[];
  onSelectVolunteer?: (volunteer: Volunteer) => void;
  onOpenBroadcastModal?: (disaster: Disaster) => void;
}

export const NationalVolunteerMap: React.FC<NationalVolunteerMapProps> = ({
  volunteers,
  disasters,
  onSelectVolunteer,
  onOpenBroadcastModal
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const clusterGroupRef = useRef<any>(null);
  const radiusLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'available' | 'busy'>('all');
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<string>('all');
  const [showRadius, setShowRadius] = useState<boolean>(true);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(volunteers[0] || null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-6.22, 106.85],
      zoom: 11,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Marker Cluster Group
    const clusterGroup = (L as any).markerClusterGroup ? (L as any).markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 40,
      spiderfyOnMaxZoom: true,
      zoomToBoundsOnClick: true,
      iconCreateFunction: (cluster: any) => {
        const count = cluster.getChildCount();
        return L.divIcon({
          html: `<div class="sigap-cluster-volunteer w-10 h-10 flex flex-col items-center justify-center text-xs font-bold text-white shadow-xl">
                  <span>${count}</span>
                  <span class="text-[9px] opacity-80">${isEn ? 'Responders' : 'Relawan'}</span>
                 </div>`,
          className: 'volunteer-cluster-badge',
          iconSize: L.point(40, 40)
        });
      }
    }) : L.layerGroup();

    map.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;

    // Radius Layer Group
    const radiusGroup = L.layerGroup();
    map.addLayer(radiusGroup);
    radiusLayerGroupRef.current = radiusGroup;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [isEn]);

  // Filter volunteers
  const filteredVolunteers = volunteers.filter(v => {
    if (selectedStatus !== 'all' && v.status !== selectedStatus) return false;
    
    if (selectedSkillCategory !== 'all') {
      const hasCategory = v.skills.some(vs => {
        const s = SEED_SKILLS.find(item => item.id === vs.skillId);
        return s?.category === selectedSkillCategory;
      });
      if (!hasCategory) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = v.name.toLowerCase().includes(q);
      const matchCity = v.city.toLowerCase().includes(q);
      const matchOrg = (v.organization || '').toLowerCase().includes(q);
      if (!matchName && !matchCity && !matchOrg) return false;
    }

    return true;
  });

  // Populate Markers & Circles
  useEffect(() => {
    if (!clusterGroupRef.current || !mapInstanceRef.current) return;

    clusterGroupRef.current.clearLayers();
    if (radiusLayerGroupRef.current) {
      radiusLayerGroupRef.current.clearLayers();
    }

    filteredVolunteers.forEach(v => {
      const isAvailable = v.status === 'available';
      const colorHex = isAvailable ? '#10b981' : '#f59e0b';

      const customIcon = L.divIcon({
        html: `<div style="background-color: ${colorHex};" class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold transition-transform hover:scale-125">
                 ${v.name.slice(0, 1)}
               </div>`,
        className: 'volunteer-marker-pin',
        iconSize: L.point(32, 32),
        iconAnchor: [16, 16],
      });

      const marker = L.marker([v.locationLat, v.locationLng], { icon: customIcon });

      marker.on('click', () => {
        setSelectedVolunteer(v);
        mapInstanceRef.current?.panTo([v.locationLat, v.locationLng]);
      });

      clusterGroupRef.current.addLayer(marker);

      if (showRadius && radiusLayerGroupRef.current) {
        const circle = L.circle([v.locationLat, v.locationLng], {
          radius: v.radiusKm * 1000,
          color: colorHex,
          fillColor: colorHex,
          fillOpacity: 0.08,
          weight: 1,
          dashArray: '4, 6'
        });
        radiusLayerGroupRef.current.addLayer(circle);
      }
    });
  }, [filteredVolunteers, showRadius]);

  const availableCount = volunteers.filter(v => v.status === 'available').length;
  const busyCount = volunteers.filter(v => v.status === 'busy').length;

  return (
    <div className="space-y-4">
      {/* Top Controls & Census */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {isEn ? 'SIGAP Disaster Response Volunteer Network' : 'Jaringan Relawan Tanggap Bencana SIGAP'}
              </span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              {isEn ? 'National Responder Locations & Clusters Map' : 'Peta Lokasi & Klaster Seluruh Relawan'}
            </h2>
            <p className="text-xs text-slate-400">
              {isEn 
                ? 'Geospatial distribution of certified emergency responders with Leaflet Marker Clustering and autonomous mobilization radius.'
                : 'Distribusi geospasial relawan tersertifikasi dengan Leaflet Marker Clustering dan radius operasional mandiri.'}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-xs">
            <div>
              <div className="text-[10px] text-slate-400 font-medium">{isEn ? 'Total Responders' : 'Total Terdata'}</div>
              <div className="text-base font-black text-white">{volunteers.length} {isEn ? 'People' : 'Relawan'}</div>
            </div>
            <div className="border-l border-slate-800 pl-3">
              <div className="text-[10px] text-slate-400 font-medium">{isEn ? 'Ready Standby' : 'Tersedia Siaga'}</div>
              <div className="text-base font-black text-emerald-400">{availableCount}</div>
            </div>
            <div className="border-l border-slate-800 pl-3">
              <div className="text-[10px] text-slate-400 font-medium">{isEn ? 'Active On-Duty' : 'Sedang Bertugas'}</div>
              <div className="text-base font-black text-amber-400">{busyCount}</div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-xs">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isEn ? 'Search name, city, or unit...' : 'Cari nama, kota, atau organisasi...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 pl-8 pr-3 py-1.5 rounded-lg border border-slate-800 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Status Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                selectedStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              {isEn ? 'All Status' : 'Semua Status'}
            </button>
            <button
              onClick={() => setSelectedStatus('available')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                selectedStatus === 'available' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              {isEn ? `Ready (${availableCount})` : `Tersedia (${availableCount})`}
            </button>
            <button
              onClick={() => setSelectedStatus('busy')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                selectedStatus === 'busy' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              {isEn ? `Busy (${busyCount})` : `Bertugas (${busyCount})`}
            </button>
          </div>

          {/* Skill Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedSkillCategory}
              onChange={(e) => setSelectedSkillCategory(e.target.value)}
              className="bg-slate-800 text-slate-200 py-1.5 px-3 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 text-xs font-medium"
            >
              <option value="all">{isEn ? 'All Skill Categories' : 'Semua Kategori Keahlian'}</option>
              <option value="sar">{isEn ? 'SAR & Water Rescue' : 'SAR & Water Rescue (Banjir)'}</option>
              <option value="medical">{isEn ? 'Medical & First Aid' : 'Medis & Pertolongan Pertama'}</option>
              <option value="logistics">{isEn ? 'Logistics & Supply Chain' : 'Logistik & Distribusi Bantuan'}</option>
              <option value="transport">{isEn ? 'Transport & Fleet' : 'Transportasi (Perahu / Ambulans)'}</option>
              <option value="food">{isEn ? 'Disaster Soup Kitchen' : 'Koki Dapur Umum Bencana'}</option>
              <option value="shelter">{isEn ? 'Tents & Temporary Shelter' : 'Pemasangan Tenda & Huntara'}</option>
              <option value="psychosocial">{isEn ? 'Psychosocial Trauma Healing' : 'Trauma Healing Psikososial'}</option>
            </select>

            <button
              onClick={() => setShowRadius(!showRadius)}
              className={`px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
                showRadius ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {isEn ? 'Range Radius' : 'Radius Jangkauan'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Map + Volunteer Detail Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Leaflet Map with Marker Clustering */}
        <div className="lg:col-span-8 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative isolate shadow-2xl h-[680px]">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Map Floating Ribbon */}
          <div className="absolute bottom-4 left-4 z-20 bg-slate-950/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-800 text-xs text-slate-300 shadow-xl flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              <span>{isEn ? 'Ready Responders' : 'Relawan Tersedia'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
              <span>{isEn ? 'Deployed On-Duty' : 'Sedang Bertugas'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full sigap-cluster-volunteer inline-flex items-center justify-center text-[8px] font-bold">#</span>
              <span>{isEn ? 'Auto Cluster (Click to Spiderfy)' : 'Klaster Otomatis (Klik untuk Spiderfy)'}</span>
            </div>
          </div>
        </div>

        {/* Selected Volunteer Card & Directory Quick Peek */}
        <div className="lg:col-span-4 space-y-4">
          {selectedVolunteer ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-md ${
                    selectedVolunteer.status === 'available' ? 'bg-emerald-600' : 'bg-amber-600'
                  }`}>
                    {selectedVolunteer.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">{selectedVolunteer.name}</h3>
                    <p className="text-xs text-slate-400">{selectedVolunteer.organization || (isEn ? 'Independent Volunteer' : 'Relawan Independen')}</p>
                    <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded ${
                      selectedVolunteer.status === 'available' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {selectedVolunteer.status === 'available' ? (isEn ? 'Ready Standby' : 'Tersedia Siaga') : (isEn ? 'On Duty' : 'Sedang Bertugas')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact & Location Info */}
              <div className="space-y-2 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">{selectedVolunteer.address}, {selectedVolunteer.city}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{selectedVolunteer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Compass className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{isEn ? 'Mobilization Radius: ' : 'Radius Jangkauan Mobilisasi: '}<strong className="text-white">{selectedVolunteer.radiusKm} km</strong></span>
                </div>
              </div>

              {/* Skills List */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  {isEn ? 'Skills & Certifications:' : 'Keahlian & Sertifikasi:'}
                </h4>
                <div className="space-y-1.5">
                  {selectedVolunteer.skills.map((vs, idx) => {
                    const sk = SEED_SKILLS.find(s => s.id === vs.skillId);
                    return (
                      <div key={idx} className="flex items-center justify-between text-xs bg-slate-800/50 p-2 rounded border border-slate-700/60">
                        <span className="font-medium text-slate-200">{sk?.name || vs.skillId}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          vs.proficiency === 'expert' ? 'bg-purple-950 text-purple-300 border border-purple-800' : 'bg-blue-950 text-blue-300 border border-blue-800'
                        }`}>
                          {vs.proficiency}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs text-center">
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-400">{isEn ? 'Tasks Completed' : 'Tugas Selesai'}</div>
                  <div className="text-base font-bold text-white">{selectedVolunteer.completedTasksCount} {isEn ? 'Missions' : 'Operasi'}</div>
                </div>
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-400">{isEn ? 'Active Missions' : 'Tugas Aktif'}</div>
                  <div className="text-base font-bold text-blue-400">{selectedVolunteer.activeTasksCount} {isEn ? 'Tasks' : 'Tugas'}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-1 space-y-2">
                <button
                  onClick={() => onSelectVolunteer && onSelectVolunteer(selectedVolunteer)}
                  className="w-full bg-slate-800 hover:bg-slate-750 text-white font-medium py-2 px-3 rounded-lg text-xs border border-slate-700 transition-colors"
                >
                  {isEn ? 'Open Full Profile & History' : 'Buka Profil Lengkap & Histori Tugas'}
                </button>
              </div>
            </div>
          ) : null}

          {/* Quick Volunteer List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              {isEn ? `Filtered Responders (${filteredVolunteers.length})` : `Relawan Terfilter (${filteredVolunteers.length})`}
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {filteredVolunteers.slice(0, 15).map(v => {
                const isSelected = selectedVolunteer?.id === v.id;
                const isAvailable = v.status === 'available';
                return (
                  <div
                    key={v.id}
                    onClick={() => {
                      setSelectedVolunteer(v);
                      mapInstanceRef.current?.flyTo([v.locationLat, v.locationLng], 14, { duration: 0.8 });
                    }}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-600/80 shadow-md'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                        isAvailable ? 'bg-emerald-600' : 'bg-amber-600'
                      }`}>
                        {v.name.slice(0, 1)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{v.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{v.city} • Radius {v.radiusKm} km</div>
                      </div>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ${
                      isAvailable ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                    }`}>
                      {isAvailable ? (isEn ? 'Ready' : 'Tersedia') : (isEn ? 'On Duty' : 'Bertugas')}
                    </span>
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
