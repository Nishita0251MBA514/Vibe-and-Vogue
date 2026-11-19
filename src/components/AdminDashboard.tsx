import React, { useMemo, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  RotateCcw,
  Users,
  Search,
} from 'lucide-react';
import {
  DesignerCategory,
  DesignerRecord,
  RecordStatus,
  User,
} from '../types/venture';
import { formatDateTime, formatINR, formatINRLakhs } from '../utils/format';
import { VALIDATION_TARGET } from '../utils/storage';

interface AdminDashboardProps {
  users: User[];
  records: DesignerRecord[];
  stallFee: number;
  isLoading: boolean;
  onUpdateStatus: (recordId: string, nextStatus: RecordStatus) => Promise<void>;
  onUpdateStallFee: (fee: number) => Promise<void>;
  onExportAllCSV: () => Promise<void>;
  onResetDemoData: () => Promise<void>;
  onOpenRecordInStudio: (record: DesignerRecord) => void;
}

const PIE_COLORS = ['#4A102A', '#C59B48', '#7C3E57', '#9F7A32', '#2E0A1B', '#B8A89A'];

const CATEGORIES: ('All' | DesignerCategory)[] = [
  'All',
  'Bridal lehenga',
  'Festive wear',
  'Fine jewelry',
  'Menswear',
  'Accessories',
  'Other',
];

