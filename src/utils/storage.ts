import {
  ActivityLogEntry,
  ActivityType,
  DesignerInput,
  DesignerRecord,
  RecordStatus,
  SessionState,
  User,
} from '../types/venture';
import { calculateAssessment } from './calculations';

const KEYS = {
  USERS: 'vv_studio_users_v1',
  SESSION: 'vv_studio_session_v1',
  RECORDS: 'vv_studio_records_v1',
  ACTIVITY: 'vv_studio_activity_v1',
  STALL_FEE: 'vv_studio_stall_fee_v1',
  CURRENT_INPUT: 'vv_studio_current_input_v1',
};

export const DEFAULT_STALL_FEE = 85000;
export const VALIDATION_TARGET = 35;

export const DEFAULT_DESIGNER_INPUT: DesignerInput = {
  brandName: '',
  city: 'New Delhi',
  category: 'Bridal lehenga',
  avgSellingPrice: 68000,
  expectedPiecesSold: 6,
  monthlyAdSpend: 110000,
  onlineCustomersPerMonth: 5,
  expectedWalkInLeads: 130,
  expectedConversionRate: 5.5,
  grossMarginPct: 58,
  preferredMonth: 'November',
  preferredStallSize: 'Medium',
  needs: ['Live styling', 'Fit-testing zone'],
};

const SEED_USERS: User[] = [
  {
    id: 'usr-admin-nishita',
    name: 'Nishita Singh',
    email: 'nishita.0251mba514@dgu.ac.in',
    password: 'Admin@123',
    role: 'Admin',
    createdAt: '2026-10-12T09:30:00.000Z',
  },
  {
    id: 'usr-designer-demo',
    name: 'Ananya Verma',
    email: 'designer@demo.com',
    password: 'Designer@123',
    role: 'Designer',
    createdAt: '2026-10-15T11:15:00.000Z',
  },
];

interface SeedSpec {
  id: string;
  designerName: string;
  email: string;
  status: RecordStatus;
  daysAgo: number;
  input: DesignerInput;
}

