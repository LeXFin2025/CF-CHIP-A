import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { AppLauncher } from '@/components/common/AppLauncher';
import { useAppState, apps } from '@/hooks/use-app-state';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { sidebarOpen, appLauncherOpen, setAppLauncherOpen, setCurrentApp } = useAppState();
  const [location] = useLocation();
  
  // Set current app based on location
  useEffect(() => {
    const path = location === '/' ? '/browser' : location;
    const currentApp = apps.find(app => app.route === path);
    if (currentApp) {
      setCurrentApp(currentApp.id);
    }
  }, [location, setCurrentApp]);
  
  return (
    <div className="bg-neutral-lightest text-neutral-dark flex flex-col h-screen">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          {children}
        </main>
      </div>
      
      {appLauncherOpen && (
        <AppLauncher onClose={() => setAppLauncherOpen(false)} />
      )}
    </div>
  );
}
