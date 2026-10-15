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
  const isEn = language === 'en';

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
  const totalFundsRaised = donations.reduce((acc, d) => acc + d.amount, 0) + 740000000;
  const totalDonorsCount = donations.length + 2850;

  const formattedTotalFunds = new Intl.NumberFormat(isEn ? 'en-US' : 'id-ID', {
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
      
      {/* Hero Banner: Disaster Aid & Crowdfunding Hub */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-pink-950/40 to-slate-900 border border-pink-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-bold tracking-wide">
            <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
            <span>
              {isEn 
                ? 'BNPB - SIGAP Disaster Relief & Crowdfunding Hub' 
                : 'Pusat Donasi & Logistik Tanggap Bencana BNPB - SIGAP'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {isEn 
              ? 'Transparent Disaster Aid: Every Rupiah Counts' 
              : 'Uluran Kasih Tanggap Bencana: Transparan & Akuntabel'}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            {isEn
              ? 'Direct assistance for flood, earthquake, and wildfire victims across Indonesia. Enjoy 100% real-time allocation transparency, instant QRIS payments, and official digital receipts verified by BNPB Pusdalops.'
              : 'Bantuan langsung untuk korban bencana banjir, gempa, dan kebakaran di seluruh Indonesia. Transparansi alokasi dana 100% secara real-time, kemudahan pembayaran QRIS/Virtual Account, dan kuitansi resmi berstempel verifikasi Pusdalops.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isEn ? '100% Audited Transparency' : '100% Transparan & Diaudit'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>{isEn ? '0% Hidden Platform Fee' : '0% Biaya Potongan Tersembunyi'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>{isEn ? 'Instant Digital Receipt with Hash' : 'Kuitansi Digital Bersegel Otomatis'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Aggregate Metrics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">
            {isEn ? 'Total Relief Funds Raised' : 'Total Bantuan Terhimpun'}
          </span>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {formattedTotalFunds}
          </div>
          <span className="text-[10px] text-slate-500">
            {isEn ? 'Nationwide historical pool' : 'Akumulasi seluruh bencana'}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">
            {isEn ? 'Verified Donors' : 'Donatur Terverifikasi'}
          </span>
          <div className="text-2xl font-black text-pink-400 font-mono">
            {totalDonorsCount.toLocaleString(isEn ? 'en-US' : 'id-ID')}
          </div>
          <span className="text-[10px] text-slate-500">
            {isEn ? 'Individual & CSR contributors' : 'Individu, Komunitas & CSR'}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">
            {isEn ? 'Active Disaster Campaigns' : 'Bencana Darurat Aktif'}
          </span>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {disasters.length}
          </div>
          <span className="text-[10px] text-slate-500">
            {isEn ? 'Requiring urgent assistance' : 'Membutuhkan bantuan mendesak'}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">
            {isEn ? 'Speed of Deployment' : 'Kecepatan Penyaluran'}
          </span>
          <div className="text-2xl font-black text-cyan-400 font-mono">
            &lt; 24 {isEn ? 'Hours' : 'Jam'}
          </div>
          <span className="text-[10px] text-slate-500">
            {isEn ? 'Direct to frontline kitchens' : 'Langsung ke posko lapangan'}
          </span>
        </div>
      </div>

      {/* SECTION 1: Active Disaster Campaigns */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>{isEn ? 'Emergency Relief Appeal Campaigns' : 'Panggilan Tanggap Bencana Mendesak'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {isEn 
                ? 'Select a declared disaster to contribute direct funding to frontline squads'
                : 'Pilih bencana yang ingin Anda bantu untuk menyalurkan dana bantuan langsung ke posko terdekat'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {disasters.map((disaster, idx) => {
            const targetAmount = 150000000;
            const currentAmount = 85000000 + (idx * 25000000);
            const percent = Math.min(100, Math.round((currentAmount / targetAmount) * 100));

            return (
              <div 
                key={disaster.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-pink-500/40 transition group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase bg-pink-950 text-pink-300 border border-pink-800">
                      {disaster.type} • {disaster.province}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span className="truncate max-w-[120px]">{disaster.address}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base line-clamp-2 group-hover:text-pink-300 transition">
                    {disaster.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {disaster.description}
                  </p>

                  {/* Funding Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-pink-400 font-bold">
                        Rp {currentAmount.toLocaleString(isEn ? 'en-US' : 'id-ID')}
                      </span>
                      <span className="text-slate-400">
                        {percent}% {isEn ? 'of' : 'dari'} Rp 150.000.000
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-500" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                    <span>{disaster.affectedPeople.toLocaleString(isEn ? 'en-US' : 'id-ID')} {isEn ? 'souls affected' : 'jiwa terdampak'}</span>
                    <span>{disaster.evacuationCenterCount} {isEn ? 'shelters' : 'titik posko'}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenDonateForDisaster(disaster)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-pink-600/30"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span>{isEn ? 'Donate for this Crisis' : 'Bantu Bencana Ini'}</span>
                  </button>

                  {onSelectDisasterForMap && (
                    <button
                      onClick={() => onSelectDisasterForMap(disaster.id)}
                      title={isEn ? 'View in Tactical Map' : 'Buka di Peta Taktis'}
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

      {/* SECTION 2: Specialized Relief Aid Packages */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-400" />
            <span>{isEn ? 'Critical Emergency Relief Packages' : 'Paket Bantuan Logistik Spesifik'}</span>
          </h2>
          <p className="text-xs text-slate-400">
            {isEn 
              ? 'Select tailored assistance bundles specifically prepared for field deployment'
              : 'Pilih paket bantuan logistik siap salur yang disesuaikan dengan kebutuhan riil di pengungsian'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DONATION_PACKAGES.map((pkg) => (
            <div 
              key={pkg.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-blue-500/50 transition group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl p-2 rounded-xl bg-slate-950 border border-slate-800">
                    {pkg.icon}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800/80">
                    Rp {pkg.priceIdr.toLocaleString(isEn ? 'en-US' : 'id-ID')}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm group-hover:text-blue-300 transition">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                {/* Items List */}
                <div className="space-y-1 pt-1 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    {isEn ? 'Contents of Package:' : 'Isi Paket Logistik:'}
                  </span>
                  {(pkg.itemsIncluded || []).map((item: string, i: number) => (
                    <div key={i} className="text-xs text-slate-300 flex items-center gap-1.5">
                      <span className="text-blue-400">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleOpenDonateForPackage(pkg)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-blue-600 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>{isEn ? 'Donate This Package' : 'Pilih Paket Ini'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: Real-Time Transparency Breakdown (Formula 40-30-20-10) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-400" />
              <span>{isEn ? 'Standard 100% Open Allocation Transparency' : 'Transparansi Alokasi Penyaluran Dana Terbuka (100%)'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {isEn 
                ? 'Standard BNPB/UNOCHA emergency relief formula with zero hidden administrative cuts'
                : 'Mengikuti standar darurat kemanusiaan BNPB & UNOCHA tanpa pemotongan liar'}
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
            {isEn ? 'Verified & Audited' : 'Terverifikasi Pusdalops'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-emerald-400">40%</span>
              <span className="text-xs font-mono text-slate-400">Cluster 01</span>
            </div>
            <h4 className="font-bold text-white text-xs">{isEn ? 'Food & Clean Water' : 'Logistik Pangan & Air Bersih'}</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isEn ? 'Rice, bottled water, ready-to-eat meals, infant formula, and community kitchen supplies.' : 'Beras, air mineral, makanan siap saji, susu bayi, biskuit gizi, dan operasional dapur umum.'}
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-blue-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-blue-400">30%</span>
              <span className="text-xs font-mono text-slate-400">Cluster 02</span>
            </div>
            <h4 className="font-bold text-white text-xs">{isEn ? 'Medical & Psychosocial Care' : 'Pelayanan Medis & Obat-obatan'}</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isEn ? 'Sterile dressings, trauma medicines, field ambulances, and psychosocial trauma counseling.' : 'P3K darurat, perban steril, obat gatal/kulit, infus, ambulans lapangan, dan trauma healing.'}
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-amber-400">20%</span>
              <span className="text-xs font-mono text-slate-400">Cluster 03</span>
            </div>
            <h4 className="font-bold text-white text-xs">{isEn ? 'Shelters & WASH Sanitation' : 'Shelter, Tenda & Sanitasi (WASH)'}</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isEn ? 'Family emergency tents, blankets, portable latrines, and water filtration setups.' : 'Tenda darurat keluarga, terpal, selimut hangat, MCK darurat, dan instalasi penjernih air.'}
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-purple-400">10%</span>
              <span className="text-xs font-mono text-slate-400">Cluster 04</span>
            </div>
            <h4 className="font-bold text-white text-xs">{isEn ? 'Field Rescuer Safety & Gear' : 'Operasional Lapangan & Relawan'}</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isEn ? 'Inflatable boat fuel, radio batteries, safety vests, raincoats, and frontline rations.' : 'BBM perahu karet SAR, baterai HT, jaket pelampung, jas hujan, dan logistik personel lapangan.'}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 4: Live Donor Feed & Audit Trail */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-pink-400" />
              <span>{isEn ? 'Live Public Donor Feed & Audit Log' : 'Daftar Donatur Terkini & Riwayat Kemanusiaan'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {isEn 
                ? 'Immutable audit trail of all contributions with verifiable transaction reference numbers'
                : 'Pencatatan real-time seluruh donasi masuk dengan nomor referensi transaksi resmi'}
            </p>
          </div>

          {/* Filter and Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? 'Search donor or prayer...' : 'Cari donatur atau doa...'}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filterType === 'all' ? 'bg-pink-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isEn ? 'All' : 'Semua'}
              </button>
              <button
                onClick={() => setFilterType('package')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filterType === 'package' ? 'bg-pink-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isEn ? 'Packages' : 'Paket'}
              </button>
              <button
                onClick={() => setFilterType('cash')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filterType === 'cash' ? 'bg-pink-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isEn ? 'Direct Funds' : 'Dana Langsung'}
              </button>
            </div>
          </div>
        </div>

        {/* Donors List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredDonations.length === 0 ? (
            <div className="col-span-full p-8 text-center text-slate-400 text-xs bg-slate-950/40 rounded-xl border border-slate-800">
              {isEn ? 'No donations match current filter.' : 'Belum ada donasi yang cocok dengan pencarian ini.'}
            </div>
          ) : (
            filteredDonations.slice(0, 10).map((d) => (
              <div
                key={d.id}
                onClick={() => setSelectedReceiptDonation(d)}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-pink-500/40 cursor-pointer transition flex items-start justify-between gap-3 shadow group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-950/70 border border-pink-700/60 flex items-center justify-center text-pink-300 font-bold text-xs shrink-0">
                    {d.donorName.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white group-hover:text-pink-300 transition">
                        {d.donorName}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                        {d.paymentMethod.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-[11px] text-pink-400 font-bold font-mono">
                      Rp {d.amount.toLocaleString(isEn ? 'en-US' : 'id-ID')}
                      {d.packageTitle && <span className="text-slate-400 font-normal"> ({d.packageTitle})</span>}
                    </div>

                    {d.prayerMessage && (
                      <p className="text-xs text-slate-300 italic line-clamp-1">
                        "{d.prayerMessage}"
                      </p>
                    )}

                    <div className="text-[10px] text-slate-500 font-mono">
                      {d.disasterTitle} • {new Date(d.createdAt).toLocaleDateString(isEn ? 'en-US' : 'id-ID', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedReceiptDonation(d);
                  }}
                  className="px-2.5 py-1 text-[10px] rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition whitespace-nowrap"
                >
                  {isEn ? 'Receipt' : 'Kuitansi'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Donate Modal */}
      {isDonateModalOpen && (
        <DonateModal
          disasters={disasters}
          selectedDisaster={selectedDisasterForDonate}
          initialPackage={selectedPackageForDonate}
          onClose={() => setIsDonateModalOpen(false)}
          onDonationSuccess={(donation) => {
            setSelectedReceiptDonation(donation);
          }}
        />
      )}

      {/* Donation Receipt Modal */}
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
