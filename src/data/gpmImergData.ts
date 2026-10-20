export type RainfallIntensityLevel = 'EXTREME' | 'HEAVY' | 'MODERATE' | 'LIGHT';
export type FloodRiskStatus = 'CRITICAL_FLASH_FLOOD' | 'FLOOD_WARNING' | 'ADVISORY' | 'NORMAL';

export interface GpmPrecipitationCell {
  id: string;
  locationName: string;
  locationNameEn: string;
  basinName: string;
  province: string;
  latitude: number;
  longitude: number;
  footprintRadiusKm: number;
  rateMmPerHour: number;
  accumulated3hMm: number;
  accumulated6hMm: number;
  accumulated24hMm: number;
  accumulated72hMm: number;
  intensityLevel: RainfallIntensityLevel;
  floodRisk: FloodRiskStatus;
  landslideRisk: 'Kritis' | 'Tinggi' | 'Sedang' | 'Rendah';
  downstreamImpact: string;
  downstreamImpactEn: string;
  sarRecommendation: string;
  sarRecommendationEn: string;
  satelliteSensor: string;
  updatedAt: string;
}

export const VERIFIED_GPM_IMERG_CELLS: GpmPrecipitationCell[] = [
  {
    id: 'gpm-ciliwung-puncak',
    locationName: 'DAS Ciliwung Hulu (Puncak - Megamendung)',
    locationNameEn: 'Upper Ciliwung Basin (Puncak - Megamendung)',
    basinName: 'DAS Ciliwung',
    province: 'Jawa Barat',
    latitude: -6.652,
    longitude: 106.924,
    footprintRadiusKm: 14.0,
    rateMmPerHour: 28.4,
    accumulated3hMm: 68.2,
    accumulated6hMm: 112.5,
    accumulated24hMm: 185.0,
    accumulated72hMm: 294.0,
    intensityLevel: 'EXTREME',
    floodRisk: 'CRITICAL_FLASH_FLOOD',
    landslideRisk: 'Kritis',
    downstreamImpact: 'Bendung Katulampa Bogor & bantaran Kampung Melayu - Manggarai (Estimasi tiba: 9-11 jam)',
    downstreamImpactEn: 'Katulampa Weir Bogor & downstream East Jakarta Manggarai (Travel time: 9-11 hrs)',
    sarRecommendation: 'Bunyikan sirine EWS di sepanjang alur Ciliwung, sterilkan bantaran, dan siagakan perahu LCR di posko Jatinegara.',
    sarRecommendationEn: 'Sound early warning sirens along riverbanks, evacuate low-lying alleys, and stage inflatable boats in Jatinegara.',
    satelliteSensor: 'GPM Core Observatory (DPR & GMI) + NOAA-20 ATMS',
    updatedAt: '2026-10-19T10:15:00Z'
  },
  {
    id: 'gpm-ciliwung-hilir',
    locationName: 'DAS Ciliwung Hilir (Jatinegara - Manggarai)',
    locationNameEn: 'Lower Ciliwung Basin (Jatinegara - Manggarai)',
    basinName: 'DAS Ciliwung',
    province: 'DKI Jakarta',
    latitude: -6.225,
    longitude: 106.865,
    footprintRadiusKm: 8.5,
    rateMmPerHour: 18.6,
    accumulated3hMm: 42.0,
    accumulated6hMm: 76.5,
    accumulated24hMm: 138.0,
    accumulated72hMm: 215.0,
    intensityLevel: 'HEAVY',
    floodRisk: 'FLOOD_WARNING',
    landslideRisk: 'Rendah',
    downstreamImpact: 'Pemukiman padat RW 01-03 Kp. Melayu, Bidara Cina, dan Bukit Duri',
    downstreamImpactEn: 'Dense residential RW 01-03 Kampung Melayu, Bidara Cina, and Bukit Duri',
    sarRecommendation: 'Siagakan pompa portable drainase dan evakuasi prioritas lansia serta balita ke lantai 2 atau posko Krida Remaja.',
    sarRecommendationEn: 'Stage mobile dewatering pumps and evacuate elderly and infants to upper floors or evacuation shelters.',
    satelliteSensor: 'GPM IMERG Early Run (Multi-satellite calibrated)',
    updatedAt: '2026-10-19T10:10:00Z'
  },
  {
    id: 'gpm-bengawan-solo',
    locationName: 'DAS Bengawan Solo (Wonogiri - Sukoharjo)',
    locationNameEn: 'Bengawan Solo Basin (Wonogiri - Sukoharjo)',
    basinName: 'DAS Bengawan Solo',
    province: 'Jawa Tengah',
    latitude: -7.625,
    longitude: 110.825,
    footprintRadiusKm: 18.0,
    rateMmPerHour: 16.2,
    accumulated3hMm: 38.5,
    accumulated6hMm: 64.0,
    accumulated24hMm: 115.0,
    accumulated72hMm: 178.0,
    intensityLevel: 'HEAVY',
    floodRisk: 'FLOOD_WARNING',
    landslideRisk: 'Sedang',
    downstreamImpact: 'Dataran banjir Kota Surakarta, Sragen, dan Ngawi',
    downstreamImpactEn: 'Surakarta urban floodplains, Sragen, and Ngawi river corridors',
    sarRecommendation: 'Buka pintu air waduk secara bertahap dan siagakan logistik dapur umum di titik kumpul Sukoharjo.',
    sarRecommendationEn: 'Regulate reservoir spillways incrementally and stage field kitchens in Sukoharjo evacuation hubs.',
    satelliteSensor: 'MetOp-B/C MHS + GPM GMI Radiometer',
    updatedAt: '2026-10-19T10:05:00Z'
  },
  {
    id: 'gpm-pesisir-agam',
    locationName: 'Pesisir Agam & Lereng Gunung Marapi',
    locationNameEn: 'Agam Coastline & Mt. Marapi Slopes',
    basinName: 'DAS Batang Anai',
    province: 'Sumatera Barat',
    latitude: -0.315,
    longitude: 100.354,
    footprintRadiusKm: 15.0,
    rateMmPerHour: 24.8,
    accumulated3hMm: 62.0,
    accumulated6hMm: 104.0,
    accumulated24hMm: 172.0,
    accumulated72hMm: 285.0,
    intensityLevel: 'EXTREME',
    floodRisk: 'CRITICAL_FLASH_FLOOD',
    landslideRisk: 'Kritis',
    downstreamImpact: 'Lembah Anai, Nagari Bukik Batabuah, dan jalur Padang-Bukittinggi',
    downstreamImpactEn: 'Anai Valley, Bukik Batabuah, and vital Padang-Bukittinggi highway',
    sarRecommendation: 'Waspada lahar dingin! Hentikan seluruh arus lalu lintas di Lembah Anai dan evakuasi warga bantaran sungai.',
    sarRecommendationEn: 'Cold lahar alert! Halt all road transit in Anai Valley and retreat riverside villagers immediately.',
    satelliteSensor: 'GPM DPR Ku/Ka-band Radar & GMI',
    updatedAt: '2026-10-19T10:12:00Z'
  },
  {
    id: 'gpm-cianjur-cugenang',
    locationName: 'Cianjur Hulu (DAS Cianjur - Sesar Cugenang)',
    locationNameEn: 'Upper Cianjur (Cianjur River & Cugenang Fault)',
    basinName: 'DAS Cianjur',
    province: 'Jawa Barat',
    latitude: -6.815,
    longitude: 107.112,
    footprintRadiusKm: 11.0,
    rateMmPerHour: 19.5,
    accumulated3hMm: 46.0,
    accumulated6hMm: 78.0,
    accumulated24hMm: 126.0,
    accumulated72hMm: 195.0,
    intensityLevel: 'HEAVY',
    floodRisk: 'FLOOD_WARNING',
    landslideRisk: 'Kritis',
    downstreamImpact: 'Lereng tanah gembur Cibulakan dan tenda hunian darurat pasca gempa',
    downstreamImpactEn: 'Fragile earthquake-loosened slopes of Cibulakan & temporary camps',
    sarRecommendation: 'Curah hujan deras melonggarkan lereng gempa. Tarik tenda darurat menjauhi tebing minimal 200 meter.',
    sarRecommendationEn: 'Heavy rain triggers secondary soil slips on fault line. Relocate tents >200m away from slope edges.',
    satelliteSensor: 'Suomi-NPP ATMS + GPM IMERG Late Run',
    updatedAt: '2026-10-19T09:55:00Z'
  },
  {
    id: 'gpm-banten-labuan',
    locationName: 'Pesisir Pandeglang - DAS Cipecang Labuan',
    locationNameEn: 'Pandeglang Coast - Cipecang Labuan Basin',
    basinName: 'DAS Cipecang',
    province: 'Banten',
    latitude: -6.402,
    longitude: 105.825,
    footprintRadiusKm: 12.0,
    rateMmPerHour: 15.4,
    accumulated3hMm: 36.0,
    accumulated6hMm: 62.0,
    accumulated24hMm: 98.0,
    accumulated72hMm: 152.0,
    intensityLevel: 'HEAVY',
    floodRisk: 'FLOOD_WARNING',
    landslideRisk: 'Sedang',
    downstreamImpact: 'Muara Sungai Labuan & permukiman nelayan pesisir Teluk Lada',
    downstreamImpactEn: 'Labuan river mouth & coastal fishing settlements along Lada Bay',
    sarRecommendation: 'Pasang tanggul karung pasir di pintu muara dan amankan perahu nelayan dari arus balik luapan pasang rob.',
    sarRecommendationEn: 'Deploy sandbag barriers along rivermouth and anchor fishing vessels against high tidal surge confluence.',
    satelliteSensor: 'GPM IMERG Late Run',
    updatedAt: '2026-10-19T10:08:00Z'
  },
  {
    id: 'gpm-semeru-pronojiwo',
    locationName: 'Lereng Semeru (DAS Curah Kobokan Lumajang)',
    locationNameEn: 'Semeru Slopes (Curah Kobokan Lahar Basin)',
    basinName: 'DAS Besuk Kobokan',
    province: 'Jawa Timur',
    latitude: -8.192,
    longitude: 112.985,
    footprintRadiusKm: 16.0,
    rateMmPerHour: 22.0,
    accumulated3hMm: 58.0,
    accumulated6hMm: 98.0,
    accumulated24hMm: 165.0,
    accumulated72hMm: 270.0,
    intensityLevel: 'EXTREME',
    floodRisk: 'CRITICAL_FLASH_FLOOD',
    landslideRisk: 'Kritis',
    downstreamImpact: 'Jembatan Gladak Perak, Dusun Kamar Kajang, dan Sumberwuluh',
    downstreamImpactEn: 'Gladak Perak bridge corridor, Kamar Kajang, and Sumberwuluh',
    sarRecommendation: 'Lahar dingin vulkanik aktif! Kosongkan radius 500 meter dari sempadan sungai lahar Kobokan.',
    sarRecommendationEn: 'Volcanic debris flood active! Maintain 500m mandatory exclusion from Kobokan riverbanks.',
    satelliteSensor: 'GPM Dual-frequency Precipitation Radar (DPR)',
    updatedAt: '2026-10-19T10:14:00Z'
  },
  {
    id: 'gpm-makassar-jepot',
    locationName: 'DAS Jeneberang (Gowa - Makassar)',
    locationNameEn: 'Jeneberang Basin (Gowa - Makassar)',
    basinName: 'DAS Jeneberang',
    province: 'Sulawesi Selatan',
    latitude: -5.210,
    longitude: 119.520,
    footprintRadiusKm: 15.0,
    rateMmPerHour: 12.8,
    accumulated3hMm: 28.0,
    accumulated6hMm: 48.0,
    accumulated24hMm: 85.0,
    accumulated72hMm: 132.0,
    intensityLevel: 'HEAVY',
    floodRisk: 'FLOOD_WARNING',
    landslideRisk: 'Rendah',
    downstreamImpact: 'Waduk Bili-Bili & kawasan pemukiman genangan Kota Makassar',
    downstreamImpactEn: 'Bili-Bili Dam spillways & low-elevation Makassar urban districts',
    sarRecommendation: 'Pantau elevasi muka air Waduk Bili-Bili dan siapkan perahu karet di posko Antang dan Tamalanrea.',
    sarRecommendationEn: 'Monitor Bili-Bili reservoir crest level and pre-position inflatable boats in Antang and Tamalanrea.',
    satelliteSensor: 'GPM IMERG Early Run',
    updatedAt: '2026-10-19T09:40:00Z'
  },
  {
    id: 'gpm-kalbar-kapuas',
    locationName: 'DAS Kapuas (Sintang - Sekadau)',
    locationNameEn: 'Kapuas River Basin (Sintang - Sekadau)',
    basinName: 'DAS Kapuas',
    province: 'Kalimantan Barat',
    latitude: 0.065,
    longitude: 111.485,
    footprintRadiusKm: 22.0,
    rateMmPerHour: 8.5,
    accumulated3hMm: 22.0,
    accumulated6hMm: 42.0,
    accumulated24hMm: 74.0,
    accumulated72hMm: 140.0,
    intensityLevel: 'MODERATE',
    floodRisk: 'ADVISORY',
    landslideRisk: 'Rendah',
    downstreamImpact: 'Pesisir sungai Kapuas dan akses jalan trans-Kalimantan Sintang',
    downstreamImpactEn: 'Kapuas riverine banks and low-lying sections of Trans-Kalimantan highway',
    sarRecommendation: 'Kenaikan debit lambat tapi bertahan lama (>7 hari). Amankan stok sembako di panggung evakuasi tinggi.',
    sarRecommendationEn: 'Slow, prolonged flood crest (>7 days). Elevate food stocks onto stilt platforms.',
    satelliteSensor: 'GPM IMERG Final Run',
    updatedAt: '2026-10-19T09:30:00Z'
  },
  {
    id: 'gpm-bali-ayung',
    locationName: 'DAS Tukad Ayung (Denpasar - Gianyar)',
    locationNameEn: 'Ayung River Basin (Denpasar - Gianyar)',
    basinName: 'DAS Ayung',
    province: 'Bali',
    latitude: -8.540,
    longitude: 115.240,
    footprintRadiusKm: 10.0,
    rateMmPerHour: 6.2,
    accumulated3hMm: 16.0,
    accumulated6hMm: 31.0,
    accumulated24hMm: 52.0,
    accumulated72hMm: 86.0,
    intensityLevel: 'MODERATE',
    floodRisk: 'ADVISORY',
    landslideRisk: 'Sedang',
    downstreamImpact: 'Kawasan wisata tirta rafting Ubud dan muara Sanur',
    downstreamImpactEn: 'Ubud river rafting routes and Sanur coastal estuary',
    sarRecommendation: 'Hentikan aktivitas rafting air deras dan pasang rambu bahaya debit tinggi di jembatan perbatasan.',
    sarRecommendationEn: 'Suspend river rafting excursions and erect high-flow hazard warning signs.',
    satelliteSensor: 'GPM IMERG Early Run',
    updatedAt: '2026-10-19T09:20:00Z'
  }
];

