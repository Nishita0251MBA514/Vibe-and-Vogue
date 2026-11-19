import React from 'react';
import { History } from 'lucide-react';
import { ActivityLogEntry, User } from '../types/venture';
import { formatDateTime, formatTimeShort } from '../utils/format';

interface ActivityLogPanelProps {
  user: User;
  entries: ActivityLogEntry[];
}

export const ActivityLogPanel: React.FC<ActivityLogPanelProps> = ({ user, entries }) => {
  const visibleEntries =
    user.role === 'Admin'
      ? entries
      : entries.filter((entry) => entry.email.toLowerCase() === user.email.toLowerCase());

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E2D9CE] space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2D9CE] pb-4">
        <div className="flex items-center gap-2.5">
          <History className="w-5 h-5 text-[#4A102A]" />
          <div>
            <h1 className="text-xl sm:text-2xl font-serif text-[#1F171A]">Activity Log</h1>
            <p className="text-xs text-[#6B5D62]">
              {user.role === 'Admin'
                ? 'Audit trail across all designer and founder accounts'
                : `Session and assessment history for ${user.email}`}
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-[#6B5D62] tabular-nums">
          {visibleEntries.length} events
        </span>
      </div>

      {visibleEntries.length === 0 ? (
        <p className="py-10 text-center text-sm text-[#6B5D62]">
          No recorded activity yet for {user.email}.
        </p>
      ) : (
        <ul className="divide-y divide-[#EFE8DC]">
          {visibleEntries.map((entry) => (
            <li
              key={entry.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm"
            >
              <div className="text-[#1F171A]">
                <span className="font-mono text-xs text-[#6B5D62] mr-2">
                  [{formatTimeShort(entry.timestamp)}]
                </span>
                <span className="font-mono text-xs font-semibold text-[#4A102A] mr-1.5">
                  {entry.email}
                </span>
                <span>{entry.message}</span>
              </div>
              <span className="text-xs font-mono text-[#6B5D62] shrink-0">
                {formatDateTime(entry.timestamp)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
