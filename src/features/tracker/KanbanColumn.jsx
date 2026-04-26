import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { KanbanCard } from './KanbanCard';
import { cn } from '../../lib/utils';

const KanbanColumn = ({ column, index }) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      className="flex flex-col w-72 shrink-0"
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-1 mb-3">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: column.color, boxShadow: `0 0 8px ${column.color}60` }}
          />
          <h3 className="text-sm font-semibold text-neutral-200">{column.title}</h3>
        </div>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ color: column.color, background: `${column.color}18`, border: `1px solid ${column.color}30` }}
        >
          {column.cards.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex flex-col gap-3 p-3 rounded-2xl border-2 min-h-[400px] flex-1 transition-all duration-200',
          isOver
            ? 'border-dashed scale-[1.01]'
            : 'border-neutral-800 bg-neutral-900/40'
        )}
        style={isOver ? { borderColor: column.color, background: `${column.color}08` } : {}}
      >
        <SortableContext items={column.cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {column.cards.map((card) => (
            <KanbanCard key={card.id} card={card} columnColor={column.color} />
          ))}
        </SortableContext>

        {column.cards.length === 0 && (
          <div className="flex items-center justify-center flex-1 text-center">
            <p className="text-xs text-neutral-700">Drop cards here</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export { KanbanColumn };

