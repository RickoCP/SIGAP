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
import { useAuth } from '../../context/AuthContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';

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
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { currentUser, userProfile } = useAuth();

  // Step 1: Donation Selection, Step 2: Payment Details
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

  // Copied VA state
  const [copiedVA, setCopiedVA] = useState<boolean>(false);

  // Calculation
  const activeDisaster = disasters.find(d => d.id === targetDisasterId) || selectedDisaster || disasters[0];
  const activePackage = DONATION_PACKAGES.find(p => p.id === selectedPackageId) || DONATION_PACKAGES[0];

  const totalAmount = donationType === 'cash' 
    ? (customAmount ? Number(customAmount) : selectedCashAmount)
    : activePackage.priceIdr;

  const formattedTotal = new Intl.NumberFormat(isEn ? 'en-US' : 'id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(totalAmount);

  const getVANumber = () => {
    switch (paymentMethod) {
      case 'va_bca': return '80777' + '0812' + '549210';
      case 'va_mandiri': return '89508' + '0812' + '673891';
      case 'va_bri': return '88810' + '0812' + '412356';
      case 'va_bni': return '98801' + '0812' + '908234';
      default: return '80777' + '0812' + '549210';
    }
  };

  const handleCopyVA = () => {
    navigator.clipboard.writeText(getVANumber());
    setCopiedVA(true);
    setTimeout(() => setCopiedVA(false), 2000);
  };

  const handleConfirmPayment = async () => {
    setIsSubmitting(true);
    try {
      const donation = await donationService.submitDonation({
        disasterId: activeDisaster?.id || 'general',
        disasterTitle: activeDisaster?.title || (isEn ? 'National Disaster Relief Fund' : 'Dana Kemanusiaan Bencana Nasional'),
        donorName: isAnonymous ? (isEn ? 'Anonymous Contributor' : 'Hamba Allah') : (donorName.trim() || (isEn ? 'Good Samaritan' : 'Sahabat SIGAP')),
        isAnonymous: Boolean(isAnonymous),
        email,
        phone,
        type: donationType,
        amount: totalAmount,
        packageId: donationType === 'package' ? activePackage.id : undefined,
        packageTitle: donationType === 'package' ? activePackage.title : undefined,
        paymentMethod,
        prayerMessage
      });

      if (onDonationSuccess) {
        onDonationSuccess(donation);
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-pink-900/60 via-slate-900 to-rose-900/60 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-pink-600/20 text-pink-400 border border-pink-500/30">
              <Heart className="w-5 h-5 fill-pink-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                {isEn ? 'Disaster Relief Contribution' : 'Salurkan Bantuan Tanggap Bencana'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isEn ? 'Official donation gateway verified by BNPB Pusdalops' : 'Penyaluran resmi diaudit dan diverifikasi BNPB Pusdalops'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Step Body */}
        {step === 'details' ? (
          <div className="p-5 sm:p-6 space-y-5 text-xs">
            
            {/* Target Disaster Selection */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">
                {isEn ? 'Target Disaster Relief:' : 'Bencana Sasaran Bantuan:'}
              </label>
              <select
                value={targetDisasterId}
                onChange={(e) => setTargetDisasterId(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-pink-500"
              >
                {disasters.map(d => (
                  <option key={d.id} value={d.id}>
                    {isEn ? (d.titleEn || d.title) : d.title} ({d.province})
                  </option>
                ))}
              </select>
            </div>

            {/* Donation Type Tabs */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">
                {isEn ? 'Select Assistance Type:' : 'Pilih Bentuk Bantuan:'}
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setDonationType('cash')}
                  className={`py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                    donationType === 'cash' ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{isEn ? 'Direct Funds (Rupiah)' : 'Donasi Dana (Rupiah)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDonationType('package')}
                  className={`py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                    donationType === 'package' ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>{isEn ? 'Logistics Packages' : 'Paket Logistik'}</span>
                </button>
              </div>
            </div>

            {/* If Cash Donation */}
            {donationType === 'cash' ? (
              <div className="space-y-3">
                <label className="font-bold text-slate-300 block">
                  {isEn ? 'Choose Nominal Amount:' : 'Pilih Nominal Bantuan:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CASH_PRESETS.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => {
                        setSelectedCashAmount(amount);
                        setCustomAmount('');
                      }}
                      className={`py-2.5 px-2 rounded-xl font-mono font-bold border transition text-center ${
                        selectedCashAmount === amount && !customAmount
                          ? 'bg-pink-600 text-white border-pink-500 shadow-md'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
                      }`}
                    >
                      Rp {amount.toLocaleString(isEn ? 'en-US' : 'id-ID')}
                    </button>
                  ))}
                </div>

                <div className="pt-1">
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder={isEn ? 'Or enter custom amount (e.g. 75000)' : 'Atau masukkan nominal lainnya (Rp)...'}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 font-mono"
                  />
                </div>
              </div>
            ) : (
              /* If Logistics Package Donation */
              <div className="space-y-2">
                <label className="font-bold text-slate-300 block">
                  {isEn ? 'Select Relief Logistics Package:' : 'Pilih Paket Bantuan:'}
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {DONATION_PACKAGES.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                        selectedPackageId === pkg.id
                          ? 'bg-pink-950/40 border-pink-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{pkg.icon}</span>
                        <div>
                          <div className="font-bold">{isEn ? (pkg.titleEn || pkg.title) : pkg.title}</div>
                          <div className="text-[10px] text-slate-400">
                            {((isEn ? pkg.itemsIncludedEn : null) || pkg.itemsIncluded || []).slice(0, 2).join(', ')}...
                          </div>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-emerald-400 whitespace-nowrap">
                        Rp {pkg.priceIdr.toLocaleString(isEn ? 'en-US' : 'id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Donor Information */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-300">
                  {isEn ? 'Donor Identity:' : 'Informasi Donatur:'}
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-400">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-pink-600 focus:ring-0"
                  />
                  <span>{isEn ? 'Donate anonymously (Hamba Allah)' : 'Sembunyikan nama (Hamba Allah)'}</span>
                </label>
              </div>

              {!isAnonymous && (
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder={isEn ? 'Your Name / Organization' : 'Nama Lengkap / Instansi'}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isEn ? 'Email (for digital receipt)' : 'Email (untuk pengiriman kuitansi)'}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={isEn ? 'WhatsApp Number (optional)' : 'No WhatsApp (opsional)'}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
              </div>

              <textarea
                rows={2}
                value={prayerMessage}
                onChange={(e) => setPrayerMessage(e.target.value)}
                placeholder={isEn ? 'Words of encouragement or prayer for disaster survivors...' : 'Pesan doa atau dukungan moral untuk para korban bencana...'}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 resize-none"
              />
            </div>

            {/* Footer Total & Continue Button */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <div>
                <span className="text-slate-400 block">{isEn ? 'Total Contribution:' : 'Total Donasi:'}</span>
                <span className="text-lg font-black text-pink-400 font-mono">{formattedTotal}</span>
              </div>

              <button
                type="button"
                onClick={() => setStep('payment')}
                disabled={totalAmount <= 0}
                className="py-2.5 px-5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold transition flex items-center gap-2 shadow-lg shadow-pink-600/30"
              >
                <span>{isEn ? 'Proceed to Payment' : 'Lanjut ke Pembayaran'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2: PAYMENT METHOD & CONFIRMATION */
          <div className="p-5 sm:p-6 space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="text-slate-400 hover:text-white font-semibold transition"
              >
                ← {isEn ? 'Back to details' : 'Kembali ke rincian'}
              </button>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">{isEn ? 'Total Amount' : 'Nominal Donasi'}</span>
                <span className="font-mono font-black text-pink-400 text-sm">{formattedTotal}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="font-bold text-slate-300 block">
                {isEn ? 'Choose Payment Gateway:' : 'Pilih Metode Pembayaran:'}
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'qris', label: 'QRIS Nasional', icon: '📱' },
                  { id: 'va_bca', label: 'BCA Virtual Account', icon: '🏦' },
                  { id: 'va_mandiri', label: 'Mandiri VA', icon: '🏦' },
                  { id: 'va_bri', label: 'BRI VA', icon: '🏦' },
                  { id: 'va_bni', label: 'BNI VA', icon: '🏦' }
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      paymentMethod === pm.id
                        ? 'bg-pink-950/60 border-pink-500 text-white font-bold ring-1 ring-pink-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-base">{pm.icon}</span>
                    <span className="text-[11px] mt-1">{pm.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* QRIS / VA Display Box */}
            {paymentMethod === 'qris' ? (
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-center space-y-3">
                <div className="inline-block p-4 bg-white rounded-2xl shadow-xl">
                  {/* Clean SVG Mock QRIS */}
                  <div className="w-40 h-40 bg-slate-900 rounded-lg p-2 flex flex-col items-center justify-between text-white font-mono text-[9px]">
                    <div className="flex justify-between w-full">
                      <div className="w-8 h-8 bg-white rounded flex items-center justify-center font-bold text-slate-900">QR</div>
                      <div className="text-right">SIGAP<br/>BNPB</div>
                    </div>
                    <div className="text-[8px] text-pink-400 text-center uppercase tracking-widest font-sans font-bold">
                      QRIS NASIONAL
                    </div>
                    <div className="w-full text-center py-1 bg-white/10 rounded text-[8px]">
                      {formattedTotal}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-white text-xs">
                    {isEn ? 'Scan with GoPay, OVO, DANA, BCA, or any banking app' : 'Pindai menggunakan GoPay, OVO, DANA, BCA Mobile atau M-Banking apa pun'}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {isEn ? 'Automated instant payment settlement with 0% extra fee' : 'Pembayaran terverifikasi otomatis dalam tempo kurang dari 5 detik'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">
                    {isEn ? 'Virtual Account Number:' : 'Nomor Rekening Virtual Account:'}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    {isEn ? '24/7 Auto Settlement' : 'Verifikasi Otomatis'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-base font-black text-white">
                  <span>{getVANumber()}</span>
                  <button
                    type="button"
                    onClick={handleCopyVA}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 text-xs"
                  >
                    {copiedVA ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedVA ? (isEn ? 'Copied' : 'Tersalin') : (isEn ? 'Copy' : 'Salin')}</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isEn
                    ? 'Transfer the exact amount via ATM, Mobile Banking, or Internet Banking. Your transaction will automatically clear upon confirmation.'
                    : 'Transfer tepat sesuai nominal melalui ATM, M-Banking, atau I-Banking. Transaksi Anda akan diverifikasi otomatis.'}
                </p>
              </div>
            )}

            {/* Confirmation CTA */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl text-slate-400 hover:text-white font-semibold transition"
              >
                {isEn ? 'Cancel' : 'Batal'}
              </button>

              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={isSubmitting}
                className="py-2.5 px-5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold transition flex items-center gap-2 shadow-lg shadow-pink-600/30"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isSubmitting 
                    ? (isEn ? 'Processing...' : 'Memproses...') 
                    : (isEn ? 'I Have Completed Payment' : 'Saya Sudah Bayar / Selesai')}
                </span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
