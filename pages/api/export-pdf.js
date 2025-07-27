import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { letterText } = req.body;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // Letter size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const lineHeight = fontSize * 1.6;
    const margin = 50;
    const maxWidth = page.getWidth() - 2 * margin;
    let y = page.getHeight() - margin;

    const paragraphs = letterText.split(/\n\s*\n/); // Paragraph breaks

    for (const para of paragraphs) {
      const words = para.trim().split(/\s+/);
      let line = '';

      for (const word of words) {
        const testLine = line + word + ' ';
        const width = font.widthOfTextAtSize(testLine, fontSize);

        if (width > maxWidth) {
          page.drawText(line.trim(), { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
          y -= lineHeight;
          line = word + ' ';
        } else {
          line = testLine;
        }
      }

      if (line.trim()) {
        page.drawText(line.trim(), { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
        y -= lineHeight;
      }

      y -= lineHeight; // Add space between paragraphs
    }

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=dispute_letter.pdf');
    res.end(pdfBytes); // ✅ Direct binary response — prevents corruption
  } catch (error) {
    console.error('PDF export failed:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}


