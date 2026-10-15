import React, { useState } from 'react';
import { 
  Radio, 
  X, 
  Send, 
  MessageSquare, 
  Check, 
  Copy, 
  MapPin, 
  Users, 
  Sparkles 
} from 'lucide-react';
import { Disaster, BroadcastAlert } from '../../types/index.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface BroadcastModalProps {
  disaster: Disaster;
  volunteerCountInRadius: number;
  onSendBroadcast: (broadcast: BroadcastAlert) => void;
  onClose: () => void;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({
  disaster,
  volunteerCountInRadius,
  onSendBroadcast,
  onClose,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [channel, setChannel] = useState<'whatsapp' | 'sms' | 'push' | 'radio'>('whatsapp');
  const [radiusKm, setRadiusKm] = useState<number>(25);
  const [customNote, setCustomNote] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [generating, setGenerating] = useState<boolean>(false);
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerateAI = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/broadcast-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disasterId: disaster.id,
          channel,
          radiusKm,
          customNote,
          language,
        }),
      });

      if (!res.ok) throw new Error(isEn ? 'Failed to generate broadcast message' : 'Gagal membuat pesan siaran');
      const data: BroadcastAlert = await res.json();
      setMessage(data.message);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleSend = () => {
    if (!message) return;
    const alertItem: BroadcastAlert = {
      id: `bc-${Date.now()}`,
      disasterId: disaster.id,
      title: isEn ? `Emergency Broadcast: ${disaster.title}` : `Siaran Darurat: ${disaster.title}`,
      message,
      channel,
      recipientCount: volunteerCountInRadius || 14,
      sentAt: new Date().toISOString(),
      radiusKm,
    };
    onSendBroadcast(alertItem);
    setSentSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-950/60 via-slate-900 to-amber-950/50 p-5 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isEn ? 'Field Emergency Broadcast Dispatch' : 'Siaran Panggilan Darurat Lapangan'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEn 
                  ? 'Dispatch rapid mobilization alert to all verified responders registered in the hazard impact zone'
                  : 'Kirim pesan mobilisasi darurat instan kepada seluruh relawan terdaftar dalam radius bencana'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Target Disaster */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-[11px] block">
                {isEn ? 'Target Incident Scene:' : 'Target Lokasi Bencana:'}
              </span>
              <span className="font-semibold text-white text-xs">{disaster.title}</span>
            </div>
            <div className="text-right font-mono tabular-nums text-blue-400">
              <Users className="w-3.5 h-3.5 inline mr-1" />
              ~{volunteerCountInRadius || 18} {isEn ? 'Ready Responders' : 'Relawan Siaga'}
            </div>
          </div>

          {/* Broadcast Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">
                {isEn ? 'Communication Channel' : 'Kanal Komunikasi'}
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setChannel('whatsapp')}
                  className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                    channel === 'whatsapp'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('sms')}
                  className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                    channel === 'sms'
                      ? 'bg-blue-950 text-blue-300 border border-blue-800/80 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  SMS Blast
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">
                {isEn ? 'Broadcast Reach Radius: ' : 'Radius Jangkauan Panggilan: '}
                <span className="text-white font-mono">{radiusKm} km</span>
              </label>
              <input
                type="range"
                min="5"
                max="80"
                step="5"
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-2"
              />
            </div>
          </div>

          {/* Custom Directive Input */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">
              {isEn ? 'Additional Coordinator Directive (Optional)' : 'Instruksi Tambahan Koordinator (Opsional)'}
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder={isEn ? 'e.g. Bring personal raincoats & life vests, staging post at Sector 2...' : 'Contoh: Bawa jas hujan & pelampung pribadi, titik kumpul di Balai RW 02...'}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Action to draft message via AI */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-400 text-[11px]">
              {isEn ? 'Draft tactical alert via Gemini AI:' : 'Draf pesan taktis menggunakan Gemini AI:'}
            </span>
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={generating}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-600/30"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {generating ? (isEn ? 'Drafting with Gemini...' : 'Gemini Menulis Draf...') : (isEn ? 'Draft via AI' : 'Buat Draf via AI')}
            </button>
          </div>

          {/* Message Preview / Editor */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">
              {isEn ? 'Broadcast Message Content' : 'Isi Pesan Siaran'}
            </label>
            <textarea
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isEn ? "Click 'Draft via AI' or compose dispatch message manually..." : "Klik 'Buat Draf via AI' atau ketik pesan manual di sini..."}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans text-xs focus:outline-none focus:border-blue-500 leading-relaxed font-mono"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!message}
            className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 flex items-center gap-1.5 disabled:opacity-40"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? (isEn ? 'Copied' : 'Tersalin') : (isEn ? 'Copy Message' : 'Salin Pesan')}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              {isEn ? 'Cancel' : 'Batal'}
            </button>
            <button
              type="button"
              disabled={!message || sentSuccess}
              onClick={handleSend}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                sentSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-sm shadow-red-600/30'
              }`}
            >
              {sentSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  {isEn ? 'Broadcast Dispatched!' : 'Siaran Terkirim!'}
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  {isEn ? 'Send Emergency Broadcast' : 'Kirim Siaran Sekarang'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
