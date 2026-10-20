export type VulnerabilityLevel = 'EKSTREM' | 'TINGGI' | 'SEDANG' | 'RENDAH';

export interface DemographicBreakdown {
  childrenUnder5: number;
  elderlyOver60: number;
  disabledPersons: number;
  pregnantNursingMothers: number;
  lowIncomeHouseholds: number;
}

export interface InaRiskFacility {
  id: string;
  name: string;
  type: 'hospital' | 'puskesmas' | 'shelter' | 'school' | 'bridge';
  capacity: number;
  status: 'operational' | 'at_risk' | 'evacuated';
  latitude: number;
  longitude: number;
}

export interface ResourceDeploymentRecommendation {
  priorityLevel: 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MODERATE';
  urgencyLabel: string;
  urgencyLabelEn: string;
  recommendedTeams: Array<{
    role: string;
    roleEn: string;
    count: number;
    purpose: string;
    purposeEn: string;
  }>;
  essentialSupplies: Array<{
    item: string;
    itemEn: string;
    quantity: string;
    urgency: 'immediate' | 'high' | 'standby';
  }>;
  tacticalNote: string;
  tacticalNoteEn: string;
}

export interface InaRiskExposureZone {
  id: string;
  regionCode: string;
  name: string;
  nameEn: string;
  province: string;
  primaryHazard: 'FLOOD' | 'EARTHQUAKE' | 'TSUNAMI' | 'WILDFIRE' | 'VOLCANO' | 'LANDSLIDE' | 'LIQUEFACTION';
  centerLat: number;
  centerLng: number;
  radiusKm: number;
  boundaryPolygon?: [number, number][]; // optional polygon points [lat, lng]
  vulnerabilityLevel: VulnerabilityLevel;
  vulnerabilityIndex: number; // 0.0 - 1.0
  capacityScore: number; // 0 - 100 (lower = higher outside resource requirement)
  populationTotal: number;
  densityPerKm2: number;
  vulnerablePopulationTotal: number;
  vulnerableDensityPerKm2: number; // key metric for resource density deployment
  demographics: DemographicBreakdown;
  facilities: InaRiskFacility[];
  recommendations: ResourceDeploymentRecommendation;
}

