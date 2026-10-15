import React, { useState, useEffect, useRef } from 'react';
import { Camera, Upload, RotateCcw, Check, X, Shield, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';

export type LogoPreset = 'bnpb' | 'basarnas' | 'pmi' | 'sigap';

interface LogoConfig {
  type: 'preset' | 'custom';
  preset?: LogoPreset;
  customDataUrl?: string;
}

const STORAGE_KEY = 'sigap_app_logo_config';

export function getStoredLogoConfig(): LogoConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load logo config from storage', e);
  }
  return { type: 'preset', preset: 'bnpb' };
}

export function saveLogoConfig(config: LogoConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event('sigap-logo-changed'));
  } catch (e) {
    console.error('Failed to save logo config', e);
  }
}

// Crisp Vector SVG Presets
export const BnpbOfficialEmblem: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Outer gold ring */}
    <circle cx="50" cy="50" r="48" fill="#0A1D37" stroke="#F59E0B" strokeWidth="3" />
    <circle cx="50" cy="50" r="44" stroke="#FBBF24" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
    
    {/* Blue background gradient fill */}
    <circle cx="50" cy="50" r="43" fill="url(#bnpb_grad)" />
    
    {/* Iconic Civil Defense Orange Triangle (Geneva & BNPB/BPBD standard) */}
    <polygon 
      points="50,18 80,72 20,72" 
      fill="url(#orange_grad)" 
      stroke="#FFD54F" 
      strokeWidth="2"
      strokeLinejoin="round"
      className="drop-shadow-md"
    />

    {/* Center Rescue White Star & Compass Cross */}
    <g transform="translate(50, 48) scale(0.7)">
      {/* 4-point tactical star */}
      <polygon points="0,-22 4,-6 20,-4 7,5 11,20 0,10 -11,20 -7,5 -20,-4 -4,-6" fill="#FFFFFF" />
      <polygon points="0,-18 3,-5 16,-3 5,4 9,16 0,8 -9,16 -5,4 -16,-3 -3,-5" fill="#FEF08A" opacity="0.7" />
      <circle cx="0" cy="0" r="3.5" fill="#DC2626" />
    </g>

    {/* Bottom golden ribbon badge */}
    <path d="M 30,78 Q 50,86 70,78 L 68,84 Q 50,91 32,84 Z" fill="#F59E0B" />
    
    {/* Gradients */}
    <defs>
      <linearGradient id="bnpb_grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0E3A75" />
        <stop offset="50%" stopColor="#0B254E" />
        <stop offset="100%" stopColor="#06152B" />
      </linearGradient>
      <linearGradient id="orange_grad" x1="50" y1="18" x2="50" y2="72" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FB923C" />
        <stop offset="60%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
    </defs>
  </svg>
);

export const BasarnasEmblem: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="48" fill="#C2410C" stroke="#FBBF24" strokeWidth="3" />
    <circle cx="50" cy="50" r="43" fill="#EA580C" />
    <circle cx="50" cy="50" r="38" fill="#1E293B" />
    {/* Stylized Rescue Wings and Anchor */}
    <path d="M 22 45 Q 50 30 78 45 Q 65 60 50 68 Q 35 60 22 45 Z" fill="#F59E0B" />
    <circle cx="50" cy="50" r="14" fill="#FFFFFF" />
    <polygon points="50,38 54,46 63,47 56,53 58,62 50,57 42,62 44,53 37,47 46,46" fill="#DC2626" />
    <text x="50" y="85" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" letterSpacing="1">BASARNAS</text>
  </svg>
);

export const PmiEmblem: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#DC2626" strokeWidth="4" />
    <circle cx="50" cy="50" r="43" fill="#F8FAFC" />
    {/* Indonesian Red Cross */}
    <rect x="42" y="24" width="16" height="52" rx="3" fill="#DC2626" />
    <rect x="24" y="42" width="52" height="16" rx="3" fill="#DC2626" />
    <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
  </svg>
);

export const SigapTacticalEmblem: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <polygon points="50,6 90,24 90,62 50,94 10,62 10,24" fill="#0F172A" stroke="#38BDF8" strokeWidth="3" />
    <polygon points="50,14 82,28 82,58 50,84 18,58 18,28" fill="#1E293B" stroke="#0284C7" strokeWidth="1.5" />
    {/* Radar pulse rings */}
    <circle cx="50" cy="50" r="20" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4 3" opacity="0.8" />
    <circle cx="50" cy="50" r="10" stroke="#F97316" strokeWidth="2" />
    <polygon points="50,34 54,45 66,45 56,53 60,65 50,58 40,65 44,53 34,45 46,45" fill="#F59E0B" />
  </svg>
);

export interface SigapLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showEditButton?: boolean;
}

