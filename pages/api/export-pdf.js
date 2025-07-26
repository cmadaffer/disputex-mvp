// /pages/api/export-pdf.js

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { letterContent } = req.body;

    if (!letterContent) {
      return res.status(400).json({ error: 'Missing letter content' });
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 12;
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const lines = letterContent.split('\n');
    let y = height - 50;

    for (const line of lines) {
      if (y < 50) {
        page.drawText('... PDF truncated due to page overflow ...', {
          x: 50,
          y,
          size: fontSize,
          font,
          color: rgb(1, 0, 0),
        });
        break;
      }
      page.drawText(line, {
        x: 50,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      y -= fontSize + 4;
    }

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=dispute_letter.pdf');
    res.status(200).send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}

