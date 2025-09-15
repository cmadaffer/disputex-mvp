// pages/index.js
import Head from 'next/head'
import Link from 'next/link'
import { useMemo, useState } from 'react'

export default function Home() {
  // No external tools needed:
  const CALENDLY_URL = '/contact'
  const TALLY_URL = '/contact'
  const SUPPORT_EMAIL = 'curtismadaffer@gmail.com' // change later if you want

  // ROI calculator state
  const [gmv, setGmv] = useState(100000)
  const [disputeRate, setDisputeRate] = useState(1.5)
  const [winRate, setWinRate] = useState(55)
  const [avgTicket, setAvgTicket] = useState(120)
  const [feePct, setFeePct] = useState(15)

  const calc = useMemo(() => {
    const disputes = (gmv * (disputeRate / 100)) / Math.max(1, avgTicket)
    const recovered = disputes * (winRate / 100) * avgTicket
    const fee = (recovered * feePct) / 100
    const net = recovered - fee
    return { disputes, recovered, fee, net }
  }, [gmv, disputeRate, winRate, avgTicket, feePct])

  // Waitlist form state (uses your existing /api/waitlist)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleWaitlistSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitted(false)
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (res.ok) setSubmitted(true)
      else setError(data.error || 'Submission failed.')
    } catch {
      setError('An unexpected error occurred.')
    }
  }

  return (
    <>
      <Head>
        <title>Disputex — Recover Chargebacks Automatically</title>
        <meta name="description" content="Issuer-tuned CE 3.0 evidence packs. We assemble the right proof and submit on time, every time. Pay only when you win during the pilot." />
        <meta property="og:title" content="Disputex — Recover Chargebacks Automatically" />
        <meta property="og:description" content="Issuer-tuned representments, CE 3.0 evidence, automated deadlines. Pay only when you win." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {/* NAV */}
        <header className="container">
          <div className="nav">
            <div className="brand">
              <Logo />
              <span className="logotype">Disputex</span>
            </div>
            <nav className="navlinks">
              <a href="#features">Features</a>
              <a href="#how">How it works</a>
              <a href="#pricing">Pricing</a>
              <Link className="btn ghost" href="/login">Login</Link>
              <Link className="btn" href="/contact">Contact</Link>
            </nav>
          </div>
        </header>

        {/* HERO */}
        <section className="hero container">
          <div className="heroContent">
            <h1>Recover chargebacks <span className="accent">automatically</span>.</h1>
            <p className="subtitle">
              Issuer-tuned representments with CE 3.0 evidence. We assemble the right proof and submit on time, every time.
              <strong> Pay only when you win</strong> during the pilot.
            </p>

            {/* Waitlist form (keeps your existing API) */}
            <form className="waitlist" onSubmit={handleWaitlistSubmit}>
              <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <button type="submit" className="btn xl">Start 30-day pilot</button>
            </form>
            {submitted && <p className="ok">✅ You’ve been added to the waitlist.</p>}
            {error && <p className="err">❌ {error}</p>}

            {/* Simple CTAs that go to /contact */}
            <div className="ctaRow">
              <Link className="btn xl ghost" href="/contact">Request a 12-min demo</Link>
              <Link className="btn xl ghost" href="/contact">Send case details</Link>
            </div>

            <div className="trust">
              <Badge>CE 3.0-aware workflows</Badge>
              <Badge>Deadline tracker</Badge>
              <Badge>Evidence templates by reason code</Badge>
            </div>
          </div>

          <div className="heroCard">
            <MetricsCard />
          </div>

          <div className="bgGlow" aria-hidden />
        </section>

        {/* LOGOS */}
        <section className="logos container" aria-label="built for">
          <span className="hint">Built for modern commerce</span>
          <div className="logoRow">
            <svg className="logo" viewBox="0 0 100 20" role="img" aria-label="Shopify"><rect width="100" height="20" rx="4"/></svg>
            <svg className="logo" viewBox="0 0 100 20" role="img" aria-label="Stripe"><rect width="100" height="20" rx="4"/></svg>
            <svg className="logo" viewBox="0 0 100 20" role="img" aria-label="WooCommerce"><rect width="100" height="20" rx="4"/></svg>
            <svg className="logo" viewBox="0 0 100 20" role="img" aria-label="PayPal"><rect width="100" height="20" rx="4"/></svg>
            <svg className="logo" viewBox="0 0 100 20" role="img" aria-label="BigCommerce"><rect width="100" height="20" rx="4"/></svg>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="features container">
          <Feature title="Issuer-tuned letters" text="Arguments aligned to card-network guidance and your processor’s preferences." />
          <Feature title="CE 3.0 evidence packs" text="Order logs, delivery proof, device/email/IP signals, and consent compiled into a clean PDF bundle." />
          <Feature title="On-time, every time" text="Automatic deadline tracker per network so you never miss a representment window." />
          <Feature title="What won & why" text="Reason-code analytics so you can prevent future losses." />
        </section>

        {/* HOW */}
        <section id="how" className="how container">
          <h2>How it works</h2>
          <div className="steps">
            <Step n={1} title="Send your disputes" text="Use the Contact page. No engineering required." />
            <Step n={2} title="We assemble evidence" text="Issuer-ready narrative + CE 3.0 proof." />
            <Step n={3} title="We submit & track" text="Submission via your processor portals. Audit trail included." />
            <Step n={4} title="You get results" text="We report outcomes and what to fix to reduce future disputes." />
          </div>
        </section>

        {/* ROI */}
        <section className="roi container" aria-labelledby="roiTitle">
          <div className="roiCard">
            <h2 id="roiTitle">Estimate your monthly recovery</h2>
            <div className="grid">
              <Field label="Monthly sales volume ($)" value={gmv} onChange={setGmv} min={10000} max={1000000} step={1000} />
              <Field label="Dispute rate (%)" value={disputeRate} onChange={setDisputeRate} min={0.2} max={5} step={0.1} />
              <Field label="Expected win rate (%)" value={winRate} onChange={setWinRate} min={30} max={85} step={1} />
              <Field label="Average dispute value ($)" value={avgTicket} onChange={setAvgTicket} min={20} max={500} step={5} />
              <Field label="Pilot success fee (%)" value={feePct} onChange={setFeePct} min={10} max={20} step={1} />
            </div>
            <div className="roiMetrics">
              <div className="pill">
                <span className="k">${Math.round(calc.recovered).toLocaleString()}</span>
                <span className="kLabel">Recovered / mo</span>
              </div>
              <div className="pill">
                <span className="k">${Math.round(calc.fee).toLocaleString()}</span>
                <span className="kLabel">Our fee (pilot)</span>
              </div>
              <div className="pill success">
                <span className="k">${Math.round(calc.net).toLocaleString()}</span>
                <span className="kLabel">Net back to you</span>
              </div>
            </div>
            <div className="ctaRow center">
              <Link className="btn xl" href="/contact">Start now</Link>
              <span className="fine">Questions? <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></span>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="pricing container">
          <div className="priceCard">
            <h2>Simple, aligned pricing</h2>
            <ul className="bullets">
              <li><b>Pilot:</b> 15% success fee only</li>
              <li><b>After pilot:</b> $399/mo + 10–15% success fee</li>
              <li>Unlimited disputes, unlimited users</li>
              <li>Evidence storage & audit trail included</li>
            </ul>
            <Link className="btn xl" href="/contact">Request a 12-min demo</Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="faq container">
          <h2>Questions, answered</h2>
          <details>
            <summary>Do you handle Visa CE 3.0 requirements?</summary>
            <p>Yes. We structure narratives and attach CE 3.0-aligned evidence (e.g., device & email matches, delivery proof, terms consent) per reason code.</p>
          </details>
          <details>
            <summary>Is this legal advice?</summary>
            <p>No. Disputex provides operational tooling and document assembly; we do not provide legal advice.</p>
          </details>
          <details>
            <summary>How do you submit representments?</summary>
            <p>We prepare your evidence and submit through your existing processor/acquirer portals (e.g., Shopify/Stripe, PayPal). We maintain a complete audit trail.</p>
          </details>
          <details>
            <summary>What data do you need?</summary>
            <p>Basic order details (item, amount, timestamps), fulfillment proof, customer contact, and any service logs or communications.</p>
          </details>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="container footGrid">
            <div className="brandRow">
              <Logo />
              <span className="logotype">Disputex</span>
            </div>
            <div className="footLinks">
              <a href="#features">Features</a>
              <a href="#how">How it works</a>
              <a href="#pricing">Pricing</a>
              <Link href="/contact">Contact</Link>
            </div>
            <div className="fine">
              © {new Date().getFullYear()} Disputex. All rights reserved. Disputex is an operational tool and not legal advice.
            </div>
          </div>
        </footer>
      </main>

      {/* Styles (same polished look) */}
      <style jsx global>{`
        :root {
          --bg: #070a0f; --panel: rgba(255,255,255,0.06); --panel-strong: rgba(255,255,255,0.12);
          --text: #e7ebf3; --muted: #a6b0c3; --accent: #7dd3fc; --accent2: #60a5fa;
          --success: #34d399; --grad1: radial-gradient(800px 400px at 20% -10%, rgba(125,211,252,0.25), transparent 60%);
          --grad2: radial-gradient(800px 400px at 80% -10%, rgba(96,165,250,0.20), transparent 60%);
        }
        *{box-sizing:border-box} html,body,#__next{height:100%}
        body{margin:0;background:var(--bg);color:var(--text);font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Inter,"Helvetica Neue",Arial}
        a{color:var(--text);text-decoration:none}
        .container{width:min(1200px,92vw);margin:0 auto}
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;padding:.8rem 1.1rem;border-radius:999px;background:linear-gradient(90deg,var(--accent),var(--accent2));color:#051224;font-weight:700;box-shadow:0 10px 30px rgba(96,165,250,0.35);transition:transform .15s ease,filter .2s ease}
        .btn:hover{transform:translateY(-1px);filter:brightness(1.05)}
        .btn.ghost{background:transparent;color:var(--text);border:1px solid var(--panel-strong);box-shadow:none}
        .btn.xl{padding:1rem 1.4rem;font-size:1.05rem}
        .fine{color:var(--muted);font-size:.9rem}
        header{position:sticky;top:0;z-index:40;backdrop-filter:blur(8px);background:linear-gradient(to bottom,rgba(7,10,15,.7),rgba(7,10,15,.15));border-bottom:1px solid rgba(255,255,255,.06)}
        .nav{display:flex;align-items:center;justify-content:space-between;height:72px}
        .brand{display:flex;align-items:center;gap:.6rem;font-weight:800;letter-spacing:.3px}
        .logotype{font-size:1.05rem;opacity:.95}
        .navlinks{display:flex;gap:.9rem;align-items:center}
        .navlinks a{color:var(--muted);font-weight:600}
        .navlinks a:hover{color:var(--text)}
        .hero{position:relative;display:grid;grid-template-columns:1.2fr .9fr;gap:2rem;align-items:center;padding:5rem 0 3rem}
        .heroContent h1{font-size:clamp(2.2rem,5vw,3.6rem);line-height:1.05;margin:0 0 1rem;letter-spacing:.2px}
        .accent{background:linear-gradient(90deg,var(--accent),var(--accent2));-webkit-background-clip:text;background-clip:text;color:transparent}
        .subtitle{color:var(--muted);font-size:1.15rem;line-height:1.6}
        .subtitle strong{color:var(--text)}
        .ctaRow{display:flex;gap:1rem;margin:1.0rem 0 0.4rem;flex-wrap:wrap}
        .trust{display:flex;gap:.6rem;flex-wrap:wrap;margin-top:.6rem}
        .bgGlow{position:absolute;inset:0;pointer-events:none;background-image:var(--grad1),var(--grad2);opacity:.8;filter:blur(10px);z-index:-1}
        .waitlist{display:flex;gap:.6rem;margin:1.2rem 0 .4rem;flex-wrap:wrap}
        .waitlist input{flex:1 1 260px;font:inherit;color:var(--text);background:transparent;border:1px solid rgba(255,255,255,0.18);border-radius:999px;padding:.85rem 1rem;outline:none}
        .ok{color:#8ff0b0;margin:.3rem 0 0}.err{color:#ff8890;margin:.3rem 0 0}
        .heroCard{background:linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03));border:1px solid rgba(255,255,255,0.1);border-radius:18px;padding:1.2rem;box-shadow:0 30px 60px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.15)}
        .logos{text-align:center;padding:1.8rem 0 0}.logoRow{display:grid;grid-template-columns:repeat(5,1fr);gap:1rem;align-items:center;opacity:.6}
        .logo{width:100%;height:40px;fill:#9fb3d2}.hint{display:block;color:var(--muted);font-size:.9rem;margin-bottom:.8rem}
        .features{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;padding:3rem 0 1rem}
        .feature{background:var(--panel);border:1px solid var(--panel-strong);border-radius:16px;padding:1.2rem;min-height:150px}
        .feature h3{margin:0 0 .5rem;font-size:1.1rem}.feature p{color:var(--muted);line-height:1.6}
        .how{padding:2.5rem 0 0}.how h2,.roi h2,.pricing h2,.faq h2{font-size:clamp(1.6rem,3.2vw,2rem);margin:0 0 1rem}
        .steps{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem}
        .step{background:linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03));border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:1rem}
        .step .n{display:inline-flex;width:28px;height:28px;align-items:center;justify-content:center;border-radius:999px;font-weight:800;background:linear-gradient(90deg,var(--accent),var(--accent2));color:#04101e;margin-bottom:.4rem}
        .step h4{margin:.2rem 0 .3rem}.step p{color:var(--muted);line-height:1.6}
        .roi{padding:2.8rem 0 0}.roiCard{background:linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03));border:1px solid rgba(255,255,255,0.1);border-radius:18px;padding:1.2rem}
        .grid{display:grid;grid-template-columns:repeat(5,1fr);gap:.8rem}
        .field{background:var(--panel);border:1px solid var(--panel-strong);border-radius:12px;padding:.8rem}
        .field label{display:block;font-size:.85rem;color:var(--muted);margin-bottom:.3rem}
        .field input{width:100%;font:inherit;color:var(--text);background:transparent;border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:.6rem .7rem;outline:none}
        .roiMetrics{display:flex;gap:.8rem;flex-wrap:wrap;margin:1rem 0 .2rem}
        .pill{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.14);border-radius:12px;padding:.8rem 1rem;min-width:180px}
        .pill.success{border-color:rgba(52,211,153,.5);box-shadow:0 0 0 1px rgba(52,211,153,.25) inset}
        .k{display:block;font-size:1.2rem;font-weight:800}.kLabel{color:var(--muted);font-size:.85rem}
        .ctaRow.center{justify-content:center;gap:1rem;align-items:center}
        .pricing{padding:2.6rem 0 0}.priceCard{text-align:center;background:linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03));border:1px solid rgba(255,255,255,0.1);border-radius:18px;padding:2rem 1.2rem}
        .bullets{list-style:none;padding:0;margin:0 0 1rem;display:grid;gap:.5rem}.bullets li{color:var(--muted)}
        .faq{padding:2.4rem 0 3.6rem}.faq details{background:var(--panel);border:1px solid var(--panel-strong);border-radius:12px;padding:.9rem 1rem;margin-bottom:.8rem}.faq summary{cursor:pointer;font-weight:700}.faq p{color:var(--muted)}
        .footer{border-top:1px solid rgba(255,255,255,0.08);background:linear-gradient(to top,rgba(255,255,255,0.04),transparent)}
        .footGrid{display:grid;grid-template-columns:1fr auto;align-items:center;gap:1rem;padding:1.4rem 0}
        .brandRow{display:flex;align-items:center;gap:.6rem}.footLinks{display:flex;gap:1rem}
        @media (max-width:980px){.hero{grid-template-columns:1fr}.features{grid-template-columns:repeat(2,1fr)}.steps{grid-template-columns:repeat(2,1fr)}.grid{grid-template-columns:repeat(2,1fr)}.logoRow{grid-template-columns:repeat(3,1fr)}.footGrid{grid-template-columns:1fr;text-align:center}.navlinks{display:none}}
        @media (max-width:520px){.features,.steps,.grid{grid-template-columns:1fr}}
      `}</style>
    </>
  )
}

