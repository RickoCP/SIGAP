import React, { useState } from 'react';
import { 
  Flame, 
  Waves, 
  TrendingUp, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Compass, 
  Sparkles, 
  ChevronRight, 
  Info,
  Droplets,
  Sun,
  Copy,
  Check,
  RefreshCw,
  FileText,
  ShieldCheck,
  Users,
  Truck,
  ArrowRight
} from 'lucide-react';
import { 
  RegionalHistoricalData, 
  MonthlyHistoricalTrend, 
  YearlyHistoricalTrend, 
  SeasonalMitigationWindow,
  HistoricalTrendAINarrative
} from '../../types/index.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface HistoricalDisasterTrendsProps {
  provinceId?: string;
  provinceName: string;
  historicalData: RegionalHistoricalData;
  narrativeReport?: HistoricalTrendAINarrative | null;
  onGenerateNarrative?: () => void;
  isGeneratingNarrative?: boolean;
}

export const HistoricalDisasterTrends: React.FC<HistoricalDisasterTrendsProps> = ({
  provinceId,
  provinceName,
  historicalData,
  narrativeReport,
  onGenerateNarrative,
  isGeneratingNarrative = false
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [viewMode, setViewMode] = useState<'monthly' | 'yearly' | 'mitigation' | 'narrative'>('monthly');
  const [metricFocus, setMetricFocus] = useState<'both' | 'fire' | 'flood'>('both');
  const [hoveredMonth, setHoveredMonth] = useState<MonthlyHistoricalTrend | null>(null);
  const [hoveredYear, setHoveredYear] = useState<YearlyHistoricalTrend | null>(null);
  const [copiedNarrative, setCopiedNarrative] = useState<boolean>(false);

  const { monthlyTrends, yearlyTrends, mitigationWindows, historicalAnalysisNotes } = historicalData;

  // Maximum scales for SVG charts
  const maxRainfall = Math.max(...monthlyTrends.map(m => m.rainfallMm), 400);
  const maxHotspots = Math.max(...monthlyTrends.map(m => m.fireHotspots), 200);
  const maxFloodIncidents = Math.max(...monthlyTrends.map(m => m.floodIncidents), 15);

  const maxYearlyHotspots = Math.max(...yearlyTrends.map(y => y.fireHotspotCount), 2000);
  const maxYearlyFloods = Math.max(...yearlyTrends.map(y => y.floodDisasterCount), 60);

  // Current month index (e.g. Oktober is index 9)
  const currentMonthIdx = 9;

  const handleCopyNarrative = () => {
    if (!narrativeReport) return;
    const text = `LAPORAN ANALISIS NARATIF TREN HISTORIS BENCANA GEMINI AI
PROVINSI: ${narrativeReport.provinceName.toUpperCase()}
Tanggal Analisis: ${new Date(narrativeReport.generatedAt).toLocaleString('id-ID')}
Model: Gemini 3.8 Flash

TAJUK UTAMA:
${narrativeReport.executiveHeadline}

1. LINTASAN TREN 5 TAHUN (2022 - 2026):
${narrativeReport.trendTrajectoryAnalysis}

2. DINAMIKA SIKLUS MUSIMAN 12 BULAN:
${narrativeReport.seasonalCyclicalDeepDive}

3. KORELASI ANOMALI IKLIM:
- Dampak El Niño: ${narrativeReport.climateAnomalyCorrelation.elNinoImpactSummary}
- Risiko La Niña / Monsun: ${narrativeReport.climateAnomalyCorrelation.laNinaOrMonsoonRisk}
- Pola Perulangan Periodik: ${narrativeReport.climateAnomalyCorrelation.recurrencePattern}

4. PROYEKSI RISIKO 6 BULAN KE DEPAN:
${narrativeReport.predictiveRiskForecastNext6Months.map(p => `[${p.period}] (${p.preemptiveAlertLevel})\nAncaman: ${p.projectedThreat}\nPrakiraan Kerentanan: ${p.vulnerabilityForecast}`).join('\n\n')}

5. REKOMENDASI AKSI BERBASIS DATA HISTORIS:
${narrativeReport.dataDrivenActionRecommendations.map(r => `• ${r.title} [${r.timing}]\n  Dasar Data: ${r.rationaleFromHistoricalData}\n  Aksi: ${r.actionItems.join('; ')}`).join('\n\n')}

6. PANDUAN PENEMPATAN DINI (PRE-POSITIONING) RELAWAN & LOGISTIK:
${narrativeReport.volunteerAndLogisticsPrepositioning}`;

    navigator.clipboard.writeText(text);
    setCopiedNarrative(true);
    setTimeout(() => setCopiedNarrative(false), 2500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
      {/* Header & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {isEn ? 'Historical Analytics & Disaster Climatology' : 'Analitika Historis & Siklus Musiman Bencana'}
            </span>
          </div>
          <h3 className="text-lg font-black text-white">
            {isEn ? `Wildfire & Flood Vulnerability Trends - ${provinceName}` : `Tren Potensi Kebakaran Hutan & Banjir - ${provinceName}`}
          </h3>
          <p className="text-xs text-slate-400 max-w-xl">
            {isEn 
              ? 'Multi-year climatological cycles combined with Gemini AI Narrative Intelligence to guide preemptive prepositioning before peak hazard onset.'
              : 'Visualisasi pola 12 bulan dan 5 tahun terakhir yang terintegrasi dengan Analisis Naratif Gemini AI untuk memandu koordinator melakukan tindakan mitigasi dini sebelum bencana memuncak.'}
          </p>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs shrink-0">
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
              viewMode === 'monthly' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isEn ? '12-Month Cycle' : 'Siklus 12 Bulan'}
          </button>
          <button
            onClick={() => setViewMode('yearly')}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
              viewMode === 'yearly' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isEn ? '5-Year Trend' : 'Tren 5 Tahun'}
          </button>
          <button
            onClick={() => setViewMode('mitigation')}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
              viewMode === 'mitigation' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isEn ? `Action Windows (${mitigationWindows.length})` : `Jendela Aksi (${mitigationWindows.length})`}
          </button>
          <button
            onClick={() => {
              setViewMode('narrative');
              if (!narrativeReport && onGenerateNarrative && !isGeneratingNarrative) {
                onGenerateNarrative();
              }
            }}
            className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'narrative' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-blue-400/40' 
                : 'text-blue-400 hover:text-blue-300 hover:bg-blue-950/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-300 animate-pulse" />
            <span>{isEn ? 'AI Narrative Intelligence' : 'Analisis Naratif AI'}</span>
            {narrativeReport && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            )}
          </button>
        </div>
      </div>

      {/* Metric Focus Selector for Monthly/Yearly views */}
      {viewMode !== 'mitigation' && viewMode !== 'narrative' && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">{isEn ? 'Metric Focus:' : 'Fokus Metrik:'}</span>
            <button
              onClick={() => setMetricFocus('both')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                metricFocus === 'both' ? 'bg-slate-700 text-white' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isEn ? 'Fire vs Flood Comparison' : 'Komparasi Karhutla vs Banjir'}
            </button>
            <button
              onClick={() => setMetricFocus('fire')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors flex items-center gap-1 ${
                metricFocus === 'fire' ? 'bg-orange-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🔥</span> {isEn ? 'Wildfire & Hotspots' : 'Karhutla & Hotspot'}
            </button>
            <button
              onClick={() => setMetricFocus('flood')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors flex items-center gap-1 ${
                metricFocus === 'flood' ? 'bg-cyan-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🌊</span> {isEn ? 'Floods & Rainfall' : 'Banjir & Curah Hujan'}
            </button>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-orange-500 inline-block"></span>
              <span>{isEn ? 'Fire Hotspots' : 'Hotspot Karhutla'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-cyan-500 inline-block"></span>
              <span>{isEn ? 'Rainfall / Flood' : 'Curah Hujan / Banjir'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border border-amber-400 bg-amber-400/30 inline-block"></span>
              <span>{isEn ? 'Current Month (Oct)' : 'Bulan Berjalan (Okt)'}</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 1: MONTHLY 12-MONTH CLIMATOLOGICAL CYCLE */}
      {viewMode === 'monthly' && (
        <div className="space-y-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative">
            <div className="text-xs text-slate-400 mb-2 flex items-center justify-between">
              <span>Grafik Siklus Bulanan Rata-Rata (Januari - Desember)</span>
              <span className="text-[11px] text-slate-500">Arahkan kursor ke tiap bulan untuk melihat detail</span>
            </div>

            {/* SVG Visual Chart */}
            <div className="relative h-64 w-full">
              <svg className="w-full h-full" viewBox="0 0 720 220" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="fireRiskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="floodRiskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Guide Lines */}
                {[0, 50, 100, 150, 200].map((yVal, idx) => (
                  <line
                    key={idx}
                    x1="40"
                    y1={yVal}
                    x2="700"
                    y2={yVal}
                    stroke="#1e293b"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                ))}

                {/* Risk Area Curves */}
                {metricFocus !== 'flood' && (
                  <path
                    d={
                      monthlyTrends.reduce((acc, m, i) => {
                        const x = 55 + i * 54;
                        const y = 200 - (m.fireRiskScore / 100) * 170;
                        return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                      }, '') + ` L ${55 + 11 * 54} 200 L 55 200 Z`
                    }
                    fill="url(#fireRiskGrad)"
                  />
                )}

                {metricFocus !== 'fire' && (
                  <path
                    d={
                      monthlyTrends.reduce((acc, m, i) => {
                        const x = 55 + i * 54;
                        const y = 200 - (m.floodRiskScore / 100) * 170;
                        return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                      }, '') + ` L ${55 + 11 * 54} 200 L 55 200 Z`
                    }
                    fill="url(#floodRiskGrad)"
                  />
                )}

                {/* Bars & Dots per Month */}
                {monthlyTrends.map((m, idx) => {
                  const xCenter = 55 + idx * 54;
                  const isCurrent = idx === currentMonthIdx;

                  // Hotspots bar (orange)
                  const fireBarHeight = (m.fireHotspots / maxHotspots) * 150;
                  const fireY = 200 - fireBarHeight;

                  // Rainfall bar (cyan)
                  const floodBarHeight = (m.rainfallMm / maxRainfall) * 150;
                  const floodY = 200 - floodBarHeight;

                  const isHovered = hoveredMonth?.month === m.month;

                  return (
                    <g key={m.month} className="cursor-pointer">
                      {/* Current Month Highlight Column */}
                      {isCurrent && (
                        <rect
                          x={xCenter - 22}
                          y="10"
                          width="44"
                          height="190"
                          fill="rgba(245, 158, 11, 0.08)"
                          stroke="rgba(245, 158, 11, 0.4)"
                          strokeDasharray="2 2"
                          rx="4"
                        />
                      )}

                      {/* Hotspot Bar */}
                      {metricFocus !== 'flood' && (
                        <rect
                          x={metricFocus === 'both' ? xCenter - 14 : xCenter - 10}
                          y={fireY}
                          width={metricFocus === 'both' ? 12 : 20}
                          height={Math.max(fireBarHeight, 2)}
                          fill={isHovered ? '#ea580c' : '#f97316'}
                          rx="2"
                        />
                      )}

                      {/* Rainfall Bar */}
                      {metricFocus !== 'fire' && (
                        <rect
                          x={metricFocus === 'both' ? xCenter + 2 : xCenter - 10}
                          y={floodY}
                          width={metricFocus === 'both' ? 12 : 20}
                          height={Math.max(floodBarHeight, 2)}
                          fill={isHovered ? '#0891b2' : '#06b6d4'}
                          rx="2"
                        />
                      )}

                      {/* Fire Risk Dot */}
                      {metricFocus !== 'flood' && (
                        <circle
                          cx={xCenter}
                          cy={200 - (m.fireRiskScore / 100) * 170}
                          r={isHovered ? 4.5 : 3}
                          fill="#f97316"
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                      )}

                      {/* Flood Risk Dot */}
                      {metricFocus !== 'fire' && (
                        <circle
                          cx={xCenter}
                          cy={200 - (m.floodRiskScore / 100) * 170}
                          r={isHovered ? 4.5 : 3}
                          fill="#06b6d4"
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                      )}

                      {/* X-axis Label */}
                      <text
                        x={xCenter}
                        y="215"
                        textAnchor="middle"
                        fill={isCurrent ? '#f59e0b' : '#94a3b8'}
                        fontSize="11"
                        fontWeight={isCurrent ? 'bold' : 'normal'}
                      >
                        {m.month}
                      </text>

                      {/* Transparent Hover Hitbox */}
                      <rect
                        x={xCenter - 25}
                        y="10"
                        width="50"
                        height="200"
                        fill="transparent"
                        onMouseEnter={() => setHoveredMonth(m)}
                        onMouseLeave={() => setHoveredMonth(null)}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Hovered Month Inspection Tooltip */}
            {hoveredMonth ? (
              <div className="mt-3 p-3 bg-slate-900 border border-slate-700 rounded-lg text-xs grid grid-cols-2 sm:grid-cols-4 gap-3 shadow-lg animate-in fade-in">
                <div>
                  <div className="text-[10px] text-slate-400">{isEn ? 'Month:' : 'Bulan:'}</div>
                  <div className="font-bold text-white text-sm">{hoveredMonth.monthFull}</div>
                </div>
                <div>
                  <div className="text-[10px] text-orange-400">{isEn ? 'Fire Hotspots:' : 'Hotspot Karhutla:'}</div>
                  <div className="font-bold text-orange-400 text-sm">
                    {hoveredMonth.fireHotspots} {isEn ? 'Spots' : 'Titik'} ({isEn ? 'Score' : 'Skor'}: {hoveredMonth.fireRiskScore}/100)
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-cyan-400">{isEn ? 'Rainfall & Floods:' : 'Curah Hujan & Banjir:'}</div>
                  <div className="font-bold text-cyan-400 text-sm">
                    {hoveredMonth.rainfallMm} mm • {hoveredMonth.floodIncidents} {isEn ? 'Events' : 'Kejadian'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">{isEn ? 'Dominant Threat:' : 'Ancaman Dominan:'}</div>
                  <div className="font-bold text-white text-sm capitalize">
                    {hoveredMonth.dominantThreat === 'fire' 
                      ? (isEn ? '🔥 Wildfire' : '🔥 Karhutla') 
                      : hoveredMonth.dominantThreat === 'flood' 
                      ? (isEn ? '🌊 Flood' : '🌊 Banjir') 
                      : (isEn ? 'Relatively Safe' : 'Relatif Aman')}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-3 p-2 bg-slate-900/60 border border-slate-800/80 rounded-lg text-[11px] text-slate-400 flex items-center justify-between">
                <span>📍 <strong>{isEn ? 'Current Month: October' : 'Bulan Berjalan: Oktober'}</strong> — {isEn ? 'Late dry season transition into wet monsoon season.' : 'Berada pada masa transisi akhir musim kemarau menuju musim hujan basah.'}</span>
                <span className="text-amber-400 font-semibold">{isEn ? 'Golden Window for Preemptive Mitigation' : 'Waktu Emas Tindakan Mitigasi Dini'}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: 5-YEAR HISTORICAL TREND (2022 - 2026) */}
      {viewMode === 'yearly' && (
        <div className="space-y-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 mb-3 flex items-center justify-between">
              <span>{isEn ? 'Annual Disaster Impact Trajectory (2022 - 2026)' : 'Trajektori Dampak Bencana Tahunan (2022 - 2026)'}</span>
              <span className="text-[11px] text-slate-500">{isEn ? '2023 spike driven by Strong El Niño cycle' : 'Lonjakan 2023 dipengaruhi fenomena iklim El Niño Kuat'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {yearlyTrends.map(yr => {
                const isHovered = hoveredYear?.year === yr.year;
                const isElNino = yr.year === 2023;
                return (
                  <div
                    key={yr.year}
                    onMouseEnter={() => setHoveredYear(yr)}
                    onMouseLeave={() => setHoveredYear(null)}
                    className={`p-3 rounded-xl border transition-all ${
                      isHovered
                        ? 'bg-slate-850 border-blue-500 shadow-lg'
                        : isElNino
                        ? 'bg-orange-950/20 border-orange-800/60'
                        : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                      <span className="font-black text-sm text-white">{yr.year}</span>
                      {isElNino && (
                        <span className="text-[9px] bg-red-950 text-red-300 px-1.5 py-0.5 rounded font-bold uppercase">
                          El Niño
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400">{isEn ? 'Wildfire Burn Area' : 'Luas Karhutla'}</div>
                        <div className="font-bold text-orange-400">{yr.fireHectaresBurned.toLocaleString()} Ha</div>
                        <div className="text-[10px] text-slate-400">({yr.fireHotspotCount} {isEn ? 'Hotspots' : 'Hotspot'})</div>
                      </div>

                      <div className="pt-1 border-t border-slate-800/60">
                        <div className="text-[10px] text-slate-400">{isEn ? 'Flood Events' : 'Kejadian Banjir'}</div>
                        <div className="font-bold text-cyan-400">{yr.floodDisasterCount} {isEn ? 'Events' : 'Kali'}</div>
                        <div className="text-[10px] text-slate-400">{yr.floodAffectedPeople.toLocaleString()} {isEn ? 'Displaced' : 'Pengungsi'}</div>
                      </div>

                      <div className="pt-1 border-t border-slate-800/60">
                        <div className="text-[10px] text-slate-400">{isEn ? 'Estimated Economic Loss' : 'Estimasi Kerugian'}</div>
                        <div className="font-semibold text-slate-300">Rp {yr.economicLossBillionsIDR} {isEn ? 'B' : 'M'}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: SEASONAL EARLY MITIGATION WINDOWS (AKSI DINI) */}
      {viewMode === 'mitigation' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 mb-1">
            {isEn
              ? 'Early action windows are critical 30-60 day periods before peak disaster hazard, where preemptive coordinator action delivers the greatest life-saving impact at lowest cost.'
              : 'Jendela aksi dini adalah periode kritis 30–60 hari sebelum bencana terjadi, di mana tindakan preventif koordinator memberikan dampak penyelamatan tertinggi dengan biaya logistik terendah.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mitigationWindows.map((win, idx) => {
              const isFire = win.threat === 'fire';
              const isActive = win.status === 'active_window';

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border relative overflow-hidden ${
                    isActive
                      ? isFire
                        ? 'bg-orange-950/25 border-orange-500/80 shadow-lg shadow-orange-950/30'
                        : 'bg-cyan-950/25 border-cyan-500/80 shadow-lg shadow-cyan-950/30'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 pb-2 mb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{isFire ? '🔥' : '🌊'}</span>
                      <div>
                        <h4 className="font-bold text-sm text-white">{win.title}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {isEn ? 'Peak Risk Period: ' : 'Puncak Bahaya: '}{win.peakRiskPeriod}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      isActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 animate-pulse' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isActive ? (isEn ? 'Active Window' : 'Jendela Aktif') : (isEn ? 'Upcoming' : 'Mendatang')}
                    </span>
                  </div>

                  <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-xs mb-3">
                    <div className="text-[10px] text-amber-400 font-bold uppercase flex items-center gap-1 mb-0.5">
                      <Clock className="w-3 h-3" /> {isEn ? 'Mandatory Early Action Window:' : 'Periode Wajib Aksi Dini:'}
                    </div>
                    <div className="font-bold text-white text-xs">{win.criticalMitigationWindow}</div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-slate-300 mb-1.5">
                      {isEn ? 'Coordinator Preemptive Action Checklist:' : 'Checklist Aksi Dini Koordinator:'}
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {win.recommendedActions.map((act, i) => (
                        <li key={i} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded border border-slate-800/80">
                          <span className="text-emerald-400 font-bold shrink-0">✓</span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 4: GEMINI AI DEEP NARRATIVE ANALYSIS */}
      {viewMode === 'narrative' && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Loading state */}
          {isGeneratingNarrative && (
            <div className="bg-slate-950/90 border border-blue-500/40 rounded-xl p-8 text-center space-y-3 shadow-xl">
              <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
              <h4 className="font-black text-white text-base">
                {isEn ? 'Gemini 3.8 Flash Analyzing Historical Climatology...' : 'Gemini 3.8 Flash Menganalisis Tren Historis & Siklus Iklim...'}
              </h4>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                {isEn 
                  ? `Synthesizing 12-month precipitation curves, 2023 El Niño anomalies, 5-year economic losses, and volunteer readiness for ${provinceName}.`
                  : `Mengintegrasikan kurva fluktuasi curah hujan 12 bulan, anomali El Niño 2023, data kerugian ekonomi 5 tahun, dan kesiapan operasional relawan untuk menyusun narasi prediktif ${provinceName}.`}
              </p>
            </div>
          )}

          {/* If no report yet and not generating, show CTA */}
          {!narrativeReport && !isGeneratingNarrative && (
            <div className="bg-gradient-to-br from-blue-950/50 via-slate-950 to-slate-900 border border-blue-800/60 rounded-xl p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h4 className="font-black text-white text-base">
                  {isEn ? 'Generate Comprehensive Narrative with Gemini AI' : 'Hasilkan Narasi Komprehensif dengan Gemini AI'}
                </h4>
                <p className="text-xs text-slate-400">
                  {isEn 
                    ? 'Transform raw table metrics and charts into actionable narrative intelligence: El Niño correlations, monsoon danger phases, 6-month predictive risk, and volunteer positioning guidelines.'
                    : 'Ubah data mentah tabel dan grafik historis menjadi narasi taktis: korelasi anomali El Niño, fase bahaya laten monsun, prakiraan risiko 6 bulan ke depan, dan rekomendasi penempatan relawan.'}
                </p>
              </div>
              <button
                onClick={onGenerateNarrative}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-5 rounded-lg transition-all shadow-lg shadow-blue-600/30 inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-blue-200" />
                {isEn ? 'Start AI Narrative Analysis Now' : 'Mulai Analisis Naratif Tren Sekarang'}
              </button>
            </div>
          )}

          {/* Render Narrative Report */}
          {narrativeReport && (
            <div className="space-y-5">
              {/* Executive Headline & Quick Tools */}
              <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border border-blue-500/50 rounded-xl p-5 shadow-xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-blue-900/40">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 font-bold text-[10px] uppercase tracking-wider border border-blue-500/40 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-blue-300" />
                      Gemini 3.8 Flash • Narrative Intelligence
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Audit: {new Date(narrativeReport.generatedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyNarrative}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      {copiedNarrative ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      {copiedNarrative ? (isEn ? 'Narrative Copied!' : 'Narasi Tersalin!') : (isEn ? 'Copy Narrative Text' : 'Salin Teks Narasi')}
                    </button>
                    {onGenerateNarrative && (
                      <button
                        onClick={onGenerateNarrative}
                        disabled={isGeneratingNarrative}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                        title={isEn ? 'Refresh analysis with latest parameters' : 'Perbarui analisis dengan parameter terkini'}
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingNarrative ? 'animate-spin' : ''}`} />
                        {isEn ? 'Reload' : 'Muat Ulang'}
                      </button>
                    )}
                  </div>
                </div>

                <h4 className="text-base font-black text-white leading-snug">
                  "{narrativeReport.executiveHeadline}"
                </h4>
              </div>

              {/* SECTION 1: 5-YEAR TRAJECTORY DEEP DIVE */}
              <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <h5>{isEn ? '5-Year Trend Trajectory (2022–2026) & Empirical Disaster Learnings' : 'Lintasan Tren 5 Tahun (2022–2026) & Pembelajaran Bencana Empiris'}</h5>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line space-y-2">
                  {narrativeReport.trendTrajectoryAnalysis}
                </div>
              </div>

              {/* SECTION 2: 12-MONTH SEASONAL RHYTHM */}
              <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <h5>{isEn ? '12-Month Climatological Rhythm & Latent Hazard Windows' : 'Dinamika Siklus Musiman 12 Bulan & Fase Bahaya Laten'}</h5>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {narrativeReport.seasonalCyclicalDeepDive}
                </div>
              </div>

              {/* SECTION 3: CLIMATE ANOMALIES & CYCLE CORRELATION CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-orange-950/20 p-4 rounded-xl border border-orange-800/60 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-orange-400">
                    <Sun className="w-4 h-4" />
                    <span>{isEn ? 'El Niño Anomalies & Dry Droughts' : 'Anomali El Niño & Kemarau Kering'}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {narrativeReport.climateAnomalyCorrelation.elNinoImpactSummary}
                  </p>
                </div>

                <div className="bg-cyan-950/20 p-4 rounded-xl border border-cyan-800/60 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-cyan-400">
                    <Droplets className="w-4 h-4" />
                    <span>{isEn ? 'La Niña & Wet Monsoon Peaks' : 'La Niña & Puncak Monsun Basah'}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {narrativeReport.climateAnomalyCorrelation.laNinaOrMonsoonRisk}
                  </p>
                </div>

                <div className="bg-indigo-950/20 p-4 rounded-xl border border-indigo-800/60 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-indigo-400">
                    <Compass className="w-4 h-4" />
                    <span>{isEn ? 'Cyclical Recurrence Patterns' : 'Pola Perulangan Berkala'}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {narrativeReport.climateAnomalyCorrelation.recurrencePattern}
                  </p>
                </div>
              </div>

              {/* SECTION 4: 6-MONTH PREDICTIVE FORECAST TIMELINE */}
              <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <h5>{isEn ? '6-Month Preemptive Risk Projections from Climatological Models' : 'Proyeksi Risiko 6 Bulan Ke Depan Berdasarkan Model Historis'}</h5>
                  </div>
                  <span className="text-[11px] text-slate-400">{isEn ? 'Early Action Priority' : 'Fokus Operasi Respons Aksi Dini'}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  {narrativeReport.predictiveRiskForecastNext6Months.map((item, idx) => {
                    const alertBadge = item.preemptiveAlertLevel === 'Awas'
                      ? 'bg-red-950 text-red-400 border-red-800'
                      : item.preemptiveAlertLevel === 'Siaga'
                      ? 'bg-orange-950 text-orange-400 border-orange-800'
                      : 'bg-amber-950 text-amber-400 border-amber-800';

                    return (
                      <div key={idx} className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2">
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                          <span className="font-bold text-slate-300 text-[11px]">{item.period}</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${alertBadge}`}>
                            {item.preemptiveAlertLevel}
                          </span>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 font-semibold">{isEn ? 'Projected Threat:' : 'Proyeksi Ancaman:'}</div>
                          <div className="font-bold text-white text-xs">{item.projectedThreat}</div>
                        </div>
                        <div className="text-slate-300 text-[11px] leading-relaxed pt-1 border-t border-slate-800/60">
                          {item.vulnerabilityForecast}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 5: DATA-DRIVEN ACTION RECOMMENDATIONS */}
              <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h5>{isEn ? 'Data-Driven Preemptive Action Recommendations' : 'Rekomendasi Taktis Koordinator Berbasis Bukti Data Historis'}</h5>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {narrativeReport.dataDrivenActionRecommendations.map((rec, idx) => (
                    <div key={idx} className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-xs space-y-2.5">
                      <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-800">
                        <div className="font-bold text-white text-xs">{rec.title}</div>
                        <span className="text-[10px] text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded font-mono shrink-0">
                          {rec.timing}
                        </span>
                      </div>

                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80 text-[11px] text-amber-300/90 flex items-start gap-1.5">
                        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                        <span><strong>{isEn ? 'Data Evidence: ' : 'Dasar Data: '}</strong>{rec.rationaleFromHistoricalData}</span>
                      </div>

                      <ul className="space-y-1.5 text-slate-300 text-[11px]">
                        {rec.actionItems.map((act, aIdx) => (
                          <li key={aIdx} className="flex items-start gap-1.5">
                            <span className="text-emerald-400 font-bold">✓</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 6: VOLUNTEER & LOGISTICS PRE-POSITIONING */}
              <div className="bg-gradient-to-r from-emerald-950/40 via-slate-950 to-teal-950/40 border border-emerald-800/60 p-4 rounded-xl text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-400 text-xs">
                  <Users className="w-4 h-4" />
                  <h5>{isEn ? 'Preemptive Volunteer & Logistics Pre-positioning Guidelines' : 'Panduan Penempatan Dini (Pre-positioning) Relawan & Logistik Lapangan'}</h5>
                </div>
                <p className="text-slate-200 leading-relaxed text-[11px]">
                  {narrativeReport.volunteerAndLogisticsPrepositioning}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Seasonal Insights Card & AI Narrative Quick Callout */}
      {viewMode !== 'narrative' && (
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold">
              <Sparkles className="w-4 h-4 text-blue-300" />
              <span>{isEn ? `Preemptive Mitigation Guidelines - ${provinceName}:` : `Panduan Mitigasi Dini Wilayah ${provinceName}:`}</span>
            </div>

            <button
              onClick={() => {
                setViewMode('narrative');
                if (!narrativeReport && onGenerateNarrative && !isGeneratingNarrative) {
                  onGenerateNarrative();
                }
              }}
              className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors self-start sm:self-auto"
            >
              <span>{narrativeReport ? (isEn ? 'View Full AI Narrative Analysis' : 'Lihat Analisis Naratif Penuh') : (isEn ? 'Run Gemini AI Narrative Intelligence' : 'Jalankan Analisis Naratif Gemini AI')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-slate-300 leading-relaxed text-[11px]">
            {narrativeReport ? narrativeReport.executiveHeadline : historicalAnalysisNotes}
          </p>
        </div>
      )}
    </div>
  );
};
