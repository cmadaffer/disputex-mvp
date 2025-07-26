import { Configuration, OpenAIApi } from 'openai';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Missing email' });

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Write a professional chargeback rebuttal letter for customer email: ${email}. Format according to Visa/Mastercard network tone and rules.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const letter = response.data.choices[0].message.content;
    return res.status(200).json({ letter });
  } catch (error) {
    console.error('[OpenAI error]', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to generate letter' });
  }
}

