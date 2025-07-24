export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt } = req.body

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' })
  }

  const apiKey = process.env.OPEN_AI_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not set' })
  }

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    })

    const json = await openaiRes.json()
    const result = json.choices?.[0]?.message?.content || 'Error generating response'
    res.status(200).json({ result })
  } catch (err) {
    res.status(500).json({ error: 'Error contacting OpenAI' })
  }
}
