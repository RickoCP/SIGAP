import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Language, TranslationDictionary, translations } from '../i18n/translations.ts';
import {
  getLocalizedText,
  getLocalizedDisaster,
  getLocalizedTask,
  getLocalizedSkill,
  getLocalizedDonationPackage,
  getLocalizedEarlyWarning,
  getLocalizedCitizenReport,
  getLocalizedBadge,
  getLocalizedReward,
  getLocalizedBMKGAlert,
  getLocalizedMitigationWindow,
  getLocalizedHeatPoint,
  getLocalizedVolunteerLevel,
  getLocalizedRegionalReadiness,
} from '../utils/localizedData.ts';
import {
  Disaster,
  Task,
  Skill,
  DonationPackage,
  EarlyWarningAlert,
  CitizenSafetyReport,
  GamificationBadge,
  RewardItem,
  BMKGAlert,
  SeasonalMitigationWindow,
  RegionalReadiness,
} from '../types/index.ts';
import { HeatPoint } from '../data/historicalHeatmapData.ts';

export interface DataLocalizer {
  text: (idText: string, enText?: string) => string;
  disaster: (disaster: Disaster) => Disaster;
  disasters: (disasters: Disaster[]) => Disaster[];
  task: (task: Task) => Task;
  tasks: (tasks: Task[]) => Task[];
  skill: (skill: Skill) => Skill;
  skills: (skills: Skill[]) => Skill[];
  donation: (pkg: DonationPackage) => DonationPackage;
  donations: (pkgs: DonationPackage[]) => DonationPackage[];
  earlyWarning: (alert: EarlyWarningAlert) => EarlyWarningAlert;
  earlyWarnings: (alerts: EarlyWarningAlert[]) => EarlyWarningAlert[];
  citizenReport: (report: CitizenSafetyReport) => CitizenSafetyReport;
  citizenReports: (reports: CitizenSafetyReport[]) => CitizenSafetyReport[];
  badge: (badge: GamificationBadge) => GamificationBadge;
  badges: (badges: GamificationBadge[]) => GamificationBadge[];
  reward: (reward: RewardItem) => RewardItem;
  rewards: (rewards: RewardItem[]) => RewardItem[];
  bmkgAlert: (alert: BMKGAlert) => BMKGAlert;
  bmkgAlerts: (alerts: BMKGAlert[]) => BMKGAlert[];
  mitigationWindow: (window: SeasonalMitigationWindow) => SeasonalMitigationWindow;
  heatPoint: (point: HeatPoint) => HeatPoint;
  heatPoints: (points: HeatPoint[]) => HeatPoint[];
  volunteerLevel: (points: number) => { level: number; levelTitle: string; nextLevelPoints: number };
  regionalReadiness: (readiness: RegionalReadiness) => RegionalReadiness;
}

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
  localize: DataLocalizer;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'sigap_app_language_v2';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'id') return saved;
    } catch {
      // ignore
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const localize = useMemo<DataLocalizer>(() => {
    return {
      text: (idText: string, enText?: string) => getLocalizedText(idText, enText, language),
      disaster: (d: Disaster) => getLocalizedDisaster(d, language),
      disasters: (ds: Disaster[]) => ds.map(d => getLocalizedDisaster(d, language)),
      task: (t: Task) => getLocalizedTask(t, language),
      tasks: (ts: Task[]) => ts.map(t => getLocalizedTask(t, language)),
      skill: (s: Skill) => getLocalizedSkill(s, language),
      skills: (ss: Skill[]) => ss.map(s => getLocalizedSkill(s, language)),
      donation: (p: DonationPackage) => getLocalizedDonationPackage(p, language),
      donations: (ps: DonationPackage[]) => ps.map(p => getLocalizedDonationPackage(p, language)),
      earlyWarning: (e: EarlyWarningAlert) => getLocalizedEarlyWarning(e, language),
      earlyWarnings: (es: EarlyWarningAlert[]) => es.map(e => getLocalizedEarlyWarning(e, language)),
      citizenReport: (r: CitizenSafetyReport) => getLocalizedCitizenReport(r, language),
      citizenReports: (rs: CitizenSafetyReport[]) => rs.map(r => getLocalizedCitizenReport(r, language)),
      badge: (b: GamificationBadge) => getLocalizedBadge(b, language),
      badges: (bs: GamificationBadge[]) => bs.map(b => getLocalizedBadge(b, language)),
      reward: (r: RewardItem) => getLocalizedReward(r, language),
      rewards: (rs: RewardItem[]) => rs.map(r => getLocalizedReward(r, language)),
      bmkgAlert: (a: BMKGAlert) => getLocalizedBMKGAlert(a, language),
      bmkgAlerts: (as: BMKGAlert[]) => as.map(a => getLocalizedBMKGAlert(a, language)),
      mitigationWindow: (w: SeasonalMitigationWindow) => getLocalizedMitigationWindow(w, language),
      heatPoint: (p: HeatPoint) => getLocalizedHeatPoint(p, language),
      heatPoints: (ps: HeatPoint[]) => ps.map(p => getLocalizedHeatPoint(p, language)),
      volunteerLevel: (pts: number) => getLocalizedVolunteerLevel(pts, language),
      regionalReadiness: (r: RegionalReadiness) => getLocalizedRegionalReadiness(r, language),
    };
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
        localize,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

/**
 * Convenient hook to get both current language and pre-bound localizer helpers.
 */
export const useLocalizedData = () => {
  const { language, setLanguage, t, localize } = useLanguage();
  return {
    language,
    setLanguage,
    t,
    localize,
    ...localize,
  };
};
