import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [letter, setLetter] = useState('')
  const [chargebackType, setChargebackType] = useState('')
  const [merchantName, setMerchantName] = useState('')
  const [amount, setAmount] = useState('')
  const [evidence, setEvidence] = useState('')
  const [evidenceURL, setEvidenceURL] = useState('')
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else setUser(user)
    })
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function handleGenerate() {
    const res = await fetch('/api/generate-letter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chargebackType,
        merchantName,
        amount,
        evidence
      })
    })
    const data = await res.json()
    setLetter(data.letter || 'Error generating response')
  }

  async function handleUpload(event) {
    const file = event.target.files[0]
    const { data, error } = await supabase.storage
      .from('evidence-files')
      .upload(`${user.id}/${file.name}`, file)

    if (error) {
      alert('Upload failed')
    } else {
      const { data: { publicUrl } } = supabase
        .storage
        .from('evidence-files')
        .getPublicUrl(`${user.id}/${file.name}`)
      setEvidenceURL(publicUrl)
    }
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
    <div style={{ padding: 20 }}>
      <h1>Welcome to your dashboard</h1>
      <p>You are logged in as: {user?.email}</p>
      <button onClick={handleLogout}>Logout</button>

      <hr />

      <h2>Generate Dispute Letter</h2>
      <input placeholder="Chargeback reason code" value={chargebackType} onChange={e => setChargebackType(e.target.value)} /><br />
      <input placeholder="Merchant name" value={merchantName} onChange={e => setMerchantName(e.target.value)} /><br />
      <input placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} /><br />
      <textarea placeholder="Evidence description" value={evidence} onChange={e => setEvidence(e.target.value)} /><br />
      <button onClick={handleGenerate}>Generate Letter</button>

      <h3>Upload Evidence</h3>
      <input type="file" onChange={handleUpload} /><br />
      {evidenceURL && <p>Uploaded file: <a href={evidenceURL} target="_blank">{evidenceURL}</a></p>}

      <h3>Generated Letter:</h3>
      <pre>{letter}</pre>

      <button onClick={handleDownloadPDF}>Download PDF</button>
    </div>
  )
}

