import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Flame, 
  Waves, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  Copy, 
  Check, 
  Download, 
  Users, 
  Droplets, 
  Wind, 
  Home, 
  Truck, 
  Radio, 
  Activity, 
  RefreshCw 
} from 'lucide-react';
import { RegionalReadiness, ReadinessAIReport, HistoricalTrendAINarrative } from '../../types/index.ts';
import { SEED_REGIONAL_READINESS } from '../../data/seedData.ts';
import { HistoricalDisasterTrends } from './HistoricalDisasterTrends.tsx';
import { getHistoricalDataForRegion } from '../../data/historicalDisasterData.ts';
import { RegionalDisasterHeatmap } from './RegionalDisasterHeatmap.tsx';
import { HeatPoint } from '../../data/historicalHeatmapData.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface RegionalReadinessViewProps {
  onNavigateToMacroMap?: () => void;
}

export const RegionalReadinessView: React.FC<RegionalReadinessViewProps> = ({
  onNavigateToMacroMap
}) => {
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const [readinessList, setReadinessList] = useState<RegionalReadiness[]>(SEED_REGIONAL_READINESS);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('reg-riau');
  const [threatFilter, setThreatFilter] = useState<'all' | 'fire' | 'flood' | 'earthquake' | 'landslide' | 'tsunami' | 'volcano'>('all');
  const [islandFilter, setIslandFilter] = useState<string>('all');
  const [showHeatmapSection, setShowHeatmapSection] = useState<boolean>(true);

  // AI Analysis states
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [aiReport, setAiReport] = useState<ReadinessAIReport | null>(null);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  // Historical Trend Narrative states
  const [isGeneratingNarrative, setIsGeneratingNarrative] = useState<boolean>(false);
  const [historicalNarrative, setHistoricalNarrative] = useState<HistoricalTrendAINarrative | null>(null);

  // Load readiness data from backend API
  useEffect(() => {
    fetch('/api/readiness')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setReadinessList(data);
        }
      })
      .catch(err => console.warn('Using seed readiness data', err));
  }, []);

  const selectedRegion = readinessList.find(r => r.id === selectedProvinceId) || readinessList[0];

  // Filtered list
  const filteredList = readinessList.filter(r => {
    if (islandFilter !== 'all' && r.region !== islandFilter) return false;
    return true;
  });

  // Trigger Gemini AI Readiness Audit
  const handleGenerateAIReport = async () => {
    setIsGeneratingAI(true);
    setAiReport(null);

    try {
      const response = await fetch('/api/ai/readiness-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provinceId: selectedProvinceId,
          focusThreat: threatFilter
        })
      });

      const data = await response.json();
      setAiReport(data);
    } catch (err) {
      console.error('Failed to generate AI report', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Trigger Gemini AI Historical Trend Narrative
  const handleGenerateHistoricalNarrative = async () => {
    setIsGeneratingNarrative(true);
    try {
      const response = await fetch('/api/ai/historical-narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provinceId: selectedProvinceId,
          focusThreat: threatFilter
        })
      });

      const data = await response.json();
      setHistoricalNarrative(data);
    } catch (err) {
      console.error('Failed to generate historical narrative', err);
    } finally {
      setIsGeneratingNarrative(false);
    }
  };

  const handleCopyReport = () => {
    if (!aiReport) return;
    const text = `LAPORAN AUDIT KESIAPAN BENCANA DAERAH SIGAP - ${aiReport.provinceName.toUpperCase()}
Skor Kesiapan: ${aiReport.overallScore}/100
Tanggal Audit: ${new Date(aiReport.generatedAt).toLocaleString('id-ID')}

1. PENILAIAN ANCAMAN:
- Risiko Karhutla: ${aiReport.threatAssessment.karhutlaRisk}
- Risiko Banjir: ${aiReport.threatAssessment.floodRisk}
- Ringkasan: ${aiReport.threatAssessment.summary}

2. KESENJANGAN KRITIS (GAP ANALYSIS):
${aiReport.criticalGaps.map(g => `• ${g}`).join('\n')}

3. PROTOKOL KONTINJENSI 72 JAM PERTAMA:
${aiReport.contingencyProtocol72h.map(p => `[${p.phase}]\nTindakan: ${p.action}\nPenanggung Jawab: ${p.responsibleUnit}`).join('\n\n')}

4. PANDUAN MOBILISASI RELAWAN:
${aiReport.volunteerMobilizationGuidance}

5. PRIORITAS ALOKASI SUMBER DAYA:
${aiReport.resourceAllocationPriorities.map(r => `• ${r}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  // High level aggregated stats
  const avgScore = (readinessList.reduce((acc, r) => acc + r.readinessScore, 0) / readinessList.length).toFixed(1);
  const totalHotspots = readinessList.reduce((acc, r) => acc + r.fireReadiness.activeHotspots, 0);
  const totalFloodPoints = readinessList.reduce((acc, r) => acc + r.floodReadiness.floodPronePoints, 0);
  const criticalCount = readinessList.filter(r => r.status === 'kritis' || r.status === 'waspada').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                {isEn ? 'BNPB / SIGAP Preparedness & Mitigation Analytics Center' : 'Pusat Analitika Mitigasi & Kesiapsiagaan BNPB / SIGAP'}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {isEn ? 'Regional Disaster Readiness & Vulnerability Analysis' : 'Analisa Kesiapan Daerah Menghadapi Bencana'}
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl mt-1">
              {isEn 
                ? 'Comprehensive response capacity audit of 10 high-risk provinces across Indonesia, with intensive focus on Peatland Wildfires (Karhutla) and Critical River Basin Floods.'
                : 'Evaluasi komprehensif kapasitas respon 10 provinsi berisiko tinggi di Indonesia dengan fokus intensif pada Kebakaran Hutan & Lahan Gambut (Karhutla) dan Banjir Luapan DAS Kritis.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHeatmapSection(!showHeatmapSection)}
              className={`text-xs font-bold py-2.5 px-3.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
                showHeatmapSection
                  ? 'bg-red-950/80 text-red-300 border-red-700 shadow-md shadow-red-950/30 ring-1 ring-red-500/50'
                  : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
              }`}
            >
              <span>🔥🌊</span>
              <span>{showHeatmapSection ? (isEn ? 'Hide Heatmap' : 'Sembunyikan Heatmap') : (isEn ? 'Open Heatmap Layer' : 'Buka Lapisan Heatmap')}</span>
            </button>

            {onNavigateToMacroMap && (
              <button
                onClick={onNavigateToMacroMap}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2.5 px-4 rounded-lg border border-slate-700 transition-colors flex items-center gap-2"
              >
                <span>🗺️</span> {isEn ? 'National Disaster Map' : 'Peta Bencana Nasional'}
              </button>
            )}
            <button
              onClick={handleGenerateHistoricalNarrative}
              disabled={isGeneratingNarrative}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold py-2.5 px-3.5 rounded-lg transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
              title={isEn ? 'Generate in-depth narrative analysis based on historical data and disaster trends with Gemini 3.8 Flash' : 'Hasilkan analisis naratif mendalam berdasarkan data historis dan tren siklus bencana dengan Gemini 3.8 Flash'}
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              {isGeneratingNarrative ? (isEn ? 'Analyzing Trends...' : 'Menganalisis Tren...') : (isEn ? 'AI Narrative Trends Analysis' : 'Analisis Naratif Tren AI')}
            </button>

            <button
              onClick={handleGenerateAIReport}
              disabled={isGeneratingAI}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 text-blue-200" />
              {isGeneratingAI ? (isEn ? 'Auditing Readiness...' : 'Mengaudit Kesiapan...') : (isEn ? 'AI Readiness Audit' : 'Audit Kesiapan AI')}
            </button>
          </div>
        </div>

        {/* National Macro Telemetry Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
            <div className="text-xs text-slate-400 uppercase font-bold flex items-center justify-between mb-1">
              <span>{isEn ? 'National Index' : 'Indeks Nasional'}</span>
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white tabular-nums">{avgScore} <span className="text-xs font-normal text-slate-400">/ 100</span></div>
            <div className="text-[11px] text-emerald-400 mt-1 font-medium">
              {isEn ? 'Moderate Preparedness Level' : 'Kategori Kesiapan Cukup'}
            </div>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
            <div className="text-xs text-slate-400 uppercase font-bold flex items-center justify-between mb-1">
              <span>{isEn ? 'Wildfire Hotspots' : 'Hotspot Karhutla'}</span>
              <Flame className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-2xl font-black text-orange-400 tabular-nums">{totalHotspots} <span className="text-xs font-normal text-slate-400">{isEn ? 'Points' : 'Titik'}</span></div>
            <div className="text-[11px] text-amber-400 mt-1 font-medium">
              {isEn ? 'Concentrated in Riau & Central Kalimantan' : 'Terpusat di Riau & Kalteng'}
            </div>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
            <div className="text-xs text-slate-400 uppercase font-bold flex items-center justify-between mb-1">
              <span>{isEn ? 'Flood-Prone Areas' : 'Titik Rawan Banjir'}</span>
              <Waves className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-cyan-400 tabular-nums">{totalFloodPoints} <span className="text-xs font-normal text-slate-400">{isEn ? 'Locations' : 'Lokasi'}</span></div>
            <div className="text-[11px] text-cyan-300 mt-1 font-medium">Pantura, Ciliwung, Bengawan Solo</div>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
            <div className="text-xs text-slate-400 uppercase font-bold flex items-center justify-between mb-1">
              <span>{isEn ? 'Critical / Alert Status' : 'Status Kritis / Waspada'}</span>
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-black text-red-400 tabular-nums">{criticalCount} <span className="text-xs font-normal text-slate-400">{isEn ? 'Provinces' : 'Provinsi'}</span></div>
            <div className="text-[11px] text-red-300 mt-1 font-medium">
              {isEn ? 'Requires Immediate Mobilization' : 'Memerlukan Mobilisasi Bantuan'}
            </div>
          </div>
        </div>

        {/* Threat Mode Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 mt-6 border-t border-slate-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-medium mr-1">
              {language === 'id' ? 'Fokus Audit Bencana:' : 'Audit Hazard Focus:'}
            </span>
            <button
              onClick={() => setThreatFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                threatFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              {language === 'id' ? `Semua Bencana (${readinessList.length})` : `All Hazards (${readinessList.length})`}
            </button>
            <button
              onClick={() => setThreatFilter('fire')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
                threatFilter === 'fire'
                  ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <span>🔥</span> {language === 'id' ? 'Karhutla' : 'Wildfire'}
            </button>
            <button
              onClick={() => setThreatFilter('flood')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
                threatFilter === 'flood'
                  ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <span>🌊</span> {language === 'id' ? 'Banjir' : 'Flood'}
            </button>
            <button
              onClick={() => setThreatFilter('earthquake')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
                threatFilter === 'earthquake'
                  ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <span>🏚️</span> {language === 'id' ? 'Gempa Bumi' : 'Earthquake'}
            </button>
            <button
              onClick={() => setThreatFilter('landslide')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
                threatFilter === 'landslide'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <span>⛰️</span> {language === 'id' ? 'Tanah Longsor' : 'Landslide'}
            </button>
            <button
              onClick={() => setThreatFilter('tsunami')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
                threatFilter === 'tsunami'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <span>🌊</span> Tsunami
            </button>
            <button
              onClick={() => setThreatFilter('volcano')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
                threatFilter === 'volcano'
                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <span>🌋</span> {language === 'id' ? 'Gunung Api' : 'Volcano'}
            </button>
          </div>

          {/* Island Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium mr-1">{t.filterIsland}</span>
            {['all', 'Sumatera', 'Jawa', 'Kalimantan'].map(isl => (
              <button
                key={isl}
                onClick={() => setIslandFilter(isl)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  islandFilter === isl ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isl === 'all' ? (isEn ? 'All' : 'Semua') : isl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* LAPISAN HEATMAP DENSITAS HISTORIS BENCANA NASIONAL (SEMUA BENCANA DAPAT DIPILIH) */}
      {showHeatmapSection && (
        <RegionalDisasterHeatmap
          onSelectHeatPoint={(point) => {
            const matched = readinessList.find(r => 
              r.province.toLowerCase().includes(point.province.toLowerCase()) ||
              point.province.toLowerCase().includes(r.province.toLowerCase())
            );
            if (matched) {
              setSelectedProvinceId(matched.id);
              setAiReport(null);
              setHistoricalNarrative(null);
            }
          }}
        />
      )}

      {/* Main Grid: Region Selector Sidebar + Detailed Regional Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Region Cards List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {isEn ? `Provinces List (${filteredList.length})` : `Daftar Provinsi (${filteredList.length})`}
            </h3>
            <span className="text-[11px] text-slate-400">
              {isEn ? 'Select for detailed audit' : 'Pilih untuk audit detail'}
            </span>
          </div>

          <div className="space-y-2.5 max-h-[780px] overflow-y-auto pr-1">
            {filteredList.map(r => {
              const isSelected = selectedProvinceId === r.id;
              const isFireDominant = r.fireReadiness.riskLevel === 'Ekstrem' || r.fireReadiness.riskLevel === 'Tinggi';
              const isFloodDominant = r.floodReadiness.riskLevel === 'Ekstrem' || r.floodReadiness.riskLevel === 'Tinggi';

              const statusColor = r.status === 'optimal' 
                ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                : r.status === 'siaga'
                ? 'bg-blue-950 text-blue-400 border-blue-800'
                : r.status === 'waspada'
                ? 'bg-amber-950 text-amber-400 border-amber-800'
                : 'bg-red-950 text-red-400 border-red-800';

              return (
                <div
                  key={r.id}
                  onClick={() => {
                    setSelectedProvinceId(r.id);
                    setAiReport(null);
                    setHistoricalNarrative(null);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/30'
                      : 'bg-slate-900 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs text-slate-400 font-medium">{r.region}</span>
                        <span className="text-slate-600">•</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${statusColor}`}>
                          {isEn ? (r.status === 'waspada' ? 'alert' : r.status === 'siaga' ? 'standby' : r.status) : r.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-white">{r.province}</h4>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-black text-white tabular-nums leading-none">
                        {r.readinessScore}
                      </div>
                      <span className="text-[10px] text-slate-400">{isEn ? 'Readiness Score' : 'Skor Kesiapan'}</span>
                    </div>
                  </div>

                  {/* Threat Badges */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-800/80">
                    <div className="flex items-center gap-1 text-slate-300">
                      <Flame className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      <span className="truncate">{isEn ? 'Wildfire:' : 'Karhutla:'} <strong className={isFireDominant ? 'text-orange-400' : 'text-slate-300'}>{r.fireReadiness.riskLevel}</strong></span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-300">
                      <Waves className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{isEn ? 'Flood:' : 'Banjir:'} <strong className={isFloodDominant ? 'text-cyan-400' : 'text-slate-300'}>{r.floodReadiness.riskLevel}</strong></span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2.5 w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        r.readinessScore >= 80 ? 'bg-emerald-500' : r.readinessScore >= 70 ? 'bg-blue-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${r.readinessScore}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Regional Audit Dossier */}
        <div className="lg:col-span-8 space-y-6">
          {/* Province Detail Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {selectedRegion.region} • {isEn ? 'Capital:' : 'Ibukota:'} {selectedRegion.capitalCity}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400">
                    {isEn ? `Population: ${selectedRegion.populationMillions} Million` : `Populasi: ${selectedRegion.populationMillions} Juta Jiwa`}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white">{selectedRegion.province}</h2>
              </div>

              <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {isEn ? 'Regional Readiness Index' : 'Indeks Kesiapan Daerah'}
                  </div>
                  <div className="text-xs text-slate-300">
                    {isEn ? `Last Audit: ${selectedRegion.lastAuditDate}` : `Audit Terakhir: ${selectedRegion.lastAuditDate}`}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-black text-xl text-blue-400 tabular-nums">
                  {selectedRegion.readinessScore}
                </div>
              </div>
            </div>

            {/* DEEP DIVE SECTION 1: KEBAKARAN HUTAN & LAHAN GAMBUT (KARHUTLA) */}
            <div className={`p-4 rounded-xl border transition-all ${
              threatFilter === 'fire' 
                ? 'bg-orange-950/20 border-orange-600/60 shadow-lg shadow-orange-950/30' 
                : 'bg-slate-950/60 border-slate-800'
            }`}>
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-white">
                      {isEn ? 'Wildfire & Peatland Preparedness Audit (Karhutla)' : 'Audit Kesiapsiagaan Kebakaran Hutan & Lahan (Karhutla)'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {isEn 
                        ? 'Threat potential of dry peatlands, canal blocking efficiency, and haze dispersion mitigation' 
                        : 'Potensi ancaman lahan gambut kering, sekat kanal, dan mitigasi kabut asap'}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-black px-2.5 py-1 rounded uppercase tracking-wider ${
                  selectedRegion.fireReadiness.riskLevel === 'Ekstrem' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-orange-950 text-orange-400 border border-orange-800'
                }`}>
                  {isEn ? `Risk: ${selectedRegion.fireReadiness.riskLevel === 'Ekstrem' ? 'Extreme' : selectedRegion.fireReadiness.riskLevel === 'Tinggi' ? 'High' : selectedRegion.fireReadiness.riskLevel}` : `Risiko ${selectedRegion.fireReadiness.riskLevel}`}
                </span>
              </div>

              {/* Fire Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {isEn ? 'Active Hotspots' : 'Titik Hotspot Aktif'}
                  </div>
                  <div className="text-base font-black text-orange-400 tabular-nums">
                    {selectedRegion.fireReadiness.activeHotspots} <span className="text-[10px] font-normal text-slate-400">{isEn ? 'Points' : 'Titik'}</span>
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {isEn ? 'Critical Peatland' : 'Lahan Gambut Kritis'}
                  </div>
                  <div className="text-base font-black text-white tabular-nums">
                    {(selectedRegion.fireReadiness.peatlandAreaHa / 1000).toLocaleString()} <span className="text-[10px] font-normal text-slate-400">{isEn ? 'Thousand Ha' : 'Ribu Ha'}</span>
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {isEn ? 'Firefighting Volunteers' : 'Relawan MPA & Damkar'}
                  </div>
                  <div className="text-base font-black text-emerald-400 tabular-nums">
                    {selectedRegion.fireReadiness.firefightingVolunteers.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">{isEn ? 'Personnel' : 'Personel'}</span>
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {isEn ? 'Canal Blocks Built' : 'Sekat Kanal Aktif'}
                  </div>
                  <div className="text-base font-black text-blue-400 tabular-nums">
                    {selectedRegion.fireReadiness.canalBlocksBuilt.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">{isEn ? 'Units' : 'Unit'}</span>
                  </div>
                </div>
              </div>

              {/* Early Warning Status Banner */}
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-xs flex items-center gap-2">
                <Radio className="w-4 h-4 text-orange-400 shrink-0" />
                <span className="text-slate-300">
                  {isEn ? 'Wildfire Warning Status:' : 'Status Peringatan Karhutla:'} <strong className="text-orange-300">{selectedRegion.fireReadiness.earlyWarningStatus}</strong>
                </span>
              </div>
            </div>

            {/* DEEP DIVE SECTION 2: BANJIR & LUAPAN AIR */}
            <div className={`p-4 rounded-xl border transition-all ${
              threatFilter === 'flood' 
                ? 'bg-cyan-950/20 border-cyan-600/60 shadow-lg shadow-cyan-950/30' 
                : 'bg-slate-950/60 border-slate-800'
            }`}>
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <Waves className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-white">
                      {isEn ? 'River Basin Flood Preparedness & Inundation Audit' : 'Audit Kesiapsiagaan Banjir & Luapan Daerah Aliran Sungai (DAS)'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {isEn 
                        ? 'Polder drainage capacity, rubber inflatable boats (LCR), and river overflow early detection'
                        : 'Kapasitas drainase polder, perahu evakuasi LCR, dan sistem deteksi dini luapan'}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-black px-2.5 py-1 rounded uppercase tracking-wider ${
                  selectedRegion.floodReadiness.riskLevel === 'Ekstrem' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                }`}>
                  {isEn ? `Risk: ${selectedRegion.floodReadiness.riskLevel === 'Ekstrem' ? 'Extreme' : selectedRegion.floodReadiness.riskLevel === 'Tinggi' ? 'High' : selectedRegion.floodReadiness.riskLevel}` : `Risiko ${selectedRegion.floodReadiness.riskLevel}`}
                </span>
              </div>

              {/* Flood Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {isEn ? 'Flood-Prone Hotspots' : 'Titik Rawan Genangan'}
                  </div>
                  <div className="text-base font-black text-cyan-400 tabular-nums">
                    {selectedRegion.floodReadiness.floodPronePoints} <span className="text-[10px] font-normal text-slate-400">{isEn ? 'Points' : 'Titik'}</span>
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {isEn ? 'Polder Pump Capacity' : 'Kapasitas Pompa Polder'}
                  </div>
                  <div className="text-base font-black text-white tabular-nums">
                    {selectedRegion.floodReadiness.drainagePumpCapacityM3s} <span className="text-[10px] font-normal text-slate-400">m³/s</span>
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {isEn ? 'Rubber Inflatable Boats' : 'Armada Perahu Karet (LCR)'}
                  </div>
                  <div className="text-base font-black text-blue-400 tabular-nums">
                    {selectedRegion.floodReadiness.rubberBoatsAvailable} <span className="text-[10px] font-normal text-slate-400">{isEn ? 'Units' : 'Unit'}</span>
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {isEn ? 'Water Rescue SAR Volunteers' : 'Relawan SAR Water Rescue'}
                  </div>
                  <div className="text-base font-black text-emerald-400 tabular-nums">
                    {selectedRegion.floodReadiness.waterRescueVolunteers.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">{isEn ? 'Personnel' : 'Personel'}</span>
                  </div>
                </div>
              </div>

              {/* Early Warning Status Banner */}
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-xs flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-slate-300">
                  {isEn ? 'Flood Warning Status:' : 'Status Peringatan Banjir:'} <strong className="text-cyan-300">{selectedRegion.floodReadiness.earlyWarningStatus}</strong>
                </span>
              </div>
            </div>

            {/* DEEP DIVE SECTION 3: GEMPA BUMI & STRUKTUR BANGUNAN */}
            <div className={`p-4 rounded-xl border transition-all ${
              threatFilter === 'earthquake' 
                ? 'bg-amber-950/20 border-amber-600/60 shadow-lg shadow-amber-950/30' 
                : 'bg-slate-950/60 border-slate-800'
            }`}>
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                    🏚️
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-white">
                      {isEn ? 'Earthquake & Active Fault Seismic Vulnerability Audit' : 'Audit Kesiapsiagaan Gempa Bumi & Kerentanan Sesar Aktif'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {isEn 
                        ? 'BMKG seismic sensors, structural collapse USAR squads, and quake-resistant shelters'
                        : 'Sensor seismik BMKG, regu Urban SAR reruntuhan gedung, & tempat evakuasi tahan gempa'}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-black px-2.5 py-1 rounded uppercase tracking-wider ${
                  (selectedRegion.earthquakeReadiness?.riskLevel || 'Sedang') === 'Ekstrem' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  {isEn ? `Risk: ${selectedRegion.earthquakeReadiness?.riskLevel || 'Medium'}` : `Risiko ${selectedRegion.earthquakeReadiness?.riskLevel || 'Sedang'}`}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {isEn ? 'Active Seismic Sensors' : 'Sensor Seismik Aktif'}
                  </div>
                  <div className="text-base font-black text-amber-400 tabular-nums">
                    {selectedRegion.earthquakeReadiness?.seismicSensors || 12} <span className="text-[10px] font-normal text-slate-400">{isEn ? 'Stations' : 'Stasiun'}</span>
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {isEn ? 'Collapse USAR Teams' : 'Tim USAR Reruntuhan'}
                  </div>
                  <div className="text-base font-black text-white tabular-nums">
                    {selectedRegion.earthquakeReadiness?.usarCollapseTeams || 6} <span className="text-[10px] font-normal text-slate-400">{isEn ? 'Specialist Squads' : 'Regu Spesialis'}</span>
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {isEn ? 'Quake-Safe Shelters' : 'Shelter Ramah Gempa'}
                  </div>
                  <div className="text-base font-black text-emerald-400 tabular-nums">
                    {selectedRegion.earthquakeReadiness?.earthquakeResistantShelters || 28} <span className="text-[10px] font-normal text-slate-400">{isEn ? 'Locations' : 'Lokasi'}</span>
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {isEn ? 'Active Fault Zone' : 'Indeks Sesar Aktif'}
                  </div>
                  <div className="text-xs font-bold text-slate-300 truncate">
                    {selectedRegion.earthquakeReadiness?.activeFaults?.[0] || (isEn ? 'Regional Fault' : 'Sesar Regional')}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-xs flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-300">
                  {isEn ? 'Earthquake Warning Status:' : 'Status Peringatan Gempa:'} <strong className="text-amber-300">{selectedRegion.earthquakeReadiness?.earlyWarningStatus || (isEn ? 'Normal Seismicity Monitoring' : 'Monitoring Seismisitas Normal')}</strong>
                </span>
              </div>
            </div>

            {/* DEEP DIVE SECTION 4: TANAH LONGSOR & KESTABILAN LERENG */}
            <div className={`p-4 rounded-xl border transition-all ${
              threatFilter === 'landslide' 
                ? 'bg-emerald-950/20 border-emerald-600/60 shadow-lg shadow-emerald-950/30' 
                : 'bg-slate-950/60 border-slate-800'
            }`}>
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                    ⛰️
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-white">
                      {isEn ? 'Landslide & Slope Stability Preparedness Audit' : 'Audit Kesiapsiagaan Tanah Longsor & Pergerakan Tanah'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {isEn 
                        ? 'Critical slope extensometers, standby heavy equipment excavators, and cliff mitigation'
                        : 'Sensor ekstensometer lereng rawan, alat berat ekskavator siaga, & mitigasi tebing'}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-black px-2.5 py-1 rounded uppercase tracking-wider ${
                  (selectedRegion.landslideReadiness?.riskLevel || 'Sedang') === 'Ekstrem' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}>
                  {isEn ? `Risk: ${selectedRegion.landslideReadiness?.riskLevel || 'Medium'}` : `Risiko ${selectedRegion.landslideReadiness?.riskLevel || 'Sedang'}`}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {isEn ? 'High-Risk Slopes' : 'Lereng Rawan Kritis'}
                  </div>
                  <div className="text-base font-black text-emerald-400 tabular-nums">
                    {selectedRegion.landslideReadiness?.highRiskSlopes || 24} <span className="text-[10px] font-normal text-slate-400">{isEn ? 'Points' : 'Titik'}</span>
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {isEn ? 'Extensometer EWS Sensors' : 'Sensor Ekstensometer EWS'}
                  </div>
                  <div className="text-base font-black text-white tabular-nums">
                    {selectedRegion.landslideReadiness?.extensometersInstalled || 10} <span className="text-[10px] font-normal text-slate-400">{isEn ? 'Units' : 'Unit'}</span>
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {isEn ? 'Standby Excavators' : 'Ekskavator Siaga Jalur'}
                  </div>
                  <div className="text-base font-black text-blue-400 tabular-nums">
                    {selectedRegion.landslideReadiness?.heavyEquipmentExcavators || 15} <span className="text-[10px] font-normal text-slate-400">{isEn ? 'Units' : 'Unit'}</span>
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {isEn ? 'Rapid Slope Response Team' : 'Tim Reaksi Cepat Lereng'}
                  </div>
                  <div className="text-base font-black text-emerald-400 tabular-nums">
                    480 <span className="text-[10px] font-normal text-slate-400">{isEn ? 'Personnel' : 'Personel'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-xs flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300">
                  {isEn ? 'Landslide Warning Status:' : 'Status Peringatan Longsor:'} <strong className="text-emerald-300">{selectedRegion.landslideReadiness?.earlyWarningStatus || (isEn ? 'High Rainfall Alert on Steep Slopes' : 'Waspada Curah Hujan di Lereng Terjal')}</strong>
                </span>
              </div>
            </div>

            {/* DEEP DIVE SECTION 5: TSUNAMI & GELOMBANG PASANG EKSTREM */}
            <div className={`p-4 rounded-xl border transition-all ${
              threatFilter === 'tsunami' 
                ? 'bg-indigo-950/20 border-indigo-600/60 shadow-lg shadow-indigo-950/30' 
                : 'bg-slate-950/60 border-slate-800'
            }`}>
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold">
                    🌊
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-white">
                      {isEn ? 'Tsunami & Coastal Vulnerability Preparedness Audit' : 'Audit Kesiapsiagaan Tsunami & Mitigasi Garis Pantai'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {isEn 
                        ? 'Coastal EWS sirens, vertical evacuation route signs, and elevated emergency shelters'
                        : 'Sirene EWS pesisir, jalur rambu evakuasi vertikal, dan shelter panggung darurat'}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-black px-2.5 py-1 rounded uppercase tracking-wider ${
                  (selectedRegion.tsunamiReadiness?.riskLevel || 'Rendah') === 'Ekstrem' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                }`}>
                  {isEn ? `Risk: ${selectedRegion.tsunamiReadiness?.riskLevel || 'Medium'}` : `Risiko ${selectedRegion.tsunamiReadiness?.riskLevel || 'Sedang'}`}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {isEn ? 'Coastal EWS Sirens' : 'Sirene EWS Pesisir'}
                  </div>
                  <div className="text-base font-black text-indigo-400 tabular-nums">
                    {selectedRegion.tsunamiReadiness?.coastalSirensCount || 6} <span className="text-[10px] font-normal text-slate-400">{isEn ? 'Towers' : 'Menara'}</span>
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {isEn ? 'Evacuation Route Signs' : 'Jalur Rambu Evakuasi'}
                  </div>
                  <div className="text-base font-black text-white tabular-nums">
                    {selectedRegion.tsunamiReadiness?.tsunamiEvacuationRoutes || 20} <span className="text-[10px] font-normal text-slate-400">{isEn ? 'Routes' : 'Rute'}</span>
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {isEn ? 'Vertical Evacuation Buildings' : 'Gedung Evakuasi Vertikal'}
                  </div>
                  <div className="text-base font-black text-emerald-400 tabular-nums">
                    {selectedRegion.tsunamiReadiness?.coastalShelterBuildings || 14} <span className="text-[10px] font-normal text-slate-400">{isEn ? 'Buildings' : 'Gedung'}</span>
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {isEn ? 'Standard EWS Alert Time' : 'Waktu EWS Standar'}
                  </div>
                  <div className="text-base font-black text-amber-400 tabular-nums">
                    &lt; 3 <span className="text-[10px] font-normal text-slate-400">{isEn ? 'Mins BMKG' : 'Menit BMKG'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-xs flex items-center gap-2">
                <Radio className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-slate-300">
                  {isEn ? 'Tsunami Warning Status:' : 'Status Peringatan Tsunami:'} <strong className="text-indigo-300">{selectedRegion.tsunamiReadiness?.earlyWarningStatus || (isEn ? 'Normal (No Tsunami Warning)' : 'Normal (Tidak Ada Peringatan Tsunami)')}</strong>
                </span>
              </div>
            </div>

            {/* DEEP DIVE SECTION 6: GUNUNG API & HUJAN ABU VULKANIK */}
            <div className={`p-4 rounded-xl border transition-all ${
              threatFilter === 'volcano' 
                ? 'bg-rose-950/20 border-rose-600/60 shadow-lg shadow-rose-950/30' 
                : 'bg-slate-950/60 border-slate-800'
            }`}>
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-bold">
                    🌋
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-white">
                      {isEn ? 'Volcanic Activity & Ashfall Preparedness Audit' : 'Audit Kesiapsiagaan Aktivitas Vulkanik & Erupsi Gunung Api'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {isEn 
                        ? 'Hazard zones radius (KRB), respiratory ashfall mask stocks, and cold lahar diversion routes'
                        : 'Zona KRB radius bahaya, stok masker respirator abu, & rute evakuasi lahar dingin'}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-black px-2.5 py-1 rounded uppercase tracking-wider ${
                  (selectedRegion.volcanicReadiness?.riskLevel || 'Sedang') === 'Ekstrem' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}>
                  {isEn ? `Risk: ${selectedRegion.volcanicReadiness?.riskLevel || 'Medium'}` : `Risiko ${selectedRegion.volcanicReadiness?.riskLevel || 'Sedang'}`}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {isEn ? 'Active Volcanoes' : 'Gunung Api Aktif'}
                  </div>
                  <div className="text-xs font-bold text-rose-300 truncate">
                    {selectedRegion.volcanicReadiness?.activeVolcanoes?.join(', ') || (isEn ? 'N/A (Eruption Free)' : 'N/A (Bebas Erupsi)')}
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {isEn ? 'Hazard Zone Radius (KRB)' : 'Radius Zona Bahaya (KRB)'}
                  </div>
                  <div className="text-base font-black text-white tabular-nums">
                    {selectedRegion.volcanicReadiness?.hazardZonesRadiusKm || 5} <span className="text-[10px] font-normal text-slate-400">Km</span>
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {isEn ? 'Respirator Mask Stock' : 'Stok Masker Respirator'}
                  </div>
                  <div className="text-base font-black text-emerald-400 tabular-nums">
                    {((selectedRegion.volcanicReadiness?.ashfallProtectionMasksStock || 150000) / 1000).toLocaleString()} <span className="text-[10px] font-normal text-slate-400">{isEn ? 'Thousand Pcs' : 'Ribu Pcs'}</span>
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {isEn ? 'Cold Lahar Sabo Dam EWS' : 'EWS Lahar Hujan Sabo Dam'}
                  </div>
                  <div className="text-base font-black text-blue-400 tabular-nums">
                    18 <span className="text-[10px] font-normal text-slate-400">{isEn ? 'Sensors' : 'Sensor Alur'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-xs flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="text-slate-300">
                  {isEn ? 'PVMBG Volcanic Status:' : 'Status Aktivitas Vulkanik PVMBG:'} <strong className="text-rose-300">{selectedRegion.volcanicReadiness?.earlyWarningStatus || (isEn ? 'Normal Level I Status' : 'Status Normal Level I')}</strong>
                </span>
              </div>
            </div>

            {/* LOGISTICS & SUPPLIES CAPABILITY */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-400" />
                {isEn ? `Logistics & Emergency Field Kitchen Capacity - ${selectedRegion.province}` : `Kapasitas Logistik & Dapur Darurat ${selectedRegion.province}`}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">
                    {isEn ? 'Platoon Emergency Tents' : 'Tenda Pleton BNPB'}
                  </div>
                  <div className="text-base font-bold text-white tabular-nums">
                    {selectedRegion.logisticsCapacity.emergencyTents} <span className="text-[10px] text-slate-400">{isEn ? 'Units' : 'Unit'}</span>
                  </div>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">
                    {isEn ? 'Emergency Generators' : 'Genset Darurat'}
                  </div>
                  <div className="text-base font-bold text-white tabular-nums">
                    {selectedRegion.logisticsCapacity.generators} <span className="text-[10px] text-slate-400">{isEn ? 'Units' : 'Unit'}</span>
                  </div>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">
                    {isEn ? 'Hygiene Kits Reserve' : 'Hygiene Kit Cadangan'}
                  </div>
                  <div className="text-base font-bold text-white tabular-nums">
                    {selectedRegion.logisticsCapacity.hygieneKits.toLocaleString()} <span className="text-[10px] text-slate-400">{isEn ? 'Packs' : 'Paket'}</span>
                  </div>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">
                    {isEn ? 'Mass Field Kitchen' : 'Dapur Umum Massal'}
                  </div>
                  <div className="text-base font-bold text-emerald-400 tabular-nums">
                    {selectedRegion.logisticsCapacity.fieldKitchenCapacityMealsPerDay.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">{isEn ? 'meals/day' : 'porsi/hari'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* VISUALISASI DATA HISTORIS BENCANA & TREN MITIGASI DINI DENGAN ANALISIS NARATIF GEMINI AI */}
            <HistoricalDisasterTrends
              provinceId={selectedRegion.id}
              provinceName={selectedRegion.province}
              historicalData={
                selectedRegion.historicalData || 
                getHistoricalDataForRegion(
                  selectedRegion.id, 
                  selectedRegion.province, 
                  selectedRegion.fireReadiness.riskLevel === 'Ekstrem' || selectedRegion.fireReadiness.riskLevel === 'Tinggi'
                )
              }
              narrativeReport={historicalNarrative}
              onGenerateNarrative={handleGenerateHistoricalNarrative}
              isGeneratingNarrative={isGeneratingNarrative}
            />

            {/* KEY VULNERABILITIES & MITIGATION RECOMMENDATIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/70 p-4 rounded-xl border border-red-950/60">
                <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {isEn ? 'Critical Vulnerabilities & Weak Points:' : 'Titik Rentan & Kelemahan Kritis:'}
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {((isEn && selectedRegion.keyVulnerabilitiesEn && selectedRegion.keyVulnerabilitiesEn.length > 0)
                    ? selectedRegion.keyVulnerabilitiesEn
                    : selectedRegion.keyVulnerabilities
                  ).map((vuln, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>{vuln}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-blue-950/60">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isEn ? 'Strategic Mitigation Recommendations 2026:' : 'Rekomendasi Strategis Mitigasi 2026:'}
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {((isEn && selectedRegion.strategicRecommendationsEn && selectedRegion.strategicRecommendationsEn.length > 0)
                    ? selectedRegion.strategicRecommendationsEn
                    : selectedRegion.strategicRecommendations
                  ).map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* AI-POWERED AUDIT REPORT ACCORDION / CONTAINER */}
          {isGeneratingAI && (
            <div className="bg-slate-900 border border-blue-500/40 rounded-xl p-8 text-center space-y-3 shadow-2xl">
              <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
              <h3 className="font-black text-lg text-white">
                {isEn ? 'Running Gemini AI Strategic Analysis...' : 'Menjalankan Analisis Cerdas Gemini AI...'}
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {isEn 
                  ? `Gemini 3.8 Flash is auditing vulnerabilities for ${selectedRegion.province}, simulating peat fire propagation and flash flood scenarios, and preparing a 72-hour contingency protocol.`
                  : `Model Gemini 3.8 Flash sedang mengaudit kerentanan wilayah ${selectedRegion.province}, mensimulasikan skenario penyebaran api gambut dan banjir bandang, serta menyusun protokol kontinjensi 72 jam.`}
              </p>
            </div>
          )}

          {aiReport && (
            <div className="bg-slate-900 border border-blue-500/60 rounded-xl p-6 shadow-2xl space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-white">
                      {isEn ? `Gemini AI Readiness Audit Result - ${aiReport.provinceName}` : `Hasil Audit Kesiapan AI Gemini - ${aiReport.provinceName}`}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {isEn 
                        ? `Intelligently generated by Gemini 3.8 Flash on ${new Date(aiReport.generatedAt).toLocaleString('en-US')}`
                        : `Dihasilkan secara cerdas oleh Gemini 3.8 Flash pada ${new Date(aiReport.generatedAt).toLocaleString('id-ID')}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyReport}
                    className="bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    {copiedReport ? (isEn ? 'Copied!' : 'Tersalin!') : (isEn ? 'Copy Report' : 'Salin Laporan')}
                  </button>
                </div>
              </div>

              {/* Threat Summary Box */}
              <div className="bg-blue-950/30 border border-blue-800/60 p-4 rounded-xl text-xs space-y-2">
                <div className="font-bold text-blue-300 uppercase tracking-wider text-[11px]">
                  {isEn ? 'Executive Threat Summary:' : 'Ringkasan Eksekutif Ancaman:'}
                </div>
                <p className="text-slate-200 leading-relaxed">{aiReport.threatAssessment.summary}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-blue-900/40 text-[11px]">
                  <div>🔥 <strong>{isEn ? 'Wildfire:' : 'Karhutla:'}</strong> {aiReport.threatAssessment.karhutlaRisk}</div>
                  <div>🌊 <strong>{isEn ? 'River Basin Flood:' : 'Banjir:'}</strong> {aiReport.threatAssessment.floodRisk}</div>
                </div>
              </div>

              {/* 72-Hour Contingency Protocol */}
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-400" />
                  {isEn ? 'First 72-Hour Disaster Response Contingency Protocol' : 'Protokol Kontinjensi 72 Jam Pertama Penanggulangan Bencana'}
                </h4>
                <div className="space-y-3">
                  {aiReport.contingencyProtocol72h.map((phase, idx) => (
                    <div key={idx} className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-blue-400 font-bold">
                        <span>{phase.phase}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {isEn ? 'Responsible Unit:' : 'Pelaksana:'} <strong className="text-slate-300">{phase.responsibleUnit}</strong>
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{phase.action}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Volunteer Mobilization Guidance */}
              <div className="bg-emerald-950/20 border border-emerald-800/60 p-4 rounded-xl text-xs space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {isEn ? 'SIGAP Volunteer Corps Mobilization Guidance' : 'Instruksi Mobilisasi Korps Relawan SIGAP'}
                </h4>
                <p className="text-slate-300 leading-relaxed">{aiReport.volunteerMobilizationGuidance}</p>
              </div>

              {/* Priority Allocations */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  {isEn ? 'Emergency Resource Allocation Priorities:' : 'Prioritas Alokasi Sumber Daya Darurat:'}
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {aiReport.resourceAllocationPriorities.map((item, idx) => (
                    <li key={idx} className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2">
                      <span className="text-blue-400 font-bold shrink-0">#{idx + 1}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
