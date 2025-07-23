export default function handler(req, res) {
  const { email } = req.body;
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Invalid email' });
  console.log("Saved email:", email);
  res.status(200).json({ status: 'saved' });
}
