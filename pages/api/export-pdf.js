// pages/api/export-pdf.js
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { letter, evidenceURL } = req.body || {};
  if (!letter) return res.status(400).json({ error: 'Letter content is required' });

  try {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const margin = 50;
    const textWidth = page.getWidth() - margin * 2;
    const textHeight = fontSize * 1.2;

    const wrappedText = wrapText(letter, font, fontSize, textWidth);
    let y = page.getHeight() - margin;

    for (const line of wrappedText) {
      if (y < margin) {
        page = pdfDoc.addPage();
        y = page.getHeight() - margin;
      }
      page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
      y -= textHeight;
    }

    if (evidenceURL) {
      try {
        const response = await fetch(evidenceURL);
        const fileBytes = await response.arrayBuffer();
        const ext = evidenceURL.split('.').pop().toLowerCase();

        if (ext === 'pdf') {
          const externalDoc = await PDFDocument.load(fileBytes);
          const copiedPages = await pdfDoc.copyPages(externalDoc, externalDoc.getPageIndices());
          copiedPages.forEach((p) => pdfDoc.addPage(p));
        } else {
          try {
            const img = await pdfDoc.embedJpg(fileBytes);
            const imgPage = pdfDoc.addPage([img.width, img.height]);
            imgPage.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
          } catch {
            try {
              const png = await pdfDoc.embedPng(fileBytes);
              const imgPage = pdfDoc.addPage([png.width, png.height]);
              imgPage.drawImage(png, { x: 0, y: 0, width: png.width, height: png.height });
            } catch {
              console.warn('Evidence file is not a valid image.');
            }
          }
        }
      } catch (err) {
        console.warn('Could not fetch or embed evidence file:', err.message);
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
      lines.push(line.trim());
      line = word + ' ';
    } else {
      line = newLine;
    }
  }
  if (line) lines.push(line.trim());
  return lines;
}
