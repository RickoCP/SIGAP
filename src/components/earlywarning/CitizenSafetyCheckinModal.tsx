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
import { useLanguage } from '../../context/LanguageContext.tsx';

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
  const { language } = useLanguage();
  const isEn = language === 'en';
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
        locationAddress: locationAddress.trim() || (isEn ? 'Monitored area' : 'Lokasi dalam pantauan darurat'),
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
              {status === 'emergency_trapped' ? (
                <AlertTriangle className="w-6 h-6" />
              ) : status === 'needs_evacuation' ? (
                <Users className="w-6 h-6" />
              ) : (
                <ShieldCheck className="w-6 h-6" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                {isEn ? 'Citizen Evacuation & Safety Check-In' : 'Lapor Status Keselamatan & Evakuasi Warga'}
              </h3>
              <p className="text-[11px] opacity-80">
                {isEn ? 'Real-time telemetry sync with Pusdalops command post' : 'Sinkronisasi langsung ke posko komando Pusdalops'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-black/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-extrabold text-white text-lg">
              {isEn ? 'Safety Report Transmitted!' : 'Laporan Keselamatan Terkirim!'}
            </h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              {isEn
                ? 'Your safety status has been logged into the incident command board. Stay calm and head to the nearest verified shelter.'
                : 'Data status Anda telah dicatat di dasbor pemantauan posko komando. Tetap tenang dan ikuti arahan petugas menuju shelter aman.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
            
            {/* Status Selector */}
            <div className="space-y-2">
              <label className="font-bold text-slate-300 block">
                {isEn ? 'Choose Your Current Condition:' : 'Pilih Kondisi Anda Saat Ini:'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('safe')}
                  className={`p-3 rounded-xl border text-left font-bold transition flex flex-col justify-between ${
                    status === 'safe'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-sm">🟢 {isEn ? 'Safe' : 'Selamat'}</span>
                  <span className="text-[10px] font-normal opacity-80 mt-1">
                    {isEn ? 'Safe shelter' : 'Di lokasi aman / tidak terluka'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('needs_evacuation')}
                  className={`p-3 rounded-xl border text-left font-bold transition flex flex-col justify-between ${
                    status === 'needs_evacuation'
                      ? 'bg-amber-950/80 border-amber-500 text-amber-200 ring-1 ring-amber-500'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-sm">🟡 {isEn ? 'Need Evac' : 'Butuh Evakuasi'}</span>
                  <span className="text-[10px] font-normal opacity-80 mt-1">
                    {isEn ? 'Elderly/Infants/Sick' : 'Ada lansia, balita, atau sakit'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('emergency_trapped')}
                  className={`p-3 rounded-xl border text-left font-bold transition flex flex-col justify-between ${
                    status === 'emergency_trapped'
                      ? 'bg-red-950/80 border-red-500 text-red-200 ring-1 ring-red-500 animate-pulse'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-sm">🔴 {isEn ? 'Urgent SOS' : 'SOS Terjebak'}</span>
                  <span className="text-[10px] font-normal opacity-80 mt-1">
                    {isEn ? 'Need rescue boat/SAR' : 'Terkepung arus / reruntuhan'}
                  </span>
                </button>
              </div>
            </div>

            {/* Target Disaster */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 block">
                {isEn ? 'Disaster Incident:' : 'Kejadian Bencana:'}
              </label>
              <select
                value={selectedDisasterId}
                onChange={(e) => setSelectedDisasterId(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
              >
                {disasters.map(d => (
                  <option key={d.id} value={d.id}>
                    {isEn ? (d.titleEn || d.title) : d.title} ({d.province})
                  </option>
                ))}
              </select>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 block">
                  {isEn ? 'Full Name / Head of Household *' : 'Nama Lengkap / Kepala Keluarga *'}
                </label>
                <input
                  type="text"
                  required
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder={isEn ? 'e.g. Budi Santoso' : 'contoh: Budi Santoso'}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 block">
                  {isEn ? 'WhatsApp Phone Number *' : 'Nomor Handphone / WhatsApp *'}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Family Members Count */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 block">
                {isEn ? 'Number of Family Members in Your Group:' : 'Jumlah Jiwa Anggota Keluarga Bersama Anda:'}
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFamilyCount(num)}
                    className={`flex-1 py-2 rounded-xl font-bold border transition ${
                      familyCount === num
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {num === 6 ? '6+' : num}
                  </button>
                ))}
              </div>
            </div>

            {/* Address / Landmark */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 block">
                {isEn ? 'Exact Address / Landmark / Floor Position:' : 'Alamat / Titik Posisi Saat Ini:'}
              </label>
              <input
                type="text"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                placeholder={isEn ? 'e.g. RT 04/RW 02 Kampung Melayu, 2nd floor roof' : 'contoh: RT 04/RW 02 Kampung Melayu, lantai 2 dekat masjid'}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Urgent Needs (if any) */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 block">
                {isEn ? 'Urgent Needs (Infant milk, insulin, rescue boat):' : 'Kebutuhan Mendesak (Susu bayi, insulin, perahu karet):'}
              </label>
              <textarea
                rows={2}
                value={urgentNeeds}
                onChange={(e) => setUrgentNeeds(e.target.value)}
                placeholder={isEn ? 'Explain any medical conditions or supplies needed...' : 'Jelaskan jika ada anggota keluarga luka atau membutuhkan obat khusus...'}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl text-slate-400 hover:text-white font-semibold transition"
              >
                {isEn ? 'Cancel' : 'Batal'}
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isSubmitting 
                    ? (isEn ? 'Submitting...' : 'Mengirimkan...') 
                    : (isEn ? 'Transmit Safety Check-In' : 'Kirim Laporan Keselamatan')}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