// --- UI atoms (same as before) ---
function Badge({ children }) { return <span className="badge">{children}
  <style jsx>{`.badge{display:inline-flex;align-items:center;gap:.4rem;padding:.38rem .6rem;border:1px solid rgba(255,255,255,0.14);border-radius:999px;background:rgba(255,255,255,0.06);color:#d7e2f5;font-size:.85rem}`}</style>
</span> }
function Feature({ title, text }) { return <div className="feature"><h3>{title}</h3><p>{text}</p></div> }
function Step({ n, title, text }) { return <div className="step"><div className="n">{n}</div><h4>{title}</h4><p>{text}</p></div> }
function Field({ label, value, onChange, min, max, step }) { return (
  <div className="field"><label>{label}</label>
    <input type="number" value={value} min={min} max={max} step={step} onChange={(e)=>onChange(Number(e.target.value))} />
  </div>
)}
function MetricsCard(){ return (<div className="metrics">
  <div className="row"><Metric k={'24h'} label="Turnaround" /><Metric k={'CE 3.0'} label="Evidence-ready" /><Metric k={'$0'} label="If no recovery" /></div>
  <div className="barWrap" aria-hidden><div className="bar" /></div>
  <style jsx>{`.metrics{display:grid;gap:.9rem}.row{display:grid;grid-template-columns:repeat(3,1fr);gap:.6rem}.barWrap{height:6px;background:rgba(255,255,255,0.08);border-radius:999px;overflow:hidden}.bar{height:100%;width:65%;background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:999px;box-shadow:0 0 20px rgba(125,211,252,0.5);animation:load 2.4s ease infinite alternate}@keyframes load{from{width:52%}to{width:88%}}@media (max-width:980px){.row{grid-template-columns:1fr}}`}</style>
</div>)}
function Metric({k,label}){return(<div className="metric"><div className="k">{k}</div><div className="label">{label}</div>
  <style jsx>{`.metric{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.14);border-radius:14px;padding:.9rem;text-align:center}.k{font-weight:900;font-size:1.2rem}.label{color:var(--muted);font-size:.9rem}`}</style>
</div>)}
function Logo(){return(<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
  <defs><linearGradient id="g" x1="0" y1="0" x2="26" y2="26" gradientUnits="userSpaceOnUse"><stop stopColor="#7dd3fc"/><stop offset="1" stopColor="#60a5fa"/></linearGradient></defs>
  <rect x="1" y="1" width="24" height="24" rx="6" stroke="url(#g)" strokeWidth="2"/><path d="M7 16c2.2-4.4 6.1-7.2 12-8-3.9 2.1-6.3 4.7-7.2 7.8 1.4-.6 3-.9 4.9-.9-2.7 1.6-5.2 2.5-7.7 2.6-1.9.1-3.1-.5-2-.5z" fill="url(#g)"/>
</svg>)}
