export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { chargebackType, merchantName, amount, evidence, evidenceURL } = req.body

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'OpenAI API key not set' })

  const prompt = `
You are a chargeback dispute assistant.

Write a professional rebuttal letter with the following:

- Chargeback Reason: ${chargebackType}
- Merchant Name: ${merchantName}
- Amount: $${amount}
- Summary of Evidence: ${evidence}
- Evidence File URL: ${evidenceURL || 'None provided'}

Use formal tone. Be persuasive, do not include legal advice. Align with card issuer expectations.
  `.trim()

  try {
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
    const letter = json.choices?.[0]?.message?.content || 'Letter generation failed.'
    res.status(200).json({ letter })
  } catch (error) {
    console.error('OpenAI Error:', error)
    res.status(500).json({ error: 'Failed to contact OpenAI' })
  }
}
