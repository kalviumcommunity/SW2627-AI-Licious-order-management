import { useEffect, useState } from 'react'
import meatHero from '../assets/meat_hero_transparent.png'
import supabase, { isSupabaseConfigured } from '../lib/supabase'

const RESET_EMAIL_COOLDOWN_MS = 60 * 1000

const getResetCooldownKey = (email) => `licious-reset-cooldown:${email.trim().toLowerCase()}`

const getRemainingResetCooldown = (email) => {
  if (typeof window === 'undefined' || !email) return 0

  const expiresAt = Number(window.localStorage.getItem(getResetCooldownKey(email)))
  return Number.isFinite(expiresAt) ? Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)) : 0
}

const getAuthErrorMessage = (authError, fallbackMessage) => {
  const message = authError?.message

  if (typeof message === 'string' && message.trim() && message.trim() !== '{}') {
    return message
  }

  if (message && typeof message === 'object' && typeof message.message === 'string') {
    return message.message
  }

  return fallbackMessage
}

// Licious Logo — drop your logo.png into the public/ folder
function LiciousLogo({ className = '', invert = false, src = '/logo.png' }) {
  return (
    <div className="flex items-center">
      <img
        src={src}
        alt="Licious"
        className={`${className} w-auto object-contain ${invert ? 'brightness-0 invert' : ''}`}
      />
    </div>
  )
}

// Shield Icon
function ShieldIcon() {
  return (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  )
}

// Snowflake Icon
function SnowflakeIcon() {
  return (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18M5.636 5.636l12.728 12.728M18.364 5.636 5.636 18.364" />
    </svg>
  )
}

// Heart Icon
function HeartIcon() {
  return (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  )
}

// Email Icon
function EmailIcon() {
  return (
    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 8.586 5.414a2 2 0 0 0 2.828 0L22 7" />
    </svg>
  )
}

// Lock Icon
function LockIcon() {
  return (
    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

// Eye Off Icon
function EyeOffIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20" />
    </svg>
  )
}

