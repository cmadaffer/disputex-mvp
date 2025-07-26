// /pages/api/export-pdf.js

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { letter, evidenceURL } = req.body;

    if (!letter) {
      return res.status(400).json({ error: 'Missing letter content' });
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    let y = height - 50;

    const lines = letter.split('\n');
    lines.forEach(line => {
      if (y < 50) return;
      page.drawText(line, { x: 50, y, size: fontSize, font, color: rgb(0, 0, 0) });
      y -= 20;
    });

    if (evidenceURL && y > 70) {
      y -= 40;
      page.drawText('Attached Evidence URL:', { x: 50, y, size: 12, font, color: rgb(0, 0, 1) });
      y -= 20;
      page.drawText(evidenceURL, { x: 50, y, size: 10, font, color: rgb(0, 0, 1) });
    }

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=dispute.pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}
