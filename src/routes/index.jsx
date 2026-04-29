import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout, CopilotLayout } from '../layouts';
import { ResultsPage, AllJobsPage, JobDetailPage } from '../pages';
import DashboardPage from '../pages/DashboardPage';
import JobFeedPage from '../pages/JobFeedPage';
import ResumeAnalyzerPage from '../pages/ResumeAnalyzerPage';
import CoverLetterPage from '../pages/CoverLetterPage';
import ApplicationTrackerPage from '../pages/ApplicationTrackerPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import AuthCallbackPage from '../pages/AuthCallbackPage';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

export const router = createBrowserRouter([
  // ── Auth routes (public) ───────────────────────────────────────────────────
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/auth/callback', element: <AuthCallbackPage /> },

  // ── Legacy routes (AppLayout) ─────────────────────────────────────────────
  {
    path: '/',
    element: <AppLayout />,
    children: [
      // Redirect root to the /app dashboard
      { index: true, element: <Navigate to="/app" replace /> },
      { path: 'results', element: <ResultsPage /> },
      { path: 'jobs', element: <AllJobsPage /> },
      { path: 'jobs/:id', element: <JobDetailPage /> },
    ],
  },

  // ── Copilot app routes (protected) ────────────────────────────────────────
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <CopilotLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'jobs', element: <JobFeedPage /> },
      { path: 'resume', element: <ResumeAnalyzerPage /> },
      { path: 'cover-letter', element: <CoverLetterPage /> },
      { path: 'tracker', element: <ApplicationTrackerPage /> },
    ],
  },
]);
