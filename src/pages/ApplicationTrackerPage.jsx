import { motion } from 'framer-motion';
import { Columns3, Plus } from 'lucide-react';
import { KanbanBoard } from '../features/tracker/KanbanBoard';

const ApplicationTrackerPage = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 shrink-0">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-neutral-50 font-[family-name:var(--font-heading)] flex items-center gap-2">
              <Columns3 className="w-6 h-6 text-teal-400" />
              Application Tracker
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Drag cards between columns to update your application status
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-neutral-100 text-sm font-medium rounded-xl transition-all">
            <Plus className="w-4 h-4" />
            Add Application
          </button>
        </motion.div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-x-auto overflow-y-hidden pt-2 pb-6">
          <KanbanBoard />
        </div>
      </div>
    </div>
  );
};

export default ApplicationTrackerPage;

