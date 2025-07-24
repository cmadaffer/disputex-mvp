import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' })
  }

  const { merchantName, disputeReason, transactionAmount, evidenceText, evidenceURL } = req.body

  try {
    // Generate letter with OpenAI
    const prompt = `
You are an expert chargeback response assistant for merchants. Write a professional chargeback rebuttal letter in the merchant's voice, using formal tone and language aligned with credit card dispute protocols. Include the following details:

- Merchant: ${merchantName}
- Reason for chargeback: ${disputeReason}
- Transaction amount: $${transactionAmount}
- Supporting evidence summary: ${evidenceText}

This letter is to be submitted to the customer's credit card issuer. Be persuasive, factual, and do not provide legal advice.
`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4
    })

    const letter = completion.choices[0].message.content

    // Create PDF with the letter and evidence URL
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([600, 800])
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontSize = 12

    const fullText = `
CHARGEBACK DISPUTE LETTER

${letter}

EVIDENCE FILE:
${evidenceURL || 'No file uploaded.'}
    `.trim()

    const lines = fullText.split('\n')
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
    console.error('Export Error:', error)
    res.status(500).json({ error: 'Failed to generate PDF' })
  }
}
