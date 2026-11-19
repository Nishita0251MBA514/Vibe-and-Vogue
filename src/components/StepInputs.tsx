import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Calculator, Lock } from 'lucide-react';
import {
  DesignerCategory,
  DesignerInput,
  DesignerNeed,
  StallSize,
  User,
} from '../types/venture';
import { formatINR } from '../utils/format';

const CATEGORIES: DesignerCategory[] = [
  'Bridal lehenga',
  'Festive wear',
  'Fine jewelry',
  'Menswear',
  'Accessories',
  'Other',
];

const MONTHS = [
  'August',
  'September',
  'October',
  'November',
  'December',
  'January',
  'February',
];

const STALL_SIZES: StallSize[] = ['Small', 'Medium', 'Large'];

const NEEDS: DesignerNeed[] = [
  'Live styling',
  'Fit-testing zone',
  'Designer networking',
  'Photography',
];

interface StepInputsProps {
  user: User;
  input: DesignerInput;
  stallFee: number;
  isLoading: boolean;
  onChangeInput: (next: DesignerInput) => void;
  onUpdateStallFee: (fee: number) => void;
  onBack: () => void;
  onRunAssessment: () => void;
}

export const StepInputs: React.FC<StepInputsProps> = ({
  user,
  input,
  stallFee,
  isLoading,
  onChangeInput,
  onUpdateStallFee,
  onBack,
  onRunAssessment,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [feeInput, setFeeInput] = useState(String(stallFee));

  const updateField = <K extends keyof DesignerInput>(key: K, value: DesignerInput[K]) => {
    onChangeInput({ ...input, [key]: value });
    if (errors[key]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  const toggleNeed = (need: DesignerNeed) => {
    const exists = input.needs.includes(need);
    const nextNeeds = exists
      ? input.needs.filter((item) => item !== need)
      : [...input.needs, need];
    updateField('needs', nextNeeds);
  };

  const handleFeeBlur = () => {
    if (user.role !== 'Admin') return;
    const numeric = Number(feeInput);
    if (Number.isFinite(numeric) && numeric >= 10000 && numeric <= 500000) {
      onUpdateStallFee(Math.round(numeric));
    } else {
      setFeeInput(String(stallFee));
    }
  };

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!input.brandName.trim()) {
      nextErrors.brandName = 'Please enter your label or boutique name.';
    }
    if (!input.city.trim()) {
      nextErrors.city = 'Please specify your studio city.';
    }
    if (!Number.isFinite(input.avgSellingPrice) || input.avgSellingPrice < 1000) {
      nextErrors.avgSellingPrice = 'Enter an average selling price of at least ₹1,000.';
    }
    if (!Number.isFinite(input.expectedPiecesSold) || input.expectedPiecesSold < 1) {
      nextErrors.expectedPiecesSold = 'Expected pieces sold must be at least 1.';
    }
    if (!Number.isFinite(input.monthlyAdSpend) || input.monthlyAdSpend < 0) {
      nextErrors.monthlyAdSpend = 'Monthly digital ad spend cannot be negative.';
    }
    if (!Number.isFinite(input.onlineCustomersPerMonth) || input.onlineCustomersPerMonth < 1) {
      nextErrors.onlineCustomersPerMonth = 'Enter at least 1 online customer per month.';
    }
    if (!Number.isFinite(input.expectedWalkInLeads) || input.expectedWalkInLeads < 5) {
      nextErrors.expectedWalkInLeads = 'Expected walk-in leads should be at least 5.';
    }
    if (
      !Number.isFinite(input.expectedConversionRate) ||
      input.expectedConversionRate <= 0 ||
      input.expectedConversionRate > 100
    ) {
      nextErrors.expectedConversionRate = 'Conversion rate must be between 0.1% and 100%.';
    }
    if (
      !Number.isFinite(input.grossMarginPct) ||
      input.grossMarginPct < 5 ||
      input.grossMarginPct > 95
    ) {
      nextErrors.grossMarginPct = 'Gross margin must be between 5% and 95%.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onRunAssessment();
  };

  const inputClass = (field: string) =>
    `w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-[#1F171A] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#4A102A]/15 ${
      errors[field]
        ? 'border-[#B91C1C] focus:border-[#B91C1C]'
        : 'border-[#D8CEC0] focus:border-[#4A102A]'
    }`;

  return (
    <form onSubmit={validateAndSubmit} className="space-y-6" noValidate>
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E2D9CE] space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E2D9CE] pb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#4A102A] font-semibold">
              Step 02 · Economics &amp; Exhibition Fit
            </p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-serif text-[#1F171A]">
              Designer Commercial Inputs
            </h2>
            <p className="mt-1 text-sm text-[#6B5D62]">
              Assessment tied to <span className="font-mono text-[#1F171A]">{user.email}</span>
            </p>
          </div>

          {/* Stall Fee Panel */}
          <div className="px-4 py-3 rounded-xl bg-[#F3EDE3] border border-[#E2D9CE] min-w-[230px]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-[#6B5D62]">Turnkey Stall Fee</span>
              {user.role !== 'Admin' && (
                <span className="inline-flex items-center gap-1 text-[11px] text-[#6B5D62]">
                  <Lock className="w-3 h-3" /> Fixed
                </span>
              )}
            </div>
            {user.role === 'Admin' ? (
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm font-semibold text-[#4A102A]">₹</span>
                <input
                  type="number"
                  min={10000}
                  max={500000}
                  step={1000}
                  value={feeInput}
                  onChange={(e) => setFeeInput(e.target.value)}
                  onBlur={handleFeeBlur}
                  aria-label="Admin editable stall booking fee"
                  className="w-28 px-2 py-1 text-sm font-mono font-semibold bg-white border border-[#D8CEC0] rounded text-[#4A102A] tabular-nums"
                />
                <button
                  type="button"
                  onClick={handleFeeBlur}
                  className="text-xs font-medium text-[#4A102A] underline hover:no-underline"
                >
                  Apply
                </button>
              </div>
            ) : (
              <p className="mt-0.5 text-lg font-serif font-semibold text-[#4A102A] tabular-nums">
                {formatINR(stallFee)}
              </p>
            )}
          </div>
        </div>

        {/* Section 1: Label Identity */}
        <div className="space-y-4">
          <h3 className="text-base font-serif font-medium text-[#1F171A]">
            01. Brand Profile &amp; Category
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label htmlFor="brandName" className="block text-sm font-medium text-[#1F171A] mb-1.5">
                Brand / Boutique Name
              </label>
              <input
                id="brandName"
                type="text"
                value={input.brandName}
                onChange={(e) => updateField('brandName', e.target.value)}
                placeholder="e.g., Meher & Gulab Atelier"
                className={inputClass('brandName')}
              />
              {errors.brandName && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.brandName}</p>
              )}
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-[#1F171A] mb-1.5">
                Studio City
              </label>
              <input
                id="city"
                type="text"
                value={input.city}
                onChange={(e) => updateField('city', e.target.value)}
                placeholder="e.g., New Delhi"
                className={inputClass('city')}
              />
              {errors.city && <p className="mt-1 text-xs text-[#B91C1C]">{errors.city}</p>}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-[#1F171A] mb-1.5">
                Primary Category
              </label>
              <select
                id="category"
                value={input.category}
                onChange={(e) => updateField('category', e.target.value as DesignerCategory)}
                className={inputClass('category')}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Unit Economics & Digital Acquisition */}
        <div className="space-y-4 pt-2 border-t border-[#E2D9CE]">
          <h3 className="text-base font-serif font-medium text-[#1F171A]">
            02. Pricing, Margins &amp; Acquisition Baseline
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label htmlFor="avgSellingPrice" className="block text-sm font-medium text-[#1F171A] mb-1.5">
                Avg Selling Price / Piece (₹)
              </label>
              <input
                id="avgSellingPrice"
                type="number"
                min={1000}
                step={500}
                value={input.avgSellingPrice}
                onChange={(e) => updateField('avgSellingPrice', Number(e.target.value))}
                className={inputClass('avgSellingPrice')}
              />
              {errors.avgSellingPrice && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.avgSellingPrice}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="expectedPiecesSold"
                className="block text-sm font-medium text-[#1F171A] mb-1.5"
              >
                Expected Pieces Sold
              </label>
              <input
                id="expectedPiecesSold"
                type="number"
                min={1}
                step={1}
                value={input.expectedPiecesSold}
                onChange={(e) => updateField('expectedPiecesSold', Number(e.target.value))}
                className={inputClass('expectedPiecesSold')}
              />
              {errors.expectedPiecesSold && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.expectedPiecesSold}</p>
              )}
            </div>

            <div>
              <label htmlFor="grossMarginPct" className="block text-sm font-medium text-[#1F171A] mb-1.5">
                Gross Margin (%)
              </label>
              <input
                id="grossMarginPct"
                type="number"
                min={5}
                max={95}
                step={1}
                value={input.grossMarginPct}
                onChange={(e) => updateField('grossMarginPct', Number(e.target.value))}
                className={inputClass('grossMarginPct')}
              />
              {errors.grossMarginPct && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.grossMarginPct}</p>
              )}
            </div>

            <div>
              <label htmlFor="monthlyAdSpend" className="block text-sm font-medium text-[#1F171A] mb-1.5">
                Monthly Digital Ad Spend (₹)
              </label>
              <input
                id="monthlyAdSpend"
                type="number"
                min={0}
                step={1000}
                value={input.monthlyAdSpend}
                onChange={(e) => updateField('monthlyAdSpend', Number(e.target.value))}
                className={inputClass('monthlyAdSpend')}
              />
              {errors.monthlyAdSpend && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.monthlyAdSpend}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="onlineCustomersPerMonth"
                className="block text-sm font-medium text-[#1F171A] mb-1.5"
              >
                Online Customers / Month
              </label>
              <input
                id="onlineCustomersPerMonth"
                type="number"
                min={1}
                step={1}
                value={input.onlineCustomersPerMonth}
                onChange={(e) => updateField('onlineCustomersPerMonth', Number(e.target.value))}
                className={inputClass('onlineCustomersPerMonth')}
              />
              {errors.onlineCustomersPerMonth && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.onlineCustomersPerMonth}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="expectedWalkInLeads"
                className="block text-sm font-medium text-[#1F171A] mb-1.5"
              >
                Expected Walk-In Leads
              </label>
              <input
                id="expectedWalkInLeads"
                type="number"
                min={5}
                step={5}
                value={input.expectedWalkInLeads}
                onChange={(e) => updateField('expectedWalkInLeads', Number(e.target.value))}
                className={inputClass('expectedWalkInLeads')}
              />
              {errors.expectedWalkInLeads && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.expectedWalkInLeads}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="expectedConversionRate"
                className="block text-sm font-medium text-[#1F171A] mb-1.5"
              >
                Expected Conversion (%)
              </label>
              <input
                id="expectedConversionRate"
                type="number"
                min={0.5}
                max={100}
                step={0.5}
                value={input.expectedConversionRate}
                onChange={(e) => updateField('expectedConversionRate', Number(e.target.value))}
                className={inputClass('expectedConversionRate')}
              />
              {errors.expectedConversionRate && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.expectedConversionRate}</p>
              )}
            </div>

            <div className="flex flex-col justify-end pb-1">
              <p className="text-xs text-[#6B5D62]">Walk-in implied orders</p>
              <p className="text-base font-mono font-semibold text-[#4A102A] tabular-nums">
                {Math.round(
                  (Math.max(0, input.expectedWalkInLeads) *
                    Math.max(0, input.expectedConversionRate)) /
                    100
                )}{' '}
                pieces
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Exhibition Preferences */}
        <div className="space-y-4 pt-2 border-t border-[#E2D9CE]">
          <h3 className="text-base font-serif font-medium text-[#1F171A]">
            03. Exhibition Preferences &amp; Turnkey Support
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="preferredMonth"
                className="block text-sm font-medium text-[#1F171A] mb-1.5"
              >
                Preferred Wedding / Festive Month
              </label>
              <select
                id="preferredMonth"
                value={input.preferredMonth}
                onChange={(e) => updateField('preferredMonth', e.target.value)}
                className={inputClass('preferredMonth')}
              >
                {MONTHS.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="block text-sm font-medium text-[#1F171A] mb-1.5">
                Preferred Stall Footprint
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {STALL_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => updateField('preferredStallSize', size)}
                    className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-colors ${
                      input.preferredStallSize === size
                        ? 'bg-[#4A102A] text-white border-[#4A102A]'
                        : 'bg-white text-[#1F171A] border-[#D8CEC0] hover:border-[#4A102A]/50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <span className="block text-sm font-medium text-[#1F171A] mb-2">
              On-Site Experience Needs
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {NEEDS.map((need) => {
                const checked = input.needs.includes(need);
                return (
                  <label
                    key={need}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border cursor-pointer text-sm transition-colors ${
                      checked
                        ? 'bg-[#F3EDE3] border-[#4A102A] text-[#4A102A] font-medium'
                        : 'bg-white border-[#D8CEC0] text-[#1F171A] hover:border-[#4A102A]/40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleNeed(need)}
                      className="accent-[#4A102A] w-4 h-4"
                    />
                    <span>{need}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-[#D8CEC0] bg-white hover:bg-[#F3EDE3] text-sm font-medium text-[#1F171A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Framing</span>
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#4A102A] hover:bg-[#380A1F] disabled:opacity-60 text-white text-sm font-medium transition-colors"
        >
          <Calculator className="w-4 h-4" />
          <span>{isLoading ? 'Computing Projections...' : 'Calculate ROI & Readiness Score'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
