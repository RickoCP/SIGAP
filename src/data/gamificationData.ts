import { GamificationBadge, RewardItem, VolunteerGamification } from '../types/index.ts';

export const GAMIFICATION_BADGES: GamificationBadge[] = [
  {
    id: 'badge-first-responder',
    name: 'First Responder',
    nameEn: 'First Responder Rapid Guard',
    icon: '⚡',
    description: 'Menyelesaikan misi tanggap darurat dalam 30 menit sejak panggilan penugasan.',
    descriptionEn: 'Completed emergency deployment response within 30 minutes of official dispatch call.',
    category: 'mission'
  },
  {
    id: 'badge-water-hero',
    name: 'Penjaga Air & Banjir',
    nameEn: 'Water & Flood Guardian',
    icon: '🌊',
    description: 'Menyelesaikan 5 misi evakuasi air LCR atau distribusi logistik banjir.',
    descriptionEn: 'Completed 5 inflatable boat (LCR) water evacuation runs or wet logistics transfers.',
    category: 'mission'
  },
  {
    id: 'badge-fire-sentinel',
    name: 'Benteng Pantang Mundur Karhutla',
    nameEn: 'Wildfire Peatland Sentinel',
    icon: '🔥',
    description: 'Terjun dalam operasi pemadaman ground fire atau re-wetting sekat kanal gambut.',
    descriptionEn: 'Mobilized in deep peatland ground fire suppression or canal-blocking re-wetting ops.',
    category: 'mission'
  },
  {
    id: 'badge-sar-elite',
    name: 'SAR USAR Bersertifikat',
    nameEn: 'Certified USAR Specialist',
    icon: '🧗',
    description: 'Personel terlatih Urban Search and Rescue / Water Rescue dengan standar Basarnas.',
    descriptionEn: 'Certified personnel in Urban Search & Rescue and technical rope extrication.',
    category: 'sar'
  },
  {
    id: 'badge-community-guardian',
    name: 'Pahlawan Warga Komunitas',
    nameEn: 'Community Grassroots Hero',
    icon: '🤝',
    description: 'Relawan inisiatif masyarakat yang aktif memimpin posko warga dan dapur umum mandiri.',
    descriptionEn: 'Community volunteer leader driving citizen shelters and self-sufficient field kitchens.',
    category: 'community'
  },
  {
    id: 'badge-life-saver',
    name: 'Life Saver Medis',
    nameEn: 'Medical Trauma Life Saver',
    icon: '🩺',
    description: 'Melakukan penanganan trauma, evakuasi medis darurat, atau pertolongan pertama pada korban kritis.',
    descriptionEn: 'Delivered acute trauma care, emergency triage, or field stabilization for critical patients.',
    category: 'skill'
  },
  {
    id: 'badge-century-service',
    name: 'Dedikasi 100 Jam SIGAP',
    nameEn: '100-Hour Humanitarian Veteran',
    icon: '🏆',
    description: 'Mencapai total kontribusi lebih dari 100 jam di zona merah bencana.',
    descriptionEn: 'Surpassed 100 on-the-ground operational hours across frontline disaster hot zones.',
    category: 'hero'
  },
  {
    id: 'badge-radio-lifeline',
    name: 'Jangkar Komunikasi Darurat',
    nameEn: 'Emergency Comms Anchor',
    icon: '📻',
    description: 'Menyajikan transmisi radio repeater dan koordinasi frekuensi darurat saat jaringan seluler terputus.',
    descriptionEn: 'Maintained HF/VHF repeater comms and emergency disaster frequencies during blackout.',
    category: 'skill'
  }
];

