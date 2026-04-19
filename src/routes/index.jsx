import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../layouts';
import { HomePage, ResultsPage, AllJobsPage, JobDetailPage } from '../pages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'results',
        element: <ResultsPage />,
      },
      {
        path: 'jobs',
        element: <AllJobsPage />,
      },
      {
        path: 'jobs/:id',
        element: <JobDetailPage />,
      },
    ],
  },
]);
