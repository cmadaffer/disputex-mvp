// pages/api/generate-letter.js
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { chargebackType, merchantName, amount, evidence, evidenceURL } = req.body || {};
  if (!chargebackType || !merchantName || !amount || !evidence)
    return res.status(400).json({ error: 'Missing required fields' });

  try {
    const prompt = `
You are a professional chargeback dispute assistant. Write a formal, persuasive rebuttal letter from the merchant's point of view, aligned with Visa/Mastercard/Amex/Discover expectations (no legal advice).

Inputs:
- Chargeback Reason: ${chargebackType}
- Merchant: ${merchantName}
- Amount: $${amount}
- Evidence Summary: ${evidence}
${evidenceURL ? `- Evidence File URL: ${evidenceURL}` : '- No evidence file URL provided'}

Return only the letter body.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
    });

    const letter = completion.choices?.[0]?.message?.content ?? 'No letter returned.';
    return res.status(200).json({ letter });
  } catch (err) {
    console.error('OpenAI Error:', err);
    return res.status(500).json({ error: 'Failed to generate letter.' });
  }
}
