import React from 'react';
import { Download, FileSpreadsheet, Plus, ArrowUpRight } from 'lucide-react';
import { DesignerRecord, User } from '../types/venture';
import { formatDateTime, formatINR } from '../utils/format';

interface RecordsViewProps {
  user: User;
  records: DesignerRecord[];
  isLoading: boolean;
  onLoadRecord: (record: DesignerRecord) => void;
  onDownloadPDF: (record: DesignerRecord) => Promise<void>;
  onExportCSV: () => Promise<void>;
  onStartNew: () => void;
}

export const RecordsView: React.FC<RecordsViewProps> = ({
  user,
  records,
  isLoading,
  onLoadRecord,
  onDownloadPDF,
  onExportCSV,
  onStartNew,
}) => {
  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E2D9CE] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2D9CE] pb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#4A102A] font-semibold">
            {user.role === 'Admin' ? 'All Saved Assessments' : 'Your Saved Assessments'}
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-serif text-[#1F171A]">
            {user.role === 'Admin' ? 'Exhibition Records Ledger' : 'My Assessment Records'}
          </h1>
          <p className="mt-1 text-xs text-[#6B5D62]">
            Signed in as <span className="font-mono text-[#1F171A]">{user.email}</span> · Showing{' '}
            {records.length} {records.length === 1 ? 'record' : 'records'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {records.length > 0 && (
            <button
              type="button"
              disabled={isLoading}
              onClick={onExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#D8CEC0] bg-white hover:bg-[#F3EDE3] text-xs font-medium text-[#1F171A] transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#4A102A]" />
              <span>Export CSV</span>
            </button>
          )}
          <button
            type="button"
            onClick={onStartNew}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4A102A] hover:bg-[#380A1F] text-white text-xs font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Assessment</span>
          </button>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="py-14 text-center space-y-4">
          <p className="text-lg font-serif text-[#1F171A]">No stall assessments saved yet</p>
          <p className="text-sm text-[#6B5D62] max-w-md mx-auto">
            Run an exhibition ROI evaluation in the Studio to see your projected revenue, break-even volume, and readiness score recorded here under {user.email}.
          </p>
          <button
            type="button"
            onClick={onStartNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#4A102A] hover:bg-[#380A1F] text-white text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Run First Assessment</span>
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2D9CE] text-[11px] uppercase tracking-wider text-[#6B5D62]">
                <th className="py-3 pr-4 font-semibold">Brand</th>
                <th className="py-3 pr-4 font-semibold">Account Email</th>
                <th className="py-3 pr-4 font-semibold">Category</th>
                <th className="py-3 pr-4 font-semibold text-right">Net Profit</th>
                <th className="py-3 pr-4 font-semibold text-right">Score</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
                <th className="py-3 pr-4 font-semibold">Updated</th>
                <th className="py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE8DC] text-sm">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#FAF7F2]/70 transition-colors">
                  <td className="py-3.5 pr-4 font-medium text-[#1F171A] whitespace-nowrap">
                    {rec.input.brandName}
                  </td>
                  <td className="py-3.5 pr-4 font-mono text-xs text-[#6B5D62] whitespace-nowrap">
                    {rec.email}
                  </td>
                  <td className="py-3.5 pr-4 text-xs text-[#6B5D62] whitespace-nowrap">
                    {rec.input.category}
                  </td>
                  <td
                    className={`py-3.5 pr-4 text-right font-mono tabular-nums whitespace-nowrap ${
                      rec.metrics.netProfit >= 0 ? 'text-[#166534]' : 'text-[#991B1B]'
                    }`}
                  >
                    {formatINR(rec.metrics.netProfit)}
                  </td>
                  <td className="py-3.5 pr-4 text-right font-mono font-semibold text-[#4A102A] tabular-nums">
                    {rec.metrics.readinessScore}/100
                  </td>
                  <td className="py-3.5 pr-4 text-xs font-medium text-[#4A102A] whitespace-nowrap">
                    {rec.status}
                  </td>
                  <td className="py-3.5 pr-4 font-mono text-xs text-[#6B5D62] whitespace-nowrap">
                    {formatDateTime(rec.updatedAt)}
                  </td>
                  <td className="py-3.5 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => onLoadRecord(rec)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#4A102A] hover:underline"
                      >
                        <span>Open</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => onDownloadPDF(rec)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#1F171A] hover:text-[#4A102A]"
                        title="Download PDF Report"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