const STATUSES: ('All' | RecordStatus)[] = [
  'All',
  'Assessed',
  'Interested',
  'Committed',
  'Paid',
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users,
  records,
  stallFee,
  isLoading,
  onUpdateStatus,
  onUpdateStallFee,
  onExportAllCSV,
  onResetDemoData,
  onOpenRecordInStudio,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'All' | DesignerCategory>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | RecordStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [feeDraft, setFeeDraft] = useState(String(stallFee));

  const committedRecords = useMemo(
    () => records.filter((r) => r.status === 'Committed' || r.status === 'Paid'),
    [records]
  );

  const committedCount = committedRecords.length;
  const remainingNeeded = Math.max(0, VALIDATION_TARGET - committedCount);
  const progressPct = Math.min(100, Math.round((committedCount / VALIDATION_TARGET) * 100));
  const isValidated = committedCount >= VALIDATION_TARGET;

  const totalCommittedRevenue = committedCount * stallFee;
  const avgROI =
    records.length > 0
      ? records.reduce((sum, r) => sum + r.metrics.roiPct, 0) / records.length
      : 0;
  const avgScore =
    records.length > 0
      ? records.reduce((sum, r) => sum + r.metrics.readinessScore, 0) / records.length
      : 0;

  const funnelCounts = useMemo(() => {
    return {
      Assessed: records.length,
      Interested: records.filter((r) =>
        ['Interested', 'Committed', 'Paid'].includes(r.status)
      ).length,
      Committed: records.filter((r) => ['Committed', 'Paid'].includes(r.status)).length,
      Paid: records.filter((r) => r.status === 'Paid').length,
    };
  }, [records]);

  const categoryPieData = useMemo(() => {
    const counts = new Map<string, number>();
    records.forEach((r) => {
      counts.set(r.input.category, (counts.get(r.input.category) ?? 0) + 1);
    });
    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
  }, [records]);

  const filteredRecords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return records.filter((r) => {
      if (categoryFilter !== 'All' && r.input.category !== categoryFilter) return false;
      if (statusFilter !== 'All' && r.status !== statusFilter) return false;
      if (q) {
        const hay = `${r.input.brandName} ${r.designerName} ${r.email} ${r.input.city}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [records, categoryFilter, statusFilter, searchQuery]);

  const handleApplyFee = async () => {
    const num = Number(feeDraft);
    if (Number.isFinite(num) && num >= 10000 && num <= 500000) {
      await onUpdateStallFee(Math.round(num));
    } else {
      setFeeDraft(String(stallFee));
    }
  };

  return (
    <div className="space-y-6">
      {/* Validation Verdict Banner + Progress Toward 35 Designers */}
      <section className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E2D9CE] space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.18em] text-[#4A102A] font-semibold">
              Founder Validation Console · Nishita Singh
            </p>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#1F171A]">
              35-Designer Stall Commitment Tracker
            </h1>
            <p className="text-sm text-[#6B5D62]">
              Validation Question: Will at least 35 indie luxury designers pay an upfront stall booking fee of{' '}
              <span className="font-mono font-semibold text-[#1F171A]">{formatINR(stallFee)}</span>{' '}
              for a curated 5-star venue?
            </p>
          </div>

          <div
            className={`px-4 py-3 rounded-xl border flex items-center gap-3 shrink-0 ${
              isValidated
                ? 'bg-[#ECFDF5] border-[#16A34A]/35 text-[#166534]'
                : 'bg-[#FFFBEB] border-[#D97706]/35 text-[#92400E]'
            }`}
          >
            {isValidated ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <Clock className="w-5 h-5 shrink-0" />
            )}
            <div>
              <p className="text-[11px] uppercase tracking-wider font-semibold opacity-80">
                Validation Verdict
              </p>
              <p className="text-base font-serif font-semibold tabular-nums">
                {isValidated
                  ? `Validated (${committedCount} / ${VALIDATION_TARGET})`
                  : `${remainingNeeded} more needed (${committedCount} / ${VALIDATION_TARGET})`}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-[#6B5D62]">
            <span>Committed + Paid Designers Toward Launch Threshold</span>
            <span className="font-mono font-semibold text-[#4A102A] tabular-nums">
              {committedCount} / {VALIDATION_TARGET} ({progressPct}%)
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-[#EFE8DC] overflow-hidden">
            <div
              className="h-full bg-[#4A102A] rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Admin Actions & Editable Stall Fee */}
        <div className="pt-4 border-t border-[#E2D9CE] flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="admin-fee-input" className="text-xs font-medium text-[#6B5D62]">
              Active Stall Fee (₹):
            </label>
            <input
              id="admin-fee-input"
              type="number"
              min={10000}
              max={500000}
              step={1000}
              value={feeDraft}
              onChange={(e) => setFeeDraft(e.target.value)}
              className="w-28 px-2.5 py-1.5 bg-[#FAF7F2] border border-[#D8CEC0] rounded-lg text-sm font-mono font-semibold text-[#1F171A] tabular-nums"
            />
            <button
              type="button"
              disabled={isLoading}
              onClick={handleApplyFee}
              className="px-3.5 py-1.5 rounded-lg bg-[#4A102A] hover:bg-[#380A1F] text-white text-xs font-medium transition-colors"
            >
              Update Fee
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={onExportAllCSV}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#D8CEC0] bg-white hover:bg-[#F3EDE3] text-xs font-medium text-[#1F171A] transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#4A102A]" />
              <span>Export All CSV</span>
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={onResetDemoData}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#D8CEC0] bg-[#FAF7F2] hover:bg-[#EFE8DC] text-xs font-medium text-[#1F171A] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#4A102A]" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4-Metric KPI Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E2D9CE]">
          <p className="text-xs text-[#6B5D62]">Total Committed Revenue</p>
          <p className="mt-1 text-2xl font-serif text-[#4A102A] tabular-nums">
            {formatINRLakhs(totalCommittedRevenue)}
          </p>
          <p className="mt-0.5 text-xs font-mono text-[#6B5D62] tabular-nums">
            {committedCount} × {formatINR(stallFee)}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2D9CE]">
          <p className="text-xs text-[#6B5D62]">Average Projected ROI</p>
          <p className="mt-1 text-2xl font-serif text-[#1F171A] tabular-nums">
            {avgROI >= 0 ? '+' : ''}
            {avgROI.toFixed(1)}%
          </p>
          <p className="mt-0.5 text-xs text-[#6B5D62]">Across {records.length} assessments</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2D9CE]">
          <p className="text-xs text-[#6B5D62]">Average Readiness Score</p>
          <p className="mt-1 text-2xl font-serif text-[#1F171A] tabular-nums">
            {avgScore.toFixed(0)} / 100
          </p>
          <p className="mt-0.5 text-xs text-[#6B5D62]">Commercial stall fit index</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2D9CE]">
          <p className="text-xs text-[#6B5D62]">Paid Settlements (Mock)</p>
          <p className="mt-1 text-2xl font-serif text-[#166534] tabular-nums">
            {funnelCounts.Paid} designers
          </p>
          <p className="mt-0.5 text-xs font-mono text-[#6B5D62] tabular-nums">
            {formatINRLakhs(funnelCounts.Paid * stallFee)} collected
          </p>
        </div>
      </section>

      {/* Funnel + Category Mix Pie Chart */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-white border border-[#E2D9CE] space-y-5">
          <div>
            <h2 className="text-lg font-serif text-[#1F171A]">
              Designer Validation Funnel
            </h2>
            <p className="text-xs text-[#6B5D62]">
              Progression from initial ROI assessment to paid booking pledge
            </p>
          </div>

          <div className="space-y-4">
            {(
              [
                { stage: 'Assessed', count: funnelCounts.Assessed, color: '#8E7B81' },
                { stage: 'Interested', count: funnelCounts.Interested, color: '#C59B48' },
                { stage: 'Committed', count: funnelCounts.Committed, color: '#6E2143' },
                { stage: 'Paid', count: funnelCounts.Paid, color: '#4A102A' },
              ] as const
            ).map((step) => {
              const widthPct =
                funnelCounts.Assessed > 0
                  ? Math.max(8, Math.round((step.count / funnelCounts.Assessed) * 100))
                  : 0;
              return (
                <div key={step.stage} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[#1F171A]">{step.stage}</span>
                    <span className="font-mono font-semibold text-[#4A102A] tabular-nums">
                      {step.count} labels
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-[#EFE8DC] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${widthPct}%`, backgroundColor: step.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-white border border-[#E2D9CE] space-y-3">
          <div>
            <h2 className="text-lg font-serif text-[#1F171A]">Category Mix</h2>
            <p className="text-xs text-[#6B5D62]">
              Distribution of evaluated luxury labels by merchandise segment
            </p>
          </div>

          <div className="h-64 w-full">
            {categoryPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={82}
                    paddingAngle={2}
                  >
                    {categoryPieData.map((entry, idx) => (
                      <Cell key={entry.name} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${Number(value ?? 0)} designers`, 'Count']}
                    contentStyle={{
                      backgroundColor: '#FAF7F2',
                      borderColor: '#E2D9CE',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-[#6B5D62]">
                No designer records available.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* All Designers Table */}
      <section className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E2D9CE] space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-serif text-[#1F171A]">
              All Evaluated Designers ({filteredRecords.length})
            </h2>
            <p className="text-xs text-[#6B5D62]">
              Filter by category or reservation status, inspect emails, and update booking statuses inline
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#6B5D62] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search brand, name, email..."
                className="pl-8 pr-3 py-1.5 bg-[#FAF7F2] border border-[#D8CEC0] rounded-lg text-xs text-[#1F171A] focus:outline-none focus:border-[#4A102A]"
              />
            </div>

            <select
              aria-label="Filter by category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as 'All' | DesignerCategory)}
              className="px-3 py-1.5 bg-[#FAF7F2] border border-[#D8CEC0] rounded-lg text-xs text-[#1F171A]"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'All' | RecordStatus)}
              className="px-3 py-1.5 bg-[#FAF7F2] border border-[#D8CEC0] rounded-lg text-xs text-[#1F171A]"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? 'All Statuses' : s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2D9CE] text-[11px] uppercase tracking-wider text-[#6B5D62]">
                <th className="py-3 pr-4 font-semibold">Brand</th>
                <th className="py-3 pr-4 font-semibold">Designer</th>
                <th className="py-3 pr-4 font-semibold">Email</th>
                <th className="py-3 pr-4 font-semibold">Category</th>
                <th className="py-3 pr-4 font-semibold text-right">Score</th>
                <th className="py-3 pr-4 font-semibold text-right">ROI</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
                <th className="py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE8DC] text-sm">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-sm text-[#6B5D62]">
                    No designer records match the current filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#FAF7F2]/70 transition-colors">
                    <td className="py-3 pr-4 font-medium text-[#1F171A] whitespace-nowrap">
                      {rec.input.brandName}
                    </td>
                    <td className="py-3 pr-4 text-[#1F171A] whitespace-nowrap">
                      {rec.designerName}
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs text-[#6B5D62] whitespace-nowrap">
                      {rec.email}
                    </td>
                    <td className="py-3 pr-4 text-xs text-[#6B5D62] whitespace-nowrap">
                      {rec.input.category}
                    </td>
                    <td className="py-3 pr-4 text-right font-mono font-semibold text-[#4A102A] tabular-nums">
                      {rec.metrics.readinessScore}
                    </td>
                    <td
                      className={`py-3 pr-4 text-right font-mono tabular-nums ${
                        rec.metrics.roiPct >= 0 ? 'text-[#166534]' : 'text-[#991B1B]'
                      }`}
                    >
                      {rec.metrics.roiPct.toFixed(0)}%
                    </td>
                    <td className="py-3 pr-4">
                      <select
                        aria-label={`Change status for ${rec.input.brandName}`}
                        value={rec.status}
                        disabled={isLoading}
                        onChange={(e) =>
                          onUpdateStatus(rec.id, e.target.value as RecordStatus)
                        }
                        className="px-2.5 py-1 rounded-md border border-[#D8CEC0] bg-white text-xs font-medium text-[#1F171A]"
                      >
                        <option value="Assessed">Assessed</option>
                        <option value="Interested">Interested</option>
                        <option value="Committed">Committed</option>
                        <option value="Paid">Paid</option>
                      </select>
                    </td>
                    <td className="py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onOpenRecordInStudio(rec)}
                        className="text-xs font-medium text-[#4A102A] hover:underline"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Registered Users Panel */}
      <section className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E2D9CE] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#4A102A]" />
            <h2 className="text-lg font-serif text-[#1F171A]">
              Registered Users ({users.length})
            </h2>
          </div>
          <span className="text-xs text-[#6B5D62]">Stored locally in browser session store</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2D9CE] text-[11px] uppercase tracking-wider text-[#6B5D62]">
                <th className="py-2.5 pr-4 font-semibold">Full Name</th>
                <th className="py-2.5 pr-4 font-semibold">Email</th>
                <th className="py-2.5 pr-4 font-semibold">Role</th>
                <th className="py-2.5 font-semibold text-right">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE8DC] text-sm">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="py-2.5 pr-4 font-medium text-[#1F171A]">{u.name}</td>
                  <td className="py-2.5 pr-4 font-mono text-xs text-[#6B5D62]">{u.email}</td>
                  <td className="py-2.5 pr-4 text-xs font-medium text-[#4A102A]">{u.role}</td>
                  <td className="py-2.5 text-right font-mono text-xs text-[#6B5D62]">
                    {formatDateTime(u.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
