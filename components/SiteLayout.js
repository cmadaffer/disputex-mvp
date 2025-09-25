import Link from 'next/link'
import Logo from './Logo'
import styles from '../styles/Layout.module.css'

const navLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/#process', label: 'Process' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' }
]

export default function SiteLayout({ children }) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/" className={styles.brand}>
            <Logo className={styles.logo} />
            <span>Disputex</span>
          </Link>
          <nav className={styles.nav}>
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className={styles.navLink}>
                {label}
              </Link>
            ))}
            <Link href="/login" className={`${styles.navLink} ${styles.muted}`}>
              Login
            </Link>
            <Link href="/contact" className={styles.primary}>
              Book a call
            </Link>
          </nav>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerBrand}>
            <Logo className={styles.logo} />
            <span>Disputex</span>
          </div>
          <div className={styles.footerLinks}>
            {navLinks.slice(0, 3).map(({ href, label }) => (
              <Link key={href} href={href} className={styles.navLink}>
                {label}
              </Link>
            ))}
            <Link href="/login" className={styles.navLink}>
              Client login
            </Link>
          </div>
          <p className={styles.fine}>© {new Date().getFullYear()} Disputex. Chargeback operations, not legal advice.</p>
        </div>
      </footer>
    </div>
  )
}
