import React from 'react';
import { X, Lock, ShieldAlert, UserCheck, ShieldCheck, ArrowRight, UserPlus, SlidersHorizontal } from 'lucide-react';
import { useAuth, UserRole } from '../../context/AuthContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface RoleAccessGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredRole: 'volunteer' | 'coordinator';
  featureTitle: string;
  onOpenRegisterVolunteer: () => void;
}

export const RoleAccessGateModal: React.FC<RoleAccessGateModalProps> = ({
  isOpen,
  onClose,
  requiredRole,
  featureTitle,
  onOpenRegisterVolunteer
}) => {
  const { currentUser, loginWithGoogle, setSimulatedRole, effectiveRole } = useAuth();
  const { language } = useLanguage();

  if (!isOpen) return null;

  const isCoord = requiredRole === 'coordinator';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
            isCoord 
              ? 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-lg shadow-red-500/10' 
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/10'
          }`}>
            {isCoord ? <ShieldAlert className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
          </div>

          <h3 className="text-lg font-black tracking-tight text-white mb-1">
            {language === 'id' ? 'Akses Khusus Dibatasi' : 'Restricted Access'}
          </h3>

          <p className="text-xs text-slate-300 font-medium mb-3">
            {language === 'id' 
              ? `Fitur '${featureTitle}' hanya dapat diakses oleh ${isCoord ? 'Koordinator / Tim Berwenang Komando Bencana' : 'User Terdaftar sebagai Relawan'}.`
              : `The feature '${featureTitle}' requires ${isCoord ? 'Command Coordinator Authority' : 'Registered Volunteer Access'}.`}
          </p>

          <div className="w-full bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-left text-xs space-y-2 mb-5">
            <div className="flex items-center justify-between text-slate-400">
              <span>Status Anda Saat Ini:</span>
              <span className="font-bold text-slate-200 capitalize">
                {effectiveRole === 'coordinator' 
                  ? 'Koordinator' 
                  : (effectiveRole === 'volunteer' ? 'Relawan Terdaftar' : 'Publik / Umum')}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Tingkat Hak Akses Diperlukan:</span>
              <span className={`font-bold ${isCoord ? 'text-red-400' : 'text-emerald-400'}`}>
                {isCoord ? 'Tingkat 3 (Koordinator Lapangan)' : 'Tingkat 2 (Relawan Terdaftar)'}
              </span>
            </div>
          </div>

          <div className="w-full space-y-2.5">
            {!currentUser && (
              <button
                onClick={async () => {
                  await loginWithGoogle();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold transition-all shadow-md active:scale-98"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{language === 'id' ? 'Masuk dengan Google' : 'Sign in with Google'}</span>
              </button>
            )}

            {!isCoord && (
              <button
                onClick={() => {
                  onClose();
                  onOpenRegisterVolunteer();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/30"
              >
                <UserPlus className="w-4 h-4" />
                <span>{language === 'id' ? 'Daftar Sebagai Relawan Sekarang' : 'Register as Volunteer Now'}</span>
              </button>
            )}

            {/* Quick RBAC Switch for demonstration */}
            <div className="pt-2 border-t border-slate-800">
              <p className="text-[11px] text-slate-400 mb-2">
                {language === 'id' ? 'Untuk keperluan pengujian/evaluasi sistem:' : 'For system testing/evaluation:'}
              </p>
              <button
                onClick={() => {
                  setSimulatedRole(isCoord ? 'coordinator' : 'volunteer');
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
                <span>
                  {language === 'id' 
                    ? `Beralih ke Persona ${isCoord ? 'Koordinator' : 'Relawan'}` 
                    : `Switch to ${isCoord ? 'Coordinator' : 'Volunteer'} Persona`}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
