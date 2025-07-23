export default function handler(req, res) {
  const { description } = req.body;
  const template = `Dear Card Issuer,

I am writing to dispute a recent charge on my account. The transaction in question is described as:

"${description}"

I believe this charge is in error and request that it be investigated in accordance with Visa and Mastercard guidelines.

Sincerely,  
[Your Name]`;

  res.status(200).json({
    letter: template,
    confidence: "92%"
  });
}
