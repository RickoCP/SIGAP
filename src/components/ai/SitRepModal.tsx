import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  X, 
  Download, 
  Copy, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  Users, 
  Clock, 
  Building2 
} from 'lucide-react';
import { Disaster, SituationReport } from '../../types/index.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface SitRepModalProps {
  disaster: Disaster;
  onClose: () => void;
}

export const SitRepModal: React.FC<SitRepModalProps> = ({ disaster, onClose }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<SituationReport | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSitRep = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/ai/situation-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ disasterId: disaster.id }),
        });

        if (!res.ok) throw new Error(isEn ? 'Failed to generate situation report' : 'Gagal memuat laporan situasi');
        const data = await res.json();
        setReport(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || (isEn ? 'Error creating SitRep' : 'Terjadi kesalahan saat membuat SitRep'));
      } finally {
        setLoading(false);
      }
    };

    fetchSitRep();
  }, [disaster.id, isEn]);

  const handleCopy = () => {
    if (!report) return;
    const textToCopy = isEn
      ? `OFFICIAL SITUATION REPORT (SITREP - SIGAP)
Incident: ${disaster.titleEn || disaster.title}
Timestamp: ${new Date().toLocaleString('en-US')}
Severity Level: ${disaster.severity.toUpperCase()}
Location: ${disaster.address}

EXECUTIVE SUMMARY:
${report.executiveSummary}

URGENT NEEDS:
${report.urgentNeeds.map((n, i) => `${i + 1}. ${n}`).join('\n')}

OPERATIONAL PRIORITIES (12-24 HOURS):
${report.operationalPriorities.map((p, i) => `${i + 1}. ${p}`).join('\n')}

RECOMMENDED TEAM ALLOCATION:
${report.recommendedTeamAllocations.map(t => `- ${t.role}: ${t.count} responders (${t.urgency})`).join('\n')}

GOVERNMENT LIAISON PROTOCOL (BNPB/BPBD/PMI):
${report.governmentLiaisonNotes}
`
      : `LAPORAN SITUASI RESMI (SITUATION REPORT - SIGAP)
Kejadian: ${disaster.title}
Waktu: ${new Date().toLocaleString('id-ID')} WIB
Tingkat Keparahan: ${disaster.severity.toUpperCase()}
Lokasi: ${disaster.address}

RINGKASAN EKSEKUTIF:
${report.executiveSummary}

KEBUTUHAN MENDESAK:
${report.urgentNeeds.map((n, i) => `${i + 1}. ${n}`).join('\n')}

PRIORITAS OPERASIONAL 12-24 JAM:
${report.operationalPriorities.map((p, i) => `${i + 1}. ${p}`).join('\n')}

ALOKASI REKOMENDASI TIM RELAWAN:
${report.recommendedTeamAllocations.map(t => `- ${t.role}: ${t.count} personel (${t.urgency})`).join('\n')}

CATATAN KOORDINASI PEMERINTAH (BNPB/BPBD/PMI):
${report.governmentLiaisonNotes}
`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {isEn ? 'Official Incident Situation Report (SitRep)' : 'Laporan Situasi Resmi (Situation Report)'}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900/50 text-blue-300 border border-blue-800">
                  AI-Generated SitRep
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEn 
                  ? 'Standardized incident command documentation for multi-agency coordination'
                  : 'Dokumen komando terstandarisasi BNPB & BPBD untuk sinkronisasi posko multi-sektor'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6 text-xs text-slate-300">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              <p className="text-sm font-semibold text-slate-200">
                {isEn ? 'Gemini AI is compiling field telemetry into an official SitRep...' : 'Gemini AI sedang mengompilasi data lapangan menjadi SitRep resmi...'}
              </p>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-300">
              <p>{error}</p>
            </div>
          ) : report ? (
            <>
              {/* Executive Summary */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  {isEn ? 'Executive Situation Summary' : 'Ringkasan Eksekutif Situasi'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {report.executiveSummary}
                </p>
              </div>

              {/* Two columns: Urgent Needs & Operational Priorities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Urgent Needs */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    {isEn ? 'Urgent Priority Needs' : 'Kebutuhan Mendesak'}
                  </h4>
                  <ul className="space-y-1.5">
                    {report.urgentNeeds.map((need, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-200">
                        <span className="text-amber-400 font-bold">·</span>
                        <span>{need}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Operational Priorities */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    {isEn ? 'Operational Priorities (12 - 24 Hours)' : 'Prioritas Operasional (12 - 24 Jam)'}
                  </h4>
                  <ul className="space-y-1.5">
                    {report.operationalPriorities.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-200">
                        <span className="text-blue-400 font-mono font-bold">{idx + 1}.</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Team Allocations */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  {isEn ? 'Recommended Responder Deployments' : 'Rekomendasi Alokasi Tim Relawan'}
                </h4>
                <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-lg overflow-hidden">
                  {report.recommendedTeamAllocations.map((team, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-white">{team.role}</span>
                        <span className="text-slate-400 block text-[11px] mt-0.5 font-mono">
                          {isEn ? `Required: ${team.count} Responders` : `Kebutuhan: ${team.count} Personel`}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          team.urgency.toLowerCase().includes('sangat') || team.urgency.toLowerCase().includes('urgent')
                            ? 'bg-red-950/80 text-red-300 border border-red-800/60'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                        }`}
                      >
                        {team.urgency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Government Liaison Notes */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  {isEn ? 'Inter-Agency Liaison Protocol (BNPB / BPBD / Red Cross)' : 'Protokol Penghubung Pemerintah (BNPB / BPBD / PMI)'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {report.governmentLiaisonNotes}
                </p>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer actions */}
        <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            {isEn ? 'Standard: Indonesia BNPB Emergency Operations' : 'Format: Standar Pusdalops PB Indonesia'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? (isEn ? 'Copied' : 'Tersalin') : (isEn ? 'Copy SitRep' : 'Salin Laporan')}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
            >
              {isEn ? 'Close' : 'Tutup'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
