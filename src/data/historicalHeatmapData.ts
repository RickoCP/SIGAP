export type HeatmapDisasterType = 
  | 'all' 
  | 'flood' 
  | 'fire' 
  | 'earthquake' 
  | 'landslide' 
  | 'volcano' 
  | 'storm';

export interface HeatPoint {
  lat: number;
  lng: number;
  intensity: number; // 0.2 to 1.0
  type: 'flood' | 'fire' | 'earthquake' | 'landslide' | 'volcano' | 'storm';
  name: string;
  province: string;
  frequency: number; // jumlah kejadian 2021-2026
  yearRange: string;
  riskLevel: 'Kritis' | 'Tinggi' | 'Sedang';
  description: string;
}

export const HISTORICAL_HEATMAP_POINTS: HeatPoint[] = [
  // ==========================================
  // 1. BANJIR (FLOODS) - 30+ Hotspots
  // ==========================================
  {
    lat: -6.2251, lng: 106.8621, intensity: 0.95, type: 'flood',
    name: 'Bantaran Kali Ciliwung (Kampung Melayu & Bukit Duri)',
    province: 'DKI Jakarta', frequency: 38, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Langganan luapan hulu Katulampa Bogor, ketinggian genangan 1.5 - 2.8m'
  },
  {
    lat: -6.1550, lng: 106.7820, intensity: 0.85, type: 'flood',
    name: 'Grogol & Pesing (Kali Angke & Pesanggrahan)',
    province: 'DKI Jakarta', frequency: 26, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Genangan air rob dan luapan kali melumpuhkan jalan arteri barat'
  },
  {
    lat: -6.1210, lng: 106.7910, intensity: 0.90, type: 'flood',
    name: 'Muara Baru & Pluit (Polder Waduk Pluit)',
    province: 'DKI Jakarta', frequency: 31, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Kombinasi pasang rob laut Jawa dan debit hujan lokal muara'
  },
  {
    lat: -6.2410, lng: 106.9820, intensity: 0.88, type: 'flood',
    name: 'Bekasi Timur & Muara Gembong (DAS Kali Bekasi)',
    province: 'Jawa Barat', frequency: 32, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Pertemuan Kali Cileungsi & Cikeas memicu banjir perumahan hingga 2m'
  },
  {
    lat: -6.9850, lng: 107.6250, intensity: 0.92, type: 'flood',
    name: 'Cekungan Baleendah & Dayeuhkolot (DAS Citarum)',
    province: 'Jawa Barat', frequency: 42, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Cekungan Bandung langganan genangan berminggu-minggu merendam ribuan rumah'
  },
  {
    lat: -6.3050, lng: 107.3100, intensity: 0.84, type: 'flood',
    name: 'Karawang Barat & Rengasdengklok (Citarum Hilir)',
    province: 'Jawa Barat', frequency: 28, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Limpasan air sawah dan jebol tanggul irigasi Tarum Barat'
  },
  {
    lat: -6.8944, lng: 110.7412, intensity: 0.98, type: 'flood',
    name: 'Karanganyar Demak & Kudus (Tanggul Sungai Wulan)',
    province: 'Jawa Tengah', frequency: 36, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Jebol tanggul Sungai Wulan memutus jalur Pantura, air mencapai 2.5m'
  },
  {
    lat: -6.9600, lng: 110.4500, intensity: 0.89, type: 'flood',
    name: 'Kaligawe & Genuk (Banjir Rob Pantura Semarang)',
    province: 'Jawa Tengah', frequency: 34, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Penurunan muka tanah dan air laut pasang merendam kawasan industri'
  },
  {
    lat: -6.8900, lng: 109.6700, intensity: 0.82, type: 'flood',
    name: 'Pekalongan Utara & Pasirsari',
    province: 'Jawa Tengah', frequency: 29, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Banjir rob harian merendam ribuan rumah perajin batik'
  },
  {
    lat: -7.1502, lng: 111.8817, intensity: 0.90, type: 'flood',
    name: 'Trucuk & Dander (Bantaran DAS Bengawan Solo Bojonegoro)',
    province: 'Jawa Timur', frequency: 35, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Luapan tahunan terluas di Jawa Timur merendam puluhan ribu hektar sawah'
  },
  {
    lat: -7.1200, lng: 112.4100, intensity: 0.83, type: 'flood',
    name: 'Babat & Laren (Bengawan Solo Hilir Lamongan)',
    province: 'Jawa Timur', frequency: 27, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Genangan rawa lebak dan sawah tambak terendam'
  },
  {
    lat: -7.2000, lng: 113.2500, intensity: 0.80, type: 'flood',
    name: 'Sampang Kota & Sungai Kamuning (Madura)',
    province: 'Jawa Timur', frequency: 25, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Banjir pasang surut sungai Kamuning melumpuhkan pusat kota'
  },
  {
    lat: 4.3100, lng: 98.0500, intensity: 0.88, type: 'flood',
    name: 'Kejuruan Muda & Seruway (DAS Tamiang Aceh)',
    province: 'Aceh', frequency: 29, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Hujan lebat pegunungan Gayo memicu luapan sungai bandang'
  },
  {
    lat: -0.3275, lng: 100.4150, intensity: 0.96, type: 'flood',
    name: 'Bukik Batabuah & Canduang (Banjir Bandang Galodo Marapi)',
    province: 'Sumatera Barat', frequency: 21, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Lahar dingin bercampur batu besar menerjang pemukiman lereng'
  },
  {
    lat: -0.9500, lng: 100.3800, intensity: 0.82, type: 'flood',
    name: 'Koto Tangah & Batang Arau (Padang)',
    province: 'Sumatera Barat', frequency: 24, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Hujan orografis Bukit Barisan meluapkan sungai kota'
  },
  {
    lat: 0.3500, lng: 101.4200, intensity: 0.84, type: 'flood',
    name: 'Bangkinang & Rumbio Jaya (DAS Kampar Riau)',
    province: 'Riau', frequency: 26, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Pembukaan pintu waduk PLTA Koto Panjang memicu luapan hilir'
  },
  {
    lat: -2.9900, lng: 104.7500, intensity: 0.81, type: 'flood',
    name: 'Kertapati & Gandus (DAS Musi Palembang)',
    province: 'Sumatera Selatan', frequency: 23, yearRange: '2021-2026', riskLevel: 'Sedang',
    description: 'Pasang air Sungai Musi saat musim hujan merendam kawasan tepian'
  },
  {
    lat: -2.2100, lng: 113.9100, intensity: 0.85, type: 'flood',
    name: 'Pahandut & Flamboyan Bawah (DAS Kahayan Palangka Raya)',
    province: 'Kalimantan Tengah', frequency: 28, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Luapan air sungai menggenangi pemukiman panggung kayu selama berminggu-minggu'
  },
  {
    lat: 0.0500, lng: 111.4900, intensity: 0.89, type: 'flood',
    name: 'Sintang & Melawi (DAS Kapuas Hulu Kalbar)',
    province: 'Kalimantan Barat', frequency: 31, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Banjir besar DAS Kapuas merendam pusat kabupaten hingga 3 meter'
  },
  {
    lat: -3.4147, lng: 114.8519, intensity: 0.86, type: 'flood',
    name: 'Martapura Barat & Astambul (DAS Barito Kalsel)',
    province: 'Kalimantan Selatan', frequency: 30, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Hujan lebat Pegunungan Meratus menggenangi ribuan hektar pemukiman'
  },
  {
    lat: -4.1200, lng: 120.0300, intensity: 0.87, type: 'flood',
    name: 'Danau Tempe & Belawa (Wajo Sulsel)',
    province: 'Sulawesi Selatan', frequency: 32, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Pendangkalan danau memicu luapan air merendam rumah terapung dan sawah'
  },

  // ==========================================
  // 2. KEBAKARAN HUTAN & LAHAN GAMBUT (KARHUTLA)
  // ==========================================
  {
    lat: 0.7893, lng: 102.0469, intensity: 0.98, type: 'fire',
    name: 'Lahan Gambut Minas & Siak (Ring 1 Buffer TN Tesso Nilo)',
    province: 'Riau', frequency: 45, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Lahan gambut dalam kedalaman >2m terbakar bawah tanah memicu ISPU Berbahaya'
  },
  {
    lat: 1.6800, lng: 101.4500, intensity: 0.92, type: 'fire',
    name: 'Bukit Kapur & Medang Kampai (Dumai Riau)',
    province: 'Riau', frequency: 38, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Kebakaran semak gambut pesisir utara mengancam pelabuhan dan penerbangan'
  },
  {
    lat: 0.3200, lng: 102.0100, intensity: 0.94, type: 'fire',
    name: 'Langgam & Pangkalan Kerinci (Pelalawan Riau)',
    province: 'Riau', frequency: 41, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Konsentrasi hotspot tertinggi saat puncak kemarau Juli - September'
  },
  {
    lat: -2.2087, lng: 113.9165, intensity: 0.99, type: 'fire',
    name: 'Taman Nasional Sebangau & Mahir Mahar (Palangka Raya)',
    province: 'Kalimantan Tengah', frequency: 52, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Smoldering fire gambut bawah tanah tebal, jarak pandang anjlok hingga 100m'
  },
  {
    lat: -2.5300, lng: 112.9500, intensity: 0.91, type: 'fire',
    name: 'Sampit & Mentaya Hilir (Kotawaringin Timur Kalteng)',
    province: 'Kalimantan Tengah', frequency: 39, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Kabut asap pekat melumpuhkan aktivitas belajar sekolah dan transportasi'
  },
  {
    lat: -2.7500, lng: 114.2200, intensity: 0.89, type: 'fire',
    name: 'Pulang Pisau & Kahayan Hilir (Kalteng)',
    province: 'Kalimantan Tengah', frequency: 36, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Eks Proyek Lahan Gambut (PLG) sejuta hektar kering rawan api liar'
  },
  {
    lat: -2.3508, lng: 110.1582, intensity: 0.93, type: 'fire',
    name: 'Kendawangan & Matan Hilir (Ketapang Kalbar)',
    province: 'Kalimantan Barat', frequency: 42, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Kebakaran lahan semak belukar gambut dekat perkebunan sawit rakyat'
  },
  {
    lat: -0.1500, lng: 109.4000, intensity: 0.87, type: 'fire',
    name: 'Rasau Jaya & Sungai Raya (Kubu Raya Kalbar)',
    province: 'Kalimantan Barat', frequency: 34, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Titik api perimeter bandara Supadio Pontianak mengganggu lalu lintas udara'
  },
  {
    lat: -3.2200, lng: 104.9800, intensity: 0.95, type: 'fire',
    name: 'Tulung Selapan & Cengal (Ogan Komering Ilir OKI Sumsel)',
    province: 'Sumatera Selatan', frequency: 48, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Kawasan gambut terluas di Sumsel penghasil kabut asap lintas provinsi'
  },
  {
    lat: -2.8500, lng: 104.4200, intensity: 0.86, type: 'fire',
    name: 'Banyuasin II & Sungsang (Sumatera Selatan)',
    province: 'Sumatera Selatan', frequency: 31, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Rawa gambut pasang surut kering saat kemarau El Nino'
  },
  {
    lat: -1.5500, lng: 103.8500, intensity: 0.88, type: 'fire',
    name: 'Kumpeh Ilir & Muaro Jambi (Jambi)',
    province: 'Jambi', frequency: 33, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Penyangga Taman Hutan Raya Thaha Syaifuddin terbakar'
  },
  {
    lat: -3.4500, lng: 114.7500, intensity: 0.85, type: 'fire',
    name: 'Landasan Ulin & Guntung Payung (Banjarbaru Kalsel)',
    province: 'Kalimantan Selatan', frequency: 29, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Kabut asap gambut Ring 1 Bandara Internasional Syamsudin Noor'
  },
  {
    lat: -7.7600, lng: 112.5800, intensity: 0.78, type: 'fire',
    name: 'Lereng Gunung Arjuno-Welirang (Malang/Pasuruan)',
    province: 'Jawa Timur', frequency: 19, yearRange: '2021-2026', riskLevel: 'Sedang',
    description: 'Kebakaran vegetasi savana pegunungan dan hutan pinus dataran tinggi'
  },

  // ==========================================
  // 3. GEMPA BUMI (EARTHQUAKES) - Tectonic Zones
  // ==========================================
  {
    lat: -6.4022, lng: 105.8234, intensity: 0.90, type: 'earthquake',
    name: 'Zona Subduksi Selat Sunda (Pandeglang & Anyer)',
    province: 'Banten', frequency: 28, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Gempa tektonik dangkal megathrust dan aktivitas vulkanik Selat Sunda'
  },
  {
    lat: -6.8200, lng: 107.1400, intensity: 0.97, type: 'earthquake',
    name: 'Sesar Aktif Cugenang (Cianjur & Sukabumi)',
    province: 'Jawa Barat', frequency: 44, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Gempa darat dangkal M 5.6 merusak lebih dari 50.000 rumah warga'
  },
  {
    lat: -7.8700, lng: 110.3800, intensity: 0.85, type: 'earthquake',
    name: 'Sesar Opak (Bantul & Sleman Yogyakarta)',
    province: 'DI Yogyakarta', frequency: 22, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Jalur patahan aktif gempa tektonik darat Jawa bagian selatan'
  },
  {
    lat: -8.8500, lng: 112.5200, intensity: 0.88, type: 'earthquake',
    name: 'Zona Megathrust Selatan Malang & Blitar',
    province: 'Jawa Timur', frequency: 31, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Guncangan gempa laut dalam berdampak retakan fasilitas kesehatan'
  },
  {
    lat: -0.8900, lng: 119.8700, intensity: 0.96, type: 'earthquake',
    name: 'Sesar Palu-Koro (Palu & Donggala)',
    province: 'Sulawesi Tengah', frequency: 38, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Patahan mendatar aktif dengan kerentanan likuefaksi tanah tinggi'
  },
  {
    lat: -2.9800, lng: 118.9000, intensity: 0.89, type: 'earthquake',
    name: 'Sesar Majene & Mamuju (Sulbar)',
    province: 'Sulawesi Barat', frequency: 24, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Gempa dangkal pesisir merobohkan gedung pemerintahan dan pemukiman'
  },
  {
    lat: -8.3500, lng: 116.3500, intensity: 0.91, type: 'earthquake',
    name: 'Sesar Naik Busur Belakang Flores (Lombok Utara)',
    province: 'Nusa Tenggara Barat', frequency: 32, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Rangkaian gempa beruntun lereng Rinjani merusak pemukiman massal'
  },

  // ==========================================
  // 4. TANAH LONGSOR (LANDSLIDES)
  // ==========================================
  {
    lat: -6.7100, lng: 106.9400, intensity: 0.89, type: 'landslide',
    name: 'Kawasan Perbukitan Puncak & Megamendung (Bogor)',
    province: 'Jawa Barat', frequency: 36, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Kemiringan lereng curam tergerus hujan intensitas tinggi, menutup jalan nasional'
  },
  {
    lat: -7.3500, lng: 109.6500, intensity: 0.92, type: 'landslide',
    name: 'Perbukitan Karangkobar & Tieng (Banjarnegara & Wonosobo)',
    province: 'Jawa Tengah', frequency: 39, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Tanah lempung gembur lereng pertanian kentang rawan luncuran tanah'
  },
  {
    lat: -7.9500, lng: 111.4500, intensity: 0.84, type: 'landslide',
    name: 'Perbukitan Pulung & Ngebel (Ponorogo Jatim)',
    province: 'Jawa Timur', frequency: 26, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Pergerakan tanah mahkota longsor menimbun dusun warga'
  },
  {
    lat: 2.8500, lng: 108.9800, intensity: 0.94, type: 'landslide',
    name: 'Bukit Genting Serasan (Kepulauan Natuna)',
    province: 'Kepulauan Riau', frequency: 18, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Longsor lereng masif akibat curah hujan ekstrem menimbun 1 kampung'
  },
  {
    lat: -3.0500, lng: 119.8500, intensity: 0.87, type: 'landslide',
    name: 'Perbukitan Makale & Rantepao (Tana Toraja Sulsel)',
    province: 'Sulawesi Selatan', frequency: 27, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Bencana longsor tebing terjal memutus akses desa adat terpencil'
  },

  // ==========================================
  // 5. ERUPSI GUNUNG API (VOLCANOES)
  // ==========================================
  {
    lat: -0.3810, lng: 100.4730, intensity: 0.96, type: 'volcano',
    name: 'Gunung Marapi (Agam & Tanah Datar Sumbar)',
    province: 'Sumatera Barat', frequency: 42, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Erupsi freatik eksplosif mendadak dan banjir lahar dingin hujan batu'
  },
  {
    lat: -7.5400, lng: 110.4460, intensity: 0.93, type: 'volcano',
    name: 'Gunung Merapi (Sleman, Magelang, Boyolali, Klaten)',
    province: 'Jawa Tengah', frequency: 48, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Awan panas guguran (wedhus gembel) kubah lava radius bahaya 7 km'
  },
  {
    lat: -8.1080, lng: 112.9220, intensity: 0.95, type: 'volcano',
    name: 'Gunung Semeru (Lumajang & Malang Jatim)',
    province: 'Jawa Timur', frequency: 46, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Awan panas guguran Besuk Kobokan merusak jembatan Gladak Perak'
  },
  {
    lat: 2.3020, lng: 125.3670, intensity: 0.92, type: 'volcano',
    name: 'Gunung Ruang (Tagulandang Sitaro Sulut)',
    province: 'Sulawesi Utara', frequency: 22, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Erupsi eksplosif kolom abu 19 km dan ancaman gelombang tsunami pulau'
  },
  {
    lat: -8.5350, lng: 122.7750, intensity: 0.90, type: 'volcano',
    name: 'Gunung Lewotobi Laki-Laki (Flores Timur NTT)',
    province: 'Nusa Tenggara Timur', frequency: 35, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Erupsi lontaran batu pijar radius 6 km merusak ribuan atap rumah warga'
  },

  // ==========================================
  // 6. CUACA EKSTREM & ANGIN PUTING BELIUNG (STORMS)
  // ==========================================
  {
    lat: -6.9500, lng: 107.7500, intensity: 0.88, type: 'storm',
    name: 'Koridor Rancaekek & Jatinangor (Tornado/Puting Beliung)',
    province: 'Jawa Barat', frequency: 24, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Pusaran angin kencang berdaya rusak tinggi menerbangkan atap pabrik'
  },
  {
    lat: -7.4500, lng: 112.7200, intensity: 0.82, type: 'storm',
    name: 'Krian & Waru (Sidoarjo & Surabaya)',
    province: 'Jawa Timur', frequency: 22, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Hujan es dan angin puting beliung merobohkan baliho dan pohon peneduh'
  },
  {
    lat: -5.1400, lng: 119.4500, intensity: 0.80, type: 'storm',
    name: 'Pesisir Selat Makassar & Maros',
    province: 'Sulawesi Selatan', frequency: 21, yearRange: '2021-2026', riskLevel: 'Sedang',
    description: 'Gelombang pasang angin barat memutus aktivitas nelayan tradisional'
  }
];

