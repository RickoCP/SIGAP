import { Skill, Volunteer, Disaster, Task, Assignment, BMKGAlert } from '../types/index.ts';

export const SEED_SKILLS: Skill[] = [
  // Medical
  { 
    id: 'skill-med-1', 
    name: 'Dokter Umum & Darurat', 
    nameEn: 'General & Emergency Physician',
    category: 'medical', 
    description: 'Triase medis darurat dan penanganan trauma akut',
    descriptionEn: 'Emergency medical triage and acute trauma stabilization'
  },
  { 
    id: 'skill-med-2', 
    name: 'Perawat Gawat Darurat', 
    nameEn: 'Emergency & Trauma Nurse',
    category: 'medical', 
    description: 'Perawatan luka, infus, dan pendampingan medis kritis',
    descriptionEn: 'Wound care, IV fluid infusion, and critical patient stabilization'
  },
  { 
    id: 'skill-med-3', 
    name: 'Paramedis Lapangan', 
    nameEn: 'Field Paramedic & EMT',
    category: 'medical', 
    description: 'Ambulans, resusitasi, dan evakuasi korban terluka',
    descriptionEn: 'Ambulance operation, field CPR, and injured victim extrication'
  },
  { 
    id: 'skill-med-4', 
    name: 'First Aid / P3K Sertifikasi', 
    nameEn: 'Certified First Aid Responder',
    category: 'medical', 
    description: 'Pertolongan pertama pada kecelakaan dan balut bidai',
    descriptionEn: 'Basic first aid, splinting fractures, and hemorrhage control'
  },
  
  // SAR
  { 
    id: 'skill-sar-1', 
    name: 'Tim SAR Water Rescue', 
    nameEn: 'Water Rescue SAR Specialist',
    category: 'sar', 
    description: 'Evakuasi air deras, perahu karet LCR, dan penyelamatan banjir',
    descriptionEn: 'Swiftwater evacuation, inflatable boat (LCR) handling, and flood rescue'
  },
  { 
    id: 'skill-sar-2', 
    name: 'Penyelam Evakuasi', 
    nameEn: 'Emergency Rescue Diver',
    category: 'sar', 
    description: 'Penyelaman darurat dan pencarian bawah air',
    descriptionEn: 'Zero-visibility search, submerged vehicle extrication, and underwater recovery'
  },
  { 
    id: 'skill-sar-3', 
    name: 'Vertical Rescue / Panjat Tebing', 
    nameEn: 'High-Angle / Vertical Rope Rescue',
    category: 'sar', 
    description: 'Evakuasi tebing terjal dan gedung tinggi runtuh',
    descriptionEn: 'Steep cliff rappelling, elevated hoist systems, and high-rise structural rope access'
  },
  { 
    id: 'skill-sar-4', 
    name: 'Urban Search and Rescue (USAR)', 
    nameEn: 'Urban Search and Rescue (USAR)',
    category: 'sar', 
    description: 'Pencarian korban di reruntuhan bangunan akibat gempa',
    descriptionEn: 'Earthquake rubble victim detection, acoustic listening, and structural shoring'
  },

  // Logistics
  { 
    id: 'skill-log-1', 
    name: 'Distribusi Bantuan Lapangan', 
    nameEn: 'Field Relief Aid Distribution',
    category: 'logistics', 
    description: 'Penyaluran sembako dan logistik langsung ke warga',
    descriptionEn: 'Direct household delivery of food rations and relief essentials'
  },
  { 
    id: 'skill-log-2', 
    name: 'Manajemen Pergudangan Darurat', 
    nameEn: 'Emergency Supply Warehouse Manager',
    category: 'logistics', 
    description: 'Pengelolaan stok, sortir barang masuk/keluar, dan packing',
    descriptionEn: 'Buffer stock management, incoming donation sorting, and relief pallet packing'
  },
  { 
    id: 'skill-log-3', 
    name: 'Pencatatan Inventori & Audit', 
    nameEn: 'Digital Logistics Inventory Auditor',
    category: 'logistics', 
    description: 'Sistem pencatatan logistik berbasis digital dan manifest',
    descriptionEn: 'Digital cargo manifest tracking and supply chain verification'
  },

  // Transport
  { 
    id: 'skill-trn-1', 
    name: 'Operator Perahu Karet (LCR)', 
    nameEn: 'Inflatable Boat (LCR) Pilot',
    category: 'transport', 
    description: 'Pengemudian perahu motor tempel di arus banjir',
    descriptionEn: 'Outboard motor boat navigation through hazardous flood debris'
  },
  { 
    id: 'skill-trn-2', 
    name: 'Pengemudi Ambulans Darurat', 
    nameEn: 'Emergency Ambulance Driver',
    category: 'transport', 
    description: 'Navigasi cepat dan aman di area darurat bencana',
    descriptionEn: 'High-speed defensive driving and route clearing through disaster bottlenecks'
  },
  { 
    id: 'skill-trn-3', 
    name: 'Pengemudi Truk Logistik (SIM B1)', 
    nameEn: 'Heavy Relief Truck Driver (Commercial License)',
    category: 'transport', 
    description: 'Pengiriman muatan berat logistik ke titik posko',
    descriptionEn: 'Heavy payload transit navigating broken roads to forward distribution hubs'
  },
  { 
    id: 'skill-trn-4', 
    name: 'Pengendara Motor Trail Relief', 
    nameEn: 'Off-Road Trail Bike Courier',
    category: 'transport', 
    description: 'Penetrasi jalur terputus, jalan sempit, dan medan lumpur',
    descriptionEn: 'Penetrating cut-off mountainous trails, narrow alleys, and deep mud'
  },

  // Food
  { 
    id: 'skill-food-1', 
    name: 'Koki Dapur Umum Bencana', 
    nameEn: 'Mass Emergency Kitchen Chef',
    category: 'food', 
    description: 'Memasak porsi massal higienis (500-2000 porsi/hari)',
    descriptionEn: 'Hygienic mass meal preparation (500-2,000 rations/day)'
  },
  { 
    id: 'skill-food-2', 
    name: 'Distribusi Makanan Hangat Siap Saji', 
    nameEn: 'Hot Prepared Meal Distribution',
    category: 'food', 
    description: 'Pengantaran rantang/nasi bungkus ke tenda pengungsian',
    descriptionEn: 'Door-to-tent delivery of freshly cooked meals to displaced families'
  },
  { 
    id: 'skill-food-3', 
    name: 'Pemeriksaan Higienitas & Gizi Darurat', 
    nameEn: 'Nutrition & Food Hygiene Inspector',
    category: 'food', 
    description: 'Skrining keamanan pangan dan nutrisi balita/ibu hamil',
    descriptionEn: 'Food safety screening and infant / maternal nutrition compliance'
  },

  // Shelter
  { 
    id: 'skill-she-1', 
    name: 'Pemasangan Tenda Pengungsi BNPB', 
    nameEn: 'BNPB Emergency Shelter Rigger',
    category: 'shelter', 
    description: 'Pemasangan tenda pleton, tenda keluarga, dan pasak',
    descriptionEn: 'Rigging platoon command tents, family shelters, and high-wind anchor stakes'
  },
  { 
    id: 'skill-she-2', 
    name: 'Konstruksi Hunian Sementara (Huntara)', 
    nameEn: 'Transitional Shelter (Huntara) Builder',
    category: 'shelter', 
    description: 'Pemasangan terpal, bambu, kayu, dan sanitasi darurat',
    descriptionEn: 'Rapid carpentry with lumber, bamboo, and weatherproof membrane tarpaulins'
  },
  { 
    id: 'skill-she-3', 
    name: 'Spesialis Sanitasi & Air Bersih (WASH)', 
    nameEn: 'WASH Water & Sanitation Specialist',
    category: 'shelter', 
    description: 'Instalasi tandon air bersih, MCK darurat, dan kaporit',
    descriptionEn: 'Potable water bladder setup, emergency latrines, and water chlorination'
  },

  // Communication
  { 
    id: 'skill-com-1', 
    name: 'Operator Radio Komunikasi (HT/ORARI/RAPI)', 
    nameEn: 'Emergency Radio Operator (HF/VHF/Ham)',
    category: 'communication', 
    description: 'Penghubung komunikasi saat jaringan seluler lumpuh',
    descriptionEn: 'Relaying tactical traffic over repeater and HF radio networks when cell towers fail'
  },
  { 
    id: 'skill-com-2', 
    name: 'Koordinator Posko Lapangan', 
    nameEn: 'Forward Command Post Coordinator',
    category: 'communication', 
    description: 'Pusat komando lokal, bridging relawan, dan pencatatan warga',
    descriptionEn: 'Incident command liaison, volunteer registration, and casualty tracking'
  },
  { 
    id: 'skill-com-3', 
    name: 'Penerjemah Bahasa & Budaya Daerah', 
    nameEn: 'Local Dialect & Cultural Liaison',
    category: 'communication', 
    description: 'Komunikasi persuasif dengan sesepuh dan warga lokal',
    descriptionEn: 'Culturally attuned communication with village elders and regional language speakers'
  },

  // Psychosocial
  { 
    id: 'skill-psy-1', 
    name: 'Konselor Trauma Healing Anak', 
    nameEn: 'Child Trauma Recovery Specialist',
    category: 'psychosocial', 
    description: 'Aktivitas bermain terapeutik dan pendampingan trauma balita',
    descriptionEn: 'Therapeutic play, psychological first aid, and story interventions for displaced children'
  },
  { 
    id: 'skill-psy-2', 
    name: 'Pendamping Psikososial Lansia & Dewasa', 
    nameEn: 'Adult & Senior Psychosocial Counselor',
    category: 'psychosocial', 
    description: 'Dukungan psikologis bagi keluarga korban dan penyintas',
    descriptionEn: 'Grief counseling, anxiety decompression, and survivor mental resilience support'
  }
];

