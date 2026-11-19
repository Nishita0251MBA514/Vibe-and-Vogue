import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
  Legend,
} from 'recharts';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { AssessmentMetrics, DesignerInput } from '../types/venture';
import { formatINR, formatINRLakhs } from '../utils/format';

interface StepResultsProps {
  input: DesignerInput;
  metrics: AssessmentMetrics;
  onEditInputs: () => void;
  onProceedToReserve: () => void;
}

export const StepResults: React.FC<StepResultsProps> = ({
  input,
  metrics,
  onEditInputs,
  onProceedToReserve,
}) => {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (metrics.readinessScore / 100) * circumference;

  const cacChartData = [
    {
      channel: 'Online Ads CAC',
      cost: Math.round(metrics.onlineCAC),
    },
    {
      channel: 'Pop-Up Stall CAC',
      cost: Math.round(metrics.popupCAC),
    },
  ];

  const tierStyles = {
    'Book Now': {
      bg: 'bg-[#ECFDF5]',
      border: 'border-[#16A34A]/30',
      text: 'text-[#166534]',
      icon: CheckCircle2,
    },
    'Consider with Adjustments': {
      bg: 'bg-[#FFFBEB]',
      border: 'border-[#D97706]/35',
      text: 'text-[#92400E]',
      icon: AlertTriangle,
    },
    'Not Yet': {
      bg: 'bg-[#FEF2F2]',
      border: 'border-[#DC2626]/30',
      text: 'text-[#991B1B]',
      icon: XCircle,
    },
  }[metrics.recommendation];

  const TierIcon = tierStyles.icon;

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E2D9CE]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#E2D9CE] pb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#4A102A] font-semibold">
              Step 03 · Financial &amp; Readiness Assessment
            </p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-serif text-[#1F171A]">
              {input.brandName} · Exhibition Viability
            </h2>
            <p className="mt-1 text-sm text-[#6B5D62]">
              {input.city} · {input.category} · {input.preferredStallSize} Stall ({input.preferredMonth})
            </p>
          </div>

          <div
            className={`px-4 py-3 rounded-xl border ${tierStyles.bg} ${tierStyles.border} flex items-center gap-3 shrink-0`}
          >
            <TierIcon className={`w-5 h-5 shrink-0 ${tierStyles.text}`} />
            <div>
              <p className="text-[11px] uppercase tracking-wider font-semibold text-[#6B5D62]">
                Recommendation
              </p>
              <p className={`text-base font-serif font-semibold ${tierStyles.text}`}>
                {metrics.recommendation}
              </p>
            </div>
          </div>
        </div>

        {/* 4-Column Financial KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          <div>
            <p className="text-xs text-[#6B5D62]">Projected Revenue</p>
            <p className="mt-1 text-2xl font-serif text-[#1F171A] tabular-nums">
              {formatINRLakhs(metrics.projectedRevenue)}
            </p>
            <p className="mt-0.5 text-xs font-mono text-[#6B5D62] tabular-nums">
              {formatINR(metrics.projectedRevenue)} ({input.expectedPiecesSold} pcs)
            </p>
          </div>

          <div>
            <p className="text-xs text-[#6B5D62]">Gross Profit ({input.grossMarginPct}%)</p>
            <p className="mt-1 text-2xl font-serif text-[#1F171A] tabular-nums">
              {formatINRLakhs(metrics.grossProfit)}
            </p>
            <p className="mt-0.5 text-xs font-mono text-[#6B5D62] tabular-nums">
              Stall fee: {formatINR(metrics.stallFee)}
            </p>
          </div>

          <div>
            <p className="text-xs text-[#6B5D62]">Net Profit &amp; ROI</p>
            <p
              className={`mt-1 text-2xl font-serif tabular-nums ${
                metrics.netProfit >= 0 ? 'text-[#166534]' : 'text-[#991B1B]'
              }`}
            >
              {formatINR(metrics.netProfit)}
            </p>
            <p className="mt-0.5 text-xs font-mono text-[#6B5D62] tabular-nums">
              {metrics.roiPct >= 0 ? '+' : ''}
              {metrics.roiPct.toFixed(1)}% ROI on stall fee
            </p>
          </div>

          <div>
            <p className="text-xs text-[#6B5D62]">Break-Even &amp; CAC Savings</p>
            <p className="mt-1 text-2xl font-serif text-[#4A102A] tabular-nums">
              {metrics.breakEvenPieces} pieces
            </p>
            <p className="mt-0.5 text-xs font-mono text-[#6B5D62] tabular-nums">
              {metrics.cacSavings >= 0
                ? `Saves ${formatINR(metrics.cacSavings)}/buyer`
                : `${formatINR(Math.abs(metrics.cacSavings))} higher CAC`}
            </p>
          </div>
        </div>
      </div>

      {/* Readiness Score Gauge + Transparent Breakdown + Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Radial Progress Gauge */}
        <div className="lg:col-span-4 p-6 sm:p-8 rounded-2xl bg-white border border-[#E2D9CE] flex flex-col items-center justify-center text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-[#4A102A] font-semibold">
            Booking Readiness Score
          </p>

          <div className="relative w-40 h-40 my-5 flex items-center justify-center">
            <svg className="w-40 h-40 -rotate-90" viewBox="0 0 140 140" aria-hidden="true">
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="#EFE8DC"
                strokeWidth="12"
              />
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke={
                  metrics.readinessScore >= 70
                    ? '#4A102A'
                    : metrics.readinessScore >= 45
                      ? '#C59B48'
                      : '#991B1B'
                }
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-serif font-semibold text-[#1F171A] tabular-nums">
                {metrics.readinessScore}
              </span>
              <span className="text-xs text-[#6B5D62]">out of 100</span>
            </div>
          </div>

          <p className="text-sm text-[#6B5D62] leading-relaxed">
            {metrics.recommendationSummary}
          </p>
        </div>

        {/* Transparent Score Weighting & Suggestions */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-white border border-[#E2D9CE] flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-serif text-[#1F171A]">
              Transparent Score Weighting
            </h3>
            <div className="space-y-3.5">
              {metrics.scoreBreakdown.map((factor) => {
                const pct = Math.round((factor.points / factor.maxPoints) * 100);
                return (
                  <div key={factor.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-[#1F171A]">{factor.label}</span>
                      <span className="font-mono font-semibold text-[#4A102A] tabular-nums">
                        {factor.points} / {factor.maxPoints}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#EFE8DC] overflow-hidden">
                      <div
                        className="h-full bg-[#4A102A] rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-[#6B5D62]">{factor.rationale}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2D9CE]">
            <p className="text-xs uppercase tracking-[0.16em] text-[#4A102A] font-semibold mb-2">
              Strategic Next Steps
            </p>
            <ul className="space-y-1.5 text-sm text-[#1F171A]">
              {metrics.actionItems.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#C59B48] font-bold">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Recharts Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Online vs Pop-Up CAC Bar Chart */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E2D9CE] space-y-4">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <h3 className="text-lg font-serif text-[#1F171A]">
                Customer Acquisition Cost Comparison
              </h3>
              <p className="text-xs text-[#6B5D62]">
                Digital ad spend per acquired customer vs. turnkey pop-up cost per buyer
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-[#4A102A] tabular-nums">
              {metrics.cacSavingsPct >= 0
                ? `-${metrics.cacSavingsPct.toFixed(0)}% CAC`
                : `+${Math.abs(metrics.cacSavingsPct).toFixed(0)}% CAC`}
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cacChartData} margin={{ top: 12, right: 20, left: 10, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8DFD3" />
                <XAxis dataKey="channel" tick={{ fill: '#6B5D62', fontSize: 12 }} />
                <YAxis
                  tick={{ fill: '#6B5D62', fontSize: 12 }}
                  tickFormatter={(val: number) => `₹${Math.round(val / 1000)}k`}
                />
                <Tooltip
                  formatter={(value) => [formatINR(Number(value ?? 0)), 'Cost / Buyer']}
                  contentStyle={{
                    backgroundColor: '#FAF7F2',
                    borderColor: '#E2D9CE',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="cost" fill="#4A102A" radius={[6, 6, 0, 0]} barSize={56} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Break-Even Line Chart */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E2D9CE] space-y-4">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <h3 className="text-lg font-serif text-[#1F171A]">
                Break-Even Curve by Pieces Sold
              </h3>
              <p className="text-xs text-[#6B5D62]">
                Cumulative gross profit vs. {formatINR(metrics.stallFee)} turnkey stall fee
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-[#4A102A] tabular-nums">
              Break-even: {metrics.breakEvenPieces} pcs
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={metrics.breakEvenCurve}
                margin={{ top: 12, right: 20, left: 10, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E8DFD3" />
                <XAxis
                  dataKey="pieces"
                  tick={{ fill: '#6B5D62', fontSize: 12 }}
                  label={{
                    value: 'Pieces Sold',
                    position: 'insideBottom',
                    offset: -4,
                    fill: '#6B5D62',
                    fontSize: 11,
                  }}
                />
                <YAxis
                  tick={{ fill: '#6B5D62', fontSize: 12 }}
                  tickFormatter={(val: number) => `₹${Math.round(val / 1000)}k`}
                />
                <Tooltip
                  formatter={(value, name) => [formatINR(Number(value ?? 0)), String(name ?? '')]}
                  labelFormatter={(label) => `${label} pieces sold`}
                  contentStyle={{
                    backgroundColor: '#FAF7F2',
                    borderColor: '#E2D9CE',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <ReferenceLine
                  x={metrics.breakEvenPieces}
                  stroke="#C59B48"
                  strokeDasharray="4 4"
                  label={{
                    value: `BE (${metrics.breakEvenPieces})`,
                    fill: '#4A102A',
                    fontSize: 11,
                    position: 'top',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="grossProfit"
                  name="Gross Profit"
                  stroke="#4A102A"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="stallFee"
                  name="Stall Fee"
                  stroke="#C59B48"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onEditInputs}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-[#D8CEC0] bg-white hover:bg-[#F3EDE3] text-sm font-medium text-[#1F171A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Adjust Inputs</span>
        </button>

        <button
          type="button"
          onClick={onProceedToReserve}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#4A102A] hover:bg-[#380A1F] text-white text-sm font-medium transition-colors"
        >
          <span>Reserve Interest &amp; Export Report</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
