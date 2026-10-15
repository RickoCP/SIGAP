import React, { useState, useRef, useEffect } from 'react';
import { 
  LogIn, 
  LogOut, 
  User, 
  ShieldCheck, 
  Award, 
  ChevronDown, 
  Radio, 
  CheckCircle2, 
  Sparkles,
  AlertTriangle,
  IdCard,
  SlidersHorizontal
} from 'lucide-react';
import { useAuth, UserRole } from '../../context/AuthContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface UserAuthButtonProps {
  onOpenRegisterModal: () => void;
  onOpenVolunteerPortal: () => void;
}

export const UserAuthButton: React.FC<UserAuthButtonProps> = ({
  onOpenRegisterModal,
  onOpenVolunteerPortal
}) => {
  const { 
    currentUser, 
    userProfile, 
    effectiveRole, 
    simulatedRole, 
    setSimulatedRole,
    loginWithGoogle, 
    logout,
    updateDutyStatus,
    loading 
  } = useAuth();
  const { language } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setLoggingIn(true);
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
    } finally {
      setLoggingIn(false);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'coordinator':
        return {
          label: language === 'id' ? 'Koordinator' : 'Coordinator',
          bg: 'bg-red-500/20 text-red-400 border-red-500/40',
          dot: 'bg-red-400'
        };
      case 'volunteer':
        return {
          label: language === 'id' ? 'Relawan Aktif' : 'Active Volunteer',
          bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
          dot: 'bg-emerald-400'
        };
      case 'public':
      default:
        return {
          label: language === 'id' ? 'Publik / Umum' : 'Public / Guest',
          bg: 'bg-slate-700/40 text-slate-300 border-slate-600',
          dot: 'bg-slate-400'
        };
    }
  };

  const currentBadge = getRoleBadge(effectiveRole);

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-blue-500 animate-spin"></div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {currentUser ? (
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 p-1.5 pl-2 pr-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl transition-all shadow-sm text-left group"
        >
          {currentUser.photoURL ? (
            <img 
              src={currentUser.photoURL} 
              alt={currentUser.displayName || 'User'} 
              className="w-7 h-7 rounded-full object-cover border border-slate-700 group-hover:border-blue-500 transition-colors"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/40">
              {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
            </div>
          )}

          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors leading-tight max-w-[80px] lg:max-w-[110px] truncate">
              {currentUser.displayName || 'Pengguna Google'}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${currentBadge.dot}`}></span>
              <span className="text-[10px] text-slate-400 font-medium">
                {currentBadge.label}
              </span>
            </div>
          </div>

          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-colors" />
        </button>
      ) : (
        <button
          onClick={handleGoogleLogin}
          disabled={loggingIn}
          className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-900 rounded-lg font-bold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{loggingIn ? (language === 'id' ? 'Menghubungkan...' : 'Signing in...') : (language === 'id' ? 'Masuk Google' : 'Google Sign-In')}</span>
        </button>
      )}

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-3 text-slate-200 divide-y divide-slate-800/80 animate-in fade-in zoom-in-95 duration-150">
          {/* Header Account Info */}
          <div className="pb-3 flex items-start gap-3">
            {currentUser?.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover border-2 border-slate-700 shrink-0" 
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                {currentUser?.displayName?.[0] || 'U'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white truncate">
                {currentUser?.displayName || 'Pengguna SIGAP'}
              </h4>
              <p className="text-xs text-slate-400 truncate">
                {currentUser?.email}
              </p>
              <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${currentBadge.bg}">
                <span className={`w-1.5 h-1.5 rounded-full ${currentBadge.dot}`}></span>
                <span>{currentBadge.label}</span>
              </div>
            </div>
          </div>

          {/* Volunteer Status / Register CTA */}
          <div className="py-2.5 space-y-2">
            {userProfile?.isVolunteer ? (
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400 font-medium">
                    {language === 'id' ? 'Status Siaga Lapangan:' : 'Field Readiness Status:'}
                  </span>
                  <span className="font-bold text-emerald-400">
                    {userProfile.volunteerData?.dutyStatus === 'on_duty' 
                      ? (language === 'id' ? 'Sedang Bertugas' : 'On Duty') 
                      : (userProfile.volunteerData?.dutyStatus === 'standby' 
                          ? (language === 'id' ? 'Siaga (Standby)' : 'Standby') 
                          : (language === 'id' ? 'Istirahat' : 'Off Duty'))}
                  </span>
                </div>
                {/* Duty Switcher */}
                <div className="grid grid-cols-3 gap-1 text-[10px] font-bold">
                  <button
                    onClick={() => updateDutyStatus('standby')}
                    className={`py-1 rounded text-center transition-colors ${
                      userProfile.volunteerData?.dutyStatus === 'standby'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {language === 'id' ? 'Siaga' : 'Standby'}
                  </button>
                  <button
                    onClick={() => updateDutyStatus('on_duty')}
                    className={`py-1 rounded text-center transition-colors ${
                      userProfile.volunteerData?.dutyStatus === 'on_duty'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {language === 'id' ? 'Tugas' : 'Duty'}
                  </button>
                  <button
                    onClick={() => updateDutyStatus('off_duty')}
                    className={`py-1 rounded text-center transition-colors ${
                      userProfile.volunteerData?.dutyStatus === 'off_duty'
                        ? 'bg-slate-700 text-slate-300 border border-slate-600'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {language === 'id' ? 'Istirahat' : 'Off'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  onOpenRegisterModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
              >
                <Award className="w-4 h-4" />
                <span>{language === 'id' ? 'Daftar Sebagai Relawan' : 'Register as Volunteer'}</span>
              </button>
            )}

            <button
              onClick={() => {
                setDropdownOpen(false);
                onOpenVolunteerPortal();
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <span className="flex items-center gap-2">
                <IdCard className="w-3.5 h-3.5 text-blue-400" />
                <span>{language === 'id' ? 'Kartu ID & Misi Relawan' : 'Volunteer ID & Tasks'}</span>
              </span>
              <span className="text-[10px] text-amber-400 font-bold bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">
                {userProfile?.volunteerData?.points || 0} {language === 'id' ? 'Poin' : 'Pts'}
              </span>
            </button>
          </div>

          {/* RBAC Persona Switcher (For testing permissions) */}
          <div className="py-2.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-2 px-1">
              <span className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3 h-3 text-blue-400" />
                <span>{language === 'id' ? 'Simulasi Hak Akses (RBAC)' : 'Access Persona Simulator'}</span>
              </span>
              {simulatedRole && (
                <button
                  onClick={() => setSimulatedRole(null)}
                  className="text-[10px] text-blue-400 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="space-y-1">
              <button
                onClick={() => setSimulatedRole('public')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  effectiveRole === 'public'
                    ? 'bg-blue-600/20 text-blue-300 font-bold border border-blue-500/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  <span>{language === 'id' ? '1. Umum / Publik' : '1. General Public'}</span>
                </span>
                {effectiveRole === 'public' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
              </button>

              <button
                onClick={() => setSimulatedRole('volunteer')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  effectiveRole === 'volunteer'
                    ? 'bg-emerald-600/20 text-emerald-300 font-bold border border-emerald-500/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>{language === 'id' ? '2. User Terdaftar (Relawan)' : '2. Registered Volunteer'}</span>
                </span>
                {effectiveRole === 'volunteer' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>

              <button
                onClick={() => setSimulatedRole('coordinator')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  effectiveRole === 'coordinator'
                    ? 'bg-red-600/20 text-red-300 font-bold border border-red-500/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  <span>{language === 'id' ? '3. Koordinator / Tim Berwenang' : '3. Command Coordinator'}</span>
                </span>
                {effectiveRole === 'coordinator' && <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />}
              </button>
            </div>
          </div>

          {/* Logout */}
          <div className="pt-2">
            <button
              onClick={() => {
                setDropdownOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{language === 'id' ? 'Keluar Akun Google' : 'Sign Out Google'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
