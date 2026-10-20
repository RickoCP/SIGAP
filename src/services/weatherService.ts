// Weather Service: Real-time Weather Forecast & Radar API Integration for Disaster Operations
// Powered by Open-Meteo (WMO standard global forecast) and RainViewer (precipitation radar overlay)
import { Disaster } from '../types/index.ts';

export interface HourlyWeatherPoint {
  time: string; // ISO or formatted 'HH:mm'
  hourLabel: string;
  temp: number; // °C
  precipitationMm: number; // mm
  precipitationProbability: number; // %
  weatherCode: number;
  condition: string;
  windSpeed: number; // km/h
}

export type WeatherHazardLevel = 'normal' | 'advisory' | 'warning' | 'critical';

export interface RealTimeWeatherData {
  locationId?: string;
  locationName: string;
  latitude: number;
  longitude: number;
  temperature: number; // °C
  apparentTemperature: number; // °C (feels like)
  relativeHumidity: number; // %
  precipitation: number; // mm/h current
  rain: number; // mm
  weatherCode: number;
  condition: string;
  icon: string;
  windSpeed: number; // km/h
  windGusts: number; // km/h
  isExtreme: boolean;
  hazardLevel: WeatherHazardLevel;
  hazardTitle: string;
  hazardDescription: string;
  sarRecommendation: string;
  droneFlightStatus: 'safe' | 'caution' | 'prohibited';
  waterRescueRisk: 'low' | 'moderate' | 'high' | 'extreme';
  landslideRisk: 'low' | 'moderate' | 'high' | 'extreme';
  hourlyForecast: HourlyWeatherPoint[];
  dailyMaxRain: number; // mm total
  fetchedAt: string;
  source: 'open-meteo-live' | 'cached' | 'fallback';
}

export interface RainViewerRadarFrame {
  time: number;
  path: string;
  tileUrl: string;
}

export interface RadarLayerData {
  host: string;
  latestFrame: RainViewerRadarFrame | null;
  frames: RainViewerRadarFrame[];
}

