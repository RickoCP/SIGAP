import { Disaster } from '../types/index.ts';

export type Language = 'id' | 'en';

export interface TranslationDictionary {
  // Brand & Nav
  brandTitle: string;
  brandSubtitle: string;
  navMacroMap: string;
  navPresentation: string;
  navVolunteerPortal: string;
  navVolunteerMap: string;
  navReadiness: string;
  navRewards: string;
  navTacticalMap: string;
  navDisasters: string;
  navVolunteers: string;
  navTasks: string;
  navAnalytics: string;
  navEarlyWarning: string;
  navDonations: string;
  btnResetDemo: string;
  btnRegisterVol: string;
  btnDeclareDisaster: string;
  btnCreateTask: string;

  // Header Metrics
  metricActiveCrises: string;
  metricAvailableVolunteers: string;
  metricBusyVolunteers: string;
  metricPendingTasks: string;
  metricCoverageRate: string;
  metricAvgResponse: string;
  metricMinutes: string;
  metricTotalVolunteers: string;

  // Tactical Deck
  commandDeckTitle: string;
  commandDeckSubtitle: string;
  activeCrisisFocus: string;
  btnSitRep: string;
  btnBroadcast: string;
  openTasksPreview: string;
  btnMatchAI: string;
  affectedPeople: string;
  evacuationPosko: string;
  clusterModeLeaflet: string;
  clusterModeVector: string;
  tacticalMapTitle: string;
  openTasksCount: string;

  // Real-time Live Tracking Simulation
  liveTrackingTitle: string;
  liveTrackingActive: string;
  liveTrackingInactive: string;
  liveTrackingDesc: string;
  liveTrackingMovingUnits: string;
  liveTrackingSpeed: string;
  liveTrackingHeading: string;
  liveTrackingBattery: string;
  liveTrackingSignal: string;
  liveTrackingTarget: string;
  liveTrackingETA: string;
  liveTrackingFollowCamera: string;
  liveTrackingUnfollow: string;
  liveTrackingSimulationSpeed: string;

  // Volunteer Types & Gamification
  allVolunteers: string;
  sarOfficial: string;
  publicCommunity: string;
  sarBadgeLabel: string;
  communityBadgeLabel: string;
  volunteerKorpsFilter: string;
  gamificationTitle: string;
  gamificationSubtitle: string;
  rewardsCatalog: string;
  leaderboard: string;
  pointsAvailable: string;
  btnClaimReward: string;
  btnClaimed: string;
  levelTitle: string;
  badgesTitle: string;
  historyTitle: string;
  claimedRewardsTitle: string;
  pointsCost: string;
  sponsor: string;
  stockLeft: string;

  // Heatmap & Multi-hazard
  disasterAll: string;
  disasterFlood: string;
  disasterFire: string;
  disasterEarthquake: string;
  disasterLandslide: string;
  disasterVolcano: string;
  disasterStorm: string;
  heatmapTitle: string;
  heatmapSubtitle: string;
  filterIsland: string;
  islandAll: string;
  islandSumatra: string;
  islandJava: string;
  islandKalimantan: string;
  islandSulawesi: string;
  islandNusaTenggara: string;
  auditReadinessTitle: string;
  auditReadinessSubtitle: string;
  riskCritical: string;
  riskHigh: string;
  riskMedium: string;
  riskLow: string;

  // Volunteer Directory & Status
  directoryTitle: string;
  directorySubtitle: string;
  statusAll: string;
  statusAvailable: string;
  statusBusy: string;
  statusOffline: string;
  searchPlaceholder: string;
  radiusLabel: string;
  skillsLabel: string;
  changeStatusLabel: string;
  closeBtn: string;

  // Common Alerts & Actions
  confirmReset: string;
  toastResetSuccess: string;
  toastDisasterCreated: string;
  toastVolunteerRegistered: string;
  toastTaskCreated: string;
  toastRewardClaimed: string;
  toastBroadcastSent: string;
  toastNationalSelected: string;
  fieldToastNewTask: string;
  fieldToastPusdalops: string;
  fieldToastAccept: string;
  fieldToastAccepted: string;
  fieldToastViewMap: string;
  fieldToastDismiss: string;
  fieldToastDistance: string;
  fieldToastNeeded: string;
  fieldToastSkill: string;
  fieldToastSimulateBtn: string;
  fieldToastSimulateDesc: string;
  fieldToastSimulateSuccess: string;
  fieldToastSoundOn: string;
  fieldToastSoundMuted: string;
  fieldToastRadioOnline: string;
  fieldToastNotificationsTitle: string;
  fieldToastEmpty: string;

