import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

// ThemeProvider and QueryClientProvider are in main.jsx — do NOT add them here.
function App() {
  return <RouterProvider router={router} />;
}

export default App;
