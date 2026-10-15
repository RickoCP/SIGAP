import React, { useState } from 'react';
import { X, Plus, MapPin, Users, Award } from 'lucide-react';
import { Task, Disaster, SkillCategory, TaskPriority } from '../../types/index.ts';
import { SEED_SKILLS } from '../../data/seedData.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface CreateTaskModalProps {
  disasters: Disaster[];
  defaultDisasterId?: string;
  onClose: () => void;
  onCreate: (taskData: Omit<Task, 'id' | 'createdAt' | 'volunteersAssigned' | 'status'>) => Promise<void>;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  disasters,
  defaultDisasterId,
  onClose,
  onCreate,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [disasterId, setDisasterId] = useState<string>(
    defaultDisasterId || (disasters[0]?.id ?? '')
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSkillId, setSelectedSkillId] = useState<string>('skill-sar-1');
  const [priority, setPriority] = useState<TaskPriority>('high');
  const [volunteersNeeded, setVolunteersNeeded] = useState<number>(4);
  const [targetCompletionTime, setTargetCompletionTime] = useState<string>(isEn ? '3 hours' : '3 jam');
  const [address, setAddress] = useState('');
  const [locationLat, setLocationLat] = useState<number>(-6.2251);
  const [locationLng, setLocationLng] = useState<number>(106.8621);
  const [submitting, setSubmitting] = useState(false);

  // Sync location with selected disaster
  const handleDisasterChange = (newDisasterId: string) => {
    setDisasterId(newDisasterId);
    const d = disasters.find(item => item.id === newDisasterId);
    if (d) {
      setLocationLat(d.locationLat);
      setLocationLng(d.locationLng);
      setAddress(d.address);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const skillObj = SEED_SKILLS.find(s => s.id === selectedSkillId) || SEED_SKILLS[0];

    setSubmitting(true);
    try {
      await onCreate({
        disasterId,
        title,
        description,
        requiredSkillCategory: skillObj.category,
        requiredSkillName: skillObj.name,
        priority,
        volunteersNeeded,
        targetCompletionTime,
        address: address || (isEn ? 'Main Field Base (Posko)' : 'Posko Utama Lapangan'),
        locationLat,
        locationLng,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/50 p-5 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isEn ? 'Create Field Mission Task' : 'Buat Tugas Penugasan Lapangan'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEn 
                  ? 'Define specific task needs so they can be matched with available volunteers immediately'
                  : 'Definisikan kebutuhan tugas spesifik agar dapat langsung dicocokkan dengan relawan yang tersedia'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">
              {isEn ? 'Related Disaster Operation' : 'Bencana Terkait'}
            </label>
            <select
              value={disasterId}
              onChange={(e) => handleDisasterChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500 font-mono"
            >
              {disasters.map(d => (
                <option key={d.id} value={d.id}>
                  {d.title} ({d.severity.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">
              {isEn ? 'Task Title' : 'Judul Tugas Penugasan'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isEn ? 'e.g. Evacuate elderly residents via rubber boats in Sector 3' : 'Contoh: Evakuasi Lansia Terjebak via Perahu Karet di RW 03'}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">
              {isEn ? 'Detailed Instructions & Description' : 'Deskripsi Lengkap & Instruksi'}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isEn ? 'Detail target coordinates, obstacles, gear required...' : 'Jelaskan titik sasaran, kendala medan, peralatan yang harus dibawa...'}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                {isEn ? 'Required Skill Certification' : 'Keahlian yang Dibutuhkan'}
              </label>
              <select
                value={selectedSkillId}
                onChange={(e) => setSelectedSkillId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500 font-mono"
              >
                {SEED_SKILLS.map(s => (
                  <option key={s.id} value={s.id}>
                    [{s.category.toUpperCase()}] {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                {isEn ? 'Task Priority' : 'Prioritas Tugas'}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500 font-mono"
              >
                <option value="urgent">{isEn ? 'Urgent - Life Saving / Immediate Evacuation' : 'Mendesak (Urgent) - Penyelamatan Jiwa'}</option>
                <option value="high">{isEn ? 'High - Essential Relief Support' : 'Tinggi (High) - Kebutuhan Pokok Posko'}</option>
                <option value="medium">{isEn ? 'Medium - Field Operations' : 'Sedang (Medium) - Dukungan Operasional'}</option>
                <option value="low">{isEn ? 'Low - Logistics & Camp Cleanup' : 'Rendah (Low) - Inventori & Pembersihan'}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono tabular-nums">
            <div>
              <label className="block text-slate-400 mb-1">
                {isEn ? 'Number of Volunteers Needed' : 'Jumlah Relawan Dibutuhkan'}
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={volunteersNeeded}
                onChange={(e) => setVolunteersNeeded(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">
                {isEn ? 'Target Completion Time' : 'Target Waktu Penyelesaian'}
              </label>
              <input
                type="text"
                value={targetCompletionTime}
                onChange={(e) => setTargetCompletionTime(e.target.value)}
                placeholder={isEn ? '2 hours / 4 hours / 1 day' : '2 jam / 4 jam / 1 hari'}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
          </div>

          {/* Location Details */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-3">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              {isEn ? 'Task Location Details' : 'Lokasi Titik Tugas'}
            </span>

            <div>
              <label className="block text-slate-400 mb-1">
                {isEn ? 'Specific Target Address' : 'Alamat Sasaran Tugas'}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={isEn ? 'Jatinegara, East Jakarta...' : 'Gang Arus RT 08/RW 02, Kampung Melayu...'}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={locationLat}
                  onChange={(e) => setLocationLat(parseFloat(e.target.value))}
                  className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={locationLng}
                  onChange={(e) => setLocationLng(parseFloat(e.target.value))}
                  className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              {isEn ? 'Cancel' : 'Batal'}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm shadow-blue-600/30 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              {submitting ? (isEn ? 'Saving...' : 'Menyimpan...') : (isEn ? 'Dispatch Task' : 'Terbitkan Tugas')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
