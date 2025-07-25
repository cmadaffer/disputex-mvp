// pages/api/export-pdf.js

import PDFDocument from 'pdfkit';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req, res) {
  try {
    const doc = new PDFDocument();
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="dispute_letter.pdf"',
        'Content-Length': pdfBuffer.length
      });
      res.end(pdfBuffer); // << critical fix
    });

    // Dummy content — replace later
    doc.fontSize(24).text('Test PDF: This file was streamed correctly.');
    doc.end();
  } catch (error) {
    console.error('PDF stream error:', error);
    res.status(500).json({ error: 'PDF export failed' });
  }
}
