import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { letter, evidenceText } = req.body;

    if (!letter) {
      return res.status(400).json({ error: 'Missing letter content' });
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const lineHeight = fontSize + 4;
    const margin = 50;

    const drawTextBlock = (text, x, y) => {
      const lines = text.split('\n');
      lines.forEach((line, i) => {
        page.drawText(line, {
          x,
          y: y - i * lineHeight,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
      });
    };

    let currentY = 800;

    drawTextBlock('Chargeback Response Letter:\n', margin, currentY);
    currentY -= lineHeight * 2;
    drawTextBlock(letter, margin, currentY);

    if (evidenceText) {
      currentY -= lineHeight * (letter.split('\n').length + 4);
      drawTextBlock('\nAttached Evidence:\n', margin, currentY);
      currentY -= lineHeight * 2;
      drawTextBlock(evidenceText, margin, currentY);
    }

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=dispute-letter.pdf');
    res.status(200).send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}

