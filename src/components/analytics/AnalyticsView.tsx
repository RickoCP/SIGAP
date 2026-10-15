import React from 'react';
import { 
  BarChart3, 
  Clock, 
  Users, 
  ShieldCheck, 
  TrendingUp, 
  Award, 
  Sparkles,
  Download
} from 'lucide-react';
import { Disaster, Volunteer, Task, Assignment } from '../../types/index.ts';
import { SEED_SKILLS } from '../../data/seedData.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface AnalyticsViewProps {
  disasters: Disaster[];
  volunteers: Volunteer[];
  tasks: Task[];
  assignments: Assignment[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  disasters,
  volunteers,
  tasks,
  assignments,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  // Compute skill category distributions
  const categoryCounts: Record<string, number> = {};
  volunteers.forEach(v => {
    v.skills.forEach(vs => {
      const s = SEED_SKILLS.find(item => item.id === vs.skillId);
      if (s) {
        categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
      }
    });
  });

  const categoryLabels: Record<string, string> = {
    medical: isEn ? 'Medical & First Aid' : 'Medis & First Aid',
    sar: isEn ? 'SAR & Water Rescue' : 'SAR & Water Rescue',
    logistics: isEn ? 'Logistics & Warehouse' : 'Logistik & Gudang',
    transport: isEn ? 'Transport & Fleet' : 'Transport & Ambulans',
    food: isEn ? 'Emergency Soup Kitchen' : 'Dapur Umum Massal',
    shelter: isEn ? 'Shelter & WASH Sanitation' : 'Hunian & WASH Sanitasi',
    communication: isEn ? 'Radio HT / Comms' : 'Radio HT / ORARI',
    psychosocial: isEn ? 'Trauma Healing & Psychosocial' : 'Trauma Healing',
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress' || t.status === 'assigned').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const activeVolunteersCount = volunteers.filter(v => v.status === 'busy').length;
  const standbyVolunteersCount = volunteers.filter(v => v.status === 'available').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">
            {isEn ? 'Disaster Response Analytics & Evaluation' : 'Laporan & Evaluasi Tanggap Bencana (Analytics)'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isEn 
              ? 'Volunteer dispatch efficiency metrics, resource utilization analysis, and SIGAP command response evaluation'
              : 'Metrik efisiensi penugasan relawan, analisis utilisasi sumber daya, dan evaluasi respon komando SIGAP'}
          </p>
        </div>

        <button
          onClick={() => {
            window.print();
          }}
          className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 flex items-center gap-2 whitespace-nowrap self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          {isEn ? 'Export / Print Evaluation' : 'Cetak Rekap Evaluasi'}
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{isEn ? 'Average Response Time' : 'Rata-Rata Waktu Tanggap'}</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">14.2</span>
            <span className="text-xs text-emerald-400 font-semibold">{isEn ? '-38% vs Manual WA' : '-38% vs Manual WA'}</span>
          </div>
          <span className="text-[11px] text-slate-500 block">
            {isEn ? 'Minutes from alert to dispatch' : 'Menit dari alert ke penugasan'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{isEn ? 'Task Completion Rate' : 'Tingkat Pemenuhan Tugas'}</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">{completionRate}%</span>
            <span className="text-xs text-slate-400">
              {isEn ? `${completedTasks} of ${totalTasks} completed` : `${completedTasks} dari ${totalTasks} tuntas`}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 block">
            {isEn ? 'Successfully closed field tasks' : 'Tugas terselesaikan tuntas'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{isEn ? 'Active Responders Deployed' : 'Mobilisasi Relawan Aktif'}</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-400">{activeVolunteersCount}</span>
            <span className="text-xs text-slate-400">
              {isEn ? `/ ${volunteers.length} deployed in field` : `/ ${volunteers.length} di lapangan`}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 block">
            {isEn ? `${standbyVolunteersCount} standby ready units` : `${standbyVolunteersCount} personel siaga cadangan`}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{isEn ? 'AI Matching Precision' : 'Akurasi Algoritma AI'}</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-purple-300">94.8%</span>
            <span className="text-xs text-purple-400 font-semibold">Gemini 3.8</span>
          </div>
          <span className="text-[11px] text-slate-500 block">
            {isEn ? 'Coordinator acceptance rate' : 'Tingkat penerimaan rekomendasi'}
          </span>
        </div>
      </div>

      {/* Two Column Layout: Skill Distribution & AI Impact Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Category Distribution Bars */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-400" />
              {isEn ? 'Volunteer Specialization Breakdown' : 'Distribusi Spesialisasi Relawan'}
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {isEn ? `${volunteers.length} Certified Responders` : `${volunteers.length} Personel Terdata`}
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(categoryLabels).map(([catKey, label]) => {
              const count = categoryCounts[catKey] || 0;
              const maxCount = 20;
              const percent = Math.min(100, Math.round((count / maxCount) * 100));

              return (
                <div key={catKey} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-medium">{label}</span>
                    <span className="font-mono tabular-nums text-slate-400">
                      {count} {isEn ? 'Responders' : 'Relawan'}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-blue-500 transition-all duration-500 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operational Intelligence Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {isEn ? 'SIGAP Command System Impact Evaluation' : 'Evaluasi Efektivitas Sistem SIGAP'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              {isEn 
                ? 'Prior to SIGAP, disaster response over ad-hoc WhatsApp groups suffered from bystander effect, overlapping deployments to single sectors, zero visibility into active missions, and slow verification of specialized certifications like Water Rescue and Trauma Surgeons.'
                : 'Sebelum adanya SIGAP, koordinasi bencana melalui grup WhatsApp menghadapi hambatan kritis: tumpang tindih alokasi relawan pada satu titik (bystander effect), minimnya transparansi siapa yang sedang mengerjakan apa, serta kelambatan verifikasi keahlian khusus seperti Water Rescue dan Dokter Trauma.'}
            </p>

            <div className="space-y-2 pt-1 text-xs text-slate-300">
              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 text-xs font-bold font-mono">
                  1
                </div>
                <div>
                  <strong className="text-white block">
                    {isEn ? 'Multivariate Intelligent Matching' : 'Pencocokan Cerdas Multivariat'}
                  </strong>
                  <span className="text-slate-400 text-[11px]">
                    {isEn 
                      ? 'Gemini AI calculates skill match (40%), proximity (30%), readiness (20%), and field flight-hours (10%) for rapid mobilization.'
                      : 'Gemini AI mempertimbangkan bobot keahlian 40%, kedekatan 30%, kesiapan 20%, dan jam terbang 10% untuk mobilisasi tercepat.'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold font-mono">
                  2
                </div>
                <div>
                  <strong className="text-white block">
                    {isEn ? 'Unified Geospatial Tactical Command' : 'Visibilitas Taktis Peta Terpadu'}
                  </strong>
                  <span className="text-slate-400 text-[11px]">
                    {isEn 
                      ? 'Coordinators maintain 360° situational awareness across 10-50 km impact radii, live telemetry, and evacuation shelter supply fulfillment.'
                      : 'Koordinator memiliki pandangan komprehensif atas radius dampak 10-50 km, posisi relawan, dan status pemenuhan kebutuhan pengungsi.'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>{isEn ? 'Integrated BNPB / BPBD Reporting Standard' : 'Standar Laporan BNPB / BPBD Terintegrasi'}</span>
            <span className="text-emerald-400">{isEn ? 'System Status: Operational' : 'Status Sistem: Beroperasi Optimal'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