export const REWARD_ITEMS: RewardItem[] = [
  {
    id: 'rew-01',
    title: 'Rompi Taktis SAR & Reflektor 3M',
    titleEn: 'Tactical SAR High-Vis 3M Vest',
    category: 'gear',
    pointsCost: 450,
    description: 'Rompi lapangan standar Basarnas berdaya tahan tinggi, kantong multifungsi, dan strip reflektor visibilitas malam.',
    descriptionEn: 'Basarnas standard high-durability rescue vest with modular pockets and 3M night reflector strips.',
    icon: '🦺',
    sponsor: 'Basarnas & BNPB Indonesia',
    stock: 25
  },
  {
    id: 'rew-02',
    title: 'Headlamp Tahan Air 1200 Lumens IPX8',
    titleEn: '1200 Lumens IPX8 Waterproof Headlamp',
    category: 'gear',
    pointsCost: 350,
    description: 'Senter kepala rechargeable tahan rendaman air 2 meter untuk operasi evakuasi malam hari di air keruh.',
    descriptionEn: 'Submersible rechargeable headlamp rated for 2m submersion for night flood evacuations.',
    icon: '🔦',
    sponsor: 'SIGAP Equipment Partner',
    stock: 40
  },
  {
    id: 'rew-03',
    title: 'Sepatu Boots Karet Safety Toe Baja',
    titleEn: 'Steel-Toe Mud & Debris Rubber Safety Boots',
    category: 'gear',
    pointsCost: 500,
    description: 'Sepatu boots pelindung paku dan seng untuk evakuasi di lumpur banjir bandang dan puing reruntuhan.',
    descriptionEn: 'Puncture-resistant steel-toe boots built for wading through flash flood sludge and rubble.',
    icon: '🥾',
    sponsor: 'Mitra Keselamatan Kerja',
    stock: 30
  },
  {
    id: 'rew-04',
    title: 'Sertifikat Kompetensi Water Rescue BNSP',
    titleEn: 'BNSP Certified Water Rescue Competency License',
    category: 'certificate',
    pointsCost: 750,
    description: 'Sertifikasi keahlian resmi pertolongan di air berlisensi BNSP yang diakui secara nasional.',
    descriptionEn: 'Nationally recognized disaster water rescue certification accredited by BNSP.',
    icon: '📜',
    sponsor: 'LSP Penanggulangan Bencana',
    stock: 15
  },
  {
    id: 'rew-05',
    title: 'Paket Pelatihan Khusus USAR Reruntuhan',
    titleEn: 'Specialized Collapsed Structure USAR Bootcamp',
    category: 'training',
    pointsCost: 900,
    description: 'Kursus intensif teknik pencarian korban tertimbun gempa bersama instruktur Basarnas Special Group.',
    descriptionEn: 'Intensive course on seismic search and breaching techniques led by Basarnas Special Group.',
    icon: '🎓',
    sponsor: 'Pusdiklat Basarnas',
    stock: 10
  },
  {
    id: 'rew-06',
    title: 'Voucher BBM Operasional Lapangan Rp 250.000',
    titleEn: 'Field Mobility Fuel Voucher IDR 250,000',
    category: 'voucher',
    pointsCost: 300,
    description: 'Voucher bensin untuk mobilisasi motor trail, mobil operasional, atau genset posko relawan.',
    descriptionEn: 'Gasoline vouchers for trail bikes, response vehicles, and field generator refueling.',
    icon: '⛽',
    sponsor: 'Pertamina Peduli Sesama',
    stock: 60
  },
  {
    id: 'rew-07',
    title: 'Voucher Sembako & Dapur Posko Rp 200.000',
    titleEn: 'Field Kitchen Grocery Voucher IDR 200,000',
    category: 'voucher',
    pointsCost: 250,
    description: 'Dapat ditukarkan di jaringan minimarket/supermarket untuk suplai bahan baku dapur umum.',
    descriptionEn: 'Redeemable at participating retailers for emergency community soup kitchen provisions.',
    icon: '🍚',
    sponsor: 'Kemensos & Retail Peduli',
    stock: 80
  },
  {
    id: 'rew-08',
    title: 'Asuransi Keselamatan Jiwa & Proteksi Misi 1 Tahun',
    titleEn: '1-Year Humanitarian Mission Safety & Accident Insurance',
    category: 'certificate',
    pointsCost: 600,
    description: 'Perlindungan santunan kecelakaan dan biaya rawat inap saat menjalankan misi kebencanaan.',
    descriptionEn: 'Comprehensive hospitalization and accident coverage during active disaster mobilization.',
    icon: '🛡️',
    sponsor: 'BPJS Ketenagakerjaan Peduli Relawan',
    stock: 100
  }
];

// Helper to calculate level from points with bilingual titles
export const calculateVolunteerLevel = (points: number, lang: 'id' | 'en' = 'id'): { level: number; levelTitle: string; levelTitleEn: string; nextLevelPoints: number } => {
  if (points < 200) {
    return { 
      level: 1, 
      levelTitle: lang === 'en' ? 'Junior Alert Volunteer' : 'Relawan Siaga Muda',
      levelTitleEn: 'Junior Alert Volunteer',
      nextLevelPoints: 200 
    };
  } else if (points < 500) {
    return { 
      level: 2, 
      levelTitle: lang === 'en' ? 'Skilled Responder' : 'Relawan Tanggap Terampil',
      levelTitleEn: 'Skilled Responder',
      nextLevelPoints: 500 
    };
  } else if (points < 900) {
    return { 
      level: 3, 
      levelTitle: lang === 'en' ? 'Mission Squad Commander' : 'Komandan Regu Misi',
      levelTitleEn: 'Mission Squad Commander',
      nextLevelPoints: 900 
    };
  } else if (points < 1500) {
    return { 
      level: 4, 
      levelTitle: lang === 'en' ? 'Field Operations Specialist' : 'Spesialis Operasi Lapangan',
      levelTitleEn: 'Field Operations Specialist',
      nextLevelPoints: 1500 
    };
  } else {
    return { 
      level: 5, 
      levelTitle: lang === 'en' ? 'Senior Humanitarian Hero' : 'Pahlawan Kemanusiaan Utama',
      levelTitleEn: 'Senior Humanitarian Hero',
      nextLevelPoints: 2500 
    };
  }
};
