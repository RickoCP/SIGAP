import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Shield, 
  Plus, 
  RotateCcw, 
  Map, 
  Users, 
  AlertTriangle, 
  Globe, 
  Lock, 
  IdCard, 
  HardDrive, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  Award, 
  Radio, 
  Activity, 
  Compass, 
  Layers, 
  FileText,
  Check,
  Menu,
  Siren,
  HeartHandshake,
  BookOpen
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { SigapLogo } from './SigapLogo.tsx';
import { UserAuthButton } from '../auth/UserAuthButton.tsx';
import { PWAInstallButton } from '../pwa/PWAInstallButton.tsx';
import { FieldNotificationBell } from '../notifications/FieldNotificationBell.tsx';

export type NavTab = 
  | 'presentation'
  | 'documentation'
  | 'macro-map'
  | 'early-warning'
  | 'donations'
  | 'volunteer-portal'
  | 'volunteer-map'
  | 'readiness'
  | 'rewards'
  | 'map'
  | 'disasters'
  | 'volunteers'
  | 'tasks'
  | 'analytics';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenCreateDisaster: () => void;
  onOpenRegisterVolunteer: () => void;
  onResetDemo: () => void;
  onRequireRole: (role: 'volunteer' | 'coordinator', featureTitle: string) => void;
  onOpenOfflineManager?: () => void;
  cachedTilesCount?: number;
}