  // Logo & Identity
  logoSettingsTitle: string;
  logoSettingsDesc: string;
  logoUploadOwn: string;
  logoUploadHint: string;
  logoPresetsTitle: string;
  logoPresetBnpb: string;
  logoPresetBasarnas: string;
  logoPresetPmi: string;
  logoPresetSigap: string;
  logoResetDefault: string;
  logoChangeBtn: string;
  logoSaveSuccess: string;

  // National Disaster Map & Regional Explorer
  natMapAllIndonesia: string;
  natMapSumatra: string;
  natMapJava: string;
  natMapKalimantan: string;
  natMapSulawesi: string;
  natMapBaliNusa: string;
  natMapAllTypes: string;
  natMapFire: string;
  natMapFlood: string;
  natMapEarthquake: string;
  natMapAllSeverities: string;
  natMapCritical: string;
  natMapHigh: string;
  natMapMedium: string;
  natMapLegendTitle: string;
  natMapLegendFire: string;
  natMapLegendFlood: string;
  natMapLegendEarthquake: string;
  natMapLegendRadius: string;
  natMapDescSituation: string;
  natMapImmediateNeeds: string;
  natMapOpenTactical: string;
  natMapMonitoredTitle: string;
  natMapSouls: string;
  natMapHouseholds: string;
  natMapWaterLevel: string;
  natMapHotspots: string;
  natMapMagnitude: string;
  natMapDepth: string;
  natMapISPU: string;
  natMapWind: string;

  // Presentation Quick Controls
  presLangToggleId: string;
  presLangToggleEn: string;
  presDeckMode: string;
  presDocMode: string;

