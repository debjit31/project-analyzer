import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '../lib/SidebarContext';
import { ToastProvider } from '../lib/ToastContext';
import { Sidebar } from '../components/layout/Sidebar';
import { Navbar } from '../components/layout/Navbar';
import { Toast } from '../components/ui/Toast';

const CopilotLayout = () => {
  return (
    <SidebarProvider>
      <ToastProvider>
        <div className="flex h-screen overflow-hidden bg-neutral-950 text-neutral-100">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-y-auto">
              <Outlet />
            </main>
          </div>
        </div>
        <Toast />
      </ToastProvider>
    </SidebarProvider>
  );
};

export { CopilotLayout };



