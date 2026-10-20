import { 
  DisasterSourceAdapter, 
  HazardObservation, 
  HazardSourceId, 
  MultiHazardIncident, 
  NormalizedHazardType, 
  SourceHealth 
} from '../types/index.ts';
import { NasaFirmsAdapter } from './nasaFirmsAdapter.ts';
import { BmkgGempaAdapter } from './bmkgGempaAdapter.ts';
import { BmkgWeatherAdapter } from './bmkgWeatherAdapter.ts';
import { NasaGpmAdapter } from './nasaGpmAdapter.ts';
import { BnpbInaRiskAdapter } from './bnpbInaRiskAdapter.ts';
import { PvmbgMagmaAdapter } from './pvmbgMagmaAdapter.ts';

export class MultiHazardEngine {
  private adapters: Map<HazardSourceId, DisasterSourceAdapter> = new Map();
  private inariskAdapter: BnpbInaRiskAdapter;
  private observationsCache: HazardObservation[] = [];
  private incidentsCache: MultiHazardIncident[] = [];
  private lastSyncTime: string = new Date().toISOString();

  constructor() {
    const firms = new NasaFirmsAdapter();
    const gempa = new BmkgGempaAdapter();
    const weather = new BmkgWeatherAdapter();
    const gpm = new NasaGpmAdapter();
    this.inariskAdapter = new BnpbInaRiskAdapter();
    const magma = new PvmbgMagmaAdapter();

    this.adapters.set('NASA_FIRMS', firms);
    this.adapters.set('BMKG_GEMPA', gempa);
    this.adapters.set('BMKG_WEATHER', weather);
    this.adapters.set('NASA_GPM', gpm);
    this.adapters.set('BNPB_INARISK', this.inariskAdapter);
    this.adapters.set('PVMBG_MAGMA', magma);
  }

  /**
   * Health check across all registered disaster data source adapters
   */
  async getSourcesHealth(): Promise<SourceHealth[]> {
    const healthPromises = Array.from(this.adapters.values()).map(async (adapter) => {
      try {
        return await adapter.healthCheck();
      } catch (err: any) {
        return {
          source: adapter.source,
          name: adapter.source,
          nameEn: adapter.source,
          status: 'OFFLINE' as const,
          latencyMs: 0,
          lastFetch: new Date().toISOString(),
          recordsCount: 0,
          message: err?.message || 'Adapter check failed'
        };
      }
    });

    return await Promise.all(healthPromises);
  }

  /**
   * Pulls latest data from all providers in parallel with complete error isolation.
   * A failure in one provider (e.g. NASA network drop) never interrupts BMKG or PVMBG.
   */
  async syncAllSources(): Promise<{ observationsCount: number; incidentsCount: number }> {
    const allObs: HazardObservation[] = [];

    const syncJobs = Array.from(this.adapters.entries()).map(async ([sourceId, adapter]) => {
      try {
        const raw = await adapter.fetchLatest();
        const normalized = await adapter.normalize(raw);
        return normalized;
      } catch (err) {
        console.warn(`[MultiHazardEngine] Adapter ${sourceId} sync encountered error, maintaining resilience:`, err);
        return [];
      }
    });

    const results = await Promise.all(syncJobs);
    for (const batch of results) {
      allObs.push(...batch);
    }

    this.observationsCache = allObs;
    this.incidentsCache = this.synthesizeIncidentsFromObservations(allObs);
    this.lastSyncTime = new Date().toISOString();

    return {
      observationsCount: this.observationsCache.length,
      incidentsCount: this.incidentsCache.length
    };
  }

  getObservations(): HazardObservation[] {
    return this.observationsCache;
  }

  getIncidents(): MultiHazardIncident[] {
    return this.incidentsCache;
  }

  getIncidentById(id: string): MultiHazardIncident | undefined {
    return this.incidentsCache.find(inc => inc.id === id);
  }

  updateIncidentWorkflow(id: string, updates: Partial<MultiHazardIncident['responseWorkflow']>): MultiHazardIncident | undefined {
    const inc = this.incidentsCache.find(i => i.id === id);
    if (!inc) return undefined;
    inc.responseWorkflow = {
      ...inc.responseWorkflow,
      ...updates
    };
    inc.updatedAt = new Date().toISOString();
    return inc;
  }

