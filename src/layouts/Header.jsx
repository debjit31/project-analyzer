import { NavLink, Link } from 'react-router-dom';
import { Compass, Sun, Moon, Zap } from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';

/**
 * App header component
 */
const Header = () => {
  const { theme, toggleTheme } = useTheme();

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? 'text-teal-700 dark:text-teal-400 underline underline-offset-4 decoration-2 decoration-teal-500'
        : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-md bg-teal-600 flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-[family-name:var(--font-heading)]">
              <span className="text-stone-900 dark:text-stone-100">Project</span>
              <span className="text-teal-600 dark:text-teal-400">Pitch</span>
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            <NavLink to="/" className={linkClass} end>
              Home
            </NavLink>
            <NavLink to="/jobs" className={linkClass}>
              Browse Jobs
            </NavLink>
            <Link
              to="/app/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-md shadow-teal-900/20"
            >
              <Zap className="w-3.5 h-3.5" />
              AI Copilot
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export { Header };


