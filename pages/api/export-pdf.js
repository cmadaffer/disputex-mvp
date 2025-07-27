// pages/api/export-pdf.js
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { letter } = req.body || {};
  if (!letter) return res.status(400).json({ error: 'Missing letter content' });

  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const margin = 50;
    const maxWidth = page.getWidth() - margin * 2;
    const lineHeight = fontSize * 1.4;

    const lines = wrapText(letter, font, fontSize, maxWidth);
    let y = page.getHeight() - margin;

    for (let line of lines) {
      if (y < margin) break; // skip overflow
      page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
      y -= lineHeight;
    }

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=dispute_letter.pdf');
    res.setHeader('Content-Length', pdfBytes.length);
    res.end(Buffer.from(pdfBytes), 'binary');
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ error: 'PDF generation failed' });
  }
}

function wrapText(text, font, fontSize, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';

  for (let word of words) {
    const testLine = line + word + ' ';
    const width = font.widthOfTextAtSize(testLine, fontSize);
    if (width > maxWidth) {
      l
