// pages/api/export-pdf.js
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { letter, evidenceURL } = req.body || {};
  if (!letter) return res.status(400).json({ error: 'Letter content is required' });

  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const textWidth = page.getWidth() - 100;
    const wrappedText = wrapText(letter, font, fontSize, textWidth);
    const textHeight = fontSize * 1.2;

    let y = page.getHeight() - 50;
    wrappedText.forEach((line) => {
      if (y < 50) {
        y = page.getHeight() - 50;
        pdfDoc.addPage();
        page.drawText(line, { x: 50, y, size: fontSize, font, color: rgb(0, 0, 0) });
      } else {
        page.drawText(line, { x: 50, y, size: fontSize, font, color: rgb(0, 0, 0) });
      }
      y -= textHeight;
    });

    // Append uploaded evidence file
    if (evidenceURL) {
      const response = await fetch(evidenceURL);
      const fileBytes = await response.arrayBuffer();
      const ext = evidenceURL.split('.').pop();

      if (ext === 'pdf') {
        const externalDoc = await PDFDocument.load(fileBytes);
        const copiedPages = await pdfDoc.copyPages(externalDoc, externalDoc.getPageIndices());
        copiedPages.forEach((p) => pdfDoc.addPage(p));
      } else {
        const img = await pdfDoc.embedJpg(fileBytes);
        const imgPage = pdfDoc.addPage([img.width, img.height]);
        imgPage.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }
    }

    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=dispute_letter.pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error('PDF error:', err);
    return res.status(500).json({ error: 'Failed to export PDF' });
  }
}

function wrapText(text, font, size, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (let word of words) {
    const newLine = line + word + ' ';
    if (font.widthOfTextAtSize(newLine, size) > maxWidth) {
      lines.push(line);
      line = word + ' ';
    } else {
      line = newLine;
    }
  }
  if (line) lines.push(line);
  return lines;
}
