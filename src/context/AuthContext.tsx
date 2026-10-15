import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  db,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  handleFirestoreError,
  OperationType,
  User
} from '../lib/firebase.ts';

export type UserRole = 'public' | 'volunteer' | 'coordinator';

export interface VolunteerProfile {
  name: string;
  phone: string;
  city: string;
  province?: string;
  organization?: string;
  category: 'sar_official' | 'public_community';
  sarUnitOrRole?: string;
  skills: Array<{ skillId: string; proficiency: 'beginner' | 'intermediate' | 'expert' }>;
  bloodType?: string;
  emergencyContact?: string;
  availability?: string;
  status: 'available' | 'busy' | 'offline';
  points: number;
  dutyStatus: 'standby' | 'on_duty' | 'off_duty';
  activeMissionCount: number;
  completedMissionCount: number;
  badgeCount: number;
  verifiedAt?: string;
}

export interface AppUserProfile {
  id?: string;
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  isVolunteer: boolean;
  volunteerData?: VolunteerProfile;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: AppUserProfile | null;
  activeRole: UserRole;
  effectiveRole: UserRole; // active role accounting for manual persona override
  isCoordinator: boolean;
  isVolunteer: boolean;
  isPublic: boolean;
  loading: boolean;
  simulatedRole: UserRole | null;
  setSimulatedRole: (role: UserRole | null) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  registerAsVolunteer: (data: Omit<VolunteerProfile, 'points' | 'dutyStatus' | 'activeMissionCount' | 'completedMissionCount' | 'badgeCount'>) => Promise<void>;
  updateDutyStatus: (status: 'standby' | 'on_duty' | 'off_duty') => Promise<void>;
  claimVolunteerPoints: (pointsToAdd: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Coordinators default allowlist (includes user's email)
const BOOTSTRAP_COORDINATOR_EMAILS = [
  'ricko.caesar.putra@gmail.com',
  'admin@bnpb.go.id',
  'koordinator@sigap.id'
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<AppUserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [simulatedRole, setSimulatedRole] = useState<UserRole | null>(null);

  // Sync auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await loadOrCreateUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadOrCreateUserProfile = async (user: User) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);

      const isBootstrapCoordinator = Boolean(user.email && BOOTSTRAP_COORDINATOR_EMAILS.includes(user.email.toLowerCase()));

      if (snap.exists()) {
        const data = snap.data() as AppUserProfile;
        // Ensure id is present
        if (!data.id) {
          data.id = user.uid;
        }
        // If bootstrapped email, ensure role has coordinator privilege
        if (isBootstrapCoordinator && data.role !== 'coordinator') {
          const updatedRole: UserRole = 'coordinator';
          await updateDoc(userRef, { role: updatedRole, updatedAt: new Date().toISOString() });
          data.role = updatedRole;
        }
        setUserProfile(data);
      } else {
        // Create initial profile
        const initialRole: UserRole = isBootstrapCoordinator ? 'coordinator' : 'public';
        const newProfile: AppUserProfile = {
          id: user.uid,
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Pengguna SIGAP',
          photoURL: user.photoURL || null,
          role: initialRole,
          isVolunteer: isBootstrapCoordinator,
          volunteerData: isBootstrapCoordinator ? {
            name: user.displayName || 'Koordinator Lapangan',
            phone: '0812-9988-7766',
            city: 'Jakarta Pusat',
            province: 'DKI Jakarta',
            organization: 'Pusat Komando Bencana SIGAP / BNPB',
            category: 'sar_official',
            sarUnitOrRole: 'Koordinator Wilayah Komando Taktis',
            skills: [
              { skillId: 'skill-sar-1', proficiency: 'expert' },
              { skillId: 'skill-log-1', proficiency: 'expert' },
              { skillId: 'skill-med-1', proficiency: 'expert' },
            ],
            status: 'available',
            points: 1250,
            dutyStatus: 'on_duty',
            activeMissionCount: 3,
            completedMissionCount: 18,
            badgeCount: 6,
            verifiedAt: new Date().toISOString()
          } : undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (err: unknown) {
      console.warn('Could not sync user profile with Firestore, using local session representation:', err);
      // Fallback local representation if offline
      const isBootstrapCoordinator = Boolean(user.email && BOOTSTRAP_COORDINATOR_EMAILS.includes(user.email.toLowerCase()));
      setUserProfile({
        id: user.uid,
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || (isBootstrapCoordinator ? 'Koordinator SIGAP' : 'Pengguna SIGAP'),
        photoURL: user.photoURL,
        role: isBootstrapCoordinator ? 'coordinator' : 'volunteer',
        isVolunteer: isBootstrapCoordinator,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await loadOrCreateUserProfile(result.user);
      }
    } catch (err: unknown) {
      console.error('Google Sign-In failed:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      setSimulatedRole(null);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const registerAsVolunteer = async (
    data: Omit<VolunteerProfile, 'points' | 'dutyStatus' | 'activeMissionCount' | 'completedMissionCount' | 'badgeCount'>
  ) => {
    if (!currentUser) {
      throw new Error('Harap masuk dengan Google terlebih dahulu.');
    }

    const volunteerData: VolunteerProfile = {
      ...data,
      points: 150, // Welcome points
      dutyStatus: 'standby',
      activeMissionCount: 0,
      completedMissionCount: 0,
      badgeCount: 1,
      verifiedAt: new Date().toISOString()
    };

    const updatedProfile: Partial<AppUserProfile> = {
      isVolunteer: true,
      role: userProfile?.role === 'coordinator' ? 'coordinator' : 'volunteer',
      volunteerData,
      updatedAt: new Date().toISOString()
    };

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, updatedProfile);
      setUserProfile(prev => prev ? { ...prev, ...updatedProfile } as AppUserProfile : null);

      // Also register to local Express backend /api/volunteers so maps & ai matching immediately see them
      await fetch('/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: currentUser.email || `${data.name.toLowerCase().replace(/\s+/g, '.')}@relawan.id`,
          phone: data.phone,
          organization: data.organization || 'Relawan Mandiri',
          address: `Posko Relawan ${data.city}`,
          city: data.city,
          locationLat: -6.2088,
          locationLng: 106.8456,
          radiusKm: 30,
          status: 'available',
          category: data.category,
          sarUnitOrRole: data.sarUnitOrRole || 'Relawan Terdaftar',
          skills: data.skills,
        })
      });
    } catch (err) {
      console.error('Failed to register volunteer:', err);
      handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
    }
  };

  const updateDutyStatus = async (status: 'standby' | 'on_duty' | 'off_duty') => {
    if (!currentUser || !userProfile?.volunteerData) return;
    try {
      const updatedVol: VolunteerProfile = {
        ...userProfile.volunteerData,
        dutyStatus: status,
        status: status === 'off_duty' ? 'offline' : (status === 'on_duty' ? 'busy' : 'available')
      };
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        volunteerData: updatedVol,
        updatedAt: new Date().toISOString()
      });
      setUserProfile(prev => prev ? { ...prev, volunteerData: updatedVol } : null);
    } catch (err) {
      console.error('Failed to update duty status:', err);
    }
  };

