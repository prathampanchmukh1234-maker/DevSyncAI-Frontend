import { useState } from 'react'
import { authenticatedFetch } from '../lib/auth'
import toast from 'react-hot-toast'

function TaskAutomator() {
  const [code, setCode] = useState('')
  const [task, setTask] = useState('')
  const [taskType, setTaskType] = useState('refactor')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)

  const handleAutomate = async (e) => {
    e.preventDefault()
    
    if (!code.trim() || !task.trim()) {
      toast.error('Please provide both code and task description')
      return
    }

    setLoading(true)
    setResponse(null)

    try {
      const res = await authenticatedFetch(
        `${import.meta.env.VITE_API_URL}/api/bob/automate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: code.trim(),
            task: task.trim(),
            taskType,
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to automate task')
      }

      setResponse(data)
      toast.success('Task automated successfully!')
    } catch (error) {
      console.error('Automation error:', error)
      toast.error(error.message || 'Failed to automate task')
    } finally {
      setLoading(false)
    }
  }

  const taskExamples = {
    refactor: 'Convert callback functions to async/await',
    convert: 'Convert REST API calls to GraphQL',
    optimize: 'Optimize this function for better performance',
    modernize: 'Update to use modern ES6+ syntax',
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Task Automator</h1>
        <p className="text-gray-400">Automate repetitive coding tasks with IBM Bob</p>
      </div>

      {/* Input Form */}
      <div className="card mb-8">
        <form onSubmit={handleAutomate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Task Type
            </label>
            <select
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
              className="w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-ibm-blue-500"
              disabled={loading}
            >
              <option value="refactor">Refactor Code</option>
              <option value="convert">Convert Pattern</option>
              <option value="optimize">Optimize Performance</option>
              <option value="modernize">Modernize Syntax</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Task Description
            </label>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder={taskExamples[taskType]}
              className="w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ibm-blue-500"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-2">
              Describe what you want Bob to do with your code
            </p>
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
                Automating with Bob...
              </span>
            ) : (
              '⚡ Automate with IBM Bob'
            )}
          </button>
        </form>
      </div>

      {/* Bob's Response */}
      {response && response.data && (
        <div className="space-y-6">
          {/* Result Code */}
          {response.data.result && (
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-4">✨ Transformed Code</h2>
              <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm bg-dark-900 p-4 rounded-lg overflow-x-auto">
                {response.data.result}
              </pre>
            </div>
          )}

          {/* Explanation */}
          {response.data.explanation && (
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-4">💡 What Changed</h2>
              <p className="text-gray-300 leading-relaxed">{response.data.explanation}</p>
            </div>
          )}

          {/* Changes List */}
          {response.data.changes && response.data.changes.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-4">📝 Changes Made</h2>
              <ul className="space-y-2">
                {response.data.changes.map((change, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-gray-300">{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Metrics */}
          {response.metrics && (
            <div className="card bg-yellow-500/10 border border-yellow-500/30">
              <h2 className="text-xl font-bold text-white mb-4">📈 Automation Metrics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Lines Generated</p>
                  <p className="text-2xl font-bold text-yellow-400">{response.metrics.linesGenerated}</p>
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
          <h2 className="text-xl font-bold text-white mb-4">What Bob Can Automate</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-dark-800 rounded-lg">
              <h3 className="text-white font-semibold mb-2">🔄 Code Refactoring</h3>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Extract functions and methods</li>
                <li>• Simplify complex logic</li>
                <li>• Remove code duplication</li>
                <li>• Improve code readability</li>
              </ul>
            </div>
            <div className="p-4 bg-dark-800 rounded-lg">
              <h3 className="text-white font-semibold mb-2">🔀 Pattern Conversion</h3>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Callbacks to Promises/Async-Await</li>
                <li>• Class components to Hooks</li>
                <li>• REST to GraphQL</li>
                <li>• CommonJS to ES Modules</li>
              </ul>
            </div>
            <div className="p-4 bg-dark-800 rounded-lg">
              <h3 className="text-white font-semibold mb-2">⚡ Performance Optimization</h3>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Optimize loops and iterations</li>
                <li>• Add memoization</li>
                <li>• Reduce complexity</li>
                <li>• Improve algorithm efficiency</li>
              </ul>
            </div>
            <div className="p-4 bg-dark-800 rounded-lg">
              <h3 className="text-white font-semibold mb-2">🆕 Syntax Modernization</h3>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• ES6+ features (arrow functions, destructuring)</li>
                <li>• Optional chaining and nullish coalescing</li>
                <li>• Template literals</li>
                <li>• Modern array methods</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <h3 className="text-yellow-400 font-semibold mb-2">⚠️ Important</h3>
            <p className="text-gray-300 text-sm">
              Always review Bob's automated changes before applying them to production code. While Bob is highly accurate, human oversight ensures the best results.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskAutomator

// Made with Bob