import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { letterText } = req.body;

    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    const fontSize = 12;
    const margin = 50;
    const maxWidth = width - margin * 2;

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    let y = height - margin;

    function wrapText(text, font, fontSize, maxWidth) {
      const paragraphs = text.split(/\n\s*\n/); // Split on double line breaks
      const lines = [];

      for (let para of paragraphs) {
        const words = para.split(/\s+/);
        let line = '';

        for (let word of words) {
          const testLine = line + word + ' ';
          const testWidth = font.widthOfTextAtSize(testLine, fontSize);

          if (testWidth > maxWidth) {
            lines.push(line.trim());
            line = word + ' ';
          } else {
            line = testLine;
          }
        }

        if (line.trim() !== '') {
          lines.push(line.trim());
        }

        lines.push(''); // Add blank line between paragraphs
      }

      return lines;
    }

    const lines = wrapText(letterText, font, fontSize, maxWidth);
    const lineHeight = fontSize * 1.6;

    for (let line of lines) {
      if (y < margin + lineHeight) {
        page = pdfDoc.addPage();
        y = height - margin;
      }

      if (line === '') {
        y -= lineHeight; // paragraph break
        continue;
      }

      page.drawText(line, {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });

      y -= lineHeight;
    }

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=dispute_letter.pdf');
    res.status(200).send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}

