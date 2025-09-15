import Head from 'next/head'

export async function getServerSideProps(ctx){
  const { query } = ctx
  const ADMIN_KEY = process.env.ADMIN_KEY || ''
  const providedKey = (query.key || '').toString()

  // Simple gate: require ?key=...
  if (!ADMIN_KEY || providedKey !== ADMIN_KEY){
    return { props: { ok:false, rows:[], createdAt: new Date().toISOString() } }
  }

  const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/+$/, '')
  const KEY = process.env.SUPABASE_SERVICE_ROLE || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  let rows = []
  try {
    if (SUPABASE_URL && KEY){
      const resp = await fetch(`${SUPABASE_URL}/rest/v1/waitlist?select=email,created_at&order=created_at.desc`, {
        headers: { apikey: KEY, authorization: `Bearer ${KEY}` }
      })
      if (resp.ok) rows = await resp.json()
      else console.error('Fetch waitlist failed', await resp.text())
    }
  } catch (e){ console.error('Admin fetch error', e) }

  return { props: { ok:true, rows, createdAt: new Date().toISOString() } }
}

export default function Admin({ ok, rows, createdAt }){
  if (!ok){
    return (
      <main style={{fontFamily:'ui-sans-serif, system-ui', padding:'2rem'}}> 
        <h1>Forbidden</h1>
        <p>Add <code>?key=YOUR_ADMIN_KEY</code> to the URL, and set <code>ADMIN_KEY</code> in your Render environment.</p>
      </main>
    )
  }

  return (
    <>
      <Head><title>Disputex — Waitlist Admin</title></Head>
      <main className="container" style={{padding:'2rem 0'}}>
        <h1>Waitlist</h1>
        <p className="fine">Total: {rows?.length || 0} • Updated: {new Date(createdAt).toLocaleString()}</p>

        <div className="actions">
          <button className="btn" onClick={() => copyEmails(rows)}>Copy emails</button>
          <button className="btn ghost" onClick={() => downloadCSV(rows)}>Download CSV</button>
        </div>

        <div className="tableWrap">
          <table className="tbl">
            <thead>
              <tr><th>Email</th><th>Created</th></tr>
            </thead>
            <tbody>
              {rows?.map((r, i) => (
                <tr key={i}><td>{r.email}</td><td>{new Date(r.created_at).toLocaleString()}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <style jsx global>{`
        :root { --bg:#070a0f; --panel:rgba(255,255,255,.06); --panel-strong:rgba(255,255,255,.12); --text:#e7ebf3; --muted:#a6b0c3; --accent:#7dd3fc; --accent2:#60a5fa; }
        body{background:var(--bg);color:var(--text);font-family:ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, 'Helvetica Neue', Arial}
        .container{width:min(900px,92vw);margin:0 auto}
        h1{margin:0 0 .8rem}
        .fine{color:var(--muted)}
        .actions{display:flex;gap:.6rem;margin:1rem 0}
        .btn{display:inline-flex;align-items:center;gap:.5rem;padding:.7rem 1rem;border-radius:999px;background:linear-gradient(90deg,var(--accent),var(--accent2));color:#051224;font-weight:800;border:none;cursor:pointer}
        .btn.ghost{background:transparent;color:var(--text);border:1px solid var(--panel-strong)}
        .tableWrap{margin-top:1rem;background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.03));border:1px solid rgba(255,255,255,.1);border-radius:14px;overflow:hidden}
        .tbl{width:100%;border-collapse:collapse}
        .tbl th,.tbl td{padding:.8rem;border-bottom:1px solid rgba(255,255,255,.08)}
        .tbl th{text-align:left;background:rgba(255,255,255,.04)}
      `}</style>
    </>
  )
}

function copyEmails(rows){
  const txt = rows.map(r=>r.email).join(', ')
  navigator.clipboard.writeText(txt)
    .then(()=>alert('Emails copied to clipboard'))
    .catch(()=>alert('Copy failed — select and copy manually.'))
}

function downloadCSV(rows){
  const header = 'email,created_at\n'
  const body = rows.map(r => `${escapeCSV(r.email)},${escapeCSV(r.created_at)}`).join('\n')
  const blob = new Blob([header + body], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'waitlist.csv'; a.click()
  setTimeout(()=>URL.revokeObjectURL(url), 1000)
}

function escapeCSV(v){
  const s = (v==null? '' : String(v))
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g,'""') + '"' : s
}
