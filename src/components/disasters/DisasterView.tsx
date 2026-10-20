import React, { useMemo } from 'react';
import { 
  Waves, 
  Flame, 
  Activity, 
  MapPin, 
  Users, 
  Home, 
  Plus, 
  Sparkles, 
  Radio, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { Disaster, Task, Assignment, Volunteer } from '../../types/index.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { getLocalizedDisaster } from '../../i18n/translations.ts';

interface DisasterViewProps {
  disasters: Disaster[];
  selectedDisasterId: string | null;
  tasks: Task[];
  assignments: Assignment[];
  volunteers: Volunteer[];
  onSelectDisaster: (id: string) => void;
  onOpenCreateTask: (disasterId: string) => void;
  onOpenAIMatching: (task: Task) => void;
  onOpenSitRep: () => void;
  onOpenBroadcast: () => void;
  onOpenGoogleMaps?: () => void;
  onUpdateTaskStatus: (taskId: string, status: Task['status']) => void;
}

export const DisasterView: React.FC<DisasterViewProps> = ({
  disasters,
  selectedDisasterId,
  tasks,
  assignments,
  volunteers,
  onSelectDisaster,
  onOpenCreateTask,
  onOpenAIMatching,
  onOpenSitRep,
  onOpenBroadcast,
  onOpenGoogleMaps,
  onUpdateTaskStatus,
}) => {
  const { language, t } = useLanguage();

  const localizedDisasters = useMemo(() => {
    return disasters.map(d => getLocalizedDisaster(d, language));
  }, [disasters, language]);

  const selectedDisaster = useMemo(() => {
    const found = localizedDisasters.find(d => d.id === selectedDisasterId);
    return found || localizedDisasters[0];
  }, [localizedDisasters, selectedDisasterId]);

  const disasterTasks = tasks.filter(t => t.disasterId === selectedDisaster?.id);

  if (!selectedDisaster) {
    return (
      <div className="p-8 text-center text-slate-400">
        {language === 'id' ? 'Belum ada data bencana aktif.' : 'No active disaster operations.'}
      </div>
    );
  }

  const getDisasterIcon = (type: Disaster['type']) => {
    switch (type) {
      case 'flood':
        return <Waves className="w-5 h-5 text-blue-400" />;
      case 'fire':
        return <Flame className="w-5 h-5 text-orange-400" />;
      case 'earthquake':
        return <Activity className="w-5 h-5 text-red-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
    }
  };

  const getSeverityBadge = (severity: Disaster['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-800/80">
            {language === 'id' ? 'Kritis (Darurat 1)' : 'Critical (Level 1)'}
          </span>
        );
      case 'high':
        return (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-orange-950/80 text-orange-300 border border-orange-800/80">
            {language === 'id' ? 'Tinggi (Siaga 2)' : 'High (Level 2)'}
          </span>
        );
      case 'medium':
        return (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/80">
            {language === 'id' ? 'Sedang (Waspada)' : 'Medium (Advisory)'}
          </span>
        );
      default:
        return (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-800 text-slate-300">
            {language === 'id' ? 'Rendah' : 'Low'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Disaster Selector Cards Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {localizedDisasters.map(d => {
          const isSelected = d.id === selectedDisaster.id;
          const assignedCount = assignments.filter(a => a.disasterId === d.id).length;

          return (
            <div
              key={d.id}
              onClick={() => onSelectDisaster(d.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-slate-900 border-blue-500 shadow-md shadow-blue-950/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700">
                    {getDisasterIcon(d.type)}
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    {d.type}
                  </span>
                </div>
                {getSeverityBadge(d.severity)}
              </div>

              <h4 className="text-sm font-bold text-white line-clamp-1">
                {language === 'en' ? (d.titleEn || d.title) : d.title}
              </h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {language === 'en' ? (d.descriptionEn || d.description) : d.description}
              </p>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono tabular-nums text-slate-400">
                <span>
                  {d.affectedPeople.toLocaleString()} {language === 'id' ? 'jiwa terdampak' : 'people affected'}
                </span>
                <span className="text-blue-400 font-semibold">
                  {assignedCount} {language === 'id' ? 'relawan aktif' : 'active responders'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Disaster Detail Command Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Header & Quick Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
              <span className="p-1.5 rounded-lg bg-slate-800 border border-slate-700">
                {getDisasterIcon(selectedDisaster.type)}
              </span>
              <h2 className="text-lg font-bold text-white">
                {language === 'en' ? (selectedDisaster.titleEn || selectedDisaster.title) : selectedDisaster.title}
              </h2>
              {getSeverityBadge(selectedDisaster.severity)}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-mono tabular-nums">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {selectedDisaster.address}
              </span>
              <span>
                {language === 'id' ? 'Koordinat' : 'Coordinates'}: {selectedDisaster.locationLat.toFixed(4)}, {selectedDisaster.locationLng.toFixed(4)}
              </span>
              <span>
                Status: <strong className="text-blue-400 uppercase">
                  {selectedDisaster.status === 'active' 
                    ? (language === 'id' ? 'Aktif' : 'Active') 
                    : selectedDisaster.status === 'responding' 
                    ? (language === 'id' ? 'Tahap Respons' : 'Responding') 
                    : selectedDisaster.status === 'reported'
                    ? (language === 'id' ? 'Dilaporkan' : 'Reported')
                    : (language === 'id' ? 'Selesai' : 'Resolved')}
                </strong>
              </span>
            </div>
          </div>

          {/* Action Hub */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenSitRep}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 flex items-center gap-1.5 shadow-sm"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              {language === 'id' ? 'Laporan SitRep (AI)' : 'SitRep Report (AI)'}
            </button>

            {onOpenGoogleMaps && (
              <button
                onClick={onOpenGoogleMaps}
                className="px-3.5 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 rounded-lg transition-colors border border-emerald-800/80 flex items-center gap-1.5 shadow-sm"
              >
                <MapPin className="w-4 h-4 text-emerald-400" />
                {language === 'id' ? 'Faskes Google Maps' : 'Hospitals (Maps)'}
              </button>
            )}

            <button
              onClick={onOpenBroadcast}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 flex items-center gap-1.5 shadow-sm"
            >
              <Radio className="w-4 h-4 text-amber-400" />
              {language === 'id' ? 'Siaran Darurat WhatsApp' : 'WhatsApp Broadcast'}
            </button>

            <button
              onClick={() => onOpenCreateTask(selectedDisaster.id)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-600/30"
            >
              <Plus className="w-4 h-4" />
              {language === 'id' ? 'Tambah Tugas' : 'Create Task'}
            </button>
          </div>
        </div>

        {/* Narrative & Key Needs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {language === 'id' ? 'Kronologi & Kondisi Lapangan' : 'Chronology & Field Conditions'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              {language === 'en' ? (selectedDisaster.descriptionEn || selectedDisaster.description) : selectedDisaster.description}
            </p>

            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">
                  {language === 'id' ? 'Warga Terdampak' : 'Affected People'}
                </span>
                <span className="text-base font-bold font-mono tabular-nums text-white mt-0.5 block">
                  {selectedDisaster.affectedPeople.toLocaleString()} {t.natMapSouls}
                </span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">
                  {language === 'id' ? 'Kepala Keluarga (KK)' : 'Households'}
                </span>
                <span className="text-base font-bold font-mono tabular-nums text-white mt-0.5 block">
                  {selectedDisaster.affectedHouseholds.toLocaleString()} {t.natMapHouseholds}
                </span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">
                  {language === 'id' ? 'Titik Pengungsian' : 'Evacuation Shelters'}
                </span>
                <span className="text-base font-bold font-mono tabular-nums text-blue-400 mt-0.5 block">
                  {selectedDisaster.evacuationCenterCount} {language === 'id' ? 'Posko' : 'Shelters'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {language === 'id' ? 'Kebutuhan Mendesak Teridentifikasi' : 'Identified Priority Needs'}
            </h4>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
              {((language === 'en' && selectedDisaster.keyNeedsEn && selectedDisaster.keyNeedsEn.length > 0)
                ? selectedDisaster.keyNeedsEn
                : selectedDisaster.keyNeeds
              ).map((need, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{need}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Operational Tasks Section */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">
                {language === 'id' 
                  ? `Daftar Tugas Koordinasi Lapangan (${disasterTasks.length})`
                  : `Field Coordination Tasks List (${disasterTasks.length})`}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'id'
                  ? 'Gunakan Gemini AI untuk mencocokkan relawan terspesialisasi berdasarkan lokasi dan ketersediaan'
                  : 'Use Gemini AI to match specialized responders based on GPS location, skills, and availability'}
              </p>
            </div>
            <button
              onClick={() => onOpenCreateTask(selectedDisaster.id)}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
            >
              + {language === 'id' ? 'Tambah Tugas Lapangan' : 'Add Field Task'}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {disasterTasks.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs bg-slate-950/40 rounded-xl border border-slate-800">
                {language === 'id' 
                  ? "Belum ada tugas untuk bencana ini. Klik '+ Tambah Tugas' untuk membuat tugas baru."
                  : "No tasks created for this crisis yet. Click '+ Add Field Task' to dispatch new tasks."}
              </div>
            ) : (
              disasterTasks.map(task => {
                const assignedForTask = assignments.filter(a => a.taskId === task.id);
                const isUrgent = task.priority === 'urgent';
                const isComplete = task.status === 'completed';

                return (
                  <div
                    key={task.id}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded font-mono ${
                              isUrgent
                                ? 'bg-red-950/80 text-red-300 border border-red-800/80'
                                : task.priority === 'high'
                                ? 'bg-orange-950/80 text-orange-300 border border-orange-800/80'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {task.priority.toUpperCase()}
                          </span>
                          <h4 className="text-sm font-bold text-white">
                            {language === 'en' ? (task.titleEn || task.title) : task.title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                          {language === 'en' ? (task.descriptionEn || task.description) : task.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-400 font-mono tabular-nums">
                          <span>
                            {language === 'id' ? 'Keahlian' : 'Skill'}:{' '}
                            <strong className="text-blue-400 font-medium">
                              {language === 'en' ? (task.requiredSkillNameEn || task.requiredSkillName) : task.requiredSkillName}
                            </strong>
                          </span>
                          <span>
                            {language === 'id' ? 'Lokasi' : 'Location'}: <span className="text-slate-300">{task.address}</span>
                          </span>
                          <span>
                            Target: <span className="text-slate-300">
                              {task.targetCompletionTime 
                                ? (language === 'en' ? task.targetCompletionTime.replace('jam', 'hours').replace('menit', 'mins') : task.targetCompletionTime) 
                                : (language === 'id' ? '2 jam' : '2 hours')}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Right controls */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <div className="text-right font-mono tabular-nums mr-2">
                          <span className="text-xs text-slate-400 block">
                            {language === 'id' ? 'Kebutuhan Relawan' : 'Volunteers Needed'}
                          </span>
                          <span className="text-sm font-bold text-white">
                            {task.volunteersAssigned} / {task.volunteersNeeded}
                          </span>
                        </div>

                        {!isComplete && (
                          <button
                            onClick={() => onOpenAIMatching(task)}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-600/30 whitespace-nowrap"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            {language === 'id' ? 'Pencocokan AI' : 'AI Match'}
                          </button>
                        )}

                        <select
                          value={task.status}
                          onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as Task['status'])}
                          className="px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                        >
                          <option value="pending">{language === 'id' ? 'Menunggu' : 'Pending'}</option>
                          <option value="assigned">{language === 'id' ? 'Ditugaskan' : 'Assigned'}</option>
                          <option value="in_progress">{language === 'id' ? 'Sedang Berjalan' : 'In Progress'}</option>
                          <option value="completed">{language === 'id' ? 'Selesai' : 'Completed'}</option>
                          <option value="cancelled">{language === 'id' ? 'Dibatalkan' : 'Cancelled'}</option>
                        </select>
                      </div>
                    </div>

                    {/* Assigned Volunteers Strip for this Task */}
                    {assignedForTask.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-[11px] text-slate-400 font-medium">
                          {language === 'id' ? 'Relawan Bertugas:' : 'Assigned Volunteers:'}
                        </span>
                        {assignedForTask.map(a => {
                          const vol = volunteers.find(v => v.id === a.volunteerId);
                          if (!vol) return null;
                          return (
                            <div
                              key={a.id}
                              className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 flex items-center gap-1.5 text-[11px] text-slate-200"
                            >
                              <div className="w-2 h-2 rounded-full bg-emerald-400" />
                              <span className="font-medium">{vol.name}</span>
                              <span className="text-slate-400 font-mono text-[10px]">
                                ({a.matchScore ? `${Math.round(a.matchScore * 100)}% match` : 'manual'})
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
