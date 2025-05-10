import { useLocation } from 'wouter';
import { useAppState, apps, getAppsByCategory } from '@/hooks/use-app-state';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AppIcon } from '@/components/common/AppIcon';

export function Sidebar() {
  const { sidebarOpen, searchQuery, setSearchQuery, currentApp } = useAppState();
  const [location, navigate] = useLocation();
  
  const mainApps = getAppsByCategory('main');
  const productivityApps = getAppsByCategory('productivity');
  const toolsApps = getAppsByCategory('tools');
  const mediaApps = getAppsByCategory('media');
  const moreApps = getAppsByCategory('more');
  
  const handleAppClick = (route: string) => {
    navigate(route);
  };
  
  if (!sidebarOpen) {
    return (
      <aside className="w-16 bg-white border-r border-neutral-light flex flex-col h-full transition-all duration-300">
        <div className="flex flex-col items-center py-4 space-y-4">
          {apps.map(app => (
            <div 
              key={app.id}
              className={`cursor-pointer p-2 rounded-md ${location === app.route ? 'bg-neutral-light' : ''}`}
              onClick={() => handleAppClick(app.route)}
            >
              <AppIcon app={app} size="sm" tooltip />
            </div>
          ))}
        </div>
      </aside>
    );
  }
  
  return (
    <aside className="w-64 bg-white border-r border-neutral-light flex flex-col h-full transition-all duration-300">
      <div className="p-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search..."
            className="w-full bg-neutral-light rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="h-4 w-4 absolute right-3 top-2.5 text-neutral-medium" />
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1">
        <h3 className="px-4 text-xs font-medium text-neutral-medium uppercase tracking-wider">Main Apps</h3>
        <nav className="mt-2 space-y-1 px-2">
          {mainApps.map(app => (
            <a 
              key={app.id}
              href={app.route}
              className={`sidebar-menu-item flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-light ${location === app.route ? 'active bg-neutral-light border-l-2 border-primary' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleAppClick(app.route);
              }}
            >
              <AppIcon app={app} className="mr-3" />
              {app.name}
            </a>
          ))}
        </nav>
        
        <h3 className="mt-6 px-4 text-xs font-medium text-neutral-medium uppercase tracking-wider">Productivity</h3>
        <nav className="mt-2 space-y-1 px-2">
          {productivityApps.map(app => (
            <a 
              key={app.id}
              href={app.route}
              className={`sidebar-menu-item flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-light ${location === app.route ? 'active bg-neutral-light border-l-2 border-primary' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleAppClick(app.route);
              }}
            >
              <AppIcon app={app} className="mr-3" />
              {app.name}
            </a>
          ))}
        </nav>
        
        <h3 className="mt-6 px-4 text-xs font-medium text-neutral-medium uppercase tracking-wider">Tools</h3>
        <nav className="mt-2 space-y-1 px-2">
          {toolsApps.map(app => (
            <a 
              key={app.id}
              href={app.route}
              className={`sidebar-menu-item flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-light ${location === app.route ? 'active bg-neutral-light border-l-2 border-primary' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleAppClick(app.route);
              }}
            >
              <AppIcon app={app} className="mr-3" />
              {app.name}
            </a>
          ))}
        </nav>
        
        <h3 className="mt-6 px-4 text-xs font-medium text-neutral-medium uppercase tracking-wider">Media</h3>
        <nav className="mt-2 space-y-1 px-2">
          {mediaApps.map(app => (
            <a 
              key={app.id}
              href={app.route}
              className={`sidebar-menu-item flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-light ${location === app.route ? 'active bg-neutral-light border-l-2 border-primary' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleAppClick(app.route);
              }}
            >
              <AppIcon app={app} className="mr-3" />
              {app.name}
            </a>
          ))}
        </nav>
        
        <h3 className="mt-6 px-4 text-xs font-medium text-neutral-medium uppercase tracking-wider">More Tools</h3>
        <nav className="mt-2 space-y-1 px-2 pb-8">
          {moreApps.map(app => (
            <a 
              key={app.id}
              href={app.route}
              className={`sidebar-menu-item flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-light ${location === app.route ? 'active bg-neutral-light border-l-2 border-primary' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleAppClick(app.route);
              }}
            >
              <AppIcon app={app} className="mr-3" />
              {app.name}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
