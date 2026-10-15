import React from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface StatsProps {
  stats: {
    activeDisasters: number;
    availableVolunteers: number;
    busyVolunteers: number;
    totalVolunteers: number;
    pendingTasks: number;
    inProgressTasks: number;
    completedTasks: number;
    totalTasks: number;
    coverageRate: number;
    avgResponseMinutes: number;
  };
}

export const HeaderMetrics: React.FC<StatsProps> = ({ stats }) => {
  const { language, t } = useLanguage();

  return (
    <section className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-800/80">
          <div className="pt-2 md:pt-0">
            <span className="text-xs text-slate-400 block font-normal">{t.metricActiveCrises}</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold font-mono tabular-nums text-white">{stats.activeDisasters}</span>
              <span className="text-xs text-slate-400">{language === 'id' ? 'titik krisis' : 'crisis zones'}</span>
            </div>
          </div>

          <div className="pt-2 md:pt-0 md:pl-6">
            <span className="text-xs text-slate-400 block font-normal">{t.metricAvailableVolunteers}</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold font-mono tabular-nums text-emerald-400">{stats.availableVolunteers}</span>
              <span className="text-xs text-slate-400">/ {stats.totalVolunteers} {language === 'id' ? 'terdaftar' : 'registered'}</span>
            </div>
          </div>

          <div className="pt-2 md:pt-0 md:pl-6">
            <span className="text-xs text-slate-400 block font-normal">{language === 'id' ? 'Tugas Lapangan Berjalan' : 'Field Tasks in Progress'}</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold font-mono tabular-nums text-blue-400">{stats.inProgressTasks}</span>
              <span className="text-xs text-slate-400">· {stats.pendingTasks} {language === 'id' ? 'menunggu' : 'pending'}</span>
            </div>
          </div>

          <div className="pt-2 md:pt-0 md:pl-6">
            <span className="text-xs text-slate-400 block font-normal">{t.metricCoverageRate}</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold font-mono tabular-nums text-white">{stats.coverageRate}%</span>
              <span className="text-xs text-emerald-400">{language === 'id' ? 'terselesaikan / aktif' : 'resolved / active'}</span>
            </div>
          </div>

          <div className="pt-2 md:pt-0 md:pl-6 col-span-2 md:col-span-1">
            <span className="text-xs text-slate-400 block font-normal">{t.metricAvgResponse}</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold font-mono tabular-nums text-amber-400">{stats.avgResponseMinutes}</span>
              <span className="text-xs text-slate-400">{t.metricMinutes} {language === 'id' ? 'mobilisasi' : 'dispatch'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
