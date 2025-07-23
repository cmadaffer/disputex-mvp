import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' })
  }

  const { letter, evidenceURL } = req.body

  try {
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([600, 800])
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontSize = 12

    const text = `
CHARGEBACK DISPUTE LETTER

${letter}

EVIDENCE FILE:
${evidenceURL || 'No file uploaded.'}
    `.trim()

    const lines = text.split('\n')
    let y = 760
    lines.forEach(line => {
      page.drawText(line, { x: 40, y, size: fontSize, font, color: rgb(0, 0, 0) })
      y -= 20
    })

    const pdfBytes = await pdfDoc.save()

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=dispute_letter.pdf')
    res.send(Buffer.from(pdfBytes))
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate PDF' })
  }
}
