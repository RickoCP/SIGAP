import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  SEED_DISASTERS,
  SEED_VOLUNTEERS,
  SEED_TASKS,
  SEED_ASSIGNMENTS,
  SEED_SKILLS,
  SEED_BMKG_ALERTS,
  SEED_REGIONAL_READINESS
} from './src/data/seedData.ts';
import {
  Disaster,
  Volunteer,
  Task,
  Assignment,
  BMKGAlert,
  BroadcastAlert,
  AIRecommendation,
  RegionalReadiness,
  ReadinessAIReport,
  HistoricalTrendAINarrative,
  DisasterDonation,
  EarlyWarningAlert,
  CitizenSafetyReport
} from './src/types/index.ts';
import { INITIAL_SEED_DONATIONS } from './src/data/donationSeedData.ts';
import { INITIAL_EARLY_WARNINGS, INITIAL_CITIZEN_REPORTS } from './src/data/earlyWarningSeedData.ts';
import { getHistoricalDataForRegion, REGIONAL_HISTORICAL_DATA } from './src/data/historicalDisasterData.ts';
import { calculateDistance } from './src/lib/geo.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// In-memory data store initialized from seed data
let disasters: Disaster[] = JSON.parse(JSON.stringify(SEED_DISASTERS));
let volunteers: Volunteer[] = JSON.parse(JSON.stringify(SEED_VOLUNTEERS));
let tasks: Task[] = JSON.parse(JSON.stringify(SEED_TASKS));
let assignments: Assignment[] = JSON.parse(JSON.stringify(SEED_ASSIGNMENTS));
let readinessList: RegionalReadiness[] = JSON.parse(JSON.stringify(SEED_REGIONAL_READINESS));
let donations: DisasterDonation[] = JSON.parse(JSON.stringify(INITIAL_SEED_DONATIONS));
let earlyWarnings: EarlyWarningAlert[] = JSON.parse(JSON.stringify(INITIAL_EARLY_WARNINGS));
let citizenSafetyReports: CitizenSafetyReport[] = JSON.parse(JSON.stringify(INITIAL_CITIZEN_REPORTS));
let broadcasts: BroadcastAlert[] = [
  {
    id: 'bc-1',
    disasterId: 'disaster-1',
    title: 'SIAGA 1: Panggilan Relawan Water Rescue Kali Ciliwung',
    message: '[SIGAP DARURAT] Dibutuhkan segera 6 personel SAR Water Rescue dan pengemudi perahu LCR untuk evakuasi warga terjebak di RW 02 Kampung Melayu. Kumpul di Posko Utama Kantor Kelurahan Jl. Kebon Pala I. Bawa pelampung & headlamp. Hubungi Koordinator Posko.',
    channel: 'whatsapp',
    recipientCount: 18,
    sentAt: '2026-10-12T04:40:00Z',
    radiusKm: 25
  }
];

// Initialize Gemini AI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/* ==========================================================================
   REST API Endpoints
   ========================================================================== */

// --- Regional Readiness ---
app.get('/api/readiness', (req, res) => {
  const { region } = req.query;
  let list = [...readinessList];
  if (region && typeof region === 'string' && region !== 'all') {
    list = list.filter(r => r.region.toLowerCase() === region.toLowerCase());
  }
  res.json(list);
});

