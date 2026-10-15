import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  Gift, 
  Star, 
  Shield, 
  Users, 
  CheckCircle2, 
  Flame, 
  Sparkles, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Filter,
  Check
} from 'lucide-react';
import { Volunteer, RewardItem, GamificationBadge } from '../../types/index.ts';
import { GAMIFICATION_BADGES, REWARD_ITEMS, calculateVolunteerLevel } from '../../data/gamificationData.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface GamificationViewProps {
  volunteers: Volunteer[];
  onClaimReward?: (volunteerId: string, rewardId: string) => Promise<boolean>;
  onSelectVolunteer?: (volunteer: Volunteer) => void;
}

export const GamificationView: React.FC<GamificationViewProps> = ({
  volunteers,
  onClaimReward,
  onSelectVolunteer,
}) => {
  const { language, t } = useLanguage();
  const [selectedVolunteerId, setSelectedVolunteerId] = useState<string>(
    volunteers[0]?.id || 'vol-02'
  );
  const [rewardCategoryFilter, setRewardCategoryFilter] = useState<'all' | 'gear' | 'certificate' | 'voucher' | 'training'>('all');
  const [claimingRewardId, setClaimingRewardId] = useState<string | null>(null);
  const [claimSuccessMessage, setClaimSuccessMessage] = useState<string | null>(null);

  const currentVolunteer = volunteers.find(v => v.id === selectedVolunteerId) || volunteers[0];

  // Derive points and badge stats if not present
  const volunteerPoints = currentVolunteer?.gamification?.points ?? (currentVolunteer?.completedTasksCount ? currentVolunteer.completedTasksCount * 45 + 120 : 180);
  const levelInfo = calculateVolunteerLevel(volunteerPoints);
  const levelTitle = currentVolunteer?.gamification?.levelTitle || levelInfo.levelTitle;
  const level = currentVolunteer?.gamification?.level || levelInfo.level;
  const nextLevelPoints = currentVolunteer?.gamification?.nextLevelPoints || levelInfo.nextLevelPoints;
  const hoursContributed = currentVolunteer?.gamification?.hoursContributed || (currentVolunteer?.completedTasksCount ? currentVolunteer.completedTasksCount * 6 : 18);
  const missionsCompleted = currentVolunteer?.gamification?.completedMissionsCount || currentVolunteer?.completedTasksCount || 0;
  const claimedRewardIds = currentVolunteer?.gamification?.claimedRewardIds || [];

  // Leaderboard sorted by points
  const leaderboard = [...volunteers]
    .map(v => {
      const pts = v.gamification?.points ?? (v.completedTasksCount * 45 + 120);
      const lvl = calculateVolunteerLevel(pts);
      return {
        ...v,
        computedPoints: pts,
        computedLevel: lvl.level,
        computedTitle: lvl.levelTitle,
      };
    })
    .sort((a, b) => b.computedPoints - a.computedPoints);

  // Handle reward redemption
  const handleRedeem = async (reward: RewardItem) => {
    if (!currentVolunteer) return;
    if (volunteerPoints < reward.pointsCost) {
      alert(`Poin relawan belum mencukupi. Butuh ${reward.pointsCost} Poin (Saat ini: ${volunteerPoints} Poin). Selesaikan misi tanggap bencana untuk mendapatkan poin.`);
      return;
    }

    setClaimingRewardId(reward.id);
    setClaimSuccessMessage(null);

    try {
      if (onClaimReward) {
        await onClaimReward(currentVolunteer.id, reward.id);
      } else {
        // Local simulation fallback
        if (currentVolunteer.gamification) {
          currentVolunteer.gamification.points -= reward.pointsCost;
          if (!currentVolunteer.gamification.claimedRewardIds.includes(reward.id)) {
            currentVolunteer.gamification.claimedRewardIds.push(reward.id);
          }
        }
      }
      setClaimSuccessMessage(
        language === 'id'
          ? `Selamat! Reward "${reward.title}" berhasil diklaim untuk ${currentVolunteer.name}. Kode voucher/logistik telah dikirimkan ke email.`
          : `Success! Reward "${reward.title}" claimed for ${currentVolunteer.name}. Voucher code dispatched to email.`
      );
      setTimeout(() => setClaimSuccessMessage(null), 6000);
    } catch (err) {
      console.error(err);
    } finally {
      setClaimingRewardId(null);
    }
  };

  // Filter rewards
  const filteredRewards = REWARD_ITEMS.filter(r => {
    if (rewardCategoryFilter === 'all') return true;
    return r.category === rewardCategoryFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Gamifikasi & Hero Stats */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-900 border border-amber-600/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wider uppercase">
              <Trophy className="w-3.5 h-3.5" />
              {t.gamificationTitle}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {language === 'id' ? 'Apresiasi Dedikasi & Rewards Pahlawan Kemanusiaan' : 'Honoring Dedication & Humanitarian Rewards'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {t.gamificationSubtitle}
            </p>
          </div>

          {/* Quick Volunteer Selector for testing Gamification */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 shrink-0 w-full lg:w-72">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              {language === 'id' ? 'Pilih Profil Relawan:' : 'Select Volunteer Profile:'}
            </label>
            <select
              value={selectedVolunteerId}
              onChange={(e) => setSelectedVolunteerId(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-amber-500"
            >
              {volunteers.map(v => (
                <option key={v.id} value={v.id}>
                  {v.category === 'sar_official' ? '🛡️ [SAR] ' : '🤝 [Public] '}
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Claim Success Notification */}
      {claimSuccessMessage && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500 rounded-xl text-emerald-200 text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-medium">{claimSuccessMessage}</span>
          </div>
          <button 
            onClick={() => setClaimSuccessMessage(null)}
            className="text-emerald-400 hover:text-white text-xs font-bold px-2 py-1 rounded bg-emerald-900/50"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Volunteer Active Profile Card & XP Level */}
      {currentVolunteer && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card Left: Identity & Badges */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ${
                  currentVolunteer.category === 'sar_official'
                    ? 'bg-amber-600/20 text-amber-400 border border-amber-500/50 shadow-amber-950/30'
                    : 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/50 shadow-emerald-950/30'
                }`}>
                  {currentVolunteer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">{currentVolunteer.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      currentVolunteer.category === 'sar_official'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {currentVolunteer.category === 'sar_official' ? '🛡️ Tim SAR Basarnas / Potensi' : '🤝 Masyarakat Umum / Komunitas'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {currentVolunteer.sarUnitOrRole || currentVolunteer.organization || 'Relawan Tanggap Darurat'}
                  </p>
                </div>
              </div>
            </div>

            {/* Level & Points Progress */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  Level {level} : {levelTitle}
                </span>
                <span className="font-mono text-white font-extrabold tabular-nums">
                  {volunteerPoints} <span className="text-[10px] font-normal text-slate-400">XP Poin</span>
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((volunteerPoints / nextLevelPoints) * 100))}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>{volunteerPoints} XP</span>
                <span>Target Level Berikutnya: {nextLevelPoints} XP</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Tugas Selesai</div>
                <div className="text-xl font-black text-white tabular-nums mt-0.5">{missionsCompleted}</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Tervalidasi Koordinator</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Jam Pengabdian</div>
                <div className="text-xl font-black text-white tabular-nums mt-0.5">{hoursContributed} Jam</div>
                <div className="text-[10px] text-blue-400 mt-0.5">Di Area Merah</div>
              </div>
            </div>

            {/* Badges Collection */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                <span>Lencana Kehormatan ({GAMIFICATION_BADGES.length})</span>
                <span className="text-[10px] text-amber-400 font-mono">Terbuka 3 Lencana</span>
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {GAMIFICATION_BADGES.map((badge, idx) => {
                  const isUnlocked = idx < 4 || currentVolunteer.gamification?.badges.some(b => b.id === badge.id);
                  return (
                    <div 
                      key={badge.id}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isUnlocked 
                          ? 'bg-slate-950/80 border-amber-600/40 text-slate-200' 
                          : 'bg-slate-950/30 border-slate-800/50 text-slate-500 opacity-60'
                      }`}
                      title={badge.description}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{badge.icon}</span>
                        <div className="overflow-hidden">
                          <div className="font-bold text-[11px] truncate text-white">{badge.name}</div>
                          <div className="text-[9px] text-slate-400 line-clamp-1">{badge.description}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Center & Right: Reward Store Catalog & Leaderboard */}
          <div className="lg:col-span-2 space-y-6">
            {/* Rewards Catalog */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                    <Gift className="w-5 h-5 text-amber-400" />
                    {t.rewardsCatalog}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === 'id' 
                      ? 'Gunakan poin akumulasi untuk mengklaim sertifikasi BNSP, APD taktis, voucher operasional, dan asuransi misi.'
                      : 'Redeem accumulated XP for national certifications, tactical PPE, operational vouchers, and mission insurance.'}
                  </p>
                </div>

                {/* Category filter */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
                  {(['all', 'gear', 'certificate', 'voucher', 'training'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setRewardCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                        rewardCategoryFilter === cat
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {cat === 'all' 
                        ? (language === 'id' ? 'Semua' : 'All') 
                        : cat === 'gear' 
                        ? (language === 'id' ? 'APD Taktis' : 'Tactical Gear') 
                        : cat === 'certificate' 
                        ? (language === 'id' ? 'Sertifikat' : 'Certificates') 
                        : cat === 'voucher' 
                        ? 'Vouchers' 
                        : (language === 'id' ? 'Pelatihan' : 'Training')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reward Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredRewards.map(reward => {
                  const isClaimed = claimedRewardIds.includes(reward.id);
                  const canAfford = volunteerPoints >= reward.pointsCost;

                  return (
                    <div 
                      key={reward.id}
                      className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-2xl p-2 rounded-xl bg-slate-900 border border-slate-800">
                            {reward.icon}
                          </span>
                          <span className="font-mono text-xs font-black text-amber-400 bg-amber-950/60 border border-amber-800 px-2.5 py-1 rounded-lg">
                            {reward.pointsCost} {language === 'id' ? 'Poin' : 'Points'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-white">{reward.title}</h4>
                          <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                            {reward.description}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 text-[10px]">
                          {t.sponsor}: <strong className="text-slate-400">{reward.sponsor}</strong>
                        </span>
                        
                        <button
                          disabled={isClaimed || claimingRewardId === reward.id}
                          onClick={() => handleRedeem(reward)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                            isClaimed
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 cursor-default'
                              : canAfford
                              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/30'
                              : 'bg-slate-800 text-slate-500 hover:text-slate-400'
                          }`}
                        >
                          {isClaimed ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              {t.btnClaimed}
                            </>
                          ) : canAfford ? (
                            t.btnClaimReward
                          ) : (
                            language === 'id' ? 'Poin Kurang' : 'Need More XP'
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Leaderboard Relawan Nasional */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    {t.leaderboard}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === 'id' 
                      ? 'Klasemen relawan dengan kontribusi misi tertinggi' 
                      : 'Highest contributing disaster volunteers this period'}
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {language === 'id' 
                    ? `Total ${volunteers.length} Relawan Terdaftar` 
                    : `Total ${volunteers.length} Registered Volunteers`}
                </span>
              </div>

              <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60 text-xs">
                {leaderboard.slice(0, 7).map((vol, index) => {
                  const isCurrent = vol.id === selectedVolunteerId;
                  return (
                    <div 
                      key={vol.id}
                      onClick={() => setSelectedVolunteerId(vol.id)}
                      className={`p-3 sm:p-4 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        isCurrent 
                          ? 'bg-amber-950/30 border-l-4 border-l-amber-500' 
                          : 'hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-slate-300 text-black' :
                          index === 2 ? 'bg-amber-700 text-white' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {index + 1}
                        </span>

                        <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white">
                          {vol.name.charAt(0)}
                        </div>

                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>{vol.name}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                              vol.category === 'sar_official'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            }`}>
                              {vol.category === 'sar_official' ? 'SAR Basarnas' : (language === 'id' ? 'Warga' : 'Public')}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {vol.city} · {vol.completedTasksCount} {language === 'id' ? 'Misi Tuntas' : 'Completed Missions'}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-black text-amber-400 text-sm tabular-nums">
                          {vol.computedPoints} XP
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {vol.computedTitle}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
