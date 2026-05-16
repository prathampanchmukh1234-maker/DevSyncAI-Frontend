/**
 * Sidebar Component
 * 
 * Navigation sidebar for DevSync AI with links to all features.
 * Displays IBM Bob branding and user information.
 */

import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  GitBranch, 
  FileText, 
  Zap, 
  Download,
  LogOut,
  Bot
} from 'lucide-react';

export default function Sidebar({ user, onSignOut }) {
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: 'Dashboard',
      description: 'Sprint metrics & activity'
    },
    {
      path: '/onboarder',
      icon: GitBranch,
      label: 'Code Onboarder',
      description: 'Analyze repositories'
    },
    {
      path: '/doc-generator',
      icon: FileText,
      label: 'Doc Generator',
      description: 'Create docs & tests'
    },
    {
      path: '/task-automator',
      icon: Zap,
      label: 'Task Automator',
      description: 'Automate repetitive tasks'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 h-screen bg-dark-950 border-r border-dark-800 flex flex-col">
      {/* Logo & Branding */}
      <div className="p-6 border-b border-dark-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-ibm-blue-500 to-ibm-blue-700 rounded-lg flex items-center justify-center shadow-glow-blue">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">DevSync AI</h1>
            <p className="text-xs text-gray-400">Powered by IBM Bob</p>
          </div>
        </div>
        <div className="bob-badge mt-3">
          <Bot className="w-4 h-4" />
          <span>IBM Bob Active</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={active ? 'nav-item-active' : 'nav-item'}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{item.label}</div>
                <div className="text-xs text-gray-500 truncate">{item.description}</div>
              </div>
            </Link>
          );
        })}

        {/* Export Report Button */}
        <Link
          to="/export"
          className="nav-item mt-6 border-t border-dark-800 pt-4"
        >
          <Download className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">Export Report</div>
            <div className="text-xs text-gray-500 truncate">Download Bob report</div>
          </div>
        </Link>
      </nav>

      {/* User Info & Sign Out */}
      <div className="p-4 border-t border-dark-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-ibm-blue-600 to-ibm-blue-800 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {user?.email || 'User'}
            </div>
            <div className="text-xs text-gray-400">Developer</div>
          </div>
        </div>
        
        <button
          onClick={onSignOut}
          className="btn-ghost w-full justify-start"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

// Made with Bob
