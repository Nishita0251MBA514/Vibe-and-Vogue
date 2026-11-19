import {
  AssessmentMetrics,
  BreakEvenPoint,
  DesignerInput,
  RecommendationTier,
  ScoreFactor,
} from '../types/venture';
import { formatINR } from './format';

export function calculateAssessment(input: DesignerInput, stallFee: number): AssessmentMetrics {
  const safePrice = Math.max(0, input.avgSellingPrice);
  const safePieces = Math.max(0, input.expectedPiecesSold);
  const safeMargin = Math.min(95, Math.max(1, input.grossMarginPct));
  const safeAdSpend = Math.max(0, input.monthlyAdSpend);
  const safeOnlineCust = Math.max(1, input.onlineCustomersPerMonth);
  const safeWalkIns = Math.max(0, input.expectedWalkInLeads);
  const safeConv = Math.min(100, Math.max(0, input.expectedConversionRate));
  const safeFee = Math.max(1000, stallFee);

  const projectedRevenue = safePrice * safePieces;
  const grossProfit = projectedRevenue * (safeMargin / 100);
  const netProfit = grossProfit - safeFee;
  const roiPct = (netProfit / safeFee) * 100;

  const profitPerPiece = safePrice * (safeMargin / 100);
  const breakEvenPieces = profitPerPiece > 0 ? Math.ceil(safeFee / profitPerPiece) : 999;
  const leadImpliedPieces = Math.round(safeWalkIns * (safeConv / 100));

  const onlineCAC = safeAdSpend / safeOnlineCust;
  const popupCAC = safePieces > 0 ? safeFee / safePieces : safeFee;
  const cacSavings = onlineCAC - popupCAC;
  const cacSavingsPct = onlineCAC > 0 ? (cacSavings / onlineCAC) * 100 : 0;

  // Transparent 100-point Booking Readiness Score
  // 1. ROI & Net Margin Viability (40 pts)
  let roiPoints = 0;
  if (roiPct >= 200) roiPoints = 40;
  else if (roiPct >= 100) roiPoints = 30 + Math.round(((roiPct - 100) / 100) * 10);
  else if (roiPct >= 25) roiPoints = 18 + Math.round(((roiPct - 25) / 75) * 12);
  else if (roiPct >= 0) roiPoints = 10 + Math.round((roiPct / 25) * 8);
  else roiPoints = Math.max(0, Math.round(10 + roiPct / 10));

  // 2. Break-Even Cushion (25 pts)
  const breakEvenRatio = breakEvenPieces > 0 ? safePieces / breakEvenPieces : 0;
  let breakEvenPoints = 0;
  if (breakEvenRatio >= 2.2) breakEvenPoints = 25;
  else if (breakEvenRatio >= 1.5) breakEvenPoints = 18 + Math.round(((breakEvenRatio - 1.5) / 0.7) * 7);
  else if (breakEvenRatio >= 1.0) breakEvenPoints = 11 + Math.round(((breakEvenRatio - 1.0) / 0.5) * 7);
  else breakEvenPoints = Math.max(0, Math.round(breakEvenRatio * 10));

  // 3. CAC Advantage vs Digital Ads (20 pts)
  let cacPoints = 0;
  if (cacSavingsPct >= 40) cacPoints = 20;
  else if (cacSavingsPct >= 15) cacPoints = 14 + Math.round(((cacSavingsPct - 15) / 25) * 6);
  else if (cacSavingsPct >= 0) cacPoints = 8 + Math.round((cacSavingsPct / 15) * 6);
  else cacPoints = Math.max(0, Math.round(8 + cacSavingsPct / 12));

  // 4. Delhi NCR Luxury Fit & Lead Pipeline (15 pts)
  let fitPoints = 0;
  const priceFit = safePrice >= 35000 ? 7 : safePrice >= 20000 ? 5 : 2;
  const leadFit = leadImpliedPieces >= safePieces ? 8 : Math.max(2, Math.round((leadImpliedPieces / Math.max(1, safePieces)) * 8));
  fitPoints = Math.min(15, priceFit + leadFit);

  const readinessScore = Math.min(100, Math.max(0, roiPoints + breakEvenPoints + cacPoints + fitPoints));

  const scoreBreakdown: ScoreFactor[] = [
    {
      label: 'ROI & Net Margin Viability',
      points: roiPoints,
      maxPoints: 40,
      rationale: `${roiPct.toFixed(1)}% projected return on the ${formatINR(safeFee)} stall fee.`,
    },
    {
      label: 'Break-Even Cushion',
      points: breakEvenPoints,
      maxPoints: 25,
      rationale: `${safePieces} projected pieces vs. ${breakEvenPieces} needed to recover stall cost (${breakEvenRatio.toFixed(1)}× cover).`,
    },
    {
      label: 'CAC Advantage Over Digital Ads',
      points: cacPoints,
      maxPoints: 20,
      rationale:
        cacSavings >= 0
          ? `Pop-up CAC (${formatINR(popupCAC)}) saves ${formatINR(cacSavings)} per buyer vs. online ads (${formatINR(onlineCAC)}).`
          : `Online CAC (${formatINR(onlineCAC)}) currently undercuts pop-up CAC (${formatINR(popupCAC)}).`,
    },
    {
      label: 'Luxury Price & Walk-In Pipeline Fit',
      points: fitPoints,
      maxPoints: 15,
      rationale: `${safeWalkIns} expected walk-ins at ${safeConv}% conversion imply ~${leadImpliedPieces} pieces at ${formatINR(safePrice)} ASP.`,
    },
  ];

  let recommendation: RecommendationTier = 'Not Yet';
  let recommendationSummary = '';
  const actionItems: string[] = [];

  if (readinessScore >= 70 && netProfit > 0) {
    recommendation = 'Book Now';
    recommendationSummary = `Strong unit economics for a 5-star Delhi NCR showcase. Your projected net profit is ${formatINR(netProfit)} with break-even achieved at just ${breakEvenPieces} pieces.`;
    actionItems.push(
      `Lock a ${input.preferredStallSize} stall for ${input.preferredMonth} before peak bridal slots close.`,
      `Prioritize high-margin hero pieces around ${formatINR(safePrice)} and bring 2× depth on bestsellers.`,
      input.needs.includes('Live styling')
        ? 'Use the included live styling concierge to bundle bridal + trousseau looks and lift order value.'
        : 'Add live styling consultations to capture hesitant brides 1–2 months before wedding dates.'
    );
  } else if (readinessScore >= 45 || netProfit >= -15000) {
    recommendation = 'Consider with Adjustments';
    recommendationSummary = `Borderline return under current assumptions (${formatINR(netProfit)} net profit). Small shifts in average order value or conversion can push this comfortably into Book Now territory.`;
    if (safePieces <= breakEvenPieces) {
      actionItems.push(
        `You need ${breakEvenPieces} pieces to break even; target ${breakEvenPieces + 2} pieces by promoting pre-booked private appointments.`
      );
    }
    if (safePrice < 40000) {
      actionItems.push(
        `Raise effective ticket size above ${formatINR(45000)} by curating coordinated sets (lehenga + drape or jewelry pairing).`
      );
    }
    if (leadImpliedPieces < safePieces) {
      actionItems.push(
        `Your walk-in conversion (${safeConv}% of ${safeWalkIns} = ${leadImpliedPieces} pieces) trails your ${safePieces}-piece target; activate fit-testing zones and VIP invite previews.`
      );
    }
    if (actionItems.length === 0) {
      actionItems.push(
        `Negotiate high-margin capsule inventory (${Math.min(75, safeMargin + 8)}% margin) to expand net surplus above ${formatINR(safeFee)}.`
      );
    }
  } else {
    recommendation = 'Not Yet';
    recommendationSummary = `Current projections result in a net shortfall of ${formatINR(Math.abs(netProfit))}. Hold off on booking until unit economics or ticket volume strengthen.`;
    if (breakEvenPieces > safePieces) {
      actionItems.push(
        `Break-even requires ${breakEvenPieces} pieces against ${safePieces} expected sales — reduce stall dependency or increase ASP.`
      );
    }
    if (cacSavings < 0) {
      actionItems.push(
        `Your digital CAC (${formatINR(onlineCAC)}) is currently more efficient than pop-up CAC (${formatINR(popupCAC)}).`
      );
    }
    actionItems.push(
      `Consider sharing a curated capsule rack or waiting until your signature collection reaches ₹35,000+ ASP.`
    );
  }

  const maxCurvePieces = Math.max(10, Math.ceil(Math.max(safePieces, breakEvenPieces) * 1.6));
  const breakEvenCurve: BreakEvenPoint[] = [];
  for (let p = 0; p <= maxCurvePieces; p += 1) {
    breakEvenCurve.push({
      pieces: p,
      grossProfit: Math.round(p * profitPerPiece),
      stallFee: safeFee,
      revenue: Math.round(p * safePrice),
    });
  }

  return {
    stallFee: safeFee,
    projectedRevenue,
    grossProfit,
    netProfit,
    roiPct,
    profitPerPiece,
    breakEvenPieces,
    leadImpliedPieces,
    onlineCAC,
    popupCAC,
    cacSavings,
    cacSavingsPct,
    readinessScore,
    scoreBreakdown,
    recommendation,
    recommendationSummary,
    actionItems,
    breakEvenCurve,
  };
}
