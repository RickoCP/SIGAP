export type SkillCategory = 
  | 'medical' 
  | 'sar' 
  | 'logistics' 
  | 'transport' 
  | 'food' 
  | 'shelter' 
  | 'communication' 
  | 'psychosocial';

export interface Skill {
  id: string;
  name: string;
  nameEn?: string;
  category: SkillCategory;
  description: string;
  descriptionEn?: string;
}

export type VolunteerStatus = 'available' | 'busy' | 'offline';
export type SkillProficiency = 'beginner' | 'intermediate' | 'expert';

export interface VolunteerSkill {
  skillId: string;
  proficiency: SkillProficiency;
}

export type VolunteerCategory = 'sar_official' | 'public_community';

export interface GamificationBadge {
  id: string;
  name: string;
  nameEn?: string;
  icon: string;
  description: string;
  descriptionEn?: string;
  category: 'mission' | 'skill' | 'sar' | 'community' | 'hero';
  unlockedAt?: string;
}

export interface RewardItem {
  id: string;
  title: string;
  titleEn?: string;
  category: 'gear' | 'certificate' | 'voucher' | 'training';
  pointsCost: number;
  description: string;
  descriptionEn?: string;
  icon: string;
  sponsor: string;
  stock: number;
}

export interface VolunteerGamification {
  points: number;
  level: number;
  levelTitle: string;
  levelTitleEn?: string;
  nextLevelPoints: number;
  completedMissionsCount: number;
  hoursContributed: number;
  badges: GamificationBadge[];
  claimedRewardIds: string[];
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  locationLat: number;
  locationLng: number;
  address: string;
  city: string;
  radiusKm: number;
  status: VolunteerStatus;
  category?: VolunteerCategory; // 'sar_official' vs 'public_community'
  sarUnitOrRole?: string; // e.g. 'Basarnas USAR Regu Bravo', 'Potensi SAR Girigahana', 'Warga Relawan Dapur'
  skills: VolunteerSkill[];
  activeTasksCount: number;
  completedTasksCount: number;
  organization?: string;
  joinedDate: string;
  gamification?: VolunteerGamification;
}

export type DisasterType = 
  | 'flood' 
  | 'earthquake' 
  | 'fire' 
  | 'landslide' 
  | 'tsunami' 
  | 'volcanic' 
  | 'storm' 
  | 'other';

export type DisasterSeverity = 'low' | 'medium' | 'high' | 'critical';
export type DisasterStatus = 'reported' | 'active' | 'responding' | 'resolved';

