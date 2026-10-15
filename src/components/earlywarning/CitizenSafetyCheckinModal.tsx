import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  Users, 
  Send,
  HelpCircle,
  Radio,
  Sparkles
} from 'lucide-react';
import { Disaster, CitizenSafetyReport } from '../../types/index.ts';
import { earlyWarningService } from '../../services/earlyWarningService.ts';
import { useAuth } from '../../context/AuthContext.tsx';

interface CitizenSafetyCheckinModalProps {
  disasters: Disaster[];
  defaultDisasterId?: string;
  initialStatus?: 'safe' | 'needs_evacuation' | 'emergency_trapped';
  onClose: () => void;
  onSuccess?: (report: CitizenSafetyReport) => void;
}

export const CitizenSafetyCheckinModal: React.FC<CitizenSafetyCheckinModalProps> = ({
  disasters,
  defaultDisasterId,
  initialStatus = 'safe',
  onClose,
  onSuccess
}) => {
  const { currentUser, userProfile } = useAuth();

  const [status, setStatus] = useState<'safe' | 'needs_evacuation' | 'emergency_trapped'>(initialStatus);
  const [selectedDisasterId, setSelectedDisasterId] = useState<string>(
    defaultDisasterId || disasters[0]?.id || ''
  );
  const [citizenName, setCitizenName] = useState<string>(
    userProfile?.displayName || currentUser?.displayName || ''
  );
  const [phone, setPhone] = useState<string>('');
  const [familyCount, setFamilyCount] = useState<number>(1);
  const [locationAddress, setLocationAddress] = useState<string>('');
  const [urgentNeeds, setUrgentNeeds] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const activeDisaster = disasters.find(d => d.id === selectedDisasterId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenName.trim()) return;

    setIsSubmitting(true);
    try {
      const report = await earlyWarningService.submitCitizenSafetyReport({
        disasterId: activeDisaster?.id,
        disasterTitle: activeDisaster?.title,
        citizenName,
        phone,
        familyCount,
        status,
        locationAddress: locationAddress.trim() || 'Lokasi dalam pantauan darurat',
        urgentNeeds
      });

      setIsSuccess(true);
      if (onSuccess) {
        onSuccess(report);
      }
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Failed to submit citizen check-in:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Top Header */}
        <div className={`p-5 flex items-center justify-between border-b ${
          status === 'emergency_trapped'
            ? 'bg-red-950/80 border-red-800 text-red-100'
            : status === 'needs_evacuation'
            ? 'bg-amber-950/80 border-amber-800 text-amber-100'
            : 'bg-emerald-950/80 border-emerald-800 text-emerald-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${
              status === 'emergency_trapped'
                ? 'bg-red-600 text-white animate-pulse'
                : status === 'needs_evacuation'
                ? 'bg-amber-600 text-white'
                : 'bg-emerald-600 text-white'
            }`}>
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Lapor Status Keselamatan Warga
              </h3>
              <p className="text-xs text-slate-300">
                Data terhubung langsung ke Satgas Pusdalops & Posko SAR
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4 text-slate-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-white">
              Status Keselamatan Berhasil Dilaporkan!
            </h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Laporan Anda telah tercatat pada Pusat Komando Penanggulangan Bencana. Tim relawan di lapangan memantau posisi dan kebutuhan Anda.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-slate-200">
            
            {/* Status Selector Pills */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Pilih Kondisi Anda Saat Ini:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('safe')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    status === 'safe'
                      ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg shadow-emerald-950/50'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-lg">🟢</span>
                  <span className="text-xs font-bold text-emerald-400">Saya Selamat</span>
                  <span className="text-[10px] text-slate-400">Kondisi aman</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('needs_evacuation')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    status === 'needs_evacuation'
                      ? 'bg-amber-950/80 border-amber-500 text-white shadow-lg shadow-amber-950/50'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-lg">🟡</span>
                  <span className="text-xs font-bold text-amber-400">Butuh Evakuasi</span>
                  <span className="text-[10px] text-slate-400">Lansia/medis/anak</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('emergency_trapped')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    status === 'emergency_trapped'
                      ? 'bg-red-950/80 border-red-500 text-white shadow-lg shadow-red-950/50 animate-pulse'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-lg">🔴</span>
                  <span className="text-xs font-bold text-red-400">SOS Terjebak</span>
                  <span className="text-[10px] text-slate-400">Arus/reruntuhan</span>
                </button>
              </div>
            </div>

            {/* Target Disaster */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Wilayah Bencana Terkait:
              </label>
              <select
                value={selectedDisasterId}
                onChange={(e) => setSelectedDisasterId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {disasters.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title} ({d.province})
                  </option>
                ))}
              </select>
            </div>

            {/* Citizen Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Anda / Kepala Keluarga:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bpk. Bambang Supriyanto"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nomor HP / WhatsApp Aktif:
                </label>
                <input
                  type="tel"
                  placeholder="Contoh: 08123456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Jumlah Jiwa (Keluarga):
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={familyCount}
                  onChange={(e) => setFamilyCount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Lokasi / Posisi Terkini:
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Lantai 2 Rumah No. 12 RT 03/02 atau Posko Balai Desa"
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Urgent Needs note */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Kebutuhan Darurat Khusus (Obat, Susu Bayi, Perahu, dll.):
              </label>
              <textarea
                rows={2}
                placeholder="Contoh: Butuh perahu evakuasi untuk 1 lansia stroke dan tabung oksigen..."
                value={urgentNeeds}
                onChange={(e) => setUrgentNeeds(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !citizenName.trim()}
                className={`flex-1 py-2.5 px-5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 ${
                  status === 'emergency_trapped'
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/40'
                    : status === 'needs_evacuation'
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-950/40'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
                }`}
              >
                {isSubmitting ? (
                  <span>Mengirim Laporan...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Kirim Laporan Status Keselamatan</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
