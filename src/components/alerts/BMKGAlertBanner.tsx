import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Radio } from 'lucide-react';
import { BMKGAlert } from '../../types/index.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface BMKGAlertBannerProps {
  alerts: BMKGAlert[];
  onSelectAlert?: (alert: BMKGAlert) => void;
  onOpenEarlyWarningTab?: () => void;
}

export const BMKGAlertBanner: React.FC<BMKGAlertBannerProps> = ({ 
  alerts, 
  onSelectAlert,
  onOpenEarlyWarningTab 
}) => {
  const [expanded, setExpanded] = useState(false);
  const { language, t } = useLanguage();

  if (!alerts || alerts.length === 0) return null;
  const primaryAlert = alerts[0];

  const depthLabel = language === 'id' ? 'kedalaman' : 'depth';
  const alertCountSuffix = language === 'id' ? 'Peringatan' : 'Alerts';
  const monitoredSubtitle = language === 'id' 
    ? 'Pusat Gempa & Cuaca Ekstrem Terpantau' 
    : 'Active Earthquake & Severe Weather Center';

  return (
    <div className="bg-amber-950/40 border-b border-amber-500/30 text-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="flex items-center justify-center w-5 h-5 rounded bg-amber-500/20 text-amber-400 shrink-0">
              <AlertTriangle className="w-3.5 h-3.5" />
            </span>
            <span className="font-semibold text-amber-300 shrink-0">{t.alertBannerEarlyWarning}</span>
            <span className="truncate text-amber-100 font-medium">
              {primaryAlert.title} · {primaryAlert.location}
              {primaryAlert.magnitude ? ` (${primaryAlert.magnitude}, ${depthLabel} ${primaryAlert.depth})` : ''}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onOpenEarlyWarningTab && (
              <button
                onClick={onOpenEarlyWarningTab}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-[11px] font-bold transition"
              >
                <span>{language === 'id' ? 'Buka EWS Publik & Evakuasi >' : 'Open Public EWS & Evacuation >'}</span>
              </button>
            )}
            <span className="text-[11px] text-amber-400/80 hidden lg:inline font-mono tabular-nums">
              {monitoredSubtitle}
            </span>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-amber-300 hover:text-white flex items-center gap-1 font-medium transition-colors"
            >
              <span>{alerts.length} {alertCountSuffix}</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-2.5 pt-2.5 border-t border-amber-500/20 grid grid-cols-1 md:grid-cols-3 gap-3 pb-1">
            {alerts.map(a => (
              <div
                key={a.id}
                onClick={() => onSelectAlert?.(a)}
                className="bg-amber-900/20 border border-amber-500/20 p-2.5 rounded-lg cursor-pointer hover:bg-amber-900/30 transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-amber-200">{a.eventType}</span>
                  <span className="text-[10px] text-amber-400 font-mono tabular-nums">
                    {new Date(a.timestamp).toLocaleTimeString(language === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit' })} {language === 'id' ? 'WIB' : 'UTC+7'}
                  </span>
                </div>
                <p className="text-xs text-amber-100/90 line-clamp-2">{a.title}</p>
                <div className="mt-1.5 flex items-center gap-2 text-[11px] text-amber-300/80">
                  <Radio className="w-3 h-3 text-amber-400" />
                  <span className="truncate">{a.location}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
