import { 
  db, 
  collection, 
  doc, 
  setDoc, 
  onSnapshot 
} from '../lib/firebase.ts';
import { EarlyWarningAlert, CitizenSafetyReport } from '../types/index.ts';
import { INITIAL_EARLY_WARNINGS, INITIAL_CITIZEN_REPORTS } from '../data/earlyWarningSeedData.ts';

const LOCAL_STORAGE_REPORTS_KEY = 'sigap_citizen_safety_reports';

export function calculateDistanceKm(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export type ProximityZone = 'red_danger' | 'orange_warning' | 'yellow_advisory' | 'green_safe';

export interface CitizenProximityStatus {
  zone: ProximityZone;
  zoneTitle: string;
  distanceKm: number;
  nearestAlert: EarlyWarningAlert | null;
  evacuationRecommended: boolean;
}

export function evaluateCitizenProximity(
  userLat: number, 
  userLng: number, 
  alerts: EarlyWarningAlert[]
): CitizenProximityStatus {
  if (alerts.length === 0) {
    return {
      zone: 'green_safe',
      zoneTitle: 'Zona Aman',
      distanceKm: 999,
      nearestAlert: null,
      evacuationRecommended: false
    };
  }

  let nearestDist = Infinity;
  let nearestAlert: EarlyWarningAlert | null = null;

  for (const alert of alerts) {
    const dist = calculateDistanceKm(userLat, userLng, alert.locationLat, alert.locationLng);
    if (dist < nearestDist) {
      nearestDist = dist;
      nearestAlert = alert;
    }
  }

  if (!nearestAlert) {
    return {
      zone: 'green_safe',
      zoneTitle: 'Zona Aman',
      distanceKm: 999,
      nearestAlert: null,
      evacuationRecommended: false
    };
  }

  const dangerRadius = nearestAlert.dangerRadiusKm;

  if (nearestDist <= dangerRadius * 0.5) {
    return {
      zone: 'red_danger',
      zoneTitle: 'Zona Bahaya Langsung (AWAS)',
      distanceKm: nearestDist,
      nearestAlert,
      evacuationRecommended: true
    };
  } else if (nearestDist <= dangerRadius) {
    return {
      zone: 'orange_warning',
      zoneTitle: 'Zona Siaga Evakuasi (SIAGA)',
      distanceKm: nearestDist,
      nearestAlert,
      evacuationRecommended: true
    };
  } else if (nearestDist <= dangerRadius * 1.8) {
    return {
      zone: 'yellow_advisory',
      zoneTitle: 'Zona Pantau & Waspada (WASPADA)',
      distanceKm: nearestDist,
      nearestAlert,
      evacuationRecommended: false
    };
  }

  return {
    zone: 'green_safe',
    zoneTitle: 'Zona Aman Terkendali',
    distanceKm: nearestDist,
    nearestAlert,
    evacuationRecommended: false
  };
}

class EarlyWarningService {
  private alerts: EarlyWarningAlert[] = [...INITIAL_EARLY_WARNINGS];
  private citizenReports: CitizenSafetyReport[] = [];
  private reportListeners: Array<(reports: CitizenSafetyReport[]) => void> = [];

  constructor() {
    this.initCitizenReports();
    this.initFirestoreListener();
  }

  private initCitizenReports() {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
      if (cached) {
        this.citizenReports = JSON.parse(cached);
      } else {
        this.citizenReports = [...INITIAL_CITIZEN_REPORTS];
        localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(this.citizenReports));
      }
    } catch {
      this.citizenReports = [...INITIAL_CITIZEN_REPORTS];
    }
  }

  private initFirestoreListener() {
    try {
      const colRef = collection(db, 'citizen_safety');
      onSnapshot(
        colRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteReports: CitizenSafetyReport[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              remoteReports.push({
                id: docSnap.id,
                disasterId: data.disasterId,
                disasterTitle: data.disasterTitle,
                citizenName: data.citizenName || 'Warga',
                phone: data.phone || '',
                familyCount: Number(data.familyCount) || 1,
                status: data.status || 'safe',
                locationAddress: data.locationAddress || '',
                latitude: data.latitude,
                longitude: data.longitude,
                urgentNeeds: data.urgentNeeds || '',
                reportedAt: data.reportedAt || new Date().toISOString()
              });
            });

            const mergedMap = new Map<string, CitizenSafetyReport>();
            INITIAL_CITIZEN_REPORTS.forEach(r => mergedMap.set(r.id, r));
            remoteReports.forEach(r => mergedMap.set(r.id, r));

            this.citizenReports = Array.from(mergedMap.values()).sort((a, b) => 
              new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
            );

            localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(this.citizenReports));
            this.notifyReportListeners();
          }
        },
        (error) => {
          console.warn('Firestore citizen safety sync note:', error.message);
        }
      );
    } catch (err) {
      console.warn('Failed to attach Firestore citizen safety listener:', err);
    }
  }

  public getAlerts(): EarlyWarningAlert[] {
    return [...this.alerts];
  }

  public getCitizenReports(): CitizenSafetyReport[] {
    return [...this.citizenReports];
  }

  public subscribeReports(callback: (reports: CitizenSafetyReport[]) => void): () => void {
    this.reportListeners.push(callback);
    callback([...this.citizenReports]);
    return () => {
      this.reportListeners = this.reportListeners.filter(cb => cb !== callback);
    };
  }

  private notifyReportListeners() {
    const list = [...this.citizenReports];
    this.reportListeners.forEach(cb => cb(list));
  }

  public async submitCitizenSafetyReport(payload: {
    disasterId?: string;
    disasterTitle?: string;
    citizenName: string;
    phone: string;
    familyCount: number;
    status: 'safe' | 'needs_evacuation' | 'emergency_trapped';
    locationAddress: string;
    latitude?: number;
    longitude?: number;
    urgentNeeds?: string;
  }): Promise<CitizenSafetyReport> {
    const reportId = `cs-${Date.now()}`;
    const newReport: CitizenSafetyReport = {
      id: reportId,
      disasterId: payload.disasterId,
      disasterTitle: payload.disasterTitle,
      citizenName: payload.citizenName.trim() || 'Warga Masyarakat',
      phone: payload.phone,
      familyCount: payload.familyCount || 1,
      status: payload.status,
      locationAddress: payload.locationAddress,
      latitude: payload.latitude,
      longitude: payload.longitude,
      urgentNeeds: payload.urgentNeeds,
      reportedAt: new Date().toISOString()
    };

    this.citizenReports = [newReport, ...this.citizenReports];
    localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(this.citizenReports));
    this.notifyReportListeners();

    try {
      const docRef = doc(db, 'citizen_safety', reportId);
      await setDoc(docRef, {
        id: reportId,
        disasterId: newReport.disasterId || null,
        disasterTitle: newReport.disasterTitle || null,
        citizenName: newReport.citizenName,
        phone: newReport.phone,
        familyCount: newReport.familyCount,
        status: newReport.status,
        locationAddress: newReport.locationAddress,
        latitude: newReport.latitude || null,
        longitude: newReport.longitude || null,
        urgentNeeds: newReport.urgentNeeds || '',
        reportedAt: newReport.reportedAt
      });
    } catch (err) {
      console.warn('Firestore citizen safety write fallback (saved locally):', err);
    }

    return newReport;
  }
}

export const earlyWarningService = new EarlyWarningService();
