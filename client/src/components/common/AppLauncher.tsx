import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAppState, apps } from '@/hooks/use-app-state';
import { X, Search } from 'lucide-react';
import { AppIcon } from './AppIcon';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AppLauncherProps {
  onClose: () => void;
}

export function AppLauncher({ onClose }: AppLauncherProps) {
  const [location, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredApps = searchQuery 
    ? apps.filter(app => 
        app.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : apps;
  
  const handleAppClick = (route: string) => {
    navigate(route);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-auto mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">All Applications</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="mb-6 relative">
            <Input
              type="text"
              placeholder="Search apps..."
              className="w-full bg-neutral-light rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-3 h-5 w-5 text-neutral-medium" />
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredApps.map(app => (
              <a
                key={app.id}
                href={app.route}
                className="flex flex-col items-center p-4 hover:bg-neutral-light rounded-lg transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  handleAppClick(app.route);
                }}
              >
                <AppIcon app={app} size="lg" className="mb-2" />
                <span className="text-center">{app.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
