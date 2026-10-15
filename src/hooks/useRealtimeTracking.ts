import { useState, useEffect, useRef, useCallback } from 'react';
import { Volunteer, Task, Disaster, VolunteerTrackingTelemetry } from '../types/index.ts';
import { calculateDistance, calculateBearing } from '../lib/geo.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface WaypointRoute {
  volunteerId: string;
  volunteerName: string;
  phone: string;
  avatar?: string;
  organization: string;
  category: 'sar_official' | 'public_community';
  sarUnitOrRole: string;
  dutyType: string;
  assignedTaskId: string;
  assignedTaskTitle: string;
  disasterId: string;
  disasterTitle: string;
  destinationName: string;
  destinationLat: number;
  destinationLng: number;
  baseSpeedKmh: number;
  waypoints: [number, number][]; // loop or patrol coordinates
}

// Pre-configured realistic patrol and response routes in the active flood response zone (Kampung Melayu & Ciliwung)
const INITIAL_ROUTES: WaypointRoute[] = [
  {
    volunteerId: 'vol-02',
    volunteerName: 'Budi Santoso (Basarnas USAR)',
    phone: '0811-9283-771',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    organization: 'Basarnas Kantor SAR Jakarta',
    category: 'sar_official',
    sarUnitOrRole: 'Komandan Regu LCR Water Rescue',
    dutyType: 'Penyisiran Lorong & Evakuasi Air',
    assignedTaskId: 'task-1-1',
    assignedTaskTitle: 'Evakuasi Balita dan Lansia Terjebak Genangan 2.5m di RW 02',
    disasterId: 'disaster-1',
    disasterTitle: 'Banjir Luapan Kali Ciliwung Kampung Melayu',
    destinationName: 'Titik Evakuasi Gang Arus RW 02',
    destinationLat: -6.2248,
    destinationLng: 106.8630,
    baseSpeedKmh: 14.5,
    waypoints: [
      [-6.2230, 106.8590],
      [-6.2238, 106.8605],
      [-6.2245, 106.8618],
      [-6.2248, 106.8630],
      [-6.2255, 106.8638],
      [-6.2262, 106.8632],
      [-6.2258, 106.8615],
      [-6.2242, 106.8600],
      [-6.2230, 106.8590]
    ]
  },
  {
    volunteerId: 'vol-04',
    volunteerName: 'Maya Indah Prameswari',
    phone: '0813-1415-9265',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    organization: 'Potensi SAR Girigahana',
    category: 'sar_official',
    sarUnitOrRole: 'Rescue Dayung LCR & Medis Lapangan',
    dutyType: 'Penjangkauan Medis Darurat',
    assignedTaskId: 'task-1-3',
    assignedTaskTitle: 'Pemeriksaan Kesehatan Kulit, Hipotermia, dan Diare Posko 1',
    disasterId: 'disaster-1',
    disasterTitle: 'Banjir Luapan Kali Ciliwung Kampung Melayu',
    destinationName: 'Posko Gedung Sasana Krida Remaja',
    destinationLat: -6.2255,
    destinationLng: 106.8615,
    baseSpeedKmh: 11.2,
    waypoints: [
      [-6.2275, 106.8580],
      [-6.2270, 106.8592],
      [-6.2264, 106.8605],
      [-6.2255, 106.8615],
      [-6.2249, 106.8622],
      [-6.2252, 106.8630],
      [-6.2265, 106.8612],
      [-6.2275, 106.8580]
    ]
  },
  {
    volunteerId: 'vol-05',
    volunteerName: 'Eko Prasetyo (Callsign YC0HKB)',
    phone: '0818-0987-6543',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    organization: 'ORARI Daerah DKI Jakarta',
    category: 'public_community',
    sarUnitOrRole: 'Mobile Command Radio Repeater Unit',
    dutyType: 'Mobilisasi Repeater & Jaringan Komunikasi',
    assignedTaskId: 'task-1-5',
    assignedTaskTitle: 'Dukungan Komunikasi Radio VHF/UHF Darurat Pusdalops',
    disasterId: 'disaster-1',
    disasterTitle: 'Banjir Luapan Kali Ciliwung Kampung Melayu',
    destinationName: 'Posko Kelurahan Kampung Melayu',
    destinationLat: -6.2260,
    destinationLng: 106.8610,
    baseSpeedKmh: 28.0,
    waypoints: [
      [-6.2205, 106.8550],
      [-6.2220, 106.8570],
      [-6.2240, 106.8585],
      [-6.2255, 106.8598],
      [-6.2260, 106.8610],
      [-6.2268, 106.8625],
      [-6.2250, 106.8580],
      [-6.2220, 106.8560],
      [-6.2205, 106.8550]
    ]
  },
  {
    volunteerId: 'vol-12',
    volunteerName: 'Dewi Anggraini',
    phone: '0856-7788-9911',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    organization: 'Dapur Umum Ibu Siaga',
    category: 'public_community',
    sarUnitOrRole: 'Koordinator Distribusi Pangan Hangat',
    dutyType: 'Distribusi 500 Nasi Bungkus Pengungsi',
    assignedTaskId: 'task-1-2',
    assignedTaskTitle: 'Operasional Dapur Umum Posko Kantor Kelurahan (1.500 Nasi Bungkus)',
    disasterId: 'disaster-1',
    disasterTitle: 'Banjir Luapan Kali Ciliwung Kampung Melayu',
    destinationName: 'Kantor Kelurahan Kampung Melayu',
    destinationLat: -6.2260,
    destinationLng: 106.8610,
    baseSpeedKmh: 16.8,
    waypoints: [
      [-6.2285, 106.8640],
      [-6.2278, 106.8630],
      [-6.2268, 106.8620],
      [-6.2260, 106.8610],
      [-6.2250, 106.8605],
      [-6.2260, 106.8610],
      [-6.2272, 106.8628],
      [-6.2285, 106.8640]
    ]
  },
  {
    volunteerId: 'vol-50',
    volunteerName: 'Zulkifli Lubis',
    phone: '0813-8811-2299',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    organization: 'Warga Tanggap Bencana RW 02',
    category: 'public_community',
    sarUnitOrRole: 'Perahu Jukung Patroli Swadaya',
    dutyType: 'Distribusi Logistik Air & Selimut Pintu ke Pintu',
    assignedTaskId: 'task-1-4',
    assignedTaskTitle: 'Distribusi Air Mineral dan Makanan Kering via Perahu Dayung',
    disasterId: 'disaster-1',
    disasterTitle: 'Banjir Luapan Kali Ciliwung Kampung Melayu',
    destinationName: 'Bantaran Gang Arus RT 08',
    destinationLat: -6.2248,
    destinationLng: 106.8630,
    baseSpeedKmh: 7.5,
    waypoints: [
      [-6.2240, 106.8620],
      [-6.2244, 106.8626],
      [-6.2248, 106.8630],
      [-6.2252, 106.8636],
      [-6.2256, 106.8642],
      [-6.2250, 106.8634],
      [-6.2244, 106.8626],
      [-6.2240, 106.8620]
    ]
  }
];