  // Alerts
  alertBannerEarlyWarning: string;
  alertBannerMonitored: string;
  alertBannerCount: string;
  alertDepthLabel: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  id: {
    // Brand & Nav
    brandTitle: 'SIGAP Koordinator',
    brandSubtitle: 'Sistem Integrasi Tanggap Darurat & Relawan Bencana',
    navMacroMap: 'Peta Besar Bencana',
    navPresentation: 'Presentasi Proyek',
    navVolunteerPortal: 'Portal Relawan & ID',
    navVolunteerMap: 'Peta Relawan',
    navReadiness: 'Kesiapan Daerah',
    navRewards: 'Gamifikasi & Rewards',
    navTacticalMap: 'Peta Taktis',
    navDisasters: 'Operasi Bencana',
    navVolunteers: 'Relawan',
    navTasks: 'Tugas',
    navAnalytics: 'Laporan',
    navEarlyWarning: 'Peringatan Dini (EWS)',
    navDonations: 'Donasi Bencana',
    btnResetDemo: 'Reset Demo',
    btnRegisterVol: 'Registrasi Relawan',
    btnDeclareDisaster: 'Bencana Baru',
    btnCreateTask: 'Buat Tugas',

    // Header Metrics
    metricActiveCrises: 'Bencana Aktif',
    metricAvailableVolunteers: 'Relawan Siaga',
    metricBusyVolunteers: 'Bertugas',
    metricPendingTasks: 'Tugas Terbuka',
    metricCoverageRate: 'Cakupan Lapangan',
    metricAvgResponse: 'Rata-rata Respon',
    metricMinutes: 'menit',
    metricTotalVolunteers: 'Total Relawan',

    // Tactical Deck
    commandDeckTitle: 'PUSDALOPS SIGAP',
    commandDeckSubtitle: 'Pusat Pengendalian Operasi Kebencanaan',
    activeCrisisFocus: 'Fokus Krisis Aktif',
    btnSitRep: 'Draf Laporan SitRep (AI)',
    btnBroadcast: 'Siaran Darurat WhatsApp Relawan',
    openTasksPreview: 'Tugas Lapangan Terbuka',
    btnMatchAI: 'Cocokkan AI →',
    affectedPeople: 'jiwa terdampak',
    evacuationPosko: 'Posko',
    clusterModeLeaflet: 'Leaflet Marker Cluster 🟢',
    clusterModeVector: 'Peta Grid Vektor',
    tacticalMapTitle: 'Peta Taktis Operasi Posko',
    openTasksCount: 'Tugas Terbuka',

    // Real-time Live Tracking Simulation
    liveTrackingTitle: 'Simulasi Pelacakan GPS Real-Time',
    liveTrackingActive: 'Pelacakan Aktif',
    liveTrackingInactive: 'Pelacakan Nonaktif',
    liveTrackingDesc: 'Memantau pergerakan telemetri posisi, kecepatan, dan rute relawan bertugas di lapangan secara langsung.',
    liveTrackingMovingUnits: 'Personel Aktif di Lapangan',
    liveTrackingSpeed: 'Kecepatan',
    liveTrackingHeading: 'Arah Kompas',
    liveTrackingBattery: 'Baterai Perangkat',
    liveTrackingSignal: 'Sinyal Jaringan',
    liveTrackingTarget: 'Tujuan Tugas',
    liveTrackingETA: 'Estimasi Tiba (ETA)',
    liveTrackingFollowCamera: 'Ikuti Posisi GPS',
    liveTrackingUnfollow: 'Lepas Kamera',
    liveTrackingSimulationSpeed: 'Kecepatan Simulasi',

    // Volunteer Types & Gamification
    allVolunteers: 'Semua Relawan',
    sarOfficial: 'Tim SAR Resmi (Basarnas / Potensi SAR)',
    publicCommunity: 'Relawan Masyarakat Umum / Komunitas',
    sarBadgeLabel: 'Tim SAR Basarnas / Potensi',
    communityBadgeLabel: 'Relawan Warga / Komunitas',
    volunteerKorpsFilter: 'Pembeda Korps Relawan:',
    gamificationTitle: 'Pusat Gamifikasi & Hadiah Relawan',
    gamificationSubtitle: 'Penghargaan dedikasi kemanusiaan, akumulasi poin pengalaman (XP), dan katalog reward peralatan operasional',
    rewardsCatalog: 'Katalog Reward & Peralatan',
    leaderboard: 'Peringkat Relawan Teraktif',
    pointsAvailable: 'XP Tersedia',
    btnClaimReward: 'Tukarkan Reward',
    btnClaimed: 'Sudah Ditukarkan ✓',
    levelTitle: 'Tingkat Kemampuan',
    badgesTitle: 'Lencana Kehormatan',
    historyTitle: 'Riwayat Penugasan Lapangan',
    claimedRewardsTitle: 'Reward Ditukarkan:',
    pointsCost: 'Biaya Poin',
    sponsor: 'Disponsori oleh',
    stockLeft: 'Sisa Stok',

    // Heatmap & Multi-hazard
    disasterAll: 'Semua Bencana (Komposit)',
    disasterFlood: 'Banjir & Luapan Air',
    disasterFire: 'Karhutla (Kebakaran Hutan)',
    disasterEarthquake: 'Gempa Bumi Tektonik',
    disasterLandslide: 'Tanah Longsor',
    disasterVolcano: 'Erupsi Gunung Api',
    disasterStorm: 'Cuaca Ekstrem / Badai',
    heatmapTitle: 'Heatmap Spasial Historis Bencana Indonesia',
    heatmapSubtitle: 'Visualisasi konsentrasi titik rawan bencana berdasarkan rekam jejak historis 2021–2026. Pilih kategori bencana untuk melihat konsentrasi spasial di tiap pulau.',
    filterIsland: 'Fokus Pulau:',
    islandAll: 'Seluruh RI',
    islandSumatra: 'Sumatera',
    islandJava: 'Jawa',
    islandKalimantan: 'Kalimantan',
    islandSulawesi: 'Sulawesi',
    islandNusaTenggara: 'Bali & Nusra',
    auditReadinessTitle: 'Audit Kesiapsiagaan Multi-Bencana Daerah',
    auditReadinessSubtitle: 'Analisis ketahanan struktural dan non-struktural tiap provinsi menghadapi berbagai jenis ancaman bencana',
    riskCritical: 'Kritis',
    riskHigh: 'Tinggi',
    riskMedium: 'Sedang',
    riskLow: 'Rendah',

    // Volunteer Directory & Status
    directoryTitle: 'Direktori Relawan Kemanusiaan',
    directorySubtitle: 'Database relawan tersertifikasi se-Indonesia dengan pemetaan keahlian dan status kesiapan real-time',
    statusAll: 'Semua',
    statusAvailable: 'Siaga',
    statusBusy: 'Bertugas',
    statusOffline: 'Offline',
    searchPlaceholder: 'Cari berdasarkan nama relawan, keahlian, organisasi (PMI/BSMI/SAR)...',
    radiusLabel: 'Radius Siaga',
    skillsLabel: 'Keahlian & Sertifikasi Terverifikasi',
    changeStatusLabel: 'Ubah Status Ketersediaan:',
    closeBtn: 'Tutup',

    // Common Alerts & Actions
    confirmReset: 'Reset seluruh data demo ke kondisi awal bencana Jabodetabek & Banten?',
    toastResetSuccess: 'Data demo SIGAP berhasil direset ke status awal.',
    toastDisasterCreated: 'Operasi darurat baru berhasil diaktifkan!',
    toastVolunteerRegistered: 'Relawan berhasil terdaftar dalam sistem SIGAP.',
    toastTaskCreated: 'Tugas lapangan berhasil diterbitkan.',
    toastRewardClaimed: 'Reward berhasil ditukarkan!',
    toastBroadcastSent: 'Siaran darurat terkirim via WhatsApp!',
    toastNationalSelected: 'Titik bencana nasional dipilih.',
    fieldToastNewTask: 'TUGAS LAPANGAN BARU MASUK',
    fieldToastPusdalops: 'Pusdalops Posko Komando',
    fieldToastAccept: 'Terima Misi Lapangan',
    fieldToastAccepted: 'Misi Diterima & Tercatat',
    fieldToastViewMap: 'Buka di Peta Taktis',
    fieldToastDismiss: 'Abaikan',
    fieldToastDistance: 'dari posisi Anda',
    fieldToastNeeded: 'personel dibutuhkan',
    fieldToastSkill: 'Keahlian Utama:',
    fieldToastSimulateBtn: 'Simulasikan Tugas Lapangan Masuk',
    fieldToastSimulateDesc: 'Uji respon notifikasi darurat saat relawan bertugas di lapangan',
    fieldToastSimulateSuccess: 'Simulasi tugas baru berhasil dikirim dari Pusdalops!',
    fieldToastSoundOn: 'Suara Peringatan Aktif',
    fieldToastSoundMuted: 'Suara Peringatan Senyap',
    fieldToastRadioOnline: 'Radio Lapangan Online',
    fieldToastNotificationsTitle: 'Notifikasi Tugas Lapangan',
    fieldToastEmpty: 'Belum ada tugas lapangan baru',

    // Logo & Identity
    logoSettingsTitle: 'Identitas & Logo Lembaga',
    logoSettingsDesc: 'Ubah logo sesuai instansi / gambar Anda (BNPB, BPBD, Basarnas, PMI, atau gambar kustom).',
    logoUploadOwn: 'Unggah File Gambar Logo (PNG, JPG, SVG)',
    logoUploadHint: 'Pilih file gambar logo transparan dari komputer Anda (otomatis tersimpan).',
    logoPresetsTitle: 'Pilihan Logo Resmi Indonesia',
    logoPresetBnpb: 'BNPB / BPBD (Segitiga Oranye & Biru Resmi)',
    logoPresetBasarnas: 'BASARNAS (Search & Rescue Taktis)',
    logoPresetPmi: 'PMI (Palang Merah Indonesia)',
    logoPresetSigap: 'SIGAP Komando (Perisai Taktis)',
    logoResetDefault: 'Reset ke Logo Standar',
    logoChangeBtn: 'Ganti Logo',
    logoSaveSuccess: 'Logo berhasil diperbarui!',

    // National Disaster Map & Regional Explorer
    natMapAllIndonesia: 'Seluruh Indonesia',
    natMapSumatra: 'Sumatera',
    natMapJava: 'Jawa',
    natMapKalimantan: 'Kalimantan',
    natMapSulawesi: 'Sulawesi',
    natMapBaliNusa: 'Bali & Nusa Tenggara',
    natMapAllTypes: 'Semua Jenis Bencana',
    natMapFire: 'Kebakaran Hutan (Karhutla) 🔥',
    natMapFlood: 'Banjir & Luapan Air 🌊',
    natMapEarthquake: 'Gempa Bumi ⚠️',
    natMapAllSeverities: 'Semua Tingkat Keparahan',
    natMapCritical: 'Kritis (Tanggap Darurat)',
    natMapHigh: 'Tinggi (Siaga Penuh)',
    natMapMedium: 'Sedang (Waspada)',
    natMapLegendTitle: 'Simbol Bencana Nasional',
    natMapLegendFire: 'Kebakaran Hutan & Lahan Gambut (Karhutla)',
    natMapLegendFlood: 'Banjir Luapan Sungai & Bandang',
    natMapLegendEarthquake: 'Gempa Bumi & Kerusakan Struktur',
    natMapLegendRadius: 'Lingkaran putus-putus: Radius dampak bahaya langsung',
    natMapDescSituation: 'Deskripsi & Situasi Lapangan:',
    natMapImmediateNeeds: 'Kebutuhan Mendesak Saat Ini:',
    natMapOpenTactical: 'Buka Peta Taktis Operasi & Penugasan Relawan',
    natMapMonitoredTitle: 'Daftar Bencana yang Terpantau',
    natMapSouls: 'jiwa',
    natMapHouseholds: 'KK',
    natMapWaterLevel: 'Tinggi Genangan',
    natMapHotspots: 'Titik Panas Api',
    natMapMagnitude: 'Kekuatan Gempa',
    natMapDepth: 'Kedalaman',
    natMapISPU: 'Kualitas Udara ISPU',
    natMapWind: 'Kecepatan Angin',

    // Presentation Quick Controls
    presLangToggleId: 'Bahasa Indonesia',
    presLangToggleEn: 'English',
    presDeckMode: 'Slide Pitch',
    presDocMode: 'Dokumen Penuh',

    // Alerts
    alertBannerEarlyWarning: 'BMKG Early Warning:',
    alertBannerMonitored: 'Pusat Gempa & Cuaca Ekstrem Terpantau',
    alertBannerCount: 'Peringatan',
    alertDepthLabel: 'kedalaman',
  },
  en: {
    // Brand & Nav
    brandTitle: 'SIGAP Coordinator',
    brandSubtitle: 'Integrated Disaster Relief & Volunteer Management System',
    navMacroMap: 'National Macro Map',
    navPresentation: 'Project Showcase',
    navVolunteerPortal: 'Volunteer Portal & ID',
    navVolunteerMap: 'Volunteer Map',
    navReadiness: 'Regional Readiness',
    navRewards: 'Gamification & Rewards',
    navTacticalMap: 'Tactical Map',
    navDisasters: 'Disaster Operations',
    navVolunteers: 'Volunteers',
    navTasks: 'Tasks',
    navAnalytics: 'Reports & Analytics',
    navEarlyWarning: 'Public Early Warning',
    navDonations: 'Disaster Relief Donations',
    btnResetDemo: 'Reset Demo',
    btnRegisterVol: 'Register Volunteer',
    btnDeclareDisaster: 'New Disaster',
    btnCreateTask: 'Create Task',

    // Header Metrics
    metricActiveCrises: 'Active Crises',
    metricAvailableVolunteers: 'Ready Volunteers',
    metricBusyVolunteers: 'Deployed',
    metricPendingTasks: 'Open Tasks',
    metricCoverageRate: 'Field Coverage',
    metricAvgResponse: 'Avg Response Time',
    metricMinutes: 'mins',
    metricTotalVolunteers: 'Total Volunteers',

    // Tactical Deck
    commandDeckTitle: 'SIGAP PUSDALOPS',
    commandDeckSubtitle: 'Emergency Operations Command Center',
    activeCrisisFocus: 'Active Crisis Focus',
    btnSitRep: 'Draft SitRep Report (AI)',
    btnBroadcast: 'Emergency Broadcast to WhatsApp',
    openTasksPreview: 'Open Field Tasks',
    btnMatchAI: 'Match AI →',
    affectedPeople: 'affected people',
    evacuationPosko: 'Shelters',
    clusterModeLeaflet: 'Leaflet Marker Cluster 🟢',
    clusterModeVector: 'Vector Grid Map',
    tacticalMapTitle: 'Tactical Field Operations Map',
    openTasksCount: 'Open Tasks',

    // Real-time Live Tracking Simulation
    liveTrackingTitle: 'Real-Time GPS Location Tracking',
    liveTrackingActive: 'Tracking Active',
    liveTrackingInactive: 'Tracking Inactive',
    liveTrackingDesc: 'Monitor real-time live telemetry, velocity, compass bearing, and patrol routes of active responders in the field.',
    liveTrackingMovingUnits: 'Active Field Responders',
    liveTrackingSpeed: 'Speed',
    liveTrackingHeading: 'Compass Bearing',
    liveTrackingBattery: 'Device Battery',
    liveTrackingSignal: 'Network Signal',
    liveTrackingTarget: 'Task Objective',
    liveTrackingETA: 'Estimated Arrival (ETA)',
    liveTrackingFollowCamera: 'Follow GPS',
    liveTrackingUnfollow: 'Unlock Camera',
    liveTrackingSimulationSpeed: 'Simulation Speed',

    // Volunteer Types & Gamification
    allVolunteers: 'All Volunteers',
    sarOfficial: 'Official SAR Team (Basarnas / Certified)',
    publicCommunity: 'Community & General Public Volunteers',
    sarBadgeLabel: 'Basarnas / SAR Unit',
    communityBadgeLabel: 'Community / Resident Volunteer',
    volunteerKorpsFilter: 'Volunteer Corps Filter:',
    gamificationTitle: 'Volunteer Gamification & Rewards Hub',
    gamificationSubtitle: 'Honoring humanitarian dedication, accumulating XP points, and redeeming operational gear rewards',
    rewardsCatalog: 'Rewards & Equipment Catalog',
    leaderboard: 'Top Active Volunteer Leaderboard',
    pointsAvailable: 'Available XP',
    btnClaimReward: 'Claim Reward',
    btnClaimed: 'Claimed ✓',
    levelTitle: 'Skill Tier',
    badgesTitle: 'Honor Badges',
    historyTitle: 'Field Mission Deployment History',
    claimedRewardsTitle: 'Redeemed Rewards:',
    pointsCost: 'Point Cost',
    sponsor: 'Sponsored by',
    stockLeft: 'Units Left',

    // Heatmap & Multi-hazard
    disasterAll: 'All Hazards (Composite)',
    disasterFlood: 'Floods & Flash Floods',
    disasterFire: 'Wildfires & Peat Fires',
    disasterEarthquake: 'Tectonic Earthquakes',
    disasterLandslide: 'Landslides & Slope Failures',
    disasterVolcano: 'Volcanic Eruptions',
    disasterStorm: 'Extreme Weather & Storms',
    heatmapTitle: 'Indonesia Historical Multi-Hazard Spatial Heatmap',
    heatmapSubtitle: 'Visualization of disaster-prone hotspots based on 2021–2026 historical records. Select hazard categories to inspect island distributions.',
    filterIsland: 'Island Focus:',
    islandAll: 'All Indonesia',
    islandSumatra: 'Sumatra',
    islandJava: 'Java',
    islandKalimantan: 'Kalimantan',
    islandSulawesi: 'Sulawesi',
    islandNusaTenggara: 'Bali & Nusa Tenggara',
    auditReadinessTitle: 'Regional Multi-Hazard Readiness Audit',
    auditReadinessSubtitle: 'Structural and non-structural resilience assessment across Indonesian provinces for various disaster threats',
    riskCritical: 'Critical',
    riskHigh: 'High',
    riskMedium: 'Moderate',
    riskLow: 'Low',

    // Volunteer Directory & Status
    directoryTitle: 'Humanitarian Volunteer Directory',
    directorySubtitle: 'Nationwide certified disaster volunteer registry with real-time skill mapping and readiness tracking',
    statusAll: 'All',
    statusAvailable: 'Ready',
    statusBusy: 'Deployed',
    statusOffline: 'Offline',
    searchPlaceholder: 'Search by volunteer name, skills, organization (Red Cross/SAR)...',
    radiusLabel: 'Standby Radius',
    skillsLabel: 'Verified Skills & Certifications',
    changeStatusLabel: 'Update Availability Status:',
    closeBtn: 'Close',

    // Common Alerts & Actions
    confirmReset: 'Reset all demo data back to the initial Jabodetabek & Banten crisis state?',
    toastResetSuccess: 'SIGAP demo data successfully reset to initial state.',
    toastDisasterCreated: 'New emergency operation activated successfully!',
    toastVolunteerRegistered: 'Volunteer registered in the SIGAP system.',
    toastTaskCreated: 'Field task dispatched successfully.',
    toastRewardClaimed: 'Reward claimed successfully!',
    toastBroadcastSent: 'Emergency WhatsApp broadcast sent successfully!',
    toastNationalSelected: 'National disaster hotspot selected.',
    fieldToastNewTask: 'NEW FIELD TASK DISPATCHED',
    fieldToastPusdalops: 'Command Post Operations',
    fieldToastAccept: 'Accept Field Mission',
    fieldToastAccepted: 'Mission Accepted & Recorded',
    fieldToastViewMap: 'View on Tactical Map',
    fieldToastDismiss: 'Dismiss',
    fieldToastDistance: 'from your location',
    fieldToastNeeded: 'personnel needed',
    fieldToastSkill: 'Primary Skill:',
    fieldToastSimulateBtn: 'Simulate Incoming Field Task',
    fieldToastSimulateDesc: 'Test the emergency notification response for on-duty field responders',
    fieldToastSimulateSuccess: 'Simulated field dispatch received from Command Post!',
    fieldToastSoundOn: 'Sound Alert Active',
    fieldToastSoundMuted: 'Sound Alert Muted',
    fieldToastRadioOnline: 'Field Radio Online',
    fieldToastNotificationsTitle: 'Field Task Notifications',
    fieldToastEmpty: 'No new field tasks at this moment',

    // Logo & Identity
    logoSettingsTitle: 'Agency Logo & Identity',
    logoSettingsDesc: 'Customize logo to match your agency (BNPB, BPBD, Basarnas, PMI, or custom uploaded image).',
    logoUploadOwn: 'Upload Logo Image File (PNG, JPG, SVG)',
    logoUploadHint: 'Select a transparent PNG or JPG image file from your device (automatically saved).',
    logoPresetsTitle: 'Official Indonesian Agency Logos',
    logoPresetBnpb: 'BNPB / BPBD (Official Orange & Blue Triangle)',
    logoPresetBasarnas: 'BASARNAS (Search & Rescue Tactical)',
    logoPresetPmi: 'PMI (Indonesian Red Cross)',
    logoPresetSigap: 'SIGAP Tactical (Command Shield)',
    logoResetDefault: 'Reset to Default Logo',
    logoChangeBtn: 'Change Logo',
    logoSaveSuccess: 'Logo updated successfully!',

    // National Disaster Map & Regional Explorer
    natMapAllIndonesia: 'All Indonesia',
    natMapSumatra: 'Sumatra',
    natMapJava: 'Java',
    natMapKalimantan: 'Kalimantan',
    natMapSulawesi: 'Sulawesi',
    natMapBaliNusa: 'Bali & Nusa Tenggara',
    natMapAllTypes: 'All Hazard Types',
    natMapFire: 'Wildfires & Peat Fires 🔥',
    natMapFlood: 'Floods & Flash Floods 🌊',
    natMapEarthquake: 'Earthquakes ⚠️',
    natMapAllSeverities: 'All Severity Levels',
    natMapCritical: 'Critical (Emergency Response)',
    natMapHigh: 'High (Full Standby)',
    natMapMedium: 'Medium (Advisory)',
    natMapLegendTitle: 'National Disaster Symbols',
    natMapLegendFire: 'Wildfires & Peatland Fires (Karhutla)',
    natMapLegendFlood: 'River Basin Floods & Flash Surges',
    natMapLegendEarthquake: 'Tectonic Earthquakes & Structural Damage',
    natMapLegendRadius: 'Dashed circle: Immediate hazard impact radius',
    natMapDescSituation: 'Field Situation & Description:',
    natMapImmediateNeeds: 'Immediate Priority Needs:',
    natMapOpenTactical: 'Open Tactical Command Map & Deploy Volunteers',
    natMapMonitoredTitle: 'Monitored Disaster Incidents',
    natMapSouls: 'people',
    natMapHouseholds: 'households',
    natMapWaterLevel: 'Water Depth',
    natMapHotspots: 'Fire Hotspots',
    natMapMagnitude: 'Magnitude',
    natMapDepth: 'Depth',
    natMapISPU: 'Air Quality (AQI)',
    natMapWind: 'Wind Speed',

    // Presentation Quick Controls
    presLangToggleId: 'Bahasa Indonesia',
    presLangToggleEn: 'English',
    presDeckMode: 'Pitch Deck',
    presDocMode: 'Full Document',

    // Alerts
    alertBannerEarlyWarning: 'BMKG Early Warning:',
    alertBannerMonitored: 'Active Earthquake & Severe Weather Center',
    alertBannerCount: 'Alerts',
    alertDepthLabel: 'depth',
  }
};

