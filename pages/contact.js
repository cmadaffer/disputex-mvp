// pages/contact.js
import Head from 'next/head'
import { useState } from 'react'

export default function Contact() {
  const SUPPORT_EMAIL = 'curtismadaffer@gmail.com' // change later if needed

  const [form, setForm] = useState({
    company: '', website: '', platform: 'Shopify',
    gmv: '', disputeRate: '', name: '', email: '', phone: '', notes: ''
  })

  function onChange(e){
    const { name, value } = e.target
    setForm((f)=>({ ...f, [name]: value }))
  }

  function handleSubmit(e){
    e.preventDefault()
    const subject = `Disputex Pilot Request — ${form.company || 'New Lead'}`
    const body =
`Company: ${form.company}
Website: ${form.website}
Platform: ${form.platform}
Monthly GMV: ${form.gmv}
Dispute Rate (%): ${form.disputeRate}
Contact: ${form.name}
Email: ${form.email}
Phone: ${form.phone}
Notes: ${form.notes}

Please reply with two active disputes and any delivery/service proof so we can start.`
    // open their mail app with a prefilled message to you
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <>
      <Head><title>Contact — Disputex</title></Head>
      <main className="container" style={{padding:'4rem 0'}}>
        <h1>Start your 30-day pilot</h1>
        <p className="subtitle" style={{marginTop:'.4rem'}}>No accounts. No setup. Send us your details and we’ll reply with next steps.</p>

        <form className="card" onSubmit={handleSubmit}>
          <div className="grid2">
            <Field label="Company" name="company" value={form.company} onChange={onChange} required />
            <Field label="Website / Storefront URL" name="website" value={form.website} onChange={onChange} required />
            <div className="field">
              <label>Platform</label>
              <select name="platform" value={form.platform} onChange={onChange}>
                <option>Shopify</option><option>WooCommerce</option><option>BigCommerce</option><option>PayPal</option><option>Custom</option><option>Other</option>
              </select>
            </div>
            <Field label="Monthly GMV ($)" name="gmv" type="number" value={form.gmv} onChange={onChange} />
            <Field label="Dispute rate (%)" name="disputeRate" type="number" value={form.disputeRate} onChange={onChange} />
            <Field label="Your name" name="name" value={form.name} onChange={onChange} required />
            <Field label="Work email" name="email" type="email" value={form.email} onChange={onChange} required />
            <Field label="Phone (optional)" name="phone" value={form.phone} onChange={onChange} />
          </div>
          <div className="field">
            <label>Notes</label>
            <textarea name="notes" rows="5" value={form.notes} onChange={onChange} placeholder="Tell us your biggest chargeback pain…"></textarea>
          </div>
          <button className="btn xl" type="submit">Send</button>
          <p className="fine" style={{marginTop:'.6rem'}}>This opens your email app with a pre-filled message to us.</p>
        </form>
      </main>

      <style jsx global>{`
        :root { --bg:#070a0f; --panel:rgba(255,255,255,0.06); --panel-strong:rgba(255,255,255,0.12); --text:#e7ebf3; --muted:#a6b0c3; --accent:#7dd3fc; --accent2:#60a5fa; }
        body{background:var(--bg);color:var(--text);font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Inter,"Helvetica Neue",Arial}
        .container{width:min(900px,92vw);margin:0 auto}
        h1{font-size:clamp(1.8rem,4vw,2.4rem);margin:0}
        .subtitle{color:var(--muted)}
        .card{margin-top:1.2rem;background:linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03));border:1px solid rgba(255,255,255,0.1);border-radius:18px;padding:1.2rem}
        .grid2{display:grid;grid-template-columns:repeat(2,1fr);gap:.8rem}
        .field{background:var(--panel);border:1px solid var(--panel-strong);border-radius:12px;padding:.8rem}
        .field label{display:block;font-size:.85rem;color:var(--muted);margin-bottom:.3rem}
        .field input,.field select,.field textarea{width:100%;font:inherit;color:var(--text);background:transparent;border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:.6rem .7rem;outline:none}
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;padding:.9rem 1.2rem;border-radius:999px;background:linear-gradient(90deg,var(--accent),var(--accent2));color:#051224;font-weight:800;box-shadow:0 10px 30px rgba(96,165,250,0.35)}
        .btn.xl{font-size:1.05rem}
        .fine{color:var(--muted);font-size:.9rem}
        @media (max-width:680px){.grid2{grid-template-columns:1fr}}
      `}</style>
    </>
  )
}

function Field({ label, name, value, onChange, type='text', required=false }){
  return (
    <div className="field">
      <label>{label}{required ? ' *' : ''}</label>
      <input name={name} type={type} value={value} onChange={onChange} required={required} />
    </div>
  )
}
