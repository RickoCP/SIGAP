import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Sparkles, 
  MapPin, 
  Users, 
  Check, 
  X, 
  Filter 
} from 'lucide-react';
import { Task, Disaster, Assignment, Volunteer } from '../../types/index.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface TaskManagerProps {
  tasks: Task[];
  disasters: Disaster[];
  assignments: Assignment[];
  volunteers: Volunteer[];
  onOpenCreateTask: (disasterId?: string) => void;
  onOpenAIMatching: (task: Task) => void;
  onUpdateTaskStatus: (taskId: string, status: Task['status']) => void;
  onUpdateAssignmentStatus: (assignmentId: string, status: Assignment['status']) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  disasters,
  assignments,
  volunteers,
  onOpenCreateTask,
  onOpenAIMatching,
  onUpdateTaskStatus,
  onUpdateAssignmentStatus,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDisaster, setFilterDisaster] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const filteredTasks = tasks.filter(t => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (filterDisaster !== 'all' && t.disasterId !== filterDisaster) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">
            {isEn ? `Field Task Management (${tasks.length})` : `Manajemen Tugas Lapangan (${tasks.length})`}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isEn 
              ? 'Track mission dispatch progress, evacuations, soup kitchens, and supply distribution in real time'
              : 'Pantau progres penugasan tim, koordinasi evakuasi, dapur umum, dan distribusi bantuan secara real-time'}
          </p>
        </div>

        <button
          onClick={() => onOpenCreateTask()}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-2 shadow-sm shadow-blue-600/30 whitespace-nowrap self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          {isEn ? 'Create New Task' : 'Buat Tugas Baru'}
        </button>
      </div>

      {/* Filter Strip */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center gap-3 text-xs">
        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium">{isEn ? 'Status:' : 'Status:'}</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
          >
            <option value="all">
              {isEn ? `All Statuses (${tasks.length})` : `Semua Status (${tasks.length})`}
            </option>
            <option value="pending">
              {isEn ? `Pending (${tasks.filter(t => t.status === 'pending').length})` : `Menunggu (${tasks.filter(t => t.status === 'pending').length})`}
            </option>
            <option value="assigned">
              {isEn ? `Assigned (${tasks.filter(t => t.status === 'assigned').length})` : `Ditugaskan (${tasks.filter(t => t.status === 'assigned').length})`}
            </option>
            <option value="in_progress">
              {isEn ? `In Progress (${tasks.filter(t => t.status === 'in_progress').length})` : `Sedang Berjalan (${tasks.filter(t => t.status === 'in_progress').length})`}
            </option>
            <option value="completed">
              {isEn ? `Completed (${tasks.filter(t => t.status === 'completed').length})` : `Selesai (${tasks.filter(t => t.status === 'completed').length})`}
            </option>
          </select>
        </div>

        {/* Disaster Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium">{isEn ? 'Disaster:' : 'Bencana:'}</span>
          <select
            value={filterDisaster}
            onChange={(e) => setFilterDisaster(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
          >
            <option value="all">{isEn ? 'All Operations' : 'Semua Bencana'}</option>
            {disasters.map(d => (
              <option key={d.id} value={d.id}>
                {isEn ? (d.titleEn || d.title).split('-')[0].trim() : d.title.split('-')[0].trim()}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium">{isEn ? 'Priority:' : 'Prioritas:'}</span>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
          >
            <option value="all">{isEn ? 'All Priorities' : 'Semua Prioritas'}</option>
            <option value="urgent">{isEn ? 'Urgent' : 'Mendesak (Urgent)'}</option>
            <option value="high">{isEn ? 'High' : 'Tinggi (High)'}</option>
            <option value="medium">{isEn ? 'Medium' : 'Sedang (Medium)'}</option>
            <option value="low">{isEn ? 'Low' : 'Rendah (Low)'}</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs bg-slate-900/40 rounded-xl border border-slate-800">
            {isEn ? 'No tasks match the selected filter.' : 'Tidak ada tugas yang sesuai dengan filter yang dipilih.'}
          </div>
        ) : (
          filteredTasks.map(task => {
            const disaster = disasters.find(d => d.id === task.disasterId);
            const taskAssignments = assignments.filter(a => a.taskId === task.id);
            const isComplete = task.status === 'completed';
            const isUrgent = task.priority === 'urgent';

            return (
              <div
                key={task.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-md"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
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

                      <span className="text-xs text-slate-400 font-mono">
                        {isEn 
                          ? ((disaster?.titleEn || disaster?.title || '').split('-')[0].trim() || 'Emergency Operation')
                          : (disaster?.title.split('-')[0].trim() || 'Operasi Darurat')}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">
                      {isEn ? (task.titleEn || task.title) : task.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                      {isEn ? (task.descriptionEn || task.description) : task.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-400 font-mono tabular-nums">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {task.address}
                      </span>
                      <span>
                        {isEn ? 'Required Skill: ' : 'Keahlian: '}
                        <strong className="text-blue-400">
                          {isEn ? (task.requiredSkillNameEn || task.requiredSkillName) : task.requiredSkillName}
                        </strong>
                      </span>
                      <span>
                        Target:{' '}
                        <span className="text-slate-300">
                          {isEn 
                            ? (task.targetCompletionTime?.replace('jam', 'hours').replace('menit', 'mins') || '2 hours')
                            : (task.targetCompletionTime || '2 jam')}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-3 self-end lg:self-center shrink-0">
                    <div className="text-right font-mono tabular-nums">
                      <span className="text-[11px] text-slate-400 block">
                        {isEn ? 'Volunteers Needed' : 'Kebutuhan Relawan'}
                      </span>
                      <span className="text-sm font-bold text-white">
                        {task.volunteersAssigned} / {task.volunteersNeeded} {isEn ? 'Responders' : 'Orang'}
                      </span>
                    </div>

                    {!isComplete && (
                      <button
                        onClick={() => onOpenAIMatching(task)}
                        className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-600/30 whitespace-nowrap"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {isEn ? 'Find Volunteers with AI' : 'Cari Relawan via AI'}
                      </button>
                    )}

                    <select
                      value={task.status}
                      onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as Task['status'])}
                      className="px-2.5 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                    >
                      <option value="pending">{isEn ? 'Pending' : 'Menunggu'}</option>
                      <option value="assigned">{isEn ? 'Assigned' : 'Ditugaskan'}</option>
                      <option value="in_progress">{isEn ? 'In Progress' : 'Sedang Berjalan'}</option>
                      <option value="completed">{isEn ? 'Completed' : 'Selesai'}</option>
                      <option value="cancelled">{isEn ? 'Cancelled' : 'Dibatalkan'}</option>
                    </select>
                  </div>
                </div>

                {/* Assigned Volunteers Strip for this Task */}
                {taskAssignments.length > 0 && (
                  <div className="pt-3 border-t border-slate-800/80 space-y-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block font-mono">
                      {isEn ? `Assigned Responders (${taskAssignments.length}):` : `Personel Ditugaskan (${taskAssignments.length}):`}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                      {taskAssignments.map(asg => {
                        const vol = volunteers.find(v => v.id === asg.volunteerId);
                        if (!vol) return null;

                        return (
                          <div
                            key={asg.id}
                            className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between"
                          >
                            <div className="overflow-hidden">
                              <span className="font-semibold text-white block truncate">
                                {vol.name}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono block">
                                {asg.matchScore ? `AI Match ${Math.round(asg.matchScore * 100)}%` : (isEn ? 'Manual' : 'Manual')} · {vol.phone}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0 ml-2">
                              {asg.status !== 'completed' && (
                                <button
                                  onClick={() => onUpdateAssignmentStatus(asg.id, 'completed')}
                                  title={isEn ? 'Mark as Completed' : 'Tandai Selesai'}
                                  className="p-1 rounded bg-emerald-950/80 hover:bg-emerald-800 text-emerald-300 border border-emerald-800/80"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                              )}
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                                {asg.status}
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
          })
        )}
      </div>
    </div>
  );
};
