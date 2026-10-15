import { GamificationBadge, RewardItem, VolunteerGamification } from '../types/index.ts';

export const GAMIFICATION_BADGES: GamificationBadge[] = [
  {
    id: 'badge-first-responder',
    name: 'First Responder',
    icon: '⚡',
    description: 'Menyelesaikan misi tanggap darurat dalam 30 menit sejak panggilan penugasan.',
    category: 'mission'
  },
  {
    id: 'badge-water-hero',
    name: 'Penjaga Air & Banjir',
    icon: '🌊',
    description: 'Menyelesaikan 5 misi evakuasi air LCR atau distribusi logistik banjir.',
    category: 'mission'
  },
  {
    id: 'badge-fire-sentinel',
    name: 'Benteng Pantang Mundur Karhutla',
    icon: '🔥',
    description: 'Terjun dalam operasi pemadaman ground fire atau re-wetting sekat kanal gambut.',
    category: 'mission'
  },
  {
    id: 'badge-sar-elite',
    name: 'SAR USAR Bersertifikat',
    icon: '🧗',
    description: 'Personel terlatih Urban Search and Rescue / Water Rescue dengan standar Basarnas.',
    category: 'sar'
  },
  {
    id: 'badge-community-guardian',
    name: 'Pahlawan Warga Komunitas',
    icon: '🤝',
    description: 'Relawan inisiatif masyarakat yang aktif memimpin posko warga dan dapur umum mandiri.',
    category: 'community'
  },
  {
    id: 'badge-life-saver',
    name: 'Life Saver Medis',
    icon: '🩺',
    description: 'Melakukan penanganan trauma, evakuasi medis darurat, atau pertolongan pertama pada korban kritis.',
    category: 'skill'
  },
  {
    id: 'badge-century-service',
    name: 'Dedikasi 100 Jam SIGAP',
    icon: '🏆',
    description: 'Mencapai total kontribusi lebih dari 100 jam di zona merah bencana.',
    category: 'hero'
  },
  {
    id: 'badge-radio-lifeline',
    name: 'Jangkar Komunikasi Darurat',
    icon: '📻',
    description: 'Menjaga transmisi radio repeater dan koordinasi frekuensi darurat saat jaringan seluler terputus.',
    category: 'skill'
  }
];

export const REWARD_ITEMS: RewardItem[] = [
  {
    id: 'rew-01',
    title: 'Rompi Taktis SAR & Reflektor 3M',
    category: 'gear',
    pointsCost: 450,
    description: 'Rompi lapangan standar Basarnas berdaya tahan tinggi, kantong multifungsi, dan strip reflektor visibilitas malam.',
    icon: '🦺',
    sponsor: 'Basarnas & BNPB Indonesia',
    stock: 25
  },
  {
    id: 'rew-02',
    title: 'Headlamp Tahan Air 1200 Lumens IPX8',
    category: 'gear',
    pointsCost: 350,
    description: 'Senter kepala rechargeable tahan rendaman air 2 meter untuk operasi evakuasi malam hari di air keruh.',
    icon: '🔦',
    sponsor: 'SIGAP Equipment Partner',
    stock: 40
  },
  {
    id: 'rew-03',
    title: 'Sepatu Boots Karet Safety Toe Baja',
    category: 'gear',
    pointsCost: 500,
    description: 'Sepatu boots pelindung paku dan seng untuk evakuasi di lumpur banjir bandang dan puing reruntuhan.',
    icon: '🥾',
    sponsor: 'Mitra Keselamatan Kerja',
    stock: 30
  },
  {
    id: 'rew-04',
    title: 'Sertifikat Kompetensi Water Rescue BNSP',
    category: 'certificate',
    pointsCost: 750,
    description: 'Sertifikasi keahlian resmi pertolongan di air berlisensi BNSP yang diakui secara nasional.',
    icon: '📜',
    sponsor: 'LSP Penanggulangan Bencana',
    stock: 15
  },
  {
    id: 'rew-05',
    title: 'Paket Pelatihan Khusus USAR Reruntuhan',
    category: 'training',
    pointsCost: 900,
    description: 'Kursus intensif teknik pencarian korban tertimbun gempa bersama instruktur Basarnas Special Group.',
    icon: '🎓',
    sponsor: 'Pusdiklat Basarnas',
    stock: 10
  },
  {
    id: 'rew-06',
    title: 'Voucher BBM Operasional Lapangan Rp 250.000',
    category: 'voucher',
    pointsCost: 300,
    description: 'Voucher bensin untuk mobilisasi motor trail, mobil operasional, atau genset posko relawan.',
    icon: '⛽',
    sponsor: 'Pertamina Peduli Sesama',
    stock: 60
  },
  {
    id: 'rew-07',
    title: 'Voucher Sembako & Dapur Posko Rp 200.000',
    category: 'voucher',
    pointsCost: 250,
    description: 'Dapat ditukarkan di jaringan minimarket/supermarket untuk suplai bahan baku dapur umum.',
    icon: '🍚',
    sponsor: 'Kemensos & Retail Peduli',
    stock: 80
  },
  {
    id: 'rew-08',
    title: 'Asuransi Keselamatan Jiwa & Proteksi Misi 1 Tahun',
    category: 'certificate',
    pointsCost: 600,
    description: 'Perlindungan santunan kecelakaan dan biaya rawat inap saat menjalankan misi kebencanaan.',
    icon: '🛡️',
    sponsor: 'BPJS Ketenagakerjaan Peduli Relawan',
    stock: 100
  }
];

// Helper to calculate level from points
export const calculateVolunteerLevel = (points: number): { level: number; levelTitle: string; nextLevelPoints: number } => {
  if (points < 200) {
    return { level: 1, levelTitle: 'Relawan Siaga Muda', nextLevelPoints: 200 };
  } else if (points < 500) {
    return { level: 2, levelTitle: 'Relawan Tanggap Terampil', nextLevelPoints: 500 };
  } else if (points < 900) {
    return { level: 3, levelTitle: 'Komandan Regu Misi', nextLevelPoints: 900 };
  } else if (points < 1500) {
    return { level: 4, levelTitle: 'Spesialis Operasi Lapangan', nextLevelPoints: 1500 };
  } else {
    return { level: 5, levelTitle: 'Pahlawan Kemanusiaan Utama', nextLevelPoints: 2500 };
  }
};
