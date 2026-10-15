import { RegionalHistoricalData, MonthlyHistoricalTrend, YearlyHistoricalTrend, SeasonalMitigationWindow } from '../types/index.ts';

// Helper to generate monthly data based on province climate profile
export const REGIONAL_HISTORICAL_DATA: Record<string, RegionalHistoricalData> = {
  'reg-riau': {
    historicalAnalysisNotes: 'Riau memiliki pola bimodal dengan dua puncak musim kemarau (Februari-Maret dan Juni-Oktober). Ancaman utama adalah kebakaran lahan gambut dalam (kedalaman >2m) yang dipicu kekeringan dan hembusan angin tenggara.',
    monthlyTrends: [
      { month: 'Jan', monthFull: 'Januari', fireHotspots: 14, fireRiskScore: 25, rainfallMm: 240, floodIncidents: 6, floodRiskScore: 65, dominantThreat: 'flood' },
      { month: 'Feb', monthFull: 'Februari', fireHotspots: 48, fireRiskScore: 55, rainfallMm: 110, floodIncidents: 2, floodRiskScore: 30, dominantThreat: 'fire' },
      { month: 'Mar', monthFull: 'Maret', fireHotspots: 65, fireRiskScore: 68, rainfallMm: 130, floodIncidents: 1, floodRiskScore: 20, dominantThreat: 'fire' },
      { month: 'Apr', monthFull: 'April', fireHotspots: 22, fireRiskScore: 32, rainfallMm: 210, floodIncidents: 3, floodRiskScore: 40, dominantThreat: 'low' },
      { month: 'Mei', monthFull: 'Mei', fireHotspots: 35, fireRiskScore: 45, rainfallMm: 160, floodIncidents: 2, floodRiskScore: 25, dominantThreat: 'low' },
      { month: 'Jun', monthFull: 'Juni', fireHotspots: 78, fireRiskScore: 72, rainfallMm: 95, floodIncidents: 1, floodRiskScore: 15, dominantThreat: 'fire' },
      { month: 'Jul', monthFull: 'Juli', fireHotspots: 142, fireRiskScore: 88, rainfallMm: 68, floodIncidents: 0, floodRiskScore: 10, dominantThreat: 'fire' },
      { month: 'Agu', monthFull: 'Agustus', fireHotspots: 195, fireRiskScore: 96, rainfallMm: 52, floodIncidents: 0, floodRiskScore: 5, dominantThreat: 'fire' },
      { month: 'Sep', monthFull: 'September', fireHotspots: 168, fireRiskScore: 92, rainfallMm: 74, floodIncidents: 0, floodRiskScore: 10, dominantThreat: 'fire' },
      { month: 'Okt', monthFull: 'Oktober', fireHotspots: 85, fireRiskScore: 70, rainfallMm: 180, floodIncidents: 3, floodRiskScore: 35, dominantThreat: 'fire' },
      { month: 'Nov', monthFull: 'November', fireHotspots: 18, fireRiskScore: 24, rainfallMm: 310, floodIncidents: 8, floodRiskScore: 78, dominantThreat: 'flood' },
      { month: 'Des', monthFull: 'Desember', fireHotspots: 11, fireRiskScore: 18, rainfallMm: 290, floodIncidents: 7, floodRiskScore: 74, dominantThreat: 'flood' },
    ],
    yearlyTrends: [
      { year: 2022, fireHectaresBurned: 1240, fireHotspotCount: 420, floodDisasterCount: 22, floodAffectedPeople: 28500, economicLossBillionsIDR: 45.2 },
      { year: 2023, fireHectaresBurned: 5890, fireHotspotCount: 1680, floodDisasterCount: 18, floodAffectedPeople: 21400, economicLossBillionsIDR: 182.5 },
      { year: 2024, fireHectaresBurned: 2450, fireHotspotCount: 840, floodDisasterCount: 26, floodAffectedPeople: 36800, economicLossBillionsIDR: 88.0 },
      { year: 2025, fireHectaresBurned: 3120, fireHotspotCount: 990, floodDisasterCount: 24, floodAffectedPeople: 31200, economicLossBillionsIDR: 105.4 },
      { year: 2026, fireHectaresBurned: 2890, fireHotspotCount: 886, floodDisasterCount: 29, floodAffectedPeople: 38200, economicLossBillionsIDR: 98.7 },
    ],
    mitigationWindows: [
      {
        threat: 'fire',
        title: 'Jendela Mitigasi Pra-Karhutla Riau',
        peakRiskPeriod: 'Juli - Oktober (Puncak Hotspot)',
        criticalMitigationWindow: 'Mei - Juni (Wajib Aksi Dini)',
        urgency: 'critical',
        status: 'active_window',
        recommendedActions: [
          'Audit dan re-wetting sekat kanal di 12 kecamatan gambut rawan',
          'Aktivasi posko terpadu Babinsa, Manggala Agni & Masyarakat Peduli Api (MPA)',
          'Mobilisasi drone thermal untuk patroli malam hari di perbatasan kebun rakyat',
          'Stok awal masker respirator N95 di 35 Puskesmas lingkar gambut'
        ]
      },
      {
        threat: 'flood',
        title: 'Jendela Kesiapsiagaan Banjir DAS Kampar & Siak',
        peakRiskPeriod: 'November - Januari (Curah Hujan Ekstrem)',
        criticalMitigationWindow: 'September - Oktober (Persiapan Posko & Pompa)',
        urgency: 'high',
        status: 'upcoming',
        recommendedActions: [
          'Pembersihan gulma eceng gondok dan sedimentasi di muara sungai',
          'Inspeksi kelayakan mesin perahu LCR dan inventarisasi stok jaket pelampung',
          'Pemetaan ulang titik kumpul evakuasi di dataran tinggi kelurahan'
        ]
      }
    ]
  },
  'reg-kalteng': {
    historicalAnalysisNotes: 'Kalteng memiliki bentang gambut Sebangau yang sangat rentan kebakaran bawah tanah (smoldering) saat El Niño. Asap pekat dapat bertahan berminggu-minggu jika pemadaman ground fire terlambat.',
    monthlyTrends: [
      { month: 'Jan', monthFull: 'Januari', fireHotspots: 8, fireRiskScore: 15, rainfallMm: 290, floodIncidents: 7, floodRiskScore: 72, dominantThreat: 'flood' },
      { month: 'Feb', monthFull: 'Februari', fireHotspots: 14, fireRiskScore: 22, rainfallMm: 260, floodIncidents: 6, floodRiskScore: 68, dominantThreat: 'flood' },
      { month: 'Mar', monthFull: 'Maret', fireHotspots: 18, fireRiskScore: 28, rainfallMm: 280, floodIncidents: 5, floodRiskScore: 60, dominantThreat: 'flood' },
      { month: 'Apr', monthFull: 'April', fireHotspots: 25, fireRiskScore: 35, rainfallMm: 230, floodIncidents: 4, floodRiskScore: 45, dominantThreat: 'low' },
      { month: 'Mei', monthFull: 'Mei', fireHotspots: 42, fireRiskScore: 50, rainfallMm: 180, floodIncidents: 2, floodRiskScore: 30, dominantThreat: 'low' },
      { month: 'Jun', monthFull: 'Juni', fireHotspots: 88, fireRiskScore: 75, rainfallMm: 110, floodIncidents: 1, floodRiskScore: 15, dominantThreat: 'fire' },
      { month: 'Jul', monthFull: 'Juli', fireHotspots: 175, fireRiskScore: 92, rainfallMm: 65, floodIncidents: 0, floodRiskScore: 10, dominantThreat: 'fire' },
      { month: 'Agu', monthFull: 'Agustus', fireHotspots: 240, fireRiskScore: 98, rainfallMm: 45, floodIncidents: 0, floodRiskScore: 5, dominantThreat: 'fire' },
      { month: 'Sep', monthFull: 'September', fireHotspots: 215, fireRiskScore: 95, rainfallMm: 58, floodIncidents: 0, floodRiskScore: 10, dominantThreat: 'fire' },
      { month: 'Okt', monthFull: 'Oktober', fireHotspots: 112, fireRiskScore: 80, rainfallMm: 160, floodIncidents: 2, floodRiskScore: 28, dominantThreat: 'fire' },
      { month: 'Nov', monthFull: 'November', fireHotspots: 24, fireRiskScore: 30, rainfallMm: 310, floodIncidents: 9, floodRiskScore: 84, dominantThreat: 'flood' },
      { month: 'Des', monthFull: 'Desember', fireHotspots: 10, fireRiskScore: 18, rainfallMm: 330, floodIncidents: 8, floodRiskScore: 80, dominantThreat: 'flood' },
    ],
    yearlyTrends: [
      { year: 2022, fireHectaresBurned: 1820, fireHotspotCount: 520, floodDisasterCount: 28, floodAffectedPeople: 45000, economicLossBillionsIDR: 62.0 },
      { year: 2023, fireHectaresBurned: 9400, fireHotspotCount: 2840, floodDisasterCount: 22, floodAffectedPeople: 32000, economicLossBillionsIDR: 260.5 },
      { year: 2024, fireHectaresBurned: 3100, fireHotspotCount: 1120, floodDisasterCount: 31, floodAffectedPeople: 52000, economicLossBillionsIDR: 110.2 },
      { year: 2025, fireHectaresBurned: 4200, fireHotspotCount: 1350, floodDisasterCount: 29, floodAffectedPeople: 48000, economicLossBillionsIDR: 140.0 },
      { year: 2026, fireHectaresBurned: 3850, fireHotspotCount: 1240, floodDisasterCount: 34, floodAffectedPeople: 54000, economicLossBillionsIDR: 125.8 },
    ],
    mitigationWindows: [
      {
        threat: 'fire',
        title: 'Jendela Mitigasi Pra-Karhutla Gambut Kalteng',
        peakRiskPeriod: 'Juli - Oktober (Hotspot Ekstrem & Kabut Asap)',
        criticalMitigationWindow: 'Mei - Juni (Pembasahan & Injeksi Gambut)',
        urgency: 'critical',
        status: 'active_window',
        recommendedActions: [
          'Pengisian tandon air darurat berkapasitas 5.000 liter di sepanjang jalur Sebangau',
          'Uji coba operasional pipa nozel injeksi gambut bertekanan tinggi',
          'Penyiapan helikopter patroli pemantauan titik asap dini',
          'Edukasi intensif petani ladang agar tidak membakar sisa tebasan'
        ]
      },
      {
        threat: 'flood',
        title: 'Jendela Antisipasi Banjir Luapan DAS Kahayan & Barito',
        peakRiskPeriod: 'November - Februari (Banjir Pemukiman Tepian)',
        criticalMitigationWindow: 'September - Oktober (Kesiapsiagaan Posko Perahu)',
        urgency: 'high',
        status: 'upcoming',
        recommendedActions: [
          'Perkuatan dermaga apung dan jukung evakuasi darurat desa',
          'Penyediaan tandon air bersih siap minum di balai kelurahan',
          'Posko penanganan penyakit kulit dan diare'
        ]
      }
    ]
  },
  'reg-dki': {
    historicalAnalysisNotes: 'DKI Jakarta didominasi ancaman banjir tiga dimensi: banjir kiriman hulu Puncak Bogor (Katulampa), banjir lokal hujan ekstrem, dan banjir rob pasang air laut di pesisir utara.',
    monthlyTrends: [
      { month: 'Jan', monthFull: 'Januari', fireHotspots: 1, fireRiskScore: 10, rainfallMm: 390, floodIncidents: 16, floodRiskScore: 95, dominantThreat: 'flood' },
      { month: 'Feb', monthFull: 'Februari', fireHotspots: 2, fireRiskScore: 12, rainfallMm: 380, floodIncidents: 15, floodRiskScore: 92, dominantThreat: 'flood' },
      { month: 'Mar', monthFull: 'Maret', fireHotspots: 2, fireRiskScore: 15, rainfallMm: 240, floodIncidents: 8, floodRiskScore: 68, dominantThreat: 'flood' },
      { month: 'Apr', monthFull: 'April', fireHotspots: 3, fireRiskScore: 20, rainfallMm: 170, floodIncidents: 4, floodRiskScore: 45, dominantThreat: 'low' },
      { month: 'Mei', monthFull: 'Mei', fireHotspots: 4, fireRiskScore: 25, rainfallMm: 110, floodIncidents: 2, floodRiskScore: 25, dominantThreat: 'low' },
      { month: 'Jun', monthFull: 'Juni', fireHotspots: 5, fireRiskScore: 30, rainfallMm: 85, floodIncidents: 1, floodRiskScore: 18, dominantThreat: 'low' },
      { month: 'Jul', monthFull: 'Juli', fireHotspots: 6, fireRiskScore: 35, rainfallMm: 50, floodIncidents: 1, floodRiskScore: 15, dominantThreat: 'low' },
      { month: 'Agu', monthFull: 'Agustus', fireHotspots: 8, fireRiskScore: 40, rainfallMm: 45, floodIncidents: 0, floodRiskScore: 10, dominantThreat: 'low' },
      { month: 'Sep', monthFull: 'September', fireHotspots: 7, fireRiskScore: 38, rainfallMm: 65, floodIncidents: 1, floodRiskScore: 15, dominantThreat: 'low' },
      { month: 'Okt', monthFull: 'Oktober', fireHotspots: 4, fireRiskScore: 25, rainfallMm: 140, floodIncidents: 3, floodRiskScore: 35, dominantThreat: 'low' },
      { month: 'Nov', monthFull: 'November', fireHotspots: 2, fireRiskScore: 15, rainfallMm: 220, floodIncidents: 7, floodRiskScore: 70, dominantThreat: 'flood' },
      { month: 'Des', monthFull: 'Desember', fireHotspots: 1, fireRiskScore: 10, rainfallMm: 310, floodIncidents: 12, floodRiskScore: 86, dominantThreat: 'flood' },
    ],
    yearlyTrends: [
      { year: 2022, fireHectaresBurned: 15, fireHotspotCount: 12, floodDisasterCount: 42, floodAffectedPeople: 82000, economicLossBillionsIDR: 210.0 },
      { year: 2023, fireHectaresBurned: 22, fireHotspotCount: 18, floodDisasterCount: 35, floodAffectedPeople: 64000, economicLossBillionsIDR: 165.0 },
      { year: 2024, fireHectaresBurned: 18, fireHotspotCount: 14, floodDisasterCount: 48, floodAffectedPeople: 95000, economicLossBillionsIDR: 245.0 },
      { year: 2025, fireHectaresBurned: 12, fireHotspotCount: 10, floodDisasterCount: 44, floodAffectedPeople: 88000, economicLossBillionsIDR: 220.0 },
      { year: 2026, fireHectaresBurned: 16, fireHotspotCount: 15, floodDisasterCount: 46, floodAffectedPeople: 91000, economicLossBillionsIDR: 232.0 },
    ],
    mitigationWindows: [
      {
        threat: 'flood',
        title: 'Jendela Mitigasi Pra-Banjir Musim Hujan Jakarta',
        peakRiskPeriod: 'Desember - Februari (Puncak Banjir Katulampa & Rob)',
        criticalMitigationWindow: 'September - November (Wajib Pengerukan & Cek Pompa)',
        urgency: 'critical',
        status: 'active_window',
        recommendedActions: [
          'Pengerukan lumpur sedimen di Kali Ciliwung, Pesanggrahan, dan Krukut',
          'Uji beban 520 unit pompa stasioner waduk dan genset cadangan solar',
          'Simulasi SMS Blast peringatan dini BMKG 9 jam sebelum air tiba di Jakarta',
          'Penyiapan armada perahu karet LCR Tagana di Kampung Melayu, Bidara Cina, dan Rawa Buaya'
        ]
      },
      {
        threat: 'fire',
        title: 'Antisipasi Kebakaran Permukiman Padat',
        peakRiskPeriod: 'Juli - September (Kemarau & Korsleting Listrik)',
        criticalMitigationWindow: 'Mei - Juni (Audit Instalasi & APAR)',
        urgency: 'moderate',
        status: 'passed',
        recommendedActions: [
          'Audit instalasi listrik kabel semrawut di Tambora, Tanah Abang, dan Johar Baru',
          'Penyediaan hidran mandiri dan motor damkar roda tiga lorong sempit'
        ]
      }
    ]
  },
  'reg-jateng': {
    historicalAnalysisNotes: 'Jawa Tengah memiliki kerentanan ganda: tanggul jebol di kawasan Pantura timur (Demak, Kudus, Grobogan) dan banjir rob pesisir Semarang, serta banjir DAS Bengawan Solo hulu.',
    monthlyTrends: [
      { month: 'Jan', monthFull: 'Januari', fireHotspots: 2, fireRiskScore: 10, rainfallMm: 410, floodIncidents: 19, floodRiskScore: 98, dominantThreat: 'flood' },
      { month: 'Feb', monthFull: 'Februari', fireHotspots: 1, fireRiskScore: 8, rainfallMm: 395, floodIncidents: 18, floodRiskScore: 96, dominantThreat: 'flood' },
      { month: 'Mar', monthFull: 'Maret', fireHotspots: 3, fireRiskScore: 15, rainfallMm: 310, floodIncidents: 12, floodRiskScore: 82, dominantThreat: 'flood' },
      { month: 'Apr', monthFull: 'April', fireHotspots: 5, fireRiskScore: 22, rainfallMm: 210, floodIncidents: 5, floodRiskScore: 50, dominantThreat: 'low' },
      { month: 'Mei', monthFull: 'Mei', fireHotspots: 8, fireRiskScore: 30, rainfallMm: 120, floodIncidents: 2, floodRiskScore: 25, dominantThreat: 'low' },
      { month: 'Jun', monthFull: 'Juni', fireHotspots: 12, fireRiskScore: 38, rainfallMm: 75, floodIncidents: 1, floodRiskScore: 15, dominantThreat: 'low' },
      { month: 'Jul', monthFull: 'Juli', fireHotspots: 18, fireRiskScore: 48, rainfallMm: 40, floodIncidents: 0, floodRiskScore: 10, dominantThreat: 'low' },
      { month: 'Agu', monthFull: 'Agustus', fireHotspots: 25, fireRiskScore: 55, rainfallMm: 30, floodIncidents: 0, floodRiskScore: 5, dominantThreat: 'low' },
      { month: 'Sep', monthFull: 'September', fireHotspots: 22, fireRiskScore: 52, rainfallMm: 45, floodIncidents: 0, floodRiskScore: 10, dominantThreat: 'low' },
      { month: 'Okt', monthFull: 'Oktober', fireHotspots: 14, fireRiskScore: 35, rainfallMm: 130, floodIncidents: 3, floodRiskScore: 30, dominantThreat: 'low' },
      { month: 'Nov', monthFull: 'November', fireHotspots: 4, fireRiskScore: 15, rainfallMm: 260, floodIncidents: 8, floodRiskScore: 72, dominantThreat: 'flood' },
      { month: 'Des', monthFull: 'Desember', fireHotspots: 2, fireRiskScore: 10, rainfallMm: 360, floodIncidents: 15, floodRiskScore: 90, dominantThreat: 'flood' },
    ],
    yearlyTrends: [
      { year: 2022, fireHectaresBurned: 85, fireHotspotCount: 45, floodDisasterCount: 54, floodAffectedPeople: 98000, economicLossBillionsIDR: 195.0 },
      { year: 2023, fireHectaresBurned: 140, fireHotspotCount: 78, floodDisasterCount: 48, floodAffectedPeople: 82000, economicLossBillionsIDR: 170.0 },
      { year: 2024, fireHectaresBurned: 95, fireHotspotCount: 52, floodDisasterCount: 72, floodAffectedPeople: 185000, economicLossBillionsIDR: 480.0 }, // Banjir Demak Ekstrem
      { year: 2025, fireHectaresBurned: 60, fireHotspotCount: 38, floodDisasterCount: 58, floodAffectedPeople: 112000, economicLossBillionsIDR: 240.0 },
      { year: 2026, fireHectaresBurned: 72, fireHotspotCount: 44, floodDisasterCount: 65, floodAffectedPeople: 134000, economicLossBillionsIDR: 295.0 },
    ],
    mitigationWindows: [
      {
        threat: 'flood',
        title: 'Jendela Mitigasi Penguatan Tanggul Kritis Pantura',
        peakRiskPeriod: 'Desember - Maret (Limpasan Sungai Wulan & Lusi)',
        criticalMitigationWindow: 'September - November (Wajib Pasang Bronjong & Trucuk)',
        urgency: 'critical',
        status: 'active_window',
        recommendedActions: [
          'Penguatan tanggul kritis Sungai Wulan di Karanganyar Demak dengan jumbo bag dan cerucuk bambu',
          'Pembersihan sedimentasi dan pengerukan alur muara Juwana dan Sayung',
          'Penyiapan logistik dapur umum massal di sepanjang koridor lingkar Pantura Kudus-Demak',
          'Integrasi radio komunitas darurat dan sirine banjir lokal'
        ]
      }
    ]
  },
  'reg-kalbar': {
    historicalAnalysisNotes: 'Kalbar rawan kebakaran semak belukar gambut dan perkebunan saat kemarau kering, serta banjir genangan pasang surut di muara DAS Kapuas yang merendam ribuan rumah panggung.',
    monthlyTrends: [
      { month: 'Jan', monthFull: 'Januari', fireHotspots: 10, fireRiskScore: 18, rainfallMm: 270, floodIncidents: 6, floodRiskScore: 70, dominantThreat: 'flood' },
      { month: 'Feb', monthFull: 'Februari', fireHotspots: 28, fireRiskScore: 40, rainfallMm: 160, floodIncidents: 3, floodRiskScore: 40, dominantThreat: 'low' },
      { month: 'Mar', monthFull: 'Maret', fireHotspots: 35, fireRiskScore: 48, rainfallMm: 190, floodIncidents: 2, floodRiskScore: 30, dominantThreat: 'low' },
      { month: 'Apr', monthFull: 'April', fireHotspots: 24, fireRiskScore: 35, rainfallMm: 220, floodIncidents: 3, floodRiskScore: 38, dominantThreat: 'low' },
      { month: 'Mei', monthFull: 'Mei', fireHotspots: 38, fireRiskScore: 46, rainfallMm: 195, floodIncidents: 2, floodRiskScore: 28, dominantThreat: 'low' },
      { month: 'Jun', monthFull: 'Juni', fireHotspots: 72, fireRiskScore: 68, rainfallMm: 130, floodIncidents: 1, floodRiskScore: 18, dominantThreat: 'fire' },
      { month: 'Jul', monthFull: 'Juli', fireHotspots: 145, fireRiskScore: 86, rainfallMm: 80, floodIncidents: 0, floodRiskScore: 10, dominantThreat: 'fire' },
      { month: 'Agu', monthFull: 'Agustus', fireHotspots: 210, fireRiskScore: 95, rainfallMm: 60, floodIncidents: 0, floodRiskScore: 5, dominantThreat: 'fire' },
      { month: 'Sep', monthFull: 'September', fireHotspots: 180, fireRiskScore: 90, rainfallMm: 75, floodIncidents: 0, floodRiskScore: 10, dominantThreat: 'fire' },
      { month: 'Okt', monthFull: 'Oktober', fireHotspots: 90, fireRiskScore: 72, rainfallMm: 190, floodIncidents: 3, floodRiskScore: 35, dominantThreat: 'fire' },
      { month: 'Nov', monthFull: 'November', fireHotspots: 18, fireRiskScore: 25, rainfallMm: 320, floodIncidents: 8, floodRiskScore: 80, dominantThreat: 'flood' },
      { month: 'Des', monthFull: 'Desember', fireHotspots: 8, fireRiskScore: 15, rainfallMm: 310, floodIncidents: 7, floodRiskScore: 76, dominantThreat: 'flood' },
    ],
    yearlyTrends: [
      { year: 2022, fireHectaresBurned: 1100, fireHotspotCount: 460, floodDisasterCount: 24, floodAffectedPeople: 38000, economicLossBillionsIDR: 42.0 },
      { year: 2023, fireHectaresBurned: 6400, fireHotspotCount: 2100, floodDisasterCount: 19, floodAffectedPeople: 29000, economicLossBillionsIDR: 195.0 },
      { year: 2024, fireHectaresBurned: 2600, fireHotspotCount: 920, floodDisasterCount: 28, floodAffectedPeople: 46000, economicLossBillionsIDR: 90.0 },
      { year: 2025, fireHectaresBurned: 3200, fireHotspotCount: 1080, floodDisasterCount: 26, floodAffectedPeople: 41000, economicLossBillionsIDR: 112.0 },
      { year: 2026, fireHectaresBurned: 2950, fireHotspotCount: 980, floodDisasterCount: 30, floodAffectedPeople: 49000, economicLossBillionsIDR: 104.0 },
    ],
    mitigationWindows: [
      {
        threat: 'fire',
        title: 'Jendela Mitigasi Pra-Karhutla Ketapang & Kubu Raya',
        peakRiskPeriod: 'Juli - September (Puncak Hotspot Lahan Gambut)',
        criticalMitigationWindow: 'Mei - Juni (Patroli Bersama & Pembersihan Parit)',
        urgency: 'critical',
        status: 'active_window',
        recommendedActions: [
          'Pengadaan pompa punggung alkon portabel untuk relawan motor trail',
          'Pembersihan saluran parit gambut di batas konsesi perkebunan',
          'Sosialisasi maklumat larangan membuka ladang dengan api'
        ]
      }
    ]
  }
};

