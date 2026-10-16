import { Language } from '../i18n/translations.ts';
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
  RegionalHistoricalData,
  RegionalReadiness,
} from '../types/index.ts';
import { HeatPoint } from '../data/historicalHeatmapData.ts';

/**
 * Fallback helper to return localized text based on current language.
 */
export function getLocalizedText(idText: string, enText: string | undefined, lang: Language): string {
  if (lang === 'en' && enText && enText.trim().length > 0) {
    return enText;
  }
  return idText;
}

/**
 * Returns a localized clone of a Disaster entity.
 */
export function getLocalizedDisaster(disaster: Disaster, lang: Language): Disaster {
  if (lang === 'en') {
    return {
      ...disaster,
      title: disaster.titleEn || disaster.title,
      description: disaster.descriptionEn || disaster.description,
      keyNeeds: (disaster.keyNeedsEn && disaster.keyNeedsEn.length > 0) ? disaster.keyNeedsEn : disaster.keyNeeds,
    };
  }
  return disaster;
}

/**
 * Returns a localized clone of an Operational Task entity.
 */
export function getLocalizedTask(task: Task, lang: Language): Task {
  if (lang === 'en') {
    return {
      ...task,
      title: task.titleEn || task.title,
      description: task.descriptionEn || task.description,
      requiredSkillName: task.requiredSkillNameEn || task.requiredSkillName,
    };
  }
  return task;
}

/**
 * Returns a localized clone of a Volunteer Skill entity.
 */
export function getLocalizedSkill(skill: Skill, lang: Language): Skill {
  if (lang === 'en') {
    return {
      ...skill,
      name: skill.nameEn || skill.name,
      description: skill.descriptionEn || skill.description,
    };
  }
  return skill;
}

/**
 * Returns a localized clone of a Donation Package.
 */
export function getLocalizedDonationPackage(pkg: DonationPackage, lang: Language): DonationPackage {
  if (lang === 'en') {
    return {
      ...pkg,
      title: pkg.titleEn || pkg.title,
      description: pkg.descriptionEn || pkg.description,
      itemsIncluded: (pkg.itemsIncludedEn && pkg.itemsIncludedEn.length > 0) ? pkg.itemsIncludedEn : pkg.itemsIncluded,
    };
  }
  return pkg;
}

/**
 * Returns a localized clone of an Early Warning Alert.
 */
export function getLocalizedEarlyWarning(alert: EarlyWarningAlert, lang: Language): EarlyWarningAlert {
  if (lang === 'en') {
    return {
      ...alert,
      title: alert.titleEn || alert.title,
      evacuationAdvice: alert.evacuationAdviceEn || alert.evacuationAdvice,
      keyActionSteps: (alert.keyActionStepsEn && alert.keyActionStepsEn.length > 0) ? alert.keyActionStepsEn : alert.keyActionSteps,
    };
  }
  return alert;
}

/**
 * Returns a localized clone of a Citizen Safety Report.
 */
export function getLocalizedCitizenReport(report: CitizenSafetyReport, lang: Language): CitizenSafetyReport {
  if (lang === 'en') {
    return {
      ...report,
      urgentNeeds: report.urgentNeedsEn || report.urgentNeeds,
    };
  }
  return report;
}

/**
 * Returns a localized clone of a Gamification Badge.
 */
export function getLocalizedBadge(badge: GamificationBadge, lang: Language): GamificationBadge {
  if (lang === 'en') {
    return {
      ...badge,
      name: badge.nameEn || badge.name,
      description: badge.descriptionEn || badge.description,
    };
  }
  return badge;
}

/**
 * Returns a localized clone of a Reward Item.
 */
export function getLocalizedReward(reward: RewardItem, lang: Language): RewardItem {
  if (lang === 'en') {
    return {
      ...reward,
      title: reward.titleEn || reward.title,
      description: reward.descriptionEn || reward.description,
    };
  }
  return reward;
}

/**
 * Returns a localized clone of a BMKG Alert.
 */
export function getLocalizedBMKGAlert(alert: BMKGAlert, lang: Language): BMKGAlert {
  if (lang === 'en') {
    return {
      ...alert,
      title: alert.titleEn || alert.title,
      description: alert.descriptionEn || alert.description,
      instruction: alert.instructionEn || alert.instruction,
    };
  }
  return alert;
}

/**
 * Returns a localized Seasonal Mitigation Window.
 */
export function getLocalizedMitigationWindow(window: SeasonalMitigationWindow, lang: Language): SeasonalMitigationWindow {
  if (lang === 'en') {
    return {
      ...window,
      title: window.titleEn || window.title,
      peakRiskPeriod: window.peakRiskPeriodEn || window.peakRiskPeriod,
      criticalMitigationWindow: window.criticalMitigationWindowEn || window.criticalMitigationWindow,
      recommendedActions: (window.recommendedActionsEn && window.recommendedActionsEn.length > 0) ? window.recommendedActionsEn : window.recommendedActions,
    };
  }
  return window;
}

/**
 * Returns a localized HeatPoint for historical heatmap.
 */
export function getLocalizedHeatPoint(point: HeatPoint, lang: Language): HeatPoint {
  if (lang === 'en') {
    return {
      ...point,
      name: point.nameEn || point.name,
      description: point.descriptionEn || point.description,
    };
  }
  return point;
}

/**
 * Returns localized level title for volunteer points.
 */
export function getLocalizedVolunteerLevel(points: number, lang: Language): { level: number; levelTitle: string; nextLevelPoints: number } {
  if (points < 200) {
    return {
      level: 1,
      levelTitle: lang === 'en' ? 'Junior Alert Volunteer' : 'Relawan Siaga Muda',
      nextLevelPoints: 200,
    };
  } else if (points < 500) {
    return {
      level: 2,
      levelTitle: lang === 'en' ? 'Skilled Responder' : 'Relawan Tanggap Terampil',
      nextLevelPoints: 500,
    };
  } else if (points < 900) {
    return {
      level: 3,
      levelTitle: lang === 'en' ? 'Mission Squad Commander' : 'Komandan Regu Misi',
      nextLevelPoints: 900,
    };
  } else if (points < 1500) {
    return {
      level: 4,
      levelTitle: lang === 'en' ? 'Field Operations Specialist' : 'Spesialis Operasi Lapangan',
      nextLevelPoints: 1500,
    };
  } else {
    return {
      level: 5,
      levelTitle: lang === 'en' ? 'Senior Humanitarian Hero' : 'Pahlawan Kemanusiaan Utama',
      nextLevelPoints: 2500,
    };
  }
}

/**
 * Returns localized Regional Readiness.
 */
export function getLocalizedRegionalReadiness(readiness: RegionalReadiness, lang: Language): RegionalReadiness {
  if (lang === 'en') {
    return {
      ...readiness,
      keyVulnerabilities: (readiness.keyVulnerabilitiesEn && readiness.keyVulnerabilitiesEn.length > 0) ? readiness.keyVulnerabilitiesEn : readiness.keyVulnerabilities,
      strategicRecommendations: (readiness.strategicRecommendationsEn && readiness.strategicRecommendationsEn.length > 0) ? readiness.strategicRecommendationsEn : readiness.strategicRecommendations,
      historicalData: readiness.historicalData ? {
        ...readiness.historicalData,
        historicalAnalysisNotes: readiness.historicalData.historicalAnalysisNotesEn || readiness.historicalData.historicalAnalysisNotes,
        mitigationWindows: readiness.historicalData.mitigationWindows.map(w => getLocalizedMitigationWindow(w, 'en')),
      } : undefined,
    };
  }
  return readiness;
}
