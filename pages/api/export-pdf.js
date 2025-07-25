import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' })
  }

  const { letter, evidenceURL } = req.body

  try {
    const pdfDoc = await PDFDocument.create()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontSize = 12
    const lineHeight = 18
    const margin = 40
    const pageWidth = 600
    const pageHeight = 800
    let y = pageHeight - margin

    const addPage = () => {
      const page = pdfDoc.addPage([pageWidth, pageHeight])
      y = pageHeight - margin
      return page
    }

    let page = addPage()

    const fullText = `
CHARGEBACK DISPUTE LETTER

${letter}

EVIDENCE FILE:
${evidenceURL || 'No file uploaded.'}
    `.trim()

    const lines = fullText.split('\n')
    for (const line of lines) {
      if (y < margin) page = addPage()
      page.drawText(line.trim(), {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0)
      })
      y -= lineHeight
    }

    const pdfBytes = await pdfDoc.save()
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=dispute_letter.pdf')
    res.send(Buffer.from(pdfBytes))
  } catch (error) {
    console.error('PDF Export Error:', error)
    res.status(500).json({ error: 'Failed to generate PDF' })
  }
}
