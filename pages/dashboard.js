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

  async function handleGenerateLetter() {
    const prompt = `Write a formal chargeback response for type: ${chargebackType}, merchant: ${merchantName}, amount: ${amount}. Include evidence: ${evidence}`
    const res = await fetch('/api/generate-letter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })

    const data = await res.json()
    setLetter(data.text)
  }

  async function handleExportPDF() {
    const res = await fetch('/api/export-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ letterContent: letter }),
    })

    if (!res.ok) return alert('❌ PDF export failed')

    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'dispute_letter.pdf'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Disputex Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>

      <div>
        <input
          placeholder="Chargeback Type"
          value={chargebackType}
          onChange={(e) => setChargebackType(e.target.value)}
        />
        <input
          placeholder="Merchant Name"
          value={merchantName}
          onChange={(e) => setMerchantName(e.target.value)}
        />
        <input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <textarea
          placeholder="Additional Evidence"
          value={evidence}
          onChange={(e) => setEvidence(e.target.value)}
        />
        <input type="file" onChange={handleUpload} />
        {evidenceURL && <p>📎 Evidence uploaded
