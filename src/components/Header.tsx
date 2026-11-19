import React, { useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import { User } from '../types/venture';
import { getInitials } from '../utils/format';

export type AppView = 'studio' | 'records' | 'admin' | 'profile' | 'activity';

interface HeaderProps {
  user: User;
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeView,
  onNavigate,
  onLogout,
  isLoading,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: AppView; label: string }[] = [
    { id: 'studio', label: 'Studio' },
    { id: 'records', label: user.role === 'Admin' ? 'All Records' : 'My Records' },
    ...(user.role === 'Admin' ? [{ id: 'admin' as AppView, label: 'Validation' }] : []),
    { id: 'activity', label: 'Activity Log' },
    { id: 'profile', label: 'My Profile' },
  ];

  const handleNav = (id: AppView) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-sm border-b border-[#E2D9CE] no-print">
      {/* Persistent Loading Bar */}
      <div className="h-0.5 w-full bg-transparent overflow-hidden">
        {isLoading && (
          <div className="h-full w-full bg-gradient-to-r from-[#4A102A] via-[#C59B48] to-[#4A102A] animate-pulse" />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNav('studio')}
          className="text-xl font-serif font-semibold tracking-tight text-[#4A102A] whitespace-nowrap shrink-0 text-left"
        >
          Vibe &amp; Vogue
        </button>

        {/* Zone 2: Concise single-line nav links */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Primary Navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id)}
              className={`text-sm font-medium whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors ${
                activeView === item.id
                  ? 'text-[#4A102A] border-[#C59B48]'
                  : 'text-[#6B5D62] border-transparent hover:text-[#1F171A]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Persistent Profile Chip (Name, Email, Role) + Logout */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('profile')}
            className="hidden sm:flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg bg-[#F3EDE3] border border-[#E2D9CE] hover:border-[#C59B48] transition-colors text-left"
            title="View My Profile"
          >
            <span className="w-7 h-7 rounded-md bg-[#4A102A] text-[#FAF7F2] text-xs font-semibold flex items-center justify-center shrink-0">
              {getInitials(user.name)}
            </span>
            <span className="leading-tight min-w-0">
              <span className="block text-xs font-semibold text-[#1F171A] truncate max-w-[160px]">
                {user.name} · {user.role}
              </span>
              <span className="block text-[11px] font-mono text-[#6B5D62] truncate max-w-[200px]">
                {user.email}
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#4A102A] hover:bg-[#380A1F] text-[#FAF7F2] text-xs font-medium whitespace-nowrap shrink-0 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-lg border border-[#E2D9CE] text-[#1F171A] hover:bg-[#F3EDE3]"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Compact Mobile Identity Strip + Navigation Drawer */}
      <div className="sm:hidden px-4 py-1.5 bg-[#F3EDE3] border-t border-[#E2D9CE] flex items-center justify-between text-xs">
        <span className="font-medium text-[#1F171A] truncate">
          {user.name} · {user.role}
        </span>
        <span className="font-mono text-[#6B5D62] truncate ml-2">{user.email}</span>
      </div>

      {mobileMenuOpen && (
        <nav className="lg:hidden border-t border-[#E2D9CE] bg-[#FAF7F2] px-4 py-3 flex flex-wrap gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeView === item.id
                  ? 'bg-[#4A102A] text-white'
                  : 'bg-[#F3EDE3] text-[#1F171A] hover:bg-[#E8DFD1]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
};
