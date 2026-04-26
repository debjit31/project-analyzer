import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';

const initialColumns = [
  {
    id: 'saved',
    title: 'Saved',
    color: '#6b7280',
    cards: [
      { id: 'c1', company: 'Airbnb', role: 'Design Systems Engineer', date: '2026-04-20', logo: 'AB', matchScore: 91 },
      { id: 'c2', company: 'Cloudflare', role: 'Platform Engineer', date: '2026-04-19', logo: 'CF', matchScore: 74 },
    ],
  },
  {
    id: 'applied',
    title: 'Applied',
    color: '#3b82f6',
    cards: [
      { id: 'c3', company: 'Stripe', role: 'Frontend Engineer', date: '2026-04-17', logo: 'ST', matchScore: 95 },
      { id: 'c4', company: 'Vercel', role: 'Senior React Developer', date: '2026-04-15', logo: 'VC', matchScore: 88 },
      { id: 'c5', company: 'Notion', role: 'Software Engineer, Growth', date: '2026-04-12', logo: 'NT', matchScore: 79 },
    ],
  },
  {
    id: 'interview',
    title: 'Interview',
    color: '#8b5cf6',
    cards: [
      { id: 'c6', company: 'Linear', role: 'Full Stack Engineer', date: '2026-04-14', logo: 'LN', matchScore: 93 },
      { id: 'c7', company: 'Raycast', role: 'Product Engineer', date: '2026-04-10', logo: 'RC', matchScore: 86 },
    ],
  },
  {
    id: 'offer',
    title: 'Offer',
    color: '#10b981',
    cards: [
      { id: 'c8', company: 'Shopify', role: 'Frontend Platform Engineer', date: '2026-04-18', logo: 'SH', matchScore: 82 },
    ],
  },
  {
    id: 'rejected',
    title: 'Rejected',
    color: '#ef4444',
    cards: [
      { id: 'c9', company: 'Discord', role: 'React Native Developer', date: '2026-04-11', logo: 'DC', matchScore: 67 },
    ],
  },
];

const KanbanBoard = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [activeCard, setActiveCard] = useState(null);
  const [activeColumnColor, setActiveColumnColor] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const findColumn = (cardId) =>
    columns.find((col) => col.cards.some((c) => c.id === cardId));

  const handleDragStart = ({ active }) => {
    const col = findColumn(active.id);
    if (col) {
      const card = col.cards.find((c) => c.id === active.id);
      setActiveCard(card || null);
      setActiveColumnColor(col.color);
    }
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveCard(null);
    setActiveColumnColor(null);
    if (!over) return;

    const sourceCol = findColumn(active.id);
    // 'over' could be a column id or a card id
    const targetCol =
      columns.find((col) => col.id === over.id) || findColumn(over.id);

    if (!sourceCol || !targetCol) return;

    if (sourceCol.id === targetCol.id) {
      // Reorder within same column
      const oldIdx = sourceCol.cards.findIndex((c) => c.id === active.id);
      const newIdx = sourceCol.cards.findIndex((c) => c.id === over.id);
      if (oldIdx === newIdx) return;
      setColumns((prev) =>
        prev.map((col) =>
          col.id === sourceCol.id
            ? { ...col, cards: arrayMove(col.cards, oldIdx, newIdx) }
            : col
        )
      );
    } else {
      // Move card to different column
      const card = sourceCol.cards.find((c) => c.id === active.id);
      setColumns((prev) =>
        prev.map((col) => {
          if (col.id === sourceCol.id) {
            return { ...col, cards: col.cards.filter((c) => c.id !== active.id) };
          }
          if (col.id === targetCol.id) {
            const overIdx = col.cards.findIndex((c) => c.id === over.id);
            const insertAt = overIdx >= 0 ? overIdx : col.cards.length;
            const newCards = [...col.cards];
            newCards.splice(insertAt, 0, card);
            return { ...col, cards: newCards };
          }
          return col;
        })
      );
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-5 pb-6 overflow-x-auto px-6">
        {columns.map((col, i) => (
          <KanbanColumn key={col.id} column={col} index={i} />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: 'ease' }}>
        {activeCard ? (
          <div className="rotate-2 opacity-95 shadow-2xl">
            <KanbanCard card={activeCard} columnColor={activeColumnColor || '#14b8a6'} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export { KanbanBoard };