// In-memory cache for weather data by coordinate key
const weatherCache = new Map<string, { data: RealTimeWeatherData; expiresAt: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// Translate WMO code to description and condition
export function interpretWmoCode(code: number, language: 'id' | 'en' = 'en'): { condition: string; icon: string; isSevere: boolean } {
  switch (code) {
    case 0:
      return { condition: language === 'id' ? 'Cerah Tanpa Awan' : 'Clear Sky', icon: '☀️', isSevere: false };
    case 1:
      return { condition: language === 'id' ? 'Sebagian Besar Cerah' : 'Mainly Clear', icon: '🌤️', isSevere: false };
    case 2:
      return { condition: language === 'id' ? 'Berawan Sebagian' : 'Partly Cloudy', icon: '⛅', isSevere: false };
    case 3:
      return { condition: language === 'id' ? 'Berawan Tebal' : 'Overcast', icon: '☁️', isSevere: false };
    case 45:
    case 48:
      return { condition: language === 'id' ? 'Berkabut Tebal' : 'Dense Fog', icon: '🌫️', isSevere: false };
    case 51:
    case 53:
    case 55:
      return { condition: language === 'id' ? 'Gerimis Ringan' : 'Drizzle', icon: '🌦️', isSevere: false };
    case 61:
      return { condition: language === 'id' ? 'Hujan Ringan' : 'Slight Rain', icon: '🌧️', isSevere: false };
    case 63:
      return { condition: language === 'id' ? 'Hujan Intensitas Sedang' : 'Moderate Rain', icon: '🌧️', isSevere: false };
    case 65:
      return { condition: language === 'id' ? 'Hujan Sangat Lebat' : 'Heavy Rain', icon: '🌧️', isSevere: true };
    case 80:
      return { condition: language === 'id' ? 'Hujan Rintik-Rintik Cepat' : 'Light Showers', icon: '🌦️', isSevere: false };
    case 81:
      return { condition: language === 'id' ? 'Hujan Lebat Sesaat' : 'Moderate Showers', icon: '🌧️', isSevere: true };
    case 82:
      return { condition: language === 'id' ? 'Hujan Ekstrem Mengguyur' : 'Violent Rain Showers', icon: '⛈️', isSevere: true };
    case 95:
      return { condition: language === 'id' ? 'Badai Petir & Kilat' : 'Thunderstorm', icon: '⛈️', isSevere: true };
    case 96:
    case 99:
      return { condition: language === 'id' ? 'Badai Petir Ekstrem & Angin Kencang' : 'Heavy Thunderstorm with Gusts', icon: '🌩️', isSevere: true };
    default:
      return { condition: language === 'id' ? 'Berawan Lembap' : 'Cloudy', icon: '☁️', isSevere: false };
  }
}

// Compute disaster-specific tactical hazard recommendations
function evaluateTacticalHazards(
  currentPrecip: number,
  maxHourlyPrecip: number,
  windSpeed: number,
  windGusts: number,
  weatherCode: number,
  disasterType?: string,
  language: 'id' | 'en' = 'en'
): {
  hazardLevel: WeatherHazardLevel;
  hazardTitle: string;
  hazardDescription: string;
  sarRecommendation: string;
  droneFlightStatus: 'safe' | 'caution' | 'prohibited';
  waterRescueRisk: 'low' | 'moderate' | 'high' | 'extreme';
  landslideRisk: 'low' | 'moderate' | 'high' | 'extreme';
} {
  const isStorm = weatherCode >= 95 || weatherCode === 82 || weatherCode === 65;
  const isHighRain = currentPrecip >= 15 || maxHourlyPrecip >= 20;
  const isViolentWind = windSpeed >= 40 || windGusts >= 55;

  let droneStatus: 'safe' | 'caution' | 'prohibited' = 'safe';
  if (windSpeed >= 35 || windGusts >= 45 || isStorm || currentPrecip >= 10) {
    droneStatus = 'prohibited';
  } else if (windSpeed >= 20 || currentPrecip > 2) {
    droneStatus = 'caution';
  }

  let waterRisk: 'low' | 'moderate' | 'high' | 'extreme' = 'low';
  let slideRisk: 'low' | 'moderate' | 'high' | 'extreme' = 'low';

  if (disasterType === 'flood' || isHighRain) {
    if (currentPrecip > 25 || isStorm) waterRisk = 'extreme';
    else if (currentPrecip > 10 || maxHourlyPrecip > 15) waterRisk = 'high';
    else if (currentPrecip > 2) waterRisk = 'moderate';
  }

  if (disasterType === 'earthquake' || disasterType === 'flood') {
    if (currentPrecip > 25 || isStorm) slideRisk = 'extreme';
    else if (currentPrecip > 10) slideRisk = 'high';
    else if (currentPrecip > 3) slideRisk = 'moderate';
  }

  // Determine Overall Hazard Level
  if (isStorm || currentPrecip >= 30 || isViolentWind) {
    return {
      hazardLevel: 'critical',
      hazardTitle: language === 'id' ? 'SIAGA: Cuaca Ekstrem Mengancam Operasi' : 'CRITICAL: Extreme Weather Threat',
      hazardDescription: language === 'id'
        ? `Terdeteksi intensitas hujan lebat/badai petir (${currentPrecip.toFixed(1)} mm/jam) dan hembusan angin hingga ${Math.round(windGusts)} km/jam di zona darurat.`
        : `Severe rainstorms detected (${currentPrecip.toFixed(1)} mm/h) with wind gusts up to ${Math.round(windGusts)} km/h in the disaster sector.`,
      sarRecommendation: language === 'id'
        ? 'Tunda evakuasi susur sungai & tebing rawan longsor. Wajibkan rompi pelampung dan tether-line. Larang penerbangan drone.'
        : 'Halt river search & cliffside operations. Mandate PFDs and tether lines. Drone flight operations strictly prohibited.',
      droneFlightStatus: droneStatus,
      waterRescueRisk: waterRisk === 'low' ? 'high' : waterRisk,
      landslideRisk: slideRisk === 'low' ? 'high' : slideRisk
    };
  }

  if (isHighRain || windSpeed >= 28 || windGusts >= 40) {
    return {
      hazardLevel: 'warning',
      hazardTitle: language === 'id' ? 'WASPADA: Peringatan Hujan Lebat di Lokasi' : 'WARNING: Heavy Rain Hazard',
      hazardDescription: language === 'id'
        ? `Akumulasi curah hujan signifikan berpotensi memicu luapan sungai susulan atau tanah labil di posko lapangan.`
        : `High precipitation rate likely to trigger renewed runoff, flooding, or destabilized soil at base camps.`,
      sarRecommendation: language === 'id'
        ? 'Amankan logistik posko dari genangan air. Koordinasikan perahu karet cadangan dan siapkan jalur evakuasi darurat alternatif.'
        : 'Secure field supply depots against flooding. Prepare standby rubber boats and inspect backup evacuation routes.',
      droneFlightStatus: droneStatus,
      waterRescueRisk: waterRisk === 'low' ? 'moderate' : waterRisk,
      landslideRisk: slideRisk === 'low' ? 'moderate' : slideRisk
    };
  }

  if (currentPrecip > 1 || weatherCode >= 51 || windSpeed >= 20) {
    return {
      hazardLevel: 'advisory',
      hazardTitle: language === 'id' ? 'PERHATIAN: Hujan Ringan - Kondisi Basah' : 'ADVISORY: Wet Field Conditions',
      hazardDescription: language === 'id'
        ? `Kondisi jalanan berlumpur dan licin. Peralatan komunikasi radio wajib dilindungi pelindung anti air.`
        : `Muddy trails and slippery terrain. Protect radio communication transceivers with waterproof covers.`,
      sarRecommendation: language === 'id'
        ? 'Gunakan sepatu boots anti-selip dan jas hujan tactical. Perhatikan dehidrasi dan hipotermia pada pengungsi anak/lansia.'
        : 'Equip volunteers with non-slip boots and rain ponchos. Monitor elderly and pediatric evacuees for hypothermia.',
      droneFlightStatus: droneStatus,
      waterRescueRisk: waterRisk,
      landslideRisk: slideRisk
    };
  }

  return {
    hazardLevel: 'normal',
    hazardTitle: language === 'id' ? 'KONDISI AMAN: Cuaca Mendukung Operasi' : 'NORMAL: Favorable Weather',
    hazardDescription: language === 'id'
      ? 'Jarak pandang baik, hembusan angin normal. Seluruh operasi pencarian dan penyaluran logistik dapat berjalan optimal.'
      : 'Optimal visibility and stable winds. All SAR, reconnaissance, and aid logistics missions can proceed smoothly.',
    sarRecommendation: language === 'id'
      ? 'Manfaatkan jendela cuaca baik untuk percepatan distribusi bantuan ke wilayah terisolir dan penerbangan drone pemetaan.'
      : 'Leverage clear weather window for priority supply drops to isolated cut-off sectors and drone aerial mapping.',
    droneFlightStatus: 'safe',
    waterRescueRisk: 'low',
    landslideRisk: 'low'
  };
}

// Fetch real-time weather from Open-Meteo
export async function fetchRealTimeWeather(
  latitude: number,
  longitude: number,
  locationName: string = 'Lokasi Bencana',
  disasterType?: string,
  language: 'id' | 'en' = 'en'
): Promise<RealTimeWeatherData> {
  const cacheKey = `${latitude.toFixed(2)},${longitude.toFixed(2)}`;
  const now = Date.now();

  const cached = weatherCache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return { ...cached.data, source: 'cached' };
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_gusts_10m&hourly=temperature_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m&daily=weather_code,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto&forecast_days=2`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Open-Meteo API returned status ${res.status}`);
    }

    const data = await res.json();
    const current = data.current || {};
    const hourly = data.hourly || {};
    const daily = data.daily || {};

    const temp = Math.round((current.temperature_2m ?? 28) * 10) / 10;
    const apparentTemp = Math.round((current.apparent_temperature ?? temp) * 10) / 10;
    const humidity = Math.round(current.relative_humidity_2m ?? 80);
    const precip = Math.round((current.precipitation ?? current.rain ?? 0) * 10) / 10;
    const rain = Math.round((current.rain ?? 0) * 10) / 10;
    const weatherCode = Number(current.weather_code ?? 2);
    const windSpeed = Math.round(current.wind_speed_10m ?? 12);
    const windGusts = Math.round(current.wind_gusts_10m ?? (windSpeed * 1.4));

    const wmo = interpretWmoCode(weatherCode, language);

    // Format next 12 hours
    const hourlyForecast: HourlyWeatherPoint[] = [];
    const times: string[] = hourly.time || [];
    const temps: number[] = hourly.temperature_2m || [];
    const precips: number[] = hourly.precipitation || [];
    const probs: number[] = hourly.precipitation_probability || [];
    const codes: number[] = hourly.weather_code || [];
    const winds: number[] = hourly.wind_speed_10m || [];

    // Find current hour index or start from 0
    const nowIso = new Date().toISOString().slice(0, 13);
    let startIdx = times.findIndex(t => t.startsWith(nowIso));
    if (startIdx === -1) startIdx = 0;

    const count = Math.min(12, times.length - startIdx);
    let maxHourlyRain = 0;

    for (let i = 0; i < count; i++) {
      const idx = startIdx + i;
      const rawTime = times[idx] || '';
      const hourPart = rawTime.includes('T') ? rawTime.split('T')[1].slice(0, 5) : `${i}:00`;
      const p = Math.round((precips[idx] || 0) * 10) / 10;
      if (p > maxHourlyRain) maxHourlyRain = p;

      const codeVal = codes[idx] || 2;
      const wmoHour = interpretWmoCode(codeVal, language);

      hourlyForecast.push({
        time: rawTime,
        hourLabel: hourPart,
        temp: Math.round(temps[idx] ?? 28),
        precipitationMm: p,
        precipitationProbability: Math.round(probs[idx] ?? 0),
        weatherCode: codeVal,
        condition: wmoHour.condition,
        windSpeed: Math.round(winds[idx] ?? 10)
      });
    }

    const dailyMaxRain = daily.precipitation_sum?.[0] ? Math.round(daily.precipitation_sum[0] * 10) / 10 : maxHourlyRain * 4;

    const hazards = evaluateTacticalHazards(precip, maxHourlyRain, windSpeed, windGusts, weatherCode, disasterType, language);

    const result: RealTimeWeatherData = {
      locationName,
      latitude,
      longitude,
      temperature: temp,
      apparentTemperature: apparentTemp,
      relativeHumidity: humidity,
      precipitation: precip,
      rain,
      weatherCode,
      condition: wmo.condition,
      icon: wmo.icon,
      windSpeed,
      windGusts,
      isExtreme: wmo.isSevere || hazards.hazardLevel === 'critical' || hazards.hazardLevel === 'warning',
      ...hazards,
      hourlyForecast,
      dailyMaxRain,
      fetchedAt: new Date().toLocaleTimeString(language === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
      source: 'open-meteo-live'
    };

    weatherCache.set(cacheKey, { data: result, expiresAt: now + CACHE_TTL_MS });
    return result;
  } catch (err) {
    console.warn(`[WeatherService] Error fetching live weather for ${locationName}, falling back to tactical simulation:`, err);
    return getFallbackTacticalWeather(latitude, longitude, locationName, disasterType, language);
  }
}

