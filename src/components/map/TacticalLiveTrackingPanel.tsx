import React from 'react';
import { 
  Radio, 
  Navigation, 
  Activity, 
  Battery, 
  Wifi, 
  Play, 
  Pause, 
  FastForward, 
  Crosshair, 
  Shield, 
  AlertTriangle, 
  Compass, 
  ChevronDown, 
  ChevronUp, 
  Maximize2,
  Clock,
  Heart,
  Phone
} from 'lucide-react';
import { VolunteerTrackingTelemetry } from '../../types/index.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface TacticalLiveTrackingPanelProps {
  isTrackingActive: boolean;
  onToggleTracking: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  simulationSpeed: number;
  onChangeSpeed: (speed: number) => void;
  telemetryList: VolunteerTrackingTelemetry[];
  selectedTrackedVolunteerId: string | null;
  onSelectTrackedVolunteer: (id: string | null) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const TacticalLiveTrackingPanel: React.FC<TacticalLiveTrackingPanelProps> = ({
  isTrackingActive,
  onToggleTracking,
  isPaused,
  onTogglePause,
  simulationSpeed,
  onChangeSpeed,
  telemetryList,
  selectedTrackedVolunteerId,
  onSelectTrackedVolunteer,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const { language, t } = useLanguage();
  const isEn = language === 'en';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
      {/* Top Bar: Master Switch and Simulation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Main Activation Toggle */}
          <button
            onClick={onToggleTracking}
            className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all shadow-md ${
              isTrackingActive
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <div className="relative flex items-center justify-center">
              <Radio className={`w-4 h-4 ${isTrackingActive ? 'text-white' : 'text-slate-400'}`} />
              {isTrackingActive && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
              )}
            </div>
            <span>
              {isTrackingActive ? t.liveTrackingActive : t.liveTrackingInactive}
            </span>
          </button>

          {/* Status Counter */}
          {isTrackingActive && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-emerald-300 font-bold">
                {telemetryList.length} {language === 'id' ? 'TIM AKTIF BERGERAK' : 'UNITS MOVING LIVE'}
              </span>
            </div>
          )}
        </div>

        {/* Playback Controls (Play/Pause, Speed 1x, 2x, 5x) */}
        {isTrackingActive && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              {t.liveTrackingSimulationSpeed}:
            </span>

            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={onTogglePause}
                title={isPaused ? 'Resume Simulation' : 'Pause Simulation'}
                className={`p-1.5 rounded transition-colors ${
                  isPaused 
                    ? 'bg-amber-600 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
              </button>

              <div className="w-[1px] h-4 bg-slate-800 mx-1"></div>

              {[1, 2, 5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => onChangeSpeed(speed)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-colors ${
                    simulationSpeed === speed
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {selectedTrackedVolunteerId && (
              <button
                onClick={() => onSelectTrackedVolunteer(null)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 transition-colors"
              >
                <Crosshair className="w-3 h-3 text-cyan-400" />
                <span>{t.liveTrackingUnfollow}</span>
              </button>
            )}

            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title={isCollapsed ? 'Tampilkan Detail' : 'Sembunyikan Detail'}
              >
                {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Description when inactive */}
      {!isTrackingActive && (
        <p className="text-xs text-slate-400 leading-relaxed">
          {t.liveTrackingDesc}
        </p>
      )}

      {/* Expanded Live Telemetry Units Strip */}
      {isTrackingActive && !isCollapsed && (
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-blue-400" />
              <span>{language === 'id' ? 'Pemantauan Posisi & Telemetri Tim' : 'Active Units Live Telemetry'}</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {language === 'id' ? 'Klik kartu untuk mengunci kamera peta (GPS Follow)' : 'Click card to lock map camera'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {telemetryList.map(tel => {
              const isSelected = selectedTrackedVolunteerId === tel.volunteerId;
              const isSar = tel.category === 'sar_official';

              return (
                <div
                  key={tel.volunteerId}
                  onClick={() => onSelectTrackedVolunteer(isSelected ? null : tel.volunteerId)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-slate-950 border-cyan-400 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-400'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  {/* Top status indicator bar */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="relative">
                        {tel.avatar ? (
                          <img
                            src={tel.avatar}
                            alt={tel.volunteerName}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                            {tel.volunteerName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-slate-950"></span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate leading-tight">
                          {tel.volunteerName}
                        </h4>
                        <span className={`text-[9px] px-1 rounded font-mono ${
                          isSar 
                            ? 'text-orange-400 bg-orange-950/80' 
                            : 'text-emerald-400 bg-emerald-950/80'
                        }`}>
                          {isSar ? (isEn ? 'OFFICIAL SAR' : 'SAR RESMI') : (isEn ? 'CITIZEN VOLUNTEER' : 'RELAWAN WARGA')}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        GPS LOCK
                      </span>
                    )}
                  </div>

                  {/* Mission / Duty pill */}
                  <div className="text-[10px] text-slate-300 bg-slate-900 px-2 py-1 rounded-md border border-slate-800/80 truncate mb-2">
                    <span className="text-slate-400 font-mono">{isEn ? 'Duty:' : 'Tugas:'}</span> {tel.dutyType}
                  </div>

                  {/* Telemetry Metrics Grid */}
                  <div className="grid grid-cols-3 gap-1 text-[10px] font-mono tabular-nums text-slate-300 mb-2">
                    <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800/60 text-center">
                      <span className="text-[8px] text-slate-400 block">{isEn ? 'SPEED' : 'KECEPATAN'}</span>
                      <span className="font-bold text-amber-400">{tel.speedKmh} km/h</span>
                    </div>
                    <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800/60 text-center flex flex-col items-center justify-center">
                      <span className="text-[8px] text-slate-400 block">{isEn ? 'HEADING' : 'ARAH'}</span>
                      <div className="flex items-center gap-0.5 font-bold text-blue-400">
                        <span style={{ display: 'inline-block', transform: `rotate(${tel.headingDeg}deg)` }}>
                          ➤
                        </span>
                        <span>{tel.headingDeg}°</span>
                      </div>
                    </div>
                    <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800/60 text-center">
                      <span className="text-[8px] text-slate-400 block">{isEn ? 'BATTERY' : 'BATERAI'}</span>
                      <span className="font-bold text-emerald-400">{tel.batteryLevel}%</span>
                    </div>
                  </div>

                  {/* Destination & Distance footer */}
                  <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-800/80 text-slate-400">
                    <span className="truncate max-w-[110px]" title={tel.destinationName}>
                      📍 {tel.destinationName}
                    </span>
                    <span className="font-mono text-cyan-400 font-bold shrink-0">
                      {tel.distanceToDestinationM}m ({tel.etaMinutes}m)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
