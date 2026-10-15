import { EarlyWarningAlert, CitizenSafetyReport } from '../types/index.ts';

export const INITIAL_EARLY_WARNINGS: EarlyWarningAlert[] = [
  {
    id: 'ew-ciliwung-01',
    disasterId: 'disaster-1',
    title: 'AWAS: Peringatan Dini Banjir Bandang & Luapan Ekstrem Kali Ciliwung',
    hazardType: 'flood',
    alertLevel: 'awas',
    dangerRadiusKm: 8.5,
    locationName: 'Kampung Melayu, Bukit Duri, Bidara Cina & Pengadegan',
    province: 'DKI Jakarta',
    locationLat: -6.2251,
    locationLng: 106.8621,
    soundAlarm: true,
    evacuationAdvice: 'STATUS AWAS TERTINGGI! TMA Bendung Katulampa mencapai 240 cm (Siaga 1). Aliran air tiba di Jakarta dalam waktu singkat. Segera evakuasi mandiri ke lantai 3 Rusunawa Jatinegara Barat atau Gedung Olahraga Otista! Matikan saklar MCB listrik rumah.',
    emergencyShelter: {
      name: 'TES Rusunawa Jatinegara Barat & GOR Otista',
      address: 'Jl. Otista Raya No. 121, Jatinegara, Jakarta Timur',
      capacity: 3000,
      currentOccupancy: 1450,
      lat: -6.2270,
      lng: 106.8670
    },
    keyActionSteps: [
      'Matikan saklar utama listrik (MCB) dan amankan tabung gas',
      'Amankan dokumen penting (Ijazah, Sertifikat, KTP) dalam kantong plastik kedap air',
      'Prioritaskan evakuasi kelompok rentan: bayi, anak-anak, lansia, dan ibu hamil',
      'Bawa Tas Siaga Bencana: obat-obatan darurat, senter, air minum, dan pakaian ganti',
      'Jangan berjalan melintasi arus air deras yang melebihi ketinggian lutut (30 cm)'
    ],
    issuedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    sourceAuthority: 'Pusdalops BPBD DKI Jakarta & Balai Besar Wilayah Sungai Ciliwung Cisadane'
  },
  {
    id: 'ew-sunda-02',
    disasterId: 'disaster-2',
    title: 'SIAGA: Potensi Gempa Susulan Dangkal & Bahaya Bangunan Rusak di Pesisir Banten',
    hazardType: 'earthquake',
    alertLevel: 'siaga',
    dangerRadiusKm: 25.0,
    locationName: 'Pesisir Labuan, Anyer, Panimbang & Carita',
    province: 'Banten',
    locationLat: -6.4022,
    locationLng: 105.8234,
    soundAlarm: true,
    evacuationAdvice: 'Tercatat 14 aktivitas gempa susulan tektonik dangkal. Warga dihimbau tidak memasuki gedung atau rumah yang mengalami retak struktural. Jauhi lereng tebing rawan longsor dan tetap menjauhi bibir pantai radius 500 meter.',
    emergencyShelter: {
      name: 'Posko Lapangan & Masjid Agung Al-Falah Labuan',
      address: 'Jl. Jenderal Sudirman No. 45, Labuan, Pandeglang, Banten',
      capacity: 1800,
      currentOccupancy: 820,
      lat: -6.3980,
      lng: 105.8300
    },
    keyActionSteps: [
      'Jika guncangan terjadi: Berlutut, Lindungi Kepala, dan Bertahan (Drop, Cover, Hold On)',
      'Jauhi jendela kaca, cermin, lemari gantung, dan dinding tanpa perkuatan',
      'Keluar gedung menuju lapangan terbuka setelah guncangan berhenti',
      'Jangan gunakan lift atau jembatan penyeberangan yang belum diperiksa',
      'Matikan kompor dan sumber api segera untuk mencegah bahaya kebakaran susulan'
    ],
    issuedAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    sourceAuthority: 'Pusat Gempa Bumi & Tsunami BMKG'
  },
  {
    id: 'ew-karhutla-03',
    disasterId: 'disaster-4',
    title: 'WASPADA: Kabut Asap Pekat Karhutla & Kualitas Udara Sangat Berbahaya (ISPU > 280)',
    hazardType: 'fire',
    alertLevel: 'waspada',
    dangerRadiusKm: 35.0,
    locationName: 'Minas, Siak, Pelalawan & Pekanbaru',
    province: 'Riau',
    locationLat: 0.7893,
    locationLng: 102.0469,
    soundAlarm: false,
    evacuationAdvice: 'Indeks Standar Pencemar Udara (ISPU) berada pada kategori SANGAT TIDAK SEHAT hingga BERBAHAYA. Warga wajib menggunakan masker standar partikulat N95/KF94 saat bepergian. Kelompok penderita asma dan lansia disarankan mengungsi ke Posko Layanan Oksigen.',
    emergencyShelter: {
      name: 'Posko Layanan Oksigen Gratis & Gedung Pemuda Riau',
      address: 'Jl. Gajah Mada No. 18, Simpang Empat, Pekanbaru',
      capacity: 1200,
      currentOccupancy: 390,
      lat: 0.5280,
      lng: 101.4500
    },
    keyActionSteps: [
      'Gunakan masker N95/KF94 dengan fiksasi rapat di hidung dan dagu',
      'Tutup celah pintu dan ventilasi rumah dengan kain basah untuk menyaring asap',
      'Nyalakan air purifier atau filter air mandiri di dalam ruangan tertutup',
      'Konsumsi air putih minimal 2.5 liter per hari untuk mencegah iritasi saluran napas',
      'Dilarang keras membakar sampah atau membuka lahan dengan api'
    ],
    issuedAt: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    sourceAuthority: 'Dinas Lingkungan Hidup & Kehutanan Provinsi Riau'
  }
];

