import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { letterText } = req.body;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const margin = 50;
    let y = page.getHeight() - margin;

    const words = letterText.split(' ');
    let line = '';

    for (let word of words) {
      const testLine = line + word + ' ';
      const width = font.widthOfTextAtSize(testLine, fontSize);
      if (width > page.getWidth() - 2 * margin) {
        page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
        line = word + ' ';
        y -= fontSize + 2; // TIGHT LINE HEIGHT
      } else {
        line = testLine;
      }
    }

    if (line) {
      page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
    }

    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=dispute_letter.pdf');
    res.end(pdfBytes);
  } catch (error) {
    console.error('PDF export failed:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}
