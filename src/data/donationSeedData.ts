import { DonationPackage, DisasterDonation } from '../types/index.ts';

export const DONATION_PACKAGES: DonationPackage[] = [
  {
    id: 'pkg-sembako',
    title: 'Paket Sembako Keluarga Berkah',
    description: 'Beras premium 5kg, minyak goreng 2L, sarden kaleng, kornet, teh, gula pasir, dan biskuit energi untuk konsumsi 1 keluarga selama 5 hari masa tanggap darurat.',
    priceIdr: 150000,
    icon: 'Utensils',
    category: 'food',
    itemsIncluded: ['Beras Premium 5kg', 'Minyak Goreng 2L', 'Sarden Kaleng 3x', 'Gula Pasir & Teh', 'Biskuit Protein Tinggi']
  },
  {
    id: 'pkg-medis',
    title: 'Paket P3K & Medis Higiene Darurat',
    description: 'Obat luka, kassa steril, cairan antiseptik, paracetamol, oralit anti dehidrasi, masker medis, salep antijamur/gatal, dan sabun antiseptik.',
    priceIdr: 125000,
    icon: 'HeartPulse',
    category: 'medical',
    itemsIncluded: ['Betadine & Kassa Steril', 'Paracetamol & Oralit', 'Salep Gatal & Antijamur', 'Masker Medis 20 Pcs', 'Sabun Antiseptik']
  },
  {
    id: 'pkg-bayi',
    title: 'Paket Nutrisi & Perlengkapan Bayi/Balita',
    description: 'Susu formula balita 800g, bubur bayi fortifikasi gizi, popok (diapers) 1 pack, minyak telon, pakaian hangat bayi, dan selimut lembut.',
    priceIdr: 175000,
    icon: 'Baby',
    category: 'baby',
    itemsIncluded: ['Susu Balita 800g', 'Bubur Bayi 4 Kotak', 'Diapers M/L 1 Pack', 'Minyak Telon & Bedak', 'Selimut Hangat Bayi']
  },
  {
    id: 'pkg-shelter',
    title: 'Paket Tenda & Matras Hangat Pengungsi',
    description: 'Terpal anti air tebal 4x6m, matras tidur busa pengungsian, selimut wol tebal, dan senter LED darurat solar cell untuk penerangan malam.',
    priceIdr: 250000,
    icon: 'Tent',
    category: 'shelter',
    itemsIncluded: ['Terpal Plastik Tebal 4x6m', 'Matras Busa Pengungsi', 'Selimut Wol Tebal', 'Senter LED Darurat Solar']
  },
  {
    id: 'pkg-air',
    title: 'Pasokan Tangki Air Bersih 5.000 Liter',
    description: 'Penyaluran 1 armada truk tangki air bersih 5.000 liter dari PDAM/BNPB beserta 10 jerigen lipat sanitasi darurat untuk warga di kamp pengungsian.',
    priceIdr: 450000,
    icon: 'Droplets',
    category: 'water',
    itemsIncluded: ['1 Truk Tangki Air 5.000L', '10 Jerigen Sanitasi 20L', 'Tablet Kaporit Sterilisasi Air']
  }
];

