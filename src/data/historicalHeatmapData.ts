export type HeatmapDisasterType = 'all' | 'flood' | 'fire' | 'earthquake' | 'landslide' | 'volcano' | 'storm';

export interface HeatPoint {
  lat: number;
  lng: number;
  intensity: number; // 0.2 to 1.0
  type: 'flood' | 'fire' | 'earthquake' | 'landslide' | 'volcano' | 'storm';
  name: string;
  nameEn?: string;
  province: string;
  frequency: number; // jumlah kejadian 2021-2026
  yearRange: string;
  riskLevel: 'Kritis' | 'Tinggi' | 'Sedang';
  description: string;
  descriptionEn?: string;
}

export const HISTORICAL_HEATMAP_POINTS: HeatPoint[] = [
  // ==========================================
  // 1. BANJIR (FLOODS) - 20 Hotspots
  // ==========================================
  {
    lat: -6.2251, lng: 106.8621, intensity: 0.95, type: 'flood',
    name: 'Bantaran Kali Ciliwung (Kampung Melayu & Bukit Duri)',
    nameEn: 'Ciliwung River Basin (Kampung Melayu & Bukit Duri)',
    province: 'DKI Jakarta', frequency: 38, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Langganan luapan hulu Katulampa Bogor, ketinggian genangan 1.5 - 2.8m',
    descriptionEn: 'Chronic overflows from Katulampa weir in Bogor, floodwaters reach 1.5 - 2.8m'
  },
  {
    lat: -6.1550, lng: 106.7820, intensity: 0.85, type: 'flood',
    name: 'Grogol & Pesing (Kali Angke & Pesanggrahan)',
    nameEn: 'Grogol & Pesing (Angke & Pesanggrahan Rivers)',
    province: 'DKI Jakarta', frequency: 26, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Genangan air rob dan luapan kali melumpuhkan jalan arteri barat',
    descriptionEn: 'Tidal surge combined with river flooding paralyzes western arterial roadways'
  },
  {
    lat: -6.1210, lng: 106.7910, intensity: 0.90, type: 'flood',
    name: 'Muara Baru & Pluit (Polder Waduk Pluit)',
    nameEn: 'Muara Baru & Pluit (Pluit Reservoir Polder)',
    province: 'DKI Jakarta', frequency: 31, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Kombinasi pasang rob laut Jawa dan debit hujan lokal muara',
    descriptionEn: 'Combination of Java Sea tidal surge and heavy local estuarine runoff'
  },
  {
    lat: -6.2410, lng: 106.9820, intensity: 0.88, type: 'flood',
    name: 'Bekasi Timur & Muara Gembong (DAS Kali Bekasi)',
    nameEn: 'East Bekasi & Muara Gembong (Kali Bekasi Watershed)',
    province: 'Jawa Barat', frequency: 32, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Pertemuan Kali Cileungsi & Cikeas memicu banjir perumahan hingga 2m',
    descriptionEn: 'Confluence of Cileungsi & Cikeas rivers triggers residential flooding up to 2m'
  },
  {
    lat: -6.9850, lng: 107.6250, intensity: 0.92, type: 'flood',
    name: 'Cekungan Baleendah & Dayeuhkolot (DAS Citarum)',
    nameEn: 'Baleendah & Dayeuhkolot Basin (Citarum River Basin)',
    province: 'Jawa Barat', frequency: 42, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Cekungan Bandung langganan genangan berminggu-minggu merendam ribuan rumah',
    descriptionEn: 'Bandung tectonic basin experiences weeks-long inundation affecting thousands of households'
  },
  {
    lat: -6.3050, lng: 107.3100, intensity: 0.84, type: 'flood',
    name: 'Karawang Barat & Rengasdengklok (Citarum Hilir)',
    nameEn: 'West Karawang & Rengasdengklok (Lower Citarum)',
    province: 'Jawa Barat', frequency: 28, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Limpasan air sawah dan jebol tanggul irigasi Tarum Barat',
    descriptionEn: 'Paddy field agricultural overflow and Tarum Barat irrigation embankment breaches'
  },
  {
    lat: -6.8944, lng: 110.7412, intensity: 0.98, type: 'flood',
    name: 'Karanganyar Demak & Kudus (Tanggul Sungai Wulan)',
    nameEn: 'Karanganyar Demak & Kudus (Wulan River Levee)',
    province: 'Jawa Tengah', frequency: 36, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Jebol tanggul Sungai Wulan memutus jalur Pantura, air mencapai 2.5m',
    descriptionEn: 'Wulan River levee breach cuts off the northern coastal arterial highway (Pantura) with 2.5m deep waters'
  },
  {
    lat: -6.9600, lng: 110.4500, intensity: 0.94, type: 'flood',
    name: 'Kaligawe & Genuk (Banjir Rob Pantura Semarang)',
    nameEn: 'Kaligawe & Genuk (Semarang Coastal Tidal Flood)',
    province: 'Jawa Tengah', frequency: 45, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Penurunan muka tanah (land subsidence) dan pasang rob ekstrem harian',
    descriptionEn: 'Severe land subsidence paired with daily extreme astronomical tidal flooding'
  },
  {
    lat: -6.8850, lng: 109.6700, intensity: 0.86, type: 'flood',
    name: 'Pekalongan Utara & Pasirsari',
    nameEn: 'North Pekalongan & Pasirsari',
    province: 'Jawa Tengah', frequency: 34, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Rob permanen merendam sentra industri batik dan pemukiman pesisir',
    descriptionEn: 'Permanent tidal inundation submerging traditional batik textile centers and coastal villages'
  },
  {
    lat: -7.1500, lng: 111.8800, intensity: 0.90, type: 'flood',
    name: 'Trucuk & Dander (Bantaran DAS Bengawan Solo Bojonegoro)',
    nameEn: 'Trucuk & Dander (Bengawan Solo River Basin Bojonegoro)',
    province: 'Jawa Timur', frequency: 29, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Limpasan Bengawan Solo Siaga Merah menggenangi puluhan desa bantaran',
    descriptionEn: 'Red Alert overflow of Bengawan Solo river flooding dozens of riverside agrarian villages'
  },
  {
    lat: -7.1200, lng: 112.3000, intensity: 0.85, type: 'flood',
    name: 'Babat & Laren (Bengawan Solo Hilir Lamongan)',
    nameEn: 'Babat & Laren (Lower Bengawan Solo Lamongan)',
    province: 'Jawa Timur', frequency: 27, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Kawasan rawa banjir jeroan tergenang hingga 2 bulan pasca puncak musim hujan',
    descriptionEn: 'Inland swamp overflow zone remaining submerged for up to 2 months post monsoon peak'
  },
  {
    lat: -7.1850, lng: 113.2450, intensity: 0.88, type: 'flood',
    name: 'Sampang Kota & Sungai Kamuning (Madura)',
    nameEn: 'Sampang City & Kamuning River (Madura Island)',
    province: 'Jawa Timur', frequency: 25, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Pertemuan air pasang laut Selat Madura dan kiriman air dari perbukitan utara',
    descriptionEn: 'Confluence of high Madura Strait sea tides and heavy northern hill runoff'
  },
  {
    lat: 4.3120, lng: 98.0500, intensity: 0.89, type: 'flood',
    name: 'Kejuruan Muda & Seruway (DAS Tamiang Aceh)',
    nameEn: 'Kejuruan Muda & Seruway (Tamiang River Basin Aceh)',
    province: 'Aceh', frequency: 23, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Erosi hulu pegunungan Leuser memicu banjir bandang lumpur dan potongan kayu',
    descriptionEn: 'Deforested upstream Leuser erosion causing heavy flash mud floods with timber debris'
  },
  {
    lat: -0.3200, lng: 100.4100, intensity: 0.96, type: 'flood',
    name: 'Bukik Batabuah & Canduang (Banjir Bandang Galodo Marapi)',
    nameEn: 'Bukik Batabuah & Canduang (Marapi Galodo Cold Lahar Flood)',
    province: 'Sumatera Barat', frequency: 18, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Banjir lahar dingin material vulkanik Gunung Marapi menyapu pemukiman warga',
    descriptionEn: 'Catastrophic cold volcanic lahar torrent from Mount Marapi sweeping valley settlements'
  },
  {
    lat: -0.9200, lng: 100.3600, intensity: 0.84, type: 'flood',
    name: 'Koto Tangah & Batang Arau (Padang)',
    nameEn: 'Koto Tangah & Batang Arau (Padang)',
    province: 'Sumatera Barat', frequency: 22, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Hujan badai orografis Samudra Hindia memicu luapan sungai primer kota Padang',
    descriptionEn: 'Orographic Indian Ocean storm rainstorms causing primary urban river overflows across Padang'
  },
  {
    lat: 0.3300, lng: 101.0300, intensity: 0.87, type: 'flood',
    name: 'Bangkinang & Rumbio Jaya (DAS Kampar Riau)',
    nameEn: 'Bangkinang & Rumbio Jaya (Kampar River Basin Riau)',
    province: 'Riau', frequency: 26, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Pembukaan spillway pintu Waduk PLTA Koto Panjang membanjiri bantaran hilir',
    descriptionEn: 'Emergency spillway releases from Koto Panjang Hydroelectric Dam flooding downstream floodplains'
  },
  {
    lat: -2.9900, lng: 104.7500, intensity: 0.83, type: 'flood',
    name: 'Kertapati & Gandus (DAS Musi Palembang)',
    nameEn: 'Kertapati & Gandus (Musi River Basin Palembang)',
    province: 'Sumatera Selatan', frequency: 24, yearRange: '2021-2026', riskLevel: 'Sedang',
    description: 'Pasang air Sungai Musi saat puncak penghujan merendam pemukiman panggung',
    descriptionEn: 'Musi River tidal surge during monsoon rainfall peaks inundating traditional stilt neighborhoods'
  },
  {
    lat: -2.2200, lng: 113.9100, intensity: 0.91, type: 'flood',
    name: 'Pahandut & Flamboyan Bawah (DAS Kahayan Palangka Raya)',
    nameEn: 'Pahandut & Lower Flamboyan (Kahayan River Basin Palangka Raya)',
    province: 'Kalimantan Tengah', frequency: 31, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Banjir luapan gambut menggenangi pemukiman bantaran selama berminggu-minggu',
    descriptionEn: 'Prolonged peatland basin overflow keeping riparian settlements submerged for multiple weeks'
  },
  {
    lat: 0.0500, lng: 111.4900, intensity: 0.93, type: 'flood',
    name: 'Sintang & Melawi (DAS Kapuas Hulu Kalbar)',
    nameEn: 'Sintang & Melawi (Upper Kapuas Basin West Kalimantan)',
    province: 'Kalimantan Barat', frequency: 33, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Banjir besar Kapuas-Melawi melumpuhkan perekonomian wilayah hulu Kalimantan Barat',
    descriptionEn: 'Major Kapuas-Melawi river inundation completely paralyzing upstream West Kalimantan commercial hubs'
  },
  {
    lat: -3.4100, lng: 114.8500, intensity: 0.89, type: 'flood',
    name: 'Martapura Barat & Astambul (DAS Barito Kalsel)',
    nameEn: 'West Martapura & Astambul (Barito River Basin South Kalimantan)',
    province: 'Kalimantan Selatan', frequency: 28, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Alih fungsi lahan hulu Meratus memicu luapan Sungai Martapura merendam ribuan rumah',
    descriptionEn: 'Upstream Meratus land-use shifts triggering catastrophic Martapura River overflow into thousands of homes'
  },
  {
    lat: -4.1200, lng: 120.0300, intensity: 0.86, type: 'flood',
    name: 'Danau Tempe & Belawa (Wajo Sulsel)',
    nameEn: 'Lake Tempe & Belawa (Wajo South Sulawesi)',
    province: 'Sulawesi Selatan', frequency: 25, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Pendangkalan danau memicu luapan musiman merendam ribuan hektar sawah produktif',
    descriptionEn: 'Sedimentary lake shallowing triggering seasonal overflows that flood thousands of productive hectares'
  },

  // ==========================================
  // 2. KEBAKARAN HUTAN & LAHAN (KARHUTLA) - 12 Hotspots
  // ==========================================
  {
    lat: 0.7800, lng: 101.4500, intensity: 0.95, type: 'fire',
    name: 'Lahan Gambut Minas & Siak (Ring 1 Buffer TN Tesso Nilo)',
    nameEn: 'Minas & Siak Peatlands (Ring 1 Tesso Nilo Buffer)',
    province: 'Riau', frequency: 48, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Gambut dalam mengering saat El Nino, api bawah tanah sulit dipadamkan',
    descriptionEn: 'Deep peat drying during El Niño droughts; subterranean fires are resistant to surface suppression'
  },
  {
    lat: 1.6700, lng: 101.4400, intensity: 0.91, type: 'fire',
    name: 'Bukit Kapur & Medang Kampai (Dumai Riau)',
    nameEn: 'Bukit Kapur & Medang Kampai (Dumai Riau)',
    province: 'Riau', frequency: 39, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Titik panas berulang dengan asap pekat mengganggu jalur penerbangan dan kesehatan',
    descriptionEn: 'Recurrent wildfire hotspots producing dense smoke plumes disrupting aviation corridors and health'
  },
  {
    lat: 0.3900, lng: 101.8500, intensity: 0.88, type: 'fire',
    name: 'Langgam & Pangkalan Kerinci (Pelalawan Riau)',
    nameEn: 'Langgam & Pangkalan Kerinci (Pelalawan Riau)',
    province: 'Riau', frequency: 37, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Kawasan konsesi perkebunan gambut rentan terbakar pada musim kemarau',
    descriptionEn: 'Peatland plantation concessions highly susceptible to dry-season wildfire outbreaks'
  },
  {
    lat: -2.3100, lng: 113.8800, intensity: 0.97, type: 'fire',
    name: 'Taman Nasional Sebangau & Mahir Mahar (Palangka Raya)',
    nameEn: 'Sebangau National Park & Mahir Mahar (Palangka Raya)',
    province: 'Kalimantan Tengah', frequency: 54, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Episentrum kabut asap Kalimantan Tengah, kedalaman gambut mencapai 5 meter',
    descriptionEn: 'Epicenter of Central Kalimantan toxic smog; peat depth reaches up to 5 meters'
  },
  {
    lat: -2.5300, lng: 112.9500, intensity: 0.92, type: 'fire',
    name: 'Sampit & Mentaya Hilir (Kotawaringin Timur Kalteng)',
    nameEn: 'Sampit & Lower Mentaya (East Kotawaringin Central Kalimantan)',
    province: 'Kalimantan Tengah', frequency: 44, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Kabut asap pekat menurunkan jarak pandang hingga di bawah 50 meter',
    descriptionEn: 'Heavy smog plumes reducing surface navigation visibility below 50 meters'
  },
  {
    lat: -3.0200, lng: 114.1500, intensity: 0.89, type: 'fire',
    name: 'Pulang Pisau & Kahayan Hilir (Kalteng)',
    nameEn: 'Pulang Pisau & Lower Kahayan (Central Kalimantan)',
    province: 'Kalimantan Tengah', frequency: 41, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Eks Proyek Lahan Gambut (PLG) sejuta hektar dengan kanal drainase terbengkalai',
    descriptionEn: 'Former Mega Rice Peat Project with abandoned dry drainage canals fueling fires'
  },
  {
    lat: -2.4800, lng: 110.3500, intensity: 0.87, type: 'fire',
    name: 'Kendawangan & Matan Hilir (Ketapang Kalbar)',
    nameEn: 'Kendawangan & Lower Matan (Ketapang West Kalimantan)',
    province: 'Kalimantan Barat', frequency: 36, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Kebakaran belukar rawa gambut pesisir dekat cagar alam',
    descriptionEn: 'Coastal peat swamp brushfires adjacent to wildlife nature reserves'
  },
  {
    lat: -0.1500, lng: 109.4200, intensity: 0.84, type: 'fire',
    name: 'Rasau Jaya & Sungai Raya (Kubu Raya Kalbar)',
    nameEn: 'Rasau Jaya & Sungai Raya (Kubu Raya West Kalimantan)',
    province: 'Kalimantan Barat', frequency: 32, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Asap kebakaran melintasi dan mengancam operasional Bandara Supadio Pontianak',
    descriptionEn: 'Smoke plumes crossing and threatening flight operations at Pontianak Supadio Airport'
  },
  {
    lat: -3.5500, lng: 105.1200, intensity: 0.94, type: 'fire',
    name: 'Tulung Selapan & Cengal (Ogan Komering Ilir OKI Sumsel)',
    nameEn: 'Tulung Selapan & Cengal (OKI South Sumatra)',
    province: 'Sumatera Selatan', frequency: 51, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Penyumbang kabut asap lintas batas (transboundary haze) terbesar di pesisir timur',
    descriptionEn: 'Largest regional contributor of transboundary haze plumes along the southeastern coast'
  },
  {
    lat: -2.6200, lng: 104.8500, intensity: 0.86, type: 'fire',
    name: 'Banyuasin II & Sungsang (Sumatera Selatan)',
    nameEn: 'Banyuasin II & Sungsang (South Sumatra)',
    province: 'Sumatera Selatan', frequency: 33, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Kebakaran semak belukar rawa pasang surut dekat Taman Nasional Berbak-Sembilang',
    descriptionEn: 'Tidal marsh brushfires adjacent to Berbak-Sembilang National Park biodiversity corridors'
  },
  {
    lat: -1.5500, lng: 103.8500, intensity: 0.88, type: 'fire',
    name: 'Kumpeh Ilir & Muaro Jambi (Jambi)',
    nameEn: 'Kumpeh Ilir & Muaro Jambi (Jambi)',
    province: 'Jambi', frequency: 38, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Gambut terdegradasi terbakar dekat cagar budaya Candi Muaro Jambi',
    descriptionEn: 'Degraded dry peatland blazes near historical Muaro Jambi temple compound'
  },
  {
    lat: -3.4500, lng: 114.7500, intensity: 0.85, type: 'fire',
    name: 'Landasan Ulin & Guntung Payung (Banjarbaru Kalsel)',
    nameEn: 'Landasan Ulin & Guntung Payung (Banjarbaru South Kalimantan)',
    province: 'Kalimantan Selatan', frequency: 35, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Kebakaran lahan gambut dekat Bandara Internasional Syamsudin Noor',
    descriptionEn: 'Peat fires directly threatening operations around Syamsudin Noor International Airport'
  },
  {
    lat: -7.7600, lng: 112.5800, intensity: 0.83, type: 'fire',
    name: 'Lereng Gunung Arjuno-Welirang (Malang/Pasuruan)',
    nameEn: 'Arjuno-Welirang Mountain Slopes (Malang/Pasuruan)',
    province: 'Jawa Timur', frequency: 19, yearRange: '2021-2026', riskLevel: 'Sedang',
    description: 'Kebakaran hutan savana pegunungan dan semak belukar lereng terjal',
    descriptionEn: 'Mountain savanna wildfires and steep slope brushfires challenging aerial water-bombing'
  },

  // ==========================================
  // 3. GEMPA BUMI & TEKTONIK (EARTHQUAKES) - 7 Hotspots
  // ==========================================
  {
    lat: -6.8200, lng: 105.5500, intensity: 0.95, type: 'earthquake',
    name: 'Zona Subduksi Selat Sunda (Pandeglang & Anyer)',
    nameEn: 'Sunda Strait Subduction Zone (Pandeglang & Anyer)',
    province: 'Banten', frequency: 46, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Aktivitas seismik tektonik megathrust dan potensi tsunami Selat Sunda',
    descriptionEn: 'Megathrust tectonic seismic activity and potential tsunami hazard in Sunda Strait'
  },
  {
    lat: -6.8300, lng: 107.0900, intensity: 0.98, type: 'earthquake',
    name: 'Sesar Aktif Cugenang (Cianjur & Sukabumi)',
    nameEn: 'Cugenang Active Fault (Cianjur & Sukabumi)',
    province: 'Jawa Barat', frequency: 52, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Sesar aktif darat dangkal pemicu gempa M5.6 2022 dengan kerusakan masif pemukiman',
    descriptionEn: 'Shallow crustal active fault source of devastating 2022 M5.6 earthquake causing mass devastation'
  },
  {
    lat: -7.9500, lng: 110.3800, intensity: 0.90, type: 'earthquake',
    name: 'Sesar Opak (Bantul & Sleman Yogyakarta)',
    nameEn: 'Opak Fault (Bantul & Sleman Yogyakarta)',
    province: 'DI Yogyakarta', frequency: 31, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Jalur sesar darat aktif membelah Yogyakarta dengan amplifikasi tanah lunak tebal',
    descriptionEn: 'Active inland strike-slip fault traversing Yogyakarta with thick volcanic alluvium ground amplification'
  },
  {
    lat: -8.6500, lng: 112.5500, intensity: 0.87, type: 'earthquake',
    name: 'Zona Megathrust Selatan Malang & Blitar',
    nameEn: 'Southern Malang & Blitar Megathrust Zone',
    province: 'Jawa Timur', frequency: 38, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Gempa intralempeng dan subduksi lempeng Indo-Australia terhadap Eurasia',
    descriptionEn: 'Intraplate and megathrust interface earthquakes between Indo-Australian and Eurasian plates'
  },
  {
    lat: -0.8900, lng: 119.8700, intensity: 0.96, type: 'earthquake',
    name: 'Sesar Palu-Koro (Palu & Donggala)',
    nameEn: 'Palu-Koro Fault (Palu & Donggala)',
    province: 'Sulawesi Tengah', frequency: 44, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Sesar geser aktif berkecapatan pergeseran tinggi (35mm/thn), rawan likuefaksi tanah',
    descriptionEn: 'High slip-rate active strike-slip fault (35mm/yr) with extreme soil liquefaction susceptibility'
  },
  {
    lat: -3.0200, lng: 118.8900, intensity: 0.91, type: 'earthquake',
    name: 'Sesar Majene & Mamuju (Sulbar)',
    nameEn: 'Majene & Mamuju Fault (West Sulawesi)',
    province: 'Sulawesi Barat', frequency: 29, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Sesar naik Mamuju pemicu gempa merusak M6.2 2021 yang merobohkan fasilitas umum',
    descriptionEn: 'Mamuju thrust fault responsible for 2021 M6.2 destructive earthquake wrecking critical civic infra'
  },
  {
    lat: -8.3200, lng: 116.2200, intensity: 0.93, type: 'earthquake',
    name: 'Sesar Naik Busur Belakang Flores (Lombok Utara)',
    nameEn: 'Flores Back-Arc Thrust (North Lombok)',
    province: 'Nusa Tenggara Barat', frequency: 35, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Rangkaian gempa beruntun Flores Thrust meruntuhkan puluhan ribu rumah di lereng Rinjani',
    descriptionEn: 'Flores back-arc thrust earthquake swarm collapsing tens of thousands of homes on Mount Rinjani foothills'
  },

  // ==========================================
  // 4. TANAH LONGSOR (LANDSLIDES) - 5 Hotspots
  // ==========================================
  {
    lat: -6.6900, lng: 106.9400, intensity: 0.93, type: 'landslide',
    name: 'Kawasan Perbukitan Puncak & Megamendung (Bogor)',
    nameEn: 'Puncak & Megamendung Foothills (Bogor)',
    province: 'Jawa Barat', frequency: 37, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Lereng terjal dengan alih fungsi lahan dan curah hujan tinggi ekstrem',
    descriptionEn: 'Steep montane topography with rampant deforestation and intense orographic precipitation'
  },
  {
    lat: -7.2800, lng: 109.7300, intensity: 0.92, type: 'landslide',
    name: 'Perbukitan Karangkobar & Tieng (Banjarnegara & Wonosobo)',
    nameEn: 'Karangkobar & Tieng Foothills (Banjarnegara & Wonosobo)',
    province: 'Jawa Tengah', frequency: 34, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Struktur tanah lempung lapuk pada lereng vulkanik labil berlereng di atas 45 derajat',
    descriptionEn: 'Weathered clay soil horizons on unstable volcanic slopes exceeding 45 degrees inclination'
  },
  {
    lat: -7.8800, lng: 111.6500, intensity: 0.88, type: 'landslide',
    name: 'Perbukitan Pulung & Ngebel (Ponorogo Jatim)',
    nameEn: 'Pulung & Ngebel Foothills (Ponorogo East Java)',
    province: 'Jawa Timur', frequency: 23, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Retakan tanah mahkota longsor aktif di perbukitan lereng Gunung Wilis',
    descriptionEn: 'Active tension crack scarps along Mount Wilis foothill slopes threatening farming communities'
  },
  {
    lat: 2.5100, lng: 109.0200, intensity: 0.90, type: 'landslide',
    name: 'Bukit Genting Serasan (Kepulauan Natuna)',
    nameEn: 'Genting Serasan Hill (Natuna Islands)',
    province: 'Kepulauan Riau', frequency: 15, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Longsor masif pulau terluar dipicu hujan monsun ekstrem tanpa henti berhari-hari',
    descriptionEn: 'Catastrophic outer-island debris flow triggered by days of relentless extreme monsoon rainfall'
  },
  {
    lat: -3.0500, lng: 119.8500, intensity: 0.89, type: 'landslide',
    name: 'Perbukitan Makale & Rantepao (Tana Toraja Sulsel)',
    nameEn: 'Makale & Rantepao Foothills (Tana Toraja South Sulawesi)',
    province: 'Sulawesi Selatan', frequency: 26, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Guguran tebing batu dan lumpur menimbun pemukiman adat di lembah pegunungan',
    descriptionEn: 'Rockfall avalanches and mudslides burying traditional highland community settlements'
  },

  // ==========================================
  // 5. ERUPSI GUNUNG API (VOLCANOES) - 5 Hotspots
  // ==========================================
  {
    lat: -0.3800, lng: 100.4700, intensity: 0.97, type: 'volcano',
    name: 'Gunung Marapi (Agam & Tanah Datar Sumbar)',
    nameEn: 'Mount Marapi (Agam & Tanah Datar West Sumatra)',
    province: 'Sumatera Barat', frequency: 48, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Erupsi freatik & magmatik eksplosif dengan lontaran batu pijar serta hujan abu lebat',
    descriptionEn: 'Explosive phreatic and magmatic eruptions ejecting incandescent volcanic bombs and dense ashfall'
  },
  {
    lat: -7.5400, lng: 110.4400, intensity: 0.95, type: 'volcano',
    name: 'Gunung Merapi (Sleman, Magelang, Boyolali, Klaten)',
    nameEn: 'Mount Merapi (Sleman, Magelang, Boyolali, Klaten)',
    province: 'DI Yogyakarta', frequency: 56, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Awan panas guguran (wedhus gembel) dan pertumbuhan kubah lava aktif di puncak',
    descriptionEn: 'Lethal pyroclastic density currents (wedhus gembel) and active lava dome extrusion'
  },
  {
    lat: -8.1080, lng: 112.9220, intensity: 0.96, type: 'volcano',
    name: 'Gunung Semeru (Lumajang & Malang Jatim)',
    nameEn: 'Mount Semeru (Lumajang & Malang East Java)',
    province: 'Jawa Timur', frequency: 62, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Luncuran awan panas melintasi Besuk Kobokan mencapai jarak hingga 13 kilometer',
    descriptionEn: 'Pyroclastic density currents down Besuk Kobokan reaching distances up to 13 kilometers'
  },
  {
    lat: 2.3000, lng: 125.3700, intensity: 0.98, type: 'volcano',
    name: 'Gunung Ruang (Tagulandang Sitaro Sulut)',
    nameEn: 'Mount Ruang (Tagulandang Sitaro North Sulawesi)',
    province: 'Sulawesi Utara', frequency: 22, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Erupsi paroksismal memicu potensi tsunami runtuhan material ke laut dan evakuasi pulau',
    descriptionEn: 'Paroxysmal eruption triggering marine flank-collapse tsunami risks and full island evacuation'
  },
  {
    lat: -8.5300, lng: 122.7700, intensity: 0.94, type: 'volcano',
    name: 'Gunung Lewotobi Laki-Laki (Flores Timur NTT)',
    nameEn: 'Mount Lewotobi Laki-Laki (East Flores NTT)',
    province: 'Nusa Tenggara Timur', frequency: 39, yearRange: '2021-2026', riskLevel: 'Kritis',
    description: 'Lontaran material pijar membakar pemukiman warga di radius 7 kilometer dari kawah',
    descriptionEn: 'Incandescent volcanic ejecta burning settlements within 7 km hazard radius of the vent'
  },

  // ==========================================
  // 6. CUACA EKSTREM & ANGIN PUTING BELIUNG (STORMS) - 3 Hotspots
  // ==========================================
  {
    lat: -6.9500, lng: 107.7500, intensity: 0.88, type: 'storm',
    name: 'Koridor Rancaekek & Jatinangor (Tornado/Puting Beliung)',
    nameEn: 'Rancaekek & Jatinangor Corridor (Tornado / Microburst)',
    province: 'Jawa Barat', frequency: 24, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Pusaran angin kencang berdaya rusak tinggi menerbangkan atap pabrik',
    descriptionEn: 'Violent high-energy vortex winds peeling off industrial roofs and overturning vehicles'
  },
  {
    lat: -7.4500, lng: 112.7200, intensity: 0.82, type: 'storm',
    name: 'Krian & Waru (Sidoarjo & Surabaya)',
    nameEn: 'Krian & Waru (Sidoarjo & Surabaya)',
    province: 'Jawa Timur', frequency: 22, yearRange: '2021-2026', riskLevel: 'Tinggi',
    description: 'Hujan es dan angin puting beliung merobohkan baliho dan pohon peneduh',
    descriptionEn: 'Severe hailstorm and rotating wind gusts toppling commercial billboards and roadside trees'
  },
  {
    lat: -5.1400, lng: 119.4500, intensity: 0.80, type: 'storm',
    name: 'Pesisir Selat Makassar & Maros',
    nameEn: 'Makassar Strait Coastal Belt & Maros',
    province: 'Sulawesi Selatan', frequency: 21, yearRange: '2021-2026', riskLevel: 'Sedang',
    description: 'Gelombang pasang angin barat memutus aktivitas nelayan tradisional',
    descriptionEn: 'Western monsoon storm surges halting artisanal small-craft fishing operations'
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
