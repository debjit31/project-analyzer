import { Sparkles, Zap, Target, Lightbulb } from 'lucide-react';
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">
              AI-Powered Project Ideas
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Turn Job Listings into{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Portfolio Projects
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover project ideas tailored to real job requirements. Stand out to
            recruiters by building what companies actually need.
          </p>

          <SearchForm />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
            How it works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Target}
              title="Search Jobs"
              description="Enter a job title and location to find relevant job listings in your field."
            />
            <FeatureCard
              icon={Zap}
              title="AI Analysis"
              description="Our AI analyzes each job to extract the core technical challenges."
            />
            <FeatureCard
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

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="text-center p-6">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-5 shadow-lg">
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

export { HomePage };
