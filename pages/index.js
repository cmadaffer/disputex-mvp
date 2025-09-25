import Head from 'next/head'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import SiteLayout from '../components/SiteLayout'
import styles from '../styles/Home.module.css'

const SUPPORT_EMAIL = 'curtismadaffer@gmail.com'

const heroHighlights = [
  'Evidence built for issuer review',
  'Deadline tracking and audit trails',
  'Only pay when we recover funds'
]

const features = [
  {
    title: 'Network-ready narratives',
    copy: 'Arguments framed for Visa, Mastercard, Amex, and Discover guidance, written by seasoned dispute operators.'
  },
  {
    title: 'CE 3.0 evidence bundles',
    copy: 'Device, delivery, communications, and consent proof organised into a single PDF ready to upload.'
  },
  {
    title: 'Operational visibility',
    copy: 'Reason-code analytics and win/loss commentary so finance, CX, and ops stay aligned.'
  }
]

const steps = [
  {
    title: 'Share live disputes',
    detail: 'Send case details or forward processor alerts. No integrations needed to start.'
  },
  {
    title: 'We assemble the case',
    detail: 'Our operators prepare the narrative and compile CE 3.0-friendly proof for each reason code.'
  },
  {
    title: 'Submit and report back',
    detail: 'We file through your processor portals, track outcomes, and tell you what prevented future losses.'
  }
]

