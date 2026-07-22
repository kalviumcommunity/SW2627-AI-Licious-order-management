export default function BackButton({ className = '', onClick }) {
  const handle = onClick || (() => window.history.back())
  return (
    <button
      type="button"
      onClick={handle}
      className={`inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 ${className}`}
      aria-label="Go back"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
      </svg>
      Back
    </button>
  )
}
