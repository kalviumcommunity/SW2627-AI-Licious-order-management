import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import supabase, { isSupabaseConfigured } from './lib/supabase'

function App() {
  const [user, setUser] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    if (!supabase) {
      queueMicrotask(() => {
        if (isMounted) {
          setIsAuthLoading(false)
        }
      })
      return () => {
        isMounted = false
      }
    }


    const initializeSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (!isMounted) return

      if (error) {
        console.error('Supabase session error:', error)
      }

      setUser(session?.user ?? null)
      setIsAuthLoading(false)
    }

    initializeSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return

      setUser(nextSession?.user ?? null)
      setIsAuthLoading(false)
    })

    return () => {
      isMounted = false
      subscription?.unsubscribe?.()
    }
  }, [])

  const handleSignOut = async () => {
    if (!supabase) {
      setUser(null)
      return
    }

    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Failed to sign out:', error)
    }

    setUser(null)
  }

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f7fb]">
        <div className="flex flex-col items-center gap-3 text-[#e32929]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e32929]/20 border-t-[#e32929]" />
          <p className="text-sm font-medium text-gray-600">Checking your session...</p>
        </div>
      </div>
    )
  }

  return user ? (
    <Routes>
      <Route path="/" element={<DashboardPage user={user} onLogout={handleSignOut} activeTab="dashboard" />} />
      <Route path="/live-orders" element={<DashboardPage user={user} onLogout={handleSignOut} activeTab="live-orders" />} />
      <Route path="/completed-orders" element={<DashboardPage user={user} onLogout={handleSignOut} activeTab="completed-orders" />} />
      <Route path="/users" element={<DashboardPage user={user} onLogout={handleSignOut} activeTab="users" />} />
      <Route path="/products" element={<DashboardPage user={user} onLogout={handleSignOut} activeTab="products" />} />
      <Route path="/inventory" element={<DashboardPage user={user} onLogout={handleSignOut} activeTab="inventory" />} />
      <Route path="/offers" element={<DashboardPage user={user} onLogout={handleSignOut} activeTab="offers" />} />
      <Route path="/reports" element={<DashboardPage user={user} onLogout={handleSignOut} activeTab="reports" />} />
      <Route path="/settings" element={<DashboardPage user={user} onLogout={handleSignOut} activeTab="settings" />} />
      <Route path="/order/:id" element={<DashboardPage user={user} onLogout={handleSignOut} activeTab="order-details" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  ) : (
    <LoginPage onLogin={() => setIsAuthLoading(false)} isSupabaseConfigured={isSupabaseConfigured} />
  )
}

export default App
