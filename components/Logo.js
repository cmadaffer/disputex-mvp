export default function Logo(props) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      <defs>
        <linearGradient id="disputex-logo" x1="0" y1="0" x2="26" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60a5fa" />
          <stop offset="1" stopColor="#38bdf8" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="24" height="24" rx="6" stroke="url(#disputex-logo)" strokeWidth="2" fill="none" />
      <path
        d="M7 16c2.2-4.4 6.1-7.2 12-8-3.9 2.1-6.3 4.7-7.2 7.8 1.4-.6 3-.9 4.9-.9-2.7 1.6-5.2 2.5-7.7 2.6-1.9.1-3.1-.5-2-.5z"
        fill="url(#disputex-logo)"
      />
    </svg>
  )
}