export const VERIFIED_INARISK_EXPOSURE_ZONES: InaRiskExposureZone[] = [
  {
    id: 'inarisk-jkt-ciliwung',
    regionCode: '31.75',
    name: 'Jakarta Timur - DAS Ciliwung (Jatinegara & Kp. Melayu)',
    nameEn: 'East Jakarta - Ciliwung River Basin (Jatinegara & Kp. Melayu)',
    province: 'DKI Jakarta',
    primaryHazard: 'FLOOD',
    centerLat: -6.228,
    centerLng: 106.865,
    radiusKm: 4.8,
    boundaryPolygon: [
      [-6.212, 106.858],
      [-6.216, 106.872],
      [-6.235, 106.878],
      [-6.248, 106.868],
      [-6.242, 106.855],
      [-6.223, 106.853],
      [-6.212, 106.858]
    ],
    vulnerabilityLevel: 'EKSTREM',
    vulnerabilityIndex: 0.91,
    capacityScore: 68,
    populationTotal: 185000,
    densityPerKm2: 14200,
    vulnerablePopulationTotal: 52400,
    vulnerableDensityPerKm2: 4020,
    demographics: {
      childrenUnder5: 15800,
      elderlyOver60: 19400,
      disabledPersons: 4200,
      pregnantNursingMothers: 5100,
      lowIncomeHouseholds: 9800
    },
    facilities: [
      { id: 'f-1', name: 'RSUD Budhi Asih', type: 'hospital', capacity: 320, status: 'operational', latitude: -6.248, longitude: 106.868 },
      { id: 'f-2', name: 'Puskesmas Kecamatan Jatinegara', type: 'puskesmas', capacity: 80, status: 'operational', latitude: -6.218, longitude: 106.868 },
      { id: 'f-3', name: 'Gedung Sasana Krida Remaja Otista (Posko Utama)', type: 'shelter', capacity: 850, status: 'operational', latitude: -6.236, longitude: 106.867 },
      { id: 'f-4', name: 'SDN 01 Kampung Melayu (Evakuasi)', type: 'school', capacity: 450, status: 'operational', latitude: -6.231, longitude: 106.861 },
      { id: 'f-5', name: 'Jembatan Penghubung Tongtek', type: 'bridge', capacity: 0, status: 'at_risk', latitude: -6.228, longitude: 106.862 }
    ],
    recommendations: {
      priorityLevel: 'P1_CRITICAL',
      urgencyLabel: 'Prioritas Tertinggi (Evakuasi & Pompa Air)',
      urgencyLabelEn: 'Critical Priority (Evacuation & Pumping)',
      recommendedTeams: [
        { role: 'Regu Perahu Karet & Water Rescue', roleEn: 'Inflatable Boat & Water Rescue Team', count: 18, purpose: 'Evakuasi warga terjebak di gang sempit bantaran kali', purposeEn: 'Evacuate stranded residents in dense riverbank alleys' },
        { role: 'Tim Medis Lapangan & Balita', roleEn: 'Mobile Pediatric & Geriatric Health Team', count: 10, purpose: 'Pencegahan hipotermia dan penyakit kulit menular air', purposeEn: 'Prevent waterborne infection and hypothermia treatment' },
        { role: 'Regu Dapur Umum & Logistik Siap Santap', roleEn: 'Field Kitchen & Hot Meal Deployment', count: 14, purpose: 'Pasokan makanan higienis 6.500 porsi/hari', purposeEn: 'Supply 6,500 daily hot meals to evacuation shelters' }
      ],
      essentialSupplies: [
        { item: 'Perahu Karet Mesin Tempel & Dayung', itemEn: 'Inflatable Rescue Craft & Oars', quantity: '12 Unit', urgency: 'immediate' },
        { item: 'Rompi Pelampung (Life Jacket Dewasa & Anak)', itemEn: 'Life Jackets (Adult & Child)', quantity: '450 Pcs', urgency: 'immediate' },
        { item: 'Pompa Celup Kapasitas Tinggi (Alkon 3-inch)', itemEn: 'High-Discharge Submersible Pumps', quantity: '8 Unit', urgency: 'high' },
        { item: 'Paket Susu Balita & Selimut Tahan Air', itemEn: 'Infant Formula & Waterproof Thermal Blankets', quantity: '1.200 Paket', urgency: 'immediate' }
      ],
      tacticalNote: 'Kepadatan lansia dan balita sangat padat di RW 01-03 Kp. Melayu. Akses gang <1.5m membutuhkan perahu rakitan kecil dan tandu apung.',
      tacticalNoteEn: 'High density of elderly and infants in dense RW 01-03 alleys (<1.5m width). Requires narrow rafts and floating stretchers.'
    }
  },
  {
    id: 'inarisk-jbr-cianjur',
    regionCode: '32.03',
    name: 'Cianjur - Zona Patahan Aktif Sesar Cugenang',
    nameEn: 'Cianjur - Active Cugenang Fault Rupture Zone',
    province: 'Jawa Barat',
    primaryHazard: 'EARTHQUAKE',
    centerLat: -6.815,
    centerLng: 107.112,
    radiusKm: 6.2,
    boundaryPolygon: [
      [-6.795, 107.095],
      [-6.802, 107.135],
      [-6.828, 107.142],
      [-6.838, 107.108],
      [-6.822, 107.085],
      [-6.795, 107.095]
    ],
    vulnerabilityLevel: 'EKSTREM',
    vulnerabilityIndex: 0.89,
    capacityScore: 52,
    populationTotal: 96000,
    densityPerKm2: 3800,
    vulnerablePopulationTotal: 29500,
    vulnerableDensityPerKm2: 1180,
    demographics: {
      childrenUnder5: 8400,
      elderlyOver60: 11200,
      disabledPersons: 2800,
      pregnantNursingMothers: 3100,
      lowIncomeHouseholds: 5600
    },
    facilities: [
      { id: 'f-6', name: 'RSUD Sayang Cianjur', type: 'hospital', capacity: 250, status: 'operational', latitude: -6.822, longitude: 107.138 },
      { id: 'f-7', name: 'Puskesmas Cugenang', type: 'puskesmas', capacity: 35, status: 'at_risk', latitude: -6.812, longitude: 107.118 },
      { id: 'f-8', name: 'Lapangan Desa Sarampad (Posko Tenda Darurat)', type: 'shelter', capacity: 1200, status: 'operational', latitude: -6.808, longitude: 107.105 },
      { id: 'f-9', name: 'Jembatan Cibulakan', type: 'bridge', capacity: 0, status: 'at_risk', latitude: -6.819, longitude: 107.102 }
    ],
    recommendations: {
      priorityLevel: 'P1_CRITICAL',
      urgencyLabel: 'Prioritas Tertinggi (USAR & Medis Trauma)',
      urgencyLabelEn: 'Critical Priority (USAR & Trauma Care)',
      recommendedTeams: [
        { role: 'Regu Pencarian & Pertolongan Reruntuhan (USAR)', roleEn: 'Urban Search and Rescue (USAR)', count: 16, purpose: 'Ekstraksi korban tertimbun di lereng patahan aktif', purposeEn: 'Extract victims trapped in collapsed structures on fault rupture' },
        { role: 'Tim Dokter Bedah Tulang & Trauma Center', roleEn: 'Trauma Surgery & Orthopedic Field Doctors', count: 8, purpose: 'Tindakan darurat patah tulang dan penanganan luka terbuka', purposeEn: 'Urgent fracture stabilization and surgical wound management' },
        { role: 'Regu Distribusi Air Bersih (WASH Tanker)', roleEn: 'Water Sanitation & Tanker Distribution', count: 6, purpose: 'Suplai air bersih akibat pipa mata air lereng terputus', purposeEn: 'Supply drinking water due to broken gravity spring pipelines' }
      ],
      essentialSupplies: [
        { item: 'Tenda Pleton Medis Rumah Sakit Lapangan', itemEn: 'Hospital Triage Field Tents', quantity: '6 Unit', urgency: 'immediate' },
        { item: 'Genset Portable 5 kVA & Penerangan Tower', itemEn: 'Mobile 5kVA Generators & Floodlights', quantity: '10 Unit', urgency: 'immediate' },
        { item: 'Tandu Spinal Board & Penyangga Leher (Neck Collar)', itemEn: 'Spine Boards & Rigid Neck Collars', quantity: '60 Set', urgency: 'immediate' },
        { item: 'Terpal Ukuran 6x8m & Matras Tebal', itemEn: 'Heavy Duty Tarpaulins & Sleeping Mats', quantity: '1.500 Pcs', urgency: 'high' }
      ],
      tacticalNote: 'Patahan aktif Sesar Cugenang rentan longsor susulan. Tenda pengungsi harus dijauhkan minimal 200 meter dari tebing lereng curam.',
      tacticalNoteEn: 'Active Cugenang fault slope is highly prone to secondary landslides. Relocation camps must remain >200m away from steep cuts.'
    }
  },
  {
    id: 'inarisk-jtg-merapi',
    regionCode: '33.04',
    name: 'Sleman / Magelang - Kawasan Rawan Bencana III Merapi',
    nameEn: 'Sleman / Magelang - Merapi High Hazard Zone III',
    province: 'Jawa Tengah & DIY',
    primaryHazard: 'VOLCANO',
    centerLat: -7.540,
    centerLng: 110.445,
    radiusKm: 7.5,
    boundaryPolygon: [
      [-7.502, 110.435],
      [-7.525, 110.485],
      [-7.575, 110.468],
      [-7.585, 110.415],
      [-7.535, 110.405],
      [-7.502, 110.435]
    ],
    vulnerabilityLevel: 'EKSTREM',
    vulnerabilityIndex: 0.88,
    capacityScore: 74,
    populationTotal: 68000,
    densityPerKm2: 2450,
    vulnerablePopulationTotal: 21800,
    vulnerableDensityPerKm2: 785,
    demographics: {
      childrenUnder5: 5900,
      elderlyOver60: 9200,
      disabledPersons: 1900,
      pregnantNursingMothers: 2400,
      lowIncomeHouseholds: 3800
    },
    facilities: [
      { id: 'f-10', name: 'RSUD Muntilan', type: 'hospital', capacity: 180, status: 'operational', latitude: -7.578, longitude: 110.362 },
      { id: 'f-11', name: 'Puskesmas Cangkringan', type: 'puskesmas', capacity: 45, status: 'at_risk', latitude: -7.632, longitude: 110.455 },
      { id: 'f-12', name: 'Shelter Evakuasi Terpadu Glagaharjo', type: 'shelter', capacity: 1500, status: 'operational', latitude: -7.618, longitude: 110.462 },
      { id: 'f-13', name: 'Kandang Ternak Komunal Darurat', type: 'shelter', capacity: 600, status: 'operational', latitude: -7.625, longitude: 110.458 }
    ],
    recommendations: {
      priorityLevel: 'P1_CRITICAL',
      urgencyLabel: 'Prioritas Tertinggi (Evakuasi Warga & Ternak)',
      urgencyLabelEn: 'Critical Priority (Resident & Livestock Evacuation)',
      recommendedTeams: [
        { role: 'Regu Armada Truk Angkut Evakuasi Cepat', roleEn: 'Rapid Truck Evacuation Flotilla', count: 12, purpose: 'Pengangkutan warga lansia dan ternak dari radius bahaya 7 km', purposeEn: 'Transport vulnerable elderly and livestock out of 7km exclusion zone' },
        { role: 'Tim Penanganan ISPA & Respirasi Debu Vulkanik', roleEn: 'Volcanic Ash Respiratory Care Team', count: 8, purpose: 'Distribusi masker N95 dan nebulizer di posko pengungsian', purposeEn: 'Distribute N95 respirators and treat acute asthma/bronchitis' }
      ],
      essentialSupplies: [
        { item: 'Masker Respirator N95 / Partikulat Vulkanik', itemEn: 'N95 Particulate Respirator Masks', quantity: '25.000 Pcs', urgency: 'immediate' },
        { item: 'Kacamata Google Pelindung Abu Mata', itemEn: 'Protective Dust Eye Goggles', quantity: '3.000 Pcs', urgency: 'immediate' },
        { item: 'Truk Engkel Evakuasi Warga & Hewan', itemEn: 'Medium Evacuation Flatbed Trucks', quantity: '15 Unit', urgency: 'immediate' }
      ],
      tacticalNote: 'Warga enggan mengungsi tanpa evakuasi ternak sapi perah. Pengerahan truk gabungan hewan dan warga di posko Glagaharjo mempercepat kepatuhan 95%.',
      tacticalNoteEn: 'Residents resist leaving without dairy cows. Simultaneous human-livestock transport triples evacuation compliance rate.'
    }
  },
  {
    id: 'inarisk-jtm-semeru',
    regionCode: '35.08',
    name: 'Lumajang - Jalur Aliran Lahar Besuk Kobokan Semeru',
    nameEn: 'Lumajang - Semeru Besuk Kobokan Lahar Flow Corridor',
    province: 'Jawa Timur',
    primaryHazard: 'VOLCANO',
    centerLat: -8.192,
    centerLng: 112.985,
    radiusKm: 7.0,
    vulnerabilityLevel: 'EKSTREM',
    vulnerabilityIndex: 0.87,
    capacityScore: 56,
    populationTotal: 58000,
    densityPerKm2: 2100,
    vulnerablePopulationTotal: 18400,
    vulnerableDensityPerKm2: 660,
    demographics: {
      childrenUnder5: 5100,
      elderlyOver60: 7800,
      disabledPersons: 1600,
      pregnantNursingMothers: 1900,
      lowIncomeHouseholds: 3600
    },
    facilities: [
      { id: 'f-14', name: 'RSUD dr. Haryoto Lumajang', type: 'hospital', capacity: 280, status: 'operational', latitude: -8.132, longitude: 113.228 },
      { id: 'f-15', name: 'Puskesmas Pronojiwo', type: 'puskesmas', capacity: 50, status: 'operational', latitude: -8.212, longitude: 112.925 },
      { id: 'f-16', name: 'Huntara Desa Sumbermujur (Relokasi Tetap)', type: 'shelter', capacity: 2000, status: 'operational', latitude: -8.175, longitude: 113.045 },
      { id: 'f-17', name: 'Jembatan Gladak Perak', type: 'bridge', capacity: 0, status: 'at_risk', latitude: -8.235, longitude: 112.982 }
    ],
    recommendations: {
      priorityLevel: 'P1_CRITICAL',
      urgencyLabel: 'Prioritas Tertinggi (Antisipasi Lahar Dingin)',
      urgencyLabelEn: 'Critical Priority (Cold Lahar Flood Defense)',
      recommendedTeams: [
        { role: 'Regu Pantau Dini Early Warning Aliran Lahar', roleEn: 'Early Warning Lahar River Patrol', count: 8, purpose: 'Pengawasan sensor seismik getaran banjir di Curah Kobokan', purposeEn: 'Monitor acoustic flow sensors and river crest in Curah Kobokan' },
        { role: 'Regu Alat Berat & Akses Darurat', roleEn: 'Heavy Equipment & Clearing Taskforce', count: 6, purpose: 'Pembersihan endapan abu dan batu vulkanik penutup jalan logistik', purposeEn: 'Clear volcanic debris and maintain emergency access routes' }
      ],
      essentialSupplies: [
        { item: 'Radio Komunikasi HT Frekuensi Kebencanaan', itemEn: 'VHF Emergency Radios with Spare Batteries', quantity: '40 Unit', urgency: 'immediate' },
        { item: 'Sepatu Boots Karet & Helm Lapangan SAR', itemEn: 'Heavy-Duty Rubber Boots & Safety Helmets', quantity: '200 Set', urgency: 'high' },
        { item: 'Penyaring Air Portabel Ultrafiltrasi', itemEn: 'Mobile Ultrafiltration Clean Water Units', quantity: '4 Unit', urgency: 'immediate' }
      ],
      tacticalNote: 'Curah hujan >30mm di puncak Semeru memicu lahar dingin dalam waktu 25 menit. Peringatan dini radio VHF harus otomatis tersambung ke pos jaga dusun.',
      tacticalNoteEn: 'Precipitation >30mm at summit triggers destructive lahar within 25 min. VHF early warning link is mandatory.'
    }
  },
  {
    id: 'inarisk-btn-pandeglang',
    regionCode: '36.01',
    name: 'Pandeglang - Pesisir Selat Sunda (Labuan & Carita)',
    nameEn: 'Pandeglang - Sunda Strait Coast (Labuan & Carita)',
    province: 'Banten',
    primaryHazard: 'TSUNAMI',
    centerLat: -6.402,
    centerLng: 105.825,
    radiusKm: 5.8,
    vulnerabilityLevel: 'EKSTREM',
    vulnerabilityIndex: 0.85,
    capacityScore: 61,
    populationTotal: 84000,
    densityPerKm2: 3200,
    vulnerablePopulationTotal: 25600,
    vulnerableDensityPerKm2: 980,
    demographics: {
      childrenUnder5: 7200,
      elderlyOver60: 9800,
      disabledPersons: 2200,
      pregnantNursingMothers: 2800,
      lowIncomeHouseholds: 5400
    },
    facilities: [
      { id: 'f-18', name: 'RSUD Berkah Pandeglang', type: 'hospital', capacity: 220, status: 'operational', latitude: -6.312, longitude: 106.115 },
      { id: 'f-19', name: 'Puskesmas Labuan 24 Jam', type: 'puskesmas', capacity: 60, status: 'operational', latitude: -6.381, longitude: 105.825 },
      { id: 'f-20', name: 'TES (Tempat Evakuasi Sementara) Tsunami Labuan', type: 'shelter', capacity: 1600, status: 'operational', latitude: -6.378, longitude: 105.830 }
    ],
    recommendations: {
      priorityLevel: 'P1_CRITICAL',
      urgencyLabel: 'Prioritas Tinggi (Rambu Evakuasi Vertikal & Sirine)',
      urgencyLabelEn: 'High Priority (Vertical Evacuation & Sirens)',
      recommendedTeams: [
        { role: 'Regu Pemandu Evakuasi Jalur Perbukitan', roleEn: 'Coastal Vertical Evacuation Wardens', count: 12, purpose: 'Navigasi nelayan dan pedagang pesisir menuju TES bertingkat', purposeEn: 'Direct coastal vendors and fishing families to multistory TES' },
        { role: 'Tim Pendamping Psikososial Anak Pesisir', roleEn: 'Child Protection & Trauma Healing Unit', count: 6, purpose: 'Dukungan trauma healing pasca gempa swarm Selat Sunda', purposeEn: 'Psychosocial support for children after offshore earthquake swarms' }
      ],
      essentialSupplies: [
        { item: 'Sirine Portabel Berdaya Baterai Surya', itemEn: 'Solar-Powered Mobile Warning Sirens', quantity: '6 Unit', urgency: 'immediate' },
        { item: 'Penerangan Darurat Emergency Lantern LED', itemEn: 'Rechargeable LED Emergency Lanterns', quantity: '350 Unit', urgency: 'high' },
        { item: 'Paket Higienis Keluarga & Popok Bayi', itemEn: 'Family Hygiene & Infant Diaper Kits', quantity: '800 Paket', urgency: 'immediate' }
      ],
      tacticalNote: 'Waktu tiba tsunami Selat Sunda akibat longsoran bawah laut hanya 20-30 menit. Kuncinya adalah jalur evakuasi bebas hambatan ke gedung TES.',
      tacticalNoteEn: 'Tsunami travel time from underwater caldera collapse is only 20-30 mins. Unobstructed vertical evacuation corridors are paramount.'
    }
  },
  {
    id: 'inarisk-riu-bengkalis',
    regionCode: '14.03',
    name: 'Bengkalis - Lahan Gambut Dalam Bukit Batu & Siak Kecil',
    nameEn: 'Bengkalis - Deep Peatland Basin Bukit Batu & Siak Kecil',
    province: 'Riau',
    primaryHazard: 'WILDFIRE',
    centerLat: 0.942,
    centerLng: 101.442,
    radiusKm: 9.0,
    vulnerabilityLevel: 'EKSTREM',
    vulnerabilityIndex: 0.86,
    capacityScore: 50,
    populationTotal: 48000,
    densityPerKm2: 850,
    vulnerablePopulationTotal: 14800,
    vulnerableDensityPerKm2: 260,
    demographics: {
      childrenUnder5: 4200,
      elderlyOver60: 5900,
      disabledPersons: 1100,
      pregnantNursingMothers: 1600,
      lowIncomeHouseholds: 3200
    },
    facilities: [
      { id: 'f-21', name: 'RSUD Bengkalis', type: 'hospital', capacity: 160, status: 'operational', latitude: 1.482, longitude: 102.128 },
      { id: 'f-22', name: 'Puskesmas Sungai Pakning', type: 'puskesmas', capacity: 40, status: 'operational', latitude: 1.341, longitude: 102.152 },
      { id: 'f-23', name: 'Posko Manggala Agni Daops Siak', type: 'shelter', capacity: 250, status: 'operational', latitude: 0.925, longitude: 101.465 }
    ],
    recommendations: {
      priorityLevel: 'P1_CRITICAL',
      urgencyLabel: 'Prioritas Tertinggi (Pemadaman Bawah Tanah Gambut)',
      urgencyLabelEn: 'Critical Priority (Subsurface Peat Fire Extinguishing)',
      recommendedTeams: [
        { role: 'Regu Pemadam Kebakaran Hutan & Gambut (Manggala Agni)', roleEn: 'Peatland Forest Firefighting Squads', count: 20, purpose: 'Penyuntikan air ke kedalaman gambut 2-4 meter (nozzle injector)', purposeEn: 'Inject pressurized water 2-4m deep into smoldering peat' },
        { role: 'Tim Penanggulangan ISPA & Ruang Oksigen Bersih', roleEn: 'Air Quality & Oxygen Therapy Response', count: 8, purpose: 'Operasionalisasi safe room ber-HEPA filter untuk lansia dan bayi', purposeEn: 'Run clean-air shelters with HEPA filtration for infants & asthmatics' }
      ],
      essentialSupplies: [
        { item: 'Nozzle Suntik Gambut Baja 3-Way', itemEn: '3-Way Steel Peat Water Injection Nozzles', quantity: '35 Unit', urgency: 'immediate' },
        { item: 'Selang Pemadam Kanvas Tahan Panas 2.5-inch', itemEn: 'Heat-Resistant 2.5-inch Canvas Fire Hoses', quantity: '80 Gulung', urgency: 'immediate' },
        { item: 'Masker Karbon Aktif N95 Perlindungan Asap', itemEn: 'Activated Carbon N95 Smoke Masks', quantity: '18.000 Pcs', urgency: 'immediate' },
        { item: 'Tabung Oksigen Medis Portable 1m³ & Regulator', itemEn: 'Portable Medical Oxygen Tanks & Regulators', quantity: '45 Tabung', urgency: 'high' }
      ],
      tacticalNote: 'Api di permukaan tanah tampak padam tetapi bara terus menyala di kedalaman 3 meter gambut. Diperlukan drone termal infra-merah FLIR untuk deteksi hotspot tersembunyi.',
      tacticalNoteEn: 'Surface fires appear extinguished while embers smolder at 3m depth. FLIR thermal aerial imaging is essential.'
    }
  },
  {
    id: 'inarisk-ntt-lewotobi',
    regionCode: '53.06',
    name: 'Flores Timur - Radius Eksklusi Gunung Lewotobi Laki-Laki',
    nameEn: 'East Flores - Mt. Lewotobi Laki-Laki Exclusion Radius',
    province: 'Nusa Tenggara Timur',
    primaryHazard: 'VOLCANO',
    centerLat: -8.538,
    centerLng: 122.768,
    radiusKm: 8.5,
    vulnerabilityLevel: 'EKSTREM',
    vulnerabilityIndex: 0.90,
    capacityScore: 45,
    populationTotal: 34000,
    densityPerKm2: 920,
    vulnerablePopulationTotal: 12400,
    vulnerableDensityPerKm2: 335,
    demographics: {
      childrenUnder5: 3600,
      elderlyOver60: 4800,
      disabledPersons: 950,
      pregnantNursingMothers: 1250,
      lowIncomeHouseholds: 2800
    },
    facilities: [
      { id: 'f-24', name: 'RSUD Hendrikus Fernandez Larantuka', type: 'hospital', capacity: 180, status: 'operational', latitude: -8.344, longitude: 122.981 },
      { id: 'f-25', name: 'Puskesmas Boru', type: 'puskesmas', capacity: 50, status: 'evacuated', latitude: -8.512, longitude: 122.741 },
      { id: 'f-26', name: 'Posko Pengungsian Desa Konga', type: 'shelter', capacity: 1500, status: 'operational', latitude: -8.520, longitude: 122.842 },
      { id: 'f-27', name: 'Shelter Mandiri Desa Bokang', type: 'shelter', capacity: 900, status: 'operational', latitude: -8.545, longitude: 122.875 }
    ],
    recommendations: {
      priorityLevel: 'P1_CRITICAL',
      urgencyLabel: 'Prioritas Kritis (Relokasi Menjauhi Radius 7-9 KM)',
      urgencyLabelEn: 'Critical Priority (Evacuate 7-9km Danger Zone)',
      recommendedTeams: [
        { role: 'Regu Mobilisasi Logistik Darurat Lintas Pulau', roleEn: 'Inter-Island Relief Logistics Convoy', count: 14, purpose: 'Distribusi makanan pokok dan air minum dari Larantuka ke Konga', purposeEn: 'Transport staples and potable water from port to Konga shelter' },
        { role: 'Tim Medis Penanganan Trauma Bakar & Mata', roleEn: 'Burn Trauma & Ophthalmic Care Doctors', count: 6, purpose: 'Penyembuhan luka bakar lontaran batu pijar dan iritasi mata abu', purposeEn: 'Treat volcanic ejecta burns and corneal ash abrasion' }
      ],
      essentialSupplies: [
        { item: 'Tenda Hunian Darurat Keluarga (Tenda BNPB)', itemEn: 'Family Relief Camping Tents', quantity: '350 Unit', urgency: 'immediate' },
        { item: 'Matras Busa Tebal & Selimut Hangat', itemEn: 'Thick Foam Sleeping Pads & Thermal Blankets', quantity: '2.000 Pcs', urgency: 'immediate' },
        { item: 'Air Bersih Kemasan Galon Higienis', itemEn: 'Bottled Sealed Drinking Water Gallons', quantity: '5.000 Galon', urgency: 'immediate' }
      ],
      tacticalNote: 'Puskesmas Boru berada tepat di zona bahaya dan telah dievakuasi penuh ke Desa Konga. Semua pasien rawat inap dialihkan ke RSUD Larantuka.',
      tacticalNoteEn: 'Boru community clinic evacuated into Konga camp due to incandescent rock fall. Inpatients diverted to Larantuka.'
    }
  },
  {
    id: 'inarisk-sulteng-palu',
    regionCode: '72.71',
    name: 'Palu & Sigi - Koridor Patahan Palu-Koro & Likuifaksi Petobo',
    nameEn: 'Palu & Sigi - Palu-Koro Fault & Petobo Liquefaction Corridor',
    province: 'Sulawesi Tengah',
    primaryHazard: 'LIQUEFACTION',
    centerLat: -0.925,
    centerLng: 119.892,
    radiusKm: 6.5,
    vulnerabilityLevel: 'EKSTREM',
    vulnerabilityIndex: 0.86,
    capacityScore: 64,
    populationTotal: 125000,
    densityPerKm2: 4500,
    vulnerablePopulationTotal: 38200,
    vulnerableDensityPerKm2: 1375,
    demographics: {
      childrenUnder5: 11200,
      elderlyOver60: 14500,
      disabledPersons: 3100,
      pregnantNursingMothers: 3900,
      lowIncomeHouseholds: 7200
    },
    facilities: [
      { id: 'f-28', name: 'RSUD Undata Palu', type: 'hospital', capacity: 340, status: 'operational', latitude: -0.885, longitude: 119.885 },
      { id: 'f-29', name: 'Puskesmas Biromaru Sigi', type: 'puskesmas', capacity: 60, status: 'operational', latitude: -0.975, longitude: 119.925 },
      { id: 'f-30', name: 'Kompleks Huntap Duyu (Hunian Tetap Tahan Gempa)', type: 'shelter', capacity: 2500, status: 'operational', latitude: -0.905, longitude: 119.835 }
    ],
    recommendations: {
      priorityLevel: 'P1_CRITICAL',
      urgencyLabel: 'Prioritas Tinggi (Zona Likuifaksi & Sanitasi Huntap)',
      urgencyLabelEn: 'High Priority (Liquefaction Zone & Settlement WASH)',
      recommendedTeams: [
        { role: 'Regu Penilaian Stabilitas Geoteknik & Tanah', roleEn: 'Geotechnical Soil Stability Inspectors', count: 8, purpose: 'Zonasi tanah rentan likuifaksi dan amblasan perumahan', purposeEn: 'Microzonation of soil bearing capacity and subsidence risks' },
        { role: 'Tim Air Bersih & Sanitasi Huntap Komunal', roleEn: 'WASH & Water Desalination Engineers', count: 10, purpose: 'Pengeboran sumur dalam dan instalasi toren air bersih', purposeEn: 'Deep-well water drilling and community water tanks setup' }
      ],
      essentialSupplies: [
        { item: 'Toren Penampungan Air 1.000 Liter', itemEn: '1,000-Liter Polyethylene Water Storage Tanks', quantity: '25 Unit', urgency: 'high' },
        { item: 'Pipa Sambungan Cepat PVC & Pompa Dorong Listrik', itemEn: 'Quick-Connect PVC Pipes & Booster Pumps', quantity: '50 Set', urgency: 'high' },
        { item: 'Paket Sanitasi Keluarga & Pembalut Medis', itemEn: 'Family Sanitation & Medical Hygiene Packs', quantity: '1.200 Paket', urgency: 'immediate' }
      ],
      tacticalNote: 'Kawasan bekas likuifaksi Petobo dan Balaroa merupakan zona merah non-hunian. Prioritaskan relokasi ke Huntap Duyu dan Tondo.',
      tacticalNoteEn: 'Former Petobo and Balaroa liquefaction zones are gazetted non-buildable red zones. Direct displaced families to Duyu & Tondo.'
    }
  },
  {
    id: 'inarisk-sumbar-marapi',
    regionCode: '13.06',
    name: 'Agam & Bukittinggi - Kawasan Rawan Lahar Hujan Marapi',
    nameEn: 'Agam & Bukittinggi - Mt. Marapi Cold Lahar High-Risk Corridor',
    province: 'Sumatera Barat',
    primaryHazard: 'LANDSLIDE',
    centerLat: -0.380,
    centerLng: 100.472,
    radiusKm: 6.8,
    vulnerabilityLevel: 'TINGGI',
    vulnerabilityIndex: 0.81,
    capacityScore: 66,
    populationTotal: 72000,
    densityPerKm2: 2800,
    vulnerablePopulationTotal: 21500,
    vulnerableDensityPerKm2: 835,
    demographics: {
      childrenUnder5: 6100,
      elderlyOver60: 8200,
      disabledPersons: 1700,
      pregnantNursingMothers: 2200,
      lowIncomeHouseholds: 4100
    },
    facilities: [
      { id: 'f-31', name: 'RSUD Achmad Mochtar Bukittinggi', type: 'hospital', capacity: 310, status: 'operational', latitude: -0.305, longitude: 100.370 },
      { id: 'f-32', name: 'Puskesmas Canduang', type: 'puskesmas', capacity: 45, status: 'operational', latitude: -0.345, longitude: 100.442 },
      { id: 'f-33', name: 'Posko Darurat Nagari Bukik Batabuah', type: 'shelter', capacity: 800, status: 'operational', latitude: -0.362, longitude: 100.455 }
    ],
    recommendations: {
      priorityLevel: 'P2_HIGH',
      urgencyLabel: 'Prioritas Tinggi (Pembersihan Batuan & Tandu)',
      urgencyLabelEn: 'High Priority (Debris Removal & Mountain SAR)',
      recommendedTeams: [
        { role: 'Regu SAR Gunung & Evakuasi Aliran Sungai Berbatu', roleEn: 'Mountain Torrent & Bouldered River Rescue', count: 12, purpose: 'Penyelamatan warga terisolasi akibat luapan banjir bandang lahar', purposeEn: 'Rescue villagers cut off by boulder-laden flash flood channels' }
      ],
      essentialSupplies: [
        { item: 'Gergaji Mesin Chainsaw Pembersih Kayu Gelondongan', itemEn: 'Heavy Chainsaws for River Logjam Clearing', quantity: '8 Unit', urgency: 'immediate' },
        { item: 'Tandu Lipat Darurat & Tali Kernmantle', itemEn: 'Folding Stretcher & Static Kernmantle Ropes', quantity: '30 Set', urgency: 'high' }
      ],
      tacticalNote: 'Penyumbatan alur sungai oleh kayu dan batu besar dari lereng Marapi sering menjebol tanggul darurat secara mendadak saat hujan lebat.',
      tacticalNoteEn: 'River logjams and boulders from Marapi slopes cause sudden breach of riverbanks during cloudbursts.'
    }
  },
  {
    id: 'inarisk-kalbar-kuburaya',
    regionCode: '61.12',
    name: 'Kubu Raya & Pontianak - Lahan Gambut Pesisir Barat',
    nameEn: 'Kubu Raya & Pontianak - Western Coastal Peatland',
    province: 'Kalimantan Barat',
    primaryHazard: 'WILDFIRE',
    centerLat: -0.125,
    centerLng: 109.385,
    radiusKm: 7.2,
    vulnerabilityLevel: 'TINGGI',
    vulnerabilityIndex: 0.79,
    capacityScore: 60,
    populationTotal: 92000,
    densityPerKm2: 2200,
    vulnerablePopulationTotal: 26800,
    vulnerableDensityPerKm2: 640,
    demographics: {
      childrenUnder5: 8100,
      elderlyOver60: 9700,
      disabledPersons: 2100,
      pregnantNursingMothers: 2600,
      lowIncomeHouseholds: 5200
    },
    facilities: [
      { id: 'f-34', name: 'RSUD dr. Soedarso Pontianak', type: 'hospital', capacity: 350, status: 'operational', latitude: -0.055, longitude: 109.355 },
      { id: 'f-35', name: 'Puskesmas Sungai Raya', type: 'puskesmas', capacity: 45, status: 'operational', latitude: -0.105, longitude: 109.390 }
    ],
    recommendations: {
      priorityLevel: 'P2_HIGH',
      urgencyLabel: 'Prioritas Tinggi (Semburan Air Sumur Bor Gambut)',
      urgencyLabelEn: 'High Priority (Peat Borehole Pumping)',
      recommendedTeams: [
        { role: 'Regu Pompa Apung (Floating Pump) Kanal Gambut', roleEn: 'Floating Pump Canal Squad', count: 10, purpose: 'Menyedot air dari kanal primer untuk membasahi sekat bakar', purposeEn: 'Pump water from drainage canals onto peat firebreaks' }
      ],
      essentialSupplies: [
        { item: 'Pompa Air Apung Portable Honda Engine', itemEn: 'Portable Floating Pumps (High Volume)', quantity: '8 Unit', urgency: 'immediate' },
        { item: 'Masker N95 Anak-Anak & Dewasa', itemEn: 'Pediatric & Adult N95 Particulate Masks', quantity: '12.000 Pcs', urgency: 'high' }
      ],
      tacticalNote: 'Asap tebal sering mengganggu visibilitas Bandara Supadio. Prioritaskan pemadaman di koridor radius 10 km dari runway bandara.',
      tacticalNoteEn: 'Heavy peat smoke frequently halts Supadio Airport flights. Focus mitigation within 10km radius of airstrip.'
    }
  }
];

