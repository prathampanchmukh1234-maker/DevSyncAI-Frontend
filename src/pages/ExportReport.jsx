import { useState } from 'react'
import { authenticatedFetch } from '../lib/auth'
import toast from 'react-hot-toast'

function ExportReport() {
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState(null)

  const handleExport = async (format = 'json') => {
    setLoading(true)

    try {
      const res = await authenticatedFetch(
        `${import.meta.env.VITE_API_URL}/api/export/report?format=${format}`
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to generate report')
      }

      setReportData(data)

      // Download the report
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `devsync-bob-report-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('Report exported successfully!')
    } catch (error) {
      console.error('Export error:', error)
      toast.error(error.message || 'Failed to export report')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyToClipboard = () => {
    if (reportData) {
      navigator.clipboard.writeText(JSON.stringify(reportData, null, 2))
      toast.success('Report copied to clipboard!')
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Export Report</h1>
        <p className="text-gray-400">Download your IBM Bob activity report</p>
      </div>

      {/* Export Options */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Generate Report</h2>
        <p className="text-gray-400 mb-6">
          Export a comprehensive report of all your IBM Bob interactions, including metrics, sessions, and generated content.
        </p>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => handleExport('json')}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              '📥 Export as JSON'
            )}
          </button>

          {reportData && (
            <button
              onClick={handleCopyToClipboard}
              className="px-6 py-2 bg-dark-800 text-white rounded-lg hover:bg-dark-700 transition-colors"
            >
              📋 Copy to Clipboard
            </button>
          )}
        </div>
      </div>

      {/* Report Preview */}
      {reportData && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Report Preview</h2>
            <span className="text-sm text-gray-400">
              Generated: {new Date().toLocaleString()}
            </span>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-dark-800 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Total Sessions</p>
              <p className="text-2xl font-bold text-white">{reportData.summary?.totalSessions || 0}</p>
            </div>
            <div className="p-4 bg-dark-800 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Lines Generated</p>
              <p className="text-2xl font-bold text-white">{reportData.summary?.totalLinesGenerated || 0}</p>
            </div>
            <div className="p-4 bg-dark-800 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Tests Created</p>
              <p className="text-2xl font-bold text-white">{reportData.summary?.totalTestsGenerated || 0}</p>
            </div>
            <div className="p-4 bg-dark-800 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Tasks Automated</p>
              <p className="text-2xl font-bold text-white">{reportData.summary?.totalTasksAutomated || 0}</p>
            </div>
          </div>

          {/* JSON Preview */}
          <div className="bg-dark-900 rounded-lg p-4 overflow-auto max-h-96">
            <pre className="text-gray-300 text-sm font-mono">
              {JSON.stringify(reportData, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Report Info */}
      {!reportData && (
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4">What's Included in the Report</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-ibm-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-ibm-blue-400">📊</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Summary Metrics</h3>
                <p className="text-gray-400 text-sm">
                  Total sessions, lines of code generated, tests created, and tasks automated
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-green-400">📝</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Session Details</h3>
                <p className="text-gray-400 text-sm">
                  Complete history of all your Bob interactions with timestamps and features used
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400">🤖</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Bob Responses</h3>
                <p className="text-gray-400 text-sm">
                  All prompts sent to Bob and the responses received for audit and reference
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-yellow-400">📈</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Productivity Insights</h3>
                <p className="text-gray-400 text-sm">
                  Breakdown by feature usage and time-based analytics
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-ibm-blue-500/10 border border-ibm-blue-500/30 rounded-lg">
            <h3 className="text-ibm-blue-400 font-semibold mb-2">💡 Use Cases</h3>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Submit for hackathon evaluation</li>
              <li>• Share productivity metrics with your team</li>
              <li>• Track your AI-assisted development progress</li>
              <li>• Archive your Bob interaction history</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExportReport

// Made with Bob