const SEED_SPECS: SeedSpec[] = [
  {
    id: 'rec-001',
    designerName: 'Meera Kapoor',
    email: 'meera@zariatelier.in',
    status: 'Paid',
    daysAgo: 11,
    input: {
      brandName: 'Zari & Loom Atelier',
      city: 'New Delhi',
      category: 'Bridal lehenga',
      avgSellingPrice: 125000,
      expectedPiecesSold: 5,
      monthlyAdSpend: 140000,
      onlineCustomersPerMonth: 4,
      expectedWalkInLeads: 140,
      expectedConversionRate: 4.5,
      grossMarginPct: 60,
      preferredMonth: 'November',
      preferredStallSize: 'Large',
      needs: ['Live styling', 'Fit-testing zone', 'Photography'],
    },
  },
  {
    id: 'rec-002',
    designerName: 'Rhea Malhotra',
    email: 'rhea@noorcouture.co.in',
    status: 'Paid',
    daysAgo: 9,
    input: {
      brandName: 'Noor Heritage Couture',
      city: 'Gurugram',
      category: 'Bridal lehenga',
      avgSellingPrice: 95000,
      expectedPiecesSold: 6,
      monthlyAdSpend: 125000,
      onlineCustomersPerMonth: 4,
      expectedWalkInLeads: 150,
      expectedConversionRate: 5.0,
      grossMarginPct: 56,
      preferredMonth: 'October',
      preferredStallSize: 'Large',
      needs: ['Live styling', 'Fit-testing zone'],
    },
  },
  {
    id: 'rec-003',
    designerName: 'Kabir Sethi',
    email: 'kabir@sethijewels.in',
    status: 'Committed',
    daysAgo: 7,
    input: {
      brandName: 'Kundan & Co.',
      city: 'Jaipur',
      category: 'Fine jewelry',
      avgSellingPrice: 145000,
      expectedPiecesSold: 4,
      monthlyAdSpend: 115000,
      onlineCustomersPerMonth: 3,
      expectedWalkInLeads: 110,
      expectedConversionRate: 4.0,
      grossMarginPct: 48,
      preferredMonth: 'November',
      preferredStallSize: 'Medium',
      needs: ['Live styling', 'Designer networking', 'Photography'],
    },
  },
  {
    id: 'rec-004',
    designerName: 'Tara Singhania',
    email: 'tara@amritasilks.in',
    status: 'Committed',
    daysAgo: 6,
    input: {
      brandName: 'Amrita Handloom Studio',
      city: 'Noida',
      category: 'Festive wear',
      avgSellingPrice: 48000,
      expectedPiecesSold: 9,
      monthlyAdSpend: 95000,
      onlineCustomersPerMonth: 5,
      expectedWalkInLeads: 165,
      expectedConversionRate: 6.0,
      grossMarginPct: 58,
      preferredMonth: 'October',
      preferredStallSize: 'Medium',
      needs: ['Fit-testing zone', 'Photography'],
    },
  },
  {
    id: 'rec-005',
    designerName: 'Devika Joshi',
    email: 'devika@raajwadamens.com',
    status: 'Committed',
    daysAgo: 5,
    input: {
      brandName: 'Virasat Bespoke',
      city: 'New Delhi',
      category: 'Menswear',
      avgSellingPrice: 62000,
      expectedPiecesSold: 7,
      monthlyAdSpend: 88000,
      onlineCustomersPerMonth: 4,
      expectedWalkInLeads: 120,
      expectedConversionRate: 6.5,
      grossMarginPct: 55,
      preferredMonth: 'December',
      preferredStallSize: 'Medium',
      needs: ['Fit-testing zone', 'Designer networking'],
    },
  },
  {
    id: 'rec-006',
    designerName: 'Ananya Verma',
    email: 'designer@demo.com',
    status: 'Interested',
    daysAgo: 4,
    input: {
      brandName: 'Meher & Gulab',
      city: 'New Delhi',
      category: 'Festive wear',
      avgSellingPrice: 54000,
      expectedPiecesSold: 7,
      monthlyAdSpend: 105000,
      onlineCustomersPerMonth: 5,
      expectedWalkInLeads: 135,
      expectedConversionRate: 5.5,
      grossMarginPct: 54,
      preferredMonth: 'November',
      preferredStallSize: 'Medium',
      needs: ['Live styling', 'Fit-testing zone'],
    },
  },
  {
    id: 'rec-007',
    designerName: 'Sanya Oberoi',
    email: 'sanya@potliatelier.in',
    status: 'Interested',
    daysAgo: 2,
    input: {
      brandName: 'Sanya Potli & Clutches',
      city: 'Chandigarh',
      category: 'Accessories',
      avgSellingPrice: 22000,
      expectedPiecesSold: 12,
      monthlyAdSpend: 65000,
      onlineCustomersPerMonth: 6,
      expectedWalkInLeads: 180,
      expectedConversionRate: 7.0,
      grossMarginPct: 62,
      preferredMonth: 'October',
      preferredStallSize: 'Small',
      needs: ['Photography', 'Designer networking'],
    },
  },
  {
    id: 'rec-008',
    designerName: 'Vikramaditya Rao',
    email: 'vikram@raocrafts.in',
    status: 'Assessed',
    daysAgo: 1,
    input: {
      brandName: 'Rao Artisanal Pret',
      city: 'Lucknow',
      category: 'Other',
      avgSellingPrice: 26000,
      expectedPiecesSold: 5,
      monthlyAdSpend: 40000,
      onlineCustomersPerMonth: 4,
      expectedWalkInLeads: 95,
      expectedConversionRate: 4.5,
      grossMarginPct: 45,
      preferredMonth: 'January',
      preferredStallSize: 'Small',
      needs: ['Designer networking'],
    },
  },
];

