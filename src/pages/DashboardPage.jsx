import { motion } from 'framer-motion';
import { ArrowRight, Zap, Database, Globe, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatsCard } from '../features/dashboard/StatsCard';
import { ApplicationChart } from '../features/dashboard/ApplicationChart';
import { ActivityFeed } from '../features/dashboard/ActivityFeed';
import { useDashboardStats } from '../features/jobs/hooks/useCopilotJobs';

const statsCards = [
  { id: 'total', label: 'Applications Sent', value: 47, delta: '+8 this week', trend: 'up', icon: 'send', color: 'teal' },
  { id: 'interviews', label: 'Interviews Scheduled', value: 9, delta: '+3 this month', trend: 'up', icon: 'calendar', color: 'violet' },
  { id: 'response', label: 'Response Rate', value: '34%', delta: '+5% vs last month', trend: 'up', icon: 'trending-up', color: 'emerald' },
  { id: 'saved', label: 'Jobs Saved', value: 128, delta: '23 new today', trend: 'up', icon: 'bookmark', color: 'amber' },
];

const DashboardPage = () => {
  const { data: liveStats } = useDashboardStats();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-neutral-50 font-[family-name:var(--font-heading)]">
            Good morning, Debjit 👋
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            You have <span className="text-teal-400 font-medium">3 interviews</span> this week. Keep going!
          </p>
        </div>
        <Link
          to="/app/jobs"
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-teal-900/30"
        >
          <Zap className="w-4 h-4" />
          Find Jobs
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {/* Live market stats banner — shown only when backend is reachable */}
      {liveStats && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            { label: 'Jobs Indexed', value: liveStats.total_jobs_indexed?.toLocaleString(), icon: Database, color: 'text-teal-400' },
            { label: 'New Today', value: `+${liveStats.new_today}`, icon: TrendingUp, color: 'text-emerald-400' },
            { label: 'Remote Roles', value: `${liveStats.remote_roles_pct}%`, icon: Globe, color: 'text-violet-400' },
            { label: 'Avg Salary', value: `$${(liveStats.avg_salary_usd / 1000).toFixed(0)}K`, icon: Zap, color: 'text-amber-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="flex items-center gap-3 px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl">
              <Icon className={`w-4 h-4 ${color} shrink-0`} />
              <div>
                <p className="text-xs text-neutral-500">{label}</p>
                <p className="text-sm font-semibold text-neutral-100">{value}</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* User activity stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, i) => (
          <StatsCard key={card.id} {...card} index={i} />
        ))}
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <ApplicationChart />
        </div>
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
      </div>

      {/* Quick action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { to: '/app/resume', title: 'Analyze Resume', desc: 'Get your ATS score and actionable feedback', gradient: 'from-teal-600/20 to-teal-600/5', border: 'border-teal-500/20 hover:border-teal-500/40' },
          { to: '/app/cover-letter', title: 'Write Cover Letter', desc: 'AI-generated cover letters tailored to the role', gradient: 'from-violet-600/20 to-violet-600/5', border: 'border-violet-500/20 hover:border-violet-500/40' },
          { to: '/app/tracker', title: 'Track Applications', desc: 'Manage your pipeline with a Kanban board', gradient: 'from-amber-600/20 to-amber-600/5', border: 'border-amber-500/20 hover:border-amber-500/40' },
        ].map(({ to, title, desc, gradient, border }, i) => (
          <motion.div
            key={to}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.07, duration: 0.35 }}
          >
            <Link to={to} className={`flex flex-col gap-2 p-5 rounded-2xl bg-gradient-to-br ${gradient} border ${border} transition-all duration-200 hover:scale-[1.01] group`}>
              <h3 className="text-sm font-semibold text-neutral-100 group-hover:text-white transition-colors">{title}</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">{desc}</p>
              <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300 group-hover:translate-x-1 transition-all mt-1" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;