export interface Disaster {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  type: DisasterType;
  severity: DisasterSeverity;
  locationLat: number;
  locationLng: number;
  address: string;
  province: string;
  region?: 'Sumatera' | 'Jawa' | 'Kalimantan' | 'Sulawesi' | 'Bali-NusaTenggara' | 'Maluku-Papua';
  status: DisasterStatus;
  reportedAt: string;
  resolvedAt?: string;
  affectedPeople: number;
  affectedHouseholds: number;
  evacuationCenterCount: number;
  keyNeeds: string[];
  keyNeedsEn?: string[];
  activeHotspots?: number;
  waterLevelCm?: number;
  fireIntensity?: 'low' | 'medium' | 'high' | 'extreme';
  donationTargetIdr?: number;
  donationCollectedIdr?: number;
  donorsCount?: number;
  urgencyDaysLeft?: number;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

export interface Task {
  id: string;
  disasterId: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  requiredSkillCategory: SkillCategory;
  requiredSkillName: string;
  requiredSkillNameEn?: string;
  priority: TaskPriority;
  locationLat: number;
  locationLng: number;
  address: string;
  status: TaskStatus;
  volunteersNeeded: number;
  volunteersAssigned: number;
  createdAt: string;
  targetCompletionTime?: string;
}

export type AssignmentStatus = 'pending' | 'accepted' | 'declined' | 'in_progress' | 'completed';

export interface Assignment {
  id: string;
  taskId: string;
  volunteerId: string;
  disasterId: string;
  status: AssignmentStatus;
  assignedAt: string;
  acceptedAt?: string;
  completedAt?: string;
  notes?: string;
  matchScore?: number;
  matchReason?: string;
}

export interface AIRecommendation {
  volunteerId: string;
  volunteerName: string;
  phone: string;
  score: number; // 0 to 1
  distanceKm: number;
  status: VolunteerStatus;
  primarySkill: string;
  reasoning: string;
  matchedCriteria: {
    skillsMatch: number; // 0 to 1
    proximity: number;   // 0 to 1
    availability: number;// 0 to 1
    experience: number;  // 0 to 1
  };
}

export interface BMKGAlert {
  id: string;
  title: string;
  titleEn?: string;
  eventType: string;
  magnitude?: string;
  depth?: string;
  location: string;
  timestamp: string;
  level: 'warning' | 'alert' | 'advisory';
  coordinates: [number, number];
  potentialTsunami?: boolean;
  description?: string;
  descriptionEn?: string;
  instruction?: string;
  instructionEn?: string;
}

export interface BroadcastAlert {
  id: string;
  disasterId: string;
  title: string;
  message: string;
  channel: 'whatsapp' | 'sms' | 'push' | 'radio';
  recipientCount: number;
  sentAt: string;
  radiusKm: number;
}

export interface SituationReport {
  disasterId: string;
  timestamp: string;
  executiveSummary: string;
  urgentNeeds: string[];
  operationalPriorities: string[];
  recommendedTeamAllocations: {
    role: string;
    count: number;
    urgency: string;
  }[];
  governmentLiaisonNotes: string;
}

export interface GroundedPlace {
  title: string;
  uri: string;
  address?: string;
  type?: string;
}

export interface MapsGroundingResponse {
  text: string;
  places: GroundedPlace[];
  source: string;
}

export type IndonesiaRegion = 'Sumatera' | 'Jawa' | 'Kalimantan' | 'Sulawesi' | 'Bali-NusaTenggara' | 'Maluku-Papua';

export interface MonthlyHistoricalTrend {
  month: string; // 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  monthFull: string;
  fireHotspots: number;
  fireRiskScore: number; // 0 to 100
  rainfallMm: number;
  floodIncidents: number;
  floodRiskScore: number; // 0 to 100
  dominantThreat: 'fire' | 'flood' | 'low';
}

export interface YearlyHistoricalTrend {
  year: number; // 2022 - 2026
  fireHectaresBurned: number;
  fireHotspotCount: number;
  floodDisasterCount: number;
  floodAffectedPeople: number;
  economicLossBillionsIDR: number;
}

export interface SeasonalMitigationWindow {
  threat: 'fire' | 'flood';
  title: string;
  titleEn?: string;
  peakRiskPeriod: string;
  peakRiskPeriodEn?: string;
  criticalMitigationWindow: string;
  criticalMitigationWindowEn?: string;
  recommendedActions: string[];
  recommendedActionsEn?: string[];
  urgency: 'critical' | 'high' | 'moderate';
  status: 'active_window' | 'upcoming' | 'passed';
}

export interface RegionalHistoricalData {
  monthlyTrends: MonthlyHistoricalTrend[];
  yearlyTrends: YearlyHistoricalTrend[];
  mitigationWindows: SeasonalMitigationWindow[];
  historicalAnalysisNotes: string;
  historicalAnalysisNotesEn?: string;
}

export interface RegionalReadiness {
  id: string;
  province: string;
  capitalCity: string;
  region: IndonesiaRegion;
  readinessScore: number; // 0 to 100
  status: 'optimal' | 'siaga' | 'waspada' | 'kritis';
  populationMillions: number;
  fireReadiness: {
    score: number; // 0 to 100
    riskLevel: 'Rendah' | 'Sedang' | 'Tinggi' | 'Ekstrem';
    activeHotspots: number;
    peatlandAreaHa: number;
    firefightingVolunteers: number;
    waterBombingBases: number;
    manggalaAgniPosts: number;
    canalBlocksBuilt: number;
    earlyWarningStatus: string;
  };
  floodReadiness: {
    score: number; // 0 to 100
    riskLevel: 'Rendah' | 'Sedang' | 'Tinggi' | 'Ekstrem';
    floodPronePoints: number;
    drainagePumpCapacityM3s: number;
    rubberBoatsAvailable: number;
    waterRescueVolunteers: number;
    evacuationShelters: number;
    earlyWarningStatus: string;
  };
  earthquakeReadiness?: {
    score: number;
    riskLevel: 'Rendah' | 'Sedang' | 'Tinggi' | 'Ekstrem';
    activeFaults: string[];
    seismicSensors: number;
    usarCollapseTeams: number;
    earthquakeResistantShelters: number;
    earlyWarningStatus: string;
  };
  landslideReadiness?: {
    score: number;
    riskLevel: 'Rendah' | 'Sedang' | 'Tinggi' | 'Ekstrem';
    highRiskSlopes: number;
    extensometersInstalled: number;
    heavyEquipmentExcavators: number;
    earlyWarningStatus: string;
  };
  tsunamiReadiness?: {
    score: number;
    riskLevel: 'Rendah' | 'Sedang' | 'Tinggi' | 'Ekstrem';
    coastalSirensCount: number;
    tsunamiEvacuationRoutes: number;
    coastalShelterBuildings: number;
    earlyWarningStatus: string;
  };
  volcanicReadiness?: {
    score: number;
    riskLevel: 'Rendah' | 'Sedang' | 'Tinggi' | 'Ekstrem';
    activeVolcanoes: string[];
    hazardZonesRadiusKm: number;
    ashfallProtectionMasksStock: number;
    earlyWarningStatus: string;
  };
  logisticsCapacity: {
    emergencyTents: number;
    generators: number;
    hygieneKits: number;
    fieldKitchenCapacityMealsPerDay: number;
  };
  volunteerRatioPer10kPopulation: number;
  lastAuditDate: string;
  keyVulnerabilities: string[];
  keyVulnerabilitiesEn?: string[];
  strategicRecommendations: string[];
  strategicRecommendationsEn?: string[];
  historicalData?: RegionalHistoricalData;
}


export interface ReadinessAIReport {
  provinceId: string;
  provinceName: string;
  overallScore: number;
  generatedAt: string;
  threatAssessment: {
    karhutlaRisk: string;
    floodRisk: string;
    summary: string;
  };
  criticalGaps: string[];
  contingencyProtocol72h: {
    phase: string;
    action: string;
    responsibleUnit: string;
  }[];
  volunteerMobilizationGuidance: string;
  resourceAllocationPriorities: string[];
}

export interface VolunteerTrackingTelemetry {
  volunteerId: string;
  volunteerName: string;
  avatar?: string;
  phone: string;
  organization?: string;
  category?: VolunteerCategory;
  sarUnitOrRole?: string;
  currentLat: number;
  currentLng: number;
  previousPositions: [number, number][]; // breadcrumb trail history
  speedKmh: number;
  headingDeg: number;
  altitudeM: number;
  batteryLevel: number;
  signalStrength: '4G LTE' | 'Radio HT' | 'Starlink Sat';
  signalBars: number;
  heartRateBpm: number;
  assignedTaskId?: string;
  assignedTaskTitle?: string;
  disasterId?: string;
  disasterTitle?: string;
  destinationName?: string;
  destinationLat?: number;
  destinationLng?: number;
  distanceToDestinationM: number;
  etaMinutes: number;
  lastPing: string;
  dutyType: string;
  operationalStatus: 'en_route' | 'on_site' | 'evacuating' | 'patrolling';
}

export interface HistoricalTrendAINarrative {
  provinceId: string;
  provinceName: string;
  generatedAt: string;
  executiveHeadline: string;
  trendTrajectoryAnalysis: string;
  seasonalCyclicalDeepDive: string;
  climateAnomalyCorrelation: {
    elNinoImpactSummary: string;
    laNinaOrMonsoonRisk: string;
    recurrencePattern: string;
  };
  predictiveRiskForecastNext6Months: {
    period: string;
    projectedThreat: string;
    vulnerabilityForecast: string;
    preemptiveAlertLevel: 'Waspada' | 'Siaga' | 'Awas';
  }[];
  dataDrivenActionRecommendations: {
    title: string;
    timing: string;
    rationaleFromHistoricalData: string;
    actionItems: string[];
  }[];
  volunteerAndLogisticsPrepositioning: string;
}

export interface FieldTaskNotification {
  id: string;
  taskId: string;
  taskTitle: string;
  taskDescription: string;
  priority: TaskPriority;
  requiredSkillCategory: SkillCategory;
  requiredSkillName: string;
  volunteersNeeded: number;
  disasterId: string;
  disasterTitle: string;
  disasterAddress: string;
  locationLat: number;
  locationLng: number;
  distanceKm?: number;
  timestamp: string;
  status: 'unread' | 'read' | 'accepted' | 'dismissed';
  source: string; // e.g. 'Pusdalops Komando Lapangan'
  autoExpireAt?: number;
}

export interface DonationPackage {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  priceIdr: number;
  icon: string;
  category: 'food' | 'medical' | 'baby' | 'shelter' | 'water';
  itemsIncluded: string[];
  itemsIncludedEn?: string[];
}

export type PaymentMethod = 
  | 'qris' 
  | 'va_bca' 
  | 'va_mandiri' 
  | 'va_bri' 
  | 'va_bni' 
  | 'gopay' 
  | 'ovo' 
  | 'dana';

export interface DisasterDonation {
  id: string;
  disasterId: string;
  disasterTitle: string;
  disasterTitleEn?: string;
  donorName: string;
  isAnonymous: boolean;
  email: string;
  phone: string;
  amount: number;
  type: 'cash' | 'package';
  packageId?: string;
  packageTitle?: string;
  packageTitleEn?: string;
  paymentMethod: PaymentMethod;
  status: 'verified' | 'pending' | 'allocated';
  prayerMessage?: string;
  prayerMessageEn?: string;
  referenceNumber: string;
  createdAt: string;
}

export interface EarlyWarningAlert {
  id: string;
  disasterId?: string;
  title: string;
  titleEn?: string;
  hazardType: DisasterType;
  alertLevel: 'awas' | 'siaga' | 'waspada' | 'normal';
  dangerRadiusKm: number;
  locationName: string;
  province: string;
  locationLat: number;
  locationLng: number;
  soundAlarm: boolean;
  evacuationAdvice: string;
  evacuationAdviceEn?: string;
  emergencyShelter: {
    name: string;
    address: string;
    capacity: number;
    currentOccupancy: number;
    lat: number;
    lng: number;
  };
  keyActionSteps: string[];
  keyActionStepsEn?: string[];
  issuedAt: string;
  sourceAuthority: string;
}

export interface CitizenSafetyReport {
  id: string;
  disasterId?: string;
  disasterTitle?: string;
  citizenName: string;
  phone: string;
  familyCount: number;
  status: 'safe' | 'needs_evacuation' | 'emergency_trapped';
  locationAddress: string;
  latitude?: number;
  longitude?: number;
  urgentNeeds?: string;
  urgentNeedsEn?: string;
  reportedAt: string;
}

