import jsPDF from 'jspdf';
import type { FormularioData } from '../types';

export async function generarPDF(data: FormularioData): Promise<jsPDF> {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const colors = {
    primary: [30, 58, 95] as [number, number, number],
    primaryLight: [238, 244, 251] as [number, number, number],
    text: [31, 41, 55] as [number, number, number],
    textLight: [107, 114, 128] as [number, number, number],
    border: [229, 231, 235] as [number, number, number],
    white: [255, 255, 255] as [number, number, number],
    accent: [34, 197, 94] as [number, number, number],
  };

  // --- HELPER FUNCTIONS ---
  function checkPageBreak(needed: number) {
    if (y + needed > doc.internal.pageSize.getHeight() - 25) {
      doc.addPage();
      y = 20;
    }
  }

  function drawLine(yPos: number) {
    doc.setDrawColor(...colors.border);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);
  }

  function drawTableHeader(headers: string[], colWidths: number[], startY: number): number {
    doc.setFillColor(...colors.primary);
    doc.rect(margin, startY, contentWidth, 8, 'F');
    doc.setTextColor(...colors.white);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');

    let x = margin + 3;
    headers.forEach((header, i) => {
      doc.text(header, x, startY + 5.5);
      x += colWidths[i]!;
    });

    return startY + 8;
  }

  function drawTableRow(values: string[], colWidths: number[], startY: number, isEven: boolean): number {
    const lineHeight = 6;
    // Calculate needed height for word wrapping
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    let maxLines = 1;
    const wrappedTexts: string[][] = [];
    
    values.forEach((val, i) => {
      const maxWidth = colWidths[i]! - 6;
      const lines = doc.splitTextToSize(val || '-', maxWidth) as string[];
      wrappedTexts.push(lines);
      if (lines.length > maxLines) maxLines = lines.length;
    });

    const rowHeight = Math.max(lineHeight * maxLines + 2, 8);

    checkPageBreak(rowHeight);

    if (isEven) {
      doc.setFillColor(...colors.primaryLight);
      doc.rect(margin, startY, contentWidth, rowHeight, 'F');
    }

    doc.setTextColor(...colors.text);
    let x = margin + 3;
    wrappedTexts.forEach((lines, i) => {
      let textY = startY + 5;
      lines.forEach((line) => {
        doc.text(line, x, textY);
        textY += lineHeight;
      });
      x += colWidths[i]!;
    });

    // Bottom border
    doc.setDrawColor(...colors.border);
    doc.setLineWidth(0.1);
    doc.line(margin, startY + rowHeight, pageWidth - margin, startY + rowHeight);

    return startY + rowHeight;
  }

  // --- LOAD LOGO ---
  let logoDataUrl: string | null = null;
  try {
    const response = await fetch('/logo.png');
    const blob = await response.blob();
    logoDataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch {
    // Logo not available, continue without it
  }

  // --- HEADER ---
  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, pageWidth, 44, 'F');

  // Logo in header
  const logoMarginRight = 10;
  if (logoDataUrl) {
    try {
      // White background box for logo
      doc.setFillColor(...colors.white);
      doc.roundedRect(pageWidth - logoMarginRight - 44, 7, 44, 20, 2, 2, 'F');
      doc.addImage(logoDataUrl, 'PNG', pageWidth - logoMarginRight - 42, 8.5, 40, 17);
    } catch {
      // Skip if logo fails
    }
  }

  // Company Info under logo (centered with respect to the logo)
  const logoCenterX = pageWidth - logoMarginRight - 22; // 44 / 2 = 22
  doc.setTextColor(...colors.white);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('SERVICIOS MULTIPLES DONCA S.L.', logoCenterX, 32, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text('C.I.F B 93027118', logoCenterX, 36, { align: 'center' });

  // Title
  doc.setTextColor(...colors.white);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('PARTE DE INCIDENCIAS', margin, 26);

  y = 55;

  // --- DATOS GENERALES ---
  doc.setTextColor(...colors.primary);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DATOS GENERALES', margin, y);
  
  y += 7;
  doc.setTextColor(...colors.text);
  doc.setFontSize(9);
  
  const halfPage = pageWidth / 2;
  
  // Fila 1
  doc.setFont('helvetica', 'bold');
  doc.text('Fecha:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(data.fecha), margin + 13, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Centro:', halfPage, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.centroTrabajo, halfPage + 14, y);
  
  y += 6;

  // Fila 2
  doc.setFont('helvetica', 'bold');
  doc.text('Resp. (10h-19h):', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.responsableTurno || '-', margin + 28, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Resp. (19h-04h):', halfPage, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.responsableTurno2 || '-', halfPage + 28, y);
  
  y += 6;

  // Fila 3: Coches
  const cochesDiariosStr = data.cochesDiarios?.trim();
  const cochesSemanaStr = data.cochesSemana?.trim();
  
  if (cochesDiariosStr || cochesSemanaStr) {
    doc.setFont('helvetica', 'bold');
    doc.text('Coches diarios:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(cochesDiariosStr || '-', margin + 25, y);

    if (cochesSemanaStr) {
      doc.setFont('helvetica', 'bold');
      doc.text('Coches semana:', halfPage, y);
      doc.setFont('helvetica', 'normal');
      doc.text(cochesSemanaStr, halfPage + 26, y);
    }
    y += 6;
  }
  
  y += 3;
  doc.setFontSize(7);
  doc.setTextColor(...colors.textLight);
  doc.text(`Documento generado: ${new Date().toLocaleString('es-ES')}`, margin, y);
  
  y += 12;

  // --- SECTION: PERSONAL DE SERVICIO ---
  const allAuxiliares = data.auxiliares.filter(a => a.nombre?.trim() || a.turno?.trim());
  if (allAuxiliares.length > 0) {
    checkPageBreak(30);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.primary);
    doc.text('PERSONAL DE SERVICIO', margin, y);
    y += 3;

    // Accent line
    doc.setFillColor(...colors.accent);
    doc.rect(margin, y, 40, 1.5, 'F');
    y += 6;

    const colWidths = [contentWidth * 0.65, contentWidth * 0.35];
    y = drawTableHeader(['Auxiliar', 'Turno'], colWidths, y);

    allAuxiliares.forEach((aux, i) => {
      y = drawTableRow(
        [aux.nombre || '-', aux.turno || '-'],
        colWidths,
        y,
        i % 2 === 0
      );
    });

    y += 10;
  }

  // --- SECTION: INCIDENCIAS ---
  const allIncidencias = data.incidencias.filter(inc => inc.hora?.trim() || inc.descripcion?.trim());
  if (allIncidencias.length > 0) {
    checkPageBreak(30);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.primary);
    doc.text('INCIDENCIAS', margin, y);
    y += 3;

    doc.setFillColor(...colors.accent);
    doc.rect(margin, y, 40, 1.5, 'F');
    y += 6;

    const colWidths = [contentWidth * 0.2, contentWidth * 0.8];
    y = drawTableHeader(['Hora', 'Incidencia'], colWidths, y);

    allIncidencias.forEach((inc, i) => {
      y = drawTableRow(
        [inc.hora || '-', inc.descripcion || '-'],
        colWidths,
        y,
        i % 2 === 0
      );
    });

    y += 10;
  }




  // --- FOOTER ---
  drawLine(y);
  y += 5;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.textLight);

  const now = new Date();
  const generatedAt = `Documento generado el ${now.toLocaleDateString('es-ES')} a las ${now.toLocaleTimeString('es-ES')}`;
  doc.text(generatedAt, margin, y);
  doc.text('Parte de Incidencias - Gestión de Servicios', pageWidth - margin, y, { align: 'right' });

  return doc;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export function getPDFFileName(fecha: string): string {
  return `Parte_Incidencias_${fecha || new Date().toISOString().split('T')[0]}.pdf`;
}
