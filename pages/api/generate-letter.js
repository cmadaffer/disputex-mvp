// pages/api/generate-letter.js

import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Missing customer email' });
  }

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a professional chargeback response assistant trained to generate high-quality, regulation-compliant merchant rebuttal letters for all major credit card providers (Visa, Mastercard, AmEx, Discover). Respond in formal business tone, from the merchant’s perspective.`,
        },
        {
          role: "user",
          content: `Generate a chargeback response letter for a customer with email: ${email}. This is a placeholder template; no sensitive data yet. Make it polite, persuasive, and structured for review by payment processors.`,
        },
      ],
      temperature: 0.3,
      max_tokens: 600,
    });

    const letter = completion.data.choices[0].message.content;
    return res.status(200).json({ letter });
  } catch (error) {
    console.error('OpenAI Error:', error);
    return res.status(500).json({ error: 'Failed to generate letter' });
  }
}
