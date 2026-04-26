import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Sun, Moon, ChevronDown, Settings, LogOut, User, Search } from 'lucide-react';
import { useTheme } from '../../lib/ThemeContext';
import { cn } from '../../lib/utils';

const routeLabels = {
  '/app/dashboard': 'Dashboard',
  '/app/jobs': 'Job Feed',
  '/app/resume': 'Resume Analyzer',
  '/app/cover-letter': 'Cover Letter Generator',
  '/app/tracker': 'Application Tracker',
};

const Navbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const pageTitle = routeLabels[location.pathname] ?? 'Dashboard';

  return (
    <header className="h-16 flex items-center gap-4 px-6 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md shrink-0">
      {/* Page title */}
      <div className="flex-1">
        <h1 className="text-sm font-semibold text-neutral-100">{pageTitle}</h1>
        <p className="text-xs text-neutral-500 mt-0.5">AI-Powered Job Application Copilot</p>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg w-56 group focus-within:border-teal-600 transition-colors">
        <Search className="w-4 h-4 text-neutral-500 group-focus-within:text-teal-400 transition-colors" />
        <input
          type="text"
          placeholder="Search jobs, companies…"
          className="bg-transparent text-sm text-neutral-300 placeholder-neutral-600 outline-none w-full"
        />
        <kbd className="text-[10px] text-neutral-600 bg-neutral-800 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      {/* Notifications */}
      <button className="relative p-2 rounded-lg text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 transition-colors">
        <Bell className="w-4 h-4" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-500 border-2 border-neutral-950" />
      </button>

      {/* Profile dropdown */}
      <DropdownMenu.Root open={open} onOpenChange={setOpen}>
        <DropdownMenu.Trigger asChild>
          <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-neutral-800 transition-colors">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              DC
            </div>
            <span className="text-sm text-neutral-300 hidden md:block">Debjit</span>
            <ChevronDown
              className={cn('w-3.5 h-3.5 text-neutral-500 transition-transform hidden md:block', open && 'rotate-180')}
            />
          </button>
        </DropdownMenu.Trigger>

        <AnimatePresence>
          {open && (
            <DropdownMenu.Portal forceMount>
              <DropdownMenu.Content asChild align="end" sideOffset={8}>
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="z-50 w-52 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-1.5 outline-none"
                >
                  <div className="px-3 py-2.5 border-b border-neutral-800 mb-1">
                    <p className="text-sm font-medium text-neutral-100">Debjit Chattopadhyay</p>
                    <p className="text-xs text-neutral-500 truncate">debjit@example.com</p>
                  </div>
                  {[
                    { icon: User, label: 'Profile' },
                    { icon: Settings, label: 'Settings' },
                  ].map(({ icon: Icon, label }) => (
                    <DropdownMenu.Item
                      key={label}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800 rounded-lg cursor-pointer outline-none transition-colors"
                    >
                      <Icon className="w-4 h-4 text-neutral-500" />
                      {label}
                    </DropdownMenu.Item>
                  ))}
                  <DropdownMenu.Separator className="my-1 h-px bg-neutral-800" />
                  <DropdownMenu.Item className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg cursor-pointer outline-none transition-colors">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenu.Item>
                </motion.div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          )}
        </AnimatePresence>
      </DropdownMenu.Root>
    </header>
  );
};

export { Navbar };

