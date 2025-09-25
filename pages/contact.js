import Head from 'next/head'
import { useState } from 'react'
import SiteLayout from '../components/SiteLayout'
import styles from '../styles/Form.module.css'

const SUPPORT_EMAIL = 'curtismadaffer@gmail.com'

export default function Contact() {
  const [form, setForm] = useState({
    company: '',
    website: '',
    platform: 'Shopify',
    gmv: '',
    disputeRate: '',
    name: '',
    email: '',
    phone: '',
    notes: ''
  })

  function onChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const subject = `Disputex Pilot Request — ${form.company || 'New Lead'}`
    const body = `Company: ${form.company}
Website: ${form.website}
Platform: ${form.platform}
Monthly GMV: ${form.gmv}
Dispute Rate (%): ${form.disputeRate}
Contact: ${form.name}
Email: ${form.email}
Phone: ${form.phone}
Notes: ${form.notes}

Please reply with two active disputes and any delivery/service proof so we can start.`

    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <SiteLayout>
      <Head>
        <title>Contact — Disputex</title>
      </Head>
      <section className={styles.page}>
        <div className="container">
          <header className={styles.header}>
            <h1>Start your 30-day pilot</h1>
            <p>No portals or integrations required. Share your dispute context and we’ll reply within one business day.</p>
          </header>
          <form className={styles.card} onSubmit={handleSubmit}>
            <div className={styles.grid}>
              <Field label="Company" name="company" value={form.company} onChange={onChange} required />
              <Field label="Website / storefront URL" name="website" value={form.website} onChange={onChange} required />
              <div className={styles.field}>
                <label>Platform</label>
                <select name="platform" value={form.platform} onChange={onChange}>
                  <option>Shopify</option>
                  <option>WooCommerce</option>
                  <option>BigCommerce</option>
                  <option>PayPal</option>
                  <option>Custom</option>
                  <option>Other</option>
                </select>
              </div>
              <Field label="Monthly GMV ($)" name="gmv" type="number" value={form.gmv} onChange={onChange} />
              <Field label="Dispute rate (%)" name="disputeRate" type="number" value={form.disputeRate} onChange={onChange} />
              <Field label="Your name" name="name" value={form.name} onChange={onChange} required />
              <Field label="Work email" name="email" type="email" value={form.email} onChange={onChange} required />
              <Field label="Phone (optional)" name="phone" value={form.phone} onChange={onChange} />
            </div>
            <div className={styles.field}>
              <label>Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={onChange}
                placeholder="Tell us about your biggest dispute headaches..."
              />
            </div>
            <div className={styles.actions}>
              <button type="submit" className={styles.primary}>
                Send summary
              </button>
              <p className={styles.note}>This opens your email client with all details pre-filled for easy review.</p>
            </div>
          </form>
        </div>
      </section>
    </SiteLayout>
  )
}

function Field({ label, name, value, onChange, type = 'text', required = false }) {
  return (
    <label className={styles.field}>
      <span>
        {label}
        {required ? ' *' : ''}
      </span>
      <input name={name} type={type} value={value} onChange={onChange} required={required} />
    </label>
  )
}