  const claimVolunteerPoints = async (pointsToAdd: number) => {
    if (!currentUser || !userProfile?.volunteerData) return;
    try {
      const newPts = (userProfile.volunteerData.points || 0) + pointsToAdd;
      const updatedVol: VolunteerProfile = {
        ...userProfile.volunteerData,
        points: newPts,
        badgeCount: Math.min(10, (userProfile.volunteerData.badgeCount || 1) + 1)
      };
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        volunteerData: updatedVol,
        updatedAt: new Date().toISOString()
      });
      setUserProfile(prev => prev ? { ...prev, volunteerData: updatedVol } : null);
    } catch (err) {
      console.error('Failed to claim points:', err);
    }
  };

  // Base role from user profile or guest
  const baseRole: UserRole = userProfile 
    ? (userProfile.role || (userProfile.isVolunteer ? 'volunteer' : 'public'))
    : 'public';

  // Effective role accounts for manual testing persona override
  const effectiveRole: UserRole = simulatedRole !== null ? simulatedRole : baseRole;

  const isCoordinator = effectiveRole === 'coordinator';
  const isVolunteer = effectiveRole === 'volunteer' || effectiveRole === 'coordinator';
  const isPublic = effectiveRole === 'public';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        activeRole: baseRole,
        effectiveRole,
        isCoordinator,
        isVolunteer,
        isPublic,
        loading,
        simulatedRole,
        setSimulatedRole,
        loginWithGoogle,
        logout,
        registerAsVolunteer,
        updateDutyStatus,
        claimVolunteerPoints
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