// Generic fallback for any region without specific profile
export function getHistoricalDataForRegion(regionId: string, regionName: string, isFireProne: boolean): RegionalHistoricalData {
  if (REGIONAL_HISTORICAL_DATA[regionId]) {
    return REGIONAL_HISTORICAL_DATA[regionId];
  }

  // Generates tailored data dynamically
  const firePeakMonths = [6, 7, 8]; // Jul, Aug, Sep
  const floodPeakMonths = [0, 1, 10, 11]; // Jan, Feb, Nov, Dec
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const monthsFull = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const monthlyTrends: MonthlyHistoricalTrend[] = months.map((m, idx) => {
    const isFirePeak = firePeakMonths.includes(idx);
    const isFloodPeak = floodPeakMonths.includes(idx);

    const fireHotspots = isFireProne 
      ? (isFirePeak ? Math.round(90 + Math.random() * 80) : Math.round(10 + Math.random() * 25))
      : (isFirePeak ? Math.round(15 + Math.random() * 20) : Math.round(2 + Math.random() * 5));

    const fireRiskScore = isFireProne
      ? (isFirePeak ? Math.round(80 + Math.random() * 18) : Math.round(15 + Math.random() * 30))
      : (isFirePeak ? Math.round(40 + Math.random() * 25) : Math.round(10 + Math.random() * 15));

    const rainfallMm = isFloodPeak
      ? Math.round(280 + Math.random() * 120)
      : (isFirePeak ? Math.round(40 + Math.random() * 45) : Math.round(140 + Math.random() * 70));

    const floodIncidents = isFloodPeak
      ? Math.round(8 + Math.random() * 8)
      : (isFirePeak ? Math.round(Math.random() * 1) : Math.round(2 + Math.random() * 3));

    const floodRiskScore = isFloodPeak
      ? Math.round(75 + Math.random() * 22)
      : (isFirePeak ? Math.round(5 + Math.random() * 10) : Math.round(25 + Math.random() * 25));

    const dominantThreat = fireRiskScore > floodRiskScore && fireRiskScore > 45 
      ? 'fire' 
      : floodRiskScore > fireRiskScore && floodRiskScore > 45 
      ? 'flood' 
      : 'low';

    return {
      month: m,
      monthFull: monthsFull[idx],
      fireHotspots,
      fireRiskScore,
      rainfallMm,
      floodIncidents,
      floodRiskScore,
      dominantThreat
    };
  });

  const yearlyTrends: YearlyHistoricalTrend[] = [2022, 2023, 2024, 2025, 2026].map(yr => ({
    year: yr,
    fireHectaresBurned: yr === 2023 ? Math.round(4500 + Math.random() * 2000) : Math.round(1200 + Math.random() * 1200),
    fireHotspotCount: yr === 2023 ? Math.round(1500 + Math.random() * 800) : Math.round(400 + Math.random() * 350),
    floodDisasterCount: Math.round(20 + Math.random() * 25),
    floodAffectedPeople: Math.round(30000 + Math.random() * 40000),
    economicLossBillionsIDR: Math.round(60 + Math.random() * 80)
  }));

  const mitigationWindows: SeasonalMitigationWindow[] = isFireProne ? [
    {
      threat: 'fire',
      title: `Jendela Mitigasi Karhutla ${regionName}`,
      peakRiskPeriod: 'Juli - Oktober (Kemarau Puncak)',
      criticalMitigationWindow: 'Mei - Juni (Wajib Aksi Dini)',
      urgency: 'critical',
      status: 'active_window',
      recommendedActions: [
        'Aktivasi posko koordinasi Manggala Agni dan Masyarakat Peduli Api',
        'Inspeksi debit air tandon dan sekat kanal terdekat',
        'Drop perlengkapan masker N95 dan kacamata google pelindung asap'
      ]
    },
    {
      threat: 'flood',
      title: `Jendela Mitigasi Banjir Luapan ${regionName}`,
      peakRiskPeriod: 'November - Februari (Musim Hujan Ekstrem)',
      criticalMitigationWindow: 'September - Oktober (Pembersihan Drainase & Pompa)',
      urgency: 'high',
      status: 'upcoming',
      recommendedActions: [
        'Pengerukan saluran drainase utama dan sungai permukiman',
        'Uji kesiapan armada perahu karet dan motor tempel',
        'Penetapan jalur evakuasi aman warga'
      ]
    }
  ] : [
    {
      threat: 'flood',
      title: `Jendela Mitigasi Banjir & Tanggul Kritis ${regionName}`,
      peakRiskPeriod: 'Desember - Februari (Puncak Curah Hujan)',
      criticalMitigationWindow: 'September - November (Penguatan Tanggul & Sungai)',
      urgency: 'critical',
      status: 'active_window',
      recommendedActions: [
        'Inspeksi tanggul sungai kritis rawan jebol dan pemasangan kawat bronjong',
        'Penyediaan mobil pompa sedot air mobile dan genset cadangan',
        'Sosialisasi peringatan dini sensor ketinggian air kepada warga bantaran'
      ]
    }
  ];

  return {
    historicalAnalysisNotes: `Profil iklim ${regionName} menunjukkan fluktuasi musiman yang dipengaruhi pola monsun Asia-Australia dengan variasi risiko sesuai musim kemarau dan hujan tahunan.`,
    monthlyTrends,
    yearlyTrends,
    mitigationWindows
  };
}