// Realistic tactical fallback in case of network restriction or offline mode
function getFallbackTacticalWeather(
  latitude: number,
  longitude: number,
  locationName: string,
  disasterType?: string,
  language: 'id' | 'en' = 'en'
): RealTimeWeatherData {
  const isFlood = disasterType === 'flood';
  const isFire = disasterType === 'fire';

  // Seed with realistic tropical situational data
  const temp = isFire ? 34.5 : isFlood ? 27.2 : 29.0;
  const humidity = isFire ? 45 : isFlood ? 92 : 78;
  const precip = isFlood ? 18.5 : isFire ? 0.0 : 4.2;
  const code = isFlood ? 65 : isFire ? 1 : 61;
  const wind = isFire ? 24 : 14;
  const gusts = isFire ? 38 : 22;

  const wmo = interpretWmoCode(code, language);
  const hazards = evaluateTacticalHazards(precip, precip * 1.5, wind, gusts, code, disasterType, language);

  const hourlyForecast: HourlyWeatherPoint[] = [];
  const baseHour = new Date().getHours();

  for (let i = 0; i < 12; i++) {
    const h = (baseHour + i) % 24;
    const hourLabel = `${h.toString().padStart(2, '0')}:00`;
    const rainFactor = isFlood ? Math.max(2, 22 - Math.abs(i - 3) * 3) : Math.max(0, 5 - i);
    hourlyForecast.push({
      time: hourLabel,
      hourLabel,
      temp: Math.round(temp + Math.sin(i / 2) * 2),
      precipitationMm: Math.round(rainFactor * 10) / 10,
      precipitationProbability: isFlood ? 85 : 30,
      weatherCode: isFlood ? (rainFactor > 15 ? 65 : 61) : 2,
      condition: isFlood ? (rainFactor > 15 ? 'Hujan Sangat Lebat' : 'Hujan Sedang') : 'Berawan',
      windSpeed: wind + (i % 3)
    });
  }

  return {
    locationName,
    latitude,
    longitude,
    temperature: temp,
    apparentTemperature: temp + 2.5,
    relativeHumidity: humidity,
    precipitation: precip,
    rain: precip,
    weatherCode: code,
    condition: wmo.condition,
    icon: wmo.icon,
    windSpeed: wind,
    windGusts: gusts,
    isExtreme: hazards.hazardLevel === 'critical' || hazards.hazardLevel === 'warning',
    ...hazards,
    hourlyForecast,
    dailyMaxRain: isFlood ? 68.0 : 12.0,
    fetchedAt: new Date().toLocaleTimeString(language === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
    source: 'fallback'
  };
}

// Fetch RainViewer real-time radar timestamps for Leaflet tile overlay
export async function fetchRainViewerRadar(): Promise<RadarLayerData> {
  const defaultResult: RadarLayerData = {
    host: 'https://tilecache.rainviewer.com',
    latestFrame: null,
    frames: []
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch('https://api.rainviewer.com/public/weather-maps.json', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`RainViewer API returned status ${res.status}`);

    const data = await res.json();
    const host = data.host || 'https://tilecache.rainviewer.com';
    const past = data.radar?.past || [];

    if (past.length === 0) return defaultResult;

    const frames: RainViewerRadarFrame[] = past.slice(-5).map((f: any) => ({
      time: f.time,
      path: f.path,
      // Tile format: {host}{path}/256/{z}/{x}/{y}/2/1_1.png
      tileUrl: `${host}${f.path}/256/{z}/{x}/{y}/2/1_1.png`
    }));

    const latest = frames[frames.length - 1];

    return {
      host,
      latestFrame: latest,
      frames
    };
  } catch (err) {
    console.warn('[WeatherService] RainViewer API not reachable, radar overlay may be unavailable:', err);
    return defaultResult;
  }
}

// Batch fetch weather for multiple disaster points
export async function batchFetchDisasterWeather(
  disasters: Disaster[],
  language: 'id' | 'en' = 'en'
): Promise<Map<string, RealTimeWeatherData>> {
  const results = new Map<string, RealTimeWeatherData>();
  
  // Fetch up to 6 disasters in parallel to respect rate limits
  const targetDisasters = disasters.slice(0, 6);
  const promises = targetDisasters.map(async (d) => {
    try {
      const weather = await fetchRealTimeWeather(d.locationLat, d.locationLng, d.title, d.type, language);
      results.set(d.id, weather);
    } catch {
      // ignore individual failure
    }
  });

  await Promise.all(promises);
  return results;
}
