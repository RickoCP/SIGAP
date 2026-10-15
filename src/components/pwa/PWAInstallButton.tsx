import React, { useState } from 'react';
import { Download, CheckCircle, Share2, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const { language } = useLanguage();

  // If already running as an installed PWA in standalone mode, hide
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={async () => {
          setIsInstalling(true);
          try {
            await install();
          } finally {
            setIsInstalling(false);
          }
        }}
        disabled={isInstalling}
        title={language === 'id' ? 'Instal Aplikasi SIGAP (PWA Offline)' : 'Install SIGAP App (Offline PWA)'}
        className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:scale-102 active:scale-98"
      >
        <Download className="w-3.5 h-3.5 animate-bounce" />
        <span className="hidden sm:inline">
          {language === 'id' ? 'Instal Aplikasi PWA' : 'Install PWA App'}
        </span>
        <span className="sm:hidden">
          {language === 'id' ? 'Instal' : 'Install'}
        </span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    const isEn = language === 'en';
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          title={isEn ? 'Install on iPhone / iPad' : 'Instal di iPhone / iPad'}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition"
        >
          <Smartphone className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">{isEn ? 'Install iOS' : 'Instal iOS'}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                    <Share2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {isEn ? 'Install on iPhone / iPad' : 'Instal di iPhone / iPad'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-750">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">1</span>
                  <p>
                    {isEn 
                      ? <>Tap the <strong>Share</strong> button (square icon with upward arrow) in the Safari bottom bar.</>
                      : <>Ketuk tombol <strong>Share</strong> (ikon kotak panah atas) di menu bawah Safari.</>}
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-750">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">2</span>
                  <p>
                    {isEn
                      ? <>Scroll down and select <strong>Add to Home Screen</strong>.</>
                      : <>Gulir ke bawah lalu pilih <strong>Add to Home Screen</strong> (Tambahkan ke Layar Utama).</>}
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-750">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">3</span>
                  <p>
                    {isEn
                      ? <>SIGAP App is now accessible directly and offline from your iPhone home screen.</>
                      : <>Aplikasi SIGAP dapat diakses cepat secara offline dari layar ponsel Anda.</>}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-2.5 text-sm font-bold text-white transition shadow-lg shadow-blue-600/30"
              >
                {isEn ? 'Got It' : 'Mengerti'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
