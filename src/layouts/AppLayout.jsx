import { Outlet } from 'react-router-dom';
import { Header } from './Header';

/**
 * Main app layout with header and content area
 */
const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} ProjectPitch AI. Built for portfolio inspiration.
          </p>
        </div>
      </footer>
    </div>
  );
};

export { AppLayout };