// Eye Icon
function EyeIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export default function LoginPage({
  onLogin,
  isPasswordRecovery = false,
  recoveryError = '',
  isSupabaseConfigured: hasSupabaseConfig = isSupabaseConfigured
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [resetCooldownSeconds, setResetCooldownSeconds] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (resetCooldownSeconds <= 0) return undefined

    const interval = window.setInterval(() => {
      setResetCooldownSeconds(getRemainingResetCooldown(email))
    }, 1000)

    return () => window.clearInterval(interval)
  }, [email, resetCooldownSeconds])

  const startResetCooldown = () => {
    const expiresAt = Date.now() + RESET_EMAIL_COOLDOWN_MS
    window.localStorage.setItem(getResetCooldownKey(email), String(expiresAt))
    setResetCooldownSeconds(Math.ceil(RESET_EMAIL_COOLDOWN_MS / 1000))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!supabase || !hasSupabaseConfig) {
      setError('Supabase is not configured yet. Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the admin .env file.')
      return
    }

    if (isPasswordRecovery) {
      if (!password || password.length < 6) {
        setError('Please enter a new password with at least 6 characters.')
        return
      }

      if (password !== confirmPassword) {
        setError('The new passwords do not match.')
        return
      }

      setIsLoading(true)
      setError('')
      const { error: authError } = await supabase.auth.updateUser({ password })
      setIsLoading(false)

      if (authError) {
        setError(getAuthErrorMessage(authError, 'Unable to update your password. Please try again.'))
        return
      }

      setMessage('Your password has been updated. Redirecting to your dashboard...')
      window.setTimeout(() => {
        window.location.assign('/')
      }, 1000)
      return
    }

    if (isForgotPassword) {
      if (!email) {
        setError('Please enter your email address.')
        return
      }

      const remainingCooldown = getRemainingResetCooldown(email)
      if (remainingCooldown > 0) {
        setResetCooldownSeconds(remainingCooldown)
        setMessage(`Please wait ${remainingCooldown} seconds before requesting another reset link.`)
        return
      }

      setIsLoading(true)
      setError('')
      setMessage('')
      const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo
      })
      setIsLoading(false)

      if (authError) {
        if (authError.code === 'over_email_send_rate_limit') {
          startResetCooldown()
          setError('Too many reset emails were requested. Please wait a minute before trying again.')
          return
        }

        setError(getAuthErrorMessage(authError, 'Unable to send the reset link. Check the SMTP sender address and API key in Supabase.'))
        return
      }

      startResetCooldown()
      setMessage('If an account exists for this email, a password reset link has been sent.')
      return
    }

    if (!email || !password) {
      setError('Please enter both your email and password.')
      return
    }

    setIsLoading(true)
    setError('')
    setMessage('')

    const action = isSignUp
      ? supabase.auth.signUp({ email, password })
      : supabase.auth.signInWithPassword({ email, password })

    const { error: authError } = await action

    setIsLoading(false)

    if (authError) {
      setError(getAuthErrorMessage(authError, 'Authentication failed. Please try again.'))
      return
    }

    if (isSignUp) {
      setMessage('Account created. Please check your inbox and confirm your email if required.')
      setPassword('')
      setIsSignUp(false)
      return
    }

    onLogin?.()
  }

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-[#f3f7fb] font-[Inter,system-ui,sans-serif]">

      {/* ── LEFT PANEL ── */}
      <div className="relative hidden md:flex md:w-[44%] flex-col bg-[#e32929] text-white overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#e32929]/20" />
        <div className="absolute -top-6 -right-6 w-56 h-56 rounded-[48px] bg-[#e32929]/40" />

        <div className="relative z-10 flex h-full flex-col px-10 py-10">
          <div className="mb-10">
            <LiciousLogo className="h-20 block" src="/logo_white.png" />
          </div>

          <div className="max-w-xs">
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
              Real Good.<br />Admin Access.
            </h1>
            <p className="mt-5 text-sm text-red-100 leading-relaxed">
              Welcome to the Licious Admin Portal. Manage orders, customers, inventory and more — all in one place.
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <div className="rounded-[24px] bg-[#e32929] p-2 shadow-[0_12px_30px_rgba(0,0,0,0.16)]">
              <img
                src={meatHero}
                alt="Fresh premium meat"
                className="w-80 object-contain"
              />
            </div>
          </div>

          <div className="mt-auto rounded-[28px] bg-[#c41f1f] p-6 shadow-[0_12px_30px_rgba(0,0,0,0.16)]">
            <div className="grid grid-cols-3 gap-4 text-center text-xs font-semibold text-white">
              <div className="flex flex-col items-center gap-2">
                <ShieldIcon />
                <span>Trusted Quality</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <SnowflakeIcon />
                <span>Freshly Made</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <HeartIcon />
                <span>Hygienically Packed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex flex-1 items-center justify-center px-6 py-10 md:px-14">
        <div className="w-full max-w-[470px]">
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <LiciousLogo className="h-20" src="/logo.png?v=3" />
            <h2 className="text-3xl font-bold text-gray-900">
              {isPasswordRecovery ? 'Set New Password' : isForgotPassword ? 'Reset Password' : isSignUp ? 'Create Admin Account' : 'Admin Login'}
            </h2>
            <p className="text-sm text-gray-500">
              {isPasswordRecovery ? 'Choose a new password for your account' : isForgotPassword ? 'We’ll email you a secure reset link' : isSignUp ? 'Register a new admin account' : 'Access your admin dashboard'}
            </p>
          </div>

          <div className="overflow-hidden rounded-[30px] border border-black/10 bg-white p-8 shadow-[0_25px_90px_rgba(15,23,42,0.08)]">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error || recoveryError ? (
                <div className="rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error || recoveryError}
                </div>
              ) : null}

              {message ? (
                <div className="rounded-[16px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {message}
                </div>
              ) : null}

              <>
                {!isPasswordRecovery && (
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center gap-3 rounded-[18px] border border-gray-200 bg-white px-4 py-3 focus-within:border-[#e32929] focus-within:ring-1 focus-within:ring-[#e32929]/20">
                      <EmailIcon />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full border-none bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
                      />
                    </div>
                  </div>
                )}

                  {(!isForgotPassword || isPasswordRecovery) && (
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      {isPasswordRecovery ? 'New Password' : 'Password'}
                    </label>
                    <div className="flex items-center gap-3 rounded-[18px] border border-gray-200 bg-white px-4 py-3 focus-within:border-[#e32929] focus-within:ring-1 focus-within:ring-[#e32929]/20">
                      <LockIcon />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={isPasswordRecovery ? 'Enter your new password' : 'Enter your password'}
                        autoComplete={isPasswordRecovery ? 'new-password' : 'current-password'}
                        className="w-full border-none bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                      </button>
                    </div>
                  </div>
                  )}

                  {isPasswordRecovery && (
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="flex items-center gap-3 rounded-[18px] border border-gray-200 bg-white px-4 py-3 focus-within:border-[#e32929] focus-within:ring-1 focus-within:ring-[#e32929]/20">
                        <LockIcon />
                        <input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter your new password"
                          autoComplete="new-password"
                          className="w-full border-none bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    id="login-btn"
                    type="submit"
                    disabled={isLoading || (isForgotPassword && resetCooldownSeconds > 0)}
                    className="w-full rounded-[18px] bg-[#e32929] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(227,41,41,0.22)] transition hover:bg-[#c41f1f] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isLoading
                      ? 'Please wait...'
                      : isPasswordRecovery
                        ? 'Update Password'
                        : isForgotPassword && resetCooldownSeconds > 0
                          ? `Try again in ${resetCooldownSeconds}s`
                          : isForgotPassword
                            ? 'Send Reset Link'
                            : isSignUp
                              ? 'Sign Up'
                              : 'Login'}
                  </button>

                  {!isForgotPassword && !isPasswordRecovery && <button
                    type="button"
                    onClick={() => {
                      setIsSignUp((value) => !value)
                      setError('')
                      setMessage('')
                    }}
                    className="w-full text-sm font-semibold text-[#e32929] hover:underline"
                  >
                    {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
                  </button>}

                  {!isSignUp && !isForgotPassword && !isPasswordRecovery && <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true)
                      setResetCooldownSeconds(getRemainingResetCooldown(email))
                      setError('')
                      setMessage('')
                    }}
                    className="w-full text-sm font-semibold text-[#e32929] hover:underline"
                  >
                    Forgot password?
                  </button>}

                  {isForgotPassword && !isPasswordRecovery && <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false)
                      setError('')
                      setMessage('')
                    }}
                    className="w-full text-sm font-semibold text-gray-500 hover:underline"
                  >
                    Back to login
                  </button>}
              </>
            </form>
          </div>

          <p className="mt-8 text-center text-xs text-gray-400">
            © 2026 <span className="font-semibold text-[#e32929]">Licious</span>. All rights reserved
          </p>
        </div>
      </div>
    </div>
  )
}
