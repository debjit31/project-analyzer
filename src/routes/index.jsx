import { createBrowserRouter } from 'react-router-dom';
import { AppLayout, CopilotLayout } from '../layouts';
import { HomePage, ResultsPage, AllJobsPage, JobDetailPage } from '../pages';
import DashboardPage from '../pages/DashboardPage';
import JobFeedPage from '../pages/JobFeedPage';
import ResumeAnalyzerPage from '../pages/ResumeAnalyzerPage';
import CoverLetterPage from '../pages/CoverLetterPage';
import ApplicationTrackerPage from '../pages/ApplicationTrackerPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'results', element: <ResultsPage /> },
      { path: 'jobs', element: <AllJobsPage /> },
      { path: 'jobs/:id', element: <JobDetailPage /> },
    ],
  },
  {
    path: '/app',
    element: <CopilotLayout />,
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
