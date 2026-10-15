import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Award, 
  Clock, 
  AlertCircle,
  RefreshCw,
  Zap
} from 'lucide-react';
import { Disaster, Task, AIRecommendation } from '../../types/index.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface AIMatchingModalProps {
  disaster: Disaster;
  task: Task;
  onAssignVolunteer: (taskId: string, volunteerId: string, score: number, reason: string) => Promise<void>;
  onClose: () => void;
}

export const AIMatchingModal: React.FC<AIMatchingModalProps> = ({
  disaster,
  task,
  onAssignVolunteer,
  onClose,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [engineUsed, setEngineUsed] = useState<string>('');
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [assignedIds, setAssignedIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disasterId: disaster.id,
          taskId: task.id,
        }),
      });

      if (!res.ok) {
        throw new Error(isEn ? 'Failed to fetch AI recommendations' : 'Gagal mendapatkan rekomendasi AI');
      }

      const data = await res.json();
      setRecommendations(data.recommendations || []);
      setEngineUsed(data.engine || 'gemini-3.8-flash');
    } catch (err: any) {
      console.error(err);
      setError(err.message || (isEn ? 'An error occurred' : 'Terjadi kesalahan'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [disaster.id, task.id]);

  const handleAssign = async (rec: AIRecommendation) => {
    setAssigningId(rec.volunteerId);
    try {
      await onAssignVolunteer(task.id, rec.volunteerId, rec.score, rec.reasoning);
      setAssignedIds(prev => [...prev, rec.volunteerId]);
    } catch (err) {
      console.error(err);
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/60 p-5 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {isEn ? 'AI Volunteer Matching Engine (Gemini AI)' : 'Pencocokan Cerdas Relawan (Gemini AI)'}
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-900/50 text-blue-300 border border-blue-800">
                  {engineUsed || 'Gemini 3.8 Flash'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEn 
                  ? 'Multi-factor algorithmic weighting: Skills (40%), Proximity (30%), Readiness (20%), Experience (10%)'
                  : 'Evaluasi algoritma multi-faktor: Keahlian (40%), Jarak (30%), Kesiapan (20%), Pengalaman (10%)'}
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

        {/* Target Task Brief */}
        <div className="bg-slate-950/60 px-5 py-3 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-slate-400">{isEn ? 'Target Mission:' : 'Tugas Sasaran:'}</span>{' '}
            <span className="font-semibold text-white">{task.title}</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300 font-mono tabular-nums">
            <span>
              {isEn ? 'Required Skill: ' : 'Kebutuhan: '}
              <strong className="text-blue-400">{task.requiredSkillName}</strong>
            </span>
            <span>
              {isEn ? 'Quota: ' : 'Kebutuhan Kuota: '}
              <strong className="text-white">
                {task.volunteersAssigned}/{task.volunteersNeeded} {isEn ? 'Responders' : 'Relawan'}
              </strong>
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-200">
                  {isEn ? 'Gemini AI is analyzing 50 certified responder candidates...' : 'Gemini AI sedang menganalisis 50 kandidat relawan...'}
                </p>
                <p className="text-xs text-slate-400 max-w-md">
                  {isEn 
                    ? `Computing Haversine distance, aligning competencies with ${task.requiredSkillName}, and checking mission experience.`
                    : `Menghitung jarak tempuh Haversine, mencocokkan keahlian dengan kebutuhan ${task.requiredSkillName}, dan memeriksa riwayat misi sebelumnya.`}
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="py-8 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
              <p className="text-sm text-red-300">{error}</p>
              <button
                onClick={fetchRecommendations}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {isEn ? 'Try Again' : 'Coba Lagi'}
              </button>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              {isEn ? 'No matching responders found within range of this task.' : 'Tidak ditemukan relawan yang cocok dalam jangkauan tugas ini.'}
            </div>
          ) : (
            recommendations.map((rec, index) => {
              const isAssigned = assignedIds.includes(rec.volunteerId);
              const isCurrentAssigning = assigningId === rec.volunteerId;
              const scorePercent = Math.round(rec.score * 100);

              return (
                <div
                  key={rec.volunteerId}
                  className={`p-4 rounded-xl border transition-all ${
                    index === 0
                      ? 'bg-blue-950/20 border-blue-600/50 shadow-md shadow-blue-950/50'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-300 shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{rec.volunteerName}</h4>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              rec.status === 'available'
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                                : 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                            }`}
                          >
                            {rec.status === 'available' 
                              ? (isEn ? 'Ready' : 'Siaga') 
                              : (isEn ? 'Busy' : 'Sibuk')}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-400 font-mono tabular-nums">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            {rec.distanceKm.toFixed(1)} km {isEn ? 'from scene' : 'dari lokasi'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-500" />
                            {rec.phone}
                          </span>
                          <span className="flex items-center gap-1 text-blue-300">
                            <Award className="w-3 h-3 text-blue-400" />
                            {rec.primarySkill}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Score badge & Action button */}
                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      <div className="text-right">
                        <div className="flex items-baseline justify-end gap-1">
                          <span className="text-base font-extrabold font-mono tabular-nums text-blue-400">
                            {scorePercent}%
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {isEn ? 'Match' : 'Kecocokan'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                          {scorePercent >= 90 
                            ? (isEn ? 'Prime Match' : 'Sangat Optimal') 
                            : scorePercent >= 75 
                            ? (isEn ? 'Optimal' : 'Optimal') 
                            : (isEn ? 'Adequate' : 'Memadai')}
                        </span>
                      </div>

                      <button
                        disabled={isAssigned || isCurrentAssigning}
                        onClick={() => handleAssign(rec)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                          isAssigned
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/80 cursor-default'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-600/30'
                        }`}
                      >
                        {isAssigned ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {isEn ? 'Assigned' : 'Ditugaskan'}
                          </>
                        ) : isCurrentAssigning ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {isEn ? 'Processing...' : 'Memproses...'}
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5" />
                            {isEn ? 'Dispatch' : 'Tugaskan'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Reasoning Prose */}
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-xs text-slate-300/90 leading-relaxed bg-slate-900/40 p-2 rounded-lg">
                    <strong className="text-blue-300 font-medium">{isEn ? 'AI Rationale: ' : 'Analisis AI: '}</strong>
                    {rec.reasoning}
                  </div>

                  {/* Factor Breakdown Bars */}
                  {rec.matchedCriteria && (
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-400 font-mono">
                      <div>
                        <div className="flex justify-between mb-0.5">
                          <span>{isEn ? 'Skill (40%)' : 'Keahlian (40%)'}</span>
                          <span>{Math.round(rec.matchedCriteria.skillsMatch * 100)}%</span>
                        </div>
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${rec.matchedCriteria.skillsMatch * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-0.5">
                          <span>{isEn ? 'Proximity (30%)' : 'Jarak (30%)'}</span>
                          <span>{Math.round(rec.matchedCriteria.proximity * 100)}%</span>
                        </div>
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500"
                            style={{ width: `${rec.matchedCriteria.proximity * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-0.5">
                          <span>{isEn ? 'Readiness (20%)' : 'Kesiapan (20%)'}</span>
                          <span>{Math.round(rec.matchedCriteria.availability * 100)}%</span>
                        </div>
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500"
                            style={{ width: `${rec.matchedCriteria.availability * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-0.5">
                          <span>{isEn ? 'Experience (10%)' : 'Pengalaman (10%)'}</span>
                          <span>{Math.round(rec.matchedCriteria.experience * 100)}%</span>
                        </div>
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500"
                            style={{ width: `${rec.matchedCriteria.experience * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">
            {isEn 
              ? 'Dispatching instantly updates responder status to Deployed and pushes push notifications.'
              : "Penugasan langsung mengupdate status relawan menjadi 'Sedang Bertugas' dan mengirimkan notifikasi."}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            {isEn ? 'Done' : 'Selesai'}
          </button>
        </div>
      </div>
    </div>
  );
};