export const SEED_DISASTERS: Disaster[] = [
  {
    id: 'disaster-1',
    title: 'Banjir Luapan Kali Ciliwung - Kampung Melayu & Bukit Duri',
    titleEn: 'Ciliwung River Basin Flash Flood - Kampung Melayu & Bukit Duri',
    description: 'Hujan intensitas ekstrem di kawasan hulu Puncak Bogor menyebabkan debit air Katulampa Siaga 1 (220 cm). Kali Ciliwung meluap merendam pemukiman padat RW 01, 02, 03 Kampung Melayu (Jaktim) dan Bukit Duri (Jaksel) dengan ketinggian air 1.5 - 2.8 meter. Warga lansia dan balita terjebak di lantai dua rumah.',
    descriptionEn: 'Torrential rainfall in the upstream Puncak Bogor watershed pushed Katulampa Dam to Alert Level 1 (220 cm). Ciliwung River overtopped banks, submerging densely populated neighborhoods in East and South Jakarta under 1.5 to 2.8 meters of water with seniors and infants stranded on upper floors.',
    type: 'flood',
    severity: 'critical',
    locationLat: -6.2251,
    locationLng: 106.8621,
    address: 'Jl. Kebon Pala I, RT 11/RW 02, Kampung Melayu, Jatinegara, Jakarta Timur',
    province: 'DKI Jakarta',
    region: 'Jawa',
    status: 'responding',
    reportedAt: '2026-10-12T04:15:00Z',
    affectedPeople: 4850,
    affectedHouseholds: 1420,
    evacuationCenterCount: 4,
    keyNeeds: ['Perahu Karet Evakuasi', 'Dapur Umum 3000 Porsi', 'Obat Kulit & Diare', 'Susu Balita & Pampers', 'Penerangan Genset'],
    keyNeedsEn: ['Inflatable Evacuation Boats', 'Field Kitchen 3,000 Portions', 'Dermatological & Antidiarrheal Meds', 'Infant Formula & Diapers', 'Auxiliary Generator Lighting'],
    waterLevelCm: 280
  },
  {
    id: 'disaster-2',
    title: 'Gempa Bumi Tektonik Selat Sunda - Dampak Anyer & Labuan',
    titleEn: 'Sunda Strait Tectonic Earthquake - Anyer & Labuan Coastal Impact',
    description: 'Gempa berkekuatan M 6.2 kedalaman 18 km berpusat di Selat Sunda mengakibatkan guncangan kuat skala VI MMI di pesisir barat Pandeglang dan Anyer. 78 unit rumah warga roboh sebagian, retakan pada dinding fasilitas kesehatan, dan jaringan listrik lokal padam. Diperlukan evakuasi darurat dan tim medis trauma.',
    descriptionEn: 'A magnitude 6.2 shallow earthquake (18km depth) centered in the Sunda Strait generated strong MMI VI ground motion across coastal Pandeglang and Anyer. 78 homes partially collapsed, healthcare facilities suffered structural fissures, and local power grids failed, requiring urgent trauma stabilization and rubble extrication.',
    type: 'earthquake',
    severity: 'high',
    locationLat: -6.4022,
    locationLng: 105.8234,
    address: 'Kecamatan Labuan & Anyer, Pesisir Pandeglang, Banten',
    province: 'Banten',
    region: 'Jawa',
    status: 'active',
    reportedAt: '2026-10-12T02:40:00Z',
    affectedPeople: 2100,
    affectedHouseholds: 560,
    evacuationCenterCount: 3,
    keyNeeds: ['Tim Medis Luka Fraktur', 'USAR Reruntuhan', 'Tenda Pleton BNPB', 'Genset & Radio HT', 'Air Bersih Tangki'],
    keyNeedsEn: ['Orthopedic Trauma Medics', 'Collapsed Structure USAR Team', 'BNPB Platoon Tents', 'Generators & VHF Radios', 'Potable Water Tankers']
  },
  {
    id: 'disaster-3',
    title: 'Kebakaran Permukiman Padat Tambora - Kalianyar',
    titleEn: 'High-Density Residential Conflagration - Tambora, Kalianyar',
    description: 'Korsleting arus pendek di pemukiman padat semi-permanen memicu kobaran api cepat menyebar menghanguskan 62 rumah di Gang Kancil Kalianyar Tambora. Akses jalan sempit menyulitkan mobil pemadam. Warga mengungsi di halaman masjid dan aula serbaguna kelurahan.',
    descriptionEn: 'An electrical short circuit in an ultra-dense informal settlement triggered a rapid blaze gutting 62 homes in Kalianyar Tambora. Narrow 1-meter alleyways severely impeded fire trucks. Displaced residents are sheltered in community halls and mosque courtyards.',
    type: 'fire',
    severity: 'high',
    locationLat: -6.1512,
    locationLng: 106.8041,
    address: 'Jl. Kalianyar III RT 05/RW 01, Tambora, Jakarta Barat',
    province: 'DKI Jakarta',
    region: 'Jawa',
    status: 'responding',
    reportedAt: '2026-10-11T21:30:00Z',
    affectedPeople: 620,
    affectedHouseholds: 185,
    evacuationCenterCount: 2,
    keyNeeds: ['Selimut & Pakaian Bersih', 'Dapur Umum Segera', 'Kits Sanitasi Higienis', 'Konseling Anak Sekolah'],
    keyNeedsEn: ['Warm Blankets & Clean Garments', 'Rapid Soup Kitchen', 'Hygiene Care Kits', 'Schoolchild Psychosocial Counseling']
  },
  {
    id: 'disaster-4',
    title: 'Kebakaran Hutan & Lahan Gambut (Karhutla) Siak & Pelalawan',
    titleEn: 'Peatland Wildfire Crisis (Karhutla) - Siak & Pelalawan Regencies',
    description: 'Kemarau panjang memicu kebakaran lahan gambut di kedalaman 1.5 meter pada zona penyangga TN Tesso Nilo. Terpantau 68 titik hotspot aktif BMKG dengan ISPU kategori Sangat Tidak Sehat (285 AQI). Asap tebal mengancam pemukiman dan penerbangan di Pekanbaru. Tim gabungan Manggala Agni membutuhkan tambahan relawan pemadam darat dan masker N95.',
    descriptionEn: 'Severe prolonged drought ignited subterranean peat fires at 1.5m depth in the Tesso Nilo National Park buffer zone. BMKG satellites tracked 68 thermal hotspots generating hazardous air quality (AQI 285). Dense smog disrupts Pekanbaru airspace; Manggala Agni ground crews require extra volunteers and N95 masks.',
    type: 'fire',
    severity: 'critical',
    locationLat: 0.7893,
    locationLng: 102.0469,
    address: 'Kawasan Konservasi & Lahan Gambut Minas, Siak, Riau',
    province: 'Riau',
    region: 'Sumatera',
    status: 'responding',
    reportedAt: '2026-10-12T01:10:00Z',
    affectedPeople: 8200,
    affectedHouseholds: 2350,
    evacuationCenterCount: 5,
    keyNeeds: ['Masker Respirator N95 50.000 Pcs', 'Pompa Apung & Selang Pemadam 2.5 Inch', 'Tetes Mata & Oksigen Portabel', 'Drone Pemantau Titik Panas Thermal', 'Dapur Umum Mandiri'],
    keyNeedsEn: ['N95 Respirators 50,000 Pcs', 'Floating Pumps & 2.5 Inch Hoses', 'Eye Drops & Portable O2 Concentrators', 'Thermal Infrared Spotter Drones', 'Grassroots Field Kitchen'],
    activeHotspots: 68,
    fireIntensity: 'extreme'
  },
  {
    id: 'disaster-5',
    title: 'Karhutla Lahan Gambut Palangka Raya & Taman Nasional Sebangau',
    titleEn: 'Palangka Raya & Sebangau National Park Peatland Wildfire',
    description: 'Titik api berkobar di kawasan gambut kering lingkar luar Palangka Raya dan Sebangau. Kabut asap pekat membatasi jarak pandang hingga 200 meter. Manggala Agni dan Masyarakat Peduli Api (MPA) kewalahan karena sumber air parit mengering. Memerlukan relawan operasi sekat bakar dan mobilisasi pompa bertekanan tinggi.',
    descriptionEn: 'Intense fire outbreaks across desiccated peat domes on Palangka Raya’s outer ring and Sebangau. Hazardous haze reduced visibility to under 200 meters. Manggala Agni and community fire brigades struggle as drainage canals run dry, requiring firebreak cutters and high-pressure pumps.',
    type: 'fire',
    severity: 'critical',
    locationLat: -2.2087,
    locationLng: 113.9165,
    address: 'Jl. Mahir Mahar Km 12, Sebangau, Palangka Raya, Kalimantan Tengah',
    province: 'Kalimantan Tengah',
    region: 'Kalimantan',
    status: 'responding',
    reportedAt: '2026-10-11T14:20:00Z',
    affectedPeople: 12500,
    affectedHouseholds: 3600,
    evacuationCenterCount: 6,
    keyNeeds: ['Tangki Air Darurat 5000L', 'Regu Pemadam Ground Fire', 'Tabung Oksigen Puskesmas', 'Kacamata Google Pelindung Asap', 'Logistik Dapur Pleton'],
    keyNeedsEn: ['Emergency 5,000L Water Bowsers', 'Ground Subsurface Firefighting Squads', 'Clinic Oxygen Cylinders', 'Aerosol Smoke Safety Goggles', 'Platoon Field Rations'],
    activeHotspots: 94,
    fireIntensity: 'extreme'
  },
  {
    id: 'disaster-6',
    title: 'Banjir Bandang & Tanggul Sungai Wulan Jebol - Demak & Kudus',
    titleEn: 'Wulan River Levee Breach Catastrophic Flood - Demak & Kudus',
    description: 'Debit air Sungai Wulan meluap ekstrem menjebol tanggul sepanjang 25 meter di Desa Ketanjung, Kecamatan Karanganyar, Demak. Air berarus deras merendam ribuan rumah hingga atap (2.5 meter) dan memutus total jalur utama Pantura Semarang-Surabaya. Puluhan warga terjebak di genting rumah menunggu evakuasi LCR.',
    descriptionEn: 'Extreme flood discharge on the Wulan River breached a 25-meter levee section in Karanganyar, Demak. Torrential water submerged thousands of homes up to rooflines (2.5 meters) and severed the critical Semarang-Surabaya Pantura highway, leaving dozens of families stranded on rooftops.',
    type: 'flood',
    severity: 'critical',
    locationLat: -6.8944,
    locationLng: 110.7412,
    address: 'Kecamatan Karanganyar, Jalur Pantura Km 42, Demak, Jawa Tengah',
    province: 'Jawa Tengah',
    region: 'Jawa',
    status: 'responding',
    reportedAt: '2026-10-12T03:00:00Z',
    affectedPeople: 16800,
    affectedHouseholds: 4900,
    evacuationCenterCount: 8,
    keyNeeds: ['Perahu Karet Mesin Tempel 15 PK', 'Tali Tambat & Life Jacket Dewasa/Anak', 'Makanan Siap Santap Hangat', 'Tenda Pengungsi Lapangan', 'Tenaga Medis Trauma & Hipotermia'],
    keyNeedsEn: ['Inflatable Boats with 15HP Outboard', 'Mooring Ropes & Lifejackets', 'Hot Ready-to-Eat Meals', 'Disaster Platoon Tents', 'Hypothermia & Trauma Medics'],
    waterLevelCm: 250
  },
  {
    id: 'disaster-7',
    title: 'Banjir Luapan DAS Bengawan Solo - Bojonegoro & Tuban',
    titleEn: 'Bengawan Solo Basin Inundation - Bojonegoro & Tuban',
    description: 'Hujan deras berhari-hari di hulu Jawa Timur dan Waduk Gajah Mungkur memicu status Siaga Merah Bengawan Solo. Sebanyak 14 desa di bantaran sungai tergenang air setinggi 1.2 - 1.8 meter. Sawah siap panen terendam dan akses jalan antar kecamatan terputus.',
    descriptionEn: 'Days of severe downpours across East Java and heavy spillway discharge from Gajah Mungkur Reservoir triggered Red Alert status on the Bengawan Solo River, inundating 14 riparian villages under 1.2 to 1.8 meters of floodwaters and cutting inter-district roadways.',
    type: 'flood',
    severity: 'high',
    locationLat: -7.1502,
    locationLng: 111.8817,
    address: 'Kecamatan Dander & Trucuk, Bantaran Bengawan Solo, Bojonegoro, Jawa Timur',
    province: 'Jawa Timur',
    region: 'Jawa',
    status: 'active',
    reportedAt: '2026-10-11T18:00:00Z',
    affectedPeople: 5400,
    affectedHouseholds: 1650,
    evacuationCenterCount: 4,
    keyNeeds: ['Pompa Alkon 3 Inch', 'Bronjong Kawat Penahan Tanggul', 'Selimut & Terpal', 'Dapur Umum Posko'],
    keyNeedsEn: ['3-Inch Portable Suction Pumps', 'Wire Gabions for Bank Stabilization', 'Fleece Blankets & Tarps', 'Basecamp Soup Kitchen'],
    waterLevelCm: 160
  },
  {
    id: 'disaster-8',
    title: 'Banjir Bandang Galodo & Aliran Lahar - Agam & Tanah Datar',
    titleEn: 'Cold Lahar Volcanic Debris Torrent (Galodo) - Agam & Tanah Datar',
    description: 'Hujan lebat di lereng Gunung Marapi membawa material lahar dingin dan bongkahan batu besar menerjang pemukiman warga di Nagari Bukik Batabuah Agam. Jembatan utama putus dan lumpur setebal 1 meter menimbun puluhan rumah serta lahan pertanian warga.',
    descriptionEn: 'Heavy cloudbursts on the slopes of Mount Marapi unleashed a destructive cold lahar torrent carrying volcanic boulders and dense mud through Nagari Bukik Batabuah. Bridges collapsed and a 1-meter mud layer buried dozens of homes and agricultural terraces.',
    type: 'flood',
    severity: 'critical',
    locationLat: -0.3275,
    locationLng: 100.4150,
    address: 'Nagari Bukik Batabuah, Canduang, Agam, Sumatera Barat',
    province: 'Sumatera Barat',
    region: 'Sumatera',
    status: 'responding',
    reportedAt: '2026-10-12T05:30:00Z',
    affectedPeople: 3200,
    affectedHouseholds: 890,
    evacuationCenterCount: 4,
    keyNeeds: ['Alat Berat Ekskavator Mini', 'Tim USAR Anjing Pelacak K9', 'Air Bersih Tangki PDAM', 'Dapur Umum Trauma Center', 'Pakaian Layak Pakai'],
    keyNeedsEn: ['Mini Tracked Excavators', 'K9 Search & Rescue Teams', 'Utility Potable Water Bowsers', 'Trauma Recovery Soup Kitchen', 'Wearable Clean Clothing'],
    waterLevelCm: 190
  },
  {
    id: 'disaster-9',
    title: 'Kebakaran Hutan & Lahan Gambut Ketapang - Kendawangan',
    titleEn: 'Peatland Forest Fires - Ketapang & Kendawangan Coast',
    description: 'Hotspot karhutla terpantau di 42 lokasi di kawasan lahan gambut Ketapang. Angin kencang memperluas rembetan api ke arah kebun kelapa sawit rakyat dan hutan lindung. Dibutuhkan tim pemadam darat yang dapat menjangkau lokasi menggunakan motor trail.',
    descriptionEn: 'Satellite telemetry detected 42 active fire hotspots across Ketapang’s coastal peatlands. Gusty winds are fanning the fireline towards smallholder plantations and protected reserves. Rapid ground suppression teams with trail bikes are urgently dispatched.',
    type: 'fire',
    severity: 'high',
    locationLat: -2.3508,
    locationLng: 110.1582,
    address: 'Kecamatan Kendawangan, Ketapang, Kalimantan Barat',
    province: 'Kalimantan Barat',
    region: 'Kalimantan',
    status: 'active',
    reportedAt: '2026-10-11T09:45:00Z',
    affectedPeople: 3800,
    affectedHouseholds: 950,
    evacuationCenterCount: 3,
    keyNeeds: ['Selang Pemadam 2 Inch & Nozzle', 'Masker Karbon Aktif', 'Motor Trail Pengangkut Pompa', 'Makanan Ringan Energi Tinggi'],
    keyNeedsEn: ['2-Inch Fire Hoses & Adjustable Nozzles', 'Activated Carbon Particulate Masks', 'Pump-Equipped Offroad Trail Bikes', 'High-Calorie Field Rations'],
    activeHotspots: 42,
    fireIntensity: 'high'
  },
  {
    id: 'disaster-10',
    title: 'Banjir Luapan DAS Barito - Banjar & Martapura',
    titleEn: 'Barito & Martapura River Basin Flood - Banjar Regency',
    description: 'Tingginya curah hujan di pegunungan Meratus menyebabkan Sungai Martapura meluap menggenangi pemukiman tepian sungai dengan ketinggian air 80-140 cm. Perahu jukung tradisional dikerahkan relawan lokal untuk mobilitas bantuan beras dan air bersih.',
    descriptionEn: 'Incessant torrential rains in the Meratus Mountains pushed the Martapura River over capacity, submerging riverside communities under 80 to 140 cm of water. Traditional wooden canoes (jukung) have been mobilized by local responders for relief logistics.',
    type: 'flood',
    severity: 'medium',
    locationLat: -3.4147,
    locationLng: 114.8519,
    address: 'Kecamatan Martapura Barat, Kabupaten Banjar, Kalimantan Selatan',
    province: 'Kalimantan Selatan',
    region: 'Kalimantan',
    status: 'active',
    reportedAt: '2026-10-11T12:00:00Z',
    affectedPeople: 4100,
    affectedHouseholds: 1200,
    evacuationCenterCount: 3,
    keyNeeds: ['Beras & Minyak Goreng', 'Kaporit Penjernih Air', 'Obat Salep Kulit', 'Pelampung'],
    keyNeedsEn: ['Rice & Cooking Oil Supplies', 'Chlorine Water Purification Tablets', 'Antifungal Skin Salves', 'PFD Buoyancy Vests'],
    waterLevelCm: 130
  }
];


