import { useState } from 'react'
import { authenticatedFetch } from '../lib/auth'
import toast from 'react-hot-toast'

function CodeOnboarder() {
  const [repoUrl, setRepoUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)

  const handleAnalyze = async (e) => {
    e.preventDefault()
    
    if (!repoUrl.trim()) {
      toast.error('Please enter a repository URL')
      return
    }

    setLoading(true)
    setResponse(null)

    try {
      const res = await authenticatedFetch(
        `${import.meta.env.VITE_API_URL}/api/bob/onboard`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ repoUrl: repoUrl.trim() }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to analyze repository')
      }

      setResponse(data)
      toast.success('Repository analyzed successfully!')
    } catch (error) {
      console.error('Onboarding error:', error)
      toast.error(error.message || 'Failed to analyze repository')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Code Onboarder</h1>
        <p className="text-gray-400">Analyze and understand any codebase with IBM Bob</p>
      </div>

      {/* Input Form */}
      <div className="card mb-8">
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Repository URL or Path
            </label>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repository or /path/to/local/repo"
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ibm-blue-500"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-2">
              Enter a GitHub URL or local repository path to analyze
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing with Bob...
              </span>
            ) : (
              '🤖 Analyze with IBM Bob'
            )}
          </button>
        </form>
      </div>

      {/* Bob's Response */}
      {response && response.data && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">📊 Project Summary</h2>
            <p className="text-gray-300 leading-relaxed">{response.data.summary}</p>
          </div>

          {/* Getting Started */}
          {response.data.gettingStarted && (
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-4">🚀 Getting Started</h2>
              <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm bg-dark-900 p-4 rounded-lg">
                {response.data.gettingStarted}
              </pre>
            </div>
          )}

          {/* Key Files */}
          {response.data.keyFiles && response.data.keyFiles.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-4">📁 Key Files</h2>
              <div className="space-y-3">
                {response.data.keyFiles.map((file, index) => (
                  <div key={index} className="p-3 bg-dark-800 rounded-lg">
                    <p className="text-ibm-blue-400 font-mono text-sm mb-1">{file.path}</p>
                    <p className="text-gray-400 text-sm">{file.purpose}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Architecture */}
          {response.data.architecture && (
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-4">🏗️ Architecture</h2>
              <pre className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {response.data.architecture}
              </pre>
            </div>
          )}

          {/* Metrics */}
          {response.metrics && (
            <div className="card bg-ibm-blue-500/10 border border-ibm-blue-500/30">
              <h2 className="text-xl font-bold text-white mb-4">📈 Analysis Metrics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Lines Generated</p>
                  <p className="text-2xl font-bold text-ibm-blue-400">{response.metrics.linesGenerated}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Session ID</p>
                  <p className="text-sm font-mono text-gray-300">{response.sessionId.substring(0, 8)}...</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Features Info */}
      {!response && (
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4">What Bob Can Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-dark-800 rounded-lg">
              <h3 className="text-white font-semibold mb-2">📊 Project Overview</h3>
              <p className="text-gray-400 text-sm">Get a comprehensive summary of the codebase structure and purpose</p>
            </div>
            <div className="p-4 bg-dark-800 rounded-lg">
              <h3 className="text-white font-semibold mb-2">🏗️ Architecture Analysis</h3>
              <p className="text-gray-400 text-sm">Understand the project architecture and design patterns used</p>
            </div>
            <div className="p-4 bg-dark-800 rounded-lg">
              <h3 className="text-white font-semibold mb-2">📁 Key Files Identification</h3>
              <p className="text-gray-400 text-sm">Discover the most important files and their purposes</p>
            </div>
            <div className="p-4 bg-dark-800 rounded-lg">
              <h3 className="text-white font-semibold mb-2">🔍 Technology Stack</h3>
              <p className="text-gray-400 text-sm">Identify frameworks, libraries, and tools used in the project</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CodeOnboarder

// Made with Bob