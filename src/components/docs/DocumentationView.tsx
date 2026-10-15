import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Radio, 
  Globe, 
  Siren, 
  HeartHandshake, 
  Shield, 
  Users, 
  Activity, 
  Award, 
  Layers, 
  FileText, 
  Sparkles, 
  IdCard, 
  WifiOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ChevronRight, 
  ChevronDown, 
  QrCode, 
  CreditCard, 
  MapPin, 
  Download, 
  Printer, 
  ExternalLink,
  Target,
  Flame,
  Volume2,
  Lock,
  UserCheck,
  RotateCcw,
  SlidersHorizontal,
  Compass,
  Cpu,
  Zap,
  Check
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { NavTab } from '../layout/Navbar.tsx';

interface DocumentationViewProps {
  onNavigateToTab: (tab: NavTab) => void;
}

type GuideRole = 'all' | 'coordinator' | 'volunteer' | 'citizen' | 'donor';

export const DocumentationView: React.FC<DocumentationViewProps> = ({
  onNavigateToTab
}) => {
  const { language } = useLanguage();
  const { effectiveRole } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<GuideRole>('all');
  const [activeSectionId, setActiveSectionId] = useState<string>('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');

  // Documentation guides dataset
  const guides = useMemo(() => [
    {
      id: 'macro-map',
      tabId: 'macro-map' as NavTab,
      title: language === 'id' ? '1. Peta Makro Bencana Nasional' : '1. National Macro Disaster Map',
      tagline: language === 'id' ? 'Pemantauan sebaran gempa, banjir, dan cuaca ekstrem se-Indonesia' : 'Nationwide monitoring of earthquakes, floods, and severe weather',
      roles: ['coordinator', 'citizen', 'volunteer'] as GuideRole[],
      roleBadge: language === 'id' ? 'Semua Pengguna' : 'All Users',
      roleBadgeColor: 'bg-blue-950 text-blue-300 border-blue-800',
      icon: Globe,
      iconColor: 'text-red-400',
      summary: language === 'id'
        ? 'Peta besar interaktif yang mengintegrasikan data peringatan dini BMKG terkini dengan sebaran titik krisis aktif di seluruh nusantara.'
        : 'Interactive overview map integrating live BMKG early warning telemetry with crisis clusters across Indonesia.',
      steps: [
        {
          num: '01',
          title: language === 'id' ? 'Buka Tab Peta Makro' : 'Open Macro Map Tab',
          desc: language === 'id' ? 'Pilih tab "Peta Makro" di bilah navigasi utama untuk memuat visualisasi sebaran bencana nasional.' : 'Click "Macro Map" on the navigation bar to render the national crisis cluster map.'
        },
        {
          num: '02',
          title: language === 'id' ? 'Filter Berdasarkan Wilayah Pulau' : 'Filter by Island Region',
          desc: language === 'id' ? 'Gunakan tombol filter pulau (Jawa, Sumatera, Kalimantan, Sulawesi, Papua, Nusa Tenggara) untuk mempersempit area fokus pengawasan.' : 'Use island filter buttons (Java, Sumatra, Kalimantan, Sulawesi, etc.) to narrow your operational radius.'
        },
        {
          num: '03',
          title: language === 'id' ? 'Periksa Banner Telemetri BMKG' : 'Inspect BMKG Telemetry Banner',
          desc: language === 'id' ? 'Banner atas menampilkan gempa terbaru (magnitudo, kedalaman, potensi tsunami) dan peringatan cuaca buruk yang diperbarui otomatis.' : 'The top ticker displays live earthquake telemetry (magnitude, depth, tsunami warnings) and storm alerts.'
        },
        {
          num: '04',
          title: language === 'id' ? 'Klik Marker Bencana untuk Detail' : 'Click Disaster Markers for Details',
          desc: language === 'id' ? 'Klik ikon bencana pada peta atau kartu daftar di sebelah kanan untuk melihat jumlah korban, radius terdampak, dan posko aktif.' : 'Click disaster map pins or list items to view casualties, impact radius, and active shelter bases.'
        }
      ],
      tips: language === 'id'
        ? 'Koordinator dapat mengklik tombol "Pilih Bencana Ini" untuk langsung mengunci fokus taktis operasi dan membuka modul dispatch.'
        : 'Coordinators can click "Select Disaster" to automatically set the active focal operational context.',
      actionText: language === 'id' ? 'Buka Peta Makro' : 'Open Macro Map'
    },
    {
      id: 'early-warning',
      tabId: 'early-warning' as NavTab,
      title: language === 'id' ? '2. Sistem Peringatan Dini (EWS) & Evakuasi Warga' : '2. Community Early Warning System & Evacuation',
      tagline: language === 'id' ? 'Sirene audio bahaya, hitung mundur evakuasi, dan lapor aman (SOS)' : 'Audio emergency sirens, evacuation countdown, and citizen safety check-ins',
      roles: ['citizen', 'coordinator'] as GuideRole[],
      roleBadge: language === 'id' ? 'Warga & Komunitas' : 'Citizens & Community',
      roleBadgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
      icon: Siren,
      iconColor: 'text-rose-400',
      summary: language === 'id'
        ? 'Fitur perlindungan masyarakat yang mengukur radius bahaya GPS secara instan, membunyikan sirene audio frekuensi tinggi, serta menyediakan pelaporan mandiri "Saya Aman".'
        : 'Citizen protection portal calculating GPS hazard buffer distance, synthesizing Web Audio emergency sirens, and recording "I am Safe" check-ins.',
      steps: [
        {
          num: '01',
          title: language === 'id' ? 'Akses Modul Early Warning' : 'Access Early Warning Module',
          desc: language === 'id' ? 'Buka tab "EWS Publik" atau klik tombol darurat di banner atas saat bencana terjadi.' : 'Navigate to "EWS Alert" or click the emergency badge in the top navigation.'
        },
        {
          num: '02',
          title: language === 'id' ? 'Deteksi Jarak Radius Bahaya' : 'Detect Hazard Buffer Distance',
          desc: language === 'id' ? 'Sistem menggunakan Geolocation untuk menghitung jarak Anda ke titik bencana (misal: 12 km dari episentrum). Status otomatis berwarna Kuning (Siaga) atau Merah (Awas).' : 'The system uses Geolocation to determine your distance to danger zones (e.g. 12 km from flood bank).'
        },
        {
          num: '03',
          title: language === 'id' ? 'Uji Coba Sirine Evakuasi Darurat' : 'Test Emergency Evacuation Siren',
          desc: language === 'id' ? 'Klik tombol "Bunyikan Sirine Evakuasi". Sirine berbunyi kencang melalui Web Audio API peramban tanpa memerlukan unduhan berkas audio berat.' : 'Click "Sound Siren". The Web Audio API synthesizes a 440-880Hz alert tone directly in the browser.'
        },
        {
          num: '04',
          title: language === 'id' ? 'Lapor Mandiri "Check-in Saya Aman"' : 'Submit "I am Safe" Check-in',
          desc: language === 'id' ? 'Klik tombol "Lapor Status Saya Aman / Butuh Bantuan" untuk mengirimkan nama, jumlah anggota keluarga, dan kondisi fisik ke posko komando.' : 'Click "Report I am Safe" to inform incident command and family members of your evacuation status.'
        },
        {
          num: '05',
          title: language === 'id' ? 'Ikuti Rute ke Titik Kumpul Aman' : 'Follow Safe Assembly Route',
          desc: language === 'id' ? 'Lihat rekomendasi balai desa, stadion, atau gedung tinggi terdekat yang telah diverifikasi aman dari ancaman bencana lanjutan.' : 'Consult verified assembly zones, sports stadiums, and elevated community centers free from flood risks.'
        }
      ],
      tips: language === 'id'
        ? 'Warga tidak perlu menginstal aplikasi dari app store; modul EWS dapat langsung dibuka dan dibunyikan dari browser Chrome/Safari di smartphone apa pun.'
        : 'Citizens need not install native apps; the EWS synthesizer works instantly across any smartphone web browser.',
      actionText: language === 'id' ? 'Uji Coba Sistem Early Warning' : 'Test Early Warning System'
    },
    {
      id: 'donations',
      tabId: 'donations' as NavTab,
      title: language === 'id' ? '3. Donasi Bencana Terbuka & Kuitansi Digital' : '3. Transparent Disaster Crowdfunding & Receipts',
      tagline: language === 'id' ? 'Penggalangan dana terverifikasi via QRIS & Virtual Account dengan alokasi transparan 100%' : 'Verified fundraising via QRIS & Virtual Accounts with 100% open fund allocations',
      roles: ['donor', 'citizen', 'coordinator'] as GuideRole[],
      roleBadge: language === 'id' ? 'Donatur & Publik' : 'Donors & Public',
      roleBadgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
      icon: HeartHandshake,
      iconColor: 'text-pink-400',
      summary: language === 'id'
        ? 'Platform donasi darurat bencana yang menjamin akuntabilitas penyaluran bantuan melalui formula alokasi terbuka (40% Pangan, 30% Medis, 20% Shelter, 10% Operasional) dan kuitansi digital instan.'
        : 'Emergency crowdfunding platform ensuring accountability via open allocation formulas and instant digital donation receipts.',
      steps: [
        {
          num: '01',
          title: language === 'id' ? 'Pilih Kampanye Bencana Aktif' : 'Select Active Disaster Campaign',
          desc: language === 'id' ? 'Buka tab "Donasi" dan pilih bencana yang membutuhkan bantuan mendesak (misal: Banjir Ciliwung atau Gempa Cianjur).' : 'Open "Donations" tab and choose a crisis relief campaign requiring emergency funds.'
        },
        {
          num: '02',
          title: language === 'id' ? 'Klik Tombol "Donasi Sekarang"' : 'Click "Donate Now"',
          desc: language === 'id' ? 'Pilih nominal donasi cepat (Rp 25.000, Rp 50.000, Rp 100.000, Rp 500.000) atau masukkan jumlah kustom sesuai kerelaan Anda.' : 'Choose a quick donation tier (IDR 25k, 50k, 100k, 500k) or input a custom amount.'
        },
        {
          num: '03',
          title: language === 'id' ? 'Pilih Metode Pembayaran QRIS / VA' : 'Choose QRIS or Virtual Account',
          desc: language === 'id' ? 'Tersedia QRIS Nasional instan (DANA, GoPay, OVO, ShopeePay) serta Virtual Account bank resmi (BCA, Mandiri, BRI, BNI) tanpa biaya tersembunyi.' : 'Select QRIS for e-wallet scans or automated 24/7 Virtual Accounts from major national banks.'
        },
        {
          num: '04',
          title: language === 'id' ? 'Konfirmasi Pembayaran & Simpan Kuitansi' : 'Confirm & Save Official Receipt',
          desc: language === 'id' ? 'Setelah transfer berhasil, modal kuitansi resmi terbuka otomatis. Anda dapat mengunduh atau mencetak tanda terima dengan stempel verifikasi SIGAP.' : 'Upon completion, a digital receipt modal displays unique transaction hashes and printable certificates.'
        },
        {
          num: '05',
          title: language === 'id' ? 'Pantau Live Feed & Alokasi Dana' : 'Track Live Feed & Breakdown',
          desc: language === 'id' ? 'Nama donatur (atau Hamba Allah) dan doa langsung muncul di feed donasi publik bersama grafik alokasi penggunaan dana.' : 'Your contribution appears in the public live feed alongside transparent 40-30-20-10 allocation metrics.'
        }
      ],
      tips: language === 'id'
        ? 'Seluruh transaksi donasi tersinkronisasi otomatis ke Firebase Cloud Firestore untuk menjamin auditabilitas nirlaba publik.'
        : 'All contributions synchronize with Firebase Cloud Firestore for real-time auditability.',
      actionText: language === 'id' ? 'Buka Portal Donasi Bencana' : 'Open Disaster Donations'
    },
    {
      id: 'tactical-map',
      tabId: 'map' as NavTab,
      title: language === 'id' ? '4. Peta Taktis Operasi & Telemetri Live GPS' : '4. Tactical Command Map & Live GPS Telemetry',
      tagline: language === 'id' ? 'Pencocokan AI Gemini 3.8 Flash, pelacakan relawan, sitrep, dan siaran WA' : 'Gemini 3.8 Flash AI matching, volunteer tracking, sitrep, and WA broadcast',
      roles: ['coordinator', 'volunteer'] as GuideRole[],
      roleBadge: language === 'id' ? 'Khusus Koordinator' : 'Coordinators Only',
      roleBadgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
      icon: Radio,
      iconColor: 'text-blue-400',
      summary: language === 'id'
        ? 'Pusat komando taktis untuk memantau pergerakan relawan di zona merah, merekrut personel terbaik dengan AI Matchmaking, menyusun Laporan Situasi (SitRep), dan menyiarkan perintah evakuasi.'
        : 'Operational command deck tracking live responder telemetry, executing AI Matchmaking, compiling SitReps, and sending broadcasts.',
      steps: [
        {
          num: '01',
          title: language === 'id' ? 'Buka Tab Peta Taktis' : 'Open Tactical Map Tab',
          desc: language === 'id' ? 'Pastikan Anda dalam peran Koordinator Posko. Peta menampilkan zona bahaya merah, radius evakuasi, dan posisi real-time relawan.' : 'Ensure Coordinator role. The map displays danger perimeters, hazard buffers, and responder markers.'
        },
        {
          num: '02',
          title: language === 'id' ? 'Jalankan Pencocokan AI (Gemini Match)' : 'Execute Gemini AI Matchmaking',
          desc: language === 'id' ? 'Klik tombol "🧠 AI Matching". Gemini 3.8 Flash memeringkatkan relawan terbaik berdasarkan kecocokan keahlian spesialis, jarak GPS, ketersediaan, dan jam terbang.' : 'Click "🧠 AI Matching" to let Gemini 3.8 Flash score candidates across skills, proximity, availability, and flight hours.'
        },
        {
          num: '03',
          title: language === 'id' ? 'Aktifkan Panel Pelacakan Live GPS' : 'Enable Live GPS Telemetry Panel',
          desc: language === 'id' ? 'Pilih seorang relawan di peta untuk memantau breadcrumb rute bergerak, kecepatan km/jam, daya baterai gawai, frekuensi radio HT, dan denyut nadi.' : 'Select a field responder to view breadcrumb GPS trails, velocity, battery, radio channels, and heart rates.'
        },
        {
          num: '04',
          title: language === 'id' ? 'Buat Laporan Situasi Resmi (SitRep)' : 'Generate Official SitRep Draft',
          desc: language === 'id' ? 'Klik tombol "📋 Buat SitRep". Sistem menyusun draf Laporan Situasi operasional terstruktur Bahasa Indonesia siap salin untuk BPBD dan pimpinan SAR.' : 'Click "📋 Create SitRep" to draft structured disaster situation reports in Bahasa Indonesia.'
        },
        {
          num: '05',
          title: language === 'id' ? 'Kirim Siaran Darurat (WA Broadcast)' : 'Send WhatsApp Mobilization Broadcast',
          desc: language === 'id' ? 'Klik tombol "📢 Broadcast" untuk memformat instruksi mobilisasi lapangan satu-sentuhan yang langsung terhubung ke grup WhatsApp tim lapangan.' : 'Click "📢 Broadcast" to generate instant mobilization messages pre-formatted for WhatsApp groups.'
        }
      ],
      tips: language === 'id'
        ? 'Anda dapat beralih antara Leaflet Cluster Engine (peta satelit / dark tile) dan Interactive Canvas Engine sesuai kenyamanan perangkat Anda.'
        : 'Toggle between Leaflet Cluster and Interactive Canvas engines via the top control bar.',
      actionText: language === 'id' ? 'Buka Peta Taktis Operasi' : 'Open Tactical Map'
    },
    {
      id: 'volunteers',
      tabId: 'volunteers' as NavTab,
      title: language === 'id' ? '5. Direktori Relawan & Filter Keahlian Spesialis' : '5. Volunteer Directory & Skill-Based Filtering',
      tagline: language === 'id' ? 'Penyaringan instan relawan bersertifikasi Medis, SAR, Logistik, dan Transportasi' : 'Instant filtering for volunteers certified in Medical, SAR, Logistics, and Transport',
      roles: ['coordinator'] as GuideRole[],
      roleBadge: language === 'id' ? 'Khusus Koordinator' : 'Coordinators Only',
      roleBadgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
      icon: Shield,
      iconColor: 'text-cyan-400',
      summary: language === 'id'
        ? 'Direktori lengkap seluruh personel terdaftar dengan sistem penyaringan multi-kategori keahlian, status ketersediaan, korps (SAR vs Warga), dan tingkat sertifikasi.'
        : 'Comprehensive personnel database equipped with multi-category skill filters, availability toggles, corps types, and proficiency rankings.',
      steps: [
        {
          num: '01',
          title: language === 'id' ? 'Buka Tab Data Relawan' : 'Open Volunteers Tab',
          desc: language === 'id' ? 'Daftar menampilkan seluruh relawan terverifikasi beserta keahlian, kota domisili, dan status siaga.' : 'View all registered responders with verified skills, city locations, and readiness status.'
        },
        {
          num: '02',
          title: language === 'id' ? 'Pilih Kategori Keahlian (Medis, SAR, Logistik)' : 'Select Skill Category Filter',
          desc: language === 'id' ? 'Klik tombol kategori di bar atas: Medis (Stetoskop), SAR (Pelampung), Logistik (Paket), Transportasi (Truk), atau Sanitasi WASH.' : 'Click category tabs to instantly filter by Medical, SAR, Logistics, Transport, or WASH.'
        },
        {
          num: '03',
          title: language === 'id' ? 'Gunakan Preset Darurat Cepat' : 'Apply Emergency Quick Presets',
          desc: language === 'id' ? 'Klik tombol preset darurat: "🌊 SAR Air" (menyaring Water Rescue + Perahu LCR) atau "🩺 Medis Trauma" (Dokter + Paramedis).' : 'Use quick presets like "SAR Air" or "Medis Trauma" to prepare immediate specialized squads.'
        },
        {
          num: '04',
          title: language === 'id' ? 'Ubah Status Kesiagaan Personel' : 'Update Volunteer Readiness Status',
          desc: language === 'id' ? 'Koordinator dapat langsung mengubah status relawan antara "Siaga", "Bertugas", atau "Offline" melalui menu dropdown pada kartu.' : 'Coordinators can toggle volunteer statuses between Ready, Busy, or Offline via card dropdowns.'
        }
      ],
      tips: language === 'id'
        ? 'Keahlian relawan yang cocok dengan filter yang Anda pilih akan disorot dengan warna biru terang dan indikator aktif agar mudah diverifikasi.'
        : 'Matched skills glow with prominent blue styling and active indicators for rapid visual verification.',
      actionText: language === 'id' ? 'Buka Direktori Relawan' : 'Open Volunteer Directory'
    },
    {
      id: 'volunteer-portal',
      tabId: 'volunteer-portal' as NavTab,
      title: language === 'id' ? '6. Portal Relawan Mandiri & KTA Digital QR' : '6. Volunteer Portal & Digital QR ID Badge',
      tagline: language === 'id' ? 'Kartu tanda anggota resmi ber-QR, pelaporan situasi lapangan, dan kesiapan tugas' : 'Official digital ID card with QR verification, field incident reporting, and readiness',
      roles: ['volunteer'] as GuideRole[],
      roleBadge: language === 'id' ? 'Khusus Relawan' : 'Volunteers Only',
      roleBadgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
      icon: IdCard,
      iconColor: 'text-emerald-400',
      summary: language === 'id'
        ? 'Area pribadi relawan untuk menampilkan KTA Digital terverifikasi QR, mengubah ketersediaan mobilisasi, serta mengirimkan laporan situasi lapangan secara mandiri.'
        : 'Personal dashboard for volunteers featuring QR-verified ID cards, readiness toggles, and incident reporting forms.',
      steps: [
        {
          num: '01',
          title: language === 'id' ? 'Buka Tab Portal Relawan' : 'Open Volunteer Portal',
          desc: language === 'id' ? 'Pastikan Anda login atau berada dalam peran Relawan. Kartu Tanda Anggota (KTA) digital Anda akan langsung ditampilkan.' : 'Switch to Volunteer role. Your official digital credential badge renders immediately.'
        },
        {
          num: '02',
          title: language === 'id' ? 'Tunjukkan QR Code untuk Verifikasi Posko' : 'Show QR Code for Post Verification',
          desc: language === 'id' ? 'Di posko lapangan, tunjukkan QR Code pada kartu Anda kepada koordinator untuk memindai keabsahan identitas dan sertifikasi Anda.' : 'Present your digital QR badge at field checkpoints for rapid identity and credential verification.'
        },
        {
          num: '03',
          title: language === 'id' ? 'Kirim Laporan Situasi Lapangan (SitRep Warga)' : 'Submit Field Incident Report',
          desc: language === 'id' ? 'Gunakan formulir laporan di portal untuk mengabarkan kenaikan air, korban yang membutuhkan pertolongan medis, atau kerusakan jembatan.' : 'Use the reporting form to dispatch real-time field observations, road blockages, and medical emergencies.'
        }
      ],
      tips: language === 'id'
        ? 'KTA digital dapat disimpan sebagai bookmark di ponsel dan tetap dapat ditampilkan meski tanpa koneksi internet berkat dukungan PWA cache.'
        : 'The digital badge remains accessible offline through PWA caching.',
      actionText: language === 'id' ? 'Buka Portal Relawan' : 'Open Volunteer Portal'
    },
    {
      id: 'volunteer-map',
      tabId: 'volunteer-map' as NavTab,
      title: language === 'id' ? '7. Peta Relawan & Manajer Cache Offline (PWA)' : '7. Volunteer Map & Offline Map Tile Cache (PWA)',
      tagline: language === 'id' ? 'Pra-unduh ratusan tile peta taktis ke peramban sebelum melintasi blank spot' : 'Pre-download hundreds of tactical map tiles to browser before entering dead zones',
      roles: ['volunteer', 'coordinator'] as GuideRole[],
      roleBadge: language === 'id' ? 'Relawan & Koordinator' : 'Responders & Command',
      roleBadgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
      icon: WifiOff,
      iconColor: 'text-amber-400',
      summary: language === 'id'
        ? 'Modul ketahanan offline berbasis teknologi Workbox Service Worker yang memungkinkan tim lapangan mengunduh paket tile peta taktis OpenStreetMap/ArcGIS dan nomor kontak posko.'
        : 'Offline-first resilience powered by Workbox Service Worker, allowing teams to pre-download tactical map tiles and emergency manifests.',
      steps: [
        {
          num: '01',
          title: language === 'id' ? 'Buka Tab Peta Relawan' : 'Open Volunteer Map Tab',
          desc: language === 'id' ? 'Peta menampilkan sebaran relawan aktif se-Indonesia dengan pengelompokan (clustering) marker berbasis Leaflet.' : 'Renders nationwide volunteer distribution with smooth Leaflet marker clustering.'
        },
        {
          num: '02',
          title: language === 'id' ? 'Klik Tombol "Manajer Cache Offline"' : 'Click "Offline Cache Manager"',
          desc: language === 'id' ? 'Buka modal pengelola cache peta offline di sudut atas atau bilah kontrol.' : 'Open the offline map tile manager from the top control panel.'
        },
        {
          num: '03',
          title: language === 'id' ? 'Pilih Wilayah Operasi & Unduh Tile' : 'Select Operational Zone & Download',
          desc: language === 'id' ? 'Pilih zona bencana (misal: DKI Jakarta / DAS Ciliwung) dan klik "Mulai Unduh Cache Peta". Sistem menyimpan tile peta ke CacheStorage dan IndexedDB.' : 'Select a high-risk area and click "Pre-cache Tiles". The system stores tiles in IndexedDB and CacheStorage.'
        },
        {
          num: '04',
          title: language === 'id' ? 'Uji Coba Navigasi Tanpa Internet' : 'Test Navigation in Offline Mode',
          desc: language === 'id' ? 'Matikan WiFi atau aktifkan Mode Pesawat; buka kembali peta taktis dan perhatikan peta tetap termuat mulus dengan indikator offline aktif.' : 'Switch your device to Airplane Mode; the tactical map continues rendering cached tiles smoothly.'
        }
      ],
      tips: language === 'id'
        ? 'Tile peta yang telah diunduh tersimpan aman selama 30 hari di peramban Anda tanpa memakan kuota internet saat operasi.'
        : 'Cached tiles persist for up to 30 days locally without consuming data in the field.',
      actionText: language === 'id' ? 'Buka Peta Relawan & Cache' : 'Open Map Cache'
    },
    {
      id: 'readiness',
      tabId: 'readiness' as NavTab,
      title: language === 'id' ? '8. Kesiapsiagaan Daerah & Narasi AI Prediktif' : '8. Regional Readiness & AI Predictive Narratives',
      tagline: language === 'id' ? 'Audit risiko bencana 10 provinsi, heatmap curah hujan 12 bulan, dan analisis Gemini' : '10-province disaster risk audit, 12-month rainfall heatmap, and Gemini analysis',
      roles: ['coordinator', 'all'] as GuideRole[],
      roleBadge: language === 'id' ? 'Perencanaan & Intelijen' : 'Planning & Intel',
      roleBadgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
      icon: Activity,
      iconColor: 'text-amber-400',
      summary: language === 'id'
        ? 'Modul analitika mitigasi berbasis sains untuk mengukur indeks risiko multi-bahaya (banjir, karhutla, gempa, tsunami) dan menghasilkan rekomendasi kontinjensi 72 jam.'
        : 'Science-backed mitigation analytics scoring multi-hazard risks and synthesizing 72-hour contingency protocols via Gemini AI.',
      steps: [
        {
          num: '01',
          title: language === 'id' ? 'Buka Tab Kesiapsiagaan' : 'Open Readiness Tab',
          desc: language === 'id' ? 'Menampilkan kartu audit risiko 10 provinsi prioritas di Indonesia lengkap dengan status kesiapan posko dan logistik.' : 'Displays risk audit scorecards for 10 high-risk Indonesian provinces.'
        },
        {
          num: '02',
          title: language === 'id' ? 'Pilih Provinsi untuk Dianalisis' : 'Select a Province to Audit',
          desc: language === 'id' ? 'Klik salah satu provinsi (misal: Jawa Barat, DKI Jakarta, atau Riau) untuk membedah rincian kerentanan banjir dan kebakaran hutan.' : 'Click any province to view detailed vulnerability breakdowns.'
        },
        {
          num: '03',
          title: language === 'id' ? 'Baca Narasi Prediktif AI Gemini 3.8' : 'Read Gemini AI Predictive Narrative',
          desc: language === 'id' ? 'AI menganalisis korelasi curah hujan 12 bulan dengan fenomena El Niño / La Niña dan menyajikan rekomendasi aksi pencegahan.' : 'Gemini AI evaluates 12-month rainfall against El Niño / La Niña and provides anticipatory action steps.'
        }
      ],
      tips: language === 'id'
        ? 'Gunakan narasi prediktif ini untuk menggelar rapat koordinasi mitigasi pra-bencana 30-60 hari sebelum puncak musim penghujan atau kemarau.'
        : 'Use predictive narratives to conduct anticipatory action meetings 30-60 days before hazard peaks.',
      actionText: language === 'id' ? 'Buka Kesiapsiagaan Daerah' : 'Open Regional Readiness'
    },
    {
      id: 'rewards',
      tabId: 'rewards' as NavTab,
      title: language === 'id' ? '9. Gamifikasi, Poin Misi & Penukaran Hadiah' : '9. Gamification, Mission Points & Reward Redemption',
      tagline: language === 'id' ? 'Leaderboard jam terbang, lencana keahlian, dan penukaran perlengkapan taktis' : 'Flight-hour leaderboards, skill badges, and tactical gear redemption',
      roles: ['volunteer'] as GuideRole[],
      roleBadge: language === 'id' ? 'Khusus Relawan' : 'Volunteers Only',
      roleBadgeColor: 'bg-yellow-950 text-yellow-300 border-yellow-800',
      icon: Award,
      iconColor: 'text-yellow-400',
      summary: language === 'id'
        ? 'Sistem penghargaan untuk mengapresiasi dedikasi relawan melalui poin pengalaman (XP), tingkat level, lencana pencapaian misi, dan katalog penukaran perlengkapan lapangan.'
        : 'Recognition system honoring volunteer service through XP points, level progression, badges, and gear reward redemptions.',
      steps: [
        {
          num: '01',
          title: language === 'id' ? 'Buka Tab Gamifikasi' : 'Open Gamification Tab',
          desc: language === 'id' ? 'Lihat total poin relawan Anda, jumlah jam kontribusi misi, dan peringkat di leaderboard nasional.' : 'Check your accumulated mission points, verified field hours, and national ranking.'
        },
        {
          num: '02',
          title: language === 'id' ? 'Koleksi Lencana Keahlian' : 'Collect Specialized Badges',
          desc: language === 'id' ? 'Lencana seperti "SAR Water Hero", "Medic Pro", dan "Rapid Responder" terbuka otomatis seiring banyaknya misi yang Anda selesaikan.' : 'Badges like "SAR Water Hero" or "Medic Pro" unlock as you complete assigned operations.'
        },
        {
          num: '03',
          title: language === 'id' ? 'Tukarkan Poin dengan Hadiah' : 'Redeem Points for Gear',
          desc: language === 'id' ? 'Pilih perlengkapan di katalog (rompi taktis, senter kepala darurat, pouch P3K, voucher pelatihan) dan klik "Klaim Hadiah".' : 'Browse the gear catalog (tactical vests, headlamps, first-aid pouches, training vouchers) and redeem.'
        }
      ],
      tips: language === 'id'
        ? 'Poin misi hanya dapat diperoleh dari tugas resmi yang telah diverifikasi dan disetujui selesai oleh Koordinator Posko.'
        : 'Points are granted strictly when assigned operations are confirmed completed by Post Commanders.',
      actionText: language === 'id' ? 'Buka Gamifikasi & Hadiah' : 'Open Gamification'
    },
    {
      id: 'tasks',
      tabId: 'tasks' as NavTab,
      title: language === 'id' ? '10. Manajemen Tugas Operasi & Toast Notifikasi' : '10. Task Management & Field Toast Alerts',
      tagline: language === 'id' ? 'Penerbitan tugas taktis, pelacakan progres misi, dan audio toast Pusdalops' : 'Tactical task dispatch, progress tracking, and Pusdalops audio toast alerts',
      roles: ['coordinator', 'volunteer'] as GuideRole[],
      roleBadge: language === 'id' ? 'Koordinator & Relawan' : 'Command & Responders',
      roleBadgeColor: 'bg-violet-950 text-violet-300 border-violet-800',
      icon: Layers,
      iconColor: 'text-violet-400',
      summary: language === 'id'
        ? 'Pusat manajemen penugasan darurat lapangan untuk membuat tugas operasi baru, menugaskan personel yang sesuai, dan memantau status penyelesaian secara transparan.'
        : 'Emergency task assignment desk for creating operational tickets, allocating verified specialists, and tracking completion states.',
      steps: [
        {
          num: '01',
          title: language === 'id' ? 'Buka Tab Manajemen Tugas' : 'Open Tasks Tab',
          desc: language === 'id' ? 'Menampilkan papan kolom tugas operasi: Menunggu (Pending), Sedang Berjalan (In Progress), dan Selesai (Completed).' : 'Displays operational task boards across Pending, In Progress, and Completed columns.'
        },
        {
          num: '02',
          title: language === 'id' ? 'Buat Tugas Baru (Koordinator)' : 'Create New Task (Coordinators)',
          desc: language === 'id' ? 'Klik "Buat Tugas", tentukan judul misi, bencana terkait, tingkat prioritas (Kritis/Tinggi/Sedang), dan keahlian yang dibutuhkan.' : 'Click "Create Task", specify disaster association, priority level, and required skill sets.'
        },
        {
          num: '03',
          title: language === 'id' ? 'Notifikasi Toast Darurat Muncul' : 'Emergency Field Toast Triggers',
          desc: language === 'id' ? 'Setiap tugas baru memicu banner toast darurat audio di pojok kanan atas dengan nada panggil radio Pusdalops.' : 'New tasks trigger audio-visual emergency toast notifications with Pusdalops call signs.'
        },
        {
          num: '04',
          title: language === 'id' ? 'Perbarui Progres & Selesaikan Tugas' : 'Update Progress & Complete',
          desc: language === 'id' ? 'Ubah status tugas saat tim bergerak hingga selesai untuk memicu verifikasi jam terbang dan penambahan poin relawan.' : 'Update task status as field operations progress to log verified flight hours and grant rewards.'
        }
      ],
      tips: language === 'id'
        ? 'Notifikasi toast tugas dirancang dengan z-index tinggi di atas seluruh elemen peta sehingga tidak akan tertutup saat membuka opsi lain.'
        : 'Toast notifications are layered above map controls ensuring critical alerts never get occluded.',
      actionText: language === 'id' ? 'Buka Manajemen Tugas' : 'Open Task Manager'
    },
    {
      id: 'presentation',
      tabId: 'presentation' as NavTab,
      title: language === 'id' ? '11. Presentasi Proyek & Whitepaper Eksekutif' : '11. Project Presentation & Executive Whitepaper',
      tagline: language === 'id' ? 'Paparan pitch deck resmi 9 slide, catatan presenter, dan dokumen teknis' : 'Official 9-slide pitch deck, speaker notes, and technical whitepaper documentation',
      roles: ['all'] as GuideRole[],
      roleBadge: language === 'id' ? 'Evaluasi & Presentasi' : 'Evaluation & Pitch',
      roleBadgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-800',
      icon: Sparkles,
      iconColor: 'text-indigo-400',
      summary: language === 'id'
        ? 'Deck materi presentasi lengkap mengenai visi SIGAP, 3 pilar solusi, arsitektur AI Gemini, dampak operasional di lapangan, serta roadmap mitigasi bencana 2026-2030.'
        : 'Official presentation deck articulating the SIGAP vision, 3 solution pillars, Gemini AI architecture, operational impact, and 2026-2030 roadmap.',
      steps: [
        {
          num: '01',
          title: language === 'id' ? 'Buka Tab Presentasi Proyek' : 'Open Project Presentation Tab',
          desc: language === 'id' ? 'Pilih tab "Presentasi" di navbar untuk membuka mode Slide Pitch interaktif.' : 'Navigate to "Presentation" tab to open the interactive pitch deck.'
        },
        {
          num: '02',
          title: language === 'id' ? 'Navigasi Slide & Layar Penuh' : 'Slide Navigation & Fullscreen',
          desc: language === 'id' ? 'Gunakan tombol Panah Kiri/Kanan, bilah langkah atas, atau tombol keyboard (Panah / Spasi). Tekan tombol Layar Penuh untuk presentasi proyektor.' : 'Use arrow keys, spacebar, or step chips. Toggle fullscreen mode for projector delivery.'
        },
        {
          num: '03',
          title: language === 'id' ? 'Buka Catatan Pembicara (Speaker Notes)' : 'Toggle Speaker Notes Drawer',
          desc: language === 'id' ? 'Klik tombol "Catatan Pembicara" untuk melihat poin kunci narasi, data statistik, dan panduan menjawab pertanyaan juri.' : 'Click "Speaker Notes" to open presenter talking points and defense arguments.'
        },
        {
          num: '04',
          title: language === 'id' ? 'Beralih ke Mode Dokumen Whitepaper' : 'Switch to Whitepaper Mode',
          desc: language === 'id' ? 'Klik tombol "Dokumen Whitepaper" untuk membaca paparan naratif 7 bab teknis lengkap yang dapat dicetak atau diekspor ke PDF.' : 'Switch to Whitepaper mode for in-depth executive reading and printable technical documentation.'
        }
      ],
      tips: language === 'id'
        ? 'Setiap kartu fitur di slide 4 memiliki tombol aksi langsung yang mengantar Anda mencoba fitur tersebut di aplikasi.'
        : 'Each feature card in slide 4 contains direct test links into the live modules.',
      actionText: language === 'id' ? 'Buka Materi Presentasi' : 'Open Presentation Deck'
    }
  ], [language]);

  // Frequently Asked Questions
  const faqs = useMemo(() => [
    {
      id: 'faq-1',
      question: language === 'id' ? 'Bagaimana cara mengganti peran antara Koordinator Posko dan Relawan?' : 'How do I toggle between Coordinator and Volunteer roles?',
      answer: language === 'id'
        ? 'Di sudut kanan atas navigasi, klik tombol "Role Switcher" (ikon lencana). Anda dapat memilih peran Koordinator Posko (akses penuh fitur dispatch, AI matching, sitrep, broadcast) atau Relawan Lapangan (akses portal KTA, lapor situasi, klaim reward).'
        : 'In the top right header, click the "Role Switcher" button. You can switch between Post Coordinator (full command access) and Field Volunteer (portal KTA, reporting, rewards).'
    },
    {
      id: 'faq-2',
      question: language === 'id' ? 'Apa yang terjadi jika jaringan seluler lumpuh (blank spot) di daerah bencana?' : 'What happens during a cellular blackout (blank spot) in disaster zones?',
      answer: language === 'id'
        ? 'SIGAP Koordinator dilengkapi Service Worker Workbox (PWA) dengan strategi Cache-First. Anda dapat mengunduh paket tile peta OpenStreetMap/ArcGIS dan daftar posko di tab "Peta Relawan > Manajer Cache Offline" sebelum terjun ke lapangan. Peta dan koordinat penting tetap dapat dibuka 100% tanpa internet.'
        : 'SIGAP features an offline-first Workbox Service Worker. Pre-cache high-resolution map tiles in "Volunteer Map > Offline Cache" before deployment. Tactical maps and critical manifests render 100% offline.'
    },
    {
      id: 'faq-3',
      question: language === 'id' ? 'Bagaimana sirene darurat EWS bisa berbunyi di ponsel warga tanpa unduhan audio?' : 'How does the EWS emergency siren play without downloading audio files?',
      answer: language === 'id'
        ? 'Modul Early Warning menggunakan teknologi Web Audio API bawaan peramban (synthesizer audio gelombang frekuensi 440 Hz hingga 880 Hz). Sirene dibangkitkan langsung oleh prosesor perangkat dalam waktu < 50 milidetik tanpa harus mengunduh berkas MP3 besar di jaringan darurat yang lambat.'
        : 'The EWS module uses the browser Web Audio API synthesizer, generating dual frequency modulation tones (440-880Hz) in < 50ms without downloading heavy MP3 assets over congested emergency networks.'
    },
    {
      id: 'faq-4',
      question: language === 'id' ? 'Bagaimana alokasi donasi bencana dipastikan transparan dan tidak disalahgunakan?' : 'How is donation allocation transparency guaranteed?',
      answer: language === 'id'
        ? 'Setiap donasi yang masuk melalui QRIS atau Virtual Account tercatat secara real-time di database Cloud Firestore publik. Dana secara otomatis dialokasikan sesuai rumus standar darurat BNPB/UNOCHA: 40% Bahan Pangan, 30% Medis, 20% Shelter & Sanitasi, dan 10% Operasional Relawan. Donatur langsung memperoleh kuitansi digital resmi berstempel verifikasi unik.'
        : 'All contributions via QRIS or Virtual Accounts sync in real-time to Cloud Firestore with immutable 40-30-20-10 allocation breakdowns, and donors receive verifiable digital receipts with hash seals.'
    },
    {
      id: 'faq-5',
      question: language === 'id' ? 'Apakah kunci API Gemini aman dan tidak bocor ke peramban pengguna?' : 'Is the Gemini AI API key secure against client-side inspection?',
      answer: language === 'id'
        ? 'Sangat aman. Seluruh inferensi AI (Pencocokan Cerdas, Draf SitRep, Analisis Risiko Iklim) dijalankan secara eksklusif di server backend Node.js (/api/*) melalui SDK resmi @google/genai. Kunci API hanya tersimpan di variabel lingkungan server (process.env.GEMINI_API_KEY) dan tidak pernah dikirimkan ke peramban klien.'
        : 'Strictly secure. All AI inferences run server-side via official @google/genai SDK proxies (/api/*). API keys reside exclusively in server environment variables and are never transmitted to browser clients.'
    }
  ], [language]);

  // Filter guides by role and search query
  const filteredGuides = useMemo(() => {
    return guides.filter(g => {
      // Role filter
      if (selectedRole !== 'all' && !g.roles.includes(selectedRole)) {
        return false;
      }

      // Search filter
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchesTitle = g.title.toLowerCase().includes(q);
        const matchesTagline = g.tagline.toLowerCase().includes(q);
        const matchesSummary = g.summary.toLowerCase().includes(q);
        const matchesSteps = g.steps.some(s => s.title.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q));
        if (!matchesTitle && !matchesTagline && !matchesSummary && !matchesSteps) {
          return false;
        }
      }

      return true;
    });
  }, [guides, selectedRole, searchQuery]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* =========================================================================
          HERO & SEARCH BANNER
         ========================================================================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>
              {language === 'id' 
                ? 'Buku Panduan Pengguna Resmi • SIGAP Koordinator v2.5' 
                : 'Official User Manual & Documentation • SIGAP Coordinator v2.5'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {language === 'id' 
              ? 'Panduan Lengkap Cara Pakai Semua Fitur' 
              : 'Complete System Manual & Feature Guide'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {language === 'id'
              ? 'Pelajari cara mengoperasikan seluruh modul SIGAP Koordinator secara terpadu: dari pemantauan bencana BMKG, sistem peringatan dini warga, donasi transparan, pencocokan AI Gemini, hingga peta taktis offline.'
              : 'Step-by-step instructions for operating every module in SIGAP Coordinator: from national BMKG monitoring and citizen early warnings to transparent donations and offline tactical mapping.'}
          </p>
        </div>

        {/* Search Bar + Role Filter Pills */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-4">
          <div className="relative w-full max-w-2xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'id' ? 'Cari panduan (contoh: sirine, donasi qris, ai match, offline cache, kta)...' : 'Search guide (e.g. siren, qris donation, ai match, offline cache, id card)...'}
              className="w-full pl-11 pr-10 py-3 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter by Role */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400 mr-1 uppercase tracking-wider font-mono">
              {language === 'id' ? 'Filter Peran:' : 'Filter Role:'}
            </span>
            <button
              onClick={() => setSelectedRole('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                selectedRole === 'all'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30 ring-1 ring-teal-400'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>🌟</span>
              <span>{language === 'id' ? 'Semua Fitur' : 'All Features'}</span>
            </button>
            <button
              onClick={() => setSelectedRole('coordinator')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                selectedRole === 'coordinator'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400'
                  : 'bg-slate-950 text-blue-400 hover:bg-slate-900 border border-blue-900/60'
              }`}
            >
              <span>🏛️</span>
              <span>{language === 'id' ? 'Koordinator Posko' : 'Command Post'}</span>
            </button>
            <button
              onClick={() => setSelectedRole('volunteer')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                selectedRole === 'volunteer'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400'
                  : 'bg-slate-950 text-emerald-400 hover:bg-slate-900 border border-emerald-900/60'
              }`}
            >
              <span>🦺</span>
              <span>{language === 'id' ? 'Relawan Lapangan' : 'Responders'}</span>
            </button>
            <button
              onClick={() => setSelectedRole('citizen')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                selectedRole === 'citizen'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-1 ring-rose-400'
                  : 'bg-slate-950 text-rose-400 hover:bg-slate-900 border border-rose-900/60'
              }`}
            >
              <span>👥</span>
              <span>{language === 'id' ? 'Masyarakat Awam' : 'Citizens'}</span>
            </button>
            <button
              onClick={() => setSelectedRole('donor')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                selectedRole === 'donor'
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30 ring-1 ring-pink-400'
                  : 'bg-slate-950 text-pink-400 hover:bg-slate-900 border border-pink-900/60'
              }`}
            >
              <span>💚</span>
              <span>{language === 'id' ? 'Donatur Publik' : 'Donors'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN DOCUMENTATION CONTENT (GUIDE MODULES)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sticky Table of Contents (Desktop Sidebar) */}
        <div className="lg:col-span-1 hidden lg:block space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sticky top-24 space-y-2 shadow-xl">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 px-2 py-1 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-teal-400" />
              <span>{language === 'id' ? 'Daftar Modul Panduan' : 'Guide Index'}</span>
            </h3>
            <div className="space-y-1 max-h-[calc(100vh-180px)] overflow-y-auto no-scrollbar pr-1">
              {guides.map((g) => {
                const Icon = g.icon;
                return (
                  <a
                    key={g.id}
                    href={`#guide-${g.id}`}
                    className="px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-2 group block"
                  >
                    <Icon className={`w-3.5 h-3.5 ${g.iconColor} shrink-0 group-hover:scale-110 transition`} />
                    <span className="truncate">{g.title.split('.')[1] || g.title}</span>
                  </a>
                );
              })}
              <a
                href="#section-faq"
                className="px-2.5 py-2 rounded-xl text-xs font-semibold text-teal-400 hover:text-teal-300 hover:bg-slate-800 transition flex items-center gap-2 block border-t border-slate-800/80 pt-2"
              >
                <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{language === 'id' ? 'Tanya Jawab (FAQ)' : 'FAQ & Troubleshooting'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Guides List */}
        <div className="lg:col-span-3 space-y-8">
          {filteredGuides.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
              <HelpCircle className="w-8 h-8 text-slate-500 mx-auto" />
              <h4 className="text-white font-bold text-sm">
                {language === 'id' ? 'Tidak ditemukan panduan yang cocok' : 'No guides match your search criteria'}
              </h4>
              <p className="text-slate-400 text-xs max-w-sm mx-auto">
                {language === 'id' 
                  ? 'Coba ganti kata kunci pencarian atau reset filter peran di atas.' 
                  : 'Try adjusting your search terms or reset the role filter.'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRole('all');
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition"
              >
                {language === 'id' ? 'Tampilkan Semua Panduan' : 'Show All Guides'}
              </button>
            </div>
          ) : (
            filteredGuides.map((guide) => {
              const Icon = guide.icon;

              return (
                <div
                  key={guide.id}
                  id={`guide-${guide.id}`}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden transition-all hover:border-slate-700"
                >
                  {/* Card Header: Icon + Title + Role Badge + Action Button */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner">
                        <Icon className={`w-6 h-6 ${guide.iconColor}`} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                            {guide.title}
                          </h2>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${guide.roleBadgeColor}`}>
                            {guide.roleBadge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">
                          {guide.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Direct Try Feature Button */}
                    <button
                      onClick={() => onNavigateToTab(guide.tabId)}
                      className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-teal-600/30 shrink-0 self-start sm:self-auto group"
                    >
                      <span>{guide.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                    </button>
                  </div>

                  {/* Overview Summary */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                    {guide.summary}
                  </p>

                  {/* Step-by-Step Instructions */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                      {language === 'id' ? 'Langkah Demi Langkah Penggunaan:' : 'Step-by-Step Usage Guide:'}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {guide.steps.map((st, sIdx) => (
                        <div key={sIdx} className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 space-y-1.5 flex flex-col justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 text-teal-400 font-mono font-black text-[11px] flex items-center justify-center shrink-0">
                              {st.num}
                            </span>
                            <h4 className="text-xs font-bold text-white line-clamp-1">{st.title}</h4>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed pl-8">
                            {st.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pro Tip Box */}
                  <div className="p-3.5 bg-teal-950/30 border border-teal-900/50 rounded-xl text-xs text-teal-200 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-bold mb-0.5">
                        {language === 'id' ? '💡 Tips Taktis:' : '💡 Pro Tip:'}
                      </strong>
                      <span className="text-teal-200/90 leading-relaxed">{guide.tips}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* =========================================================================
              FREQUENTLY ASKED QUESTIONS (FAQ) SECTION
             ========================================================================= */}
          <div id="section-faq" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>{language === 'id' ? 'Pertanyaan yang Sering Diajukan' : 'Frequently Asked Questions'}</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {language === 'id' ? 'Tanya Jawab & Pemecahan Masalah' : 'FAQ & Troubleshooting Guide'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {language === 'id'
                  ? 'Jawaban cepat untuk pertanyaan teknis, privasi data, dan prosedur operasi standar di lapangan.'
                  : 'Quick answers regarding technical architecture, data privacy, and field SOPs.'}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {faqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden transition"
                  >
                    <button
                      onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white hover:text-teal-300 transition"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isExpanded ? 'rotate-180 text-teal-400' : ''}`} />
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-5 sm:px-5 text-xs text-slate-300 leading-relaxed border-t border-slate-900 pt-3 animate-in fade-in duration-150">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
