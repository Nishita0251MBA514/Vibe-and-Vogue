import { jsPDF } from 'jspdf';
import { DesignerRecord } from '../types/venture';
import { formatDateTime } from './format';

function pdfINR(amount: number): string {
  const abs = Math.abs(Math.round(amount));
  const formatted = new Intl.NumberFormat('en-IN').format(abs);
  return `${amount < 0 ? '-' : ''}INR ${formatted}`;
}

export function downloadDesignerPDF(record: DesignerRecord): void {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 44;
  let y = 50;

  // Header band
  doc.setFillColor(74, 16, 42); // Deep Plum #4A102A
  doc.rect(0, 0, pageWidth, 92, 'F');

  doc.setTextColor(232, 217, 184); // Soft Champagne
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('VIBE & VOGUE : DESIGNER STALL STUDIO', margin, 34);

  doc.setTextColor(255, 255, 255);
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.text('Delhi NCR Exhibition Viability Report', margin, 62);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(232, 217, 184);
  doc.text(`Generated: ${formatDateTime(new Date().toISOString())}`, pageWidth - margin, 62, {
    align: 'right',
  });

  y = 122;

  // Designer & Account Metadata
  doc.setTextColor(31, 23, 26);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Designer & Account Details', margin, y);
  y += 8;
  doc.setDrawColor(226, 217, 206);
  doc.line(margin, y, pageWidth - margin, y);
  y += 18;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const metaRows: [string, string][] = [
    ['Brand Name', record.input.brandName],
    ['Designer / Contact', `${record.designerName} (${record.email})`],
    ['City & Category', `${record.input.city} · ${record.input.category}`],
    ['Preferred Window & Stall', `${record.input.preferredMonth} · ${record.input.preferredStallSize} Stall`],
    ['Booking Status', record.status],
    ['Needs Selected', record.input.needs.length ? record.input.needs.join(', ') : 'Standard Turnkey Setup'],
  ];

  metaRows.forEach(([label, val]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(val, margin + 150, y);
    y += 18;
  });

  y += 12;

  // Executive Verdict Box
  doc.setFillColor(243, 237, 227);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 76, 6, 6, 'F');
  doc.setDrawColor(197, 155, 72);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 76, 6, 6, 'S');

  doc.setTextColor(74, 16, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(
    `Readiness Score: ${record.metrics.readinessScore}/100  —  ${record.metrics.recommendation}`,
    margin + 16,
    y + 24
  );

  doc.setTextColor(31, 23, 26);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  const wrappedSummary = doc.splitTextToSize(
    record.metrics.recommendationSummary,
    pageWidth - margin * 2 - 32
  );
  doc.text(wrappedSummary, margin + 16, y + 42);

  y += 102;

  // Financial Projections
  doc.setTextColor(31, 23, 26);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Financial & CAC Projections', margin, y);
  y += 8;
  doc.setDrawColor(226, 217, 206);
  doc.line(margin, y, pageWidth - margin, y);
  y += 18;

  const finRows: [string, string][] = [
    ['Average Selling Price (ASP)', pdfINR(record.input.avgSellingPrice)],
    ['Expected Pieces Sold', `${record.input.expectedPiecesSold} pieces`],
    ['Gross Margin', `${record.input.grossMarginPct}%`],
    ['Turnkey 5-Star Stall Fee', pdfINR(record.metrics.stallFee)],
    ['Projected Pop-Up Revenue', pdfINR(record.metrics.projectedRevenue)],
    ['Projected Gross Profit', pdfINR(record.metrics.grossProfit)],
    ['Net Profit (After Stall Fee)', pdfINR(record.metrics.netProfit)],
    ['Projected ROI on Stall Fee', `${record.metrics.roiPct.toFixed(1)}%`],
    ['Break-Even Volume', `${record.metrics.breakEvenPieces} pieces`],
    ['Current Online CAC', pdfINR(record.metrics.onlineCAC)],
    ['Pop-Up CAC at Exhibition', pdfINR(record.metrics.popupCAC)],
    ['CAC Savings per Customer', pdfINR(record.metrics.cacSavings)],
  ];

  doc.setFontSize(10);
  finRows.forEach(([label, val], index) => {
    if (index % 2 === 0) {
      doc.setFillColor(250, 247, 242);
      doc.rect(margin, y - 12, pageWidth - margin * 2, 18, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 50, 54);
    doc.text(label, margin + 8, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 23, 26);
    doc.text(val, pageWidth - margin - 8, y, { align: 'right' });
    y += 19;
  });

  y += 14;

  // Score Breakdown
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Readiness Score Weighting', margin, y);
  y += 8;
  doc.line(margin, y, pageWidth - margin, y);
  y += 18;

  doc.setFontSize(9.5);
  record.metrics.scoreBreakdown.forEach((factor) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${factor.label}: ${factor.points}/${factor.maxPoints}`, margin, y);
    y += 13;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(90, 78, 82);
    doc.text(factor.rationale, margin + 10, y);
    doc.setTextColor(31, 23, 26);
    y += 17;
  });

  // Footer
  doc.setDrawColor(226, 217, 206);
  doc.line(margin, 790, pageWidth - margin, 790);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(107, 93, 98);
  doc.text(
    'Venture by Nishita Singh | nishita.0251mba514@dgu.ac.in | DBS Global University, Venture Quest',
    pageWidth / 2,
    808,
    { align: 'center' }
  );

  const safeBrand = record.input.brandName.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'designer';
  doc.save(`VibeAndVogue_${safeBrand}_Report.pdf`);
}
