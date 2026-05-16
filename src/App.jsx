import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { login, signup, logout, getCurrentUser, getStoredUser, isAuthenticated } from './lib/auth'
import Sidebar from './components/Sidebar'

// Import page components
import Dashboard from './pages/Dashboard'
import CodeOnboarder from './pages/CodeOnboarder'
import DocGenerator from './pages/DocGenerator'
import TaskAutomator from './pages/TaskAutomator'
import ExportReport from './pages/ExportReport'

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignup, setIsSignup] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignup) {
        // Signup
        const data = await signup(email, password, name)
        toast.success('Account created successfully!')
        onLoginSuccess(data.user)
      } else {
        // Login
        const data = await login(email, password)
        toast.success('Login successful!')
        onLoginSuccess(data.user)
      }
    } catch (error) {
      toast.error(error.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">DevSync AI</h1>
          <p className="text-gray-400">Powered by IBM Bob</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required={isSignup}
                className="w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ibm-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ibm-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ibm-blue-500"
            />
            {isSignup && (
              <p className="text-xs text-gray-500 mt-1">
                Minimum 6 characters
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-ibm-blue-400 hover:text-ibm-blue-300 text-sm"
          >
            {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated on mount
    const initAuth = async () => {
      if (isAuthenticated()) {
        // Try to get stored user first for instant UI
        const storedUser = getStoredUser()
        if (storedUser) {
          setUser(storedUser)
        }

        // Then verify with backend
        try {
          const currentUser = await getCurrentUser()
          setUser(currentUser)
        } catch (error) {
          console.error('Auth check failed:', error)
          setUser(null)
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const handleLoginSuccess = (userData) => {
    setUser(userData)
  }

  const handleSignOut = async () => {
    try {
      await logout()
      setUser(null)
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Logout failed')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <Login onLoginSuccess={handleLoginSuccess} />
        <Toaster position="top-right" />
      </>
    )
  }

  return (
    <Router>
      <div className="flex h-screen bg-dark-950">
        <Sidebar user={user} onSignOut={handleSignOut} />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/onboarder" element={<CodeOnboarder />} />
            <Route path="/doc-generator" element={<DocGenerator />} />
            <Route path="/task-automator" element={<TaskAutomator />} />
            <Route path="/export" element={<ExportReport />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <Toaster position="top-right" />
    </Router>
  )
}

export default App

// Made with Bob
