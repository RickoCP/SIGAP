import { 
  db, 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  handleFirestoreError, 
  OperationType 
} from '../lib/firebase.ts';
import { DisasterDonation, PaymentMethod } from '../types/index.ts';
import { INITIAL_SEED_DONATIONS } from '../data/donationSeedData.ts';

const LOCAL_STORAGE_KEY = 'sigap_disaster_donations';

class DonationService {
  private donations: DisasterDonation[] = [];
  private listeners: Array<(donations: DisasterDonation[]) => void> = [];
  private unsubscribeFirestore: (() => void) | null = null;

  constructor() {
    this.initStorage();
    this.initFirestoreListener();
  }

  private initStorage() {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        this.donations = JSON.parse(cached);
      } else {
        this.donations = [...INITIAL_SEED_DONATIONS];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.donations));
      }
    } catch {
      this.donations = [...INITIAL_SEED_DONATIONS];
    }
  }

  private initFirestoreListener() {
    try {
      const colRef = collection(db, 'donations');
      this.unsubscribeFirestore = onSnapshot(
        colRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteDonations: DisasterDonation[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              remoteDonations.push({
                id: docSnap.id,
                disasterId: data.disasterId || '',
                disasterTitle: data.disasterTitle || 'Bencana Alam',
                donorName: data.donorName || 'Hamba Allah',
                isAnonymous: Boolean(data.isAnonymous),
                email: data.email || '',
                phone: data.phone || '',
                amount: Number(data.amount) || 0,
                type: data.type === 'package' ? 'package' : 'cash',
                packageId: data.packageId,
                packageTitle: data.packageTitle,
                paymentMethod: (data.paymentMethod as PaymentMethod) || 'qris',
                status: data.status || 'verified',
                prayerMessage: data.prayerMessage || '',
                referenceNumber: data.referenceNumber || `DON-${Date.now()}`,
                createdAt: data.createdAt || new Date().toISOString()
              });
            });

            // Merge with local seed data if needed
            const mergedMap = new Map<string, DisasterDonation>();
            // Add local seeds first
            INITIAL_SEED_DONATIONS.forEach(d => mergedMap.set(d.id, d));
            // Overwrite with Firestore remote items
            remoteDonations.forEach(d => mergedMap.set(d.id, d));

            this.donations = Array.from(mergedMap.values()).sort((a, b) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.donations));
            this.notifyListeners();
          }
        },
        (error) => {
          console.warn('Firestore donations sync notice (using local storage fallback):', error.message);
        }
      );
    } catch (err) {
      console.warn('Failed to attach Firestore donations listener:', err);
    }
  }

  public subscribe(callback: (donations: DisasterDonation[]) => void): () => void {
    this.listeners.push(callback);
    callback([...this.donations]);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notifyListeners() {
    const list = [...this.donations];
    this.listeners.forEach(cb => cb(list));
  }

  public getDonations(): DisasterDonation[] {
    return [...this.donations];
  }

  public getDonationsByDisaster(disasterId: string): DisasterDonation[] {
    return this.donations.filter(d => d.disasterId === disasterId);
  }

  public async submitDonation(payload: {
    disasterId: string;
    disasterTitle: string;
    donorName: string;
    isAnonymous: boolean;
    email: string;
    phone: string;
    amount: number;
    type: 'cash' | 'package';
    packageId?: string;
    packageTitle?: string;
    paymentMethod: PaymentMethod;
    prayerMessage?: string;
  }): Promise<DisasterDonation> {
    const timestamp = new Date();
    const dateCode = timestamp.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceNumber = `DON-${dateCode}-${randomSuffix}`;
    const donationId = `don-${Date.now()}-${randomSuffix}`;

    const newDonation: DisasterDonation = {
      id: donationId,
      disasterId: payload.disasterId,
      disasterTitle: payload.disasterTitle,
      donorName: payload.isAnonymous ? 'Hamba Allah' : (payload.donorName.trim() || 'Hamba Allah'),
      isAnonymous: payload.isAnonymous,
      email: payload.email,
      phone: payload.phone,
      amount: payload.amount,
      type: payload.type,
      packageId: payload.packageId,
      packageTitle: payload.packageTitle,
      paymentMethod: payload.paymentMethod,
      status: 'verified',
      prayerMessage: payload.prayerMessage || '',
      referenceNumber,
      createdAt: timestamp.toISOString()
    };

    // Update locally immediately for instant feedback
    this.donations = [newDonation, ...this.donations];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.donations));
    this.notifyListeners();

    // Persist to Firebase Firestore
    try {
      const docRef = doc(db, 'donations', donationId);
      await setDoc(docRef, {
        id: donationId,
        disasterId: newDonation.disasterId,
        disasterTitle: newDonation.disasterTitle,
        donorName: newDonation.donorName,
        isAnonymous: newDonation.isAnonymous,
        email: newDonation.email,
        phone: newDonation.phone,
        amount: newDonation.amount,
        type: newDonation.type,
        packageId: newDonation.packageId || null,
        packageTitle: newDonation.packageTitle || null,
        paymentMethod: newDonation.paymentMethod,
        status: newDonation.status,
        prayerMessage: newDonation.prayerMessage || '',
        referenceNumber: newDonation.referenceNumber,
        createdAt: newDonation.createdAt
      });
    } catch (err) {
      console.warn('Firestore write fallback (stored in local DB):', err);
    }

    return newDonation;
  }
}

export const donationService = new DonationService();
