// pages/api/export-pdf.js

import { NextApiRequest, NextApiResponse } from 'next';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { letter, evidenceURL } = req.body;

  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 750]);

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const lines = letter.split('\n');
    let y = 700;

    for (const line of lines) {
      page.drawText(line, {
        x: 50,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      y -= fontSize + 4;
    }

    // If evidenceURL is provided, append link on new page
    if (evidenceURL) {
      const linkPage = pdfDoc.addPage([600, 200]);
      linkPage.drawText('Evidence File URL:', {
        x: 50,
        y: 150,
        size: 14,
        font,
        color: rgb(0, 0, 1),
      });
      linkPage.drawText(evidenceURL, {
        x: 50,
        y: 130,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
    }

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=dispute.pdf');
    return res.status(200).send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('PDF generation error:', error);
    return res.status(500).json({ error: 'Failed to generate PDF' });
  }
}