export const SigapLogo: React.FC<SigapLogoProps> = ({ 
  size = 'md', 
  showEditButton = true 
}) => {
  const { t } = useLanguage();
  const [logoConfig, setLogoConfig] = useState<LogoConfig>(getStoredLogoConfig);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleStorageChange = () => {
      setLogoConfig(getStoredLogoConfig());
    };
    window.addEventListener('sigap-logo-changed', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('sigap-logo-changed', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-14 h-14'
  }[size];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreviewError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPreviewError('Mohon pilih file gambar yang valid (PNG, JPG, SVG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPreviewError('Ukuran gambar maksimal 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const newConfig: LogoConfig = {
        type: 'custom',
        customDataUrl: dataUrl
      };
      saveLogoConfig(newConfig);
      setLogoConfig(newConfig);
    };
    reader.onerror = () => {
      setPreviewError('Gagal membaca file gambar');
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: LogoPreset) => {
    const newConfig: LogoConfig = {
      type: 'preset',
      preset
    };
    saveLogoConfig(newConfig);
    setLogoConfig(newConfig);
  };

  const handleResetDefault = () => {
    const newConfig: LogoConfig = {
      type: 'preset',
      preset: 'bnpb'
    };
    saveLogoConfig(newConfig);
    setLogoConfig(newConfig);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Render current logo emblem
  const renderEmblem = (config: LogoConfig, customClass?: string) => {
    const cls = customClass || sizeClasses;
    if (config.type === 'custom' && config.customDataUrl) {
      return (
        <img 
          src={config.customDataUrl} 
          alt="SIGAP Logo" 
          className={`${cls} object-contain rounded-lg drop-shadow-md`}
        />
      );
    }

    switch (config.preset) {
      case 'basarnas':
        return <BasarnasEmblem className={cls} />;
      case 'pmi':
        return <PmiEmblem className={cls} />;
      case 'sigap':
        return <SigapTacticalEmblem className={cls} />;
      case 'bnpb':
      default:
        return <BnpbOfficialEmblem className={cls} />;
    }
  };

  return (
    <>
      <div className="relative group inline-flex items-center">
        <div 
          onClick={() => showEditButton && setIsModalOpen(true)}
          className={`cursor-pointer transition-transform duration-200 hover:scale-105 rounded-xl flex items-center justify-center p-0.5 relative ${
            showEditButton ? 'hover:ring-2 hover:ring-amber-400/50' : ''
          }`}
          title={showEditButton ? t.logoChangeBtn : undefined}
        >
          {renderEmblem(logoConfig)}

          {showEditButton && (
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-900 border border-slate-700 text-amber-400 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity shadow-sm">
              <Camera className="w-2.5 h-2.5" />
            </span>
          )}
        </div>
      </div>

      {/* Logo Customizer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {t.logoSettingsTitle}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {t.logoSettingsDesc}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Current Active Logo Preview */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900/90 border border-slate-700 flex items-center justify-center p-2 shadow-inner">
                    {renderEmblem(logoConfig, 'w-12 h-12')}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Logo Aktif
                    </span>
                    <h4 className="text-sm font-semibold text-white mt-1">
                      {logoConfig.type === 'custom' 
                        ? 'Gambar Kustom Pengguna' 
                        : logoConfig.preset === 'bnpb' ? 'BNPB / BPBD Tanggap Bencana'
                        : logoConfig.preset === 'basarnas' ? 'BASARNAS SAR Nasional'
                        : logoConfig.preset === 'pmi' ? 'Palang Merah Indonesia'
                        : 'SIGAP Taktis Komando'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      Tampil di navbar, mobile drawer, dan dokumen operasi.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetDefault}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {t.logoResetDefault}
                </button>
              </div>

              {/* Upload Custom Image File */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-blue-400" />
                  {t.logoUploadOwn}
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-5 text-center cursor-pointer transition-colors bg-slate-950/40 hover:bg-blue-950/20 group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-white">
                    Klik untuk memilih file gambar dari perangkat Anda
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {t.logoUploadHint}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                {previewError && (
                  <p className="text-xs text-red-400 mt-1">{previewError}</p>
                )}
              </div>

              {/* Preset Logos Section */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  {t.logoPresetsTitle}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Preset 1: BNPB / BPBD */}
                  <button
                    type="button"
                    onClick={() => handleSelectPreset('bnpb')}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      logoConfig.type === 'preset' && logoConfig.preset === 'bnpb'
                        ? 'bg-blue-950/60 border-amber-500/60 ring-1 ring-amber-500/40'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="w-10 h-10 shrink-0">
                      <BnpbOfficialEmblem />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">BNPB / BPBD</span>
                        {logoConfig.type === 'preset' && logoConfig.preset === 'bnpb' && (
                          <Check className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        Segitiga Oranye & Biru Resmi
                      </p>
                    </div>
                  </button>

                  {/* Preset 2: BASARNAS */}
                  <button
                    type="button"
                    onClick={() => handleSelectPreset('basarnas')}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      logoConfig.type === 'preset' && logoConfig.preset === 'basarnas'
                        ? 'bg-blue-950/60 border-amber-500/60 ring-1 ring-amber-500/40'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="w-10 h-10 shrink-0">
                      <BasarnasEmblem />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">BASARNAS</span>
                        {logoConfig.type === 'preset' && logoConfig.preset === 'basarnas' && (
                          <Check className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        Search & Rescue Taktis
                      </p>
                    </div>
                  </button>

                  {/* Preset 3: PMI */}
                  <button
                    type="button"
                    onClick={() => handleSelectPreset('pmi')}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      logoConfig.type === 'preset' && logoConfig.preset === 'pmi'
                        ? 'bg-blue-950/60 border-amber-500/60 ring-1 ring-amber-500/40'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="w-10 h-10 shrink-0">
                      <PmiEmblem />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">PMI</span>
                        {logoConfig.type === 'preset' && logoConfig.preset === 'pmi' && (
                          <Check className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        Palang Merah Indonesia
                      </p>
                    </div>
                  </button>

                  {/* Preset 4: SIGAP Tactical */}
                  <button
                    type="button"
                    onClick={() => handleSelectPreset('sigap')}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      logoConfig.type === 'preset' && logoConfig.preset === 'sigap'
                        ? 'bg-blue-950/60 border-amber-500/60 ring-1 ring-amber-500/40'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="w-10 h-10 shrink-0">
                      <SigapTacticalEmblem />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">SIGAP Taktis</span>
                        {logoConfig.type === 'preset' && logoConfig.preset === 'sigap' && (
                          <Check className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        Perisai Komando Radar
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-md shadow-blue-600/30"
              >
                {t.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