export const INITIAL_SEED_DONATIONS: DisasterDonation[] = [
  {
    id: 'don-001',
    disasterId: 'disaster-1',
    disasterTitle: 'Banjir Luapan Kali Ciliwung - Kampung Melayu & Bukit Duri',
    donorName: 'H. Ahmad Fauzi & Keluarga',
    isAnonymous: false,
    email: 'ahmad.fauzi@gmail.com',
    phone: '081288992211',
    amount: 1500000,
    type: 'cash',
    paymentMethod: 'qris',
    status: 'verified',
    prayerMessage: 'Semoga banjir lekas surut dan saudara-saudara kami di Jatinegara dan Bukit Duri diberikan ketabahan dan kesehatan.',
    referenceNumber: 'DON-20261012-0041',
    createdAt: '2026-10-12T07:30:00Z'
  },
  {
    id: 'don-002',
    disasterId: 'disaster-1',
    disasterTitle: 'Banjir Luapan Kali Ciliwung - Kampung Melayu & Bukit Duri',
    donorName: 'Hamba Allah',
    isAnonymous: true,
    email: 'anonim@donasi.id',
    phone: '085711223344',
    amount: 750000,
    type: 'package',
    packageId: 'pkg-sembako',
    packageTitle: 'Paket Sembako Keluarga Berkah (5 Paket)',
    paymentMethod: 'va_bca',
    status: 'verified',
    prayerMessage: 'Bismillah, semoga sedikit bantuan sembako ini dapat meringankan beban makan balita dan orang tua di posko pengungsian.',
    referenceNumber: 'DON-20261012-0189',
    createdAt: '2026-10-12T09:15:00Z'
  },
  {
    id: 'don-003',
    disasterId: 'disaster-2',
    disasterTitle: 'Gempa Bumi Tektonik Selat Sunda - Dampak Anyer & Labuan',
    donorName: 'dr. Sarah Wijaya, Sp.A',
    isAnonymous: false,
    email: 'sarah.wijaya@rskaryadi.org',
    phone: '081399887766',
    amount: 2500000,
    type: 'cash',
    paymentMethod: 'va_mandiri',
    status: 'verified',
    prayerMessage: 'Kuatkan hati saudara kami di Pandeglang & Banten. Tim medis relawan SIGAP luar biasa dedikasinya.',
    referenceNumber: 'DON-20261012-0312',
    createdAt: '2026-10-12T11:45:00Z'
  },
  {
    id: 'don-004',
    disasterId: 'disaster-2',
    disasterTitle: 'Gempa Bumi Tektonik Selat Sunda - Dampak Anyer & Labuan',
    donorName: 'Komunitas Gowes Peduli Sesama',
    isAnonymous: false,
    email: 'gowespeduli@gmail.com',
    phone: '081822334455',
    amount: 1000000,
    type: 'package',
    packageId: 'pkg-shelter',
    packageTitle: 'Paket Tenda & Matras Hangat Pengungsi (4 Paket)',
    paymentMethod: 'gopay',
    status: 'verified',
    prayerMessage: 'Semoga tenda dan matras cepat sampai untuk warga yang rumahnya retak terdampak gempa.',
    referenceNumber: 'DON-20261012-0544',
    createdAt: '2026-10-12T13:20:00Z'
  },
  {
    id: 'don-005',
    disasterId: 'disaster-4',
    disasterTitle: 'Kebakaran Hutan & Lahan Gambut (Karhutla) Siak & Pelalawan',
    donorName: 'PT Nusantara Hijau Abadi',
    isAnonymous: false,
    email: 'csr@nusantarahijau.co.id',
    phone: '02155443322',
    amount: 10000000,
    type: 'cash',
    paymentMethod: 'va_bni',
    status: 'verified',
    prayerMessage: 'Dukungan penuh untuk para satgas Manggala Agni dan relawan darat pemadam karhutla di Riau.',
    referenceNumber: 'DON-20261012-0899',
    createdAt: '2026-10-12T15:10:00Z'
  },
  {
    id: 'don-006',
    disasterId: 'disaster-3',
    disasterTitle: 'Kebakaran Permukiman Padat Tambora - Kalianyar',
    donorName: 'Rian Pratama',
    isAnonymous: false,
    email: 'rian.pratama@techindo.com',
    phone: '087766554433',
    amount: 500000,
    type: 'cash',
    paymentMethod: 'dana',
    status: 'verified',
    prayerMessage: 'Semoga warga Tambora diberikan ketabahan dan rumah yang terbakar segera dapat direnovasi.',
    referenceNumber: 'DON-20261013-0102',
    createdAt: '2026-10-13T08:05:00Z'
  }
];