export const SEED_TASKS: Task[] = [
  // Tasks for Disaster 1 (Banjir Kampung Melayu)
  {
    id: 'task-1-1',
    disasterId: 'disaster-1',
    title: 'Evakuasi Balita dan Lansia Terjebak Genangan 2.5m di RW 02',
    titleEn: 'Evacuate Infants and Seniors Trapped in 2.5m Floodwaters at RW 02',
    description: 'Penyisiran lorong pemukiman sempit menggunakan 3 unit perahu LCR bermesin kecil dan manual dayung. Prioritaskan 14 lansia yang terjebak di lantai dua tanpa listrik.',
    descriptionEn: 'Sweep congested narrow alleys utilizing 3 shallow-draft inflatable LCR boats with small outboards and oars. Prioritize 14 seniors stranded on unpowered upper floors.',
    requiredSkillCategory: 'sar',
    requiredSkillName: 'Tim SAR Water Rescue',
    requiredSkillNameEn: 'Water Rescue SAR Specialist',
    priority: 'urgent',
    locationLat: -6.2248,
    locationLng: 106.8630,
    address: 'Gang Arus RT 08/RW 02 Kampung Melayu',
    status: 'in_progress',
    volunteersNeeded: 6,
    volunteersAssigned: 4,
    createdAt: '2026-10-12T04:45:00Z',
    targetCompletionTime: '2 jam'
  },
  {
    id: 'task-1-2',
    disasterId: 'disaster-1',
    title: 'Operasional Dapur Umum Posko Kantor Kelurahan (1.500 Nasi Bungkus)',
    titleEn: 'Community Sub-District Hall Mass Soup Kitchen (1,500 Packaged Meals)',
    description: 'Pengolahan dan pengemasan makan siang pengungsi banjir. Menu higienis: nasi telur kecap sayur sop. Memerlukan relawan pemotong sayur dan pengepak.',
    descriptionEn: 'Cooking and packing nutritious hot lunch rations for flood evacuees: rice, braised eggs, vegetable soup. Veggie prep and meal box packaging volunteers needed.',
    requiredSkillCategory: 'food',
    requiredSkillName: 'Koki Dapur Umum Bencana',
    requiredSkillNameEn: 'Mass Emergency Kitchen Chef',
    priority: 'high',
    locationLat: -6.2260,
    locationLng: 106.8610,
    address: 'Halaman Kelurahan Kampung Melayu',
    status: 'assigned',
    volunteersNeeded: 8,
    volunteersAssigned: 5,
    createdAt: '2026-10-12T05:00:00Z',
    targetCompletionTime: '3 jam'
  },
  {
    id: 'task-1-3',
    disasterId: 'disaster-1',
    title: 'Pemeriksaan Kesehatan Kulit, Hipotermia, dan Diare Posko 1',
    titleEn: 'Medical Outpost 1 Health Screening: Dermatitis, Hypothermia & Diarrhea',
    description: 'Skrining dan pengobatan anak-anak serta lansia yang terendam air kotor lebih dari 6 jam. Persiapan salep antijamur, oralit, dan parasetamol.',
    descriptionEn: 'Clinical screening and triage for children and elders exposed to stagnant wastewater over 6 hours. Administering antifungal ointments, oral rehydration salts, and analgesics.',
    requiredSkillCategory: 'medical',
    requiredSkillName: 'Dokter Umum & Darurat',
    requiredSkillNameEn: 'General & Emergency Physician',
    priority: 'high',
    locationLat: -6.2255,
    locationLng: 106.8615,
    address: 'Posko Gedung Sasana Krida Remaja',
    status: 'in_progress',
    volunteersNeeded: 4,
    volunteersAssigned: 2,
    createdAt: '2026-10-12T05:20:00Z',
    targetCompletionTime: '4 jam'
  },
  {
    id: 'task-1-4',
    disasterId: 'disaster-1',
    title: 'Distribusi Air Mineral dan Makanan Kering via Perahu Dayung',
    titleEn: 'Paddle Boat Door-to-Door Drinking Water & Dry Rations Delivery',
    description: 'Distribusi pintu-ke-pintu untuk warga yang masih menjaga rumah di lantai dua dan enggan dievakuasi.',
    descriptionEn: 'Door-to-door delivery for residents holding guard on second floors who declined immediate shelter evacuation.',
    requiredSkillCategory: 'logistics',
    requiredSkillName: 'Distribusi Bantuan Lapangan',
    requiredSkillNameEn: 'Field Relief Aid Distribution',
    priority: 'medium',
    locationLat: -6.2242,
    locationLng: 106.8640,
    address: 'RW 03 Kebon Pala',
    status: 'pending',
    volunteersNeeded: 4,
    volunteersAssigned: 0,
    createdAt: '2026-10-12T05:40:00Z',
    targetCompletionTime: '3 jam'
  },
  {
    id: 'task-1-5',
    disasterId: 'disaster-1',
    title: 'Instalasi Repeater dan Pos Radio Komunikasi Darurat HT',
    titleEn: 'Deploy Emergency VHF Repeater Mast & Incident Command Radio Post',
    description: 'Memasang antena darurat 12 meter di atap kantor kecamatan untuk menghubungkan posko lapangan dengan BPBD DKI Jakarta saat tower seluler padam.',
    descriptionEn: 'Erect a 12m portable antenna mast atop subdistrict headquarters to establish reliable radio communications with Jakarta BPBD while cellular base stations remain offline.',
    requiredSkillCategory: 'communication',
    requiredSkillName: 'Operator Radio Komunikasi (HT/ORARI/RAPI)',
    requiredSkillNameEn: 'Emergency Radio Operator (HF/VHF/Ham)',
    priority: 'urgent',
    locationLat: -6.2270,
    locationLng: 106.8600,
    address: 'Kantor Kecamatan Jatinegara',
    status: 'assigned',
    volunteersNeeded: 2,
    volunteersAssigned: 2,
    createdAt: '2026-10-12T04:30:00Z',
    targetCompletionTime: '1.5 jam'
  },
  {
    id: 'task-1-6',
    disasterId: 'disaster-1',
    title: 'Pendampingan Trauma Healing Anak Pengungsi di Tenda 2',
    titleEn: 'Child Friendly Space Psychosocial Recovery Sessions at Tent 2',
    description: 'Sesi mendongeng, mewarnai, dan permainan interaktif untuk 65 anak yang mengungsi agar meredakan cemas pasca evakuasi banjir mendadak subuh tadi.',
    descriptionEn: 'Storytelling, expressive art, and games for 65 displaced children to alleviate acute psychological stress from rapid pre-dawn flood evacuations.',
    requiredSkillCategory: 'psychosocial',
    requiredSkillName: 'Konselor Trauma Healing Anak',
    requiredSkillNameEn: 'Child Trauma Recovery Specialist',
    priority: 'medium',
    locationLat: -6.2263,
    locationLng: 106.8618,
    address: 'Tenda Ramah Anak SDN Kampung Melayu 01',
    status: 'pending',
    volunteersNeeded: 4,
    volunteersAssigned: 1,
    createdAt: '2026-10-12T06:00:00Z',
    targetCompletionTime: '4 jam'
  },

  // Tasks for Disaster 2 (Gempa Banten)
  {
    id: 'task-2-1',
    disasterId: 'disaster-2',
    title: 'Pencarian & Ekstrikasi Korban Reruntuhan Tembok Puskesmas Labuan',
    titleEn: 'USAR Rubble Search & Extrication at Collapsed Labuan Clinic Wall',
    description: 'Tim USAR dengan peralatan pemotong beton dan sensor deteksi mencari kemungkinan 2 staf perawat yang tertimpa dinding saat gempa subuh.',
    descriptionEn: 'USAR technical team with acoustic listening probes and hydraulic concrete cutters conducting search for 2 nursing staff trapped by collapsed masonry.',
    requiredSkillCategory: 'sar',
    requiredSkillName: 'Urban Search and Rescue (USAR)',
    requiredSkillNameEn: 'Urban Search and Rescue (USAR)',
    priority: 'urgent',
    locationLat: -6.4015,
    locationLng: 105.8240,
    address: 'Puskesmas Rawat Inap Labuan',
    status: 'in_progress',
    volunteersNeeded: 5,
    volunteersAssigned: 3,
    createdAt: '2026-10-12T03:15:00Z',
    targetCompletionTime: '2 jam'
  },
  {
    id: 'task-2-2',
    disasterId: 'disaster-2',
    title: 'Pendirian 6 Unit Tenda Darurat Pleton dan MCK Portabel',
    titleEn: 'Assemble 6 BNPB Platoon Emergency Tents & Portable Field Latrines',
    description: 'Mendirikan tenda keluarga bagi 45 keluarga yang rumahnya mengalami retak struktur berbahaya dan tidak boleh dimasuki lagi.',
    descriptionEn: 'Erect communal emergency shelter tents for 45 displaced families whose homes sustained dangerous structural fissures and are red-tagged.',
    requiredSkillCategory: 'shelter',
    requiredSkillName: 'Pemasangan Tenda Pengungsi BNPB',
    requiredSkillNameEn: 'BNPB Emergency Shelter Rigger',
    priority: 'high',
    locationLat: -6.4030,
    locationLng: 105.8225,
    address: 'Lapangan Sepak Bola Labuan',
    status: 'pending',
    volunteersNeeded: 6,
    volunteersAssigned: 2,
    createdAt: '2026-10-12T03:45:00Z',
    targetCompletionTime: '5 jam'
  },
  {
    id: 'task-2-3',
    disasterId: 'disaster-2',
    title: 'Pengiriman Tabung Oksigen & Serum Antibisa via Motor Trail',
    titleEn: 'Off-Road Trail Bike Dispatch: Oxygen Cylinders & Antivenom Serums',
    description: 'Menembus jalur pesisir yang tertutup retakan aspal menuju posko terisolir di Tanjung Lesung.',
    descriptionEn: 'Traversing fissured and debris-blocked coastal tracks to reach an isolated coastal aid outpost in Tanjung Lesung with vital medical canisters.',
    requiredSkillCategory: 'transport',
    requiredSkillName: 'Pengendara Motor Trail Relief',
    requiredSkillNameEn: 'Off-Road Trail Bike Courier',
    priority: 'urgent',
    locationLat: -6.4150,
    locationLng: 105.8150,
    address: 'Jalan Raya Anyer-Sirih Km 14',
    status: 'assigned',
    volunteersNeeded: 3,
    volunteersAssigned: 3,
    createdAt: '2026-10-12T04:10:00Z',
    targetCompletionTime: '2 jam'
  },

  // Tasks for Disaster 3 (Kebakaran Tambora)
  {
    id: 'task-3-1',
    disasterId: 'disaster-3',
    title: 'Sortir dan Distribusi Pakaian Pantas Pakai & Paket Sanitasi',
    titleEn: 'Sort & Distribute Clean Wearable Clothes and Hygiene Kits',
    description: 'Penyaluran 350 paket hygiene kit (sabun, sikat gigi, pembalut, handuk) dan seragam sekolah darurat untuk korban kebakaran.',
    descriptionEn: 'Sorting and staging 350 individual hygiene kits (soap, oral care, sanitary napkins, towels) and school uniforms for fire survivors.',
    requiredSkillCategory: 'logistics',
    requiredSkillName: 'Distribusi Bantuan Lapangan',
    requiredSkillNameEn: 'Field Relief Aid Distribution',
    priority: 'high',
    locationLat: -6.1510,
    locationLng: 106.8045,
    address: 'Masjid Jami Al-Falah Kalianyar',
    status: 'assigned',
    volunteersNeeded: 5,
    volunteersAssigned: 5,
    createdAt: '2026-10-11T22:30:00Z',
    targetCompletionTime: '3 jam'
  },
  {
    id: 'task-3-2',
    disasterId: 'disaster-3',
    title: 'Penanganan Luka Bakar Ringan dan Sesak Napas Asap (ISPA)',
    titleEn: 'First Aid Treatment: Minor Burns and Smoke Inhalation Respiratory Distress',
    description: 'Pelayanan P3K dan penguapan nebulizer bagi 22 warga yang terpapar asap pekat saat kebakaran semalam.',
    descriptionEn: 'Field wound treatment, burn dress changes, and nebulizer bronchodilator therapy for 22 residents suffering smoke inhalation.',
    requiredSkillCategory: 'medical',
    requiredSkillName: 'Paramedis Lapangan',
    requiredSkillNameEn: 'Field Paramedic & EMT',
    priority: 'urgent',
    locationLat: -6.1515,
    locationLng: 106.8038,
    address: 'Posko Kesehatan Balai RW 01 Tambora',
    status: 'completed',
    volunteersNeeded: 3,
    volunteersAssigned: 3,
    createdAt: '2026-10-11T22:00:00Z',
    targetCompletionTime: '2 jam'
  }
];