export default function Home() {
  const [gmv, setGmv] = useState(100000)
  const [disputeRate, setDisputeRate] = useState(1.5)
  const [winRate, setWinRate] = useState(55)
  const [avgTicket, setAvgTicket] = useState(120)
  const [feePct, setFeePct] = useState(15)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const calc = useMemo(() => {
    const disputes = (gmv * (disputeRate / 100)) / Math.max(1, avgTicket)
    const recovered = disputes * (winRate / 100) * avgTicket
    const fee = (recovered * feePct) / 100
    const net = recovered - fee
    return { disputes, recovered, fee, net }
  }, [gmv, disputeRate, winRate, avgTicket, feePct])

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
      else setError(data.error || 'Unable to add you right now.')
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    }
  }

  return (
    <SiteLayout>
      <Head>
        <title>Disputex — Chargeback operations for modern commerce</title>
        <meta
          name="description"
          content="Disputex builds issuer-ready evidence packs, tracks deadlines, and only charges when you recover disputed revenue."
        />
      </Head>

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>Chargeback operations, streamlined</span>
            <h1 className={styles.title}>
              Recover more <span>without adding headcount</span>
            </h1>
            <p className={styles.subtitle}>
              We turn messy evidence into issuer-ready submissions, track every deadline, and only charge when we recover
              your revenue during the pilot.
            </p>
            <form className={styles.waitlist} onSubmit={handleWaitlistSubmit}>
              <input
                type="email"
                placeholder="Work email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <button type="submit">Start 30-day pilot</button>
            </form>
            {submitted && <p className={styles.support}>Thanks — check your inbox for next steps.</p>}
            {error && <p className={styles.support} style={{ color: '#fca5a5' }}>{error}</p>}
            <div className={styles.heroExtras}>
              {heroHighlights.map((item) => (
                <span key={item}>• {item}</span>
              ))}
            </div>
            <p className={styles.support}>
              Prefer a conversation? <Link href="/contact">Book a 12-minute review</Link> or email{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
            </p>
          </div>
          <div className={styles.heroPanel}>
            <div className={styles.metricDeck}>
            <div className={styles.metricRow}>
              <Metric label="Turnaround" value="24 hours" />
              <Metric label="Networks covered" value="4" />
              <Metric label="If we don't recover" value="$0" />
            </div>
            <div>
              <h3 style={{ margin: '0 0 0.5rem' }}>Monthly impact preview</h3>
              <p className={styles.support}>
                Adjust the assumptions to see expected recovered revenue during the pilot period.
              </p>
            </div>
            <div className={styles.roiGrid}>
              <Field label="Monthly sales ($)" value={gmv} onChange={setGmv} min={10000} max={1000000} step={1000} />
              <Field label="Dispute rate (%)" value={disputeRate} onChange={setDisputeRate} min={0.2} max={5} step={0.1} />
              <Field label="Win rate (%)" value={winRate} onChange={setWinRate} min={30} max={90} step={1} />
              <Field label="Average dispute ($)" value={avgTicket} onChange={setAvgTicket} min={20} max={500} step={5} />
              <Field label="Pilot fee (%)" value={feePct} onChange={setFeePct} min={10} max={25} step={1} />
            </div>
            <div className={styles.roiMetrics}>
              <ValuePill heading="Recovered" value={calc.recovered} />
              <ValuePill heading="Fee" value={calc.fee} />
              <ValuePill heading="Net back to you" value={calc.net} highlight />
            </div>
          </div>
          </div>
        </div>
      </section>

      <section id="features" className={`${styles.section} container`}>
        <div className={styles.sectionHeader}>
          <h2>What you get with Disputex</h2>
          <p className={styles.support}>
            A lighter process for finance, CX, and ops — without sacrificing win rates or insight.
          </p>
        </div>
        <div className={styles.featureGrid}>
          {features.map((feature) => (
            <article key={feature.title} className={styles.featureCard}>
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="process" className={`${styles.section} container`}>
        <div className={styles.sectionHeader}>
          <h2>A tight three-step workflow</h2>
          <p className={styles.support}>Clear ownership, less back-and-forth, and results you can present to leadership.</p>
        </div>
        <div className={styles.processGrid}>
          {steps.map((step, index) => (
            <article key={step.title} className={styles.stepCard}>
              <span className={styles.stepBadge}>{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className={`${styles.section} container`}>
        <div className={styles.pricingCard}>
          <div className={styles.sectionHeader}>
            <h2>Aligned incentives, no retainers</h2>
            <p className={styles.support}>Get started with a pilot in days, not months.</p>
          </div>
          <ul className={styles.priceList}>
            <li><strong>Pilot:</strong> 15% success fee on recovered funds</li>
            <li><strong>After pilot:</strong> $399/mo platform + 10–15% success fee</li>
            <li>Unlimited disputes, users, and secure file storage</li>
            <li>Audit trails, analytics, and evidence templates included</li>
          </ul>
          <div className={styles.ctaRow}>
            <Link href="/contact">Book a working session</Link>
            <Link href="/contact">Send case files</Link>
          </div>
        </div>
      </section>

      <section className={`${styles.section} container`}>
        <div className={styles.sectionHeader}>
          <h2>Frequently asked</h2>
          <p className={styles.support}>Key details teams ask before moving forward.</p>
        </div>
        <div className={styles.faqGrid}>
          <details className={styles.faqItem}>
            <summary>Do you support Visa CE 3.0 requirements?</summary>
            <p>
              Yes. Every submission maps evidence and narrative language to CE 3.0 fields, highlighting device, delivery, and
              consent data.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary>How do you integrate with our stack?</summary>
            <p>
              We start manually: you forward dispute alerts or export case data. We then plug into portals or APIs once volume
              justifies automation.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary>Who works on my disputes?</summary>
            <p>
              Operators who have worked inside high-volume merchants and issuers. No outsourcing, and every case is reviewed by a
              senior dispute specialist.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary>What happens after the pilot?</summary>
            <p>
              We review outcomes together, implement prevention recommendations, and move you onto a predictable monthly
              engagement.
            </p>
          </details>
        </div>
      </section>
    </SiteLayout>
  )
}

function Metric({ label, value }) {
  return (
    <div className={styles.metric}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}

function Field({ label, value, onChange, min, max, step }) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  )
}

function ValuePill({ heading, value, highlight = false }) {
  const rounded = Math.round(value).toLocaleString()
  return (
    <div className={styles.pill} style={highlight ? { background: 'rgba(52, 211, 153, 0.18)', borderColor: 'rgba(52, 211, 153, 0.4)' } : undefined}>
      <strong>{`$${rounded}`}</strong>
      <span>{heading}</span>
    </div>
  )
}
