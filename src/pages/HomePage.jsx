import { Search as SearchIcon, Zap, Lightbulb } from 'lucide-react';
import { SearchForm } from '../features/jobs';

/**
 * Home page with search functionality
 */
const HomePage = () => {
  return (
    <div className="min-h-[calc(100vh-10rem)]">
      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-teal-200 bg-teal-50/50 dark:border-teal-800 dark:bg-teal-950/50 rounded-md mb-6">
            <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
              Portfolio-worthy project ideas
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 dark:text-stone-100 mb-6 leading-tight font-[family-name:var(--font-heading)]">
            Turn Job Listings into{' '}
            <span className="text-teal-600 dark:text-teal-400 underline decoration-amber-400 dark:decoration-amber-500 decoration-[3px] underline-offset-4">
              Portfolio Projects
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover project ideas tailored to real job requirements. Stand out to
            recruiters by building what companies actually need.
          </p>

          <SearchForm />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-stone-900 dark:text-stone-100 mb-12 font-[family-name:var(--font-heading)]">
            How it works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              step="01"
              icon={SearchIcon}
              title="Search Jobs"
              description="Enter a job title and location to find relevant job listings in your field."
            />
            <FeatureCard
              step="02"
              icon={Zap}
              title="AI Analysis"
              description="Each job is analyzed to extract the core technical challenges and stack."
            />
            <FeatureCard
              step="03"
              icon={Lightbulb}
              title="Get Ideas"
              description="Receive tailored portfolio project ideas that match job requirements."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ step, icon: Icon, title, description }) => {
  return (
    <div className="text-center p-6">
      <span className="text-3xl font-bold text-stone-200 dark:text-stone-700 font-[family-name:var(--font-heading)]">
        {step}
      </span>
      <div className="w-14 h-14 rounded-lg bg-stone-100 border border-stone-200 dark:bg-stone-800 dark:border-stone-700 flex items-center justify-center mx-auto mt-2 mb-5">
        <Icon className="w-7 h-7 text-teal-600 dark:text-teal-400" />
      </div>
      <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">{title}</h3>
      <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{description}</p>
    </div>
  );
};

export { HomePage };