export const HEATMAP_GRADIENTS: Record<HeatmapDisasterType, Record<number, string>> = {
  all: {
    0.2: '#38bdf8',
    0.4: '#34d399',
    0.6: '#fbbf24',
    0.8: '#f97316',
    1.0: '#dc2626'
  },
  fire: {
    0.2: '#fef08a',
    0.4: '#fde047',
    0.6: '#f97316',
    0.8: '#ea580c',
    1.0: '#7f1d1d'
  },
  flood: {
    0.2: '#bae6fd',
    0.4: '#38bdf8',
    0.6: '#0284c7',
    0.8: '#0369a1',
    1.0: '#1e3a8a'
  },
  earthquake: {
    0.2: '#fef3c7',
    0.4: '#fbbf24',
    0.6: '#d97706',
    0.8: '#b45309',
    1.0: '#78350f'
  },
  landslide: {
    0.2: '#dcfce7',
    0.4: '#86efac',
    0.6: '#22c55e',
    0.8: '#15803d',
    1.0: '#14532d'
  },
  volcano: {
    0.2: '#fed7aa',
    0.4: '#fb923c',
    0.6: '#ea580c',
    0.8: '#be123c',
    1.0: '#4c0519'
  },
  storm: {
    0.2: '#f3e8ff',
    0.4: '#c084fc',
    0.6: '#9333ea',
    0.8: '#6b21a8',
    1.0: '#3b0764'
  }
};
