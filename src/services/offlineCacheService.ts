import { Disaster, Volunteer, Task, Assignment } from '../types/index.ts';

const CRITICAL_DATA_KEY = 'sigap_offline_critical_data_v1';
const OFFLINE_QUEUE_KEY = 'sigap_offline_sync_queue_v1';

export interface OfflineCacheStats {
  osmTilesCount: number;
  satelliteTilesCount: number;
  cartoTilesCount: number;
  apiResponsesCount: number;
  totalTilesCount: number;
  storageUsedMB: number;
  storageQuotaMB: number;
  lastUpdated: string;
  hasCachedData: boolean;
}

export interface CachedCriticalData {
  disasters: Disaster[];
  volunteers: Volunteer[];
  tasks: Task[];
  assignments: Assignment[];
  cachedAt: string;
}

export interface OfflineAction {
  id: string;
  action: 'UPDATE_VOLUNTEER_STATUS' | 'UPDATE_TASK_STATUS' | 'CREATE_TASK' | 'CREATE_DISASTER';
  payload: any;
  timestamp: string;
}

/**
 * Convert Latitude, Longitude, and Zoom to Slippy Map Tile coordinates (x, y)
 */
export function latLngToTile(lat: number, lng: number, zoom: number): { x: number; y: number } {
  const n = Math.pow(2, zoom);
  const rad = (lat * Math.PI) / 180;
  const x = Math.floor(((lng + 180) / 360) * n);
  const y = Math.floor(((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * n);
  return { x: Math.max(0, Math.min(x, n - 1)), y: Math.max(0, Math.min(y, n - 1)) };
}

/**
 * Generate tile URL lists for a bounding box around a disaster epicenter
 */
export function generateDisasterTileUrls(
  lat: number,
  lng: number,
  tileLayerType: 'osm' | 'satellite' = 'osm',
  zoomLevels: number[] = [12, 13, 14]
): string[] {
  const urls: string[] = [];
  const subdomains = ['a', 'b', 'c'];

  for (const zoom of zoomLevels) {
    const centerTile = latLngToTile(lat, lng, zoom);
    // 3x3 grid around epicenter
    const radius = zoom >= 14 ? 2 : 1;

    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        const x = centerTile.x + dx;
        const y = centerTile.y + dy;
        const n = Math.pow(2, zoom);
        if (x >= 0 && x < n && y >= 0 && y < n) {
          const s = subdomains[(x + y) % subdomains.length];
          if (tileLayerType === 'osm') {
            urls.push(`https://${s}.tile.openstreetmap.org/${zoom}/${x}/${y}.png`);
          } else {
            urls.push(`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${y}/${x}`);
          }
        }
      }
    }
  }

  return urls;
}

/**
 * Pre-cache tiles for a disaster zone directly into browser CacheStorage
 */
export async function precacheDisasterMapTiles(
  lat: number,
  lng: number,
  disasterName: string,
  onProgress?: (progress: { loaded: number; total: number; percent: number; currentUrl: string }) => void
): Promise<{ success: boolean; cachedCount: number }> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    console.warn('CacheStorage is not supported in this browser');
    return { success: false, cachedCount: 0 };
  }

  const urls = generateDisasterTileUrls(lat, lng, 'osm', [12, 13, 14, 15]);
  const cacheName = 'osm-map-tiles-cache';
  const cache = await caches.open(cacheName);
  let loaded = 0;
  const total = urls.length;

  for (const url of urls) {
    try {
      // Check if already in cache
      const match = await cache.match(url);
      if (!match) {
        // Fetch with no-cors or standard GET
        const response = await fetch(url, { mode: 'no-cors', cache: 'reload' });
        if (response) {
          await cache.put(url, response);
        }
      }
      loaded++;
      if (onProgress) {
        onProgress({
          loaded,
          total,
          percent: Math.round((loaded / total) * 100),
          currentUrl: url,
        });
      }
    } catch (err) {
      console.warn(`Tile precache fetch failed for ${url}:`, err);
    }
  }

  console.log(`Pre-cached ${loaded} map tiles for ${disasterName}`);
  return { success: true, cachedCount: loaded };
}

