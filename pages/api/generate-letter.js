import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const prompt = `You are a merchant disputing a chargeback. Write a formal, evidence-based response letter for customer email ${email}. Keep the tone professional, follow Visa/Mastercard representment format.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
    });

    const letter = completion.choices?.[0]?.message?.content || '';

    res.status(200).json({ letter });
  } catch (err) {
    console.error('Letter generation error:', err);
    res.status(500).json({ message: 'Failed to generate letter' });
  }
}
