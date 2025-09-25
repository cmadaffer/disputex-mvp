import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../utils/supabaseClient'
import Head from 'next/head'
import SiteLayout from '../components/SiteLayout'
import styles from '../styles/Dashboard.module.css'

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
  }, [router])

  if (loading) {
    return (
      <SiteLayout>
        <Head>
          <title>Dashboard — Disputex</title>
        </Head>
        <section className={styles.wrap}>
          <div className="container">
            <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
          </div>
        </section>
      </SiteLayout>
    )
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function handleUpload(event) {
    const file = event.target.files?.[0]
    if (!file || !user) {
      alert('Please choose a file.')
      return
    }

    const { error } = await supabase.storage.from('evidence-files').upload(`${user.id}/${file.name}`, file)
    if (error) {
      alert('Upload failed. Please retry.')
      return
    }

    const {
      data: { publicUrl }
    } = supabase.storage.from('evidence-files').getPublicUrl(`${user.id}/${file.name}`)

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
    <SiteLayout>
      <Head>
        <title>Dashboard — Disputex</title>
      </Head>
      <section className={styles.wrap}>
        <div className="container">
          <div className={styles.card}>
            <div className={styles.header}>
              <div>
                <h1>Welcome back</h1>
                <p className={styles.subtitle}>Signed in as {user.email}</p>
              </div>
              <button className={styles.logout} onClick={handleLogout}>
                Logout
              </button>
            </div>

            <div className={styles.grid}>
              <Field label="Chargeback reason code" value={chargebackType} onChange={setChargebackType} />
              <Field label="Merchant name" value={merchantName} onChange={setMerchantName} />
              <Field label="Amount ($)" value={amount} onChange={setAmount} />
              <Field label="Evidence summary" value={evidence} onChange={setEvidence} textarea />
            </div>

            <div className={styles.actions}>
              <label className={styles.secondary}>
                Upload evidence
                <input type="file" onChange={handleUpload} style={{ display: 'none' }} />
              </label>
              <button type="button" className={styles.primary} onClick={handleGenerate}>
                Generate letter
              </button>
              {letter && (
                <button type="button" className={styles.secondary} onClick={handleDownloadPDF}>
                  Download PDF
                </button>
              )}
            </div>

            <div>
              <h2 style={{ margin: '0 0 0.4rem' }}>Draft output</h2>
              <p className={styles.subtitle}>
                Review the generated dispute narrative and tailor any context before submission.
              </p>
              <div className={styles.preview}>{letter || 'Generated letters will appear here.'}</div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}

function Field({ label, value, onChange, textarea = false }) {
  if (textarea) {
    return (
      <label className={styles.field}>
        <span>{label}</span>
        <textarea value={value} onChange={(event) => onChange(event.target.value)} />
      </label>
    )
  }

  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}
