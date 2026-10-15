import React, { useState, useEffect } from 'react';
import { 
  CloudRain, 
  Wind, 
  Thermometer, 
  AlertTriangle, 
  ShieldAlert, 
  RefreshCw, 
  Radar, 
  Droplets, 
  Compass, 
  Plane, 
  LifeBuoy, 
  Mountain, 
  Info,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  MapPin
} from 'lucide-react';
import { Disaster } from '../../types/index.ts';
import { 
  RealTimeWeatherData, 
  fetchRealTimeWeather 
} from '../../services/weatherService.ts';

interface TacticalWeatherPanelProps {
  disasters: Disaster[];
  selectedDisasterId?: string | null;
  onSelectDisaster?: (id: string) => void;
  isRadarActive?: boolean;
  onToggleRadar?: () => void;
  language?: 'id' | 'en';
}

export const TacticalWeatherPanel: React.FC<TacticalWeatherPanelProps> = ({
  disasters,
  selectedDisasterId,
  onSelectDisaster,
  isRadarActive = false,
  onToggleRadar,
  language = 'id'
}) => {
  const [activeDisaster, setActiveDisaster] = useState<Disaster | null>(() => {
    if (selectedDisasterId) {
      return disasters.find(d => d.id === selectedDisasterId) || disasters[0] || null;
    }
    return disasters[0] || null;
  });

  const [weatherData, setWeatherData] = useState<RealTimeWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Sync when selectedDisasterId prop changes from parent
  useEffect(() => {
    if (selectedDisasterId) {
      const match = disasters.find(d => d.id === selectedDisasterId);
      if (match && match.id !== activeDisaster?.id) {
        setActiveDisaster(match);
      }
    }
  }, [selectedDisasterId, disasters]);

  // Fetch real-time weather whenever active disaster changes
  const loadWeather = async () => {
    if (!activeDisaster) return;
    setIsLoading(true);
    try {
      const data = await fetchRealTimeWeather(
        activeDisaster.locationLat,
        activeDisaster.locationLng,
        activeDisaster.title,
        activeDisaster.type,
        language
      );
      setWeatherData(data);
    } catch (err) {
      console.error('Failed to load weather:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, [activeDisaster?.id, language]);

  const handleSelectDisaster = (d: Disaster) => {
    setActiveDisaster(d);
    if (onSelectDisaster) {
      onSelectDisaster(d.id);
    }
  };

  const getHazardBadge = (level: string) => {
    switch (level) {
      case 'critical':
        return {
          bg: 'bg-red-500/20 text-red-300 border-red-500/50',
          dot: 'bg-red-500 animate-ping',
          text: language === 'id' ? 'SIAGA EKSTREM' : 'CRITICAL ALERT'
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
          dot: 'bg-amber-400',
          text: language === 'id' ? 'WASPADA HUJAN' : 'WEATHER WARNING'
        };
      case 'advisory':
        return {
          bg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
          dot: 'bg-yellow-400',
          text: language === 'id' ? 'PERHATIAN BASAH' : 'WET ADVISORY'
        };
      default:
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
          dot: 'bg-emerald-400',
          text: language === 'id' ? 'KONDISI KONDUSIF' : 'NORMAL / SAFE'
        };
    }
  };

  const hazardBadge = weatherData ? getHazardBadge(weatherData.hazardLevel) : getHazardBadge('normal');

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md space-y-4">
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                {language === 'id' ? 'Pusat Telemetri Cuaca Real-Time & Radar Hujan' : 'Real-Time Weather Telemetry & Rain Radar'}
              </h3>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                LIVE WMO API
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {language === 'id' 
                ? 'Integrasi sensor Open-Meteo & Radar Presipitasi untuk deteksi dini banjir, longsor, dan badai operasi SAR'
                : 'Open-Meteo & Precipitation Radar feeds for early warning on floods, landslides, and SAR flight safety'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {onToggleRadar && (
            <button
              onClick={onToggleRadar}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition shadow-sm ${
                isRadarActive
                  ? 'bg-blue-600 text-white border-blue-400 shadow-blue-500/30'
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
              }`}
              title="Tampilkan layer radar hujan real-time pada peta"
            >
              <Radar className={`w-3.5 h-3.5 ${isRadarActive ? 'animate-spin' : ''}`} />
              <span>{language === 'id' ? 'Layer Radar Hujan' : 'Radar Overlay'}</span>
              <span className={`text-[9px] font-mono px-1 rounded ${isRadarActive ? 'bg-blue-900 text-blue-200' : 'bg-slate-900 text-slate-400'}`}>
                {isRadarActive ? 'AKTIF' : 'OFF'}
              </span>
            </button>
          )}

          <button
            onClick={loadWeather}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition"
            title="Muat ulang prakiraan cuaca dari satelit"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
            <span className="hidden sm:inline">{language === 'id' ? 'Segarkan' : 'Refresh'}</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white border border-slate-700 transition"
            title={isExpanded ? 'Sembunyikan detail cuaca' : 'Tampilkan detail cuaca'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Disaster Location Selector Chips */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 font-medium">
            <MapPin className="w-3 h-3 text-red-400" />
            {language === 'id' ? 'Pilih Lokasi Titik Operasi Bencana:' : 'Select Disaster Operation Sector:'}
          </span>
          {weatherData && (
            <span className="font-mono text-slate-500 text-[10px]">
              {language === 'id' ? 'Diperbarui:' : 'Updated:'} {weatherData.fetchedAt} • {weatherData.source === 'open-meteo-live' ? 'Satelit Live' : 'Sistem Siaga'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {disasters.slice(0, 6).map((d) => {
            const isSelected = activeDisaster?.id === d.id;
            return (
              <button
                key={d.id}
                onClick={() => handleSelectDisaster(d)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30 font-semibold'
                    : 'bg-slate-950/70 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
              >
                <span>{d.type === 'flood' ? '🌊' : d.type === 'fire' ? '🔥' : '⚠️'}</span>
                <span className="max-w-[140px] truncate">{d.title.split('-')[0].trim()}</span>
                <span className="text-[10px] opacity-75 font-mono">({d.province})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Weather Information Body */}
      {weatherData && isExpanded && (
        <div className="space-y-4 pt-1">
          {/* Severe Weather Warning / Pusdalops Alert Banner */}
          <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            weatherData.hazardLevel === 'critical'
              ? 'bg-red-950/70 border-red-800/80 text-red-200'
              : weatherData.hazardLevel === 'warning'
              ? 'bg-amber-950/70 border-amber-800/80 text-amber-200'
              : weatherData.hazardLevel === 'advisory'
              ? 'bg-yellow-950/50 border-yellow-800/60 text-yellow-200'
              : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-2 rounded-lg bg-black/30 border border-white/10 shrink-0">
                {weatherData.hazardLevel === 'critical' || weatherData.hazardLevel === 'warning' ? (
                  <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />
                ) : weatherData.hazardLevel === 'advisory' ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                )}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider">{weatherData.hazardTitle}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${hazardBadge.bg}`}>
                    {hazardBadge.text}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                  {weatherData.hazardDescription}
                </p>
                <div className="text-[11px] font-medium text-slate-200 pt-1 flex items-center gap-1.5">
                  <span className="font-bold text-amber-300">{language === 'id' ? 'Protokol SAR:' : 'SAR Protocol:'}</span>
                  <span>{weatherData.sarRecommendation}</span>
                </div>
              </div>
            </div>

            {/* Quick Live Condition Summary on Right */}
            <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10 gap-1 text-right">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{weatherData.icon}</span>
                <div>
                  <div className="text-2xl font-bold font-mono tracking-tight text-white">
                    {weatherData.temperature}°C
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {language === 'id' ? 'Terasa' : 'Feels'} {weatherData.apparentTemperature}°C
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-200 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                {weatherData.condition}
              </span>
            </div>
          </div>

          {/* 4 Sensor Metric Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Card 1: Curah Hujan & Presipitasi */}
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span className="flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" />
                  {language === 'id' ? 'Curah Hujan' : 'Rain Rate'}
                </span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                  weatherData.precipitation > 15 ? 'bg-red-950 text-red-300' : weatherData.precipitation > 5 ? 'bg-amber-950 text-amber-300' : 'bg-slate-800 text-slate-300'
                }`}>
                  {weatherData.precipitation > 20 ? 'Ekstrem' : weatherData.precipitation > 10 ? 'Lebat' : weatherData.precipitation > 1 ? 'Sedang' : 'Nihil'}
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-white flex items-baseline gap-1">
                {weatherData.precipitation}
                <span className="text-xs text-slate-400 font-normal">mm/jam</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {language === 'id' ? 'Akumulasi 24 Jam:' : '24h Total:'} <span className="text-slate-200 font-bold">{weatherData.dailyMaxRain} mm</span>
              </div>
            </div>

            {/* Card 2: Kelembapan & Suhu Lapangan */}
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span className="flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  {language === 'id' ? 'Kelembapan Udara' : 'Air Humidity'}
                </span>
                <span className="text-[10px] font-mono text-slate-400">RH</span>
              </div>
              <div className="text-xl font-bold font-mono text-white flex items-baseline gap-1">
                {weatherData.relativeHumidity}%
                <span className="text-xs text-slate-400 font-normal">
                  {weatherData.relativeHumidity > 85 ? 'Jenuh Air' : 'Normal'}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {language === 'id' ? 'Indeks Panas Lapangan:' : 'Heat Index:'} <span className="text-slate-200 font-bold">{weatherData.apparentTemperature}°C</span>
              </div>
            </div>

            {/* Card 3: Kecepatan & Hembusan Angin */}
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span className="flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-cyan-400" />
                  {language === 'id' ? 'Kecepatan Angin' : 'Wind Speed'}
                </span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                  weatherData.windGusts > 45 ? 'bg-red-950 text-red-300' : 'bg-slate-800 text-slate-300'
                }`}>
                  {weatherData.windGusts > 45 ? 'Kencang' : 'Stabil'}
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-white flex items-baseline gap-1">
                {weatherData.windSpeed}
                <span className="text-xs text-slate-400 font-normal">km/jam</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {language === 'id' ? 'Hembusan Maks:' : 'Max Gusts:'} <span className="text-cyan-300 font-bold">{weatherData.windGusts} km/jam</span>
              </div>
            </div>

            {/* Card 4: Kesiapan Taktis Tim Relawan */}
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span className="flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5 text-indigo-400" />
                  {language === 'id' ? 'Drone Pemantau SAR' : 'SAR Drone Flight'}
                </span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                  weatherData.droneFlightStatus === 'safe'
                    ? 'bg-emerald-950 text-emerald-300'
                    : weatherData.droneFlightStatus === 'caution'
                    ? 'bg-yellow-950 text-yellow-300'
                    : 'bg-red-950 text-red-300'
                }`}>
                  {weatherData.droneFlightStatus.toUpperCase()}
                </span>
              </div>
              <div className="text-xs font-semibold text-white pt-1">
                {weatherData.droneFlightStatus === 'safe'
                  ? (language === 'id' ? 'Aman Mengudara' : 'Airspace Clear')
                  : weatherData.droneFlightStatus === 'caution'
                  ? (language === 'id' ? 'Waspada Angin Samping' : 'Crosswind Alert')
                  : (language === 'id' ? 'Dilarang Terbang' : 'Flight Prohibited')}
              </div>
              <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                <span>{language === 'id' ? 'Risiko Air/Arus:' : 'Water Risk:'}</span>
                <span className={`font-bold ${
                  weatherData.waterRescueRisk === 'extreme' || weatherData.waterRescueRisk === 'high' ? 'text-red-400' : 'text-slate-300'
                }`}>{weatherData.waterRescueRisk.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* 12-Hour Hourly Rain & Weather Timeline */}
          {weatherData.hourlyForecast.length > 0 && (
            <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                  {language === 'id' ? 'Prakiraan Curah Hujan 12 Jam ke Depan' : '12-Hour Rain & Weather Forecast'}
                </span>
                <div className="flex items-center gap-3 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    {language === 'id' ? 'Peluang Hujan (%)' : 'Rain Prob (%)'}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded bg-cyan-400"></span>
                    {language === 'id' ? 'Intensitas (mm)' : 'Rainfall (mm)'}
                  </span>
                </div>
              </div>

              {/* Hourly Forecast Horizontal Scroll / Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-1.5 pt-1">
                {weatherData.hourlyForecast.map((hour, idx) => {
                  const isHighRisk = hour.precipitationMm >= 10 || hour.weatherCode >= 80;
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col items-center justify-between p-2 rounded-lg border text-center transition ${
                        isHighRisk
                          ? 'bg-red-950/40 border-red-800/60 text-red-200'
                          : hour.precipitationProbability > 50
                          ? 'bg-blue-950/40 border-blue-800/50 text-blue-200'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="text-[10px] font-mono font-medium text-slate-400">{hour.hourLabel}</span>
                      <span className="text-lg my-1">{interpretWmoCode(hour.weatherCode, language).icon}</span>
                      <span className="text-xs font-bold font-mono text-white">{hour.temp}°</span>

                      {/* Rain Bar Indicator */}
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            hour.precipitationMm > 15 ? 'bg-red-500' : hour.precipitationMm > 5 ? 'bg-amber-400' : 'bg-cyan-400'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(8, hour.precipitationMm * 5))}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between w-full text-[9px] font-mono mt-1 pt-1 border-t border-slate-800/60">
                        <span className="text-cyan-300 font-bold">{hour.precipitationMm}m</span>
                        <span className="text-blue-300">{hour.precipitationProbability}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
