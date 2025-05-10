import { useLocation } from 'wouter';
import { useAppState } from '@/hooks/use-app-state';
import { Bell, Menu, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserMenu } from '@/components/common/UserMenu';
import { NotificationCenter } from '@/components/common/NotificationCenter';
import { useState } from 'react';

export function Header() {
  const { 
    sidebarOpen, 
    setSidebarOpen, 
    user, 
    setAppLauncherOpen,
    notifications
  } = useAppState();
  const [location, navigate] = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b border-neutral-light px-4 py-2 flex items-center justify-between">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="p-1.5 rounded-full hover:bg-neutral-light mr-2" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <img 
          src="https://images.unsplash.com/photo-1537498425277-c283d32ef9db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50" 
          alt="Centrifugal Browser Logo" 
          className="h-8 w-8 mr-3 cursor-pointer" 
          onClick={() => navigate('/')}
        />
        <h1 className="text-lg font-semibold text-primary cursor-pointer" onClick={() => navigate('/')}>
          Centrifugal Browser
        </h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="p-1.5 rounded-full hover:bg-neutral-light"
          onClick={() => setAppLauncherOpen(true)}
        >
          <Grid className="h-5 w-5" />
        </Button>
        
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-1.5 rounded-full hover:bg-neutral-light"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5" />
          </Button>
          {unreadNotifications > 0 && (
            <Badge variant="destructive" className="absolute top-0 right-0 h-4 w-4 p-0 flex items-center justify-center">
              {unreadNotifications}
            </Badge>
          )}
          
          {showNotifications && (
            <NotificationCenter onClose={() => setShowNotifications(false)} />
          )}
        </div>
        
        <UserMenu
          user={user}
          trigger={
            <div className="flex items-center space-x-2 p-1 rounded-full hover:bg-neutral-light cursor-pointer">
              <Avatar className="h-7 w-7">
                <AvatarImage src={user?.avatar} alt={user?.displayName} />
                <AvatarFallback>
                  {user?.displayName?.substring(0, 2) || user?.username?.substring(0, 2) || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{user?.displayName || user?.username || 'Guest'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          }
        />
      </div>
    </header>
  );
}
