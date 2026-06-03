import { Link } from 'react-router';
import { Home } from 'lucide-react';
import { BackgroundDecorations } from '../components/BackgroundDecorations';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <BackgroundDecorations />
      <div className="text-center relative z-10">
        <h1 className="text-9xl mb-4 font-display text-neutral-900 dark:text-neutral-100">404</h1>
        <h2 className="text-3xl mb-4 text-neutral-800 dark:text-neutral-200">Page Not Found</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition-colors font-semibold shadow-lg hover:shadow-indigo-500/50"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
