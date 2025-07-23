// pages/dashboard.js
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    reasonCode: '',
    merchantName: '',
    amount: '',
    description: '',
  })
  const [file, setFile] = useState(null)
  const [evidenceURL, setEvidenceURL] = useState('')
  const [generatedLetter, setGeneratedLetter] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        router.push('/login')
      } else {
        setUser(data.user)
      }
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0]
    if (!uploadedFile) return

    const filePath = `${user.id}/${Date.now()}_${uploadedFile.name}`
    const { data, error } = await supabase.storage
      .from('evidence-files')
      .upload(filePath, uploadedFile)

    if (error) {
      alert('Error uploading file')
      console.error(error)
    } else {
      const { data: urlData } = supabase.storage
        .from('evidence-files')
        .getPublicUrl(filePath)
      setEvidenceURL(urlData.publicUrl)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setGeneratedLetter('')

    const prompt = `
You are generating a formal merchant response to a credit card chargeback submitted by a cardholder.

Instructions:
- Speak from the merchant’s perspective.
- Address the letter to the card issuer or acquiring bank.
- Maintain a formal, professional tone.
- Include all required transaction information and a concise summary of facts.
- Reference evidence (e.g., delivery confirmation, signed agreements, correspondence).
- Comply with card network dispute procedures (Visa, Mastercard, Amex, Discover).
- Do NOT offer legal advice. This is not a legal notice.

Context:
- Chargeback Reason Code: ${formData.reasonCode}
- Merchant Name: ${formData.merchantName}
- Disputed Amount: $${formData.amount}
- Merchant Explanation: ${formData.description}
- Uploaded Evidence Link: ${evidenceURL || 'No file uploaded'}

Generate a persuasive letter that clearly shows the transaction was valid and fulfilled. Emphasize evidence, timelines, and rebut the cardholder’s claims with facts. Keep it concise but powerful.
    `.trim()

    const res = await fetch('/api/generate-letter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })

    const data = await res.json()
    setGeneratedLetter(data.result)
    setLoading(false)
  }

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: '0 auto' }}>
      <h1>Welcome to your dashboard</h1>
      <p>You are logged in as: {user?.email}</p>
      <button onClick={handleLogout} style={{ marginBottom: 30 }}>Logout</button>

      <h2>Generate Dispute Letter</h2>
      <form onSubmit={handleSubmit}>
        <input name="reasonCode" placeholder="Reason Code" onChange={handleChange} required />
        <input name="merchantName" placeholder="Merchant Name" onChange={handleChange} required />
        <input name="amount" placeholder="Amount" type="number" onChange={handleChange} required />
        <textarea name="description" placeholder="Merchant Explanation" onChange={handleChange} required />

        <p><strong>Attach Evidence File (PDF, image, etc):</strong></p>
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} />

        {evidenceURL && <p>Uploaded File: <a href={evidenceURL} target="_blank">{evidenceURL}</a></p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Letter'}
        </button>
      </form>

      {generatedLetter && (
        <div style={{ marginTop: 30 }}>
          <h3>Generated Letter:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: 20 }}>
            {generatedLetter}
          </pre>
        </div>
      )}
    </div>
  )
}