/**
 * Localizes disaster content (title, description, key needs) based on active language
 */
export function getLocalizedDisaster(disaster: Disaster, language: Language): Disaster {
  if (language === 'id') return disaster;

  const enTranslations: Record<string, Partial<Disaster>> = {
    'disaster-1': {
      title: 'Ciliwung River Basin Flood - Kampung Melayu & Bukit Duri',
      description: 'Extreme heavy precipitation in the upstream Puncak Bogor corridor triggered Alert Level 1 at Katulampa Weir (220 cm). Kali Ciliwung overflowed submerging high-density residential zones in Kampung Melayu (East Jakarta) and Bukit Duri (South Jakarta) with water depths between 1.5 - 2.8 meters. Elderly and infants are trapped on second floors.',
      address: 'Jl. Kebon Pala I, RT 11/RW 02, Kampung Melayu, Jatinegara, East Jakarta',
      keyNeeds: ['Inflatable Evacuation Boats', 'Field Kitchen 3,000 Servings', 'Dermatology & Diarrhea Meds', 'Infant Formula & Diapers', 'Emergency Generator Lighting']
    },
    'disaster-2': {
      title: 'Sunda Strait Tectonic Earthquake - Anyer & Labuan Impact',
      description: 'M 6.2 earthquake at 18 km depth centered in the Sunda Strait generated strong shaking of Intensity VI MMI across the western coast of Pandeglang and Anyer. 78 residential houses partially collapsed, health clinic walls cracked, and local power lines failed. Emergency evacuation and trauma medics required.',
      address: 'Labuan & Anyer Subdistricts, Pandeglang Coast, Banten',
      keyNeeds: ['Emergency Medical Tents', 'Trauma Orthopedic Team', 'Heavy Equipment for Debris', 'Family Tarpaulins', 'Clean Drinking Water Truck']
    },
    'disaster-3': {
      title: 'Siak & Dumai Peatland Wildfires - Dense Toxic Haze',
      description: 'Severe drought induced by dry season caused underground peat fires across 185 hectares of protected peat swamp in Siak and Dumai. Air Quality Index (ISPU) soared to 340 (Hazardous), blanketing residential areas in dense acrid smoke. Respiratory infections (ISPA) surging among children.',
      address: 'Tualang & Minas Peat Corridors, Siak & Dumai, Riau',
      keyNeeds: ['High-Pressure Water Pumps (Mark 3)', 'N95 Respirator Masks', 'Oxygen Concentrators', 'Peat Extinguishing Foam Nozzles', 'Field First Aid Team']
    },
    'disaster-4': {
      title: 'Tidal Inundation & Coastal Surge - Muara Baru & Penjaringan',
      description: 'Spring high tide combined with northeast wind swells breached a 40-meter section of coastal retaining embankment in Muara Baru, North Jakarta. Seawater inundated fisheries storage warehouses and low-income coastal dwellings up to 120 cm.',
      address: 'Muara Baru Fishing Port, Penjaringan, North Jakarta',
      keyNeeds: ['High-Capacity Mobile Polder Pumps', 'Heavy Sandbags (2000 units)', 'Emergency Rubber Dinghies', 'Boots & Lifejackets', 'Dry Food Supplies']
    },
    'disaster-5': {
      title: 'Puncak Mountain Corridor Landslide - Cisarua & Megamendung',
      description: 'Continuous torrential rainfall over 6 hours caused steep roadside hill slopes to fail along 65 meters of the main arterial tourist highway. Roadway blocked by mud and fallen trees, cutting off access to 3 villages.',
      address: 'Jl. Raya Puncak KM 84, Cisarua, Bogor Regency, West Java',
      keyNeeds: ['Mini Excavators & Bulldozers', 'Search Dogs (K9 SAR)', 'Chainsaw & Tree Cutting Equipment', 'Temporary Tarp Canopies', 'Traffic Redirection Marshals']
    }
  };

  const localized = enTranslations[disaster.id];
  return {
    ...disaster,
    title: localized?.title || disaster.titleEn || disaster.title,
    description: localized?.description || disaster.descriptionEn || disaster.description,
    address: localized?.address || disaster.addressEn || disaster.address,
    keyNeeds: localized?.keyNeeds || (disaster.keyNeedsEn && disaster.keyNeedsEn.length > 0 ? disaster.keyNeedsEn : disaster.keyNeeds),
  };
}
