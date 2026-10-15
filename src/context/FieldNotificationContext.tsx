import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { FieldTaskNotification, Task, Disaster } from '../types/index.ts';
import { fieldAudio, triggerFieldVibration } from '../lib/fieldAlertAudio.ts';
import { calculateDistance, formatDistance } from '../lib/geo.ts';
import { useAuth } from './AuthContext.tsx';

interface FieldNotificationContextType {
  notifications: FieldTaskNotification[];
  activeToasts: FieldTaskNotification[];
  unreadCount: number;
  isMuted: boolean;
  toggleMute: () => void;
  dispatchTaskToast: (task: Task, disaster?: Disaster, source?: string) => void;
  dismissToast: (id: string) => void;
  acceptTask: (id: string, onDone?: () => void) => Promise<boolean>;
  markAllAsRead: () => void;
  simulateIncomingFieldTask: () => void;
}

const FieldNotificationContext = createContext<FieldNotificationContextType | undefined>(undefined);

const LOCAL_STORAGE_MUTED_KEY = 'sigap_field_toast_muted';
const LOCAL_STORAGE_NOTIFS_KEY = 'sigap_field_notifications_cache';

export const FieldNotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile, claimVolunteerPoints } = useAuth();

  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_MUTED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [notifications, setNotifications] = useState<FieldTaskNotification[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_NOTIFS_KEY);
      if (saved) {
        return JSON.parse(saved).slice(0, 20);
      }
    } catch (e) {
      console.warn('Could not read cached field notifications:', e);
    }
    return [];
  });

  const [activeToasts, setActiveToasts] = useState<FieldTaskNotification[]>([]);

  // Persist notifications list
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_NOTIFS_KEY, JSON.stringify(notifications.slice(0, 25)));
    } catch {
      // ignore
    }
  }, [notifications]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      try {
        localStorage.setItem(LOCAL_STORAGE_MUTED_KEY, String(next));
      } catch {}
      return next;
    });
  }, []);

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const dismissToast = useCallback((id: string) => {
    setActiveToasts(prev => prev.filter(t => t.id !== id));
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, status: n.status === 'unread' ? 'read' : n.status } : n))
    );
  }, []);

  const dispatchTaskToast = useCallback((task: Task, disaster?: Disaster, source = 'Pusdalops Komando') => {
    // Unlock Web Audio context on user events
    fieldAudio.unlockAudio();

    // Calculate approximate distance from volunteer base (default: Jakarta Central or volunteer's city)
    const userLat = -6.2088;
    const userLng = 106.8456;
    let distKm = 1.8;
    if (task.locationLat && task.locationLng) {
      distKm = calculateDistance(userLat, userLng, task.locationLat, task.locationLng);
    }

    const newNotification: FieldTaskNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      taskId: task.id,
      taskTitle: task.title,
      taskDescription: task.description,
      priority: task.priority || 'high',
      requiredSkillCategory: task.requiredSkillCategory || 'sar',
      requiredSkillName: task.requiredSkillName || 'Penyelamatan & SAR',
      volunteersNeeded: task.volunteersNeeded || 4,
      disasterId: task.disasterId,
      disasterTitle: disaster?.title || 'Posko Tanggap Darurat Lapangan',
      disasterAddress: task.address || disaster?.address || 'Area Bencana Lapangan',
      locationLat: task.locationLat || -6.2251,
      locationLng: task.locationLng || 106.8621,
      distanceKm: distKm,
      timestamp: new Date().toISOString(),
      status: 'unread',
      source: source || 'Pusdalops Komando Lapangan',
      autoExpireAt: Date.now() + 20000, // 20 seconds auto dismiss
    };

    // Play audible chime & trigger vibration if not muted
    if (!isMuted) {
      fieldAudio.playDispatchAlert(task.priority);
    }
    triggerFieldVibration(task.priority);

    // Push into active toasts (stack at most 2 active)
    setActiveToasts(prev => [newNotification, ...prev.filter(t => t.id !== newNotification.id)].slice(0, 3));

    // Append to history list
    setNotifications(prev => [newNotification, ...prev.filter(n => n.taskId !== task.id)].slice(0, 30));
  }, [isMuted]);

  const acceptTask = useCallback(async (id: string, onDone?: () => void): Promise<boolean> => {
    try {
      const notif = notifications.find(n => n.id === id) || activeToasts.find(t => t.id === id);
      if (!notif) return false;

      // Update assignment on backend if online
      try {
        await fetch('/api/assignments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskId: notif.taskId,
            volunteerId: userProfile?.uid || 'vol-self',
            disasterId: notif.disasterId,
            matchScore: 0.98,
            matchReason: 'Diterima langsung oleh relawan di lapangan via notifikasi radio',
          }),
        });
      } catch (e) {
        console.warn('Assignment API request fallback:', e);
      }

      // Award XP points for immediate response in the field
      await claimVolunteerPoints(35);

      // Update state
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, status: 'accepted' } : n))
      );
      setActiveToasts(prev => prev.filter(t => t.id !== id));

      if (onDone) onDone();
      return true;
    } catch (err) {
      console.error('Error accepting field task:', err);
      return false;
    }
  }, [notifications, activeToasts, userProfile, claimVolunteerPoints]);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, status: n.status === 'unread' ? 'read' : n.status })));
    setActiveToasts([]);
  }, []);

  // Quick simulation helper
  const simulateIncomingFieldTask = useCallback(() => {
    const demoScenarios: Array<{
      title: string;
      desc: string;
      skillName: string;
      skillCat: any;
      priority: 'urgent' | 'high' | 'medium';
      address: string;
      lat: number;
      lng: number;
      needed: number;
      disasterTitle: string;
    }> = [
      {
        title: 'Panggilan Cepat: Evakuasi 3 Balita & Lansia Terisolir Genangan',
        desc: 'Air naik hingga 180cm di Gang Arus RT 05. Dibutuhkan perahu karet LCR & personel bersertifikasi Water Rescue.',
        skillName: 'Water Rescue & Evakuasi Air',
        skillCat: 'sar',
        priority: 'urgent',
        address: 'Jl. Otista III Gang Arus, Kampung Melayu, Jaktim',
        lat: -6.2290,
        lng: 106.8640,
        needed: 4,
        disasterTitle: 'Banjir Luapan Sungai Ciliwung',
      },
      {
        title: 'Distribusi Cepat Obat & Oksigen Portabel Posko Pengungsi',
        desc: 'Warga lansia mengalami sesak nafas dan dehidrasi ringan. Butuh supir ambulans atau motoris taktis pengantar logistik medis.',
        skillName: 'Pertolongan Pertama Medis & Ambulans',
        skillCat: 'medical',
        priority: 'high',
        address: 'Posko Pengungsian GOR Remaja Otista',
        lat: -6.2341,
        lng: 106.8682,
        needed: 2,
        disasterTitle: 'Banjir Luapan Sungai Ciliwung',
      },
      {
        title: 'Penyaluran 200 Paket Makanan Hangat Balai Warga',
        desc: 'Dapur umum induk telah menyelesaikan batch nasi bungkus siap saji. Butuh personel relawan pengantar ke lokasi blok B.',
        skillName: 'Logistik & Distribusi Dapur Umum',
        skillCat: 'food',
        priority: 'medium',
        address: 'Dapur Umum Balai Warga RW 02 Rawajati',
        lat: -6.2520,
        lng: 106.8590,
        needed: 3,
        disasterTitle: 'Banjir Luapan Sungai Ciliwung',
      },
      {
        title: 'Bantuan Penanganan Tanah Longsor Akses Jalan Utama',
        desc: 'Material longsor menutup separuh badan jalan evakuasi. Butuh regu SAR & relawan dengan perkakas cangkul/chainsaw.',
        skillName: 'Penyelamatan SAR Darat & Reruntuhan',
        skillCat: 'sar',
        priority: 'urgent',
        address: 'Jl. Raya Puncak KM 78 Cisarua, Bogor',
        lat: -6.6912,
        lng: 106.9421,
        needed: 6,
        disasterTitle: 'Longsor Perbukitan Puncak Bogor',
      }
    ];

    const pick = demoScenarios[Math.floor(Math.random() * demoScenarios.length)];
    const simulatedTask: Task = {
      id: `task-sim-${Date.now()}`,
      disasterId: 'disaster-1',
      title: pick.title,
      description: pick.desc,
      requiredSkillCategory: pick.skillCat,
      requiredSkillName: pick.skillName,
      priority: pick.priority,
      locationLat: pick.lat,
      locationLng: pick.lng,
      address: pick.address,
      status: 'pending',
      volunteersNeeded: pick.needed,
      volunteersAssigned: 0,
      createdAt: new Date().toISOString(),
      targetCompletionTime: '2 jam',
    };

    const simulatedDisaster: Disaster = {
      id: 'disaster-1',
      title: pick.disasterTitle,
      description: 'Situasi tanggap darurat aktif',
      type: 'flood',
      severity: 'critical',
      locationLat: pick.lat,
      locationLng: pick.lng,
      address: pick.address,
      province: 'DKI Jakarta',
      status: 'active',
      reportedAt: new Date().toISOString(),
      affectedPeople: 1240,
      affectedHouseholds: 320,
      evacuationCenterCount: 3,
      keyNeeds: ['Perahu Karet', 'P3K', 'Makanan Siap Saji'],
    };

    dispatchTaskToast(simulatedTask, simulatedDisaster, 'PUSDALOPS PUSAT KRISIS');
  }, [dispatchTaskToast]);

  return (
    <FieldNotificationContext.Provider
      value={{
        notifications,
        activeToasts,
        unreadCount,
        isMuted,
        toggleMute,
        dispatchTaskToast,
        dismissToast,
        acceptTask,
        markAllAsRead,
        simulateIncomingFieldTask,
      }}
    >
      {children}
    </FieldNotificationContext.Provider>
  );
};

export const useFieldNotifications = () => {
  const context = useContext(FieldNotificationContext);
  if (!context) {
    throw new Error('useFieldNotifications must be used within FieldNotificationProvider');
  }
  return context;
};
