import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { User } from '../types/venture';
import { formatINR } from '../utils/format';

interface StepOnboardingProps {
  user: User;
  stallFee: number;
  onStartAssessment: () => void;
}

export const StepOnboarding: React.FC<StepOnboardingProps> = ({
  user,
  stallFee,
  onStartAssessment,
}) => {
  const [bannerError, setBannerError] = useState(false);

  const designerPainPoints = [
    {
      title: 'Escalating Digital Ad CAC',
      detail:
        'Performance marketing for ₹40,000+ bridal and festive couture suffers from rising CPMs, low click-to-consult trust, and steep customer acquisition costs.',
    },
    {
      title: 'Prohibitive Flagship Leases',
      detail:
        'Securing a permanent boutique in Mehrauli, South Extension, or DLF Emporio locks up lakhs in deposits, fit-outs, and year-round fixed payroll.',
    },
    {
      title: 'Limited Access to HNWI Brides',
      detail:
        'Independent labels struggle to get in front of verified Delhi NCR brides-to-be and wedding guests actively shopping 1–2 months before peak ceremonies.',
    },
  ];

  const shopperPainPoints = [
    {
      title: 'Niche Discovery Friction',
      detail:
        'Discerning shoppers aged 25–38 cannot easily discover exclusive, non-mainstream designers amid cluttered mass-market wedding portals.',
    },
    {
      title: 'Zero Tactile Confidence Online',
      detail:
        'Luxury buyers hesitate to spend ₹50,000–₹1,50,000+ online when they cannot feel silk weight, inspect zardozi craft, or verify drape and fit.',
    },
    {
      title: 'Depersonalized Buying Journeys',
      detail:
        'Generic e-commerce lacks tailored bridal styling, direct alterations dialogue, and curated trousseaus coordinated with the designer.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Editorial Hero Split */}
      <section className="rounded-2xl bg-white border border-[#E2D9CE] overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <p className="text-xs font-medium text-[#6B5D62]">
              Welcome, <span className="text-[#4A102A] font-semibold">{user.name}</span> ·{' '}
              <span className="font-mono">{user.email}</span> · {user.role}
            </p>
            <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#1F171A] leading-[1.15] [text-wrap:balance]">
              Touch. Try. Trust. Reach verified affluent buyers without a flagship lease.
            </h1>
            <p className="text-sm sm:text-base text-[#6B5D62] leading-relaxed max-w-2xl">
              Vibe &amp; Vogue hosts curated 5-star bridal and festive exhibitions across Delhi NCR. Evaluate your stall economics in under two minutes before pledging the{' '}
              <span className="font-semibold text-[#1F171A] tabular-nums">{formatINR(stallFee)}</span>{' '}
              turnkey stall booking fee.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={onStartAssessment}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#4A102A] hover:bg-[#380A1F] text-white text-sm font-medium transition-colors"
            >
              <span>Evaluate Your Stall ROI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-xs text-[#6B5D62]">
              Turnkey 5-Star Infrastructure · Pre-vetted Delhi NCR Brides (25–38)
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 relative min-h-[240px] bg-[#32081B]">
          {!bannerError ? (
            <img
              src="/src/assets/images/exhibition_venue_banner_1795115855337.jpg"
              alt="Turnkey 5-star luxury exhibition pavilion in Delhi NCR"
              referrerPolicy="no-referrer"
              onError={() => setBannerError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-8 bg-gradient-to-br from-[#4A102A] to-[#260614] text-[#E8D9B8]">
              <div className="text-center space-y-2">
                <Sparkles className="w-7 h-7 mx-auto" />
                <p className="font-serif text-lg">5-Star Turnkey Pavilion</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Dual Problem Framing */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E2D9CE] space-y-5">
          <div className="border-b border-[#E2D9CE] pb-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[#4A102A] font-semibold">
              Designer Challenges Solved
            </p>
            <h2 className="mt-1 text-xl font-serif text-[#1F171A]">
              Why Indie Couture Labels Outgrow Online-Only Ads
            </h2>
          </div>
          <div className="space-y-5">
            {designerPainPoints.map((item, idx) => (
              <div key={item.title} className="flex gap-4">
                <span className="text-sm font-serif font-semibold text-[#C59B48] tabular-nums shrink-0 mt-0.5">
                  0{idx + 1}.
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-[#1F171A]">{item.title}</h3>
                  <p className="mt-1 text-sm text-[#6B5D62] leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E2D9CE] space-y-5">
          <div className="border-b border-[#E2D9CE] pb-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[#4A102A] font-semibold">
              Shopper Friction Solved
            </p>
            <h2 className="mt-1 text-xl font-serif text-[#1F171A]">
              Why Delhi NCR Brides Prefer Tactile Curation
            </h2>
          </div>
          <div className="space-y-5">
            {shopperPainPoints.map((item, idx) => (
              <div key={item.title} className="flex gap-4">
                <span className="text-sm font-serif font-semibold text-[#C59B48] tabular-nums shrink-0 mt-0.5">
                  0{idx + 1}.
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-[#1F171A]">{item.title}</h3>
                  <p className="mt-1 text-sm text-[#6B5D62] leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MVP Turnkey Infrastructure Strip */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[#F3EDE3] border border-[#E2D9CE] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.18em] text-[#4A102A] font-semibold">
            MVP Turnkey Format · {formatINR(stallFee)} All-Inclusive
          </p>
          <p className="text-base font-serif text-[#1F171A]">
            5-star hotel ballroom venue, bespoke brass display racks, trial &amp; fit zones, curated bride concierge, and zero long-term lease lock-in.
          </p>
        </div>
        <button
          type="button"
          onClick={onStartAssessment}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#4A102A] hover:bg-[#380A1F] text-white text-sm font-medium whitespace-nowrap shrink-0 transition-colors"
        >
          <span>Proceed to Inputs</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
