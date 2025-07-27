// pages/dashboard.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../utils/supabaseClient'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [letter, setLetter] = useState('')
  const [chargebackType, setChargebackType] = useState('')
  const [merchantName, setMerchantName] = useState('')
  const [amount, setAmount] = useState('')
  const [evidence, setEvidence] = useState('')
  const [evidenceURL, setEvidenceURL] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) router.push('/login')
      else {
        setUser(session.user)
        setLoading(false)
      }
    })
  }, [])

  if (loading) return <p>Loading...</p>

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function handleUpload(e) {
    const file = e.target.files[0]
    if (!file || !user) return alert('No file or user.')

    const { error } = await supabase.storage
      .from('evidence-files')
      .upload(`${user.id}/${file.name}`, file)

    if (error) return alert('Upload failed.')

    const { data: { publicUrl } } = supabase
      .storage
      .from('evidence-files')
      .getPublicUrl(`${user.id}/${file.name}`)

    setEvidenceURL(publicUrl)
    alert('✅ File uploaded.')
  }

  async function handleGenerate() {
    const res = await fetch('/api/generate-letter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chargebackType, merchantName, amount, evidence, evidenceURL })
    })
    const data = await res.json()
    setLetter(data.letter || 'Error generating letter.')
  }

  async function handleDownloadPDF() {
    const res = await fetch('/api/export-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ letter, evidenceURL })
    })
    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'dispute_letter.pdf'
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Welcome to your dashboard</h1>
      <p>You are logged in as: {user.email}</p>
      <button onClick={handleLogout}>Logout</button>

      <h2>Generate Dispute Letter</h2>
      <input placeholder="Chargeback reason code" value={chargebackType} onChange={e => setChargebackType(e.target.value)} /><br />
      <input placeholder="Merchant name" value={merchantName} onChange={e => setMerchantName(e.target.value)} /><br />
      <input placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} /><br />
      <textarea placeholder="Evidence summary" value={evidence} onChange={e => setEvidence(e.target.value)} /><br />
      <input type="file" onChange={handleUpload} /><br /><br />
      <button onClick={handleGenerate}>Generate Letter</button>
      <pre>{letter}</pre>
      {letter && <button onClick={handleDownloadPDF}>Download PDF</button>}
    </div>
  )
}
