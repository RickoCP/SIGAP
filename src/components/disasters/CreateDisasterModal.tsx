import React, { useState } from 'react';
import { X, Plus, MapPin, AlertTriangle } from 'lucide-react';
import { Disaster, DisasterSeverity, DisasterType } from '../../types/index.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface CreateDisasterModalProps {
  onClose: () => void;
  onCreate: (disasterData: Omit<Disaster, 'id' | 'reportedAt'>) => Promise<void>;
}

export const CreateDisasterModal: React.FC<CreateDisasterModalProps> = ({
  onClose,
  onCreate,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<DisasterType>('flood');
  const [severity, setSeverity] = useState<DisasterSeverity>('high');
  const [locationLat, setLocationLat] = useState<number>(-6.2251);
  const [locationLng, setLocationLng] = useState<number>(106.8621);
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('DKI Jakarta');
  const [affectedPeople, setAffectedPeople] = useState<number>(1000);
  const [affectedHouseholds, setAffectedHouseholds] = useState<number>(300);
  const [evacuationCenterCount, setEvacuationCenterCount] = useState<number>(2);
  const [keyNeedsInput, setKeyNeedsInput] = useState<string>(
    isEn ? 'Rubber Boats, Ready-to-eat Meals, Blankets' : 'Perahu Karet, Makanan Siap Saji, Selimut'
  );
  const [submitting, setSubmitting] = useState(false);

  // Preset location helper
  const handleSelectPreset = (preset: 'jakarta_timur' | 'jakarta_barat' | 'banten' | 'bogor') => {
    switch (preset) {
      case 'jakarta_timur':
        setLocationLat(-6.2251);
        setLocationLng(106.8621);
        setAddress('Kampung Melayu, Jatinegara, Jakarta Timur');
        setProvince('DKI Jakarta');
        break;
      case 'jakarta_barat':
        setLocationLat(-6.1512);
        setLocationLng(106.8041);
        setAddress('Kalianyar, Tambora, Jakarta Barat');
        setProvince('DKI Jakarta');
        break;
      case 'banten':
        setLocationLat(-6.4022);
        setLocationLng(105.8234);
        setAddress('Labuan, Pandeglang, Banten');
        setProvince('Banten');
        break;
      case 'bogor':
        setLocationLat(-6.5950);
        setLocationLng(106.8000);
        setAddress('Kecamatan Bogor Timur, Kota Bogor');
        setProvince('Jawa Barat');
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !address.trim()) return;

    setSubmitting(true);
    try {
      const needs = keyNeedsInput
        .split(',')
        .map(n => n.trim())
        .filter(Boolean);

      await onCreate({
        title,
        description,
        type,
        severity,
        locationLat,
        locationLng,
        address,
        province,
        status: 'active',
        affectedPeople,
        affectedHouseholds,
        evacuationCenterCount,
        keyNeeds: needs.length > 0 ? needs : (isEn ? ['Medical Aid', 'Food Supplies'] : ['Bantuan Medis', 'Logistik Pangan']),
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
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isEn ? 'Declare New Disaster Operation' : 'Lapor Kejadian Bencana Baru'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEn 
                  ? 'Register a crisis event to initiate coordinated volunteer mobilization and command response'
                  : 'Daftarkan kejadian bencana untuk memulai mobilisasi dan koordinasi relawan terpadu'}
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
              {isEn ? 'Disaster Operation Title' : 'Judul Kejadian Bencana'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isEn ? 'e.g. Flash Flood - Kali Pesanggrahan Overflow' : 'Contoh: Banjir Bandang Luapan Kali Pesanggrahan'}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                {isEn ? 'Disaster Hazard Type' : 'Jenis Bencana'}
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as DisasterType)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500 font-mono"
              >
                <option value="flood">{isEn ? 'Flood' : 'Banjir (Flood)'}</option>
                <option value="earthquake">{isEn ? 'Earthquake' : 'Gempa Bumi (Earthquake)'}</option>
                <option value="fire">{isEn ? 'Wildfire / Urban Fire' : 'Kebakaran Hutan / Permukiman'}</option>
                <option value="landslide">{isEn ? 'Landslide' : 'Tanah Longsor (Landslide)'}</option>
                <option value="tsunami">{isEn ? 'Tsunami' : 'Tsunami'}</option>
                <option value="storm">{isEn ? 'Severe Weather / Storm' : 'Cuaca Ekstrem / Badai (Storm)'}</option>
                <option value="volcanic">{isEn ? 'Volcanic Eruption' : 'Erupsi Gunung Berapi'}</option>
                <option value="other">{isEn ? 'Other Hazard' : 'Bencana Lainnya'}</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                {isEn ? 'Severity Level' : 'Tingkat Keparahan (Severity)'}
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as DisasterSeverity)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500 font-mono"
              >
                <option value="critical">{isEn ? 'Critical - Level 1 Emergency' : 'Kritis - Tanggap Darurat Utama (Level 1)'}</option>
                <option value="high">{isEn ? 'High - Level 2 Severe Damage' : 'Tinggi - Kerusakan Parah & Korban (Level 2)'}</option>
                <option value="medium">{isEn ? 'Medium - Regional Posko Response' : 'Sedang - Penanganan Posko Wilayah'}</option>
                <option value="low">{isEn ? 'Low - Advisory Standby' : 'Rendah - Siaga Pemantauan'}</option>
              </select>
            </div>
          </div>

          {/* Location Presets & Coordinates */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                {isEn ? 'Geographic Location & Coordinates' : 'Lokasi & Koordinat Geografis'}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleSelectPreset('jakarta_timur')}
                  className="px-2 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Jakarta Timur
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPreset('jakarta_barat')}
                  className="px-2 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Jakarta Barat
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPreset('banten')}
                  className="px-2 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Banten
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">
                {isEn ? 'Full Address / Hazard Epicenter' : 'Alamat Lengkap / Wilayah Titik Bencana'}
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={isEn ? 'e.g. Jl. Perintis Kemerdekaan, Jatinegara...' : 'Jl. Perintis Kemerdekaan RT 04/RW 02...'}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={locationLat}
                  onChange={(e) => setLocationLat(parseFloat(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={locationLng}
                  onChange={(e) => setLocationLng(parseFloat(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">
              {isEn ? 'Field Situation Narrative' : 'Deskripsi Situasi Lapangan'}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isEn ? 'Describe flood water depth, trapped victims, access road status...' : 'Jelaskan dampak awal, ketinggian air / magnitudo gempa, jumlah korban terperangkap...'}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Impact estimates */}
          <div className="grid grid-cols-3 gap-3 font-mono tabular-nums">
            <div>
              <label className="block text-slate-400 mb-1 text-[11px]">
                {isEn ? 'Est. Affected People' : 'Estimasi Terdampak (Jiwa)'}
              </label>
              <input
                type="number"
                value={affectedPeople}
                onChange={(e) => setAffectedPeople(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 text-[11px]">
                {isEn ? 'Households (KK)' : 'Kepala Keluarga (KK)'}
              </label>
              <input
                type="number"
                value={affectedHouseholds}
                onChange={(e) => setAffectedHouseholds(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 text-[11px]">
                {isEn ? 'Evacuation Shelters' : 'Titik Posko Pengungsi'}
              </label>
              <input
                type="number"
                value={evacuationCenterCount}
                onChange={(e) => setEvacuationCenterCount(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">
              {isEn ? 'Urgent Supplies Needed (comma separated)' : 'Kebutuhan Logistik Mendesak (pisahkan dengan koma)'}
            </label>
            <input
              type="text"
              value={keyNeedsInput}
              onChange={(e) => setKeyNeedsInput(e.target.value)}
              placeholder={isEn ? 'Rubber Boats, Tents, Soup Kitchen, First Aid Kits' : 'Perahu Karet, Tenda Pleton, Dapur Umum, P3K, Genset'}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
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
              {submitting ? (isEn ? 'Saving...' : 'Menyimpan...') : (isEn ? 'Declare & Mobilize' : 'Lapor & Aktifkan Operasi')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
