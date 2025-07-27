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
    const res = a