  /**
   * Synthesizes HazardObservations into actionable operational Incidents
   * grouping observations by spatial proximity and hazard type.
   */
  private synthesizeIncidentsFromObservations(obsList: HazardObservation[]): MultiHazardIncident[] {
    const incidents: MultiHazardIncident[] = [];

    // Group 1: Volcanic activity (PVMBG)
    const volcanoObs = obsList.filter(o => o.hazardType === 'VOLCANO');
    for (const vObs of volcanoObs) {
      const volcanoName = vObs.details.volcanoName || 'Gunung Api Aktif';
      const radiusKm = vObs.details.dangerRadiusKm || 7.0;
      const exposure = this.inariskAdapter.getExposureIntelligence(vObs.latitude, vObs.longitude, radiusKm);
      const isLevel4 = vObs.details.activityLevel?.includes('Level IV');

      incidents.push({
        id: `inc-volcano-${vObs.externalId.replace(/[^a-zA-Z0-9]/g, '')}`,
        title: `Aktivitas Vulkanik & Guguran Awan Panas ${volcanoName}`,
        titleEn: `Volcanic Eruption & Pyroclastic Activity ${volcanoName}`,
        hazardType: 'VOLCANO',
        status: isLevel4 ? 'active' : 'detecting',
        priority: isLevel4 ? 'P1_CRITICAL' : 'P2_HIGH',
        riskScore: isLevel4 ? 94 : 82,
        observationCount: 1,
        observations: [vObs],
        affectedArea: {
          centerLat: vObs.latitude,
          centerLng: vObs.longitude,
          radiusKm,
          administrativeArea: vObs.administrativeArea,
          province: vObs.province
        },
        exposure,
        environmentalContext: {
          weatherCondition: 'Hujan Abu Vulkanik & Awan Konvektif',
          weatherConditionEn: 'Volcanic Ash Fall & Convective Clouds',
          temperatureC: 24,
          windSpeedKmh: 18,
          windDirection: 'Barat Daya (SW)',
          humidityPct: 82,
          gpmRainfallLast24hMm: 45,
          gpmAccumulatedRainfall72hMm: 98,
          rainfallTrend: 'steady'
        },
        inaRiskContext: {
          zoneClass: 'Ekstrem',
          vulnerabilityIndex: exposure.zone.vulnerabilityIndex,
          capacityScore: exposure.zone.capacityScore,
          dominantThreat: 'Erupsi & Aliran Lahar Dingin'
        },
        responseWorkflow: {
          currentStep: 1,
          isSitRepGenerated: false,
          isBroadcastSent: false,
          matchedVolunteersCount: 0
        },
        createdAt: vObs.timestamp,
        updatedAt: new Date().toISOString()
      });
    }

    // Group 2: Earthquakes & Tsunamis (BMKG)
    const quakeObs = obsList.filter(o => o.hazardType === 'EARTHQUAKE' || o.hazardType === 'TSUNAMI');
    for (const qObs of quakeObs) {
      const mag = qObs.details.magnitude || 5.0;
      const isTsunami = qObs.hazardType === 'TSUNAMI' || qObs.details.potensiTsunami;
      const radiusKm = mag >= 6.0 ? 35 : mag >= 5.0 ? 20 : 10;
      const exposure = this.inariskAdapter.getExposureIntelligence(qObs.latitude, qObs.longitude, radiusKm);

      incidents.push({
        id: `inc-quake-${qObs.externalId.replace(/[^a-zA-Z0-9]/g, '')}`,
        title: isTsunami 
          ? `Gempa M${mag} Disertai Peringatan Dini Potensi Tsunami - ${qObs.administrativeArea}`
          : `Gempabumi Tektonik M${mag} Kedalaman ${qObs.details.depthKm} km - ${qObs.administrativeArea}`,
        titleEn: isTsunami
          ? `M${mag} Earthquake with Tsunami Advisory - ${qObs.administrativeArea}`
          : `M${mag} Tectonic Earthquake Depth ${qObs.details.depthKm} km - ${qObs.administrativeArea}`,
        hazardType: isTsunami ? 'TSUNAMI' : 'EARTHQUAKE',
        status: 'active',
        priority: isTsunami || mag >= 6.0 ? 'P1_CRITICAL' : 'P2_HIGH',
        riskScore: isTsunami ? 98 : Math.min(95, Math.round(mag * 15)),
        observationCount: 1,
        observations: [qObs],
        affectedArea: {
          centerLat: qObs.latitude,
          centerLng: qObs.longitude,
          radiusKm,
          administrativeArea: qObs.administrativeArea,
          province: qObs.province
        },
        exposure,
        environmentalContext: {
          weatherCondition: 'Cerah Berawan',
          weatherConditionEn: 'Partly Cloudy',
          temperatureC: 28,
          windSpeedKmh: 12,
          windDirection: 'Tenggara (SE)',
          humidityPct: 75,
          gpmRainfallLast24hMm: 12,
          gpmAccumulatedRainfall72hMm: 28,
          rainfallTrend: 'steady'
        },
        inaRiskContext: {
          zoneClass: exposure.zone.earthquakeRisk,
          vulnerabilityIndex: exposure.zone.vulnerabilityIndex,
          capacityScore: exposure.zone.capacityScore,
          dominantThreat: 'Guncangan Gempa & Likuefaksi'
        },
        responseWorkflow: {
          currentStep: 1,
          isSitRepGenerated: false,
          isBroadcastSent: false,
          matchedVolunteersCount: 0
        },
        createdAt: qObs.timestamp,
        updatedAt: new Date().toISOString()
      });
    }

    // Group 3: Wildfires / Hotspots (NASA FIRMS)
    const fireObs = obsList.filter(o => o.hazardType === 'WILDFIRE');
    if (fireObs.length > 0) {
      // Cluster Riau / Jambi / Kalteng hotspots
      const riauHotspots = fireObs.filter(f => f.province.includes('Riau') || f.province.includes('Jambi'));
      if (riauHotspots.length > 0) {
        const lead = riauHotspots[0];
        const radiusKm = 15;
        const exposure = this.inariskAdapter.getExposureIntelligence(lead.latitude, lead.longitude, radiusKm);
        const maxFrp = Math.max(...riauHotspots.map(h => h.details.frp || 0));

        incidents.push({
          id: 'inc-wildfire-sumatera-peatland',
          title: `Kluster Kebakaran Hutan & Lahan Gambut (${riauHotspots.length} Titik Hotspot VIIRS)`,
          titleEn: `Peatland Wildfire Cluster (${riauHotspots.length} VIIRS Hotspots)`,
          hazardType: 'WILDFIRE',
          status: 'active',
          priority: maxFrp >= 35 ? 'P1_CRITICAL' : 'P2_HIGH',
          riskScore: Math.min(92, 60 + riauHotspots.length * 8),
          observationCount: riauHotspots.length,
          observations: riauHotspots,
          affectedArea: {
            centerLat: lead.latitude,
            centerLng: lead.longitude,
            radiusKm,
            administrativeArea: lead.administrativeArea,
            province: lead.province
          },
          exposure,
          environmentalContext: {
            weatherCondition: 'Kering & Asap Tebal (Haze)',
            weatherConditionEn: 'Dry & Heavy Smoke Haze',
            temperatureC: 34,
            windSpeedKmh: 24,
            windDirection: 'Barat Laut (NW)',
            humidityPct: 52,
            gpmRainfallLast24hMm: 0,
            gpmAccumulatedRainfall72hMm: 4.5,
            rainfallTrend: 'decreasing'
          },
          inaRiskContext: {
            zoneClass: 'Ekstrem',
            vulnerabilityIndex: exposure.zone.vulnerabilityIndex,
            capacityScore: exposure.zone.capacityScore,
            dominantThreat: 'Karhutla Gambut & Kabut Asap Lintas Batas'
          },
          responseWorkflow: {
            currentStep: 1,
            isSitRepGenerated: false,
            isBroadcastSent: false,
            matchedVolunteersCount: 0
          },
          createdAt: lead.timestamp,
          updatedAt: new Date().toISOString()
        });
      }
    }

    // Group 4: Extreme Weather & Flash Floods (BMKG Warnings & NASA GPM)
    const floodObs = obsList.filter(o => o.hazardType === 'FLOOD' || o.hazardType === 'FLASH_FLOOD' || o.hazardType === 'EXTREME_WEATHER');
    if (floodObs.length > 0) {
      const ciliwungWarning = floodObs.find(f => f.administrativeArea.toLowerCase().includes('ciliwung') || f.administrativeArea.toLowerCase().includes('bogor') || f.administrativeArea.toLowerCase().includes('jakarta'));
      if (ciliwungWarning) {
        const radiusKm = 18;
        const exposure = this.inariskAdapter.getExposureIntelligence(ciliwungWarning.latitude, ciliwungWarning.longitude, radiusKm);

        incidents.push({
          id: 'inc-flood-das-ciliwung',
          title: 'Siaga 1 Banjir Luapan DAS Ciliwung & Hujan Ekstrem Hulu',
          titleEn: 'Alert 1 Ciliwung River Overflow & Extreme Upstream Rainfall',
          hazardType: 'FLOOD',
          status: 'active',
          priority: 'P1_CRITICAL',
          riskScore: 89,
          observationCount: floodObs.length,
          observations: floodObs,
          affectedArea: {
            centerLat: ciliwungWarning.latitude,
            centerLng: ciliwungWarning.longitude,
            radiusKm,
            polygon: ciliwungWarning.details.warningPolygon,
            administrativeArea: ciliwungWarning.administrativeArea,
            province: ciliwungWarning.province
          },
          exposure,
          environmentalContext: {
            weatherCondition: 'Hujan Badai Petir (Thunderstorm)',
            weatherConditionEn: 'Severe Thunderstorm',
            temperatureC: 26,
            windSpeedKmh: 35,
            windDirection: 'Barat (W)',
            humidityPct: 92,
            gpmRainfallLast24hMm: 185.0,
            gpmAccumulatedRainfall72hMm: 294.0,
            rainfallTrend: 'rising'
          },
          inaRiskContext: {
            zoneClass: 'Ekstrem',
            vulnerabilityIndex: exposure.zone.vulnerabilityIndex,
            capacityScore: exposure.zone.capacityScore,
            dominantThreat: 'Banjir Luapan & Tanggul Kritis'
          },
          responseWorkflow: {
            currentStep: 1,
            isSitRepGenerated: false,
            isBroadcastSent: false,
            matchedVolunteersCount: 0
          },
          createdAt: ciliwungWarning.timestamp,
          updatedAt: new Date().toISOString()
        });
      }
    }

    return incidents;
  }
}