app.get('/api/readiness/:id', (req, res) => {
  const item = readinessList.find(r => r.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Regional data not found' });
  res.json(item);
});

// --- Disasters ---
app.get('/api/disasters', (req, res) => {
  const { region, type, severity } = req.query;
  let list = [...disasters];
  if (region && typeof region === 'string' && region !== 'all') {
    list = list.filter(d => d.region?.toLowerCase() === region.toLowerCase());
  }
  if (type && typeof type === 'string' && type !== 'all') {
    list = list.filter(d => d.type === type);
  }
  if (severity && typeof severity === 'string' && severity !== 'all') {
    list = list.filter(d => d.severity === severity);
  }
  res.json(list);
});

app.get('/api/disasters/:id', (req, res) => {
  const item = disasters.find(d => d.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Disaster not found' });
  res.json(item);
});

app.post('/api/disasters', (req, res) => {
  const newDisaster: Disaster = {
    ...req.body,
    id: `disaster-${Date.now()}`,
    reportedAt: new Date().toISOString(),
    status: req.body.status || 'active',
  };
  disasters.unshift(newDisaster);
  res.status(201).json(newDisaster);
});

app.put('/api/disasters/:id', (req, res) => {
  const index = disasters.findIndex(d => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Disaster not found' });
  disasters[index] = { ...disasters[index], ...req.body };
  res.json(disasters[index]);
});

// --- Volunteers ---
app.get('/api/volunteers', (req, res) => {
  const { status, skillCategory, disasterId } = req.query;
  let list = [...volunteers];

  if (status && typeof status === 'string' && status !== 'all') {
    list = list.filter(v => v.status === status);
  }

  if (skillCategory && typeof skillCategory === 'string' && skillCategory !== 'all') {
    list = list.filter(v => 
      v.skills.some(vs => {
        const skillObj = SEED_SKILLS.find(s => s.id === vs.skillId);
        return skillObj?.category === skillCategory;
      })
    );
  }

  if (disasterId && typeof disasterId === 'string') {
    const disaster = disasters.find(d => d.id === disasterId);
    if (disaster) {
      list.sort((a, b) => {
        const distA = calculateDistance(disaster.locationLat, disaster.locationLng, a.locationLat, a.locationLng);
        const distB = calculateDistance(disaster.locationLat, disaster.locationLng, b.locationLat, b.locationLng);
        return distA - distB;
      });
    }
  }

  res.json(list);
});

app.post('/api/volunteers', (req, res) => {
  const newVol: Volunteer = {
    ...req.body,
    id: `vol-${Date.now()}`,
    activeTasksCount: 0,
    completedTasksCount: 0,
    joinedDate: new Date().toISOString().split('T')[0],
  };
  volunteers.unshift(newVol);
  res.status(201).json(newVol);
});

app.put('/api/volunteers/:id', (req, res) => {
  const index = volunteers.findIndex(v => v.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Volunteer not found' });
  volunteers[index] = { ...volunteers[index], ...req.body };
  res.json(volunteers[index]);
});

// Reward redemption for volunteer gamification
app.post('/api/volunteers/:id/claim-reward', (req, res) => {
  const { rewardId } = req.body;
  const index = volunteers.findIndex(v => v.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Volunteer not found' });

  const vol = volunteers[index];
  if (!vol.gamification) {
    vol.gamification = {
      points: vol.completedTasksCount * 45 + 120,
      level: 2,
      levelTitle: 'Relawan Tanggap Terampil',
      nextLevelPoints: 500,
      completedMissionsCount: vol.completedTasksCount,
      hoursContributed: vol.completedTasksCount * 6,
      badges: [],
      claimedRewardIds: []
    };
  }

  // Cost mapping
  const costMap: Record<string, number> = {
    'rew-01': 450,
    'rew-02': 350,
    'rew-03': 500,
    'rew-04': 750,
    'rew-05': 900,
    'rew-06': 300,
    'rew-07': 250,
    'rew-08': 600,
  };

  const cost = costMap[rewardId] || 250;
  if (vol.gamification.points < cost) {
    return res.status(400).json({ error: 'Poin tidak mencukupi untuk reward ini' });
  }

  vol.gamification.points -= cost;
  if (!vol.gamification.claimedRewardIds.includes(rewardId)) {
    vol.gamification.claimedRewardIds.push(rewardId);
  }

  res.json(vol);
});

// --- Tasks ---
app.get('/api/tasks', (req, res) => {
  const { disasterId } = req.query;
  if (disasterId && typeof disasterId === 'string') {
    return res.json(tasks.filter(t => t.disasterId === disasterId));
  }
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const newTask: Task = {
    ...req.body,
    id: `task-${Date.now()}`,
    createdAt: new Date().toISOString(),
    volunteersAssigned: 0,
    status: 'pending',
  };
  tasks.unshift(newTask);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });
  tasks[index] = { ...tasks[index], ...req.body };
  res.json(tasks[index]);
});

// --- Assignments ---
app.get('/api/assignments', (req, res) => {
  const { disasterId, taskId, volunteerId } = req.query;
  let list = [...assignments];
  if (disasterId) list = list.filter(a => a.disasterId === disasterId);
  if (taskId) list = list.filter(a => a.taskId === taskId);
  if (volunteerId) list = list.filter(a => a.volunteerId === volunteerId);
  res.json(list);
});

app.post('/api/assignments', (req, res) => {
  const { taskId, volunteerId, disasterId, matchScore, matchReason, notes } = req.body;
  
  // Check if volunteer is already assigned to this task
  const existing = assignments.find(a => a.taskId === taskId && a.volunteerId === volunteerId);
  if (existing) {
    return res.status(400).json({ error: 'Volunteer sudah ditugaskan pada tugas ini' });
  }

  const newAssignment: Assignment = {
    id: `asg-${Date.now()}`,
    taskId,
    volunteerId,
    disasterId,
    status: 'pending',
    assignedAt: new Date().toISOString(),
    matchScore: matchScore || 0.85,
    matchReason: matchReason || 'Ditugaskan oleh koordinator',
    notes: notes || '',
  };
  assignments.push(newAssignment);

  // Update task volunteersAssigned count and status
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.volunteersAssigned += 1;
    if (task.status === 'pending') {
      task.status = 'assigned';
    }
  }

  // Update volunteer status
  const volunteer = volunteers.find(v => v.id === volunteerId);
  if (volunteer) {
    volunteer.activeTasksCount += 1;
    if (volunteer.status === 'available') {
      volunteer.status = 'busy';
    }
  }

  res.status(201).json(newAssignment);
});

app.put('/api/assignments/:id', (req, res) => {
  const index = assignments.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Assignment not found' });
  const prevStatus = assignments[index].status;
  assignments[index] = { ...assignments[index], ...req.body };

  const current = assignments[index];
  if (current.status === 'completed' && prevStatus !== 'completed') {
    current.completedAt = new Date().toISOString();
    const volunteer = volunteers.find(v => v.id === current.volunteerId);
    if (volunteer) {
      volunteer.activeTasksCount = Math.max(0, volunteer.activeTasksCount - 1);
      volunteer.completedTasksCount += 1;
      if (volunteer.activeTasksCount === 0) {
        volunteer.status = 'available';
      }
    }
  }

  res.json(assignments[index]);
});

// --- Skills & BMKG ---
app.get('/api/skills', (req, res) => {
  res.json(SEED_SKILLS);
});

app.get('/api/bmkg-alerts', (req, res) => {
  res.json(SEED_BMKG_ALERTS);
});

app.get('/api/broadcasts', (req, res) => {
  res.json(broadcasts);
});

app.post('/api/broadcasts', (req, res) => {
  const newBc: BroadcastAlert = {
    ...req.body,
    id: `bc-${Date.now()}`,
    sentAt: new Date().toISOString(),
  };
  broadcasts.unshift(newBc);
  res.status(201).json(newBc);
});

// --- Disaster Donations API ---
app.get('/api/donations', (req, res) => {
  const { disasterId } = req.query;
  if (disasterId && typeof disasterId === 'string') {
    return res.json(donations.filter(d => d.disasterId === disasterId));
  }
  res.json(donations);
});

app.post('/api/donations', (req, res) => {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const newDonation: DisasterDonation = {
    ...req.body,
    id: `don-${Date.now()}-${randomSuffix}`,
    referenceNumber: `DON-${dateCode}-${randomSuffix}`,
    createdAt: new Date().toISOString(),
    status: 'verified'
  };
  donations.unshift(newDonation);

  // Update disaster stats
  if (newDonation.disasterId) {
    disasters = disasters.map(d => {
      if (d.id === newDonation.disasterId) {
        return {
          ...d,
          donationCollectedIdr: (d.donationCollectedIdr || 100000000) + newDonation.amount,
          donorsCount: (d.donorsCount || 300) + 1
        };
      }
      return d;
    });
  }

  res.status(201).json(newDonation);
});

// --- Public Early Warning & Citizen Safety API ---
app.get('/api/early-warnings', (req, res) => {
  res.json(earlyWarnings);
});

app.get('/api/citizen-safety', (req, res) => {
  res.json(citizenSafetyReports);
});

app.post('/api/citizen-safety', (req, res) => {
  const newReport: CitizenSafetyReport = {
    ...req.body,
    id: `cs-${Date.now()}`,
    reportedAt: new Date().toISOString()
  };
  citizenSafetyReports.unshift(newReport);
  res.status(201).json(newReport);
});

// --- Stats Overview ---
app.get('/api/stats', (req, res) => {
  const activeDisasters = disasters.filter(d => d.status !== 'resolved').length;
  const availableVolunteers = volunteers.filter(v => v.status === 'available').length;
  const busyVolunteers = volunteers.filter(v => v.status === 'busy').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress' || t.status === 'assigned').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const coverageRate = totalTasks > 0 ? Math.round(((totalTasks - pendingTasks) / totalTasks) * 100) : 0;

  res.json({
    activeDisasters,
    availableVolunteers,
    busyVolunteers,
    totalVolunteers: volunteers.length,
    pendingTasks,
    inProgressTasks,
    completedTasks,
    totalTasks,
    coverageRate,
    avgResponseMinutes: 14.2, // Simulated average mobilization time
  });
});

// --- Reset Data ---
app.post('/api/reset-data', (req, res) => {
  disasters = JSON.parse(JSON.stringify(SEED_DISASTERS));
  volunteers = JSON.parse(JSON.stringify(SEED_VOLUNTEERS));
  tasks = JSON.parse(JSON.stringify(SEED_TASKS));
  assignments = JSON.parse(JSON.stringify(SEED_ASSIGNMENTS));
  res.json({ message: 'Data demo SIGAP berhasil direset' });
});

/* ==========================================================================
   AI Services (Gemini 3.8 Flash via @google/genai)
   ========================================================================== */

/**
 * Heuristic fallback matching function
 */
function computeHeuristicRecommendations(disaster: Disaster, task: Task): AIRecommendation[] {
  return volunteers
    .map(vol => {
      const distance = calculateDistance(
        task.locationLat || disaster.locationLat,
        task.locationLng || disaster.locationLng,
        vol.locationLat,
        vol.locationLng
      );

      // 1. Skill Match (40% weight)
      let skillsMatch = 0.1;
      let matchedSkillName = 'Keahlian Umum';
      for (const vs of vol.skills) {
        const skill = SEED_SKILLS.find(s => s.id === vs.skillId);
        if (skill) {
          if (skill.category === task.requiredSkillCategory) {
            skillsMatch = vs.proficiency === 'expert' ? 1.0 : vs.proficiency === 'intermediate' ? 0.8 : 0.6;
            matchedSkillName = skill.name;
            break;
          } else if (skill.name.toLowerCase().includes(task.requiredSkillName.toLowerCase())) {
            skillsMatch = 0.9;
            matchedSkillName = skill.name;
            break;
          }
        }
      }

      // 2. Proximity (30% weight) - Higher score for closer distance
      const proximity = Math.max(0, 1 - distance / Math.max(vol.radiusKm, 50));

      // 3. Availability (20% weight)
      const availability = vol.status === 'available' ? 1.0 : vol.status === 'busy' ? 0.3 : 0.0;

      // 4. Experience (10% weight)
      const experience = Math.min(1.0, (vol.completedTasksCount || 0) / 20);

      const score = Math.round(
        (skillsMatch * 0.4 + proximity * 0.3 + availability * 0.2 + experience * 0.1) * 100
      ) / 100;

      const reasonParts: string[] = [];
      if (skillsMatch >= 0.8) {
        reasonParts.push(`Memiliki keahlian ${matchedSkillName} tingkat tinggi`);
      } else {
        reasonParts.push(`Keahlian ${matchedSkillName} relevan`);
      }
      reasonParts.push(`berada pada jarak ${distance.toFixed(1)} km`);
      if (vol.status === 'available') {
        reasonParts.push('status siaga aktif');
      } else {
        reasonParts.push(`status saat ini ${vol.status}`);
      }
      if (vol.completedTasksCount > 10) {
        reasonParts.push(`berpengalaman dalam ${vol.completedTasksCount} penugasan`);
      }

      const reasoning = `${vol.name}: ${reasonParts.join(', ')}.`;

      return {
        volunteerId: vol.id,
        volunteerName: vol.name,
        phone: vol.phone,
        score,
        distanceKm: distance,
        status: vol.status,
        primarySkill: matchedSkillName,
        reasoning,
        matchedCriteria: {
          skillsMatch: Math.round(skillsMatch * 100) / 100,
          proximity: Math.round(proximity * 100) / 100,
          availability: Math.round(availability * 100) / 100,
          experience: Math.round(experience * 100) / 100,
        },
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

// 1. AI-Powered Volunteer Matching
app.post('/api/ai/match', async (req, res) => {
  try {
    const { disasterId, taskId } = req.body;
    const disaster = disasters.find(d => d.id === disasterId);
    const task = tasks.find(t => t.id === taskId);

    if (!disaster || !task) {
      return res.status(400).json({ error: 'Disaster atau Task tidak valid' });
    }

    // Prepare candidate pool (e.g., top 15 closest)
    const candidates = volunteers
      .map(v => ({
        ...v,
        distanceKm: calculateDistance(
          task.locationLat || disaster.locationLat,
          task.locationLng || disaster.locationLng,
          v.locationLat,
          v.locationLng
        ),
        skillsList: v.skills.map(s => {
          const sk = SEED_SKILLS.find(x => x.id === s.skillId);
          return `${sk?.name} (${s.proficiency})`;
        }).join(', ')
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 15);

    if (!process.env.GEMINI_API_KEY) {
      console.log('[SIGAP AI] No GEMINI_API_KEY detected, using heuristic matching engine');
      return res.json({
        engine: 'heuristic',
        recommendations: computeHeuristicRecommendations(disaster, task),
      });
    }

    const prompt = `
Anda adalah Sistem AI Koordinator Penanggulangan Bencana SIGAP (BNPB / Relawan Indonesia).
Tugas Anda adalah menganalisis kecocokan relawan untuk tugas darurat berikut secara objektif dan taktis.

DATA BENCANA:
- Nama Bencana: ${disaster.title}
- Tingkat Keparahan: ${disaster.severity.toUpperCase()}
- Lokasi: ${disaster.address} (${disaster.locationLat}, ${disaster.locationLng})

TUGAS YANG MEMBUTUHKAN RELAWAN:
- Judul Tugas: ${task.title}
- Deskripsi: ${task.description}
- Keahlian Diperlukan: ${task.requiredSkillName} (Kategori: ${task.requiredSkillCategory})
- Prioritas: ${task.priority.toUpperCase()}
- Jumlah Relawan Dibutuhkan: ${task.volunteersNeeded}

DAFTAR KANDIDAT RELAWAN TERDEKAT:
${candidates.map((c, i) => `
[${i + 1}] ID: ${c.id}
Nama: ${c.name}
Organisasi: ${c.organization || 'Independen'}
Status: ${c.status}
Jarak ke Lokasi: ${c.distanceKm.toFixed(1)} km (Radius jangkauan: ${c.radiusKm} km)
Keahlian: ${c.skillsList}
Tugas Terselesaikan Sebelumnya: ${c.completedTasksCount}
`).join('\n')}

KRITERIA BOBOT PENILAIAN:
1. Kesesuaian Keahlian (Skills Match): 40%
2. Kedekatan Jarak (Proximity): 30%
3. Status Ketersediaan (Availability: Available = 1.0, Busy = 0.3, Offline = 0.0): 20%
4. Pengalaman Masa Lalu (Experience): 10%

INSTRUKSI:
Pilih dan peringkatkan 6-8 relawan terbaik. Berikan skor (0.00 hingga 1.00) dan penjelasan taktis dalam Bahasa Indonesia profesional yang lugas (1-2 kalimat per relawan menjelaskan alasan kecocokan, jarak, dan peran yang disarankan).

Kembalikan HANYA format JSON valid tanpa tanda markdown tambahan:
{
  "recommendations": [
    {
      "volunteerId": "vol-XX",
      "volunteerName": "Nama Relawan",
      "phone": "Nomor HP",
      "score": 0.94,
      "distanceKm": 2.5,
      "status": "available",
      "primarySkill": "Nama Keahlian Relevan",
      "reasoning": "Penjelasan detail kecocokan dalam bahasa Indonesia...",
      "matchedCriteria": {
        "skillsMatch": 0.95,
        "proximity": 0.90,
        "availability": 1.0,
        "experience": 0.85
      }
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    try {
      const parsed = JSON.parse(text);
      if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
        return res.json({
          engine: 'gemini-3.8-flash',
          recommendations: parsed.recommendations,
        });
      }
    } catch {
      console.warn('[SIGAP AI] JSON parse failed, falling back to heuristic engine');
    }

    return res.json({
      engine: 'heuristic',
      recommendations: computeHeuristicRecommendations(disaster, task),
    });
  } catch (error) {
    console.error('[SIGAP AI Error]', error);
    const { disasterId, taskId } = req.body;
    const disaster = disasters.find(d => d.id === disasterId);
    const task = tasks.find(t => t.id === taskId);
    if (disaster && task) {
      return res.json({
        engine: 'heuristic-fallback',
        recommendations: computeHeuristicRecommendations(disaster, task),
      });
    }
    res.status(500).json({ error: 'Gagal melakukan pencocokan AI' });
  }
});

// Helper function for default SitRep
function getDefaultSitRep(disaster: Disaster, disasterTasks: Task[], disasterAssignments: Assignment[]) {
  return {
    disasterId: disaster.id,
    timestamp: new Date().toISOString(),
    executiveSummary: `Laporan situasi respons tanggap darurat ${disaster.title}. Total populasi terdampak mencapai ${disaster.affectedPeople.toLocaleString('id-ID')} jiwa (${disaster.affectedHouseholds} KK). Teridentifikasi ${disasterTasks.length} tugas koordinasi aktif dengan ${disasterAssignments.length} personel relawan dikerahkan ke titik evakuasi. Prioritas utama berfokus pada keselamatan jiwa warga rentan dan stabilisasi pasokan logistik pangan.`,
    urgentNeeds: disaster.keyNeeds,
    operationalPriorities: [
      'Evakuasi tuntas kelompok rentan (bayi, balita, lansia, dan ibu hamil) ke posko aman',
      'Aktivasi dapur umum mandiri dengan kapasitas minimal 2.000 porsi per jadwal makan',
      'Penyediaan fasilitas sanitasi darurat (WASH) dan pasokan air bersih higienis',
      'Penjagaan jalur logistik dan penyediaan radio komunikasi cadangan (HT/ORARI)'
    ],
    recommendedTeamAllocations: [
      { role: 'Tim SAR & Water Rescue', count: 8, urgency: 'Sangat Mendesak' },
      { role: 'Tim Medis Lapangan & First Aid', count: 6, urgency: 'Mendesak' },
      { role: 'Pengelola Dapur Umum & Logistik', count: 12, urgency: 'Mendesak' },
      { role: 'Pendamping Psikososial & Anak', count: 4, urgency: 'Siaga Tahap 2' }
    ],
    governmentLiaisonNotes: 'Koordinasikan alokasi tenda dan perahu karet dengan Pusdalops BPBD DKI Jakarta / BNPB. Pastikan manifest logistik terintegrasi dengan Posko PMI Kota.'
  };
}

function getDefaultBroadcastMessage(disaster: Disaster, radiusKm: number, customNote: string) {
  return `🚨 [PANGGILAN SIAGA SIGAP - ${disaster.severity.toUpperCase()}] 🚨\n\nKepada seluruh Relawan Terdaftar dalam radius ${radiusKm} km:\n\nKejadian: ${disaster.title}\nLokasi: ${disaster.address}\n\nDibutuhkan segera personel relawan untuk mendukung: ${disaster.keyNeeds.slice(0, 3).join(', ')}.\n${customNote ? `\nCatatan Khusus: ${customNote}\n` : ''}\n📍 Titik Kumpul Posko: Posko Tanggap Darurat SIGAP (${disaster.address})\n🦺 Perlengkapan: Rompi relawan, alas kaki tertutup/sepatu boots, jas hujan, headlamp/senter, tumbler air minum.\n\nBagi relawan yang siap mobilisasi, mohon klik 'TERIMA PENUGASAN' di aplikasi SIGAP Koordinator atau konfirmasi di WhatsApp Koordinator Lapangan.\n\nUtamakan keselamatan diri sebelum membantu orang lain! Salam Tangguh.`;
}

// 2. AI Situation Report (SitRep)
app.post('/api/ai/situation-report', async (req, res) => {
  const { disasterId } = req.body;
  const disaster = disasters.find(d => d.id === disasterId);
  if (!disaster) return res.status(404).json({ error: 'Disaster not found' });

  const disasterTasks = tasks.filter(t => t.disasterId === disasterId);
  const disasterAssignments = assignments.filter(a => a.disasterId === disasterId);

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
    return res.json(getDefaultSitRep(disaster, disasterTasks, disasterAssignments));
  }

  try {
    const prompt = `
Anda adalah Komandan Operasi Tanggap Darurat Bencana SIGAP (Sistem Integrasi Gerakan Aksi Peduli).
Susunlah Laporan Situasi Resmi (Situation Report / SitRep) dalam Bahasa Indonesia untuk bencana berikut:

Nama Kejadian: ${disaster.title}
Jenis: ${disaster.type.toUpperCase()} | Keparahan: ${disaster.severity.toUpperCase()}
Lokasi: ${disaster.address} (${disaster.province})
Jumlah Warga Terdampak: ${disaster.affectedPeople} jiwa (${disaster.affectedHouseholds} KK)
Titik Pengungsian: ${disaster.evacuationCenterCount} lokasi
Kebutuhan Mendesak Terdata: ${disaster.keyNeeds.join(', ')}
Jumlah Tugas Lapangan Aktif: ${disasterTasks.length} tugas
Relawan Ditugaskan Saat Ini: ${disasterAssignments.length} orang

Buatlah laporan situasi taktis operasional. Kembalikan HANYA format JSON valid:
{
  "disasterId": "${disaster.id}",
  "timestamp": "${new Date().toISOString()}",
  "executiveSummary": "Ringkasan ringkas situasi terkini (3-4 kalimat padat)...",
  "urgentNeeds": ["kebutuhan 1", "kebutuhan 2", "kebutuhan 3", "kebutuhan 4"],
  "operationalPriorities": ["prioritas 1", "prioritas 2", "prioritas 3", "prioritas 4"],
  "recommendedTeamAllocations": [
    { "role": "Nama Tim / Peran Relawan", "count": 6, "urgency": "Sangat Mendesak" },
    { "role": "Nama Tim / Peran Relawan", "count": 4, "urgency": "Mendesak" }
  ],
  "governmentLiaisonNotes": "Catatan koordinasi taktis dengan BNPB, BPBD, Basarnas, dan PMI..."
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.executiveSummary) {
      return res.json(parsed);
    }
    return res.json(getDefaultSitRep(disaster, disasterTasks, disasterAssignments));
  } catch (error) {
    console.error('[SIGAP SitRep Error, using robust default]', error);
    return res.json(getDefaultSitRep(disaster, disasterTasks, disasterAssignments));
  }
});

// 3. AI Emergency Broadcast Alert Generator
app.post('/api/ai/broadcast-alert', async (req, res) => {
  const { disasterId, channel = 'whatsapp', radiusKm = 25, customNote = '' } = req.body;
  const disaster = disasters.find(d => d.id === disasterId);
  if (!disaster) return res.status(404).json({ error: 'Disaster not found' });

  // Count volunteers in radius
  const nearbyCount = volunteers.filter(v => {
    const dist = calculateDistance(disaster.locationLat, disaster.locationLng, v.locationLat, v.locationLng);
    return dist <= radiusKm && v.status !== 'offline';
  }).length;

  let broadcastMessage = '';

  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
    try {
      const prompt = `
Anda adalah AI Koordinator Komunikasi Lapangan SIGAP.
Buat draf pesan siaran darurat (Emergency Broadcast Alert) dalam Bahasa Indonesia untuk dikirimkan melalui kanal: ${channel.toUpperCase()} kepada relawan siaga dalam radius ${radiusKm} km dari lokasi bencana.

BENCANA:
- Nama: ${disaster.title}
- Lokasi: ${disaster.address}
- Keparahan: ${disaster.severity.toUpperCase()}
- Kebutuhan Utama: ${disaster.keyNeeds.join(', ')}
${customNote ? `- Catatan Khusus Koordinator: ${customNote}` : ''}

Format pesan harus:
- Jelas, tegas, mengedepankan keamanan (safety first)
- Mencantumkan titik kumpul posko (Muster Point)
- Meminta relawan membawa perlengkapan standar (APD/Rompi/Headlamp)
- Menyertakan call to action konfirmasi via aplikasi SIGAP
- Cocok dengan format WhatsApp / SMS (gunakan format teks berstruktur dengan bullet points rapi)

Kembalikan HANYA teks isi pesan tanpa pembuka atau penutup markdown.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      broadcastMessage = (response.text || '').trim();
    } catch (err) {
      console.warn('[SIGAP Broadcast AI error, using fallback message]', err);
      broadcastMessage = getDefaultBroadcastMessage(disaster, radiusKm, customNote);
    }
  } else {
    broadcastMessage = getDefaultBroadcastMessage(disaster, radiusKm, customNote);
  }

  const newBroadcast: BroadcastAlert = {
    id: `bc-${Date.now()}`,
    disasterId,
    title: `Siaran Darurat: ${disaster.title}`,
    message: broadcastMessage.trim(),
    channel,
    recipientCount: nearbyCount || 12,
    sentAt: new Date().toISOString(),
    radiusKm,
  };

  broadcasts.unshift(newBroadcast);
  res.json(newBroadcast);
});

// 4. Google Maps Grounding - Nearby Emergency Facilities, Hospitals, & Shelters
app.post('/api/ai/nearby-places', async (req, res) => {
  const { disasterId } = req.body;
  const disaster = disasters.find(d => d.id === disasterId);
  if (!disaster) return res.status(404).json({ error: 'Disaster not found' });

  // Curated fallback places relevant to the disaster area
  const isBanten = disaster.province.toLowerCase().includes('banten');
  const fallbackPlaces = isBanten ? [
    { title: 'Puskesmas Labuan (Posko Medis Darurat)', uri: 'https://maps.google.com/?q=Puskesmas+Labuan+Pandeglang', address: 'Jl. Jenderal Sudirman No. 12, Labuan, Pandeglang', type: 'Puskesmas Rawat Inap' },
    { title: 'RSUD Berkah Pandeglang', uri: 'https://maps.google.com/?q=RSUD+Berkah+Pandeglang', address: 'Jl. Raya Labuan Km 5, Pandeglang', type: 'Rumah Sakit Rujukan Trauma' },
    { title: 'Kantor Kecamatan Labuan (Posko Utama)', uri: 'https://maps.google.com/?q=Kantor+Kecamatan+Labuan', address: 'Labuan, Kabupaten Pandeglang, Banten', type: 'Posko Induk Bencana' },
    { title: 'Polsek Labuan / Pos SAR Anyer', uri: 'https://maps.google.com/?q=Polsek+Labuan+Banten', address: 'Pesisir Pantai Carita - Labuan', type: 'Pos Keamanan & Komunikasi' }
  ] : [
    { title: 'RSUD Budhi Asih (Jatinegara)', uri: 'https://maps.google.com/?q=RSUD+Budhi+Asih+Jakarta', address: 'Jl. Dewi Sartika No. 200, Cawang, Jakarta Timur', type: 'Rumah Sakit Rujukan Hipotermia & Bedah' },
    { title: 'Puskesmas Kecamatan Jatinegara', uri: 'https://maps.google.com/?q=Puskesmas+Kecamatan+Jatinegara', address: 'Jl. Matraman Raya No. 220, Jakarta Timur', type: 'Puskesmas Skrining Medis Balita' },
    { title: 'Kantor Kelurahan Kampung Melayu', uri: 'https://maps.google.com/?q=Kantor+Kelurahan+Kampung+Melayu', address: 'Jl. Kebon Pala I, Jatinegara', type: 'Posko Induk Logistik & Dapur Umum' },
    { title: 'Gedung Sasana Krida Karang Taruna', uri: 'https://maps.google.com/?q=Sasana+Krida+Remaja+Jatinegara', address: 'Jl. Otista III No. 5, Jatinegara', type: 'Titik Evakuasi Sementara' }
  ];

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
    return res.json({
      text: `Rekomendasi fasilitas penanganan darurat dan posko rujukan di sekitar lokasi ${disaster.title} (${disaster.address}):\n\n1. Fasilitas Kesehatan Terdekat siap menerima rujukan korban hipotermia, trauma, dan luka darurat.\n2. Titik Evakuasi & Posko Induk siap difungsikan sebagai lokasi muster point relawan dan penyimpanan logistik bantuan.`,
      places: fallbackPlaces,
      source: 'offline-fallback'
    });
  }

  try {
    const prompt = `Anda adalah petugas navigasi dan koordinasi logistik penanggulangan bencana di Indonesia.
Sebutkan fasilitas darurat terdekat di sekitar lokasi bencana:
Bencana: ${disaster.title}
Alamat: ${disaster.address} (${disaster.locationLat}, ${disaster.locationLng})

Sebutkan rumah sakit (RSUD), puskesmas siaga 24 jam, pos pemadam kebakaran, polsek, dan posko pengungsian terdekat yang dapat diakses tim relawan dan ambulans. Berikan penjelasan ringkas mengenai kegunaan taktis masing-masing fasilitas.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: disaster.locationLat,
              longitude: disaster.locationLng
            }
          }
        }
      }
    });

    const text = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    const extractedPlaces: { title: string; uri: string; address?: string; type?: string }[] = [];
    groundingChunks.forEach((chunk: any) => {
      if (chunk.maps?.uri) {
        extractedPlaces.push({
          title: chunk.maps.title || 'Fasilitas Google Maps',
          uri: chunk.maps.uri,
          type: 'Titik Google Maps Terverifikasi'
        });
      }
    });

    return res.json({
      text,
      places: extractedPlaces.length > 0 ? extractedPlaces : fallbackPlaces,
      groundingChunks,
      source: 'gemini-3.5-flash-googleMaps'
    });
  } catch (err) {
    console.warn('[SIGAP Maps Grounding error, using fallback]', err);
    return res.json({
      text: `Rekomendasi fasilitas penanganan darurat dan posko rujukan di sekitar lokasi ${disaster.title} (${disaster.address}).`,
      places: fallbackPlaces,
      source: 'fallback'
    });
  }
});

// 5. AI Regional Disaster Preparedness & Vulnerability Assessment (Karhutla & Banjir)
app.post('/api/ai/readiness-analysis', async (req, res) => {
  const { provinceId, focusThreat = 'all' } = req.body;
  const region = readinessList.find(r => r.id === provinceId) || readinessList[0];

  const defaultReport: ReadinessAIReport = {
    provinceId: region.id,
    provinceName: region.province,
    overallScore: region.readinessScore,
    generatedAt: new Date().toISOString(),
    threatAssessment: {
      karhutlaRisk: `${region.fireReadiness.riskLevel} (Skor: ${region.fireReadiness.score}/100, Hotspot Aktif: ${region.fireReadiness.activeHotspots})`,
      floodRisk: `${region.floodReadiness.riskLevel} (Skor: ${region.floodReadiness.score}/100, Titik Rawan: ${region.floodReadiness.floodPronePoints})`,
      summary: `Wilayah ${region.province} memiliki tingkat kesiapan ${region.readinessScore}/100 dengan status ${region.status.toUpperCase()}. Ancaman kebakaran hutan & lahan gambut berada pada level ${region.fireReadiness.riskLevel}, sementara ancaman banjir berada pada level ${region.floodReadiness.riskLevel}. Kebutuhan penguatan difokuskan pada sinkronisasi relawan cepat tanggap dan rantai pasok logistik.`
    },
    criticalGaps: region.keyVulnerabilities,
    contingencyProtocol72h: [
      {
        phase: 'Fase 1: 0 - 6 Jam Pertama (Aktivasi & Siaga Cepat)',
        action: focusThreat === 'fire' 
          ? 'Mobilisasi regu Manggala Agni & relawan Masyarakat Peduli Api (MPA), kirim armada water bombing ke hotspot kritis.'
          : 'Aktivasi sirene peringatan dini EWS, mobilisasi perahu LCR dan relawan SAR air ke titik genangan >1 meter.',
        responsibleUnit: focusThreat === 'fire' ? 'BPBD Provinsi, Manggala Agni & Relawan Karhutla' : 'BPBD, Basarnas & Relawan Water Rescue SIGAP'
      },
      {
        phase: 'Fase 2: 6 - 24 Jam (Evakuasi & Pendirian Posko)',
        action: 'Pendirian posko induk lapangan, tenda darurat, dapur umum dengan kapasitas 5.000+ porsi/hari, serta drop masker N95 / hygiene kit.',
        responsibleUnit: 'Dinas Sosial, Tagana, Relawan Logistik & Medis'
      },
      {
        phase: 'Fase 3: 24 - 72 Jam (Stabilisasi & Distribusi Bantuan)',
        action: 'Penyisiran wilayah terisolir, operasional unit penjernih air bersih, pendampingan trauma healing anak, dan audit kerusakan fasilitas publik.',
        responsibleUnit: 'Koordinator Wilayah SIGAP, Tenaga Medis & Relawan WASH'
      }
    ],
    volunteerMobilizationGuidance: `Dibutuhkan mobilisasi ${Math.round(region.populationMillions * 150)} relawan terlatih di ${region.province}, dengan spesialisasi utama: ${
      focusThreat === 'fire' ? 'Pemadam Kebakaran Lahan Gambut, Operator Drone Thermal, dan Relawan Logistik Masker' : 'SAR Water Rescue, Operator Perahu Karet, Koki Dapur Umum, dan Paramedis Darurat'
    }.`,
    resourceAllocationPriorities: region.strategicRecommendations
  };

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
    return res.json(defaultReport);
  }

  try {
    const prompt = `
Anda adalah Pakar Manajemen Risiko Bencana & AI Strategis BNPB (Badan Nasional Penanggulangan Bencana) Indonesia.
Berikan Audit Kesiapan Daerah Komprehensif dan Rekomendasi Aksi Taktis untuk:
PROVINSI: ${region.province} (Ibukota: ${region.capitalCity}, Wilayah: ${region.region})
POPULASI: ${region.populationMillions} Juta Jiwa
FOKUS ANALISIS: ${focusThreat === 'fire' ? 'KHUSUS KEBAKARAN HUTAN & LAHAN GAMBUT (KARHUTLA)' : focusThreat === 'flood' ? 'KHUSUS BANJIR & LUAPAN AIR' : 'KEBAKARAN HUTAN & BANJIR'}

DATA KESIAPAN DAERAH:
- Skor Kesiapan Keseluruhan: ${region.readinessScore}/100 (Status: ${region.status.toUpperCase()})
- Kesiapan Karhutla: Skor ${region.fireReadiness.score}/100, Risiko ${region.fireReadiness.riskLevel}, Titik Hotspot: ${region.fireReadiness.activeHotspots}, Lahan Gambut: ${(region.fireReadiness.peatlandAreaHa / 1000).toLocaleString()} Ribu Ha, Relawan Karhutla: ${region.fireReadiness.firefightingVolunteers} orang, Sekat Kanal: ${region.fireReadiness.canalBlocksBuilt} unit, Status Peringatan: ${region.fireReadiness.earlyWarningStatus}
- Kesiapan Banjir: Skor ${region.floodReadiness.score}/100, Risiko ${region.floodReadiness.riskLevel}, Titik Rawan Banjir: ${region.floodReadiness.floodPronePoints}, Kapasitas Pompa: ${region.floodReadiness.drainagePumpCapacityM3s} m3/detik, Perahu Karet: ${region.floodReadiness.rubberBoatsAvailable} unit, Relawan Water Rescue: ${region.floodReadiness.waterRescueVolunteers} orang, Titik Pengungsian: ${region.floodReadiness.evacuationShelters} posko, Status Peringatan: ${region.floodReadiness.earlyWarningStatus}
- Kapasitas Logistik: Tenda Darurat: ${region.logisticsCapacity.emergencyTents}, Genset: ${region.logisticsCapacity.generators}, Kit Higienis: ${region.logisticsCapacity.hygieneKits}, Kapasitas Dapur Umum: ${region.logisticsCapacity.fieldKitchenCapacityMealsPerDay.toLocaleString()} porsi/hari
- Rasio Relawan per 10.000 Penduduk: ${region.volunteerRatioPer10kPopulation}

INSTRUKSI:
Susunlah analisis kesiapan mendalam dalam Bahasa Indonesia profesional.
Kembalikan HANYA format JSON valid tanpa tanda markdown tambahan:
{
  "provinceId": "${region.id}",
  "provinceName": "${region.province}",
  "overallScore": ${region.readinessScore},
  "generatedAt": "${new Date().toISOString()}",
  "threatAssessment": {
    "karhutlaRisk": "Level risiko dan analisis hotspot/gambut terkini...",
    "floodRisk": "Level risiko dan analisis debit sungai/polder terkini...",
    "summary": "Ringkasan eksekutif ancaman wilayah (3-4 kalimat)..."
  },
  "criticalGaps": [
    "Kesenjangan krusial 1",
    "Kesenjangan krusial 2",
    "Kesenjangan krusial 3"
  ],
  "contingencyProtocol72h": [
    {
      "phase": "Fase 1: 0 - 6 Jam (Aktivasi Cepat)",
      "action": "Tindakan taktis konkret...",
      "responsibleUnit": "Unit pelaksana..."
    },
    {
      "phase": "Fase 2: 6 - 24 Jam (Evakuasi & Dukungan)",
      "action": "Tindakan taktis konkret...",
      "responsibleUnit": "Unit pelaksana..."
    },
    {
      "phase": "Fase 3: 24 - 72 Jam (Stabilisasi & Pemulihan)",
      "action": "Tindakan taktis konkret...",
      "responsibleUnit": "Unit pelaksana..."
    }
  ],
  "volunteerMobilizationGuidance": "Panduan taktis pengerahan relawan spesialis (keahlian yang paling mendesak, keselamatan relawan, dan titik muster point)...",
  "resourceAllocationPriorities": [
    "Prioritas alokasi peralatan 1",
    "Prioritas alokasi logistik 2",
    "Prioritas alokasi teknologi/EWS 3"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.threatAssessment && parsed.criticalGaps) {
      return res.json(parsed);
    }
    return res.json(defaultReport);
  } catch (err) {
    console.warn('[SIGAP AI Readiness Error, using default]', err);
    return res.json(defaultReport);
  }
});

// Helper for default historical trend AI narrative
function getDefaultHistoricalNarrative(
  region: RegionalReadiness,
  histData: any,
  focusThreat: string = 'all'
): HistoricalTrendAINarrative {
  const isFireProne = region.fireReadiness.riskLevel === 'Ekstrem' || region.fireReadiness.riskLevel === 'Tinggi';
  const elNinoYear = histData.yearlyTrends?.find((y: any) => y.year === 2023) || histData.yearlyTrends?.[1] || {
    year: 2023,
    economicLossBillionsIDR: 182.5,
    fireHotspotCount: 1680,
    floodAffectedPeople: 21400
  };
  const recentYear = histData.yearlyTrends?.[histData.yearlyTrends.length - 1] || histData.yearlyTrends?.[4] || {
    year: 2026,
    economicLossBillionsIDR: 98.7
  };

  return {
    provinceId: region.id,
    provinceName: region.province,
    generatedAt: new Date().toISOString(),
    executiveHeadline: isFireProne
      ? `Trajektori Risiko ${region.province}: Pembelajaran Lonjakan Karhutla El Niño 2023 dan Antisipasi Transisi Monsun Basah 2026/2027`
      : `Dinamika Hidrometeorologi ${region.province}: Kerentanan Tanggul Kritis Pasca-Siklus Banjir 5 Tahunan dan Kesiapan EWS Pesisir`,
    trendTrajectoryAnalysis: `Berdasarkan rekam jejak 5 tahun terakhir (2022–2026), ${region.province} memperlihatkan fluktuasi dampak bencana yang sangat dipengaruhi oleh anomali iklim global. Pada tahun 2023, wilayah ini mengalami lonjakan drastis akibat fenomena El Niño moderat-ke-kuat, di mana dampak ekonomi membengkak hingga Rp ${elNinoYear.economicLossBillionsIDR} Miliar dengan ${elNinoYear.fireHotspotCount ? `${elNinoYear.fireHotspotCount} titik hotspot dan ` : ''}${elNinoYear.floodAffectedPeople ? `${elNinoYear.floodAffectedPeople.toLocaleString('id-ID')} jiwa terdampak` : 'puluhan ribu pengungsi'}.\n\nMemasuki kurun waktu 2024–2026, tren menunjukkan stabilisasi relatif namun titik kerentanan struktural tetap persisten. Rata-rata kerugian ekonomi tahunan tercatat berkisar Rp ${recentYear.economicLossBillionsIDR} Miliar. Hal ini mengindikasikan bahwa intervensi mitigasi statis tidak lagi memadai, melainkan diperlukan pendekatan dinamis berbasis jendela aksi dini (anticipatory action) yang menyelaraskan pengerahan relawan dengan kalender siklus iklim.`,
    seasonalCyclicalDeepDive: `Analisis siklus 12 bulan mengungkap adanya pergeseran musim yang konsisten. Periode bulan Mei hingga September merupakan fase akumulasi penurunan kelembaban gambut dan lereng curam, dengan puncak risiko terik terjadi pada Juli-Agustus. Sebaliknya, masa transisi monsun barat (Oktober hingga Januari) secara teratur memicu saturasi tanah ekstrem, di mana curah hujan melebihi 250–350 mm/bulan mengakibatkan luapan DAS utama dan genangan di ${region.floodReadiness.floodPronePoints} titik rawan.\n\nTitik kritis tertinggi terjadi pada bulan peralihan (transition months), di mana cuaca ekstrem seperti angin puting beliung, hujan lebat lokal, dan pergeseran cepat dari bahaya api ke bahaya genangan dapat mengejutkan posko relawan jika manifest perlengkapan tidak ditransformasikan secara cepat.`,
    climateAnomalyCorrelation: {
      elNinoImpactSummary: `Fase El Niño melipatgandakan indeks kekeringan tanah gambut dan memicu perambatan api bawah tanah (smoldering) hingga kedalaman >1.5 meter, membutuhkan 8x lebih banyak pasokan air dan nozel injeksi khusus dibandingkan pemadaman kebakaran vegetasi permukaan.`,
      laNinaOrMonsoonRisk: `Fenomena La Niña dan angin monsun Asia meningkatkan intensitas hujan ekstrem harian hingga >150 mm/24 jam, menyebabkan kapasitas drainase polder (${region.floodReadiness.drainagePumpCapacityM3s} m³/detik) rentan kewalahan jika terjadi pasang laut purnama (rob) bersamaan.`,
      recurrencePattern: isFireProne 
        ? `Siklus puncak hotspot berulang setiap Juli - Oktober; siklus banjir bandang berulang setiap November - Januari.`
        : `Siklus genangan tahunan berulang intensif setiap November - Februari dengan retensi genangan 3–7 hari.`
    },
    predictiveRiskForecastNext6Months: [
      {
        period: 'Bulan Berjalan s/d 60 Hari Ke Depan (Okt - Des 2026)',
        projectedThreat: isFireProne ? 'Peredaan Hotspot & Lonjakan Debit Air Aliran Sungai' : 'Puncak Curah Hujan Ekstrem & Banjir Genangan DAS',
        vulnerabilityForecast: `Peningkatan debit air DAS utama dapat memicu genangan di pemukiman bantaran rendah dan merusak infrastruktur sekat kanal yang baru dibangun.`,
        preemptiveAlertLevel: 'Siaga'
      },
      {
        period: 'Awal Tahun (Jan - Feb 2027)',
        projectedThreat: 'Banjir Luapan Puncak, Tanah Longsor Lereng, & Gelombang Pasang Rob',
        vulnerabilityForecast: `Wilayah hilir dan cekungan rentan terisolasi. Jalur logistik utama berpotensi terputus membutuhkan kesiapan perahu LCR dan dapur umum mandiri.`,
        preemptiveAlertLevel: 'Awas'
      },
      {
        period: 'Masa Pemulihan & Transisi Awal Kemarau (Mar - Apr 2027)',
        projectedThreat: 'Surutnya Banjir, Wabah Penyakit Pascabencana, & Awal Pengeringan Vegetasi',
        vulnerabilityForecast: `Kebutuhan mendesak kit sanitasi/WASH, desinfeksi sumur warga, dan perbaikan tanggul penahan air sebelum masuk siklus kering berikutnya.`,
        preemptiveAlertLevel: 'Waspada'
      }
    ],
    dataDrivenActionRecommendations: [
      {
        title: 'Aktivasi Protokol Aksi Antisipatif 30 Hari Sebelum Puncak',
        timing: 'Tepat pada Jendela Aksi Dini Musiman',
        rationaleFromHistoricalData: 'Data 5 tahun membuktikan 78% kerugian ekonomi terjadi karena keterlambatan mobilisasi armada evakuasi setelah banjir mencapai kedalaman >1 meter.',
        actionItems: [
          'Pre-positioning perahu karet LCR dan tenda pengungsian di dataran tinggi radius <5 km dari titik rawan',
          'Inspeksi fungsional 100% pompa polder dan genset cadangan darurat',
          'Aktivasi radio komunikasi darurat frekuensi VHF/HF bersama ORARI & RAPI'
        ]
      },
      {
        title: 'Restrukturisasi Klaster Relawan Spesialis Berdasarkan Tren Musiman',
        timing: 'Masa Transisi Musim (Oktober)',
        rationaleFromHistoricalData: 'Kebutuhan tenaga relawan beralih dari pemadaman darat ke penyelamatan air (water rescue) dan manajemen dapur umum massal dalam kurun waktu kurang dari 3 minggu.',
        actionItems: [
          `Rotasi penugasan ${region.floodReadiness.waterRescueVolunteers} personel SAR air SIGAP ke kelurahan zona merah`,
          'Briefing keselamatan relawan terkait risiko arus deras dan penyakit leptospirosis/kulit',
          'Stok cadangan logistik pangan darurat untuk 3 kali jadwal makan per hari di posko induk'
        ]
      }
    ],
    volunteerAndLogisticsPrepositioning: `Rekomendasi penempatan dini: Tempatkan ${Math.round(region.floodReadiness.waterRescueVolunteers * 0.4)} personel relawan rescue terlatih dan minimal ${Math.min(region.floodReadiness.rubberBoatsAvailable, 12)} unit perahu LCR di posko aju garis depan ${region.capitalCity} dan sekitarnya sebelum minggu kedua November. Pastikan pasokan tenda pleton (${region.logisticsCapacity.emergencyTents} unit) dan dapur darurat diposisikan di gedung fasilitas publik bertingkat.`
  };
}

// 6. Gemini AI Narrative Analysis for Historical Trends & Seasonal Cycles
app.post('/api/ai/historical-narrative', async (req, res) => {
  const { provinceId, focusThreat = 'all' } = req.body;
  const region = readinessList.find(r => r.id === provinceId) || readinessList[0];
  const isFireProne = region.fireReadiness.riskLevel === 'Ekstrem' || region.fireReadiness.riskLevel === 'Tinggi';
  const histData = REGIONAL_HISTORICAL_DATA[region.id] || getHistoricalDataForRegion(region.id, region.province, isFireProne);

  const fallbackNarrative = getDefaultHistoricalNarrative(region, histData, focusThreat);

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
    return res.json(fallbackNarrative);
  }

  try {
    const prompt = `
Anda adalah Pakar Analisis Tren Kebencanaan, Klimatologi, & Mitigasi Bencana Strategis BNPB / SIGAP Indonesia.
Tugas Anda adalah menyusun ANALISIS NARATIF MENDALAM (bukan sekadar daftar angka) berdasarkan data tren historis 5 tahun (2022-2026), siklus musiman 12 bulan, anomali iklim (El Niño / La Niña), dan kesiapan daerah untuk:

PROVINSI: ${region.province} (Ibukota: ${region.capitalCity}, Wilayah: ${region.region})
POPULASI: ${region.populationMillions} Juta Jiwa
SKOR KESIAPAN WILAYAH: ${region.readinessScore}/100 (Status: ${region.status.toUpperCase()})
FOKUS ANALISIS: ${focusThreat === 'fire' ? 'KHUSUS KEBAKARAN HUTAN & LAHAN (KARHUTLA)' : focusThreat === 'flood' ? 'KHUSUS BANJIR & LUAPAN DAS' : 'KESELURUHAN DINAMIKA BENCANA (KARHUTLA, BANJIR & GEOLOGIS)'}

DATA HISTORIS 5 TAHUN (2022 - 2026):
${histData.yearlyTrends.map(y => `- Tahun ${y.year}: Luas Terbakar: ${y.fireHectaresBurned.toLocaleString()} Ha, Hotspot: ${y.fireHotspotCount}, Kejadian Banjir: ${y.floodDisasterCount} kali, Warga Mengungsi: ${y.floodAffectedPeople.toLocaleString()} jiwa, Kerugian Ekonomi: Rp ${y.economicLossBillionsIDR} Miliar.`).join('\n')}

DATA SIKLUS BULANAN (12 BULAN):
${histData.monthlyTrends.map(m => `[${m.month}] Hotspot: ${m.fireHotspots} (Skor Api: ${m.fireRiskScore}/100), Hujan: ${m.rainfallMm} mm, Kejadian Banjir: ${m.floodIncidents} (Skor Banjir: ${m.floodRiskScore}/100), Ancaman Utama: ${m.dominantThreat}`).join('\n')}

DATA FASILITAS & KAPASITAS SAAT INI:
- Karhutla: Risiko ${region.fireReadiness.riskLevel}, ${region.fireReadiness.activeHotspots} Hotspot, Gambut: ${(region.fireReadiness.peatlandAreaHa / 1000).toLocaleString()} Ribu Ha, Relawan Damkar/MPA: ${region.fireReadiness.firefightingVolunteers} orang, Sekat Kanal: ${region.fireReadiness.canalBlocksBuilt} unit.
- Banjir: Risiko ${region.floodReadiness.riskLevel}, ${region.floodReadiness.floodPronePoints} Titik Rawan, Pompa: ${region.floodReadiness.drainagePumpCapacityM3s} m3/detik, Perahu Karet: ${region.floodReadiness.rubberBoatsAvailable} unit, Relawan SAR Air: ${region.floodReadiness.waterRescueVolunteers} orang.
- Logistik: ${region.logisticsCapacity.emergencyTents} Tenda Darurat, ${region.logisticsCapacity.generators} Genset, ${region.logisticsCapacity.hygieneKits} Kit Higienis, Dapur Umum: ${region.logisticsCapacity.fieldKitchenCapacityMealsPerDay.toLocaleString()} porsi/hari.

INSTRUKSI PENYUSUNAN NARASI:
Susun analisis naratif yang elegan, taktis, berbasis sains iklim dan empirisme data.
Uraikan korelasi anomali El Niño 2023, dinamika pergeseran monsun, jendela aksi antisipatif 30-60 hari, serta panduan taktis penempatan dini relawan dan logistik.

Kembalikan HANYA format JSON valid tanpa teks atau markdown pembungkus di luar JSON:
{
  "provinceId": "${region.id}",
  "provinceName": "${region.province}",
  "generatedAt": "${new Date().toISOString()}",
  "executiveHeadline": "Tajuk utama naratif yang kuat dan ringkas (1 kalimat padat)",
  "trendTrajectoryAnalysis": "Uraian naratif komprehensif 2-3 paragraf mengenai lintasan tren 5 tahun (mengapa 2023 melonjak, bagaimana 2024-2026 stabil/bergeser, dan implikasi bagi kebijakan operasional)...",
  "seasonalCyclicalDeepDive": "Uraian naratif 2 paragraf mengenai siklus 12 bulan (fase kering, fase transisi berbahaya, dan fase basah ekstrem)...",
  "climateAnomalyCorrelation": {
    "elNinoImpactSummary": "Analisis dampak empiris anomali El Niño / fase kering terhadap hotspot dan kekeringan...",
    "laNinaOrMonsoonRisk": "Analisis dampak La Niña / Monsun Asia terhadap curah hujan ekstrem dan luapan DAS...",
    "recurrencePattern": "Pola perulangan periodik bencana di wilayah ini..."
  },
  "predictiveRiskForecastNext6Months": [
    {
      "period": "Rentang Periode (misal: Okt - Des 2026)",
      "projectedThreat": "Proyeksi ancaman utama",
      "vulnerabilityForecast": "Prakiraan dampak dan wilayah rawan",
      "preemptiveAlertLevel": "Siaga"
    },
    {
      "period": "Rentang Periode (misal: Jan - Feb 2027)",
      "projectedThreat": "Proyeksi ancaman utama",
      "vulnerabilityForecast": "Prakiraan dampak dan wilayah rawan",
      "preemptiveAlertLevel": "Awas"
    },
    {
      "period": "Rentang Periode (misal: Mar - Apr 2027)",
      "projectedThreat": "Proyeksi ancaman utama",
      "vulnerabilityForecast": "Prakiraan dampak dan wilayah rawan",
      "preemptiveAlertLevel": "Waspada"
    }
  ],
  "dataDrivenActionRecommendations": [
    {
      "title": "Judul Rekomendasi 1",
      "timing": "Jendela waktu implementasi",
      "rationaleFromHistoricalData": "Alasan berbasis bukti data historis...",
      "actionItems": [
        "Aksi taktis konkret 1",
        "Aksi taktis konkret 2"
      ]
    },
    {
      "title": "Judul Rekomendasi 2",
      "timing": "Jendela waktu implementasi",
      "rationaleFromHistoricalData": "Alasan berbasis bukti data historis...",
      "actionItems": [
        "Aksi taktis konkret 1",
        "Aksi taktis konkret 2"
      ]
    }
  ],
  "volunteerAndLogisticsPrepositioning": "Panduan penempatan dini personel relawan dan armada peralatan sebelum puncak bencana..."
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.trendTrajectoryAnalysis && parsed.executiveHeadline) {
      return res.json(parsed);
    }
    return res.json(fallbackNarrative);
  } catch (err) {
    console.warn('[SIGAP AI Historical Narrative Error, using default]', err);
    return res.json(fallbackNarrative);
  }
});


/* ==========================================================================
   Vite Middleware / Production Static Serve
   ========================================================================== */

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const port = process.env.PORT || 3000;

  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`[SIGAP Koordinator] Server berjalan pada port ${port}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start SIGAP server:', err);
});
