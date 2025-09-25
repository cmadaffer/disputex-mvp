import Head from 'next/head'
import SiteLayout from '../components/SiteLayout'
import styles from '../styles/Admin.module.css'

export async function getServerSideProps(ctx) {
  const { query } = ctx
  const ADMIN_KEY = process.env.ADMIN_KEY || ''
  const providedKey = (query.key || '').toString()

  if (!ADMIN_KEY || providedKey !== ADMIN_KEY) {
    return { props: { ok: false, rows: [], createdAt: new Date().toISOString() } }
  }

  const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/+$/, '')
  const KEY = process.env.SUPABASE_SERVICE_ROLE || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  let rows = []
  try {
    if (SUPABASE_URL && KEY) {
      const resp = await fetch(`${SUPABASE_URL}/rest/v1/waitlist?select=email,created_at&order=created_at.desc`, {
        headers: { apikey: KEY, authorization: `Bearer ${KEY}` }
      })
      if (resp.ok) rows = await resp.json()
      else console.error('Fetch waitlist failed', await resp.text())
    }
  } catch (e) {
    console.error('Admin fetch error', e)
  }

  return { props: { ok: true, rows, createdAt: new Date().toISOString() } }
}

export default function Admin({ ok, rows, createdAt }) {
  if (!ok) {
    return (
      <SiteLayout>
        <Head>
          <title>Disputex — Waitlist Admin</title>
        </Head>
        <section className={styles.page}>
          <div className="container">
            <div className={styles.stack}>
              <h1>Forbidden</h1>
              <p className={styles.meta}>
                Add <code>?key=YOUR_ADMIN_KEY</code> to the URL and configure <code>ADMIN_KEY</code> in your environment.
              </p>
            </div>
          </div>
        </section>
      </SiteLayout>
    )
  }

  return (
    <SiteLayout>
      <Head>
        <title>Disputex — Waitlist Admin</title>
      </Head>
      <section className={styles.page}>
        <div className="container">
          <div className={styles.stack}>
            <div className={styles.header}>
              <h1>Waitlist</h1>
              <p className={styles.meta}>
                Total: {rows?.length || 0} • Updated: {new Date(createdAt).toLocaleString()}
              </p>
            </div>
            <div className={styles.actions}>
              <button className={styles.primary} onClick={() => copyEmails(rows)}>
                Copy emails
              </button>
              <button className={styles.secondary} onClick={() => downloadCSV(rows)}>
                Download CSV
              </button>
            </div>
            <div className={styles.tableWrap}>
              {rows?.length ? (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={index}>
                        <td>{row.email}</td>
                        <td>{new Date(row.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className={styles.empty}>No entries found.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}

function copyEmails(rows) {
  const txt = rows.map((r) => r.email).join(', ')
  navigator.clipboard
    .writeText(txt)
    .then(() => alert('Emails copied to clipboard'))
    .catch(() => alert('Copy failed — select and copy manually.'))
}

function downloadCSV(rows) {
  const header = 'email,created_at\n'
  const body = rows.map((r) => `${escapeCSV(r.email)},${escapeCSV(r.created_at)}`).join('\n')
  const blob = new Blob([header + body], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'waitlist.csv'
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function escapeCSV(value) {
  const str = value == null ? '' : String(value)
  return /[",\n]/.test(str) ? '"' + str.replace(/"/g, '""') + '"' : str
}
