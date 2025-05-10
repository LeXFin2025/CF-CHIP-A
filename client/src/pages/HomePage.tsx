import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAppState, apps } from '@/hooks/use-app-state';
import { useTabs } from '@/hooks/use-tabs';
import { Mail, CalendarDays, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AppIcon } from '@/components/common/AppIcon';

export default function HomePage() {
  const [, navigate] = useLocation();
  const { setCurrentApp } = useAppState();
  const { addTab, activateTab, tabs } = useTabs();
  
  // Make sure we're in browser mode
  useEffect(() => {
    setCurrentApp('browser');
  }, [setCurrentApp]);
  
  const mainApps = apps.filter(app => app.category === 'main');
  const popularApps = apps.slice(0, 6); // Just get the first 6 apps for popular section
  
  const recentEmails = [
    {
      id: 1,
      from: 'Team Centrifugal',
      subject: 'Welcome to your new account',
      preview: 'Get started with Centrifugal Browser and explore all of our integrated apps...',
      time: '10:30 AM'
    },
    {
      id: 2,
      from: 'Sarah Johnson',
      subject: 'Project update',
      preview: "I've attached the latest designs for the dashboard. Let me know what you think...",
      time: 'Yesterday'
    },
    {
      id: 3,
      from: 'Newsletter',
      subject: 'Your weekly tech digest',
      preview: 'The latest updates and news from the world of technology...',
      time: 'Aug 15'
    }
  ];
  
  const todaySchedule = [
    {
      id: 1,
      title: 'Team Meeting',
      time: '10:00 AM - 11:00 AM',
      location: 'Virtual Conference Room',
      status: 'now',
      color: 'border-primary-light'
    },
    {
      id: 2,
      title: 'Project Review',
      time: '1:30 PM - 2:30 PM',
      location: 'Main Office',
      status: 'upcoming',
      color: 'border-accent'
    },
    {
      id: 3,
      title: 'Client Call',
      time: '3:00 PM - 3:30 PM',
      location: 'Phone',
      status: 'upcoming',
      color: 'border-status-warning'
    }
  ];
  
  const quickLinks = [
    { name: 'Google', url: 'https://www.google.com', favicon: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=24&h=24' },
    { name: 'YouTube', url: 'https://www.youtube.com', favicon: 'https://images.unsplash.com/photo-1611162616475-46b635cb6d05?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=24&h=24' },
    { name: 'Wikipedia', url: 'https://www.wikipedia.org', favicon: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=24&h=24' },
    { name: 'Amazon', url: 'https://www.amazon.com', favicon: 'https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=24&h=24' }
  ];
  
  const goToApp = (route: string) => {
    navigate(route);
  };
  
  const openLink = (url: string) => {
    // Create a new tab and navigate to the URL
    addTab({ url, title: url.split('//')[1]?.split('/')[0] || 'New Tab' });
  };

  return (
    <div className="app-container overflow-y-auto p-4 bg-neutral-lightest">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Welcome Section */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-r from-primary to-accent rounded-xl p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold mb-2">Welcome to Centrifugal Browser</h1>
          <p className="mb-4">Your all-in-one productivity suite with integrated apps and seamless browsing experience.</p>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="default" 
              className="bg-white text-primary hover:bg-neutral-light"
              onClick={() => goToApp('/mail')}
            >
              <Mail className="h-5 w-5 mr-2" />
              Check Mail
            </Button>
            <Button 
              variant="default" 
              className="bg-white text-primary hover:bg-neutral-light"
              onClick={() => goToApp('/calendar')}
            >
              <CalendarDays className="h-5 w-5 mr-2" />
              Calendar
            </Button>
            <Button 
              variant="default" 
              className="bg-white text-primary hover:bg-neutral-light"
              onClick={() => goToApp('/documents')}
            >
              <FileText className="h-5 w-5 mr-2" />
              Documents
            </Button>
          </div>
        </div>
        
        {/* Quick Links */}
        <Card>
          <CardContent className="p-5">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Quick Links
            </h2>
            <div className="space-y-3">
              {quickLinks.map((link) => (
                <a 
                  key={link.name}
                  href="#" 
                  className="flex items-center p-2 hover:bg-neutral-light rounded-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    openLink(link.url);
                  }}
                >
                  <img src={link.favicon} alt={link.name} className="w-6 h-6 mr-3" />
                  <span>{link.name}</span>
                </a>
              ))}
              <a href="#" className="text-center text-primary-light text-sm mt-2 block">Manage bookmarks...</a>
            </div>
          </CardContent>
        </Card>
        
        {/* Email Preview */}
        <Card>
          <CardContent className="p-5">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-primary" />
              Recent Emails
            </h2>
            <div className="space-y-3">
              {recentEmails.map((email) => (
                <div 
                  key={email.id}
                  className="p-2 hover:bg-neutral-light rounded-lg cursor-pointer"
                  onClick={() => goToApp('/mail')}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{email.from}</span>
                    <span className="text-xs text-neutral-medium">{email.time}</span>
                  </div>
                  <div className="text-sm text-neutral-medium">{email.subject} - {email.preview}</div>
                </div>
              ))}
              <a href="#mail" className="text-center text-primary-light text-sm block mt-2" onClick={(e) => {
                e.preventDefault();
                goToApp('/mail');
              }}>View all emails...</a>
            </div>
          </CardContent>
        </Card>
        
        {/* Calendar Preview */}
        <Card>
          <CardContent className="p-5">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <CalendarDays className="h-5 w-5 mr-2 text-primary" />
              Today's Schedule
            </h2>
            <div className="space-y-3">
              {todaySchedule.map((event) => (
                <div 
                  key={event.id}
                  className={`p-2 border-l-4 ${event.color} hover:bg-neutral-light rounded-lg`}
                  onClick={() => goToApp('/calendar')}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{event.title}</span>
                    {event.status === 'now' && (
                      <span className="text-xs bg-primary text-white px-2 py-0.5 rounded">Now</span>
                    )}
                  </div>
                  <div className="text-sm text-neutral-medium">{event.time} • {event.location}</div>
                </div>
              ))}
              <a 
                href="#calendar" 
                className="text-center text-primary-light text-sm block mt-2"
                onClick={(e) => {
                  e.preventDefault();
                  goToApp('/calendar');
                }}
              >
                View full calendar...
              </a>
            </div>
          </CardContent>
        </Card>
        
        {/* Popular Apps */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardContent className="p-5">
            <h2 className="text-lg font-semibold mb-4">Popular Apps</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {popularApps.map((app) => (
                <a 
                  key={app.id}
                  href={app.route} 
                  className="flex flex-col items-center justify-center p-4 hover:bg-neutral-light rounded-lg transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    goToApp(app.route);
                  }}
                >
                  <AppIcon app={app} size="md" className="mb-2" />
                  <span className="text-sm">{app.name}</span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
