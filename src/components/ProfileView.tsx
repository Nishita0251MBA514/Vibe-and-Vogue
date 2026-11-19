import React from 'react';
import { LogOut, Mail, ShieldCheck, User as UserIcon } from 'lucide-react';
import { DesignerRecord, User } from '../types/venture';
import { formatDateTime, getInitials } from '../utils/format';

interface ProfileViewProps {
  user: User;
  userRecords: DesignerRecord[];
  onLogout: () => void;
  onGoToStudio: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  userRecords,
  onLogout,
  onGoToStudio,
}) => {
  const latestRecord = userRecords[0];

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-2xl bg-white border border-[#E2D9CE] space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2D9CE] pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-[#4A102A] text-[#FAF7F2] font-serif text-2xl flex items-center justify-center shrink-0">
            {getInitials(user.name)}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#4A102A] font-semibold">
              My Profile
            </p>
            <h1 className="text-2xl font-serif text-[#1F171A]">{user.name}</h1>
            <p className="text-sm font-mono text-[#6B5D62]">{user.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#4A102A] hover:bg-[#380A1F] text-white text-sm font-medium transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E2D9CE]">
          <dt className="flex items-center gap-2 text-xs text-[#6B5D62]">
            <UserIcon className="w-3.5 h-3.5 text-[#4A102A]" />
            <span>Full Name</span>
          </dt>
          <dd className="mt-1 text-base font-medium text-[#1F171A]">{user.name}</dd>
        </div>

        <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E2D9CE]">
          <dt className="flex items-center gap-2 text-xs text-[#6B5D62]">
            <Mail className="w-3.5 h-3.5 text-[#4A102A]" />
            <span>Registered Email</span>
          </dt>
          <dd className="mt-1 text-sm font-mono font-medium text-[#1F171A] break-all">
            {user.email}
          </dd>
        </div>

        <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E2D9CE]">
          <dt className="flex items-center gap-2 text-xs text-[#6B5D62]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#4A102A]" />
            <span>Workspace Role</span>
          </dt>
          <dd className="mt-1 text-base font-medium text-[#4A102A]">{user.role}</dd>
        </div>

        <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E2D9CE]">
          <dt className="text-xs text-[#6B5D62]">Account Created</dt>
          <dd className="mt-1 text-sm font-mono text-[#1F171A]">
            {formatDateTime(user.createdAt)}
          </dd>
        </div>
      </dl>

      <div className="p-5 rounded-xl bg-[#F3EDE3] border border-[#E2D9CE] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#1F171A]">
            Assessments Linked to {user.email}: {userRecords.length}
          </p>
          <p className="text-xs text-[#6B5D62] mt-0.5">
            {latestRecord
              ? `Latest: ${latestRecord.input.brandName} · Score ${latestRecord.metrics.readinessScore}/100 · Status: ${latestRecord.status}`
              : 'No assessments recorded under this email yet.'}
          </p>
        </div>
        <button
          type="button"
          onClick={onGoToStudio}
          className="px-4 py-2 rounded-lg bg-white hover:bg-[#FAF7F2] border border-[#D8CEC0] text-xs font-medium text-[#4A102A] whitespace-nowrap"
        >
          Open Stall Studio
        </button>
      </div>
    </div>
  );
};
