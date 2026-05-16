/**
 * BobResponseCard Component
 * 
 * Displays IBM Bob's responses with proper attribution and copy functionality.
 * Used across all features to show Bob's generated content.
 */

import { useState } from 'react';
import { Copy, Check, Bot } from 'lucide-react';

export default function BobResponseCard({ title, content, type = 'text', className = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`card-hover relative ${className}`}>
      {/* IBM Bob Badge */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="bob-badge">
          <Bot className="w-4 h-4" />
          <span>Powered by IBM Bob</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        {type === 'code' ? (
          <pre className="code-block scrollbar-thin">
            <code>{content}</code>
          </pre>
        ) : (
          <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
            {content}
          </div>
        )}

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="copy-btn"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}

/**
 * BobResponseSection Component
 * 
 * Groups multiple Bob response cards with a section header
 */
export function BobResponseSection({ title, children, icon: Icon }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        {Icon && <Icon className="w-6 h-6 text-ibm-blue-400" />}
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

/**
 * BobLoadingCard Component
 * 
 * Shows loading state while waiting for Bob's response
 */
export function BobLoadingCard({ message = 'IBM Bob is analyzing...' }) {
  return (
    <div className="card text-center py-12">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-ibm-blue-500 to-ibm-blue-700 rounded-full flex items-center justify-center shadow-glow-blue-lg animate-pulse-slow">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <div className="absolute inset-0 border-4 border-ibm-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div>
          <p className="text-lg font-medium text-white mb-1">{message}</p>
          <p className="text-sm text-gray-400">This may take a few moments...</p>
        </div>
      </div>
    </div>
  );
}

/**
 * BobErrorCard Component
 * 
 * Shows error state when Bob request fails
 */
export function BobErrorCard({ error, onRetry }) {
  return (
    <div className="card border-red-500/30 bg-red-500/5">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-red-400 text-xl">⚠</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-400 mb-2">
            Bob Request Failed
          </h3>
          <p className="text-gray-300 mb-4">{error}</p>
          {onRetry && (
            <button onClick={onRetry} className="btn-primary">
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * BobMetricCard Component
 * 
 * Displays a single metric from Bob's analysis
 */
export function BobMetricCard({ label, value, icon: Icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'text-ibm-blue-400 bg-ibm-blue-500/10 border-ibm-blue-500/30',
    green: 'text-green-400 bg-green-500/10 border-green-500/30',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/30'
  };

  return (
    <div className={`metric-card border ${colorClasses[color]}`}>
      {Icon && (
        <div className="flex justify-center mb-3">
          <Icon className={`w-8 h-8 ${colorClasses[color].split(' ')[0]}`} />
        </div>
      )}
      <div className={`metric-value ${colorClasses[color].split(' ')[0]}`}>
        {value}
      </div>
      <div className="metric-label">{label}</div>
    </div>
  );
}

// Made with Bob
