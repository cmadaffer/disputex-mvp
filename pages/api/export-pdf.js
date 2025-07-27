// pages/api/export-pdf.js
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { letter } = req.body || {};
  if (!letter) return res.status(400).json({ error: 'Letter content is required' });

  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const margin = 50;
    const textWidth = page.getWidth() - margin * 2;
    const textHeight = fontSize * 1.2;

    const wrappedText = wrapText(letter, font, fontSize, textWidth);
    let y = page.getHeight() - margin;

    for (const line of wrappedText) {
      if (y < margin) break; // skip overflow for now
      page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
      y -= textHeight;
    }

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=dispute_letter.pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error('PDF generation failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function wrapText(text, font, size, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';

  for (const word of words) {
    const newLine = line + word + ' ';
    if (font.widthOfTextAtSize(newLine, size) > maxWidth) {
      lines.push(line.trim());
      line = word + ' ';
    } else {
      line = newLine;
    }
  }
  if (line) lines.push(line.trim());
  return lines;
}
