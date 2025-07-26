// pages/api/generate-letter.js
import { Configuration, OpenAIApi } from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not set' });
  }

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Invalid email provided' });
  }

  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const prompt = `Write a formal and professional chargeback rebuttal letter from a merchant's perspective for a customer with the email ${email}. The letter should be persuasive, evidence-backed, and formatted according to Visa/Mastercard guidelines.`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
    });

    const letter = completion.data.choices[0].message.content;

    return res.status(200).json({ letter });
  } catch (err) {
    console.error('OpenAI Error:', err.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to generate letter' });
  }
}

