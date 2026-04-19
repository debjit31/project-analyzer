import { Lightbulb } from 'lucide-react';

const ProjectIdeaHighlight = ({ idea }) => {
  return (
    <div className="relative mt-4 p-4 rounded-lg bg-amber-50/60 border-l-[3px] border-l-amber-400 dark:bg-amber-950/30 dark:border-l-amber-500">
      <div className="flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-1">
            Project Idea
          </h4>
          <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">{idea}</p>
        </div>
      </div>
    </div>
  );
};

export { ProjectIdeaHighlight };
