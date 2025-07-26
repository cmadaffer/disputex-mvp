import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { letter, evidenceURL } = req.body || {};
  if (!letter) return res.status(400).json({ error: 'Letter content is required' });

  try {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const page = pdfDoc.addPage([595, 842]); // A4 size

    const textWidth = page.getWidth() - 100;
    const wrappedText = wrapText(letter, font, fontSize, textWidth);

    let y = page.getHeight() - 50;
    wrappedText.forEach((line) => {
      if (y < 50) {
        y = page.getHeight() - 50;
        pdfDoc.addPage([595, 842]);
      }
      page.drawText(line, { x: 50, y, size: fontSize, font, color: rgb(0, 0, 0) });
      y -= fontSize * 1.5;
    });

    if (evidenceURL) {
      const fileRes = await fetch(evidenceURL);
      const fileBytes = await fileRes.arrayBuffer();
      const fileBuffer = new Uint8Array(fileBytes);

      let image;
      if (evidenceURL.toLowerCase().endsWith('.png')) {
        image = await pdfDoc.embedPng(fileBuffer);
      } else {
        image = await pdfDoc.embedJpg(fileBuffer);
      }

      const imgPage = pdfDoc.addPage([image.width, image.height]);
      imgPage.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
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
    const testLine = line + word + ' ';
    const lineWidth = font.widthOfTextAtSize(testLine, size);
    if (lineWidth > maxWidth) {
      lines.push(line);
      line = word + ' ';
    } else {
      line = testLine;
    }
  }
  if (line) lines.push(line);
  return lines;
}
