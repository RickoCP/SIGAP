import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  InaRiskExposureZone, 
  VERIFIED_INARISK_EXPOSURE_ZONES, 
  getInaRiskZones, 
  getInaRiskDensityColor 
} from '../../data/inaRiskExposureData.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

export interface InaRiskExposureLayerProps {
  map: L.Map | null;
  enabled: boolean;
  minVulnerability?: 'ALL' | 'EKSTREM' | 'TINGGI';
  onSelectZone?: (zone: InaRiskExposureZone) => void;
  onZoneCountChange?: (count: number, highestDensity: number) => void;
  onDeployResourcesToZone?: (zone: InaRiskExposureZone) => void;
}

export const InaRiskExposureLayer: React.FC<InaRiskExposureLayerProps> = ({
  map,
  enabled,
  minVulnerability = 'ALL',
  onSelectZone,
  onZoneCountChange,
  onDeployResourcesToZone
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const polygonLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const markerLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Layer Groups once
  useEffect(() => {
    if (!map) return;

    if (!polygonLayerGroupRef.current) {
      polygonLayerGroupRef.current = L.layerGroup().addTo(map);
    }
    if (!markerLayerGroupRef.current) {
      markerLayerGroupRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      if (polygonLayerGroupRef.current && map) {
        map.removeLayer(polygonLayerGroupRef.current);
        polygonLayerGroupRef.current = null;
      }
      if (markerLayerGroupRef.current && map) {
        map.removeLayer(markerLayerGroupRef.current);
        markerLayerGroupRef.current = null;
      }
    };
  }, [map]);

  // Render Overlays & Markers when enabled or filters change
  useEffect(() => {
    const polygonGroup = polygonLayerGroupRef.current;
    const markerGroup = markerLayerGroupRef.current;
    if (!map || !polygonGroup || !markerGroup) return;

    polygonGroup.clearLayers();
    markerGroup.clearLayers();

    if (!enabled) {
      if (onZoneCountChange) onZoneCountChange(0, 0);
      return;
    }

    const zones = getInaRiskZones(minVulnerability);
    const highestDensity = Math.max(...zones.map(z => z.vulnerableDensityPerKm2), 0);
    if (onZoneCountChange) {
      onZoneCountChange(zones.length, highestDensity);
    }

    zones.forEach((zone) => {
      const colors = getInaRiskDensityColor(zone.vulnerableDensityPerKm2);
      const isExtreme = zone.vulnerabilityLevel === 'EKSTREM';

      // 1. Render Density Geographic Overlay (Polygon if defined, otherwise circular buffer)
      if (zone.boundaryPolygon && zone.boundaryPolygon.length > 2) {
        const poly = L.polygon(zone.boundaryPolygon, {
          color: colors.stroke,
          fillColor: colors.fill,
          fillOpacity: isExtreme ? 0.28 : 0.18,
          weight: isExtreme ? 2.5 : 1.5,
          dashArray: isExtreme ? undefined : '4, 4'
        });
        polygonGroup.addLayer(poly);
      } else {
        const circle = L.circle([zone.centerLat, zone.centerLng], {
          radius: zone.radiusKm * 1000,
          color: colors.stroke,
          fillColor: colors.fill,
          fillOpacity: isExtreme ? 0.24 : 0.15,
          weight: isExtreme ? 2.5 : 1.5,
          dashArray: isExtreme ? undefined : '5, 5'
        });
        polygonGroup.addLayer(circle);
      }

      // 2. Pulse radar circle for ultra-high density zones
      if (isExtreme && zone.vulnerableDensityPerKm2 > 1000) {
        const innerGlow = L.circle([zone.centerLat, zone.centerLng], {
          radius: (zone.radiusKm * 1000) * 0.45,
          color: colors.fill,
          fillColor: colors.fill,
          fillOpacity: 0.35,
          weight: 1
        });
        polygonGroup.addLayer(innerGlow);
      }

      // 3. Custom Marker for Vulnerable Population Density Overlay
      const markerHtml = `
        <div class="relative flex flex-col items-center justify-center cursor-pointer group transition-transform duration-200 hover:scale-110">
          ${isExtreme ? `<span class="absolute -top-1 w-8 h-8 rounded-full animate-ping opacity-60" style="background-color: ${colors.fill}"></span>` : ''}
          <div class="relative flex items-center gap-1 px-2 py-0.5 rounded-full shadow-2xl border-2 font-mono text-[10px] font-black text-white" style="background-color: ${colors.fill}; border-color: ${isExtreme ? '#ffffff' : colors.stroke}">
            <span>🛡️</span>
            <span>${zone.vulnerableDensityPerKm2.toLocaleString('id-ID')}</span>
            <span class="text-[8px] opacity-90">${isEn ? 'vuln/km²' : 'jiwa/km²'}</span>
          </div>
          <div class="mt-0.5 whitespace-nowrap px-1.5 py-0.2 rounded shadow-md text-[9px] font-bold text-slate-200 bg-slate-950/90 border border-slate-700">
            ${isEn ? zone.nameEn.split(' - ')[0] : zone.name.split(' - ')[0]} (${zone.vulnerabilityLevel})
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-inarisk-exposure-marker',
        html: markerHtml,
        iconSize: [110, 42],
        iconAnchor: [55, 21],
        popupAnchor: [0, -22]
      });

      const marker = L.marker([zone.centerLat, zone.centerLng], { icon: customIcon });

      // 4. Detailed Popup for Resource Deployment Prioritization
      const title = isEn ? zone.nameEn : zone.name;
      const rec = zone.recommendations;
      const recTitle = isEn ? rec.urgencyLabelEn : rec.urgencyLabel;
      const tacticalNote = isEn ? rec.tacticalNoteEn : rec.tacticalNote;

      const teamListHtml = rec.recommendedTeams.slice(0, 2).map(t => `
        <div class="flex items-start justify-between gap-1 text-[10px] bg-slate-100 p-1.5 rounded">
          <div>
            <strong class="text-slate-800 block">${isEn ? t.roleEn : t.role}</strong>
            <span class="text-slate-500 leading-tight block">${isEn ? t.purposeEn : t.purpose}</span>
          </div>
          <span class="bg-blue-600 text-white font-mono px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0">
            ${t.count} ${isEn ? 'Teams' : 'Regu'}
          </span>
        </div>
      `).join('');

      const suppliesHtml = rec.essentialSupplies.slice(0, 3).map(s => `
        <div class="flex items-center justify-between text-[10px] border-b border-slate-100 py-0.5">
          <span class="text-slate-700 truncate mr-1">• ${isEn ? s.itemEn : s.item}</span>
          <span class="font-mono font-bold text-slate-900 shrink-0">${s.quantity}</span>
        </div>
      `).join('');

      const popupHtml = `
        <div class="p-3 max-w-[320px] text-slate-900 font-sans leading-snug">
          <!-- Official BNPB InaRISK Banner -->
          <div class="flex items-center justify-between gap-1 border-b border-slate-200 pb-1.5 mb-2">
            <div class="flex items-center gap-1.5">
              <span class="text-base">🇮🇩</span>
              <div>
                <span class="text-[9px] font-black uppercase tracking-wider text-rose-700 block">
                  BNPB InaRISK Official Exposure
                </span>
                <span class="text-[10px] text-slate-500 font-mono">Kode Wilayah: ${zone.regionCode}</span>
              </div>
            </div>
            <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded text-white" style="background-color: ${colors.fill}">
              ${zone.vulnerabilityLevel}
            </span>
          </div>

          <!-- Zone Title & Location -->
          <h4 class="font-bold text-xs text-slate-900 leading-tight mb-1">${title}</h4>
          <span class="text-[10px] text-slate-500 block mb-2 font-medium">📍 ${zone.province} · Radius Ancaman ${zone.radiusKm} km</span>

          <!-- Exposure Metrics Strip -->
          <div class="grid grid-cols-3 gap-1.5 bg-slate-50 border border-slate-200 p-2 rounded-lg mb-2 text-center">
            <div>
              <span class="text-[9px] text-slate-400 block">${isEn ? 'Vuln Density' : 'Kepadatan Rentan'}</span>
              <strong class="text-xs font-black" style="color: ${colors.fill}">
                ${zone.vulnerableDensityPerKm2.toLocaleString('id-ID')}
              </strong>
              <span class="text-[8px] text-slate-500 block">${isEn ? 'people/km²' : 'jiwa/km²'}</span>
            </div>
            <div>
              <span class="text-[9px] text-slate-400 block">${isEn ? 'Vuln People' : 'Warga Rentan'}</span>
              <strong class="text-xs font-black text-slate-800">
                ${zone.vulnerablePopulationTotal.toLocaleString('id-ID')}
              </strong>
              <span class="text-[8px] text-slate-500 block">(${Math.round((zone.vulnerablePopulationTotal / zone.populationTotal) * 100)}%)</span>
            </div>
            <div>
              <span class="text-[9px] text-slate-400 block">${isEn ? 'Capacity Score' : 'Skor Kapasitas'}</span>
              <strong class="text-xs font-black ${zone.capacityScore < 60 ? 'text-rose-600' : 'text-emerald-600'}">
                ${zone.capacityScore}/100
              </strong>
              <span class="text-[8px] text-slate-500 block">${zone.capacityScore < 60 ? (isEn ? 'Low/Urgent' : 'Kapasitas Kurang') : (isEn ? 'Adequate' : 'Cukup')}</span>
            </div>
          </div>

          <!-- Vulnerable Demographic Breakdown -->
          <div class="mb-2.5">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
              ${isEn ? 'Vulnerable Groups Census (BNPB)' : 'Rincian Kelompok Rentan (Sensus BNPB)'}
            </span>
            <div class="grid grid-cols-2 gap-1 text-[10px] text-slate-600">
              <div class="bg-amber-50/80 px-2 py-1 rounded border border-amber-200/60">
                <span>🧓 ${isEn ? 'Elderly (>60)' : 'Lansia (>60 th)'}:</span>
                <strong class="text-amber-900 block font-mono">${zone.demographics.elderlyOver60.toLocaleString('id-ID')} ${isEn ? 'souls' : 'jiwa'}</strong>
              </div>
              <div class="bg-rose-50/80 px-2 py-1 rounded border border-rose-200/60">
                <span>👶 ${isEn ? 'Infants (<5)' : 'Balita (<5 th)'}:</span>
                <strong class="text-rose-900 block font-mono">${zone.demographics.childrenUnder5.toLocaleString('id-ID')} ${isEn ? 'souls' : 'jiwa'}</strong>
              </div>
              <div class="bg-blue-50/80 px-2 py-1 rounded border border-blue-200/60">
                <span>♿ ${isEn ? 'Disabled' : 'Disabilitas'}:</span>
                <strong class="text-blue-900 block font-mono">${zone.demographics.disabledPersons.toLocaleString('id-ID')} ${isEn ? 'souls' : 'jiwa'}</strong>
              </div>
              <div class="bg-purple-50/80 px-2 py-1 rounded border border-purple-200/60">
                <span>🤰 ${isEn ? 'Mothers' : 'Ibu Hamil/Menyusui'}:</span>
                <strong class="text-purple-900 block font-mono">${zone.demographics.pregnantNursingMothers.toLocaleString('id-ID')} ${isEn ? 'souls' : 'jiwa'}</strong>
              </div>
            </div>
          </div>

          <!-- Coordinator Resource Deployment Prioritization -->
          <div class="bg-gradient-to-br from-slate-900 to-slate-950 text-slate-100 p-2.5 rounded-lg mb-2.5 shadow-md">
            <div class="flex items-center justify-between text-[10px] mb-1.5 pb-1 border-b border-slate-800">
              <span class="font-bold text-amber-400 flex items-center gap-1">
                <span>⚡</span> ${isEn ? 'Resource Deployment Priority' : 'Prioritas Penempatan Logistik'}
              </span>
              <span class="text-[9px] bg-red-950 text-red-300 font-bold px-1.5 py-0.2 rounded border border-red-800">
                ${rec.priorityLevel}
              </span>
            </div>

            <div class="text-[10px] text-slate-300 mb-2 leading-relaxed">
              <span class="text-amber-300 font-bold">${recTitle}:</span> ${tacticalNote}
            </div>

            <div class="space-y-1 mb-2 text-slate-900">
              ${teamListHtml}
            </div>

            <div class="bg-slate-800/80 p-1.5 rounded text-slate-200">
              <span class="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">
                ${isEn ? 'Essential Equipment Quota' : 'Kebutuhan Alat Mendesak'}
              </span>
              ${suppliesHtml}
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex items-center gap-1.5">
            <button 
              id="btn-deploy-${zone.id}"
              class="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 px-2 rounded-lg text-[11px] transition shadow-md flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>🚀</span>
              <span>${isEn ? 'Prioritize Resources' : 'Prioritaskan Logistik'}</span>
            </button>
            <button 
              id="btn-focus-${zone.id}"
              class="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-1.5 px-2.5 rounded-lg text-[11px] transition cursor-pointer"
              title="${isEn ? 'Center map on this zone' : 'Pusatkan peta ke zona ini'}"
            >
              🎯
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        maxWidth: 330,
        autoPan: true,
        autoPanPaddingTopLeft: L.point(20, 90),
        autoPanPaddingBottomRight: L.point(20, 90)
      });

      marker.on('click', () => {
        if (onSelectZone) onSelectZone(zone);
      });

      marker.on('popupopen', () => {
        const deployBtn = document.getElementById(`btn-deploy-${zone.id}`);
        if (deployBtn) {
          deployBtn.onclick = () => {
            if (onDeployResourcesToZone) {
              onDeployResourcesToZone(zone);
            }
          };
        }

        const focusBtn = document.getElementById(`btn-focus-${zone.id}`);
        if (focusBtn && map) {
          focusBtn.onclick = () => {
            map.flyTo([zone.centerLat, zone.centerLng], 13, { duration: 1.2 });
          };
        }
      });

      markerGroup.addLayer(marker);
    });
  }, [map, enabled, minVulnerability, isEn, onSelectZone, onZoneCountChange, onDeployResourcesToZone]);

  return null;
};