export const INITIAL_CITIZEN_REPORTS: CitizenSafetyReport[] = [
  {
    id: 'cs-01',
    disasterId: 'disaster-1',
    disasterTitle: 'Banjir Luapan Kali Ciliwung - Kampung Melayu',
    citizenName: 'Bambang Supriyanto',
    phone: '081234567890',
    familyCount: 4,
    status: 'safe',
    locationAddress: 'Rusunawa Jatinegara Barat Lantai 2 Unit 208',
    latitude: -6.2268,
    longitude: 106.8665,
    urgentNeeds: 'Air mineral dan selimut anak sudah terpenuhi.',
    reportedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString()
  },
  {
    id: 'cs-02',
    disasterId: 'disaster-1',
    disasterTitle: 'Banjir Luapan Kali Ciliwung - Kampung Melayu',
    citizenName: 'Ibu Ratna & Mbah Marto',
    phone: '087788990011',
    familyCount: 3,
    status: 'needs_evacuation',
    locationAddress: 'Jl. Kebon Pala II No. 14 RT 07/04 (Lantai 2 Rumah)',
    latitude: -6.2245,
    longitude: 106.8615,
    urgentNeeds: 'Perahu evakuasi untuk 1 lansia stroke usia 76 tahun, stok obat hipertensi habis.',
    reportedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString()
  },
  {
    id: 'cs-03',
    disasterId: 'disaster-2',
    disasterTitle: 'Gempa Bumi Tektonik Selat Sunda',
    citizenName: 'Keluarga Hendra Kusuma',
    phone: '081322114455',
    familyCount: 5,
    status: 'safe',
    locationAddress: 'Lapangan Bola Karanganyar Labuan',
    latitude: -6.3995,
    longitude: 105.8290,
    urgentNeeds: 'Sudah di posko terbuka, butuh terpal tambahan karena gerimis.',
    reportedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString()
  }
];
