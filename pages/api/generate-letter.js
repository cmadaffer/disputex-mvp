export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { chargebackType, merchantName, amount, evidence } = req.body;

  if (!chargebackType || !merchantName || !amount || !evidence) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not set' });
  }

  try {
    const prompt = `
You are an expert chargeback response assistant for merchants. Write a formal, persuasive dispute response for the following:

- Reason: ${chargebackType}
- Merchant: ${merchantName}
- Amount: $${amount}
- Supporting Evidence: ${evidence}

Keep the tone professional, cite evidence clearly, and do not include legal advice.
    `.trim();

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
    });

    const json = await openaiRes.json();
    const letter = json.choices?.[0]?.message?.content || 'Error generating response';
    res.status(200).json({ letter });
  } catch (err) {
    console.error('OpenAI Error:', err);
    res.status(500).json({ error: 'Failed to contact OpenAI' });
  }
}
