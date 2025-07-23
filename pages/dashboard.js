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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setGeneratedLetter('')

    const prompt = `
Generate a professional chargeback dispute letter. Include:
- Reason Code: ${formData.reasonCode}
- Merchant Name: ${formData.merchantName}
- Amount: $${formData.amount}
- Description: ${formData.description}

Make it concise, persuasive, and formatted for Visa/Mastercard reviewers.
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
        <textarea name="description" placeholder="Description" onChange={handleChange} required />
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