function buildSeedRecords(stallFee: number): DesignerRecord[] {
  const now = Date.now();
  return SEED_SPECS.map((spec) => {
    const timestamp = new Date(now - spec.daysAgo * 86400000).toISOString();
    return {
      id: spec.id,
      designerName: spec.designerName,
      email: spec.email,
      input: spec.input,
      metrics: calculateAssessment(spec.input, stallFee),
      status: spec.status,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  });
}

function buildSeedActivity(records: DesignerRecord[]): ActivityLogEntry[] {
  return records.slice(0, 5).map((rec, idx) => ({
    id: `act-seed-${idx + 1}`,
    timestamp: rec.updatedAt,
    email: rec.email,
    type: rec.status === 'Assessed' ? 'assessment' : 'status_change',
    message:
      rec.status === 'Assessed'
        ? `ran an assessment for ${rec.input.brandName}`
        : `recorded status "${rec.status}" for ${rec.input.brandName}`,
  }));
}

export function initializeStorage(): void {
  if (!localStorage.getItem(KEYS.STALL_FEE)) {
    localStorage.setItem(KEYS.STALL_FEE, String(DEFAULT_STALL_FEE));
  }
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(SEED_USERS));
  }
  const fee = getStallFee();
  if (!localStorage.getItem(KEYS.RECORDS)) {
    const seedRecs = buildSeedRecords(fee);
    localStorage.setItem(KEYS.RECORDS, JSON.stringify(seedRecs));
    if (!localStorage.getItem(KEYS.ACTIVITY)) {
      localStorage.setItem(KEYS.ACTIVITY, JSON.stringify(buildSeedActivity(seedRecs)));
    }
  } else if (!localStorage.getItem(KEYS.ACTIVITY)) {
    localStorage.setItem(KEYS.ACTIVITY, JSON.stringify([]));
  }
}

export function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(KEYS.USERS);
    return raw ? (JSON.parse(raw) as User[]) : SEED_USERS;
  } catch {
    return SEED_USERS;
  }
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

export function getSession(): SessionState | null {
  try {
    const raw = localStorage.getItem(KEYS.SESSION);
    return raw ? (JSON.parse(raw) as SessionState) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: SessionState | null): void {
  if (session) {
    localStorage.setItem(KEYS.SESSION, JSON.stringify(session));
  } else {
    localStorage.removeItem(KEYS.SESSION);
  }
}

export function getStallFee(): number {
  const raw = localStorage.getItem(KEYS.STALL_FEE);
  const parsed = raw ? Number(raw) : DEFAULT_STALL_FEE;
  return Number.isFinite(parsed) && parsed >= 1000 ? parsed : DEFAULT_STALL_FEE;
}

export function saveStallFee(fee: number): void {
  localStorage.setItem(KEYS.STALL_FEE, String(fee));
}

export function getRecords(): DesignerRecord[] {
  try {
    const raw = localStorage.getItem(KEYS.RECORDS);
    return raw ? (JSON.parse(raw) as DesignerRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveRecords(records: DesignerRecord[]): void {
  localStorage.setItem(KEYS.RECORDS, JSON.stringify(records));
}

export function getActivityLog(): ActivityLogEntry[] {
  try {
    const raw = localStorage.getItem(KEYS.ACTIVITY);
    return raw ? (JSON.parse(raw) as ActivityLogEntry[]) : [];
  } catch {
    return [];
  }
}

export function appendActivity(
  email: string,
  type: ActivityType,
  message: string
): ActivityLogEntry[] {
  const existing = getActivityLog();
  const entry: ActivityLogEntry = {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    email,
    type,
    message,
  };
  const next = [entry, ...existing].slice(0, 100);
  localStorage.setItem(KEYS.ACTIVITY, JSON.stringify(next));
  return next;
}

export function getSavedInput(email: string): DesignerInput | null {
  try {
    const raw = localStorage.getItem(`${KEYS.CURRENT_INPUT}_${email.toLowerCase()}`);
    return raw ? (JSON.parse(raw) as DesignerInput) : null;
  } catch {
    return null;
  }
}

export function saveInputForUser(email: string, input: DesignerInput): void {
  localStorage.setItem(`${KEYS.CURRENT_INPUT}_${email.toLowerCase()}`, JSON.stringify(input));
}

export function resetDemoRecords(adminEmail: string): {
  records: DesignerRecord[];
  activity: ActivityLogEntry[];
} {
  saveStallFee(DEFAULT_STALL_FEE);
  const seedRecs = buildSeedRecords(DEFAULT_STALL_FEE);
  saveRecords(seedRecs);
  const activity = appendActivity(
    adminEmail,
    'reset',
    'reset sample designer records and restored ₹85,000 stall fee'
  );
  return { records: seedRecs, activity };
}
