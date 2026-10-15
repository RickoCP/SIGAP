import React from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  Award, 
  Shield, 
  CheckCircle2, 
  Clock, 
  Building2,
  Trophy,
  Gift,
  Sparkles
} from 'lucide-react';
import { Volunteer, Disaster, Assignment, Task } from '../../types/index.ts';
import { SEED_SKILLS } from '../../data/seedData.ts';
import { calculateDistance } from '../../lib/geo.ts';
import { GAMIFICATION_BADGES, REWARD_ITEMS } from '../../data/gamificationData.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface VolunteerProfileModalProps {
  volunteer: Volunteer;
  selectedDisaster: Disaster | null;
  assignments: Assignment[];
  tasks: Task[];
  onClose: () => void;
  onUpdateStatus: (volunteerId: string, status: Volunteer['status']) => void;
}

export const VolunteerProfileModal: React.FC<VolunteerProfileModalProps> = ({
  volunteer,
  selectedDisaster,
  assignments,
  tasks,
  onClose,
  onUpdateStatus,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const volunteerAssignments = assignments.filter(a => a.volunteerId === volunteer.id);

  const distance = selectedDisaster
    ? calculateDistance(
        selectedDisaster.locationLat,
        selectedDisaster.locationLng,
        volunteer.locationLat,
        volunteer.locationLng
      )
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-300 font-extrabold text-lg">
              {volunteer.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-white">{volunteer.name}</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    volunteer.category === 'sar_official'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {volunteer.category === 'sar_official' 
                    ? (isEn ? '🛡️ Official SAR Unit / Basarnas' : '🛡️ Tim SAR Basarnas / Potensi') 
                    : (isEn ? '🤝 Community Volunteer' : '🤝 Relawan Warga / Komunitas')}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded font-mono ${
                    volunteer.status === 'available'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                      : volunteer.status === 'busy'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800/80'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {volunteer.status === 'available' 
                    ? (isEn ? 'Ready' : 'Siaga') 
                    : volunteer.status === 'busy' 
                    ? (isEn ? 'Deployed' : 'Bertugas') 
                    : 'Offline'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">
                {volunteer.sarUnitOrRole || volunteer.organization || (isEn ? 'Independent Responder' : 'Relawan Independen')} · {isEn ? 'Joined since ' : 'Bergabung sejak '}{volunteer.joinedDate}
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-amber-400 font-mono">
                <span className="bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800 font-bold">
                  ★ Level {volunteer.gamification?.level || 2} : {volunteer.gamification?.levelTitle || (isEn ? 'Rapid Responder' : 'Relawan Tanggap')}
                </span>
                <span className="text-white font-bold">
                  {volunteer.gamification?.points || volunteer.completedTasksCount * 45 + 120} XP
                </span>
                <span className="text-slate-400">
                  ({volunteer.gamification?.badges?.length || 2} {isEn ? 'Badges' : 'Lencana'})
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Status Switcher Bar */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 font-medium">
              {isEn ? 'Update Availability Status:' : 'Ubah Status Ketersediaan:'}
            </span>
            <div className="flex items-center gap-1.5 font-mono">
              <button
                onClick={() => onUpdateStatus(volunteer.id, 'available')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  volunteer.status === 'available'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {isEn ? 'Ready' : 'Siaga'}
              </button>
              <button
                onClick={() => onUpdateStatus(volunteer.id, 'busy')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  volunteer.status === 'busy'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {isEn ? 'Deployed' : 'Bertugas'}
              </button>
              <button
                onClick={() => onUpdateStatus(volunteer.id, 'offline')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  volunteer.status === 'offline'
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Offline
              </button>
            </div>
          </div>

          {/* Contact and Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-mono">
                {isEn ? 'Contact & Standby Range' : 'Kontak & Jangkauan'}
              </span>
              <div className="text-slate-300 space-y-1 font-mono">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{volunteer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{volunteer.email}</span>
                </div>
                <div className="text-blue-400 pt-0.5">
                  {isEn ? 'Standby Radius: ' : 'Radius Siaga: '}{volunteer.radiusKm} km
                </div>
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-mono">
                {isEn ? 'Domicile & Coordinates' : 'Domisili & Posisi'}
              </span>
              <div className="text-slate-300 space-y-1 font-mono">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span>{volunteer.address}, {volunteer.city}</span>
                </div>
                {distance !== null && (
                  <div className="text-amber-400 pt-0.5">
                    {distance.toFixed(1)} km {isEn ? 'from ' : 'dari '}{selectedDisaster?.title.split('-')[0].trim()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Certified Skills */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-400" />
              {isEn ? 'Verified Skills & Certifications' : 'Keahlian & Sertifikasi Terverifikasi'}
            </h4>
            <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
              {volunteer.skills.map((vs, idx) => {
                const skillObj = SEED_SKILLS.find(s => s.id === vs.skillId);
                if (!skillObj) return null;
                return (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white block text-xs">{skillObj.name}</span>
                      <span className="text-slate-400 text-[11px]">{skillObj.description}</span>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded font-mono ${
                        vs.proficiency === 'expert'
                          ? 'bg-purple-950 text-purple-300 border border-purple-800'
                          : vs.proficiency === 'intermediate'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {vs.proficiency.toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gamification & Rewards Showcase */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                {isEn ? 'Badges & Responder Honors' : 'Lencana & Prestasi Relawan'}
              </h4>
              <span className="text-[11px] font-mono text-amber-400 font-bold">
                {volunteer.gamification?.points || volunteer.completedTasksCount * 45 + 120} {isEn ? 'XP Available' : 'XP Tersedia'}
              </span>
            </div>

            {/* Badges Earned */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {(volunteer.gamification?.badges && volunteer.gamification.badges.length > 0
                ? volunteer.gamification.badges
                : GAMIFICATION_BADGES.slice(0, 3)
              ).map((badge, idx) => (
                <div
                  key={badge.id || idx}
                  className="p-2.5 bg-slate-950/60 border border-amber-900/40 rounded-xl flex items-center gap-2.5 hover:border-amber-700/60 transition-colors"
                >
                  <span className="text-xl shrink-0 p-1 bg-amber-950/80 rounded-lg border border-amber-800/80">
                    {badge.icon}
                  </span>
                  <div className="min-w-0">
                    <span className="font-bold text-white text-xs block truncate">
                      {badge.name}
                    </span>
                    <span className="text-[10px] text-slate-400 block line-clamp-1">
                      {badge.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Claimed Rewards */}
            {volunteer.gamification?.claimedRewardIds && volunteer.gamification.claimedRewardIds.length > 0 && (
              <div className="p-3 bg-gradient-to-r from-emerald-950/30 to-blue-950/30 border border-emerald-800/40 rounded-xl">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Gift className="w-3.5 h-3.5" />
                  {isEn ? 'Claimed Rewards:' : 'Reward Ditukarkan:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {volunteer.gamification.claimedRewardIds.map(rid => {
                    const item = REWARD_ITEMS.find(r => r.id === rid);
                    return item ? (
                      <span
                        key={rid}
                        className="px-2 py-1 rounded bg-slate-900 border border-emerald-700/60 text-[11px] text-emerald-300 font-medium flex items-center gap-1"
                      >
                        <span>{item.icon}</span>
                        <span>{item.title}</span>
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Missions History */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {isEn ? `Field Mission History (${volunteerAssignments.length})` : `Riwayat Penugasan Lapangan (${volunteerAssignments.length})`}
              </span>
              <span className="text-slate-500 font-mono text-[11px]">
                {volunteer.completedTasksCount} {isEn ? 'tasks completed' : 'tugas tuntas'}
              </span>
            </h4>

            {volunteerAssignments.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 bg-slate-950/40 rounded-xl border border-slate-800">
                {isEn ? 'No mission records in current disaster response session.' : 'Belum ada catatan tugas aktif dalam sesi tanggap bencana ini.'}
              </p>
            ) : (
              <div className="space-y-2">
                {volunteerAssignments.map(asg => {
                  const taskObj = tasks.find(t => t.id === asg.taskId);
                  return (
                    <div
                      key={asg.id}
                      className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <span className="font-semibold text-white text-xs block">
                          {taskObj?.title || (isEn ? 'Field Task' : 'Tugas Lapangan')}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {asg.matchReason || (isEn ? 'Assigned by coordinator' : 'Ditugaskan oleh koordinator')}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                        {asg.status.toUpperCase()}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
          >
            {isEn ? 'Close Profile' : 'Tutup Profil'}
          </button>
        </div>
      </div>
    </div>
  );
};
