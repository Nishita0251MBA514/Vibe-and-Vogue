import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  BookmarkCheck,
} from 'lucide-react';
import { DesignerRecord, RecordStatus, User } from '../types/venture';
import { formatDateTime, formatINR } from '../utils/format';

interface StepReserveExportProps {
  user: User;
  record: DesignerRecord;
  isLoading: boolean;
  onUpdateStatus: (recordId: string, nextStatus: RecordStatus) => Promise<void>;
  onDownloadPDF: (record: DesignerRecord) => Promise<void>;
  onDownloadCSV: () => Promise<void>;
  onBackToResults: () => void;
  onViewRecords: () => void;
}

const RESERVE_OPTIONS: {
  status: RecordStatus;
  title: string;
  description: string;
}[] = [
  {
    status: 'Interested',
    title: 'Interested',
    description: 'Request exhibition lookbook & Delhi NCR venue dates without a fee pledge.',
  },
  {
    status: 'Committed',
    title: 'Committed',
    description: 'Pledge to pay the ₹85,000 turnkey stall fee upon final curation confirmation.',
  },
  {
    status: 'Paid',
    title: 'Paid (Mock)',
    description: 'Simulate completed upfront booking settlement for validation tracking.',
  },
];

export const StepReserveExport: React.FC<StepReserveExportProps> = ({
  user,
  record,
  isLoading,
  onUpdateStatus,
  onDownloadPDF,
  onDownloadCSV,
  onBackToResults,
  onViewRecords,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<RecordStatus>(
    record.status === 'Assessed' ? 'Committed' : record.status
  );
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    record.status !== 'Assessed'
      ? `Confirmation recorded for ${record.email} — Status: ${record.status}`
      : null
  );

  const handleReserve = async () => {
    await onUpdateStatus(record.id, selectedStatus);
    setConfirmationMessage(
      `Confirmation recorded for ${user.email} — Status: ${selectedStatus} (${record.input.brandName})`
    );
  };

  return (
    <div className="space-y-6">
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E2D9CE] space-y-7">
        <div className="border-b border-[#E2D9CE] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#4A102A] font-semibold">
              Step 04 · Reserve Interest &amp; Export
            </p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-serif text-[#1F171A]">
              Confirm Stall Interest &amp; Download Dossier
            </h2>
            <p className="mt-1 text-sm text-[#6B5D62]">
              Saved record for <span className="font-semibold text-[#1F171A]">{record.input.brandName}</span> ·{' '}
              <span className="font-mono text-[#1F171A]">{record.email}</span> · Current status:{' '}
              <span className="font-semibold text-[#4A102A]">{record.status}</span>
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-[#6B5D62]">Last Updated</p>
            <p className="text-xs font-mono text-[#1F171A]">{formatDateTime(record.updatedAt)}</p>
          </div>
        </div>

        {/* Reserve Interest Status Selector */}
        <div className="space-y-4">
          <h3 className="text-base font-serif font-medium text-[#1F171A]">
            01. Select Stall Reservation Intent ({formatINR(record.metrics.stallFee)} Fee)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {RESERVE_OPTIONS.map((option) => {
              const active = selectedStatus === option.status;
              return (
                <button
                  key={option.status}
                  type="button"
                  onClick={() => setSelectedStatus(option.status)}
                  className={`p-4 rounded-xl border text-left transition-colors flex flex-col justify-between gap-2 ${
                    active
                      ? 'bg-[#4A102A] text-white border-[#4A102A]'
                      : 'bg-[#FAF7F2] text-[#1F171A] border-[#E2D9CE] hover:border-[#4A102A]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-serif font-medium">{option.title}</span>
                    {active && <CheckCircle2 className="w-4 h-4 text-[#E8D9B8]" />}
                  </div>
                  <p
                    className={`text-xs leading-relaxed ${
                      active ? 'text-[#F3EDE3]/90' : 'text-[#6B5D62]'
                    }`}
                  >
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleReserve}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#4A102A] hover:bg-[#380A1F] disabled:opacity-60 text-white text-sm font-medium transition-colors"
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>
                {isLoading ? 'Saving Confirmation...' : `Reserve Interest (${selectedStatus})`}
              </span>
            </button>

            <button
              type="button"
              onClick={onViewRecords}
              className="text-sm font-medium text-[#4A102A] underline hover:no-underline"
            >
              View Saved Records
            </button>
          </div>

          {confirmationMessage && (
            <div
              role="status"
              className="p-4 rounded-xl bg-[#ECFDF5] border border-[#16A34A]/30 text-sm text-[#166534] flex items-center gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{confirmationMessage}</span>
            </div>
          )}
        </div>

        {/* Downloads */}
        <div className="pt-6 border-t border-[#E2D9CE] space-y-4">
          <h3 className="text-base font-serif font-medium text-[#1F171A]">
            02. Export Reports &amp; Audit Trail
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-[#FAF7F2] border border-[#E2D9CE] flex flex-col justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#1F171A]">
                  Designer Exhibition Viability PDF
                </p>
                <p className="mt-1 text-xs text-[#6B5D62] leading-relaxed">
                  Includes your account email ({record.email}), full financial ROI projections, CAC comparison, readiness score breakdown, and recommendation.
                </p>
              </div>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => onDownloadPDF(record)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-[#F3EDE3] border border-[#D8CEC0] text-sm font-medium text-[#1F171A] transition-colors"
              >
                <Download className="w-4 h-4 text-[#4A102A]" />
                <span>Download PDF Report</span>
              </button>
            </div>

            <div className="p-5 rounded-xl bg-[#FAF7F2] border border-[#E2D9CE] flex flex-col justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#1F171A]">
                  Assessment Records Spreadsheet (CSV)
                </p>
                <p className="mt-1 text-xs text-[#6B5D62] leading-relaxed">
                  Exports saved assessments with designer email column, category, readiness score, ROI %, and booking status flags.
                </p>
              </div>
              <button
                type="button"
                disabled={isLoading}
                onClick={onDownloadCSV}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-[#F3EDE3] border border-[#D8CEC0] text-sm font-medium text-[#1F171A] transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#4A102A]" />
                <span>Export CSV Records</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToResults}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#D8CEC0] bg-white hover:bg-[#F3EDE3] text-sm font-medium text-[#1F171A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Results</span>
        </button>
      </div>
    </div>
  );
};
