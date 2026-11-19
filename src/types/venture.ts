export type UserRole = 'Designer' | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
}

export interface SessionState {
  userId: string;
  email: string;
  loggedInAt: string;
}

export type DesignerCategory =
  | 'Bridal lehenga'
  | 'Festive wear'
  | 'Fine jewelry'
  | 'Menswear'
  | 'Accessories'
  | 'Other';

export type StallSize = 'Small' | 'Medium' | 'Large';

export type DesignerNeed =
  | 'Live styling'
  | 'Fit-testing zone'
  | 'Designer networking'
  | 'Photography';

export type RecordStatus = 'Assessed' | 'Interested' | 'Committed' | 'Paid';

export type RecommendationTier = 'Book Now' | 'Consider with Adjustments' | 'Not Yet';

export interface DesignerInput {
  brandName: string;
  city: string;
  category: DesignerCategory;
  avgSellingPrice: number;
  expectedPiecesSold: number;
  monthlyAdSpend: number;
  onlineCustomersPerMonth: number;
  expectedWalkInLeads: number;
  expectedConversionRate: number;
  grossMarginPct: number;
  preferredMonth: string;
  preferredStallSize: StallSize;
  needs: DesignerNeed[];
}

export interface ScoreFactor {
  label: string;
  points: number;
  maxPoints: number;
  rationale: string;
}

export interface BreakEvenPoint {
  pieces: number;
  grossProfit: number;
  stallFee: number;
  revenue: number;
}

export interface AssessmentMetrics {
  stallFee: number;
  projectedRevenue: number;
  grossProfit: number;
  netProfit: number;
  roiPct: number;
  profitPerPiece: number;
  breakEvenPieces: number;
  leadImpliedPieces: number;
  onlineCAC: number;
  popupCAC: number;
  cacSavings: number;
  cacSavingsPct: number;
  readinessScore: number;
  scoreBreakdown: ScoreFactor[];
  recommendation: RecommendationTier;
  recommendationSummary: string;
  actionItems: string[];
  breakEvenCurve: BreakEvenPoint[];
}

export interface DesignerRecord {
  id: string;
  designerName: string;
  email: string;
  input: DesignerInput;
  metrics: AssessmentMetrics;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export type ActivityType =
  | 'signup'
  | 'login'
  | 'logout'
  | 'assessment'
  | 'status_change'
  | 'export'
  | 'fee_update'
  | 'reset';

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  email: string;
  type: ActivityType;
  message: string;
}
