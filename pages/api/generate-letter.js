export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { chargebackType, merchantName, amount, evidence } = req.body

  if (!chargebackType || !merchantName || !amount || !evidence) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not set' })
  }

  try {
    const prompt = `
You are a professional chargeback dispute assistant.

Write a rebuttal letter from a merchant for a credit card chargeback.

Details:
- Reason: ${chargebackType}
- Merchant: ${merchantName}
- Amount: $${amount}
- Evidence Summary: ${evidence}

Use a professional, formal tone. No legal advice. Visa/Mastercard-safe.
    `.trim()

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4
      })
    })

    const json = await response.json()
    const letter = json.choices?.[0]?.message?.content || 'No content returned from OpenAI'

    res.status(200).json({ letter })
  } catch (error) {
    console.error('OpenAI Error:', error)
    res.status(500).json({ error: 'Failed to contact OpenAI' })
  }
}
