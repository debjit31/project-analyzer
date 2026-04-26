import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Building2, Calendar, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

const KanbanCard = ({ card, columnColor }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-400';
    if (score >= 65) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group bg-neutral-900 border border-neutral-800 rounded-xl p-4',
        'hover:border-neutral-700 transition-all duration-150',
        isDragging && 'opacity-40 scale-[0.98] shadow-2xl border-neutral-600'
      )}
    >
      {/* Drag handle + logo */}
      <div className="flex items-start gap-2.5 mb-3">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 p-0.5 rounded text-neutral-700 hover:text-neutral-400 transition-colors cursor-grab active:cursor-grabbing shrink-0"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold mb-2"
            style={{ background: `${columnColor}30`, border: `1px solid ${columnColor}40` }}
          >
            <span style={{ color: columnColor }}>{card.logo}</span>
          </div>
          <h4 className="text-sm font-semibold text-neutral-100 leading-snug">{card.role}</h4>
          <p className="text-xs text-neutral-500 mt-0.5">{card.company}</p>
        </div>
      </div>

      {/* Date + match score */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-[11px] text-neutral-600">
          <Calendar className="w-3 h-3" />
          {new Date(card.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        <span className={cn('flex items-center gap-1 text-[11px] font-semibold', getScoreColor(card.matchScore))}>
          <Zap className="w-3 h-3" />
          {card.matchScore}%
        </span>
      </div>

      {/* Colored accent line */}
      <div
        className="mt-3 h-0.5 rounded-full opacity-40 group-hover:opacity-70 transition-opacity"
        style={{ background: columnColor }}
      />
    </div>
  );
};

export { KanbanCard };

