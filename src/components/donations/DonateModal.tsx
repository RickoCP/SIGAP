import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  CreditCard, 
  QrCode, 
  Check, 
  Copy, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  AlertCircle,
  HelpCircle,
  Clock,
  ChevronRight,
  Package,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { Disaster, DonationPackage, PaymentMethod, DisasterDonation } from '../../types/index.ts';
import { DONATION_PACKAGES } from '../../data/donationSeedData.ts';
import { donationService } from '../../services/donationService.ts';
import { DonationReceiptModal } from './DonationReceiptModal.tsx';
import { useAuth } from '../../context/AuthContext.tsx';

interface DonateModalProps {
  disasters: Disaster[];
  selectedDisaster?: Disaster | null;
  initialPackage?: DonationPackage | null;
  onClose: () => void;
  onDonationSuccess?: (donation: DisasterDonation) => void;
}

const CASH_PRESETS = [25000, 50000, 100000, 250000, 500000, 1000000];

export const DonateModal: React.FC<DonateModalProps> = ({
  disasters,
  selectedDisaster,
  initialPackage,
  onClose,
  onDonationSuccess
}) => {
  const { currentUser, userProfile } = useAuth();

  // Step 1: Donation Selection, Step 2: Payment Details, Step 3: Processing/Complete
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [donationType, setDonationType] = useState<'cash' | 'package'>(initialPackage ? 'package' : 'cash');
  
  // Selected Disaster
  const [targetDisasterId, setTargetDisasterId] = useState<string>(
    selectedDisaster?.id || disasters[0]?.id || ''
  );

  // Cash State
  const [selectedCashAmount, setSelectedCashAmount] = useState<number>(100000);
  const [customAmount, setCustomAmount] = useState<string>('');

  // Package State
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    initialPackage?.id || DONATION_PACKAGES[0].id
  );

  // Donor Info
  const [donorName, setDonorName] = useState<string>(
    userProfile?.displayName || currentUser?.displayName || ''
  );
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(currentUser?.email || '');
  const [phone, setPhone] = useState<string>('');
  const [prayerMessage, setPrayerMessage] = useState<string>('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [completedDonation, setCompletedDonation] = useState<DisasterDonation | null>(null);

  // Copied VA state
  const [copiedVA, setCopiedVA] = useState<boolean>(false);

  // Calculation
  const activeDisaster = disasters.find(d => d.id === targetDisasterId) || selectedDisaster || disasters[0];
  const activePackage = DONATION_PACKAGES.find(p => p.id === selectedPackageId) || DONATION_PACKAGES[0];

  const totalAmount = donationType === 'cash' 
    ? (customAmount ? Number(customAmount) : selectedCashAmount)
    : activePackage.priceIdr;

  const formattedTotal = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(totalAmount);

  // Generated Mock VA number based on payment method
  const getVANumber = () => {
    switch (paymentMethod) {
      case 'va_bca': return '80777' + '0812' + Math.floor(100000 + Math.random() * 900000);
      case 'va_mandiri': return '89508' + '0812' + Math.floor(100000 + Math.random() * 900000);
      case 'va_bri': return '88810' + '0812' + Math.floor(100000 + Math.random() * 900000);
      case 'va_bni': return '98801' + '0812' + Math.floor(100000 + Math.random() * 900000);
      default: return '0812' + Math.floor(10000000 + Math.random() * 90000000);
    }
  };

  const [virtualAccountNum] = useState<string>(getVANumber());

  const handleCopyVA = () => {
    navigator.clipboard.writeText(virtualAccountNum);
    setCopiedVA(true);
    setTimeout(() => setCopiedVA(false), 2000);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalAmount <= 0) return;
    setStep('payment');
  };

  const handleConfirmPayment = async () => {
    setIsSubmitting(true);

    try {
      // Simulate real-time gateway verification delay
      await new Promise(res => setTimeout(res, 1200));

      const newDonation = await donationService.submitDonation({
        disasterId: activeDisaster?.id || 'general-relief',
        disasterTitle: activeDisaster?.title || 'Tanggap Darurat Bencana Nasional',
        donorName: isAnonymous ? 'Hamba Allah' : donorName,
        isAnonymous,
        email,
        phone,
        amount: totalAmount,
        type: donationType,
        packageId: donationType === 'package' ? activePackage.id : undefined,
        packageTitle: donationType === 'package' ? activePackage.title : undefined,
        paymentMethod,
        prayerMessage
      });

      setCompletedDonation(newDonation);
      if (onDonationSuccess) {
        onDonationSuccess(newDonation);
      }
    } catch (err) {
      console.error('Donation failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If donation finished, show official digital receipt
  if (completedDonation) {
    return (
      <DonationReceiptModal
        donation={completedDonation}
        onClose={onClose}
        onDonateAgain={() => {
          setCompletedDonation(null);
          setStep('details');
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Top Bar */}
        <div className="bg-gradient-to-r from-pink-900/60 via-slate-900 to-rose-950/60 border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
              <Heart className="w-5 h-5 fill-pink-500/30" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">
                {step === 'details' ? 'Salurkan Donasi Kemanusiaan' : 'Konfirmasi Pembayaran Donasi'}
              </h3>
              <p className="text-xs text-slate-400">
                Pusdalops BNPB & Posko Tanggap Bencana SIGAP
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Details & Amounts */}
        {step === 'details' && (
          <form onSubmit={handleProceedToPayment} className="p-5 space-y-5 text-slate-200">
            
            {/* Target Disaster Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Operasi Bencana:
              </label>
              <select
                value={targetDisasterId}
                onChange={(e) => setTargetDisasterId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500 transition"
              >
                {disasters.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title} ({d.province})
                  </option>
                ))}
              </select>
            </div>

            {/* Donation Type Switcher */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Pilihan Jenis Donasi:
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setDonationType('cash')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                    donationType === 'cash'
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Donasi Tunai (Uang)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDonationType('package')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                    donationType === 'package'
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Paket Logistik Darurat</span>
                </button>
              </div>
            </div>

            {/* If CASH: Preset Buttons and Custom Amount */}
            {donationType === 'cash' && (
              <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <label className="block text-xs font-semibold text-slate-300">
                  Pilih Nominal Cepat:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CASH_PRESETS.map((amt) => {
                    const isSelected = selectedCashAmount === amt && !customAmount;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setSelectedCashAmount(amt);
                          setCustomAmount('');
                        }}
                        className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition text-center ${
                          isSelected
                            ? 'bg-pink-600 text-white border-pink-500 shadow-md shadow-pink-900/30'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        Rp {amt.toLocaleString('id-ID')}
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Atau Masukkan Nominal Kustom (Rp):
                  </label>
                  <input
                    type="number"
                    min="10000"
                    step="5000"
                    placeholder="Contoh: 150000"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition"
                  />
                </div>
              </div>
            )}

            {/* If PACKAGE: Package Options Cards */}
            {donationType === 'package' && (
              <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800 max-h-56 overflow-y-auto pr-1">
                {DONATION_PACKAGES.map((pkg) => {
                  const isSelected = selectedPackageId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                        isSelected
                          ? 'bg-pink-950/50 border-pink-500 text-white shadow-md'
                          : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-pink-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        <Package className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-white truncate">{pkg.title}</h4>
                          <span className="text-xs font-bold text-emerald-400 shrink-0">
                            Rp {pkg.priceIdr.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{pkg.description}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {pkg.itemsIncluded.slice(0, 3).map((item, idx) => (
                            <span key={idx} className="text-[10px] px-1.5 py-0.2 bg-slate-800/80 rounded text-slate-300">
                              ✓ {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Donor Identity Form */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Data Donatur:
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded text-pink-600 focus:ring-0 w-3.5 h-3.5 bg-slate-950 border-slate-700"
                  />
                  <span>Sembunyikan nama (Hamba Allah)</span>
                </label>
              </div>

              {!isAnonymous && (
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap Anda"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="email"
                  placeholder="Email (untuk e-kuitansi)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
                <input
                  type="tel"
                  placeholder="Nomor WhatsApp"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <textarea
                  rows={2}
                  placeholder="Doa & Kata Semangat untuk Penyintas Bencana (opsional)..."
                  value={prayerMessage}
                  onChange={(e) => setPrayerMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 resize-none"
                />
              </div>
            </div>

            {/* Bottom Total & Proceed Button */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] text-slate-400">Total Donasi:</div>
                <div className="text-xl font-extrabold text-emerald-400">
                  {formattedTotal}
                </div>
              </div>

              <button
                type="submit"
                disabled={totalAmount <= 0}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white font-bold text-xs transition shadow-lg shadow-pink-900/40 flex items-center gap-2 disabled:opacity-50"
              >
                <span>Lanjut ke Pembayaran</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Payment Method & Immediate Confirmation */}
        {step === 'payment' && (
          <div className="p-5 space-y-5 text-slate-200">
            
            {/* Summary Tag */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">Donasi untuk:</span>
                <span className="text-xs font-bold text-white">{activeDisaster?.title}</span>
                {donationType === 'package' && (
                  <span className="block text-[11px] text-pink-400 font-medium mt-0.5">
                    🎁 {activePackage.title}
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Total Transfer:</span>
                <span className="text-lg font-black text-emerald-400">{formattedTotal}</span>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Pilih Kanal Pembayaran:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'qris'
                      ? 'bg-pink-950/60 border-pink-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-pink-400" />
                  <span className="text-xs font-bold">QRIS Nasional</span>
                  <span className="text-[10px] text-slate-400">Instan / Semua E-Wallet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('va_bca')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                    paymentMethod.startsWith('va_')
                      ? 'bg-pink-950/60 border-pink-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-400" />
                  <span className="text-xs font-bold">Virtual Account</span>
                  <span className="text-[10px] text-slate-400">BCA, Mandiri, BRI, BNI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('gopay')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                    ['gopay', 'ovo', 'dana'].includes(paymentMethod)
                      ? 'bg-pink-950/60 border-pink-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold">E-Wallet Langsung</span>
                  <span className="text-[10px] text-slate-400">GoPay, OVO, DANA</span>
                </button>
              </div>
            </div>

            {/* Sub-selectors for VA or E-Wallet */}
            {paymentMethod.startsWith('va_') && (
              <div className="flex gap-2">
                {[
                  { id: 'va_bca', label: 'BCA VA' },
                  { id: 'va_mandiri', label: 'Mandiri VA' },
                  { id: 'va_bri', label: 'BRI VA' },
                  { id: 'va_bni', label: 'BNI VA' }
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setPaymentMethod(b.id as PaymentMethod)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      paymentMethod === b.id
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            )}

            {['gopay', 'ovo', 'dana'].includes(paymentMethod) && (
              <div className="flex gap-2">
                {[
                  { id: 'gopay', label: 'GoPay' },
                  { id: 'ovo', label: 'OVO' },
                  { id: 'dana', label: 'DANA' }
                ].map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setPaymentMethod(w.id as PaymentMethod)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      paymentMethod === w.id
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            )}

            {/* QRIS Display Screen */}
            {paymentMethod === 'qris' && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-3">
                <div className="inline-block p-3 bg-white rounded-2xl shadow-xl">
                  {/* Visual QRIS Code Simulation with SVG */}
                  <svg className="w-44 h-44 mx-auto" viewBox="0 0 100 100">
                    <rect width="100" height="100" fill="white" />
                    {/* Corners */}
                    <rect x="5" y="5" width="25" height="25" fill="#0f172a" rx="2" />
                    <rect x="8" y="8" width="19" height="19" fill="white" />
                    <rect x="12" y="12" width="11" height="11" fill="#0f172a" />

                    <rect x="70" y="5" width="25" height="25" fill="#0f172a" rx="2" />
                    <rect x="73" y="8" width="19" height="19" fill="white" />
                    <rect x="77" y="12" width="11" height="11" fill="#0f172a" />

                    <rect x="5" y="70" width="25" height="25" fill="#0f172a" rx="2" />
                    <rect x="8" y="73" width="19" height="19" fill="white" />
                    <rect x="12" y="77" width="11" height="11" fill="#0f172a" />

                    {/* QR Matrix Pattern */}
                    <rect x="35" y="10" width="5" height="15" fill="#0f172a" />
                    <rect x="45" y="5" width="10" height="8" fill="#0f172a" />
                    <rect x="60" y="15" width="5" height="10" fill="#0f172a" />
                    
                    <rect x="10" y="35" width="15" height="5" fill="#0f172a" />
                    <rect x="35" y="35" width="30" height="30" fill="#0f172a" rx="4" />
                    <rect x="40" y="40" width="20" height="20" fill="white" rx="2" />
                    {/* Heart Center Badge */}
                    <circle cx="50" cy="50" r="7" fill="#e11d48" />

                    <rect x="70" y="35" width="20" height="5" fill="#0f172a" />
                    <rect x="75" y="45" width="15" height="10" fill="#0f172a" />
                    <rect x="85" y="60" width="5" height="15" fill="#0f172a" />

                    <rect x="35" y="70" width="12" height="6" fill="#0f172a" />
                    <rect x="55" y="75" width="15" height="8" fill="#0f172a" />
                    <rect x="75" y="75" width="20" height="20" fill="#0f172a" />
                  </svg>
                </div>

                <div className="text-xs text-slate-300 font-medium">
                  Scan QRIS menggunakan BCA Mobile, Livin' Mandiri, GoPay, OVO, DANA, atau ShopeePay
                </div>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-amber-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Berlaku 15 menit • Verifikasi Otomatis Instan</span>
                </div>
              </div>
            )}

            {/* Virtual Account Display */}
            {paymentMethod.startsWith('va_') && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Nomor Virtual Account:</span>
                  <span className="text-[11px] font-bold text-blue-400 uppercase">
                    {paymentMethod.replace('va_', '').toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-700">
                  <span className="font-mono text-lg font-extrabold text-white tracking-wider">
                    {virtualAccountNum}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyVA}
                    className="p-1.5 rounded-lg bg-blue-600/30 text-blue-300 hover:bg-blue-600/50 transition flex items-center gap-1 text-xs font-semibold"
                  >
                    {copiedVA ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin VA</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 space-y-1">
                  <div>1. Buka aplikasi M-Banking atau ATM terdekat.</div>
                  <div>2. Pilih Transfer &gt; Virtual Account &gt; Masukkan nomor di atas.</div>
                  <div>3. Tagihan {formattedTotal} akan muncul otomatis atas nama BNPB SIGAP.</div>
                </div>
              </div>
            )}

            {/* E-Wallet Phone Number simulator */}
            {['gopay', 'ovo', 'dana'].includes(paymentMethod) && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-xs text-slate-300">
                  Notifikasi pembayaran {paymentMethod.toUpperCase()} akan dikirim ke:
                </div>
                <div className="font-mono text-sm font-bold text-emerald-400 p-2.5 bg-slate-900 rounded-xl border border-slate-700">
                  {phone || '0812-9988-7766'}
                </div>
                <div className="text-[11px] text-slate-400">
                  Buka aplikasi {paymentMethod.toUpperCase()} di ponsel Anda dan konfirmasi pembayaran.
                </div>
              </div>
            )}

            {/* Actions: Back and Confirm */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Kembali
              </button>

              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={isSubmitting}
                className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memverifikasi Transaksi...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Konfirmasi Pembayaran ({formattedTotal})</span>
                  </>
                )}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
