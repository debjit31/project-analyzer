import { Lightbulb } from 'lucide-react';

/**
 * Highlighted project idea section
 */
const ProjectIdeaHighlight = ({ idea }) => {
  return (
    <div className="relative mt-4 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-white" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-indigo-900 mb-1">
            Project Idea
          </h4>
          <p className="text-sm text-indigo-800 leading-relaxed">{idea}</p>
        </div>
      </div>
    </div>
  );
};

export { ProjectIdeaHighlight };
