import { useState } from 'react'
import meatHero from '../assets/meat_hero.png'

// Licious Logo — drop your logo.png into the public/ folder
function LiciousLogo({ className = '', invert = false }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/logo.png"
        alt="Licious"
        className={`h-10 w-auto object-contain ${invert ? 'brightness-0 invert' : ''}`}
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

// OTP Icon
function OtpIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="flex h-screen w-screen overflow-hidden font-[Inter,system-ui,sans-serif]">

        {/* ── LEFT PANEL ── */}
        <div className="relative hidden md:flex md:w-[42%] flex-col bg-[#e32929] overflow-hidden">

          {/* Top white curve cutout */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-bl-[80px]" />

          {/* Logo */}
          <div className="relative z-10 pt-8 pl-8">
            <LiciousLogo invert={true} />
          </div>

          {/* Headline */}
          <div className="relative z-10 mt-10 px-8">
            <h1 className="text-white text-4xl font-extrabold leading-tight tracking-tight">
              Real Good.<br />Admin Access.
            </h1>
            <p className="text-red-100 text-sm mt-4 leading-relaxed max-w-xs">
              Welcome to the Licious Admin Portal. Manage orders, customers,
              inventory and more — all in one place.
            </p>
          </div>

          {/* Meat Hero Image */}
          <div className="relative z-10 flex justify-center mt-6 px-4">
            <img
              src={meatHero}
              alt="Fresh premium meat"
              className="w-72 drop-shadow-2xl object-contain"
            />
          </div>

          {/* Dark bottom bar with quality badges */}
          <div className="relative z-10 mt-auto bg-[#c41f1f] px-6 py-5">
            <div className="flex items-center justify-between text-white text-xs">
              <div className="flex flex-col items-center gap-1">
                <ShieldIcon />
                <span className="font-semibold text-center leading-tight">Trusted<br />Quality</span>
              </div>
              <div className="w-px h-10 bg-red-300 opacity-50" />
              <div className="flex flex-col items-center gap-1">
                <SnowflakeIcon />
                <span className="font-semibold text-center leading-tight">Freshly<br />Made</span>
              </div>
              <div className="w-px h-10 bg-red-300 opacity-50" />
              <div className="flex flex-col items-center gap-1">
                <HeartIcon />
                <span className="font-semibold text-center leading-tight">Hygenically<br />Packed</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 bg-white flex flex-col items-center justify-center px-8 py-12 md:px-14">

          {/* Logo for right side */}
          <div className="mb-2">
            <LiciousLogo />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mt-1">Admin Login</h2>
          <p className="text-gray-500 text-sm mt-1 mb-8">Access your admin dashboard</p>

          {/* Form Card */}
          <div className="w-full max-w-sm border border-gray-200 rounded-xl p-7 shadow-sm">

            {/* Email Field */}
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 gap-2 focus-within:border-[#e32929] focus-within:ring-1 focus-within:ring-[#e32929] transition-all">
                <EmailIcon />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 gap-2 focus-within:border-[#e32929] focus-within:ring-1 focus-within:ring-[#e32929] transition-all">
                <LockIcon />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end mb-6">
              <button
                type="button"
                className="text-xs text-[#e32929] hover:underline transition-all"
              >
                Forgot password ?
              </button>
            </div>

            {/* Login Button */}
            <button
              id="login-btn"
              type="button"
              className="w-full bg-[#e32929] hover:bg-[#c41f1f] active:bg-[#a81a1a] text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm tracking-wide"
            >
              Login
            </button>

            {/* OR Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Login with OTP Button */}
            <button
              id="login-otp-btn"
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-[#e32929] text-[#e32929] hover:bg-red-50 active:bg-red-100 font-semibold py-3 rounded-lg transition-all duration-200 text-sm tracking-wide"
            >
              <OtpIcon />
              Login With OTP
            </button>
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-400 mt-8">
            © 2026{' '}
            <span className="text-[#e32929] font-medium">Licious</span>
            {' '}. All rights reserved
          </p>
        </div>
    </div>
  )
}
