import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Sparkles, 
  MapPin, 
  Users, 
  Layers, 
  WifiOff, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Award, 
  Radio, 
  ArrowRight, 
  Clock, 
  Database, 
  FileText, 
  Compass, 
  HeartHandshake, 
  Send, 
  Maximize2, 
  Minimize2,
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  Target,
  Flame,
  Waves,
  Cpu,
  Globe,
  Lock,
  Download,
  Share2,
  RotateCcw,
  Siren,
  Volume2,
  Printer,
  HelpCircle,
  Check,
  CreditCard,
  QrCode,
  BellRing,
  BookOpen
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { NavTab } from '../layout/Navbar.tsx';
import { PRESENTATION_CONTENT } from '../../data/presentationContent.ts';

interface ProjectPresentationViewProps {
  onNavigateToTab: (tab: NavTab) => void;
}

export const ProjectPresentationView: React.FC<ProjectPresentationViewProps> = ({
  onNavigateToTab
}) => {
  const { language, setLanguage } = useLanguage();
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'deck' | 'document'>('deck');
  const [showSpeakerNotes, setShowSpeakerNotes] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const currentLang = language === 'en' ? 'en' : 'id';
  const c = PRESENTATION_CONTENT[currentLang];

  const slideSteps = [
    {
      id: 'intro',
      title: currentLang === 'en' ? 'Overview' : 'Ikhtisar',
      badge: currentLang === 'en' ? 'CORE 2026' : 'PROYEK INTI'
    },
    {
      id: 'problem',
      title: currentLang === 'en' ? 'Problem Statement' : 'Latar Belakang',
      badge: currentLang === 'en' ? 'URGENCY' : 'URGENSI'
    },
    {
      id: 'solution',
      title: currentLang === 'en' ? 'SIGAP Solution' : 'Solusi SIGAP',
      badge: currentLang === 'en' ? 'SOLUTION' : 'SOLUSI'
    },
    {
      id: 'features',
      title: currentLang === 'en' ? 'Key Features' : 'Fitur Lengkap',
      badge: currentLang === 'en' ? 'ECOSYSTEM' : 'EKOSISTEM'
    },
    {
      id: 'earlywarning',
      title: currentLang === 'en' ? 'Early Warning' : 'Peringatan Dini',
      badge: currentLang === 'en' ? 'SAFETY' : 'KEAMANAN'
    },
    {
      id: 'donations',
      title: currentLang === 'en' ? 'Donations' : 'Donasi Bencana',
      badge: currentLang === 'en' ? 'AID' : 'BANTUAN'
    },
    {
      id: 'tech',
      title: currentLang === 'en' ? 'Tech & AI' : 'Teknologi & AI',
      badge: currentLang === 'en' ? 'ARCHITECTURE' : 'ARSITEKTUR'
    },
    {
      id: 'impact',
      title: currentLang === 'en' ? 'Measurable Impact' : 'Dampak Operasi',
      badge: currentLang === 'en' ? 'METRICS' : 'METRIK'
    },
    {
      id: 'roadmap',
      title: currentLang === 'en' ? 'Roadmap & Synergy' : 'Roadmap & Sinergi',
      badge: currentLang === 'en' ? 'GOVERNANCE' : 'KOLABORASI'
    }
  ];

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev < slideSteps.length - 1 ? prev + 1 : 0));
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev > 0 ? prev - 1 : slideSteps.length - 1));
  };

  // Keyboard navigation for presentation mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'deck') return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevSlide();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, isFullscreen, slideSteps.length]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`space-y-6 max-w-7xl mx-auto pb-16 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto max-w-none' : ''}`}>
      {/* Presentation Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden print:border-none print:shadow-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {c.header.officialBadge}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {c.header.mainTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
              {c.header.mainSubtitle}
            </p>
          </div>

          {/* Controls: Language Selector + View Mode Switcher + Speaker Notes & Print */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Direct Bilingual Switcher */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold shadow-inner">
              <button
                onClick={() => setLanguage('id')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  currentLang === 'id'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Tampilkan materi dalam Bahasa Indonesia"
              >
                <span>🇮🇩</span>
                <span>ID</span>
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  currentLang === 'en'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Display presentation in English"
              >
                <span>🇬🇧</span>
                <span>EN</span>
              </button>
            </div>

            {/* View Mode Switcher (Deck vs Document) */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold shadow-inner">
              <button
                onClick={() => setViewMode('deck')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'deck'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>📽️</span>
                <span>{c.header.deckMode}</span>
              </button>
              <button
                onClick={() => setViewMode('document')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'document'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>📄</span>
                <span>{c.header.docMode}</span>
              </button>
            </div>

            {/* Direct Link to Documentation */}
            <button
              onClick={() => onNavigateToTab('documentation')}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-850 text-teal-300 hover:text-white border border-teal-800/80 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              title={language === 'id' ? 'Buka Buku Panduan Pengguna' : 'Open User Guide'}
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">{language === 'id' ? 'Buku Panduan' : 'User Guide'}</span>
            </button>

            {/* Speaker Notes Toggle Button (Deck mode only) */}
            {viewMode === 'deck' && (
              <button
                onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                  showSpeakerNotes
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/10'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
                title="Tampilkan / Sembunyikan Catatan Pembicara"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{c.header.speakerNotesToggle}</span>
              </button>
            )}

            {/* Print / Export PDF Button */}
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition"
              title={c.header.printSummary}
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Fullscreen Toggle */}
            {viewMode === 'deck' && (
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition"
                title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh (F11)'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Slide Steps Indicator in Deck Mode */}
        {viewMode === 'deck' && (
          <div className="pt-4 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 sm:gap-1.5">
              {slideSteps.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSlide(idx)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeSlide === idx
                      ? 'bg-blue-600 text-white ring-1 ring-blue-400 shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span className="text-[10px] opacity-70">0{idx + 1}</span>
                  <span className="hidden md:inline">{s.title}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 shrink-0 pl-2">
              <button
                onClick={handlePrevSlide}
                className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
                title={c.header.prevSlideTooltip}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-slate-400 px-1">
                {activeSlide + 1} / {slideSteps.length}
              </span>
              <button
                onClick={handleNextSlide}
                className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
                title={c.header.nextSlideTooltip}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          SLIDE VIEW CONTAINER (DECK MODE)
         ========================================================================= */}
      {viewMode === 'deck' ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* SLIDE 0: HERO & OVERVIEW */}
          {activeSlide === 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden space-y-8">
              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
                  <Shield className="w-3.5 h-3.5" />
                  <span>{c.slide0.heroBadge}</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  {c.slide0.heroHeadline}
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {c.slide0.heroDescription}
                </p>
              </div>

              {/* Core Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                {c.slide0.pillars.map((p, idx) => {
                  const icon = idx === 0 
                    ? <Sparkles className="w-5 h-5" /> 
                    : idx === 1 
                    ? <Radio className="w-5 h-5" /> 
                    : <WifiOff className="w-5 h-5" />;

                  const colorClass = idx === 0
                    ? 'text-blue-400 bg-blue-600/20 border-blue-500/40'
                    : idx === 1
                    ? 'text-emerald-400 bg-emerald-600/20 border-emerald-500/40'
                    : 'text-amber-400 bg-amber-600/20 border-amber-500/40';

                  return (
                    <div key={idx} className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-2">
                      <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${colorClass}`}>
                        {icon}
                      </div>
                      <h3 className="font-bold text-white text-sm">{p.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Action Jump Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{c.header.exploreHint}</span>
                  <button
                    onClick={() => onNavigateToTab('macro-map')}
                    className="text-blue-400 hover:text-blue-300 font-bold underline"
                  >
                    {c.header.macroMapLink}
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => onNavigateToTab('map')}
                    className="text-blue-400 hover:text-blue-300 font-bold underline"
                  >
                    {c.header.tacticalMapLink}
                  </button>
                </div>

                <button
                  onClick={handleNextSlide}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30 ml-auto"
                >
                  <span>{currentLang === 'en' ? 'Continue to Problem Statement' : 'Lanjut ke Latar Belakang Masalah'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* SLIDE 1: PROBLEM STATEMENT */}
          {activeSlide === 1 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8">
              <div className="max-w-3xl space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                  {c.slide1.sectionTag}
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {c.slide1.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {c.slide1.description}
                </p>
              </div>

              {/* 4 Pain Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {c.slide1.painPoints.map((item, idx) => (
                  <div key={idx} className="bg-slate-950/80 p-5 rounded-xl border border-red-900/50 space-y-2">
                    <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                      <Target className="w-4 h-4" />
                      <h4>{item.title}</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Navigation Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={handlePrevSlide}
                  className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{currentLang === 'en' ? 'Back' : 'Kembali'}</span>
                </button>
                <button
                  onClick={handleNextSlide}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  <span>{currentLang === 'en' ? 'View the SIGAP Solution' : 'Lihat Solusi SIGAP'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* SLIDE 2: THE SOLUTION */}
          {activeSlide === 2 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8">
              <div className="max-w-3xl space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {c.slide2.sectionTag}
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {c.slide2.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {c.slide2.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {c.slide2.pillars.map((pillar, idx) => {
                  const borderClass = idx === 0 
                    ? 'border-blue-600/40 text-blue-400 bg-blue-600/20' 
                    : idx === 1 
                    ? 'border-emerald-600/40 text-emerald-400 bg-emerald-600/20' 
                    : 'border-amber-600/40 text-amber-400 bg-amber-600/20';

                  const bulletColor = idx === 0 ? 'text-blue-400' : idx === 1 ? 'text-emerald-400' : 'text-amber-400';

                  return (
                    <div key={idx} className="bg-slate-950/80 p-6 rounded-2xl border space-y-4">
                      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xl font-black ${borderClass}`}>
                        {pillar.number}
                      </div>
                      <h3 className="text-lg font-black text-white">{pillar.title}</h3>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {pillar.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2">
                            <span className={`${bulletColor} font-bold`}>•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={handlePrevSlide}
                  className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{currentLang === 'en' ? 'Back' : 'Kembali'}</span>
                </button>
                <button
                  onClick={handleNextSlide}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  <span>{currentLang === 'en' ? 'Explore 10 Integrated Features' : 'Buka 10 Fitur Terintegrasi'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* SLIDE 3: 10 KEY FEATURES SHOWCASE */}
          {activeSlide === 3 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    {c.slide3.sectionTag}
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    {c.slide3.title}
                  </h2>
                </div>
                <span className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  {c.slide3.badgeHint}
                </span>
              </div>

              {/* Feature Cards Grid (10 modules) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {c.slide3.features.map((f, idx) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-blue-500/50 transition flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-400">{f.tag}</span>
                        <span className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-800">{f.badge}</span>
                      </div>
                      <h3 className="font-bold text-white text-sm">{f.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {f.description}
                      </p>
                    </div>
                    <button
                      onClick={() => onNavigateToTab(f.tabId as NavTab)}
                      className="w-full py-2 bg-slate-900 hover:bg-blue-600 text-slate-200 hover:text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-800"
                    >
                      <span>{f.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={handlePrevSlide}
                  className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{currentLang === 'en' ? 'Back' : 'Kembali'}</span>
                </button>
                <button
                  onClick={handleNextSlide}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  <span>{currentLang === 'en' ? 'Explore Early Warning System' : 'Buka Sistem Early Warning'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* SLIDE 4: EARLY WARNING SYSTEM (EWS) & CITIZEN SAFETY */}
          {activeSlide === 4 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="max-w-3xl space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Siren className="w-4 h-4" />
                    <span>{c.slide4.sectionTag}</span>
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    {c.slide4.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {c.slide4.description}
                  </p>
                </div>
                <button
                  onClick={() => onNavigateToTab(c.slide4.tabId as NavTab)}
                  className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-amber-600/30 shrink-0"
                >
                  <BellRing className="w-4 h-4" />
                  <span>{c.slide4.actionButton}</span>
                </button>
              </div>

              {/* 4 EWS Core Capabilities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {c.slide4.ewsFeatures.map((feat, idx) => (
                  <div key={idx} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2.5 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="text-2xl">{feat.icon}</div>
                      <h4 className="font-bold text-white text-sm">{feat.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-900">
                      <span className="text-[11px] font-mono text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/60 inline-block">
                        {feat.metric}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 3 Evacuation Protocol Steps */}
              <div className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>{currentLang === 'en' ? 'Standard Citizen Evacuation Protocol' : 'Protokol Evakuasi Mandiri Standar Warga'}</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {c.slide4.protocolSteps.map((step, idx) => (
                    <div key={idx} className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white">{step.phase}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-mono">{step.timing}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{step.action}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={handlePrevSlide}
                  className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{currentLang === 'en' ? 'Back' : 'Kembali'}</span>
                </button>
                <button
                  onClick={handleNextSlide}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  <span>{currentLang === 'en' ? 'Explore Transparent Donations' : 'Buka Donasi Bencana Terbuka'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* SLIDE 5: TRANSPARENT DISASTER DONATIONS & CROWDFUNDING */}
          {activeSlide === 5 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="max-w-3xl space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <HeartHandshake className="w-4 h-4" />
                    <span>{c.slide5.sectionTag}</span>
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    {c.slide5.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {c.slide5.description}
                  </p>
                </div>
                <button
                  onClick={() => onNavigateToTab(c.slide5.tabId as NavTab)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-600/30 shrink-0"
                >
                  <QrCode className="w-4 h-4" />
                  <span>{c.slide5.actionButton}</span>
                </button>
              </div>

              {/* Fund Allocations 4-way Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>{currentLang === 'en' ? 'Standard 100% Open Allocation Formula' : 'Formula Alokasi Terbuka 100% Standar BNPB/UNOCHA'}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {c.slide5.allocations.map((alloc, idx) => {
                    const color = idx === 0 
                      ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20' 
                      : idx === 1 
                      ? 'text-blue-400 border-blue-500/40 bg-blue-950/20' 
                      : idx === 2 
                      ? 'text-amber-400 border-amber-500/40 bg-amber-950/20' 
                      : 'text-purple-400 border-purple-500/40 bg-purple-950/20';
                    return (
                      <div key={idx} className={`p-4 rounded-xl border ${color} space-y-2`}>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-black">{alloc.percent}</span>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">Cluster 0{idx + 1}</span>
                        </div>
                        <h5 className="font-bold text-white text-xs">{alloc.category}</h5>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{alloc.purpose}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Channels Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {c.slide5.channels.map((chan, idx) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-white font-bold text-xs">
                      {idx === 0 ? <QrCode className="w-4 h-4 text-emerald-400" /> : idx === 1 ? <CreditCard className="w-4 h-4 text-blue-400" /> : <Shield className="w-4 h-4 text-amber-400" />}
                      <span>{chan.type}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200">{chan.items}</div>
                    <p className="text-[10px] text-slate-400">{chan.note}</p>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-900/60 text-xs text-emerald-200 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{c.slide5.trustBadge}</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={handlePrevSlide}
                  className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{currentLang === 'en' ? 'Back' : 'Kembali'}</span>
                </button>
                <button
                  onClick={handleNextSlide}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  <span>{currentLang === 'en' ? 'View Tech Architecture' : 'Lanjut ke Arsitektur Teknologi'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* SLIDE 6: TECH STACK & AI ARCHITECTURE */}
          {activeSlide === 6 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8">
              <div className="max-w-3xl space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  {c.slide6.sectionTag}
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {c.slide6.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {c.slide6.description}
                </p>
              </div>

              {/* Architecture Diagram Box */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {c.slide6.columns.map((col, idx) => {
                    const icon = idx === 0 
                      ? <Cpu className="w-4 h-4 text-blue-400" />
                      : idx === 1 
                      ? <Sparkles className="w-4 h-4 text-indigo-400" />
                      : <Database className="w-4 h-4 text-emerald-400" />;

                    return (
                      <div key={idx} className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
                        <div className="flex items-center gap-2 font-bold text-white">
                          {icon}
                          <span>{col.title}</span>
                        </div>
                        <ul className="space-y-1.5 text-slate-300">
                          {col.bullets.map((b, bIdx) => (
                            <li key={bIdx}>• {b}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-900/60 text-xs text-blue-200 flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>
                    <strong>{c.slide6.securityCallout}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={handlePrevSlide}
                  className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{currentLang === 'en' ? 'Back' : 'Kembali'}</span>
                </button>
                <button
                  onClick={handleNextSlide}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  <span>{currentLang === 'en' ? 'View Field Impact' : 'Lihat Dampak Operasional'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* SLIDE 7: MEASURABLE IMPACT */}
          {activeSlide === 7 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8">
              <div className="max-w-3xl space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {c.slide7.sectionTag}
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {c.slide7.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {c.slide7.description}
                </p>
              </div>

              {/* Metrics Comparison Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {c.slide7.metrics.map((m, idx) => {
                  const colorClass = idx === 0 ? 'text-emerald-400' : idx === 1 ? 'text-blue-400' : idx === 2 ? 'text-amber-400' : 'text-purple-400';
                  return (
                    <div key={idx} className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-center space-y-1">
                      <span className="text-[11px] text-slate-400 font-semibold block uppercase">{m.label}</span>
                      <div className={`text-3xl font-black ${colorClass}`}>{m.value}</div>
                      <span className="text-[10px] text-slate-400">{m.comparison}</span>
                    </div>
                  );
                })}
              </div>

              {/* Case Study Snippet */}
              <div className="bg-slate-950/90 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>{c.slide7.caseStudyTitle}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {c.slide7.caseStudyText}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={handlePrevSlide}
                  className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{currentLang === 'en' ? 'Back' : 'Kembali'}</span>
                </button>
                <button
                  onClick={handleNextSlide}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  <span>{currentLang === 'en' ? 'Explore Roadmap & Synergy' : 'Lihat Roadmap & Sinergi'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* SLIDE 8: ECOSYSTEM, ROADMAP & COLLABORATION */}
          {activeSlide === 8 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8">
              <div className="max-w-3xl space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  {c.slide8.sectionTag}
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {c.slide8.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {c.slide8.description}
                </p>
              </div>

              {/* Roles Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {c.slide8.roles.map((r, idx) => {
                  const borderClass = idx === 0 ? 'border-red-900/60' : idx === 1 ? 'border-emerald-900/60' : 'border-blue-900/60';
                  return (
                    <div key={idx} className={`bg-slate-950 p-5 rounded-xl border ${borderClass} space-y-3`}>
                      <div className="w-8 h-8 rounded-lg bg-slate-900 text-slate-200 flex items-center justify-center font-bold text-sm border border-slate-800">
                        {r.icon}
                      </div>
                      <h3 className="font-bold text-white text-sm">{r.title}</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {r.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* 3-Phase Roadmap */}
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span>{currentLang === 'en' ? 'Strategic Development Roadmap 2026-2030' : 'Peta Jalan Pengembangan Strategis 2026-2030'}</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {c.slide8.roadmap.map((rm, idx) => (
                    <div key={idx} className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-400">{rm.phase}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-mono">{rm.timeline}</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {rm.milestones.map((ms, msIdx) => (
                          <li key={msIdx} className="flex items-start gap-1.5">
                            <span className="text-emerald-400 font-bold">✓</span>
                            <span>{ms}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final CTA Strip */}
              <div className="bg-gradient-to-r from-blue-950/60 via-indigo-950/60 to-purple-950/60 p-6 rounded-2xl border border-blue-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-base">{c.slide8.ctaTitle}</h4>
                  <p className="text-xs text-slate-300">
                    {c.slide8.ctaSubtitle}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onNavigateToTab('early-warning')}
                    className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold py-2.5 px-3.5 rounded-xl transition shadow-lg shadow-amber-600/30 whitespace-nowrap"
                  >
                    {c.slide8.ctaEarlyWarning}
                  </button>
                  <button
                    onClick={() => onNavigateToTab('donations')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-3.5 rounded-xl transition shadow-lg shadow-emerald-600/30 whitespace-nowrap"
                  >
                    {c.slide8.ctaDonations}
                  </button>
                  <button
                    onClick={() => onNavigateToTab('macro-map')}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-3.5 rounded-xl transition shadow-lg shadow-blue-600/30 whitespace-nowrap"
                  >
                    {c.slide8.ctaMacroMap}
                  </button>
                  <button
                    onClick={() => onNavigateToTab('volunteer-portal')}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2.5 px-3.5 rounded-xl transition border border-slate-700 whitespace-nowrap"
                  >
                    {c.slide8.ctaPortal}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={handlePrevSlide}
                  className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{currentLang === 'en' ? 'Back' : 'Kembali'}</span>
                </button>
                <button
                  onClick={() => setActiveSlide(0)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2.5 px-4 rounded-xl transition flex items-center gap-2 border border-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{currentLang === 'en' ? 'Back to Overview (Slide 1)' : 'Kembali ke Ikhtisar (Slide 1)'}</span>
                </button>
              </div>
            </div>
          )}

          {/* SPEAKER NOTES DRAWER */}
          {showSpeakerNotes && (
            <div className="bg-amber-950/30 border border-amber-900/60 rounded-2xl p-5 shadow-xl space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-amber-900/40 pb-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4" />
                  <span>{c.header.speakerNotesTitle}</span>
                </div>
                <span className="text-[10px] text-amber-300 font-mono">
                  Slide {activeSlide + 1} of {slideSteps.length}
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-amber-200/90 leading-relaxed">
                {(
                  activeSlide === 0 ? c.slide0.speakerNotes :
                  activeSlide === 1 ? c.slide1.speakerNotes :
                  activeSlide === 2 ? c.slide2.speakerNotes :
                  activeSlide === 3 ? c.slide3.speakerNotes :
                  activeSlide === 4 ? c.slide4.speakerNotes :
                  activeSlide === 5 ? c.slide5.speakerNotes :
                  activeSlide === 6 ? c.slide6.speakerNotes :
                  activeSlide === 7 ? c.slide7.speakerNotes :
                  c.slide8.speakerNotes
                ).map((note, nIdx) => (
                  <li key={nIdx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold shrink-0">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        /* =========================================================================
            DOCUMENT VIEW (COMPREHENSIVE EXECUTIVE WHITEPAPER MODE)
           ========================================================================= */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-12 animate-in fade-in duration-200">
          {/* Document Header */}
          <div className="pb-8 border-b border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              {c.document.badge}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              {c.document.title}
            </h2>
            <p className="text-sm text-slate-400">
              {c.document.subtitle}
            </p>
          </div>

          {/* Section 1: Background & Problems */}
          <section className="space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span className="text-red-400">#</span> {c.document.sec1Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {c.document.sec1Text}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-2">
              {c.document.sec1Cards.map((card, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <strong className="text-white block mb-1">{card.title}</strong>
                  <span className="text-slate-400">{card.desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Solution Architecture */}
          <section className="space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span className="text-blue-400">#</span> {c.document.sec2Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {c.document.sec2Text}
            </p>
            <ul className="space-y-3 text-xs text-slate-300">
              {c.document.sec2List.map((item, idx) => {
                const icon = idx === 0 
                  ? <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  : idx === 1 
                  ? <WifiOff className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  : idx === 2 
                  ? <Radio className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  : <Flame className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />;

                return (
                  <li key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
                    {icon}
                    <div>
                      <strong className="text-white block">{item.title}</strong>
                      <span>{item.desc}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Section 3: Interactive Module Explorer */}
          <section className="space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span className="text-emerald-400">#</span> {c.document.sec3Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              {c.document.sec3Text}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {c.document.modules.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => onNavigateToTab(m.tabId as NavTab)}
                  className="p-3 bg-slate-950 hover:bg-slate-850 rounded-xl border border-slate-800 text-left transition group"
                >
                  <div className="font-bold text-white mb-0.5 group-hover:text-blue-400 transition">{m.title}</div>
                  <span className="text-[10px] text-slate-400">{m.desc}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Section 4: Community Early Warning System & Evacuation */}
          <section className="space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span className="text-amber-400">#</span> {c.document.sec4Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {c.document.sec4Text}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-2">
              {c.document.sec4Highlights.map((hl, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <strong className="text-amber-400 block mb-1">{hl.title}</strong>
                  <span className="text-slate-300">{hl.desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Transparent Disaster Aid & Financing */}
          <section className="space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span className="text-emerald-400">#</span> {c.document.sec5Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {c.document.sec5Text}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-2">
              {c.document.sec5Breakdowns.map((bd, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-emerald-400 font-bold">{bd.share} • {bd.category}</div>
                  <p className="text-slate-400 text-[11px]">{bd.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6: Operational Metrics & Social ROI */}
          <section className="space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span className="text-purple-400">#</span> {c.document.sec6Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {c.document.sec6Text}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
              {c.document.sec6Metrics.map((met, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="text-white block">{met.kpi}</strong>
                    <span className="text-slate-400 text-[10px]">Target: {met.target}</span>
                  </div>
                  <span className="text-emerald-400 font-bold text-xs bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-900/60">
                    {met.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 7: Pentahelix Model & 2026-2030 Roadmap */}
          <section className="space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span className="text-indigo-400">#</span> {c.document.sec7Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {c.document.sec7Text}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-2">
              {c.document.sec7Phases.map((ph, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-blue-400">{ph.phase}</strong>
                    <span className="text-[10px] text-slate-400 font-mono">{ph.period}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{ph.deliverables}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