export function useRealtimeTracking(volunteers: Volunteer[], tasks: Task[], selectedDisasterId?: string | null) {
  const { currentUser, userProfile, isVolunteer } = useAuth();
  const [isTrackingActive, setIsTrackingActive] = useState<boolean>(true); // default true for immediate visual feedback
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1); // 1x, 2x, 5x
  const [selectedTrackedVolunteerId, setSelectedTrackedVolunteerId] = useState<string | null>(null);

  // Waypoint progress state: key volunteerId -> float index along waypoints
  const progressRef = useRef<{ [volunteerId: string]: number }>({
    'vol-02': 0.0,
    'vol-04': 1.5,
    'vol-05': 3.2,
    'vol-12': 0.8,
    'vol-50': 2.1,
    'vol-current-user': 0.3
  });

  // Breadcrumbs history: volunteerId -> array of [lat, lng]
  const breadcrumbsRef = useRef<{ [volunteerId: string]: [number, number][] }>({});

  // Telemetry state exposed to components
  const [telemetryList, setTelemetryList] = useState<VolunteerTrackingTelemetry[]>([]);

  // Calculate current telemetry for a route given its current progress
  const computeTelemetry = useCallback(
    (route: WaypointRoute, currentProgress: number, prevBreadcrumbs: [number, number][]): VolunteerTrackingTelemetry => {
      const waypoints = route.waypoints;
      const count = waypoints.length;
      if (count < 2) {
        return {
          volunteerId: route.volunteerId,
          volunteerName: route.volunteerName,
          phone: route.phone,
          avatar: route.avatar,
          organization: route.organization,
          category: route.category,
          sarUnitOrRole: route.sarUnitOrRole,
          currentLat: waypoints[0][0],
          currentLng: waypoints[0][1],
          previousPositions: prevBreadcrumbs,
          speedKmh: route.baseSpeedKmh,
          headingDeg: 0,
          altitudeM: 18,
          batteryLevel: 92,
          signalStrength: '4G LTE',
          signalBars: 4,
          heartRateBpm: 86,
          assignedTaskId: route.assignedTaskId,
          assignedTaskTitle: route.assignedTaskTitle,
          disasterId: route.disasterId,
          disasterTitle: route.disasterTitle,
          destinationName: route.destinationName,
          destinationLat: route.destinationLat,
          destinationLng: route.destinationLng,
          distanceToDestinationM: 250,
          etaMinutes: 4,
          lastPing: '1s lalu',
          dutyType: route.dutyType,
          operationalStatus: 'en_route'
        };
      }

      const normalizedProgress = ((currentProgress % count) + count) % count;
      const indexA = Math.floor(normalizedProgress);
      const indexB = (indexA + 1) % count;
      const fraction = normalizedProgress - indexA;

      const pA = waypoints[indexA];
      const pB = waypoints[indexB];

      const currentLat = pA[0] + (pB[0] - pA[0]) * fraction;
      const currentLng = pA[1] + (pB[1] - pA[1]) * fraction;

      const headingDeg = calculateBearing(pA[0], pA[1], pB[0], pB[1]);
      const distanceKm = calculateDistance(currentLat, currentLng, route.destinationLat, route.destinationLng);
      const distanceM = Math.round(distanceKm * 1000);

      // Realistic speed oscillation around base speed
      const speedJitter = Math.sin(currentProgress * 2.5) * 2.2;
      const speedKmh = Math.max(3.0, Math.round((route.baseSpeedKmh + speedJitter) * 10) / 10);

      // Battery slow discharge simulation
      const batteryLevel = Math.max(45, 96 - Math.floor((currentProgress * 0.4) % 35));

      // Heart rate responding to speed
      const heartRateBpm = Math.round(75 + speedKmh * 1.5 + Math.sin(currentProgress * 3) * 4);

      // Operational status based on distance to destination
      let operationalStatus: 'en_route' | 'on_site' | 'evacuating' | 'patrolling' = 'en_route';
      if (distanceM < 120) {
        operationalStatus = 'on_site';
      } else if (route.dutyType.toLowerCase().includes('evakuasi')) {
        operationalStatus = 'evacuating';
      } else if (route.dutyType.toLowerCase().includes('patroli')) {
        operationalStatus = 'patrolling';
      }

      const etaMinutes = Math.max(1, Math.round((distanceKm / (speedKmh || 10)) * 60));

      return {
        volunteerId: route.volunteerId,
        volunteerName: route.volunteerName,
        phone: route.phone,
        avatar: route.avatar,
        organization: route.organization,
        category: route.category,
        sarUnitOrRole: route.sarUnitOrRole,
        currentLat,
        currentLng,
        previousPositions: prevBreadcrumbs,
        speedKmh,
        headingDeg,
        altitudeM: Math.round(16 + Math.cos(currentProgress) * 3),
        batteryLevel,
        signalStrength: route.sarUnitOrRole.includes('Radio') ? 'Radio HT' : '4G LTE',
        signalBars: 4,
        heartRateBpm,
        assignedTaskId: route.assignedTaskId,
        assignedTaskTitle: route.assignedTaskTitle,
        disasterId: route.disasterId,
        disasterTitle: route.disasterTitle,
        destinationName: route.destinationName,
        destinationLat: route.destinationLat,
        destinationLng: route.destinationLng,
        distanceToDestinationM: distanceM,
        etaMinutes,
        lastPing: '1d lalu',
        dutyType: route.dutyType,
        operationalStatus
      };
    },
    []
  );

  // Construct full list of routes including logged in user if on duty
  const getAllRoutes = useCallback((): WaypointRoute[] => {
    const list = [...INITIAL_ROUTES];

    // If logged-in user is a volunteer and is on_duty, add them to live tracking!
    const dutyStatus = userProfile?.volunteerData?.dutyStatus;
    if (isVolunteer && (dutyStatus === 'on_duty' || dutyStatus === 'standby')) {
      const userRoute: WaypointRoute = {
        volunteerId: currentUser?.uid || 'vol-current-user',
        volunteerName: `${currentUser?.displayName || 'Anda (Relawan Lapangan)'} [Perangkat Anda]`,
        phone: userProfile?.volunteerData?.phone || '0812-3456-7890',
        avatar: currentUser?.photoURL || undefined,
        organization: userProfile?.volunteerData?.organization || 'Relawan Mandiri SIGAP',
        category: userProfile?.volunteerData?.category || 'public_community',
        sarUnitOrRole: 'Tim Respons Cepat Komunitas (GPS Personal)',
        dutyType: dutyStatus === 'on_duty' ? 'Patroli Aktif Lapangan' : 'Siaga Bergerak',
        assignedTaskId: 'task-1-1',
        assignedTaskTitle: 'Patroli Siaga & Koordinasi Pusdalops',
        disasterId: 'disaster-1',
        disasterTitle: 'Banjir Luapan Kali Ciliwung Kampung Melayu',
        destinationName: 'Posko Darurat RW 02',
        destinationLat: -6.2248,
        destinationLng: 106.8630,
        baseSpeedKmh: 9.5,
        waypoints: [
          [-6.2240, 106.8595],
          [-6.2245, 106.8610],
          [-6.2250, 106.8625],
          [-6.2258, 106.8635],
          [-6.2265, 106.8620],
          [-6.2255, 106.8605],
          [-6.2240, 106.8595]
        ]
      };
      list.push(userRoute);
    }

    return list;
  }, [currentUser, userProfile, isVolunteer]);

  // Main simulation tick loop
  useEffect(() => {
    if (!isTrackingActive || isPaused) return;

    const intervalMs = Math.max(300, Math.floor(1200 / simulationSpeed));

    const timer = setInterval(() => {
      const allRoutes = getAllRoutes();
      const nextTelemetry: VolunteerTrackingTelemetry[] = [];

      allRoutes.forEach(route => {
        const step = 0.045 * simulationSpeed;
        const prevProg = progressRef.current[route.volunteerId] || 0;
        const newProg = prevProg + step;
        progressRef.current[route.volunteerId] = newProg;

        // Current breadcrumbs
        const currentBreadcrumbs = breadcrumbsRef.current[route.volunteerId] || [];

        const tel = computeTelemetry(route, newProg, currentBreadcrumbs);

        // Append current pos to breadcrumbs if moved enough
        const lastPos = currentBreadcrumbs[currentBreadcrumbs.length - 1];
        if (!lastPos || Math.abs(lastPos[0] - tel.currentLat) > 0.0001 || Math.abs(lastPos[1] - tel.currentLng) > 0.0001) {
          const updatedBreadcrumbs = [...currentBreadcrumbs.slice(-15), [tel.currentLat, tel.currentLng] as [number, number]];
          breadcrumbsRef.current[route.volunteerId] = updatedBreadcrumbs;
          tel.previousPositions = updatedBreadcrumbs;
        }

        nextTelemetry.push(tel);
      });

      setTelemetryList(nextTelemetry);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isTrackingActive, isPaused, simulationSpeed, getAllRoutes, computeTelemetry]);

  // Initial computation on mount
  useEffect(() => {
    const allRoutes = getAllRoutes();
    const initTelemetry = allRoutes.map(route => {
      const prog = progressRef.current[route.volunteerId] || 0;
      const breadcrumbs = breadcrumbsRef.current[route.volunteerId] || [];
      return computeTelemetry(route, prog, breadcrumbs);
    });
    setTelemetryList(initTelemetry);
  }, [getAllRoutes, computeTelemetry]);

  const toggleTracking = useCallback(() => {
    setIsTrackingActive(prev => !prev);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const selectedTrackedTelemetry = telemetryList.find(t => t.volunteerId === selectedTrackedVolunteerId);

  return {
    isTrackingActive,
    toggleTracking,
    setIsTrackingActive,
    isPaused,
    togglePause,
    simulationSpeed,
    setSimulationSpeed,
    telemetryList,
    selectedTrackedVolunteerId,
    setSelectedTrackedVolunteerId,
    selectedTrackedTelemetry,
    activeMovingCount: telemetryList.length
  };
}