interface TabDefinition {
  id: NavTab;
  label: string;
  shortLabel?: string;
  icon: React.ReactNode;
  category: 'overview' | 'volunteer' | 'tactical';
  requiredRole?: 'coordinator' | 'volunteer';
  badge?: string;
  badgeColor?: string;
  accentColor: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenCreateDisaster,
  onOpenRegisterVolunteer,
  onResetDemo,
  onRequireRole,
  onOpenOfflineManager,
  cachedTilesCount = 0,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { effectiveRole, isCoordinator, isVolunteer } = useAuth();
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownMenuRef.current && !dropdownMenuRef.current.contains(e.target as Node)) {
        setIsDropdownMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Check scroll positions for visual overflow cues
  const checkScrollState = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    checkScrollState();
    window.addEventListener('resize', checkScrollState);
    return () => window.removeEventListener('resize', checkScrollState);
  }, [checkScrollState]);

  // Scroll active tab into view when activeTab changes
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const activeBtn = el.querySelector(`[data-tab-id="${activeTab}"]`) as HTMLElement;
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeTab]);

  const scrollTabs = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = direction === 'left' ? -260 : 260;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(checkScrollState, 350);
  };

  const handleProtectedTabClick = (tab: NavTab, requiredRole?: 'volunteer' | 'coordinator', title?: string) => {
    if (requiredRole === 'coordinator' && !isCoordinator) {
      onRequireRole('coordinator', title || 'Menu Koordinator');
      return;
    }
    if (requiredRole === 'volunteer' && !isVolunteer) {
      onRequireRole('volunteer', title || 'Menu Relawan');
      return;
    }
    onTabChange(tab);
    setIsDropdownMenuOpen(false);
  };

  const handleCreateDisasterClick = () => {
    if (!isCoordinator) {
      onRequireRole('coordinator', language === 'id' ? 'Deklarasi Bencana Baru' : 'Declare New Disaster');
      return;
    }
    onOpenCreateDisaster();
  };

  // Comprehensive tab list organized by function
  const allTabs: TabDefinition[] = [
    {
      id: 'presentation',
      label: t.navPresentation || (language === 'id' ? 'Presentasi Proyek' : 'Project Showcase'),
      shortLabel: language === 'id' ? 'Presentasi' : 'Showcase',
      icon: <Sparkles className="w-3.5 h-3.5 text-indigo-300" />,
      category: 'overview',
      badge: language === 'id' ? 'Presentasi' : 'Showcase',
      badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-700/60',
      accentColor: 'indigo'
    },
    {
      id: 'documentation',
      label: language === 'id' ? 'Buku Panduan & Docs' : 'User Guide & Docs',
      shortLabel: language === 'id' ? 'Panduan' : 'Guide',
      icon: <BookOpen className="w-3.5 h-3.5 text-teal-400" />,
      category: 'overview',
      badge: language === 'id' ? 'Panduan' : 'Docs',
      badgeColor: 'bg-teal-950 text-teal-300 border-teal-700/60',
      accentColor: 'teal'
    },
    {
      id: 'macro-map',
      label: t.navMacroMap,
      shortLabel: language === 'id' ? 'Peta Makro' : 'Macro Map',
      icon: <Globe className="w-3.5 h-3.5 text-red-400" />,
      category: 'overview',
      accentColor: 'red'
    },
    {
      id: 'early-warning',
      label: t.navEarlyWarning,
      shortLabel: language === 'id' ? 'EWS Publik' : 'EWS Alert',
      icon: <Siren className="w-3.5 h-3.5 text-rose-400" />,
      category: 'overview',
      badge: 'SIAGA',
      badgeColor: 'bg-rose-950 text-rose-300 border-rose-800/80 animate-pulse',
      accentColor: 'rose'
    },
    {
      id: 'donations',
      label: t.navDonations,
      shortLabel: language === 'id' ? 'Donasi' : 'Donations',
      icon: <HeartHandshake className="w-3.5 h-3.5 text-pink-400" />,
      category: 'overview',
      badge: 'Peduli',
      badgeColor: 'bg-pink-950 text-pink-300 border-pink-800/80',
      accentColor: 'pink'
    },
    {
      id: 'volunteer-portal',
      label: t.navVolunteerPortal,
      shortLabel: language === 'id' ? 'Portal KTA' : 'Portal',
      icon: <IdCard className="w-3.5 h-3.5 text-emerald-400" />,
      category: 'volunteer',
      accentColor: 'emerald'
    },
    {
      id: 'volunteer-map',
      label: t.navVolunteerMap,
      shortLabel: language === 'id' ? 'Peta Relawan' : 'Vol Map',
      icon: <Users className="w-3.5 h-3.5 text-emerald-400" />,
      category: 'volunteer',
      accentColor: 'emerald'
    },
    {
      id: 'readiness',
      label: t.navReadiness,
      shortLabel: language === 'id' ? 'Kesiapan' : 'Readiness',
      icon: <Activity className="w-3.5 h-3.5 text-amber-400" />,
      category: 'overview',
      accentColor: 'amber'
    },
    {
      id: 'rewards',
      label: t.navRewards,
      shortLabel: language === 'id' ? 'Gamifikasi' : 'Rewards',
      icon: <Award className="w-3.5 h-3.5 text-yellow-400" />,
      category: 'volunteer',
      accentColor: 'yellow'
    },
    {
      id: 'map',
      label: t.navTacticalMap,
      shortLabel: language === 'id' ? 'Peta Taktis' : 'Tactical',
      icon: <Radio className="w-3.5 h-3.5 text-blue-400" />,
      category: 'tactical',
      requiredRole: 'coordinator',
      accentColor: 'blue'
    },
    {
      id: 'disasters',
      label: t.navDisasters,
      shortLabel: language === 'id' ? 'Operasi' : 'Operations',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
      category: 'tactical',
      requiredRole: 'coordinator',
      accentColor: 'rose'
    },
    {
      id: 'volunteers',
      label: t.navVolunteers,
      shortLabel: language === 'id' ? 'Data Relawan' : 'Volunteers',
      icon: <Shield className="w-3.5 h-3.5 text-cyan-400" />,
      category: 'tactical',
      requiredRole: 'coordinator',
      accentColor: 'cyan'
    },
    {
      id: 'tasks',
      label: t.navTasks,
      shortLabel: language === 'id' ? 'Tugas' : 'Tasks',
      icon: <Layers className="w-3.5 h-3.5 text-violet-400" />,
      category: 'tactical',
      requiredRole: 'coordinator',
      accentColor: 'violet'
    },
    {
      id: 'analytics',
      label: t.navAnalytics,
      shortLabel: language === 'id' ? 'Laporan' : 'Reports',
      icon: <FileText className="w-3.5 h-3.5 text-blue-400" />,
      category: 'tactical',
      requiredRole: 'coordinator',
      accentColor: 'blue'
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/98 backdrop-blur-md border-b border-slate-800 shadow-xl">
      {/* =========================================================================
          ROW 1: PRIMARY HEADER BAR (BRAND & RESPONSIVE ACTION CONTROLS)
          Never overflows or cuts off buttons on any viewport
         ========================================================================= */}
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Identity */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 min-w-0">
          <SigapLogo size="md" showEditButton={true} />
          <div className="flex flex-col min-w-0">
            <button
              onClick={() => onTabChange('presentation')}
              className="text-base sm:text-lg font-black tracking-tight text-white hover:text-blue-400 transition-colors whitespace-nowrap text-left leading-none"
              title="Buka Halaman Presentasi Proyek SIGAP"
            >
              {t.brandTitle}
            </button>
            <span className="text-[10px] text-slate-400 font-medium tracking-tight mt-0.5 hidden lg:inline truncate">
              {t.brandSubtitle}
            </span>
          </div>
        </div>

        {/* Action Controls & User Auth Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-bold shrink-0">
            <button
              onClick={() => setLanguage('id')}
              title="Bahasa Indonesia"
              className={`px-1.5 sm:px-2 py-1 rounded flex items-center gap-1 transition-all text-[11px] ${
                language === 'id'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🇮🇩</span>
              <span className="hidden sm:inline">ID</span>
            </button>
            <button
              onClick={() => setLanguage('en')}
              title="English"
              className={`px-1.5 sm:px-2 py-1 rounded flex items-center gap-1 transition-all text-[11px] ${
                language === 'en'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🇬🇧</span>
              <span className="hidden sm:inline">EN</span>
            </button>
          </div>

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Offline Map Cache Quick Status Button */}
          {onOpenOfflineManager && (
            <button
              onClick={onOpenOfflineManager}
              title={language === 'id' ? 'Status Cache Peta & Data Offline' : 'Offline Map & Data Cache Status'}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-slate-800 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white transition text-xs font-semibold shrink-0"
            >
              <HardDrive className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="hidden xl:inline text-[11px]">
                {cachedTilesCount > 0 ? `${cachedTilesCount} Tile` : 'Peta Offline'}
              </span>
            </button>
          )}

          {/* Field Radio Task Notification Bell */}
          <FieldNotificationBell
            onNavigateToMap={() => onTabChange('map')}
            onNavigateToVolunteerPortal={() => onTabChange('volunteer-portal')}
          />

          {/* User Auth Google / RBAC Switcher */}
          <UserAuthButton 
            onOpenRegisterModal={onOpenRegisterVolunteer} 
            onOpenVolunteerPortal={() => onTabChange('volunteer-portal')} 
          />

          {/* Reset Demo Button */}
          <button
            onClick={onResetDemo}
            title={t.btnResetDemo}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden 2xl:inline text-xs">{t.btnResetDemo}</span>
          </button>

          {/* Register Volunteer Action Button */}
          <button
            onClick={onOpenRegisterVolunteer}
            title={t.btnRegisterVol}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-850 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap border border-slate-700 shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="hidden md:inline">{t.btnRegisterVol}</span>
            <span className="md:hidden">Relawan</span>
          </button>

          {/* Declare New Disaster Action Button */}
          <button
            onClick={handleCreateDisasterClick}
            title={t.btnDeclareDisaster}
            className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 ${
              isCoordinator
                ? 'text-white bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
                : 'text-slate-300 bg-slate-800 hover:bg-slate-750 border border-slate-700'
            }`}
          >
            {!isCoordinator ? <Lock className="w-3 h-3 text-amber-400 shrink-0" /> : <Plus className="w-3.5 h-3.5 text-white shrink-0" />}
            <span className="hidden sm:inline">{t.btnDeclareDisaster}</span>
            <span className="sm:hidden">Bencana</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          ROW 2: UNIFIED OPTION TABS SUB-NAV (NEVER CUT OFF, HORIZONTAL SCROLL + ARROWS)
          Works smoothly across all viewport widths with left/right fade cues
         ========================================================================= */}
      <div className="relative border-t border-slate-800/90 bg-slate-950/90 px-2 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between">
          
          {/* Scroll Left Arrow Button */}
          <button
            onClick={() => scrollTabs('left')}
            disabled={!canScrollLeft}
            className={`hidden md:flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all mr-1.5 shrink-0 disabled:opacity-20 disabled:pointer-events-none z-10 shadow-md`}
            title="Gulir tab ke kiri"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Left Gradient Shadow for visual scroll overflow indicator */}
          {canScrollLeft && (
            <div className="pointer-events-none absolute left-0 sm:left-6 md:left-14 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-950 to-transparent z-10" />
          )}

          {/* Horizontal Scrollable Tabs Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollState}
            className="flex-1 flex items-center overflow-x-auto no-scrollbar scroll-smooth touch-pan-x gap-1 py-1.5 px-0.5"
          >
            {allTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const isLocked = tab.requiredRole === 'coordinator' && !isCoordinator;

              // Color styles for active tab states
              let activeStyle = 'bg-blue-950 text-blue-300 font-bold border-blue-500 shadow-sm';
              if (tab.id === 'presentation') {
                activeStyle = 'bg-indigo-950/90 text-indigo-200 font-black border-indigo-500 shadow-md shadow-indigo-950/40 ring-1 ring-indigo-500/50';
              } else if (tab.id === 'macro-map') {
                activeStyle = 'bg-red-950/90 text-red-200 font-black border-red-500 shadow-sm shadow-red-950/30';
              } else if (tab.id === 'volunteer-portal' || tab.id === 'volunteer-map') {
                activeStyle = 'bg-emerald-950/90 text-emerald-200 font-black border-emerald-500 shadow-sm shadow-emerald-950/30';
              } else if (tab.id === 'readiness') {
                activeStyle = 'bg-amber-950/90 text-amber-200 font-black border-amber-500 shadow-sm shadow-amber-950/30';
              } else if (tab.id === 'rewards') {
                activeStyle = 'bg-yellow-950/90 text-yellow-200 font-black border-yellow-500 shadow-sm shadow-yellow-950/30';
              }

              return (
                <button
                  key={tab.id}
                  data-tab-id={tab.id}
                  onClick={() => handleProtectedTabClick(tab.id, tab.requiredRole, tab.label)}
                  className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                    isActive
                      ? activeStyle
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 hover:border-slate-800'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {isLocked && <Lock className="w-2.5 h-2.5 text-slate-500 shrink-0" />}
                  {tab.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider border ${tab.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Gradient Shadow for visual scroll overflow indicator */}
          {canScrollRight && (
            <div className="pointer-events-none absolute right-10 sm:right-16 md:right-32 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-950 to-transparent z-10" />
          )}

          {/* Scroll Right Arrow Button */}
          <button
            onClick={() => scrollTabs('right')}
            disabled={!canScrollRight}
            className={`hidden md:flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all ml-1.5 shrink-0 disabled:opacity-20 disabled:pointer-events-none z-10 shadow-md`}
            title="Gulir tab ke kanan"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Quick Dropdown Menu ("Semua Halaman ▾") */}
          <div className="relative shrink-0 ml-1.5" ref={dropdownMenuRef}>
            <button
              onClick={() => setIsDropdownMenuOpen(!isDropdownMenuOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition shadow-sm"
              title="Daftar Cepat Semua Halaman SIGAP"
            >
              <Menu className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline text-[11px]">
                {language === 'id' ? 'Semua Menu' : 'All Tabs'}
              </span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isDropdownMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Modal Container */}
            {isDropdownMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-slate-700/80 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2">
                <div className="px-2.5 py-1.5 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Navigasi Cepat SIGAP
                  </span>
                  <span className="text-[10px] text-blue-400 font-mono">11 Halaman</span>
                </div>

                <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
                  {/* Category 1: Utama & Publik */}
                  <div className="px-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Utama & Presentasi
                  </div>
                  {allTabs.filter(t => t.category === 'overview').map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => handleProtectedTabClick(tab.id, tab.requiredRole, tab.label)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                        activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {tab.icon}
                        <span>{tab.label}</span>
                      </div>
                      {activeTab === tab.id && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}

                  {/* Category 2: Relawan & Gamifikasi */}
                  <div className="px-2 pt-2 border-t border-slate-800 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Portal & Relawan
                  </div>
                  {allTabs.filter(t => t.category === 'volunteer').map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => handleProtectedTabClick(tab.id, tab.requiredRole, tab.label)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                        activeTab === tab.id ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {tab.icon}
                        <span>{tab.label}</span>
                      </div>
                      {activeTab === tab.id && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}

                  {/* Category 3: Operasi Taktis & Koordinator */}
                  <div className="px-2 pt-2 border-t border-slate-800 text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center justify-between">
                    <span>Komando Taktis</span>
                    {!isCoordinator && <Lock className="w-2.5 h-2.5 text-slate-500" />}
                  </div>
                  {allTabs.filter(t => t.category === 'tactical').map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => handleProtectedTabClick(tab.id, tab.requiredRole, tab.label)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                        activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {tab.icon}
                        <span>{tab.label}</span>
                      </div>
                      {activeTab === tab.id ? (
                        <Check className="w-3.5 h-3.5 text-white" />
                      ) : tab.requiredRole === 'coordinator' && !isCoordinator ? (
                        <Lock className="w-3 h-3 text-slate-500" />
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