/**
 * Inspect CacheStorage to retrieve detailed metrics
 */
export async function getOfflineCacheStats(): Promise<OfflineCacheStats> {
  const stats: OfflineCacheStats = {
    osmTilesCount: 0,
    satelliteTilesCount: 0,
    cartoTilesCount: 0,
    apiResponsesCount: 0,
    totalTilesCount: 0,
    storageUsedMB: 0,
    storageQuotaMB: 0,
    lastUpdated: new Date().toLocaleTimeString(),
    hasCachedData: false,
  };

  if (typeof window === 'undefined' || !('caches' in window)) {
    return stats;
  }

  try {
    const keys = await caches.keys();
    for (const key of keys) {
      const cache = await caches.open(key);
      const requests = await cache.keys();
      const count = requests.length;

      if (key.includes('osm-map-tiles')) {
        stats.osmTilesCount += count;
      } else if (key.includes('arcgis-satellite') || key.includes('satellite')) {
        stats.satelliteTilesCount += count;
      } else if (key.includes('carto')) {
        stats.cartoTilesCount += count;
      } else if (key.includes('api-critical-data') || key.includes('api')) {
        stats.apiResponsesCount += count;
      } else if (key.includes('tiles') || key.includes('tile')) {
        stats.totalTilesCount += count;
      }
    }

    stats.totalTilesCount = stats.osmTilesCount + stats.satelliteTilesCount + stats.cartoTilesCount;

    // Estimate storage usage
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      if (estimate.usage) {
        stats.storageUsedMB = Math.round((estimate.usage / (1024 * 1024)) * 10) / 10;
      }
      if (estimate.quota) {
        stats.storageQuotaMB = Math.round((estimate.quota / (1024 * 1024)) * 10) / 10;
      }
    }

    const localData = localStorage.getItem(CRITICAL_DATA_KEY);
    stats.hasCachedData = !!localData;
  } catch (err) {
    console.error('Failed to get cache stats:', err);
  }

  return stats;
}

/**
 * Save critical data snapshot to localStorage for zero-connectivity situations
 */
export function saveCriticalDataToOfflineStorage(data: {
  disasters: Disaster[];
  volunteers: Volunteer[];
  tasks: Task[];
  assignments: Assignment[];
}): void {
  try {
    const payload: CachedCriticalData = {
      ...data,
      cachedAt: new Date().toISOString(),
    };
    localStorage.setItem(CRITICAL_DATA_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error('Failed to save critical data to localStorage:', err);
  }
}

/**
 * Retrieve critical data snapshot from localStorage
 */
export function getCriticalDataFromOfflineStorage(): CachedCriticalData | null {
  try {
    const raw = localStorage.getItem(CRITICAL_DATA_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CachedCriticalData;
  } catch (err) {
    console.error('Failed to parse offline critical data:', err);
    return null;
  }
}

/**
 * Queue an offline action to sync when connectivity resumes
 */
export function queueOfflineAction(action: Omit<OfflineAction, 'id' | 'timestamp'>): void {
  try {
    const existing = getOfflineQueue();
    const newAction: OfflineAction = {
      ...action,
      id: `offline-act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
    };
    existing.push(newAction);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(existing));
  } catch (err) {
    console.error('Failed to queue offline action:', err);
  }
}

export function getOfflineQueue(): OfflineAction[] {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearOfflineQueue(): void {
  localStorage.removeItem(OFFLINE_QUEUE_KEY);
}

/**
 * Clear all map tiles from CacheStorage
 */
export async function clearMapTilesCache(): Promise<boolean> {
  if (typeof window === 'undefined' || !('caches' in window)) return false;
  try {
    const keys = await caches.keys();
    for (const key of keys) {
      if (key.includes('tiles') || key.includes('tile')) {
        await caches.delete(key);
      }
    }
    return true;
  } catch (err) {
    console.error('Failed to clear tile caches:', err);
    return false;
  }
}
