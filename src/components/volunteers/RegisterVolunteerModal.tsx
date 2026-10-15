import React, { useState, useEffect } from 'react';
import { X, UserPlus, MapPin, Award, CheckCircle2, Shield } from 'lucide-react';
import { Volunteer, SkillProficiency } from '../../types/index.ts';
import { SEED_SKILLS } from '../../data/seedData.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface RegisterVolunteerModalProps {
  onClose: () => void;
  onRegister: (volunteerData: Omit<Volunteer, 'id' | 'activeTasksCount' | 'completedTasksCount' | 'joinedDate'>) => Promise<void>;
}

export const RegisterVolunteerModal: React.FC<RegisterVolunteerModalProps> = ({
  onClose,
  onRegister,
}) => {
  const { currentUser, loginWithGoogle, registerAsVolunteer } = useAuth();
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [name, setName] = useState(currentUser?.displayName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('0812-');
  const [organization, setOrganization] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Jakarta Selatan');
  const [bloodType, setBloodType] = useState('O+');
  const [locationLat, setLocationLat] = useState<number>(-6.225);
  const [locationLng, setLocationLng] = useState<number>(106.85);
  const [radiusKm, setRadiusKm] = useState<number>(30);
  const [status, setStatus] = useState<Volunteer['status']>('available');
  const [category, setCategory] = useState<Volunteer['category']>('public_community');
  const [sarUnitOrRole, setSarUnitOrRole] = useState('');

  useEffect(() => {
    if (currentUser) {
      if (currentUser.displayName && !name) setName(currentUser.displayName);
      if (currentUser.email && !email) setEmail(currentUser.email);
    }
  }, [currentUser]);

  // Selected skills state: map of skillId -> proficiency
  const [selectedSkills, setSelectedSkills] = useState<Record<string, SkillProficiency>>({
    'skill-med-4': 'intermediate', // First aid default
  });

  const [submitting, setSubmitting] = useState(false);

  const toggleSkill = (skillId: string) => {
    setSelectedSkills(prev => {
      const copy = { ...prev };
      if (copy[skillId]) {
        delete copy[skillId];
      } else {
        copy[skillId] = 'intermediate';
      }
      return copy;
    });
  };

  const setProficiency = (skillId: string, prof: SkillProficiency) => {
    setSelectedSkills(prev => ({
      ...prev,
      [skillId]: prof,
    }));
  };

  const handleSelectCityPreset = (cityName: string, lat: number, lng: number) => {
    setCity(cityName);
    setLocationLat(lat);
    setLocationLng(lng);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const skillsArray = Object.entries(selectedSkills).map(([skillId, proficiency]) => ({
      skillId,
      proficiency,
    }));

    if (skillsArray.length === 0) {
      alert(isEn ? 'Please select at least 1 volunteer skill' : 'Pilih minimal 1 keahlian relawan');
      return;
    }

    setSubmitting(true);
    try {
      if (currentUser) {
        try {
          await registerAsVolunteer({
            name,
            phone,
            city,
            organization: organization || (isEn ? 'Independent Volunteer' : 'Relawan Mandiri'),
            category: category || 'public_community',
            sarUnitOrRole: sarUnitOrRole || (category === 'sar_official' ? (isEn ? 'Official SAR Team Member' : 'Anggota Regu Potensi SAR') : (isEn ? 'Citizen Volunteer' : 'Relawan Komunitas Warga')),
            skills: skillsArray,
            bloodType,
            status
          });
        } catch (e) {
          console.warn('Firebase registration sync note:', e);
        }
      }

      await onRegister({
        name,
        email: email || (currentUser?.email ? currentUser.email : `${name.toLowerCase().replace(/\s+/g, '.')}@relawan.id`),
        phone,
        organization: organization || (isEn ? 'Independent Volunteer' : 'Relawan Mandiri'),
        address: address || `Jl. Raya ${city}`,
        city,
        locationLat,
        locationLng,
        radiusKm,
        status,
        category,
        sarUnitOrRole: sarUnitOrRole || (category === 'sar_official' ? (isEn ? 'Official SAR Team Member' : 'Anggota Regu Potensi SAR') : (isEn ? 'Citizen Volunteer' : 'Relawan Komunitas Warga')),
        skills: skillsArray,
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
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {language === 'id' ? 'Pendaftaran Relawan Kemanusiaan' : 'Humanitarian Volunteer Registration'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'id' 
                  ? 'Terbuka untuk semua kalangan masyarakat & rescuer resmi Indonesia'
                  : 'Open to all citizens and official rescue personnel'}
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

        {/* Google Ecosystem Badge / Link CTA */}
        <div className="px-6 pt-5">
          {currentUser ? (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center justify-between text-xs text-emerald-300">
              <div className="flex items-center gap-2.5">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="Google" className="w-6 h-6 rounded-full border border-emerald-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
                <span>
                  <strong>{language === 'id' ? 'Akun Google Terverifikasi:' : 'Google Account Connected:'}</strong> {currentUser.email}
                </span>
              </div>
              <span className="text-[10px] font-bold bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300">
                SSO READY
              </span>
            </div>
          ) : (
            <div className="p-3 bg-slate-950 border border-blue-500/30 rounded-xl flex items-center justify-between gap-3 text-xs">
              <div className="text-slate-300">
                <span className="font-bold text-white block">
                  {language === 'id' ? 'Hubungkan Akun Google' : 'Connect Google Account'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {language === 'id' ? 'Otomatis mengisi identitas & menerbitkan KTA Digital' : 'Auto-fill details & receive Digital ID'}
                </span>
              </div>
              <button
                type="button"
                onClick={loginWithGoogle}
                className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-950 rounded-lg font-bold text-xs shrink-0 shadow-sm transition-all"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Google</span>
              </button>
            </div>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                {isEn ? 'Full Name & Title' : 'Nama Lengkap & Gelar'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isEn ? 'e.g. Dr. Farhan Malik / Rian Sanjaya' : 'Contoh: dr. Farhan Malik / Rian Sanjaya'}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                {isEn ? 'Active WhatsApp / Phone Number' : 'Nomor WhatsApp / HP Aktif'}
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812-3456-7890"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isEn ? 'volunteer@sigap.id' : 'farhan@relawan.id'}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                {isEn ? 'Community / Affiliation / NGO' : 'Komunitas / Lembaga Asal'}
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder={isEn ? 'Red Cross / SAR / Independent Volunteer' : 'PMI / BSMI / SAR / Relawan Independen'}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Korps Relawan (SAR vs Masyarakat Umum) */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
            <label className="block text-slate-300 font-bold">
              {isEn ? 'Volunteer Corps Category:' : 'Kategori Korps Relawan:'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label 
                onClick={() => setCategory('sar_official')}
                className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                  category === 'sar_official'
                    ? 'bg-amber-950/40 border-amber-500 text-white shadow-md shadow-amber-950/30'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <input
                  type="radio"
                  name="volCategory"
                  checked={category === 'sar_official'}
                  onChange={() => setCategory('sar_official')}
                  className="mt-0.5 text-amber-500 focus:ring-amber-500"
                />
                <div>
                  <div className="font-bold text-amber-400 flex items-center gap-1">
                    <span>🛡️</span> {isEn ? 'Official SAR Team (Basarnas / Certified SAR)' : 'Tim SAR Resmi (Basarnas / Potensi SAR)'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {isEn 
                      ? 'Certified in search & rescue, swift water rescue, or Urban SAR.'
                      : 'Memiliki sertifikasi pencarian dan penyelamatan resmi, water rescue, atau USAR.'}
                  </div>
                </div>
              </label>

              <label 
                onClick={() => setCategory('public_community')}
                className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                  category === 'public_community'
                    ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md shadow-emerald-950/30'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <input
                  type="radio"
                  name="volCategory"
                  checked={category === 'public_community'}
                  onChange={() => setCategory('public_community')}
                  className="mt-0.5 text-emerald-500 focus:ring-emerald-500"
                />
                <div>
                  <div className="font-bold text-emerald-400 flex items-center gap-1">
                    <span>🤝</span> {isEn ? 'General Citizen Volunteer / Community' : 'Relawan Masyarakat Umum / Komunitas'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {isEn 
                      ? 'Local citizens, field kitchens, logistics distribution, trauma healing, & shelter support.'
                      : 'Warga masyarakat, pemuda, dapur umum, logistik, trauma healing, & dukungan posko.'}
                  </div>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                {isEn ? 'Specific Role / Squad Unit (Optional)' : 'Peran Spesifik / Regu Unit (Opsional)'}
              </label>
              <input
                type="text"
                value={sarUnitOrRole}
                onChange={(e) => setSarUnitOrRole(e.target.value)}
                placeholder={
                  category === 'sar_official' 
                    ? (isEn ? 'e.g. Inflatable Boat SAR Diver / Mountain Rescue Squad' : 'Contoh: Regu Selam LCR Kansar / Potensi SAR Mapala') 
                    : (isEn ? 'e.g. Field Kitchen Coordinator / Relief Aid Distribution' : 'Contoh: Koordinator Dapur Umum RW / Distribusi Sembako')
                }
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Location & Radius */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                {isEn ? 'Domicile & Operational Readiness Area' : 'Domisili & Wilayah Siaga'}
              </span>

              {/* City Presets */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleSelectCityPreset('Jakarta Selatan', -6.26, 106.81)}
                  className="px-2 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Jaksel
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectCityPreset('Jakarta Timur', -6.22, 106.87)}
                  className="px-2 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Jaktim
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectCityPreset('Tangerang', -6.21, 106.63)}
                  className="px-2 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Tangerang
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectCityPreset('Bogor', -6.59, 106.80)}
                  className="px-2 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Bogor
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">{isEn ? 'City / Regency' : 'Kota / Kabupaten'}</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  {isEn ? 'Street Address / Gathering Point' : 'Alamat Domisili / Titik Kumpul'}
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={isEn ? 'e.g. Main Street No. 12' : 'Jl. Tebet Barat Dalam No. 12'}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Lat</label>
                <input
                  type="number"
                  step="0.0001"
                  value={locationLat}
                  onChange={(e) => setLocationLat(parseFloat(e.target.value))}
                  className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Lng</label>
                <input
                  type="number"
                  step="0.0001"
                  value={locationLng}
                  onChange={(e) => setLocationLng(parseFloat(e.target.value))}
                  className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">
                  {isEn ? `Radius: ${radiusKm} km` : `Radius: ${radiusKm} km`}
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                  className="w-full mt-2 accent-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Skills Checklist with Proficiency Selection */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-blue-400" />
                {isEn ? 'Skills & Competencies (Select applicable skills)' : 'Keahlian & Kompetensi (Pilih yang Anda Kuasai)'}
              </span>
              <span className="text-[11px] text-blue-400 font-mono">
                {isEn ? `${Object.keys(selectedSkills).length} Selected` : `${Object.keys(selectedSkills).length} Dipilih`}
              </span>
            </label>

            <div className="max-h-48 overflow-y-auto divide-y divide-slate-800/80 border border-slate-800 rounded-xl bg-slate-950/40 p-2 space-y-1">
              {SEED_SKILLS.map(skill => {
                const isChecked = !!selectedSkills[skill.id];
                const currentProf = selectedSkills[skill.id] || 'intermediate';

                return (
                  <div
                    key={skill.id}
                    className="p-2 flex items-center justify-between gap-3 rounded-lg hover:bg-slate-900/60"
                  >
                    <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSkill(skill.id)}
                        className="rounded border-slate-700 text-blue-600 focus:ring-0 w-4 h-4"
                      />
                      <div>
                        <span className="text-white font-medium block">{skill.name}</span>
                        <span className="text-slate-500 text-[10px]">{skill.category.toUpperCase()} · {skill.description}</span>
                      </div>
                    </label>

                    {isChecked && (
                      <select
                        value={currentProf}
                        onChange={(e) => setProficiency(skill.id, e.target.value as SkillProficiency)}
                        className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-[11px] text-blue-300 font-mono"
                      >
                        <option value="beginner">{isEn ? 'Beginner' : 'Pemula'}</option>
                        <option value="intermediate">{isEn ? 'Intermediate' : 'Menengah'}</option>
                        <option value="expert">{isEn ? 'Expert / Certified' : 'Ahli / Bersertifikat'}</option>
                      </select>
                    )}
                  </div>
                );
              })}
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
              <UserPlus className="w-4 h-4" />
              {submitting ? (isEn ? 'Registering...' : 'Mendaftarkan...') : (isEn ? 'Register as Volunteer' : 'Daftar Sebagai Relawan')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
