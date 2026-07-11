import { jsPDF } from 'jspdf';

/**
 * Exports resume analysis data into a structured, professional PDF document.
 * @param {object} analysis - The analysis object containing scores, lists, and summary.
 * @param {string} fileName - Original uploaded resume file name.
 */
export const exportAnalysisToPDF = (analysis, fileName = 'Resume') => {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPosition = 20;

  // Helper function to check space and add new page if needed
  const checkPageSpace = (heightNeeded) => {
    if (yPosition + heightNeeded > pageHeight - margin) {
      doc.addPage();
      yPosition = margin + 10;
      
      // Mini Header for secondary pages
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // Slate 400
      doc.text(`ResuScan AI - Analysis Report: ${fileName}`, margin, margin);
      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.2);
      doc.line(margin, margin + 2, pageWidth - margin, margin + 2);
      yPosition += 5;
    }
  };

  // 1. Header Banner
  doc.setFillColor(16, 185, 129); // Emerald 500
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Title
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('RESUSCAN AI ASSESSMENT', margin, 18);

  // File Detail
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(209, 250, 229); // Emerald 100
  doc.text(`Target File: ${fileName}`, margin, 26);
  doc.text(`Generated On: ${new Date().toLocaleDateString()}`, margin, 32);

  yPosition = 50;

  // 2. Score Section (Draw Cards)
  checkPageSpace(30);
  
  // Overall Score
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.roundedRect(margin, yPosition, 52, 22, 2, 2, 'F');
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(16, 185, 129); // Emerald
  doc.text(`${analysis.resumeScore} / 100`, margin + 6, yPosition + 10);
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text('OVERALL QUALITY', margin + 6, yPosition + 16);

  // ATS Score
  const atsX = margin + 52 + 5;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(atsX, yPosition, 52, 22, 2, 2, 'F');
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(99, 102, 241); // Indigo
  doc.text(`${analysis.atsScore} / 100`, atsX + 6, yPosition + 10);
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('ATS READABILITY', atsX + 6, yPosition + 16);

  // Grammar Score
  const grammarX = atsX + 52 + 5;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(grammarX, yPosition, 52, 22, 2, 2, 'F');
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(245, 158, 11); // Amber
  doc.text(`${analysis.grammarScore} / 100`, grammarX + 6, yPosition + 10);
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('GRAMMAR & WRITING', grammarX + 6, yPosition + 16);

  yPosition += 32;

  // 3. Professional Summary
  checkPageSpace(40);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59); // Slate 800
  doc.text('Executive Analysis Summary', margin, yPosition);
  
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.8);
  doc.line(margin, yPosition + 2, margin + 15, yPosition + 2);
  yPosition += 8;

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105); // Slate 600
  const summaryText = doc.splitTextToSize(analysis.summary, contentWidth);
  doc.text(summaryText, margin, yPosition);
  yPosition += (summaryText.length * 5) + 10;

  // 4. Section List helper
  const drawListSection = (title, items, bulletColor = [16, 185, 129]) => {
    if (!items || items.length === 0) return;
    
    // Estimate space needed
    const headingHeight = 12;
    const itemHeights = items.map(item => {
      const splitLines = doc.splitTextToSize(item, contentWidth - 8);
      return splitLines.length * 5 + 2;
    });
    const totalHeight = headingHeight + itemHeights.reduce((a, b) => a + b, 0) + 5;
    
    checkPageSpace(totalHeight);
    
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text(title, margin, yPosition);
    
    doc.setDrawColor(bulletColor[0], bulletColor[1], bulletColor[2]);
    doc.setLineWidth(0.8);
    doc.line(margin, yPosition + 2, margin + 15, yPosition + 2);
    yPosition += 8;

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);

    items.forEach((item) => {
      const splitLines = doc.splitTextToSize(item, contentWidth - 8);
      const spaceNeeded = splitLines.length * 5 + 2;
      checkPageSpace(spaceNeeded);

      // Bullet dot
      doc.setFillColor(bulletColor[0], bulletColor[1], bulletColor[2]);
      doc.circle(margin + 2, yPosition - 1.2, 0.8, 'F');
      
      doc.text(splitLines, margin + 6, yPosition);
      yPosition += spaceNeeded;
    });

    yPosition += 6;
  };

  // Draw Lists
  drawListSection('Key Strengths', analysis.strengths, [16, 185, 129]); // Emerald
  drawListSection('Areas for Improvement', analysis.improvements, [99, 102, 241]); // Indigo
  drawListSection('Critical Weaknesses', analysis.weaknesses, [239, 68, 68]); // Rose
  drawListSection('Missing Recommended Skills', analysis.missingSkills, [245, 158, 11]); // Amber

  // 5. Skills & Keywords Grid
  const listToWords = (title, items) => {
    if (!items || items.length === 0) return;
    const textString = items.join(', ');
    const splitLines = doc.splitTextToSize(textString, contentWidth);
    const heightNeeded = 12 + (splitLines.length * 5) + 5;

    checkPageSpace(heightNeeded);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text(title, margin, yPosition);
    
    doc.setDrawColor(100, 116, 139);
    doc.setLineWidth(0.8);
    doc.line(margin, yPosition + 2, margin + 15, yPosition + 2);
    yPosition += 8;

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(splitLines, margin, yPosition);
    
    yPosition += (splitLines.length * 5) + 8;
  };

  listToWords('Identified Professional Skills', analysis.skillsFound);
  listToWords('Targeted Resume Keywords', analysis.keywords);
  listToWords('Suggested Career & Job Roles', analysis.recommendedJobs);

  // Footer note on last page
  doc.setFont('Helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Assessment generated automatically by ResuScan AI utilizing Google Gemini API. Absolute scoring may vary.', margin, pageHeight - 10);

  // Download trigger
  const safeName = fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  doc.save(`resuscan_report_${safeName}.pdf`);
};
