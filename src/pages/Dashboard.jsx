import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { authenticatedFetch } from '../lib/auth'
import toast from 'react-hot-toast'

function Dashboard() {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const response = await authenticatedFetch(
        `${import.meta.env.VITE_API_URL}/api/sessions/metrics`
      )
      
      if (response.ok) {
        const data = await response.json()
        setMetrics(data)
      } else {
        // If no metrics exist yet, show zeros
        setMetrics({
          total_sessions: 0,
          total_lines: 0,
          total_tests: 0,
          total_tasks: 0
        })
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
      setMetrics({
        total_sessions: 0,
        total_lines: 0,
        total_tests: 0,
        total_tasks: 0
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-white">Loading metrics...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome to DevSync AI - Powered by IBM Bob</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Sessions</p>
              <p className="text-3xl font-bold text-white">{metrics?.total_sessions || 0}</p>
            </div>
            <div className="w-12 h-12 bg-ibm-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-ibm-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Lines Generated</p>
              <p className="text-3xl font-bold text-white">{metrics?.total_lines || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Tests Generated</p>
              <p className="text-3xl font-bold text-white">{metrics?.total_tests || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Tasks Automated</p>
              <p className="text-3xl font-bold text-white">{metrics?.total_tasks || 0}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/onboarder" className="p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors">
            <h3 className="text-white font-semibold mb-2">🚀 Onboard Repository</h3>
            <p className="text-gray-400 text-sm">Analyze and understand any codebase with IBM Bob</p>
          </Link>
          <Link to="/doc-generator" className="p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors">
            <h3 className="text-white font-semibold mb-2">📝 Generate Docs</h3>
            <p className="text-gray-400 text-sm">Create documentation and tests automatically</p>
          </Link>
          <Link to="/task-automator" className="p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors">
            <h3 className="text-white font-semibold mb-2">⚡ Automate Tasks</h3>
            <p className="text-gray-400 text-sm">Let Bob handle repetitive coding tasks</p>
          </Link>
        </div>
      </div>

      {/* Getting Started */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-4">Getting Started with IBM Bob</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-ibm-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
              1
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Onboard Your Repository</h3>
              <p className="text-gray-400 text-sm">Start by analyzing your codebase. Bob will understand your project structure and provide insights.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-ibm-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
              2
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Generate Documentation</h3>
              <p className="text-gray-400 text-sm">Let Bob create comprehensive documentation and unit tests for your code.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-ibm-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
              3
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Automate Repetitive Tasks</h3>
              <p className="text-gray-400 text-sm">Use Bob to refactor code, convert patterns, and handle tedious development tasks.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

// Made with Bob