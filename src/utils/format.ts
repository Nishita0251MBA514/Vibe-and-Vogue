import { DesignerRecord } from '../types/venture';

export function formatINR(amount: number, showDecimals = false): string {
  if (!Number.isFinite(amount)) return '₹0';
  const abs = Math.abs(amount);
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(abs);
  return amount < 0 ? `-${formatted}` : formatted;
}

export function formatINRLakhs(amount: number): string {
  if (!Number.isFinite(amount)) return '₹0';
  const abs = Math.abs(amount);
  if (abs >= 10000000) {
    return `${amount < 0 ? '-' : ''}₹${(abs / 10000000).toFixed(2)} Cr`;
  }
  if (abs >= 100000) {
    return `${amount < 0 ? '-' : ''}₹${(abs / 100000).toFixed(2)} L`;
  }
  return formatINR(amount);
}

export function formatNumberIN(value: number): string {
  if (!Number.isFinite(value)) return '0';
  return new Intl.NumberFormat('en-IN').format(Math.round(value));
}

export function formatTimeShort(isoString: string): string {
  try {
    return new Date(isoString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function formatDateTime(isoString: string): string {
  try {
    return new Date(isoString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'VV';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function exportRecordsToCSV(records: DesignerRecord[], filename: string): void {
  const headers = [
    'Record ID',
    'Brand Name',
    'Designer Name',
    'Email',
    'City',
    'Category',
    'Preferred Month',
    'Stall Size',
    'Avg Selling Price (INR)',
    'Expected Pieces',
    'Gross Margin (%)',
    'Stall Fee (INR)',
    'Projected Revenue (INR)',
    'Gross Profit (INR)',
    'Net Profit (INR)',
    'ROI (%)',
    'Break-Even Pieces',
    'Online CAC (INR)',
    'Pop-Up CAC (INR)',
    'Readiness Score',
    'Recommendation',
    'Status',
    'Created At',
    'Updated At',
  ];

  const escapeCell = (val: string | number) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = records.map((r) => [
    r.id,
    r.input.brandName,
    r.designerName,
    r.email,
    r.input.city,
    r.input.category,
    r.input.preferredMonth,
    r.input.preferredStallSize,
    r.input.avgSellingPrice,
    r.input.expectedPiecesSold,
    r.input.grossMarginPct,
    r.metrics.stallFee,
    Math.round(r.metrics.projectedRevenue),
    Math.round(r.metrics.grossProfit),
    Math.round(r.metrics.netProfit),
    r.metrics.roiPct.toFixed(1),
    r.metrics.breakEvenPieces,
    Math.round(r.metrics.onlineCAC),
    Math.round(r.metrics.popupCAC),
    r.metrics.readinessScore,
    r.metrics.recommendation,
    r.status,
    r.createdAt,
    r.updatedAt,
  ]);

  const csvContent =
    [headers.map(escapeCell).join(','), ...rows.map((row) => row.map(escapeCell).join(','))].join(
      '\n'
    );

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