/**
 * Helper to fetch and filter InaRISK Exposure Zones by vulnerability level or query
 */
export function getInaRiskZones(minVulnerability: 'ALL' | 'EKSTREM' | 'TINGGI' = 'ALL'): InaRiskExposureZone[] {
  if (minVulnerability === 'EKSTREM') {
    return VERIFIED_INARISK_EXPOSURE_ZONES.filter(z => z.vulnerabilityLevel === 'EKSTREM');
  }
  if (minVulnerability === 'TINGGI') {
    return VERIFIED_INARISK_EXPOSURE_ZONES.filter(z => z.vulnerabilityLevel === 'EKSTREM' || z.vulnerabilityLevel === 'TINGGI');
  }
  return VERIFIED_INARISK_EXPOSURE_ZONES;
}

/**
 * Computes exposure color hex code based on vulnerable population density
 */
export function getInaRiskDensityColor(vulnerableDensityPerKm2: number): {
  fill: string;
  stroke: string;
  badgeBg: string;
  badgeText: string;
} {
  if (vulnerableDensityPerKm2 >= 3000) {
    // Ultra-dense vulnerable population (e.g. Jakarta DAS Ciliwung)
    return {
      fill: '#dc2626', // red-600
      stroke: '#991b1b', // red-800
      badgeBg: 'bg-rose-950/90',
      badgeText: 'text-rose-300'
    };
  }
  if (vulnerableDensityPerKm2 >= 1000) {
    // High density vulnerable population (e.g. Cianjur, Palu)
    return {
      fill: '#ea580c', // orange-600
      stroke: '#c2410c', // orange-700
      badgeBg: 'bg-orange-950/90',
      badgeText: 'text-orange-300'
    };
  }
  if (vulnerableDensityPerKm2 >= 500) {
    // Moderate-High density (e.g. Merapi, Semeru, Agam)
    return {
      fill: '#d97706', // amber-600
      stroke: '#b45309', // amber-700
      badgeBg: 'bg-amber-950/90',
      badgeText: 'text-amber-300'
    };
  }
  // Moderate / Rural peatland density
  return {
    fill: '#eab308', // yellow-500
    stroke: '#ca8a04', // yellow-600
    badgeBg: 'bg-yellow-950/90',
    badgeText: 'text-yellow-300'
  };
}
