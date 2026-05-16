import { useState } from 'react'
import { authenticatedFetch } from '../lib/auth'
import toast from 'react-hot-toast'

function DocGenerator() {
  const [code, setCode] = useState('')
  const [fileName, setFileName] = useState('')
  const [docType, setDocType] = useState('both')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)

  const handleGenerate = async (e) => {
    e.preventDefault()
    
    if (!code.trim()) {
      toast.error('Please enter some code to document')
      return
    }

    setLoading(true)
    setResponse(null)

    try {
      const res = await authenticatedFetch(
        `${import.meta.env.VITE_API_URL}/api/bob/document`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: code.trim(),
            fileName: fileName.trim() || 'code.js',
            docType,
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to generate documentation')
      }

      setResponse(data)
      toast.success('Documentation generated successfully!')
    } catch (error) {
      console.error('Documentation error:', error)
      toast.error(error.message || 'Failed to generate documentation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Documentation Generator</h1>
        <p className="text-gray-400">Generate comprehensive docs and tests with IBM Bob</p>
      </div>

      {/* Input Form */}
      <div className="card mb-8">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                File Name (Optional)
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="utils.js"
                className="w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ibm-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Generate
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-ibm-blue-500"
                disabled={loading}
              >
                <option value="both">Documentation + Tests</option>
                <option value="docs">Documentation Only</option>
                <option value="tests">Tests Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Code
            </label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              rows={12}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ibm-blue-500 font-mono text-sm"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-2">
              Paste your code and Bob will generate documentation and/or unit tests
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
                Generating with Bob...
              </span>
            ) : (
              '📝 Generate with IBM Bob'
            )}
          </button>
        </form>
      </div>

      {/* Bob's Response */}
      {response && response.data && (
        <div className="space-y-6">
          {/* Documentation */}
          {response.data.documentation && (
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-4">📚 Documentation</h2>
              <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm bg-dark-900 p-4 rounded-lg overflow-x-auto">
                {response.data.documentation}
              </pre>
            </div>
          )}

          {/* README */}
          {response.data.readme && (
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-4">📖 README Section</h2>
              <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {response.data.readme}
              </div>
            </div>
          )}

          {/* Tests */}
          {response.data.tests && (
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-4">🧪 Unit Tests</h2>
              <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm bg-dark-900 p-4 rounded-lg overflow-x-auto">
                {response.data.tests}
              </pre>
            </div>
          )}

          {/* Edge Cases */}
          {response.data.edgeCases && (
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-4">⚠️ Edge Cases to Consider</h2>
              <pre className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {response.data.edgeCases}
              </pre>
            </div>
          )}

          {/* Metrics */}
          {response.metrics && (
            <div className="card bg-green-500/10 border border-green-500/30">
              <h2 className="text-xl font-bold text-white mb-4">📈 Generation Metrics</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Lines Generated</p>
                  <p className="text-2xl font-bold text-green-400">{response.metrics.linesGenerated}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Tests Generated</p>
                  <p className="text-2xl font-bold text-green-400">{response.metrics.testsGenerated}</p>
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
          <h2 className="text-xl font-bold text-white mb-4">What Bob Can Generate</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-dark-800 rounded-lg">
              <h3 className="text-white font-semibold mb-2">📚 JSDoc Comments</h3>
              <p className="text-gray-400 text-sm">Comprehensive inline documentation with parameter descriptions and return types</p>
            </div>
            <div className="p-4 bg-dark-800 rounded-lg">
              <h3 className="text-white font-semibold mb-2">🧪 Unit Tests</h3>
              <p className="text-gray-400 text-sm">Complete test suites with edge cases and assertions</p>
            </div>
            <div className="p-4 bg-dark-800 rounded-lg">
              <h3 className="text-white font-semibold mb-2">📖 README Sections</h3>
              <p className="text-gray-400 text-sm">Usage examples and API documentation for your functions</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-ibm-blue-500/10 border border-ibm-blue-500/30 rounded-lg">
            <h3 className="text-ibm-blue-400 font-semibold mb-2">💡 Pro Tip</h3>
            <p className="text-gray-300 text-sm">
              For best results, provide clean, well-structured code. Bob can handle functions, classes, and modules in JavaScript, TypeScript, Python, and more!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default DocGenerator

// Made with Bob