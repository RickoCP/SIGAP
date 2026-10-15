import React, { useState } from 'react';
import { 
  CheckCircle2, 
  X, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  ShieldCheck, 
  Heart, 
  Calendar, 
  CreditCard,
  FileText
} from 'lucide-react';
import { DisasterDonation } from '../../types/index.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface DonationReceiptModalProps {
  donation: DisasterDonation;
  onClose: () => void;
  onDonateAgain?: () => void;
}

export const DonationReceiptModal: React.FC<DonationReceiptModalProps> = ({
  donation,
  onClose,
  onDonateAgain
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const formattedAmount = new Intl.NumberFormat(isEn ? 'en-US' : 'id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(donation.amount);

  const formattedDate = new Date(donation.createdAt).toLocaleString(isEn ? 'en-US' : 'id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleCopyReference = () => {
    navigator.clipboard.writeText(donation.referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      isEn
        ? `I have donated ${formattedAmount} for emergency response "${donation.disasterTitle}" via SIGAP BNPB Disaster Response. Join hands in supporting our communities: https://sigap.bnpb.go.id/donasi?ref=${donation.referenceNumber}`
        : `Alhamdulillah, saya telah berdonasi sebesar ${formattedAmount} untuk tanggap darurat "${donation.disasterTitle}" melalui SIGAP Tanggap Bencana BNPB. Mari bersama ringankan duka saudara kita: https://sigap.bnpb.go.id/donasi?ref=${donation.referenceNumber}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleDownloadReceipt = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Top Header Decorative Ribbon */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-black/20 hover:bg-black/40 text-white transition"
            aria-label={isEn ? 'Close' : 'Tutup'}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex p-3 bg-white/20 backdrop-blur-md rounded-2xl mb-3 border border-white/30 shadow-lg">
            <CheckCircle2 className="w-9 h-9 text-white" />
          </div>
          
          <h3 className="text-xl font-bold tracking-tight">
            {isEn ? 'Official Donation Receipt' : 'Tanda Terima Donasi Resmi'}
          </h3>
          <p className="text-emerald-100 text-xs mt-1">
            {isEn ? 'BNPB Pusdalops & SIGAP Emergency Disaster Response Post' : 'Pusdalops BNPB & Posko Tanggap Darurat Bencana SIGAP'}
          </p>
        </div>

        {/* Certificate Body */}
        <div className="p-6 space-y-5 text-slate-200">
          
          {/* Amount Badge Banner */}
          <div className="text-center p-4 rounded-xl bg-slate-950/70 border border-emerald-500/30">
            <div className="text-xs text-slate-400 font-medium">
              {isEn ? 'Verified Donation Amount' : 'Nominal Donasi Terverifikasi'}
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1 font-mono">
              {formattedAmount}
            </div>
            {donation.type === 'package' && donation.packageTitle && (
              <div className="inline-block mt-2 px-3 py-1 bg-emerald-950/80 border border-emerald-700/50 rounded-full text-xs text-emerald-300 font-medium">
                🎁 {donation.packageTitle}
              </div>
            )}
          </div>

          {/* Details Table */}
          <div className="space-y-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-700/60">
              <span className="text-slate-400">{isEn ? 'Reference Number' : 'Nomor Referensi'}</span>
              <div className="flex items-center gap-1.5 font-mono font-bold text-white">
                <span>{donation.referenceNumber}</span>
                <button
                  onClick={handleCopyReference}
                  className="p-1 hover:text-emerald-400 transition"
                  title={isEn ? 'Copy Reference Number' : 'Salin Nomor Referensi'}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-start py-1 border-b border-slate-700/60">
              <span className="text-slate-400">{isEn ? 'Target Crisis' : 'Target Bencana'}</span>
              <span className="font-semibold text-white text-right max-w-[240px]">
                {donation.disasterTitle}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-700/60">
              <span className="text-slate-400">{isEn ? 'Donor Name' : 'Nama Donatur'}</span>
              <span className="font-semibold text-white">
                {donation.donorName} {donation.isAnonymous && (isEn ? '(Anonymous)' : '(Anonim)')}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-700/60">
              <span className="text-slate-400">{isEn ? 'Payment Method' : 'Metode Pembayaran'}</span>
              <span className="font-semibold text-emerald-300 uppercase">
                {donation.paymentMethod.replace('_', ' ')}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-700/60">
              <span className="text-slate-400">{isEn ? 'Transaction Timestamp' : 'Waktu Transaksi'}</span>
              <span className="text-slate-300">{formattedDate}</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">{isEn ? 'Allocation Status' : 'Status Penyaluran'}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 font-semibold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                {isEn ? 'Received & Allocated' : 'Diterima & Dialokasikan'}
              </span>
            </div>
          </div>

          {/* Prayer message note */}
          {donation.prayerMessage && (
            <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800 text-xs italic text-slate-300">
              <span className="text-slate-400 font-semibold not-italic block mb-0.5">
                {isEn ? "Donor's Prayer & Note:" : 'Doa & Pesan Donatur:'}
              </span>
              &ldquo;{donation.prayerMessage}&rdquo;
            </div>
          )}

          {/* Verification stamp note */}
          <div className="flex items-center gap-3 p-3 bg-blue-950/40 rounded-xl border border-blue-800/40 text-[11px] text-blue-200">
            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
            <span>
              {isEn 
                ? 'Aid funds are dispatched directly through field logistics of BNPB, BPBD, and official SIGAP frontline responder soup kitchens.'
                : 'Donasi disalurkan secara langsung melalui logistik lapangan BNPB, BPBD, dan Dapur Umum resmi relawan SIGAP.'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleDownloadReceipt}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition flex items-center justify-center gap-2"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{isEn ? 'Downloaded!' : 'Tersimpan!'}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{isEn ? 'Download Receipt' : 'Unduh Kuitansi'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
            >
              <Share2 className="w-4 h-4" />
              <span>{isEn ? 'Share (WhatsApp)' : 'Bagikan (WhatsApp)'}</span>
            </button>
          </div>

          {onDonateAgain && (
            <button
              onClick={() => {
                onClose();
                onDonateAgain();
              }}
              className="w-full py-2 text-center text-xs text-slate-400 hover:text-emerald-400 font-medium transition"
            >
              + {isEn ? 'Make Another Contribution' : 'Buat Donasi Lainnya'}
            </button>
          )}

        </div>
      </div>
    </div>
  );
};
