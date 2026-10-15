import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Plus, 
  Trophy,
  Filter,
  CheckCircle2,
  Award,
  Stethoscope,
  LifeBuoy,
  Package,
  Truck,
  Tent,
  UtensilsCrossed,
  Radio,
  Heart,
  X,
  Zap,
  SlidersHorizontal,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { Volunteer, Disaster, SkillCategory, SkillProficiency } from '../../types/index.ts';
import { calculateDistance } from '../../lib/geo.ts';
import { SEED_SKILLS } from '../../data/seedData.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';

interface VolunteerDirectoryProps {
  volunteers: Volunteer[];
  selectedDisaster: Disaster | null;
  onSelectVolunteer: (vol: Volunteer) => void;
  onOpenRegisterModal: () => void;
  onUpdateStatus: (volunteerId: string, status: Volunteer['status']) => void;
  onNavigateToRewards?: () => void;
}

export const VolunteerDirectory: React.FC<VolunteerDirectoryProps> = ({
  volunteers,
  selectedDisaster,
  onSelectVolunteer,
  onOpenRegisterModal,
  onUpdateStatus,
  onNavigateToRewards,
}) => {
  const { language, t } = useLanguage();
  const { isCoordinator } = useAuth();
  
  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [selectedProficiency, setSelectedProficiency] = useState<'all' | 'certified' | 'expert'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'sar_official' | 'public_community'>('all');
  const [sortByDistance, setSortByDistance] = useState<boolean>(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  // Skill category definition matching SEED_SKILLS
  const categories = useMemo(() => [
    { 
      id: 'all', 
      label: language === 'id' ? 'Semua Keahlian' : 'All Skills', 
      icon: Filter,
      color: 'blue'
    },
    { 
      id: 'medical', 
      label: language === 'id' ? 'Medis & Kesehatan' : 'Medical & Health', 
      icon: Stethoscope,
      color: 'emerald'
    },
    { 
      id: 'sar', 
      label: language === 'id' ? 'SAR & Evakuasi' : 'Search & Rescue', 
      icon: LifeBuoy,
      color: 'amber'
    },
    { 
      id: 'logistics', 
      label: language === 'id' ? 'Logistik & Gudang' : 'Logistics & Supply', 
      icon: Package,
      color: 'indigo'
    },
    { 
      id: 'transport', 
      label: language === 'id' ? 'Transportasi & Armada' : 'Transport & Fleet', 
      icon: Truck,
      color: 'cyan'
    },
    { 
      id: 'shelter', 
      label: language === 'id' ? 'Shelter & Sanitasi (WASH)' : 'Shelter & WASH', 
      icon: Tent,
      color: 'teal'
    },
    { 
      id: 'food', 
      label: language === 'id' ? 'Dapur Umum & Pangan' : 'Food & Nutrition', 
      icon: UtensilsCrossed,
      color: 'orange'
    },
    { 
      id: 'communication', 
      label: language === 'id' ? 'Komunikasi & Radio' : 'Comms & Radio', 
      icon: Radio,
      color: 'purple'
    },
    { 
      id: 'psychosocial', 
      label: language === 'id' ? 'Trauma Healing' : 'Psychosocial Support', 
      icon: Heart,
      color: 'rose'
    },
  ], [language]);

  // Compute live count of volunteers per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: volunteers.length };
    
    volunteers.forEach(v => {
      const volCatSet = new Set<string>();
      v.skills.forEach(vs => {
        const s = SEED_SKILLS.find(item => item.id === vs.skillId);
        if (s?.category) {
          volCatSet.add(s.category);
        }
      });
      volCatSet.forEach(cat => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });

    return counts;
  }, [volunteers]);

  // Skills available for the currently selected category (or top skills if all)
  const availableSubSkills = useMemo(() => {
    if (selectedCategory === 'all') {
      return SEED_SKILLS;
    }
    return SEED_SKILLS.filter(s => s.category === selectedCategory);
  }, [selectedCategory]);

  // Toggle specific skill filter
  const handleToggleSkill = (skillId: string) => {
    setSelectedSkillIds(prev => 
      prev.includes(skillId) ? prev.filter(id => id !== skillId) : [...prev, skillId]
    );
  };

  // Quick Presets for Emergency Coordinators
  const applyPreset = (preset: 'sar_water' | 'medical_trauma' | 'logistics_quick' | 'shelter_wash') => {
    if (preset === 'sar_water') {
      setSelectedCategory('sar');
      setSelectedSkillIds(['skill-sar-1', 'skill-trn-1']); // Water Rescue + Perahu Karet
      setSelectedStatus('available');
    } else if (preset === 'medical_trauma') {
      setSelectedCategory('medical');
      setSelectedSkillIds(['skill-med-1', 'skill-med-3', 'skill-med-4']); // Dokter + Paramedis + P3K
      setSelectedStatus('available');
    } else if (preset === 'logistics_quick') {
      setSelectedCategory('logistics');
      setSelectedSkillIds(['skill-log-1', 'skill-log-2']); // Distribusi + Gudang
      setSelectedStatus('available');
    } else if (preset === 'shelter_wash') {
      setSelectedCategory('shelter');
      setSelectedSkillIds(['skill-she-1', 'skill-she-3']); // Tenda + Sanitasi WASH
      setSelectedStatus('available');
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSkillIds([]);
    setSelectedProficiency('all');
    setSelectedStatus('all');
    setSelectedType('all');
  };

  // Check if any filter is active
  const isAnyFilterActive = 
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    selectedSkillIds.length > 0 ||
    selectedProficiency !== 'all' ||
    selectedStatus !== 'all' ||
    selectedType !== 'all';

  // Filter volunteers
  const filtered = useMemo(() => {
    return volunteers.filter(v => {
      // 0. Volunteer Type (SAR vs Community)
      if (selectedType !== 'all') {
        const volCat = v.category || (v.organization?.toLowerCase().includes('sar') || v.skills.some(s => s.skillId.includes('sar')) ? 'sar_official' : 'public_community');
        if (volCat !== selectedType) return false;
      }

      // 1. Text search
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchesSearch =
          v.name.toLowerCase().includes(q) ||
          v.city.toLowerCase().includes(q) ||
          (v.organization || '').toLowerCase().includes(q) ||
          (v.sarUnitOrRole || '').toLowerCase().includes(q) ||
          v.skills.some(vs => {
            const s = SEED_SKILLS.find(item => item.id === vs.skillId);
            return s?.name.toLowerCase().includes(q) || s?.description.toLowerCase().includes(q);
          });

        if (!matchesSearch) return false;
      }

      // 2. Status filter
      if (selectedStatus !== 'all' && v.status !== selectedStatus) {
        return false;
      }

      // 3. Category filter
      if (selectedCategory !== 'all') {
        const hasSkillInCategory = v.skills.some(vs => {
          const s = SEED_SKILLS.find(item => item.id === vs.skillId);
          return s?.category === selectedCategory;
        });
        if (!hasSkillInCategory) return false;
      }

      // 4. Specific skill IDs filter (Volunteer must have at least one of the selected skills)
      if (selectedSkillIds.length > 0) {
        const hasSelectedSkill = v.skills.some(vs => selectedSkillIds.includes(vs.skillId));
        if (!hasSelectedSkill) return false;
      }

      // 5. Proficiency filter
      if (selectedProficiency !== 'all') {
        if (selectedProficiency === 'certified') {
          // Intermediate or Expert
          const isCertified = v.skills.some(vs => 
            vs.proficiency === 'intermediate' || vs.proficiency === 'expert'
          );
          if (!isCertified) return false;
        } else if (selectedProficiency === 'expert') {
          // Expert only
          const isExpert = v.skills.some(vs => vs.proficiency === 'expert');
          if (!isExpert) return false;
        }
      }

      return true;
    });
  }, [volunteers, selectedType, searchQuery, selectedStatus, selectedCategory, selectedSkillIds, selectedProficiency]);

  // Sort by distance to selected disaster if enabled
  const sortedVolunteers = useMemo(() => {
    const list = [...filtered];
    if (sortByDistance && selectedDisaster) {
      list.sort((a, b) => {
        const distA = calculateDistance(selectedDisaster.locationLat, selectedDisaster.locationLng, a.locationLat, a.locationLng);
        const distB = calculateDistance(selectedDisaster.locationLat, selectedDisaster.locationLng, b.locationLat, b.locationLng);
        return distA - distB;
      });
    }
    return list;
  }, [filtered, sortByDistance, selectedDisaster]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Registration */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white tracking-tight">
              {t.directoryTitle}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-bold">
              {volunteers.length} {language === 'id' ? 'Personel' : 'Responders'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {language === 'id' 
              ? 'Direktori komando relawan terverifikasi. Gunakan filter keahlian spesialis (Medis, SAR, Logistik) untuk mobilisasi cepat ke zona darurat.'
              : 'Verified volunteer directory. Filter by specialized certifications (Medical, SAR, Logistics) for rapid disaster deployment.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto shrink-0">
          {onNavigateToRewards && (
            <button
              onClick={onNavigateToRewards}
              className="px-3.5 py-2 text-xs font-bold text-amber-300 bg-amber-950/70 hover:bg-amber-900/80 border border-amber-700/60 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{language === 'id' ? 'Gamifikasi & Poin' : 'Rewards & Gamification'}</span>
            </button>
          )}

          <button
            onClick={onOpenRegisterModal}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>{t.btnRegisterVol}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          ADVANCED SKILL FILTERING & SEARCH CONTROL CENTER
         ========================================================================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        {/* Row 1: Search + Availability Status + Distance Sort */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'id' ? 'Cari nama relawan, kota, spesialisasi, atau organisasi...' : 'Search responder name, city, certification, or unit...'}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Availability Status Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0 overflow-x-auto">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedStatus === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.statusAll} ({volunteers.length})
            </button>
            <button
              onClick={() => setSelectedStatus('available')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                selectedStatus === 'available'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.statusAvailable} ({volunteers.filter(v => v.status === 'available').length})</span>
            </button>
            <button
              onClick={() => setSelectedStatus('busy')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                selectedStatus === 'busy'
                  ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>{t.statusBusy} ({volunteers.filter(v => v.status === 'busy').length})</span>
            </button>
          </div>

          {/* Sort by Disaster Distance Toggle */}
          {selectedDisaster && (
            <button
              onClick={() => setSortByDistance(!sortByDistance)}
              className={`px-3 py-2 text-xs font-bold rounded-xl border transition flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                sortByDistance 
                  ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
              }`}
              title={language === 'id' ? 'Urutkan berdasarkan radius terdekat ke lokasi bencana aktif' : 'Sort by nearest distance to active disaster'}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{language === 'id' ? 'Dekat Titik Bencana' : 'Nearest Disaster'}</span>
            </button>
          )}

          {/* Toggle Advanced Filters Button */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`p-2.5 rounded-xl border transition flex items-center justify-center shrink-0 ${
              showAdvancedFilters || selectedSkillIds.length > 0 || selectedProficiency !== 'all'
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
            }`}
            title={language === 'id' ? 'Filter Tingkat Keahlian & Spesialisasi' : 'Filter Proficiency Level & Specialization'}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Row 2: PRIMARY SKILL CATEGORY SELECTOR (The Core Requirement) */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-blue-400" />
              <span>{language === 'id' ? 'Sertifikasi & Kategori Keahlian Relawan:' : 'Volunteer Certification & Skill Categories:'}</span>
            </span>

            {/* Quick Emergency Presets Toggle */}
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400">
              <span className="text-slate-500 font-mono text-[10px] uppercase">{language === 'id' ? 'Preset Darurat:' : 'Quick Presets:'}</span>
              <button
                onClick={() => applyPreset('sar_water')}
                className="px-2 py-0.5 rounded bg-slate-950 hover:bg-amber-950/80 hover:text-amber-300 text-slate-400 border border-slate-800 text-[10px] font-semibold transition"
              >
                🌊 SAR Air
              </button>
              <button
                onClick={() => applyPreset('medical_trauma')}
                className="px-2 py-0.5 rounded bg-slate-950 hover:bg-emerald-950/80 hover:text-emerald-300 text-slate-400 border border-slate-800 text-[10px] font-semibold transition"
              >
                🩺 Medis Trauma
              </button>
              <button
                onClick={() => applyPreset('logistics_quick')}
                className="px-2 py-0.5 rounded bg-slate-950 hover:bg-indigo-950/80 hover:text-indigo-300 text-slate-400 border border-slate-800 text-[10px] font-semibold transition"
              >
                📦 Logistik Cepat
              </button>
            </div>
          </div>

          {/* Category Pills Slider / Flex Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const count = categoryCounts[cat.id] || 0;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    // Clear specific skill filters that don't belong to the newly selected category
                    if (cat.id !== 'all') {
                      setSelectedSkillIds(prev => 
                        prev.filter(id => {
                          const s = SEED_SKILLS.find(item => item.id === id);
                          return s?.category === cat.id;
                        })
                      );
                    }
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30 ring-1 ring-blue-400/50'
                      : 'bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-850 border-slate-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isSelected ? 'bg-blue-700 text-blue-100' : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3: SPECIFIC SKILL CHIPS & PROFICIENCY SELECTOR (Appears when category is active or toggled) */}
        {(selectedCategory !== 'all' || showAdvancedFilters) && (
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-3 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {language === 'id' ? 'Pilih Spesialisasi Spesifik (Bisa Lebih Dari 1):' : 'Select Specific Certifications (Multi-Select):'}
                </span>
              </span>

              {/* Proficiency Level Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-[10px] font-semibold">
                <span className="text-slate-500 px-1 font-mono uppercase text-[9px]">{language === 'id' ? 'Level:' : 'Tier:'}</span>
                <button
                  onClick={() => setSelectedProficiency('all')}
                  className={`px-2 py-0.5 rounded transition ${
                    selectedProficiency === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {language === 'id' ? 'Semua' : 'Any'}
                </button>
                <button
                  onClick={() => setSelectedProficiency('certified')}
                  className={`px-2 py-0.5 rounded transition flex items-center gap-1 ${
                    selectedProficiency === 'certified' ? 'bg-emerald-900 text-emerald-200 font-bold border border-emerald-700/60' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>{language === 'id' ? 'Tersertifikasi' : 'Certified'}</span>
                </button>
                <button
                  onClick={() => setSelectedProficiency('expert')}
                  className={`px-2 py-0.5 rounded transition flex items-center gap-1 ${
                    selectedProficiency === 'expert' ? 'bg-amber-900 text-amber-200 font-bold border border-amber-700/60' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>{language === 'id' ? 'Ahli (Expert)' : 'Expert'}</span>
                </button>
              </div>
            </div>

            {/* Sub-skill pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {availableSubSkills.map(s => {
                const isSkillSelected = selectedSkillIds.includes(s.id);
                // Count how many volunteers have this exact skill
                const volCountForSkill = volunteers.filter(v => v.skills.some(vs => vs.skillId === s.id)).length;

                return (
                  <button
                    key={s.id}
                    onClick={() => handleToggleSkill(s.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
                      isSkillSelected
                        ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                        : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-850 border-slate-800'
                    }`}
                  >
                    <span>{s.name}</span>
                    <span className={`text-[10px] font-mono px-1 rounded ${
                      isSkillSelected ? 'bg-blue-800 text-blue-100' : 'bg-slate-950 text-slate-400'
                    }`}>
                      {volCountForSkill}
                    </span>
                    {isSkillSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Row 4: Volunteer Korps Filter + Active Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
          {/* Korps Selector */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mr-1">
              {t.volunteerKorpsFilter}
            </span>
            <button
              onClick={() => setSelectedType('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                selectedType === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t.allVolunteers}
            </button>
            <button
              onClick={() => setSelectedType('sar_official')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                selectedType === 'sar_official'
                  ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                  : 'bg-slate-950 text-amber-400 hover:bg-slate-900 border border-amber-900/60'
              }`}
            >
              <span>🛡️</span> {t.sarOfficial}
            </button>
            <button
              onClick={() => setSelectedType('public_community')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                selectedType === 'public_community'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'bg-slate-950 text-emerald-400 hover:bg-slate-900 border border-emerald-900/60'
              }`}
            >
              <span>🤝</span> {t.publicCommunity}
            </button>
          </div>

          {/* Active Filter Indicators & Reset Button */}
          {isAnyFilterActive && (
            <div className="flex items-center gap-2 flex-wrap ml-auto">
              <span className="text-xs text-slate-400 font-medium">
                {language === 'id' 
                  ? `Ditemukan ${sortedVolunteers.length} dari ${volunteers.length} relawan` 
                  : `Found ${sortedVolunteers.length} of ${volunteers.length} responders`}
              </span>
              <button
                onClick={handleResetFilters}
                className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/70 text-xs font-bold transition flex items-center gap-1 shadow-sm"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{language === 'id' ? 'Reset Filter' : 'Reset'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          VOLUNTEERS DIRECTORY CARDS GRID
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedVolunteers.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 text-xs bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <Filter className="w-6 h-6" />
            </div>
            <h4 className="text-white font-bold text-sm">
              {language === 'id' ? 'Tidak ditemukan relawan dengan sertifikasi ini' : 'No volunteers match current certification filters'}
            </h4>
            <p className="text-slate-400 text-xs max-w-md mx-auto">
              {language === 'id'
                ? 'Coba ubah filter kategori keahlian, status ketersediaan, atau klik tombol Reset Filter di atas.'
                : 'Try adjusting the skill category, availability status, or reset the filters above.'}
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'id' ? 'Reset Semua Filter' : 'Reset All Filters'}</span>
            </button>
          </div>
        ) : (
          sortedVolunteers.map(vol => {
            const distance = selectedDisaster
              ? calculateDistance(
                  selectedDisaster.locationLat,
                  selectedDisaster.locationLng,
                  vol.locationLat,
                  vol.locationLng
                )
              : null;

            // Check if this volunteer has skills matching the current active filter
            const hasMatchedSkill = selectedCategory !== 'all' || selectedSkillIds.length > 0;

            return (
              <div
                key={vol.id}
                onClick={() => onSelectVolunteer(vol)}
                className={`p-4 rounded-2xl bg-slate-900 border transition-all cursor-pointer space-y-3 shadow-md flex flex-col justify-between hover:shadow-xl group ${
                  hasMatchedSkill 
                    ? 'border-slate-800 hover:border-blue-500/60 hover:bg-slate-850/80' 
                    : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                <div>
                  {/* Card Header: Avatar + Name + Corps Badge + Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold text-xs shrink-0 group-hover:border-blue-500/50 transition">
                        {vol.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-blue-400 transition">
                            {vol.name}
                          </h4>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase shrink-0 ${
                            vol.category === 'sar_official'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}>
                            {vol.category === 'sar_official' ? 'SAR' : (language === 'id' ? 'Warga' : 'Public')}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 line-clamp-1 block">
                          {vol.sarUnitOrRole || vol.organization || (language === 'id' ? 'Relawan Komunitas' : 'Community Volunteer')}
                        </span>
                      </div>
                    </div>

                    {/* Status Pill / Toggle for Coordinator */}
                    {isCoordinator ? (
                      <select
                        value={vol.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          e.stopPropagation();
                          onUpdateStatus(vol.id, e.target.value as Volunteer['status']);
                        }}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-lg font-mono cursor-pointer border ${
                          vol.status === 'available'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800/80'
                            : vol.status === 'busy'
                            ? 'bg-amber-950 text-amber-300 border-amber-800/80'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        <option value="available">{language === 'id' ? 'Siaga' : 'Ready'}</option>
                        <option value="busy">{language === 'id' ? 'Bertugas' : 'Busy'}</option>
                        <option value="offline">{language === 'id' ? 'Offline' : 'Offline'}</option>
                      </select>
                    ) : (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg font-mono border ${
                        vol.status === 'available'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800/80'
                          : vol.status === 'busy'
                          ? 'bg-amber-950 text-amber-300 border-amber-800/80'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {vol.status === 'available' 
                          ? (language === 'id' ? 'Siaga' : 'Ready') 
                          : (vol.status === 'busy' ? (language === 'id' ? 'Bertugas' : 'Busy') : 'Offline')}
                      </span>
                    )}
                  </div>

                  {/* Skills & Certification Tags with Matching Highlight */}
                  <div className="mt-3.5 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{language === 'id' ? 'Sertifikasi Keahlian:' : 'Verified Skills:'}</span>
                      {vol.gamification?.hoursContributed && (
                        <span className="text-amber-400 font-bold">{vol.gamification.hoursContributed} jam misi</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {vol.skills.map((vs, idx) => {
                        const skillObj = SEED_SKILLS.find(s => s.id === vs.skillId);
                        if (!skillObj) return null;

                        // Is this specific skill matching current category or selected skill id?
                        const isMatch = 
                          (selectedCategory !== 'all' && skillObj.category === selectedCategory) ||
                          selectedSkillIds.includes(vs.skillId);

                        // Proficiency styling
                        const isExpert = vs.proficiency === 'expert';
                        const isIntermediate = vs.proficiency === 'intermediate';

                        return (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-medium flex items-center gap-1 border transition-all ${
                              isMatch
                                ? 'bg-blue-600/20 text-blue-200 border-blue-500/80 font-bold shadow-sm shadow-blue-500/10 ring-1 ring-blue-500/30'
                                : 'bg-slate-950 border-slate-800 text-slate-300'
                            }`}
                          >
                            {isMatch && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>}
                            <span>{skillObj.name.split('/')[0].trim()}</span>
                            <span className={`text-[8px] uppercase font-mono px-1 rounded ${
                              isExpert 
                                ? 'bg-amber-950 text-amber-300 border border-amber-800/80' 
                                : isIntermediate 
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80' 
                                : 'text-slate-400'
                            }`}>
                              {language === 'en'
                                ? (vs.proficiency === 'expert' ? 'Expert' : vs.proficiency === 'intermediate' ? 'Interm.' : 'Basic')
                                : (vs.proficiency === 'expert' ? 'Ahli' : vs.proficiency === 'intermediate' ? 'Menengah' : 'Dasar')}
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer metadata: location, distance, tasks */}
                <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono tabular-nums">
                  <span className="flex items-center gap-1 truncate max-w-[150px]">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate">{vol.city}</span>
                  </span>

                  {distance !== null ? (
                    <span className="text-blue-400 font-bold bg-blue-950/60 px-2 py-0.5 rounded border border-blue-900/80">
                      {distance.toFixed(1)} km
                    </span>
                  ) : (
                    <span>Radius {vol.radiusKm} km</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
