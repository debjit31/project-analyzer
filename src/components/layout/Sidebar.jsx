import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Mail,
  Columns3,
  Zap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useSidebar } from '../../lib/SidebarContext';
import { cn } from '../../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/app/dashboard' },
  { icon: Briefcase, label: 'Job Feed', path: '/app/jobs' },
  { icon: FileText, label: 'Resume Analyzer', path: '/app/resume' },
  { icon: Mail, label: 'Cover Letter', path: '/app/cover-letter' },
  { icon: Columns3, label: 'Tracker', path: '/app/tracker' },
];

const Sidebar = () => {
  const { isCollapsed, toggle } = useSidebar();

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 64 : 240 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-full bg-neutral-950 border-r border-neutral-800 shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-neutral-800 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shrink-0 shadow-lg shadow-teal-900/40">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="text-sm font-semibold text-neutral-100 whitespace-nowrap font-[family-name:var(--font-heading)]"
              >
                Job Copilot
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-hidden">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-teal-500/15 text-teal-400 border border-teal-500/20'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/70 border border-transparent'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={cn(
                    'w-5 h-5 shrink-0 transition-colors',
                    isActive ? 'text-teal-400' : 'text-neutral-500 group-hover:text-neutral-300'
                  )}
                />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.13 }}
                      className="whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="px-2 pb-4 border-t border-neutral-800 pt-3 shrink-0">
        <button
          onClick={toggle}
          className={cn(
            'w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs text-neutral-500',
            'hover:text-neutral-300 hover:bg-neutral-800 transition-colors'
          )}
        >
          <div className="w-5 h-5 flex items-center justify-center shrink-0">
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="whitespace-nowrap"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};

export { Sidebar };