export const SEED_VOLUNTEERS: Volunteer[] = [
  {
    id: 'vol-01',
    name: 'dr. Anisa Lestari, Sp.An',
    email: 'anisa.lestari@med.id',
    phone: '0812-8819-2041',
    locationLat: -6.2185,
    locationLng: 106.8480,
    address: 'Jl. Matraman Raya No. 45, Tebet',
    city: 'Jakarta Selatan',
    radiusKm: 35,
    status: 'available',
    category: 'public_community',
    sarUnitOrRole: 'Dokter Relawan Medis Darurat Komunitas',
    skills: [
      { skillId: 'skill-med-1', proficiency: 'expert' },
      { skillId: 'skill-med-2', proficiency: 'expert' },
      { skillId: 'skill-med-4', proficiency: 'expert' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 14,
    organization: 'Bulan Sabit Merah Indonesia (BSMI)',
    joinedDate: '2024-03-15',
    gamification: {
      points: 780,
      level: 3,
      levelTitle: 'Komandan Regu Misi',
      nextLevelPoints: 900,
      completedMissionsCount: 14,
      hoursContributed: 84,
      badges: [
        { id: 'badge-first-responder', name: 'First Responder', icon: '⚡', description: 'Menyelesaikan misi tanggap darurat dalam 30 menit', category: 'mission', unlockedAt: '2024-04-10' },
        { id: 'badge-life-saver', name: 'Life Saver Medis', icon: '🩺', description: 'Penanganan trauma dan evakuasi medis darurat', category: 'skill', unlockedAt: '2024-06-20' },
        { id: 'badge-community-guardian', name: 'Pahlawan Warga Komunitas', icon: '🤝', description: 'Aktif memimpin posko warga', category: 'community', unlockedAt: '2024-08-15' }
      ],
      claimedRewardIds: ['rew-02']
    }
  },
  {
    id: 'vol-02',
    name: 'Bambang Suryo Wibowo',
    email: 'bambang.suryo@sar.or.id',
    phone: '0813-1092-3382',
    locationLat: -6.2301,
    locationLng: 106.8710,
    address: 'Jl. Otto Iskandardinata No. 12, Cawang',
    city: 'Jakarta Timur',
    radiusKm: 50,
    status: 'available',
    category: 'sar_official',
    sarUnitOrRole: 'Basarnas Kansar Jakarta - Regu USAR Rescue',
    skills: [
      { skillId: 'skill-sar-1', proficiency: 'expert' },
      { skillId: 'skill-trn-1', proficiency: 'expert' },
      { skillId: 'skill-sar-4', proficiency: 'intermediate' }
    ],
    activeTasksCount: 1,
    completedTasksCount: 22,
    organization: 'Basarnas Kantor SAR Jakarta',
    joinedDate: '2023-11-01',
    gamification: {
      points: 1250,
      level: 4,
      levelTitle: 'Spesialis Operasi Lapangan',
      nextLevelPoints: 1500,
      completedMissionsCount: 22,
      hoursContributed: 132,
      badges: [
        { id: 'badge-first-responder', name: 'First Responder', icon: '⚡', description: 'Menyelesaikan misi tanggap darurat dalam 30 menit', category: 'mission', unlockedAt: '2023-12-05' },
        { id: 'badge-sar-elite', name: 'SAR USAR Bersertifikat', icon: '🧗', description: 'Personel terlatih Urban Search and Rescue / Water Rescue standar Basarnas', category: 'sar', unlockedAt: '2024-01-15' },
        { id: 'badge-water-hero', name: 'Penjaga Air & Banjir', icon: '🌊', description: 'Menyelesaikan 5 misi evakuasi air LCR', category: 'mission', unlockedAt: '2024-03-22' },
        { id: 'badge-century-service', name: 'Dedikasi 100 Jam SIGAP', icon: '🏆', description: 'Mencapai total kontribusi lebih dari 100 jam di zona merah', category: 'hero', unlockedAt: '2024-07-30' }
      ],
      claimedRewardIds: ['rew-01', 'rew-04']
    }
  },
  {
    id: 'vol-03',
    name: 'Siti Rahmawati, S.Gz',
    email: 'siti.rahma@dapurpeduli.org',
    phone: '0857-4421-9901',
    locationLat: -6.2110,
    locationLng: 106.8520,
    address: 'Jl. Slamet Riyadi No. 8, Matraman',
    city: 'Jakarta Timur',
    radiusKm: 25,
    status: 'available',
    skills: [
      { skillId: 'skill-food-1', proficiency: 'expert' },
      { skillId: 'skill-food-3', proficiency: 'expert' },
      { skillId: 'skill-log-1', proficiency: 'intermediate' }
    ],
    activeTasksCount: 1,
    completedTasksCount: 19,
    organization: 'Dapur Umum Ibu Siaga',
    joinedDate: '2024-01-20'
  },
  {
    id: 'vol-04',
    name: 'Dimas Pratama Putra',
    email: 'dimas.pratama@rescue.id',
    phone: '0812-7744-1189',
    locationLat: -6.2230,
    locationLng: 106.8590,
    address: 'Jl. Bukit Duri Tanjakan No. 19, Tebet',
    city: 'Jakarta Selatan',
    radiusKm: 20,
    status: 'available',
    skills: [
      { skillId: 'skill-sar-1', proficiency: 'expert' },
      { skillId: 'skill-trn-1', proficiency: 'expert' },
      { skillId: 'skill-med-4', proficiency: 'intermediate' }
    ],
    activeTasksCount: 1,
    completedTasksCount: 8,
    organization: 'Relawan Ciliwung Bersih',
    joinedDate: '2025-02-10'
  },
  {
    id: 'vol-05',
    name: 'Hendro Kusuma (YC0HKB)',
    email: 'hendro.orari@radiokom.id',
    phone: '0811-9234-5511',
    locationLat: -6.2350,
    locationLng: 106.8640,
    address: 'Jl. Cipinang Cempedak I No. 4, Jatinegara',
    city: 'Jakarta Timur',
    radiusKm: 60,
    status: 'available',
    skills: [
      { skillId: 'skill-com-1', proficiency: 'expert' },
      { skillId: 'skill-com-2', proficiency: 'expert' }
    ],
    activeTasksCount: 1,
    completedTasksCount: 31,
    organization: 'ORARI Daerah DKI Jakarta',
    joinedDate: '2023-08-14'
  },
  {
    id: 'vol-06',
    name: 'Nadia Safitri, M.Psi',
    email: 'nadia.psikologi@hope.org',
    phone: '0819-0822-7714',
    locationLat: -6.2410,
    locationLng: 106.8400,
    address: 'Jl. Pancoran Barat VIII No. 11',
    city: 'Jakarta Selatan',
    radiusKm: 30,
    status: 'available',
    skills: [
      { skillId: 'skill-psy-1', proficiency: 'expert' },
      { skillId: 'skill-psy-2', proficiency: 'expert' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 16,
    organization: 'Yayasan Senyum Sahabat',
    joinedDate: '2024-05-18'
  },
  {
    id: 'vol-07',
    name: 'Agus Salim Hidayat',
    email: 'agus.salim@logistikrakyat.id',
    phone: '0852-1982-3344',
    locationLat: -6.1890,
    locationLng: 106.8320,
    address: 'Jl. Salemba Tengah No. 22',
    city: 'Jakarta Pusat',
    radiusKm: 40,
    status: 'available',
    skills: [
      { skillId: 'skill-log-1', proficiency: 'expert' },
      { skillId: 'skill-log-2', proficiency: 'expert' },
      { skillId: 'skill-trn-3', proficiency: 'expert' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 25,
    organization: 'Tagana DKI Jakarta',
    joinedDate: '2023-09-02'
  },
  {
    id: 'vol-08',
    name: 'Reza Fahlevi',
    email: 'reza.fahlevi@trailrescue.org',
    phone: '0813-8822-0091',
    locationLat: -6.2620,
    locationLng: 106.8120,
    address: 'Jl. Fatmawati Raya No. 88, Cilandak',
    city: 'Jakarta Selatan',
    radiusKm: 70,
    status: 'available',
    skills: [
      { skillId: 'skill-trn-4', proficiency: 'expert' },
      { skillId: 'skill-log-1', proficiency: 'intermediate' },
      { skillId: 'skill-med-4', proficiency: 'intermediate' }
    ],
    activeTasksCount: 1,
    completedTasksCount: 11,
    organization: 'Komunitas Trail Peduli Bencana',
    joinedDate: '2024-07-22'
  },
  {
    id: 'vol-09',
    name: 'Ns. Ratna Wulandari, S.Kep',
    email: 'ratna.wulan@pmi.or.id',
    phone: '0812-9912-4455',
    locationLat: -6.1950,
    locationLng: 106.8420,
    address: 'Jl. Kramat Raya No. 47, Senen',
    city: 'Jakarta Pusat',
    radiusKm: 30,
    status: 'available',
    skills: [
      { skillId: 'skill-med-2', proficiency: 'expert' },
      { skillId: 'skill-med-3', proficiency: 'intermediate' },
      { skillId: 'skill-med-4', proficiency: 'expert' }
    ],
    activeTasksCount: 1,
    completedTasksCount: 18,
    organization: 'Palang Merah Indonesia (PMI) DKI',
    joinedDate: '2023-12-10'
  },
  {
    id: 'vol-10',
    name: 'Ir. Taufik Gunawan',
    email: 'taufik.shelter@bnpb-relawan.id',
    phone: '0811-1402-993',
    locationLat: -6.2550,
    locationLng: 106.8780,
    address: 'Jl. Dewi Sartika No. 110, Cawang',
    city: 'Jakarta Timur',
    radiusKm: 45,
    status: 'available',
    skills: [
      { skillId: 'skill-she-1', proficiency: 'expert' },
      { skillId: 'skill-she-2', proficiency: 'expert' },
      { skillId: 'skill-she-3', proficiency: 'intermediate' }
    ],
    activeTasksCount: 1,
    completedTasksCount: 27,
    organization: 'Habitat Kemanusiaan',
    joinedDate: '2023-06-15'
  },
  {
    id: 'vol-11',
    name: 'Faisal Akbar (SAR Specialist)',
    email: 'faisal.akbar@basarnas-mitra.id',
    phone: '0812-6633-8899',
    locationLat: -6.1620,
    locationLng: 106.8150,
    address: 'Jl. Gajah Mada No. 102, Tamansari',
    city: 'Jakarta Barat',
    radiusKm: 50,
    status: 'available',
    skills: [
      { skillId: 'skill-sar-4', proficiency: 'expert' },
      { skillId: 'skill-sar-3', proficiency: 'expert' },
      { skillId: 'skill-sar-1', proficiency: 'intermediate' }
    ],
    activeTasksCount: 1,
    completedTasksCount: 20,
    organization: 'Mapala UI Rescue Team',
    joinedDate: '2024-02-05'
  },
  {
    id: 'vol-12',
    name: 'Dewi Anggraini',
    email: 'dewi.anggraini@foodrescue.id',
    phone: '0856-7788-9911',
    locationLat: -6.1550,
    locationLng: 106.7980,
    address: 'Jl. Tubagus Angke No. 34, Tambora',
    city: 'Jakarta Barat',
    radiusKm: 25,
    status: 'busy',
    skills: [
      { skillId: 'skill-food-1', proficiency: 'expert' },
      { skillId: 'skill-food-2', proficiency: 'expert' }
    ],
    activeTasksCount: 1,
    completedTasksCount: 15,
    organization: 'Dapur Umum Ibu Siaga',
    joinedDate: '2024-04-12'
  },
  {
    id: 'vol-13',
    name: 'dr. Satria Nugroho',
    email: 'satria.nugroho@emergency.id',
    phone: '0813-2299-1100',
    locationLat: -6.2080,
    locationLng: 106.8220,
    address: 'Jl. Sudirman Kav 52, Setiabudi',
    city: 'Jakarta Selatan',
    radiusKm: 40,
    status: 'available',
    skills: [
      { skillId: 'skill-med-1', proficiency: 'expert' },
      { skillId: 'skill-med-3', proficiency: 'expert' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 9,
    organization: 'Dokter Peduli (DoctorSHARE)',
    joinedDate: '2025-01-11'
  },
  {
    id: 'vol-14',
    name: 'Ahmad Fauzi',
    email: 'ahmad.fauzi@ambulans.id',
    phone: '0812-4455-6677',
    locationLat: -6.1480,
    locationLng: 106.8120,
    address: 'Jl. Jembatan Besi Raya No. 15, Tambora',
    city: 'Jakarta Barat',
    radiusKm: 35,
    status: 'available',
    skills: [
      { skillId: 'skill-trn-2', proficiency: 'expert' },
      { skillId: 'skill-med-4', proficiency: 'expert' }
    ],
    activeTasksCount: 1,
    completedTasksCount: 24,
    organization: 'Ambulans Gawat Darurat (AGD)',
    joinedDate: '2023-10-18'
  },
  {
    id: 'vol-15',
    name: 'Maya Kartika, S.Sos',
    email: 'maya.kartika@relawan.org',
    phone: '0878-1122-3344',
    locationLat: -6.2710,
    locationLng: 106.8350,
    address: 'Jl. Kalibata Tengah No. 20',
    city: 'Jakarta Selatan',
    radiusKm: 30,
    status: 'available',
    skills: [
      { skillId: 'skill-psy-1', proficiency: 'expert' },
      { skillId: 'skill-com-2', proficiency: 'intermediate' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 13,
    organization: 'Aksi Cepat Sahabat',
    joinedDate: '2024-06-05'
  },
  // Volunteers 16 to 50 covering diverse locations and skills across Jabodetabek
  {
    id: 'vol-16',
    name: 'Eko Prasetyo',
    email: 'eko.prasetyo@airbersih.org',
    phone: '0857-1199-2288',
    locationLat: -6.2290,
    locationLng: 106.8850,
    address: 'Jl. Basuki Rahmat No. 7, Duren Sawit',
    city: 'Jakarta Timur',
    radiusKm: 35,
    status: 'available',
    skills: [
      { skillId: 'skill-she-3', proficiency: 'expert' },
      { skillId: 'skill-log-1', proficiency: 'intermediate' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 17,
    organization: 'Wahana Sanitasi Darurat',
    joinedDate: '2024-03-01'
  },
  {
    id: 'vol-17',
    name: 'Danang Wicaksono',
    email: 'danang.w@sarjakarta.id',
    phone: '0813-7766-5544',
    locationLat: -6.2405,
    locationLng: 106.8610,
    address: 'Jl. Otista III No. 55, Jatinegara',
    city: 'Jakarta Timur',
    radiusKm: 40,
    status: 'available',
    skills: [
      { skillId: 'skill-sar-1', proficiency: 'expert' },
      { skillId: 'skill-sar-2', proficiency: 'intermediate' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 14,
    organization: 'Relawan Air Ciliwung',
    joinedDate: '2024-09-12'
  },
  {
    id: 'vol-18',
    name: 'Nurul Hidayah',
    email: 'nurul.h@logistik.id',
    phone: '0812-9988-1122',
    locationLat: -6.2150,
    locationLng: 106.8720,
    address: 'Jl. Bekasi Timur Raya No. 41, Cipinang',
    city: 'Jakarta Timur',
    radiusKm: 25,
    status: 'available',
    skills: [
      { skillId: 'skill-log-2', proficiency: 'expert' },
      { skillId: 'skill-log-3', proficiency: 'expert' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 10,
    organization: 'Relawan Logistik Nusantara',
    joinedDate: '2025-01-08'
  },
  {
    id: 'vol-19',
    name: 'Tri Wahyudi (Driver Truk)',
    email: 'tri.wahyudi@angkutan.id',
    phone: '0852-3322-1144',
    locationLat: -6.2800,
    locationLng: 106.8700,
    address: 'Jl. Raya Bogor Km 21, Kramat Jati',
    city: 'Jakarta Timur',
    radiusKm: 60,
    status: 'available',
    skills: [
      { skillId: 'skill-trn-3', proficiency: 'expert' },
      { skillId: 'skill-log-1', proficiency: 'expert' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 28,
    organization: 'Paguyuban Sopir Logistik Siaga',
    joinedDate: '2023-05-19'
  },
  {
    id: 'vol-20',
    name: 'drg. Cynthia Mariana',
    email: 'cynthia.m@firstaid.id',
    phone: '0811-8899-7700',
    locationLat: -6.2050,
    locationLng: 106.8390,
    address: 'Jl. Diponegoro No. 60, Menteng',
    city: 'Jakarta Pusat',
    radiusKm: 30,
    status: 'available',
    skills: [
      { skillId: 'skill-med-4', proficiency: 'expert' },
      { skillId: 'skill-med-1', proficiency: 'intermediate' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 7,
    organization: 'Klinik Tanggap Bencana',
    joinedDate: '2025-03-01'
  },
  {
    id: 'vol-21',
    name: 'Yudi Hermawan',
    email: 'yudi.hermawan@perahu.org',
    phone: '0813-4411-9922',
    locationLat: -6.2190,
    locationLng: 106.8640,
    address: 'Jl. Bukit Duri Utara No. 12',
    city: 'Jakarta Selatan',
    radiusKm: 25,
    status: 'available',
    skills: [
      { skillId: 'skill-sar-1', proficiency: 'expert' },
      { skillId: 'skill-trn-1', proficiency: 'expert' }
    ],
    activeTasksCount: 1,
    completedTasksCount: 12,
    organization: 'Forum Relawan Ciliwung',
    joinedDate: '2024-08-11'
  },
  {
    id: 'vol-22',
    name: 'Sri Mulyani (Dapur Berkah)',
    email: 'sri.mulyani@dapurberkah.id',
    phone: '0857-8899-3344',
    locationLat: -6.2270,
    locationLng: 106.8580,
    address: 'Jl. Tebet Timur Dalam VI No. 9',
    city: 'Jakarta Selatan',
    radiusKm: 20,
    status: 'available',
    skills: [
      { skillId: 'skill-food-1', proficiency: 'expert' },
      { skillId: 'skill-food-2', proficiency: 'expert' }
    ],
    activeTasksCount: 1,
    completedTasksCount: 22,
    organization: 'Dapur Umum Ibu Siaga',
    joinedDate: '2023-11-20'
  },
  {
    id: 'vol-23',
    name: 'Bayu Samudra (Penyelam)',
    email: 'bayu.samudra@diver.id',
    phone: '0812-7711-4455',
    locationLat: -6.1280,
    locationLng: 106.7820,
    address: 'Jl. Pluit Karang Cantik No. 18',
    city: 'Jakarta Utara',
    radiusKm: 80,
    status: 'available',
    skills: [
      { skillId: 'skill-sar-2', proficiency: 'expert' },
      { skillId: 'skill-sar-1', proficiency: 'expert' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 18,
    organization: 'Persatuan Olahraga Selam Seluruh Indonesia (POSSI)',
    joinedDate: '2024-01-14'
  },
  {
    id: 'vol-24',
    name: 'Farhan Maulana',
    email: 'farhan.m@usar.id',
    phone: '0813-9900-1133',
    locationLat: -6.2420,
    locationLng: 106.8020,
    address: 'Jl. Wijaya I No. 44, Kebayoran Baru',
    city: 'Jakarta Selatan',
    radiusKm: 45,
    status: 'available',
    skills: [
      { skillId: 'skill-sar-4', proficiency: 'expert' },
      { skillId: 'skill-she-2', proficiency: 'intermediate' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 9,
    organization: 'Relawan Konstruksi Tanggap',
    joinedDate: '2024-10-05'
  },
  {
    id: 'vol-25',
    name: 'Lestari Handayani, S.Psi',
    email: 'lestari.h@trauma.id',
    phone: '0812-3344-9988',
    locationLat: -6.1980,
    locationLng: 106.8290,
    address: 'Jl. Cikini Raya No. 82',
    city: 'Jakarta Pusat',
    radiusKm: 35,
    status: 'available',
    skills: [
      { skillId: 'skill-psy-1', proficiency: 'expert' },
      { skillId: 'skill-psy-2', proficiency: 'intermediate' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 15,
    organization: 'Himpunan Psikologi Indonesia (HIMPSI)',
    joinedDate: '2024-02-19'
  },
  {
    id: 'vol-26',
    name: 'Ilham Kurniawan',
    email: 'ilham.k@rapi.id',
    phone: '0811-7722-0099',
    locationLat: -6.1750,
    locationLng: 106.8280,
    address: 'Jl. Medan Merdeka Timur No. 10',
    city: 'Jakarta Pusat',
    radiusKm: 50,
    status: 'available',
    skills: [
      { skillId: 'skill-com-1', proficiency: 'expert' },
      { skillId: 'skill-com-2', proficiency: 'intermediate' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 26,
    organization: 'RAPI Daerah 10 DKI',
    joinedDate: '2023-07-28'
  },
  {
    id: 'vol-27',
    name: 'Hj. Rohana',
    email: 'rohana.dapur@peduli.id',
    phone: '0858-1234-5678',
    locationLat: -6.1470,
    locationLng: 106.8080,
    address: 'Jl. Duri Bangkit No. 5, Tambora',
    city: 'Jakarta Barat',
    radiusKm: 15,
    status: 'available',
    skills: [
      { skillId: 'skill-food-1', proficiency: 'expert' },
      { skillId: 'skill-food-2', proficiency: 'expert' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 19,
    organization: 'PKK Kelurahan Tambora',
    joinedDate: '2023-12-05'
  },
  {
    id: 'vol-28',
    name: 'dr. Hendra Setiawan',
    email: 'hendra.s@traumamedic.org',
    phone: '0812-8800-4411',
    locationLat: -6.2300,
    locationLng: 106.8150,
    address: 'Jl. Mampang Prapatan Raya No. 91',
    city: 'Jakarta Selatan',
    radiusKm: 40,
    status: 'available',
    skills: [
      { skillId: 'skill-med-1', proficiency: 'expert' },
      { skillId: 'skill-med-4', proficiency: 'expert' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 12,
    organization: 'IDI Cabang Jakarta Selatan',
    joinedDate: '2024-04-18'
  },
  {
    id: 'vol-29',
    name: 'Gunawan Prasojo',
    email: 'gunawan.p@shelter.id',
    phone: '0813-5566-7788',
    locationLat: -6.1680,
    locationLng: 106.7750,
    address: 'Jl. Daan Mogot Km 11, Cengkareng',
    city: 'Jakarta Barat',
    radiusKm: 45,
    status: 'available',
    skills: [
      { skillId: 'skill-she-1', proficiency: 'expert' },
      { skillId: 'skill-she-2', proficiency: 'expert' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 16,
    organization: 'Tagana Jakarta Barat',
    joinedDate: '2024-01-22'
  },
  {
    id: 'vol-30',
    name: 'Rian Hidayatulloh',
    email: 'rian.trail@banten.id',
    phone: '0812-9900-5544',
    locationLat: -6.2100,
    locationLng: 106.6300,
    address: 'Jl. Jenderal Sudirman No. 4, Tangerang',
    city: 'Kota Tangerang',
    radiusKm: 80,
    status: 'available',
    skills: [
      { skillId: 'skill-trn-4', proficiency: 'expert' },
      { skillId: 'skill-log-1', proficiency: 'intermediate' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 14,
    organization: 'Banten Adventure Rescue',
    joinedDate: '2024-05-30'
  },
  {
    id: 'vol-31',
    name: 'Siti Aminah, A.Md.Kep',
    email: 'aminah.perawat@puskesmas.id',
    phone: '0857-4400-3322',
    locationLat: -6.2280,
    locationLng: 106.8600,
    address: 'Jl. Kampung Melayu Kecil II No. 14',
    city: 'Jakarta Selatan',
    radiusKm: 20,
    status: 'available',
    skills: [
      { skillId: 'skill-med-2', proficiency: 'expert' },
      { skillId: 'skill-med-4', proficiency: 'expert' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 15,
    organization: 'PPNI Jakarta Timur',
    joinedDate: '2023-10-09'
  },
  {
    id: 'vol-32',
    name: 'Dedi Mulyadi',
    email: 'dedi.m@waterrescue.org',
    phone: '0813-1122-8877',
    locationLat: -6.2235,
    locationLng: 106.8655,
    address: 'Jl. Bidara Cina No. 3, Jatinegara',
    city: 'Jakarta Timur',
    radiusKm: 25,
    status: 'available',
    skills: [
      { skillId: 'skill-sar-1', proficiency: 'expert' },
      { skillId: 'skill-trn-1', proficiency: 'intermediate' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 11,
    organization: 'Relawan Ciliwung Bersih',
    joinedDate: '2024-11-15'
  },
  {
    id: 'vol-33',
    name: 'Rahmat Basuki',
    email: 'rahmat.b@truk.id',
    phone: '0852-9988-7711',
    locationLat: -6.1350,
    locationLng: 106.8790,
    address: 'Jl. Yos Sudarso No. 80, Tanjung Priok',
    city: 'Jakarta Utara',
    radiusKm: 70,
    status: 'available',
    skills: [
      { skillId: 'skill-trn-3', proficiency: 'expert' },
      { skillId: 'skill-log-2', proficiency: 'intermediate' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 21,
    organization: 'Pelabuhan Peduli Kemanusiaan',
    joinedDate: '2023-04-10'
  },
  {
    id: 'vol-34',
    name: 'Kiki Ramadhani',
    email: 'kiki.r@logistik.org',
    phone: '0878-5544-2211',
    locationLat: -6.1920,
    locationLng: 106.8510,
    address: 'Jl. Paseban Raya No. 19, Senen',
    city: 'Jakarta Pusat',
    radiusKm: 25,
    status: 'available',
    skills: [
      { skillId: 'skill-log-1', proficiency: 'expert' },
      { skillId: 'skill-food-2', proficiency: 'intermediate' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 8,
    organization: 'Keluarga Mahasiswa Peduli',
    joinedDate: '2025-02-14'
  },
  {
    id: 'vol-35',
    name: 'dr. Wahyu Pratama',
    email: 'wahyu.p@medika.id',
    phone: '0812-1133-7799',
    locationLat: -6.3720,
    locationLng: 106.8310,
    address: 'Jl. Margonda Raya No. 101, Beji',
    city: 'Depok',
    radiusKm: 40,
    status: 'available',
    skills: [
      { skillId: 'skill-med-1', proficiency: 'expert' },
      { skillId: 'skill-med-3', proficiency: 'intermediate' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 13,
    organization: 'Ksatria Medika Depok',
    joinedDate: '2024-03-25'
  },
  {
    id: 'vol-36',
    name: 'Fandi Ahmad (USAR Specialist)',
    email: 'fandi.a@searchrescue.id',
    phone: '0813-8877-6655',
    locationLat: -6.1820,
    locationLng: 106.8910,
    address: 'Jl. Pemuda No. 45, Rawamangun',
    city: 'Jakarta Timur',
    radiusKm: 45,
    status: 'available',
    skills: [
      { skillId: 'skill-sar-4', proficiency: 'expert' },
      { skillId: 'skill-sar-3', proficiency: 'expert' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 17,
    organization: 'Jakarta Rescue Team',
    joinedDate: '2023-12-30'
  },
  {
    id: 'vol-37',
    name: 'Aisyah Putri, S.Pd',
    email: 'aisyah.p@pendampingan.org',
    phone: '0819-3322-1199',
    locationLat: -6.2500,
    locationLng: 106.8500,
    address: 'Jl. Kalibata Timur No. 3',
    city: 'Jakarta Selatan',
    radiusKm: 30,
    status: 'available',
    skills: [
      { skillId: 'skill-psy-1', proficiency: 'expert' },
      { skillId: 'skill-food-2', proficiency: 'intermediate' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 9,
    organization: 'Sahabat Ceria Anak',
    joinedDate: '2024-08-01'
  },
  {
    id: 'vol-38',
    name: 'Hardianto (WASH Specialist)',
    email: 'hardianto@wash.id',
    phone: '0811-9944-2200',
    locationLat: -6.2200,
    locationLng: 106.8300,
    address: 'Jl. Casablanca No. 88, Tebet',
    city: 'Jakarta Selatan',
    radiusKm: 35,
    status: 'available',
    skills: [
      { skillId: 'skill-she-3', proficiency: 'expert' },
      { skillId: 'skill-she-1', proficiency: 'intermediate' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 19,
    organization: 'Relawan Air Bersih Nusantara',
    joinedDate: '2023-09-17'
  },
  {
    id: 'vol-39',
    name: 'Surya Saputra',
    email: 'surya.s@koordinator.id',
    phone: '0812-5500-1122',
    locationLat: -6.2265,
    locationLng: 106.8610,
    address: 'Jl. Jatinegara Barat No. 20',
    city: 'Jakarta Timur',
    radiusKm: 30,
    status: 'available',
    skills: [
      { skillId: 'skill-com-2', proficiency: 'expert' },
      { skillId: 'skill-log-1', proficiency: 'expert' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 23,
    organization: 'Forum Relawan Jabodetabek',
    joinedDate: '2023-03-12'
  },
  {
    id: 'vol-40',
    name: 'Teguh Wibisono',
    email: 'teguh.w@ambulans.org',
    phone: '0813-6622-4488',
    locationLat: -6.2380,
    locationLng: 106.8200,
    address: 'Jl. Kapten Tendean No. 14, Mampang',
    city: 'Jakarta Selatan',
    radiusKm: 40,
    status: 'available',
    skills: [
      { skillId: 'skill-trn-2', proficiency: 'expert' },
      { skillId: 'skill-med-4', proficiency: 'expert' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 16,
    organization: 'Unit Ambulans Komunitas',
    joinedDate: '2024-04-05'
  },
  {
    id: 'vol-41',
    name: 'Lukman Hakim',
    email: 'lukman.h@panjat.org',
    phone: '0857-9911-3322',
    locationLat: -6.2900,
    locationLng: 106.8100,
    address: 'Jl. TB Simatupang No. 30, Pasar Minggu',
    city: 'Jakarta Selatan',
    radiusKm: 50,
    status: 'available',
    skills: [
      { skillId: 'skill-sar-3', proficiency: 'expert' },
      { skillId: 'skill-sar-4', proficiency: 'intermediate' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 10,
    organization: 'Federasi Panjat Tebing Indonesia (FPTI)',
    joinedDate: '2024-07-19'
  },
  {
    id: 'vol-42',
    name: 'dr. Fitriani Rahayu',
    email: 'fitriani.r@medis.id',
    phone: '0812-7788-9900',
    locationLat: -6.1850,
    locationLng: 106.8450,
    address: 'Jl. Salemba Raya No. 6, Senen',
    city: 'Jakarta Pusat',
    radiusKm: 35,
    status: 'available',
    skills: [
      { skillId: 'skill-med-1', proficiency: 'expert' },
      { skillId: 'skill-med-2', proficiency: 'expert' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 11,
    organization: 'Dokter Tanggap Darurat',
    joinedDate: '2024-12-01'
  },
  {
    id: 'vol-43',
    name: 'Budi Arifin',
    email: 'budi.arifin@dapur.org',
    phone: '0813-2233-4455',
    locationLat: -6.2150,
    locationLng: 106.8490,
    address: 'Jl. Manggarai Utara No. 2, Tebet',
    city: 'Jakarta Selatan',
    radiusKm: 20,
    status: 'available',
    skills: [
      { skillId: 'skill-food-1', proficiency: 'expert' },
      { skillId: 'skill-log-1', proficiency: 'intermediate' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 14,
    organization: 'Relawan Dapur Siaga',
    joinedDate: '2024-06-20'
  },
  {
    id: 'vol-44',
    name: 'Endang Suherman',
    email: 'endang.s@truklog.id',
    phone: '0852-1144-8899',
    locationLat: -6.2300,
    locationLng: 106.9100,
    address: 'Jl. Kalimalang No. 77, Pondok Bambu',
    city: 'Jakarta Timur',
    radiusKm: 60,
    status: 'available',
    skills: [
      { skillId: 'skill-trn-3', proficiency: 'expert' },
      { skillId: 'skill-log-2', proficiency: 'expert' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 20,
    organization: 'Ekspedisi Peduli Kemanusiaan',
    joinedDate: '2023-11-14'
  },
  {
    id: 'vol-45',
    name: 'Ratna Juwita',
    email: 'ratna.j@traumakids.org',
    phone: '0819-8877-6611',
    locationLat: -6.2100,
    locationLng: 106.8150,
    address: 'Jl. Gatot Subroto No. 40, Semanggi',
    city: 'Jakarta Selatan',
    radiusKm: 30,
    status: 'available',
    skills: [
      { skillId: 'skill-psy-1', proficiency: 'expert' },
      { skillId: 'skill-psy-2', proficiency: 'intermediate' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 8,
    organization: 'Sahabat Perlindungan Anak',
    joinedDate: '2025-01-20'
  },
  {
    id: 'vol-46',
    name: 'Imam Syafi\'i',
    email: 'imam.s@tenda.id',
    phone: '0812-4499-1122',
    locationLat: -6.1520,
    locationLng: 106.8200,
    address: 'Jl. Mangga Besar IX No. 12',
    city: 'Jakarta Barat',
    radiusKm: 40,
    status: 'available',
    skills: [
      { skillId: 'skill-she-1', proficiency: 'expert' },
      { skillId: 'skill-she-2', proficiency: 'intermediate' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 13,
    organization: 'Satgas Tanggap Bencana',
    joinedDate: '2024-05-11'
  },
  {
    id: 'vol-47',
    name: 'Wawan Setiawan',
    email: 'wawan.s@trailbencana.id',
    phone: '0813-7722-9900',
    locationLat: -6.5950,
    locationLng: 106.8000,
    address: 'Jl. Pajajaran No. 15, Baranangsiang',
    city: 'Kota Bogor',
    radiusKm: 90,
    status: 'available',
    skills: [
      { skillId: 'skill-trn-4', proficiency: 'expert' },
      { skillId: 'skill-sar-1', proficiency: 'intermediate' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 18,
    organization: 'Bogor Trail Rescue Community',
    joinedDate: '2023-08-05'
  },
  {
    id: 'vol-48',
    name: 'Aris Munandar',
    email: 'aris.m@radio.id',
    phone: '0811-3322-1144',
    locationLat: -6.2400,
    locationLng: 106.9900,
    address: 'Jl. Ahmad Yani No. 50, Summarecon',
    city: 'Kota Bekasi',
    radiusKm: 65,
    status: 'available',
    skills: [
      { skillId: 'skill-com-1', proficiency: 'expert' },
      { skillId: 'skill-com-2', proficiency: 'intermediate' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 22,
    organization: 'ORARI Lokal Bekasi',
    joinedDate: '2023-06-25'
  },
  {
    id: 'vol-49',
    name: 'dr. Rina Kusuma',
    email: 'rina.k@firstaid.org',
    phone: '0812-6655-4433',
    locationLat: -6.2650,
    locationLng: 106.7800,
    address: 'Jl. Metro Pondok Indah No. 12',
    city: 'Jakarta Selatan',
    radiusKm: 35,
    status: 'offline',
    skills: [
      { skillId: 'skill-med-1', proficiency: 'expert' },
      { skillId: 'skill-med-4', proficiency: 'expert' }
    ],
    activeTasksCount: 0,
    completedTasksCount: 7,
    organization: 'Relawan Medis Independen',
    joinedDate: '2025-02-01'
  },
  {
    id: 'vol-50',
    name: 'Zulkifli Lubis',
    email: 'zul.lubis@perahu.id',
    phone: '0813-8811-2299',
    locationLat: -6.2240,
    locationLng: 106.8625,
    address: 'Jl. Kebon Pala II No. 8, Kampung Melayu',
    city: 'Jakarta Timur',
    radiusKm: 25,
    status: 'busy',
    skills: [
      { skillId: 'skill-sar-1', proficiency: 'expert' },
      { skillId: 'skill-trn-1', proficiency: 'expert' }
    ],
    activeTasksCount: 1,
    completedTasksCount: 25,
    organization: 'Warga Tanggap Bencana RW 02',
    joinedDate: '2023-02-18'
  }
];

export const SEED_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    taskId: 'task-1-1',
    volunteerId: 'vol-02',
    disasterId: 'disaster-1',
    status: 'in_progress',
    assignedAt: '2026-10-12T04:50:00Z',
    acceptedAt: '2026-10-12T04:55:00Z',
    matchScore: 0.95,
    matchReason: 'Sertifikasi SAR Water Rescue tingkat Expert dan jarak hanya 1.2 km dari titik genangan RW 02.'
  },
  {
    id: 'asg-2',
    taskId: 'task-1-1',
    volunteerId: 'vol-04',
    disasterId: 'disaster-1',
    status: 'in_progress',
    assignedAt: '2026-10-12T04:52:00Z',
    acceptedAt: '2026-10-12T04:56:00Z',
    matchScore: 0.96,
    matchReason: 'Berpengalaman evakuasi perahu karet LCR di bantaran Bukit Duri, jarak 600 meter dari lokasi.'
  },
  {
    id: 'asg-3',
    taskId: 'task-1-2',
    volunteerId: 'vol-03',
    disasterId: 'disaster-1',
    status: 'accepted',
    assignedAt: '2026-10-12T05:05:00Z',
    acceptedAt: '2026-10-12T05:10:00Z',
    matchScore: 0.93,
    matchReason: 'Ahli gizi darurat dan koordinator dapur umum berpengalaman, jarak 2.1 km dari kantor kelurahan.'
  },
  {
    id: 'asg-4',
    taskId: 'task-1-5',
    volunteerId: 'vol-05',
    disasterId: 'disaster-1',
    status: 'in_progress',
    assignedAt: '2026-10-12T04:35:00Z',
    acceptedAt: '2026-10-12T04:40:00Z',
    matchScore: 0.98,
    matchReason: 'Callsign ORARI YC0HKB dengan perangkat radio bergerak lengkap, siap pasang repeater darurat.'
  },
  {
    id: 'asg-5',
    taskId: 'task-3-2',
    volunteerId: 'vol-14',
    disasterId: 'disaster-3',
    status: 'completed',
    assignedAt: '2026-10-11T22:05:00Z',
    acceptedAt: '2026-10-11T22:08:00Z',
    completedAt: '2026-10-12T00:15:00Z',
    notes: '22 korban luka bakar ringan & sesak napas telah diberikan oksigen dan salep perak sulfadiazin. Seluruhnya stabil.'
  }
];

export const SEED_BMKG_ALERTS: BMKGAlert[] = [
  {
    id: 'bmkg-01',
    title: 'Peringatan Dini Cuaca Ekstrem Jabodetabek',
    titleEn: 'Early Warning: Extreme Severe Weather for Greater Jakarta',
    eventType: 'Hujan Lebat & Angin Kencang',
    location: 'Jabodetabek Hulu & Pesisir',
    timestamp: '2026-10-12T04:00:00Z',
    level: 'warning',
    coordinates: [-6.2088, 106.8456],
    description: 'Potensi hujan lebat disertai kilat/petir dan angin kencang berdurasi lebih dari 3 jam.',
    descriptionEn: 'Potential heavy downpours with thunder and strong gusts exceeding 3 hours duration.',
    instruction: 'Hindari berteduh di bawah pohon rindang atau papan reklame dan waspadai genangan.',
    instructionEn: 'Avoid sheltering under trees or roadside billboards and stay vigilant of road inundation.'
  },
  {
    id: 'bmkg-02',
    title: 'Gempa Tektonik M 6.2 Selat Sunda',
    titleEn: 'Sunda Strait M 6.2 Shallow Tectonic Earthquake',
    eventType: 'Gempa Bumi Dangkal',
    magnitude: '6.2 SR',
    depth: '18 km',
    location: 'Selat Sunda (54 km Barat Daya Pandeglang)',
    timestamp: '2026-10-12T02:35:00Z',
    level: 'alert',
    coordinates: [-6.6110, 105.7420],
    potentialTsunami: false,
    description: 'Pusat gempa dangkal di zona subduksi Selat Sunda dirasakan skala V MMI di Anyer.',
    descriptionEn: 'Shallow hypocenter in Sunda Strait subduction felt at MMI V intensity in Anyer.',
    instruction: 'Waspadai potensi gempa susulan tektonik dan hindari gedung dengan retakan struktural.',
    instructionEn: 'Expect tectonic aftershocks and evacuate damaged buildings with structural fissures.'
  },
  {
    id: 'bmkg-03',
    title: 'Tinggi Muka Air Katulampa Siaga 1 (220 cm)',
    titleEn: 'Katulampa Dam River Level Reached Critical Alert Level 1 (220 cm)',
    eventType: 'Banjir Kiriman',
    location: 'Bendung Katulampa, Bogor',
    timestamp: '2026-10-12T03:10:00Z',
    level: 'warning',
    coordinates: [-6.6341, 106.8340],
    description: 'Debit air ekstrem hulu Sungai Ciliwung mengalir deras menuju pintu air Manggarai Jakarta.',
    descriptionEn: 'Extreme upstream runoff along the Ciliwung River heading swiftly towards Manggarai Sluice.',
    instruction: 'Warga bantaran Kali Ciliwung segera amankan barang berharga dan siap evakuasi mandiri.',
    instructionEn: 'Riparian residents along Ciliwung must secure belongings and execute self-evacuation.'
  },
  {
    id: 'bmkg-04',
    title: 'Peringatan Karhutla Siaga Darurat Riau - 68 Hotspot Aktif',
    titleEn: 'Riau Peatland Wildfire Red Alert - 68 Active Satellite Hotspots',
    eventType: 'Kebakaran Hutan & Kabut Asap (ISPU 285 Sangat Tidak Sehat)',
    location: 'Siak, Pelalawan & Bengkalis, Riau',
    timestamp: '2026-10-12T01:30:00Z',
    level: 'warning',
    coordinates: [0.7893, 102.0469],
    description: 'Sebaran titik panas lahan gambut memicu asap pekat dan penurunan jarak pandang penerbangan.',
    descriptionEn: 'Peatland hot spots trigger dense smoke plumes severely reducing aviation visibility.',
    instruction: 'Wajib gunakan masker respirator N95 di luar ruangan dan batasi aktivitas fisik anak.',
    instructionEn: 'Mandatory N95 respirator mask usage outdoors; restrict outdoor activities for minors.'
  },
  {
    id: 'bmkg-05',
    title: 'Peringatan Karhutla Gambut Kalteng - 94 Hotspot BMKG',
    titleEn: 'Central Kalimantan Peatland Wildfire Alert - 94 Thermal Hotspots',
    eventType: 'Kebakaran Gambut Bawah Tanah & Asap Ekstrem',
    location: 'Palangka Raya & Sebangau, Kalimantan Tengah',
    timestamp: '2026-10-11T16:00:00Z',
    level: 'warning',
    coordinates: [-2.2087, 113.9165],
    description: 'Titik api bawah tanah menyala di kedalaman 1.5 meter gambut kering Taman Nasional Sebangau.',
    descriptionEn: 'Subterranean ground fires smoldering at 1.5m depth in desiccated Sebangau peat domes.',
    instruction: 'Aktivasi pompa bor air tanah dan dilarang menyalakan api terbuka di area perkebunan.',
    instructionEn: 'Deploy ground tube-well pumps; strict ban on open-flame burning in plantations.'
  },
  {
    id: 'bmkg-06',
    title: 'Peringatan Darurat Banjir Demak - Tanggul Sungai Wulan Kritis',
    titleEn: 'Demak Riverine Flood Emergency - Wulan River Embankment Near Breach',
    eventType: 'Banjir Bandang & Jalur Pantura Lumpuh',
    location: 'Karanganyar, Demak & Kudus, Jawa Tengah',
    timestamp: '2026-10-12T03:15:00Z',
    level: 'alert',
    coordinates: [-6.8944, 110.7412],
    description: 'Limpasan air sungai melebihi bibir tanggul Karanganyar mengancam jalur logistik Pantura.',
    descriptionEn: 'River surge overtopping Karanganyar levee crest threatening critical Pantura transit artery.',
    instruction: 'Pengemudi logistik dihimbau ambil rute alternatif lingkar selatan dan evakuasi warga.',
    instructionEn: 'Transit truckers must reroute to southern bypass; residents evacuate to higher grounds.'
  }
];

export const SEED_REGIONAL_READINESS: import('../types/index.ts').RegionalReadiness[] = [
  {
    id: 'reg-riau',
    province: 'Riau',
    capitalCity: 'Pekanbaru',
    region: 'Sumatera',
    readinessScore: 78,
    status: 'siaga',
    populationMillions: 6.6,
    fireReadiness: {
      score: 72,
      riskLevel: 'Ekstrem',
      activeHotspots: 68,
      peatlandAreaHa: 4970000,
      firefightingVolunteers: 1840,
      waterBombingBases: 2,
      manggalaAgniPosts: 14,
      canalBlocksBuilt: 2450,
      earlyWarningStatus: 'Siaga Darurat Karhutla (Surat Keputusan Gubernur)'
    },
    floodReadiness: {
      score: 82,
      riskLevel: 'Sedang',
      floodPronePoints: 42,
      drainagePumpCapacityM3s: 18,
      rubberBoatsAvailable: 64,
      waterRescueVolunteers: 420,
      evacuationShelters: 38,
      earlyWarningStatus: 'Normal Terkendali'
    },
    earthquakeReadiness: {
      score: 80,
      riskLevel: 'Rendah',
      activeFaults: ['Sesar Semangko Cabang Timur (jarak >150km)'],
      seismicSensors: 8,
      usarCollapseTeams: 4,
      earthquakeResistantShelters: 22,
      earlyWarningStatus: 'Aman (Aktivitas Seismik Tenang)'
    },
    landslideReadiness: {
      score: 75,
      riskLevel: 'Sedang',
      highRiskSlopes: 14,
      extensometersInstalled: 6,
      heavyEquipmentExcavators: 12,
      earlyWarningStatus: 'Waspada Lereng Rokan Hulu'
    },
    tsunamiReadiness: {
      score: 92,
      riskLevel: 'Rendah',
      coastalSirensCount: 2,
      tsunamiEvacuationRoutes: 8,
      coastalShelterBuildings: 6,
      earlyWarningStatus: 'Perairan Selat Malaka Stabil'
    },
    volcanicReadiness: {
      score: 95,
      riskLevel: 'Rendah',
      activeVolcanoes: [],
      hazardZonesRadiusKm: 0,
      ashfallProtectionMasksStock: 120000,
      earlyWarningStatus: 'Tidak Ada Gunung Api Aktif di Provinsi'
    },
    logisticsCapacity: {
      emergencyTents: 320,
      generators: 85,
      hygieneKits: 14000,
      fieldKitchenCapacityMealsPerDay: 8500
    },
    volunteerRatioPer10kPopulation: 3.4,
    lastAuditDate: '2026-09-30',
    keyVulnerabilities: [
      'Lahan gambut kering sedalam 2-3 meter sulit dipadamkan dari permukaan',
      'Keterbatasan debit air parit saat puncak kemarau untuk pasokan pompa apung',
      'Kabut asap pekat memicu lonjakan kasus ISPA hingga 400% di kalangan anak-anak'
    ],
    keyVulnerabilitiesEn: [
          "Dry peatland at 2-3 meter depth is difficult to extinguish from the ground surface",
          "Canal water deficit during peak drought halts floating pump water intake",
          "Severe toxic smog triggers up to 400% surge in pediatric acute respiratory infections"
    ],
    strategicRecommendations: [
      'Perbanyak titik rewetting gambut melalui reaktivasi 500 sekat kanal di Siak dan Pelalawan',
      'Mobilisasi tim Manggala Agni dan Masyarakat Peduli Api (MPA) dengan drone thermal malam hari',
      'Dropping masker N95 gratis dan posko oksigen murni di seluruh Puskesmas terdampak kabut asap'
    ],
    strategicRecommendationsEn: [
          "Expand peat re-wetting zones by reactivating 500 canal blocks in Siak and Pelalawan",
          "Mobilize Manggala Agni and Community Fire brigades with night thermal reconnaissance drones",
          "Deploy free N95 respirators and dedicated medical oxygen pods across haze-affected health clinics"
    ]
  },
  {
    id: 'reg-kalteng',
    province: 'Kalimantan Tengah',
    capitalCity: 'Palangka Raya',
    region: 'Kalimantan',
    readinessScore: 71,
    status: 'waspada',
    populationMillions: 2.7,
    fireReadiness: {
      score: 65,
      riskLevel: 'Ekstrem',
      activeHotspots: 94,
      peatlandAreaHa: 3010000,
      firefightingVolunteers: 1220,
      waterBombingBases: 1,
      manggalaAgniPosts: 11,
      canalBlocksBuilt: 1800,
      earlyWarningStatus: 'Status Tanggap Darurat Bencana Karhutla'
    },
    floodReadiness: {
      score: 76,
      riskLevel: 'Tinggi',
      floodPronePoints: 68,
      drainagePumpCapacityM3s: 12,
      rubberBoatsAvailable: 52,
      waterRescueVolunteers: 360,
      evacuationShelters: 44,
      earlyWarningStatus: 'Waspada Luapan DAS Kahayan & Barito'
    },
    logisticsCapacity: {
      emergencyTents: 210,
      generators: 62,
      hygieneKits: 8500,
      fieldKitchenCapacityMealsPerDay: 6200
    },
    volunteerRatioPer10kPopulation: 5.8,
    lastAuditDate: '2026-10-01',
    keyVulnerabilities: [
      'Gambut terbakar merambat di bawah tanah (smoldering fire) tanpa api terbuka',
      'Akses jalan darat ke pedalaman Sebangau terisolasi dan hanya bisa dicapai kelotok/perahu',
      'Kekurangan armada water bombing helikopter kapasitas 4000 liter'
    ],
    keyVulnerabilitiesEn: [
          "Smoldering peat fires spread underground without open flames, complicating detection",
          "Deep Sebangau interior lacks overland access and can only be reached via longboats (kelotok)",
          "Shortage of heavy water bombing helicopters with 4,000-liter capacity"
    ],
    strategicRecommendations: [
      'Ajukan penambahan 3 helikopter water bombing Chinook/Kamov ke BNPB Pusat',
      'Bentuk satuan tugas relawan injeksi gambut bertekanan tinggi (nozzle khusus 2 meter)',
      'Sosialisasi moratorium pembukaan lahan ladang berpindah dengan sistem pembakaran'
    ],
    strategicRecommendationsEn: [
          "Request 3 heavy water-bombing helicopters (Chinook/Kamov) from Central BNPB",
          "Establish high-pressure peat lance injection volunteer units with 2-meter subsoil nozzles",
          "Enforce educational moratorium against slash-and-burn shifting cultivation"
    ]
  },
  {
    id: 'reg-dki',
    province: 'DKI Jakarta',
    capitalCity: 'Jakarta Pusat',
    region: 'Jawa',
    readinessScore: 86,
    status: 'optimal',
    populationMillions: 10.6,
    fireReadiness: {
      score: 84,
      riskLevel: 'Sedang',
      activeHotspots: 2,
      peatlandAreaHa: 0,
      firefightingVolunteers: 1540,
      waterBombingBases: 0,
      manggalaAgniPosts: 0,
      canalBlocksBuilt: 0,
      earlyWarningStatus: 'Antisipasi Kebakaran Kawasan Padat Penduduk'
    },
    floodReadiness: {
      score: 88,
      riskLevel: 'Tinggi',
      floodPronePoints: 125,
      drainagePumpCapacityM3s: 520,
      rubberBoatsAvailable: 240,
      waterRescueVolunteers: 2100,
      evacuationShelters: 95,
      earlyWarningStatus: 'Siaga 1 Banjir Kiriman Katulampa (220 cm)'
    },
    earthquakeReadiness: {
      score: 74,
      riskLevel: 'Sedang',
      activeFaults: ['Sesar Baribis Jalur Jakarta Selatan-Depok'],
      seismicSensors: 24,
      usarCollapseTeams: 18,
      earthquakeResistantShelters: 68,
      earlyWarningStatus: 'Waspada Potensi Gempa Megathrust Selat Sunda'
    },
    landslideReadiness: {
      score: 85,
      riskLevel: 'Rendah',
      highRiskSlopes: 8,
      extensometersInstalled: 12,
      heavyEquipmentExcavators: 45,
      earlyWarningStatus: 'Aman (Topografi Dominan Dataran Rendah)'
    },
    tsunamiReadiness: {
      score: 79,
      riskLevel: 'Sedang',
      coastalSirensCount: 8,
      tsunamiEvacuationRoutes: 25,
      coastalShelterBuildings: 32,
      earlyWarningStatus: 'Waspada Pasang Rob Pesisir Teluk Jakarta'
    },
    volcanicReadiness: {
      score: 88,
      riskLevel: 'Rendah',
      activeVolcanoes: ['G. Salak (65km)', 'G. Gede-Pangrango (75km)'],
      hazardZonesRadiusKm: 0,
      ashfallProtectionMasksStock: 450000,
      earlyWarningStatus: 'Aman dari Hujan Abu Langsung'
    },
    logisticsCapacity: {
      emergencyTents: 650,
      generators: 210,
      hygieneKits: 45000,
      fieldKitchenCapacityMealsPerDay: 25000
    },
    volunteerRatioPer10kPopulation: 3.4,
    lastAuditDate: '2026-10-10',
    keyVulnerabilities: [
      'Waktu tempuh puncak banjir kiriman dari Katulampa ke Jakarta hanya 9-11 jam',
      'Penyempitan dan sedimentasi bantaran Kali Ciliwung, Krukut, dan Pesanggrahan',
      'Banjir rob pasang laut bersamaan dengan luapan hulu di muara Pluit dan Marunda'
    ],
    keyVulnerabilitiesEn: [
          "Upstream Katulampa flood crest reaches Jakarta within just 9-11 hours",
          "Canal encroachment and heavy sedimentation along Ciliwung, Krukut, and Pesanggrahan rivers",
          "Simultaneous coastal astronomical high tides (rob) and upstream fluvial discharge at Pluit/Marunda"
    ],
    strategicRecommendations: [
      'Optimasi sistem peringatan dini SMS Blast BMKG & BPBD ke warga bantaran kali 6 jam sebelum tiba',
      'Siagakan pompa stasioner waduk Pluit dan mobil pompa damkar mobile berkapasitas 500 liter/detik',
      'Rotasi relawan perahu LCR dan Tagana untuk shift malam di Kampung Melayu, Bidara Cina, dan Bukit Duri'
    ],
    strategicRecommendationsEn: [
          "Optimize automated SMS warning broadcasts to riverside residents 6 hours prior to flood arrival",
          "Standby stationary reservoir pumps and high-capacity mobile municipal pumper trucks (500 L/s)",
          "Rotate certified LCR boat rescue crews and Tagana volunteers for 24-hour river patrols"
    ]
  },
  {
    id: 'reg-jateng',
    province: 'Jawa Tengah',
    capitalCity: 'Semarang',
    region: 'Jawa',
    readinessScore: 69,
    status: 'kritis',
    populationMillions: 37.2,
    fireReadiness: {
      score: 81,
      riskLevel: 'Rendah',
      activeHotspots: 5,
      peatlandAreaHa: 0,
      firefightingVolunteers: 820,
      waterBombingBases: 0,
      manggalaAgniPosts: 0,
      canalBlocksBuilt: 0,
      earlyWarningStatus: 'Normal'
    },
    floodReadiness: {
      score: 58,
      riskLevel: 'Ekstrem',
      floodPronePoints: 184,
      drainagePumpCapacityM3s: 64,
      rubberBoatsAvailable: 85,
      waterRescueVolunteers: 1100,
      evacuationShelters: 62,
      earlyWarningStatus: 'Status Darurat: Tanggul Sungai Wulan Karanganyar Jebol'
    },
    earthquakeReadiness: {
      score: 68,
      riskLevel: 'Tinggi',
      activeFaults: ['Sesar Opak', 'Sesar Kendeng Jalur Semarang', 'Sesar Muria'],
      seismicSensors: 16,
      usarCollapseTeams: 9,
      earthquakeResistantShelters: 45,
      earlyWarningStatus: 'Waspada Seismik Sesar Kendeng'
    },
    landslideReadiness: {
      score: 55,
      riskLevel: 'Ekstrem',
      highRiskSlopes: 86,
      extensometersInstalled: 28,
      heavyEquipmentExcavators: 34,
      earlyWarningStatus: 'Siaga Merah Longsor Karangkobar & Banjarnegara'
    },
    tsunamiReadiness: {
      score: 64,
      riskLevel: 'Tinggi',
      coastalSirensCount: 14,
      tsunamiEvacuationRoutes: 36,
      coastalShelterBuildings: 18,
      earlyWarningStatus: 'Waspada Megathrust Pantai Selatan Cilacap & Kebumen'
    },
    volcanicReadiness: {
      score: 62,
      riskLevel: 'Ekstrem',
      activeVolcanoes: ['G. Merapi (Siaga Level III)', 'G. Slamet (Waspada)', 'G. Dieng'],
      hazardZonesRadiusKm: 7,
      ashfallProtectionMasksStock: 250000,
      earlyWarningStatus: 'Status Siaga Level III Gunung Merapi - Guguran Lava Aktif'
    },
    logisticsCapacity: {
      emergencyTents: 380,
      generators: 92,
      hygieneKits: 18500,
      fieldKitchenCapacityMealsPerDay: 14000
    },
    volunteerRatioPer10kPopulation: 0.52,
    lastAuditDate: '2026-10-11',
    keyVulnerabilities: [
      'Tanggul sungai kritis rapuh dan mudah tergerus limpasan air berarus deras',
      'Terputusnya urat nadi ekonomi Pantura Demak-Kudus menghambat suplai logistik darat',
      'Kekurangan armada perahu karet bermesin untuk evakuasi di air berarus deras'
    ],
    keyVulnerabilitiesEn: [
          "Fragile riprap embankments vulnerable to scouring under high-velocity flood surges",
          "Disruption of Pantura coastal transit corridor paralyzes nationwide overland freight",
          "Shortage of motorized flood rescue boats capable of navigating turbulent breach currents"
    ],
    strategicRecommendations: [
      'Pengerahan alat berat amfibi dan tiang pancang bambu/jumbo bag pasir untuk penutupan tanggul darurat',
      'Mobilisasi tim gabungan Basarnas, TNI, dan relawan SIGAP dari Semarang dan Solo',
      'Buka koridor dapur umum massal di SPBU dan masjid jalur lingkar Kudus'
    ],
    strategicRecommendationsEn: [
          "Mobilize amphibious excavators and geotextile jumbo sandbags for emergency breach sealing",
          "Dispatch joint response teams from Basarnas, military engineers, and SIGAP volunteers",
          "Open mass relief soup kitchens at highway rest areas and community centers along Kudus bypass"
    ]
  },
  {
    id: 'reg-kalbar',
    province: 'Kalimantan Barat',
    capitalCity: 'Pontianak',
    region: 'Kalimantan',
    readinessScore: 73,
    status: 'waspada',
    populationMillions: 5.5,
    fireReadiness: {
      score: 68,
      riskLevel: 'Tinggi',
      activeHotspots: 42,
      peatlandAreaHa: 2800000,
      firefightingVolunteers: 980,
      waterBombingBases: 1,
      manggalaAgniPosts: 8,
      canalBlocksBuilt: 1450,
      earlyWarningStatus: 'Siaga Karhutla Pesisir Barat'
    },
    floodReadiness: {
      score: 78,
      riskLevel: 'Tinggi',
      floodPronePoints: 75,
      drainagePumpCapacityM3s: 14,
      rubberBoatsAvailable: 48,
      waterRescueVolunteers: 520,
      evacuationShelters: 36,
      earlyWarningStatus: 'Waspada Pasang Laut & DAS Kapuas'
    },
    logisticsCapacity: {
      emergencyTents: 180,
      generators: 48,
      hygieneKits: 7200,
      fieldKitchenCapacityMealsPerDay: 5500
    },
    volunteerRatioPer10kPopulation: 2.7,
    lastAuditDate: '2026-09-28',
    keyVulnerabilities: [
      'Penyebaran titik api cepat di perkebunan swasta dan kawasan konservasi Gunung Palung',
      'Keterbatasan pasokan masker anak dan oksigen medis di puskesmas pelosok Ketapang',
      'Minimnya armada motor trail pengangkut mesin pompa alkon ke pelosok semak'
    ],
    keyVulnerabilitiesEn: [
          "Rapid wildland fire spread across remote private concessions and Gunung Palung conservation zones",
          "Shortage of pediatric masks and medical oxygen canisters in remote Ketapang rural clinics",
          "Limited offroad trail-bike fleet able to haul portable water pumps across peat brush"
    ],
    strategicRecommendations: [
      'Perkuat patroli terpadu Babinsa, Bhabinkamtibmas dan Relawan Masyarakat Peduli Api',
      'Pengadaan 50 unit pompa punggung (backpack pump) dan selang pemadam tahan panas',
      'Pemasangan plang larangan membakar lahan dengan sanksi pidana tegas di area perbatasan desa'
    ],
    strategicRecommendationsEn: [
          "Strengthen joint military, police, and community fire warden ground patrols",
          "Procure 50 heat-resistant backpack spray pumps and flame-resistant hose bundles",
          "Erect zero-burn legal warning signage with strict criminal sanctions at forest concession borders"
    ]
  },
  {
    id: 'reg-jabar',
    province: 'Jawa Barat',
    capitalCity: 'Bandung',
    region: 'Jawa',
    readinessScore: 77,
    status: 'siaga',
    populationMillions: 49.9,
    fireReadiness: {
      score: 83,
      riskLevel: 'Rendah',
      activeHotspots: 8,
      peatlandAreaHa: 0,
      firefightingVolunteers: 1400,
      waterBombingBases: 0,
      manggalaAgniPosts: 0,
      canalBlocksBuilt: 0,
      earlyWarningStatus: 'Normal'
    },
    floodReadiness: {
      score: 72,
      riskLevel: 'Ekstrem',
      floodPronePoints: 210,
      drainagePumpCapacityM3s: 180,
      rubberBoatsAvailable: 195,
      waterRescueVolunteers: 2800,
      evacuationShelters: 110,
      earlyWarningStatus: 'Siaga Luapan DAS Citarum & Ciliwung Hulu'
    },
    logisticsCapacity: {
      emergencyTents: 520,
      generators: 140,
      hygieneKits: 32000,
      fieldKitchenCapacityMealsPerDay: 22000
    },
    volunteerRatioPer10kPopulation: 0.84,
    lastAuditDate: '2026-10-08',
    keyVulnerabilities: [
      'Kawasan cekungan Bandung (Dayeuhkolot, Baleendah) langganan genangan air hingga berminggu-minggu',
      'Kerentanan longsor tebing di kawasan Puncak Bogor dan Cianjur menyusul curah hujan tinggi',
      'Beban aliran lumpur merusak tanggul drainase pemukiman padat Bekasi dan Karawang'
    ],
    keyVulnerabilitiesEn: [
          "Bandung basin lowlands (Dayeuhkolot, Baleendah) experience stagnant multi-week backwater inundations",
          "Steep slope landslide risks along Puncak Bogor and Cianjur following high-intensity precipitation",
          "Heavy sediment runoffs damaging drainage infrastructure in high-density Bekasi and Karawang estates"
    ],
    strategicRecommendations: [
      'Aktivasi polder kolam retensi Cieunteung dan Andir dengan pompa berdaya penuh',
      'Siagakan perahu fiber dan relawan evakuasi untuk jalur sempit gang pemukiman Citarum',
      'Penguatan posko kesehatan penanganan leptospirosis dan penyakit kulit di pengungsian'
    ],
    strategicRecommendationsEn: [
          "Run Cieunteung and Andir retention polder pumping stations at maximum discharge capacity",
          "Preposition shallow fiberglass rescue dinghies and teams for narrow Citarum alleyways",
          "Reinforce field health posts against leptospirosis and waterborne infections in shelter clusters"
    ]
  },
  {
    id: 'reg-jatim',
    province: 'Jawa Timur',
    capitalCity: 'Surabaya',
    region: 'Jawa',
    readinessScore: 80,
    status: 'siaga',
    populationMillions: 41.1,
    fireReadiness: {
      score: 79,
      riskLevel: 'Rendah',
      activeHotspots: 11,
      peatlandAreaHa: 0,
      firefightingVolunteers: 1100,
      waterBombingBases: 0,
      manggalaAgniPosts: 0,
      canalBlocksBuilt: 0,
      earlyWarningStatus: 'Waspada Karhutla Gunung Arjuno & Bromo'
    },
    floodReadiness: {
      score: 81,
      riskLevel: 'Tinggi',
      floodPronePoints: 145,
      drainagePumpCapacityM3s: 160,
      rubberBoatsAvailable: 160,
      waterRescueVolunteers: 1950,
      evacuationShelters: 78,
      earlyWarningStatus: 'Siaga Merah Bengawan Solo (Bojonegoro & Tuban)'
    },
    logisticsCapacity: {
      emergencyTents: 440,
      generators: 115,
      hygieneKits: 26000,
      fieldKitchenCapacityMealsPerDay: 18000
    },
    volunteerRatioPer10kPopulation: 0.74,
    lastAuditDate: '2026-10-09',
    keyVulnerabilities: [
      'Luapan tahunan DAS Bengawan Solo menggenangi ribuan hektar lahan sawah produktif',
      'Potensi banjir bandang lahar hujan di sungai-sungai lereng Gunung Semeru',
      'Keterbatasan pasokan air bersih siap minum saat sumber sumur tercemar banjir'
    ],
    keyVulnerabilitiesEn: [
          "Annual Bengawan Solo overbank floods submerge thousands of hectares of productive agricultural paddies",
          "High-velocity cold volcanic lahar debris flow hazards along Mount Semeru drainage rivers",
          "Shortage of potable drinking water once shallow domestic wells are contaminated by flood silt"
    ],
    strategicRecommendations: [
      'Penyediaan unit mobil penjernih air (Water Treatment Unit) bergerak ke Bojonegoro dan Tuban',
      'Pasang sensor EWS early warning di bantaran hulu Bengawan Solo terintegrasi ponsel relawan',
      'Koordinasi alokasi beras cadangan pemerintah (CBP) untuk antisipasi gagal panen'
    ],
    strategicRecommendationsEn: [
          "Deploy mobile trailer-mounted water treatment units to Bojonegoro and Tuban",
          "Install connected early warning water level sensors linked to volunteer responder alerts",
          "Coordinate government emergency rice reserves to cushion smallholder crop failure"
    ]
  },
  {
    id: 'reg-sumsel',
    province: 'Sumatera Selatan',
    capitalCity: 'Palembang',
    region: 'Sumatera',
    readinessScore: 74,
    status: 'waspada',
    populationMillions: 8.7,
    fireReadiness: {
      score: 69,
      riskLevel: 'Ekstrem',
      activeHotspots: 54,
      peatlandAreaHa: 2090000,
      firefightingVolunteers: 1350,
      waterBombingBases: 1,
      manggalaAgniPosts: 9,
      canalBlocksBuilt: 1620,
      earlyWarningStatus: 'Siaga Darurat Asap OKI & Banyuasin'
    },
    floodReadiness: {
      score: 79,
      riskLevel: 'Sedang',
      floodPronePoints: 52,
      drainagePumpCapacityM3s: 22,
      rubberBoatsAvailable: 70,
      waterRescueVolunteers: 640,
      evacuationShelters: 40,
      earlyWarningStatus: 'Waspada Luapan Sungai Musi'
    },
    logisticsCapacity: {
      emergencyTents: 240,
      generators: 70,
      hygieneKits: 11000,
      fieldKitchenCapacityMealsPerDay: 7200
    },
    volunteerRatioPer10kPopulation: 2.3,
    lastAuditDate: '2026-10-04',
    keyVulnerabilities: [
      'Kawasan gambut Ogan Komering Ilir (OKI) luas dan rentan terbakar saat kemarau kering',
      'Arah angin membawa kabut asap langsung menuju pusat kota metropolitan Palembang',
      'Sumber air parit gambut mengering menyulitkan operasi water pumping darat'
    ],
    keyVulnerabilitiesEn: [
          "Extensive Ogan Komering Ilir (OKI) peat domes highly prone to deep smoldering during droughts",
          "Prevailing southeasterly wind vectors blow dense wildfire haze straight into Palembang metropolitan area",
          "Dry drainage ditches hinder overland high-volume pumping operations"
    ],
    strategicRecommendations: [
      'Optimalisasi teknologi modifikasi cuaca (TMC) hujan buatan bekerja sama dengan BRIN dan BMKG',
      'Peningkatan patroli gabungan udara helikopter untuk deteksi dini titik api sebelum membesar',
      'Distribusi masker N95 dan vitamin peningkat imun kepada anak-anak sekolah dasar'
    ],
    strategicRecommendationsEn: [
          "Optimize cloud seeding weather modification operations in coordination with BRIN and BMKG",
          "Scale up helicopter aerial reconnaissance flights to suppress spot fires before they breach tree canopy",
          "Distribute free N95 respirators and immunity vitamins to vulnerable primary school students"
    ]
  },
  {
    id: 'reg-sumbar',
    province: 'Sumatera Barat',
    capitalCity: 'Padang',
    region: 'Sumatera',
    readinessScore: 72,
    status: 'waspada',
    populationMillions: 5.6,
    fireReadiness: {
      score: 86,
      riskLevel: 'Rendah',
      activeHotspots: 3,
      peatlandAreaHa: 120000,
      firefightingVolunteers: 450,
      waterBombingBases: 0,
      manggalaAgniPosts: 2,
      canalBlocksBuilt: 110,
      earlyWarningStatus: 'Normal'
    },
    floodReadiness: {
      score: 59,
      riskLevel: 'Ekstrem',
      floodPronePoints: 92,
      drainagePumpCapacityM3s: 16,
      rubberBoatsAvailable: 58,
      waterRescueVolunteers: 890,
      evacuationShelters: 48,
      earlyWarningStatus: 'Tanggap Darurat: Banjir Bandang Galodo Marapi Agam'
    },
    logisticsCapacity: {
      emergencyTents: 220,
      generators: 56,
      hygieneKits: 9800,
      fieldKitchenCapacityMealsPerDay: 6800
    },
    volunteerRatioPer10kPopulation: 2.4,
    lastAuditDate: '2026-10-07',
    keyVulnerabilities: [
      'Timbunan jutaan kubik material lahar hujan di lereng Gunung Marapi siap menerjang jika hujan lebat',
      'Banjir bandang galodo membawa batu besar dan batang pohon yang merusak jembatan dan rumah',
      'Topografi perbukitan curam rawan memutus akses jalur evakuasi antar nagari'
    ],
    keyVulnerabilitiesEn: [
          "Millions of cubic meters of volcanic sediment on Mount Marapi slopes primed for flash lahar torrents",
          "Galodo boulder flows capable of crushing concrete bridges and burying agrarian villages",
          "Steep hill terrain prone to road severing, cutting off emergency evacuation corridors"
    ],
    strategicRecommendations: [
      'Pembangunan sabo dam darurat dan pengerukan alur sungai lahar dingin',
      'Pemberlakuan zona merah larangan bermukim 500 meter dari sempadan sungai berhulu Marapi',
      'Pemasangan sensor getaran seismik dan sirene peringatan dini lahar dingin'
    ],
    strategicRecommendationsEn: [
          "Construct emergency debris sabo dams and dredge lahar riverbeds continuously",
          "Enforce 500-meter mandatory evacuation buffer zones from active Marapi-originating riverbanks",
          "Install seismic ground vibration geophones and automated downstream acoustic sirens"
    ]
  },
  {
    id: 'reg-kalsel',
    province: 'Kalimantan Selatan',
    capitalCity: 'Banjarmasin',
    region: 'Kalimantan',
    readinessScore: 75,
    status: 'waspada',
    populationMillions: 4.2,
    fireReadiness: {
      score: 74,
      riskLevel: 'Tinggi',
      activeHotspots: 28,
      peatlandAreaHa: 105000,
      firefightingVolunteers: 820,
      waterBombingBases: 1,
      manggalaAgniPosts: 4,
      canalBlocksBuilt: 520,
      earlyWarningStatus: 'Waspada Karhutla Ring 1 Bandara Syamsudin Noor'
    },
    floodReadiness: {
      score: 76,
      riskLevel: 'Tinggi',
      floodPronePoints: 88,
      drainagePumpCapacityM3s: 24,
      rubberBoatsAvailable: 66,
      waterRescueVolunteers: 710,
      evacuationShelters: 39,
      earlyWarningStatus: 'Waspada Luapan DAS Barito & Martapura'
    },
    logisticsCapacity: {
      emergencyTents: 195,
      generators: 50,
      hygieneKits: 8200,
      fieldKitchenCapacityMealsPerDay: 5800
    },
    volunteerRatioPer10kPopulation: 3.6,
    lastAuditDate: '2026-09-29',
    keyVulnerabilities: [
      'Kebakaran lahan semak gambut di sekitar bandara Syamsudin Noor kerap mengganggu jadwal penerbangan',
      'Banjir pasang surut sungai Barito dan Martapura yang merendam rumah panggung hingga berhari-hari',
      'Degradasi daerah tangkapan air pegunungan Meratus meningkatkan frekuensi banjir kilat'
    ],
    keyVulnerabilitiesEn: [
          "Peat scrub fires near Syamsudin Noor International Airport repeatedly ground flight operations",
          "Tidal backflow on the Barito and Martapura rivers submerges stilt houses for days",
          "Deforestation in the Meratus mountain catchment amplifies flash runoff frequency"
    ],
    strategicRecommendations: [
      'Siagakan posko pemadam terpadu 24 jam dengan pasokan air hidran di perimeter bandara',
      'Manfaatkan perahu tradisional jukung dan armada LCR untuk dropping bantuan pangan ke pelosok rawa',
      'Revitalisasi fungsi lahan basah dan penanaman vegetasi pencegah erosi di bantaran sungai'
    ],
    strategicRecommendationsEn: [
          "Staff 24/7 dedicated fire suppression outposts with perimeter hydrant water connections at airport bounds",
          "Deploy traditional shallow-draft jukung canoes and LCR inflatables for swamp community food drops",
          "Rehabilitate wetland buffers and replant soil-binding riparian vegetation along riverbanks"
    ]
  }
];

