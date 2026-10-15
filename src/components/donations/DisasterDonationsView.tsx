import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  Package, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Share2, 
  Filter, 
  Search, 
  Calendar, 
  MapPin, 
  PieChart, 
  Droplet, 
  DollarSign,
  AlertTriangle,
  Gift
} from 'lucide-react';
import { Disaster, DisasterDonation, DonationPackage } from '../../types/index.ts';
import { DONATION_PACKAGES } from '../../data/donationSeedData.ts';
import { donationService } from '../../services/donationService.ts';
import { DonateModal } from './DonateModal.tsx';
import { DonationReceiptModal } from './DonationReceiptModal.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface DisasterDonationsViewProps {
  disasters: Disaster[];
  onSelectDisasterForMap?: (disasterId: string) => void;
}

export const DisasterDonationsView: React.FC<DisasterDonationsViewProps> = ({
  disasters,
  onSelectDisasterForMap
}) => {
  const { language } = useLanguage();
  const [donations, setDonations] = useState<DisasterDonation[]>([]);
  const [selectedDisasterForDonate, setSelectedDisasterForDonate] = useState<Disaster | null>(null);
  const [selectedPackageForDonate, setSelectedPackageForDonate] = useState<DonationPackage | null>(null);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState<boolean>(false);
  const [selectedReceiptDonation, setSelectedReceiptDonation] = useState<DisasterDonation | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    const unsubscribe = donationService.subscribe((list) => {
      setDonations(list);
    });
    return () => unsubscribe();
  }, []);

  // Compute Total Metrics
  const totalFundsRaised = donations.reduce((acc, d) => acc + d.amount, 0) + 740000000; // Base verified historical pool
  const totalDonorsCount = donations.length + 2850;

  const formattedTotalFunds = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(totalFundsRaised);

  const handleOpenDonateForDisaster = (disaster: Disaster) => {
    setSelectedDisasterForDonate(disaster);
    setSelectedPackageForDonate(null);
    setIsDonateModalOpen(true);
  };

  const handleOpenDonateForPackage = (pkg: DonationPackage) => {
    setSelectedPackageForDonate(pkg);
    setSelectedDisasterForDonate(disasters[0] || null);
    setIsDonateModalOpen(true);
  };

  // Filtered Donors Feed
  const filteredDonations = donations.filter(d => {
    const matchesSearch = 
      d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.disasterTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.prayerMessage && d.prayerMessage.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'package') return matchesSearch && d.type === 'package';
    if (filterType === 'cash') return matchesSearch && d.type === 'cash';
    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Banner: Pusat Donasi & Bantuan Kemanusiaan */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-pink-950/40 to-slate-900 border border-pink-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-bold tracking-wide">
            <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
            <span>Pusat Donasi & Logistik Tanggap Bencana BNPB - SIGAP</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Bersama Pulihkan Indonesia, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300">
              Salurkan Bantuan Tepat Sasaran
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Setiap rupiah dan paket logistik yang Anda sumbangkan disalurkan langsung secara transparan dan akuntabel ke posko pengungsian, dapur umum darurat, serta tim penyelamat relawan di titik episentrum bencana.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedDisasterForDonate(disasters[0] || null);
                setSelectedPackageForDonate(null);
                setIsDonateModalOpen(true);
              }}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white font-bold text-xs sm:text-sm transition shadow-xl shadow-pink-950/50 flex items-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Donasi Sekarang (QRIS & VA)</span>
            </button>

            <a
              href="#active-campaigns"
              className="py-3 px-5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition flex items-center gap-2"
            >
              <span>Lihat Kampanye Aktif</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Highlight Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-pink-400 text-xs font-semibold mb-1">
              <DollarSign className="w-4 h-4" />
              <span>Total Donasi Tersalurkan</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white truncate">
              {formattedTotalFunds}
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">✓ Terverifikasi Pusdalops BNPB</span>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold mb-1">
              <Users className="w-4 h-4" />
              <span>Donatur Kemanusiaan</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {totalDonorsCount.toLocaleString('id-ID')}
            </div>
            <span className="text-[10px] text-slate-400">Masyarakat & Komunitas</span>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Bencana Membutuhkan</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {disasters.filter(d => d.status !== 'resolved').length} Operasi
            </div>
            <span className="text-[10px] text-slate-400">Tanggap Darurat Lapangan</span>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Tingkat Penyaluran</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400">
              98.2%
            </div>
            <span className="text-[10px] text-slate-400">Langsung ke Korban & Dapur</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: Active Disaster Campaigns */}
      <div id="active-campaigns" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-400" />
              <span>Kampanye Tanggap Darurat Bencana Aktif</span>
            </h2>
            <p className="text-xs text-slate-400">
              Pilih titik operasi bencana yang ingin Anda bantu secara langsung
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {disasters.map((disaster) => {
            const target = disaster.donationTargetIdr || 300000000;
            const collected = disaster.donationCollectedIdr || 165000000;
            const progress = Math.min(100, Math.round((collected / target) * 100));
            const donors = disaster.donorsCount || 420;

            const formatRupiah = (val: number) => 
              new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

            return (
              <div 
                key={disaster.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-pink-500/40 transition duration-200 group"
              >
                <div className="space-y-3">
                  {/* Status & Region Badges */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-800/80">
                      {disaster.type.toUpperCase()} • {disaster.severity.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {disaster.province}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-bold text-sm text-white group-hover:text-pink-300 transition line-clamp-1">
                      {disaster.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                      {disaster.description}
                    </p>
                  </div>

                  {/* Urgent Needs Pills */}
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Kebutuhan Darurat Mendesak:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {disaster.keyNeeds.slice(0, 3).map((need, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-950 rounded-lg text-slate-300 border border-slate-800">
                          • {need}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Progress Bar & Amount */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between items-end text-xs">
                      <div>
                        <span className="text-slate-400 text-[11px] block">Terkumpul:</span>
                        <span className="font-bold text-emerald-400">{formatRupiah(collected)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 text-[11px] block">Target:</span>
                        <span className="font-semibold text-slate-300">{formatRupiah(target)}</span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div 
                        className="bg-gradient-to-r from-pink-500 via-rose-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                      <span><strong>{progress}%</strong> tercapai</span>
                      <span><strong>{donors}</strong> donatur berpartisipasi</span>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenDonateForDisaster(disaster)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs transition shadow-md shadow-pink-950/40 flex items-center justify-center gap-1.5"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span>Bantu Bencana Ini</span>
                  </button>

                  {onSelectDisasterForMap && (
                    <button
                      onClick={() => onSelectDisasterForMap(disaster.id)}
                      title="Lihat Titik di Peta"
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    >
                      <MapPin className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Logistics Packages Showcase */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <span>Paket Logistik Darurat Siaga Bencana</span>
          </h2>
          <p className="text-xs text-slate-400">
            Donasikan paket barang kebutuhan mendesak yang langsung dibelanjakan dan didistribusikan relawan
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DONATION_PACKAGES.map((pkg) => (
            <div 
              key={pkg.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-amber-500/40 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Package className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-extrabold text-emerald-400 font-mono">
                    Rp {pkg.priceIdr.toLocaleString('id-ID')}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-white">{pkg.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Isi Paket Logistik:
                  </span>
                  <div className="space-y-1">
                    {pkg.itemsIncluded.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-800">
                <button
                  onClick={() => handleOpenDonateForPackage(pkg)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-amber-600 hover:text-white text-slate-200 font-bold text-xs border border-slate-700 hover:border-amber-500 transition flex items-center justify-center gap-2"
                >
                  <Gift className="w-4 h-4 text-amber-400 group-hover:text-white" />
                  <span>Donasikan Paket Ini</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: Live Feed Donatur & Doa Dukungan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Feed of Donations & Prayers (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-400 fill-pink-400/20" />
                <span>Doa & Dukungan dari Dermawan ({donations.length})</span>
              </h3>
              <p className="text-xs text-slate-400">
                Catatan solidaritas dan dukungan masyarakat untuk para korban
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  filterType === 'all' ? 'bg-pink-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilterType('cash')}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  filterType === 'cash' ? 'bg-pink-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Donasi Tunai
              </button>
              <button
                onClick={() => setFilterType('package')}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  filterType === 'package' ? 'bg-pink-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Paket Logistik
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari nama donatur, bencana, atau isi doa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Feed List */}
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {filteredDonations.map((d) => (
              <div 
                key={d.id}
                className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 hover:border-slate-700 transition space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-600 to-rose-400 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm">
                      {d.donorName.slice(0, 1)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">
                        {d.donorName}
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        {new Date(d.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-extrabold text-xs text-emerald-400">
                      Rp {d.amount.toLocaleString('id-ID')}
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase">
                      via {d.paymentMethod.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Target Disaster tag */}
                <div className="text-[11px] text-pink-300 font-medium">
                  Operasi: <span className="text-slate-300">{d.disasterTitle}</span>
                  {d.packageTitle && (
                    <span className="block text-amber-300 text-[10px] mt-0.5">
                      🎁 {d.packageTitle}
                    </span>
                  )}
                </div>

                {/* Prayer Message */}
                {d.prayerMessage && (
                  <p className="text-xs italic text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    &ldquo;{d.prayerMessage}&rdquo;
                  </p>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="font-mono">Ref: {d.referenceNumber}</span>
                  <button
                    onClick={() => setSelectedReceiptDonation(d)}
                    className="text-pink-400 hover:text-pink-300 font-semibold transition"
                  >
                    Lihat Kuitansi Resmi &gt;
                  </button>
                </div>
              </div>
            ))}

            {filteredDonations.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-xs">
                Tidak ada riwayat donasi yang sesuai dengan pencarian Anda.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Transparency Breakdown & Logistics Prepositioning (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">
                Transparansi Alokasi Penyaluran
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Seluruh dana yang terkumpul diaudit secara terbuka dan didistribusikan sesuai prioritas penanganan darurat:
            </p>

            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">🍲 Dapur Umum & Logistik Pangan</span>
                  <span className="font-bold text-white">40%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[40%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">💊 Obat-obatan & Medis Darurat</span>
                  <span className="font-bold text-white">25%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[25%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">⛺ Tenda & Shelter Pengungsi</span>
                  <span className="font-bold text-white">20%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[20%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">🚤 BBM Evakuasi & Transport SAR</span>
                  <span className="font-bold text-white">15%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full w-[15%]" />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Diaudit oleh Inspektorat Utama BNPB & Badan Pengawas Keuangan</span>
            </div>
          </div>

          {/* Quick Donate CTA Box */}
          <div className="bg-gradient-to-br from-pink-900/50 via-slate-900 to-rose-950/50 border border-pink-500/30 rounded-2xl p-5 shadow-xl text-center space-y-3">
            <Heart className="w-8 h-8 text-pink-400 fill-pink-500/20 mx-auto" />
            <h4 className="font-bold text-sm text-white">Ingin Berdonasi Sekarang?</h4>
            <p className="text-xs text-slate-300">
              Dukungan Anda menyelamatkan ribuan nyawa penyintas bencana di garis depan.
            </p>
            <button
              onClick={() => {
                setSelectedDisasterForDonate(disasters[0] || null);
                setSelectedPackageForDonate(null);
                setIsDonateModalOpen(true);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs transition shadow-lg shadow-pink-950/40"
            >
              Donasi Sekarang &gt;
            </button>
          </div>
        </div>

      </div>

      {/* Donate Modal */}
      {isDonateModalOpen && (
        <DonateModal
          disasters={disasters}
          selectedDisaster={selectedDisasterForDonate}
          initialPackage={selectedPackageForDonate}
          onClose={() => {
            setIsDonateModalOpen(false);
            setSelectedDisasterForDonate(null);
            setSelectedPackageForDonate(null);
          }}
          onDonationSuccess={(newDonation) => {
            setSelectedReceiptDonation(newDonation);
          }}
        />
      )}

      {/* Standalone Receipt Modal */}
      {selectedReceiptDonation && (
        <DonationReceiptModal
          donation={selectedReceiptDonation}
          onClose={() => setSelectedReceiptDonation(null)}
          onDonateAgain={() => {
            setSelectedReceiptDonation(null);
            setIsDonateModalOpen(true);
          }}
        />
      )}

    </div>
  );
};