/**
 * Returns color codes based on NASA GPM IMERG rainfall rate (mm/h)
 */
export function getGpmIntensityColor(rateMmPerHour: number): {
  fill: string;
  stroke: string;
  bgLight: string;
  badgeBg: string;
  badgeText: string;
  label: string;
  labelEn: string;
} {
  if (rateMmPerHour >= 20) {
    // Extreme / Torrential (> 20 mm/h)
    return {
      fill: '#7c3aed', // violet-600
      stroke: '#5b21b6', // violet-800
      bgLight: 'rgba(124, 58, 237, 0.28)',
      badgeBg: 'bg-purple-950 text-purple-200 border-purple-700',
      badgeText: 'text-purple-300',
      label: 'Ekstrem (>20 mm/jam)',
      labelEn: 'Extreme (>20 mm/h)'
    };
  }
  if (rateMmPerHour >= 10) {
    // Heavy Rain (10 - 20 mm/h)
    return {
      fill: '#ea580c', // orange-600
      stroke: '#c2410c', // orange-700
      bgLight: 'rgba(234, 88, 12, 0.24)',
      badgeBg: 'bg-orange-950 text-orange-200 border-orange-700',
      badgeText: 'text-orange-300',
      label: 'Lebat (10-20 mm/jam)',
      labelEn: 'Heavy (10-20 mm/h)'
    };
  }
  if (rateMmPerHour >= 2.5) {
    // Moderate Rain (2.5 - 10 mm/h)
    return {
      fill: '#2563eb', // blue-600
      stroke: '#1d4ed8', // blue-700
      bgLight: 'rgba(37, 99, 235, 0.18)',
      badgeBg: 'bg-blue-950 text-blue-200 border-blue-700',
      badgeText: 'text-blue-300',
      label: 'Sedang (2.5-10 mm/jam)',
      labelEn: 'Moderate (2.5-10 mm/h)'
    };
  }
  // Light Rain (< 2.5 mm/h)
  return {
    fill: '#0284c7', // sky-600
    stroke: '#0369a1', // sky-700
    bgLight: 'rgba(2, 132, 199, 0.12)',
    badgeBg: 'bg-sky-950 text-sky-200 border-sky-700',
    badgeText: 'text-sky-300',
    label: 'Ringan (<2.5 mm/jam)',
    labelEn: 'Light (<2.5 mm/h)'
  };
}
