import { useEffect, useRef, useState } from 'react';
import { useTabs } from '@/hooks/use-tabs';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function BrowserView() {
  const { currentUrl, updateActiveTabUrl } = useTabs();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Process the URL to ensure it has the right format
  const processUrl = (url: string) => {
    if (url.includes('home.centrifugalbrowser.com')) {
      return url;
    }
    
    // Add https:// if no protocol is specified
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    
    return url;
  };
  
  const validUrl = processUrl(currentUrl);
  
  // Check if we should show the home page
  const isHomePage = validUrl.includes('home.centrifugalbrowser.com') || validUrl === 'about:blank';
  
  useEffect(() => {
    if (validUrl !== currentUrl) {
      updateActiveTabUrl(validUrl);
    }
    
    setLoading(true);
    setError(null);
    
    // Add a timeout for loading
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    // Cleanup timeout
    return () => clearTimeout(timeoutId);
  }, [validUrl, currentUrl, updateActiveTabUrl]);
  
  const handleIframeLoad = () => {
    setLoading(false);
  };
  
  const handleIframeError = () => {
    setLoading(false);
    setError('Failed to load the requested page. Please check the URL and try again.');
  };
  
  const reload = () => {
    setLoading(true);
    setError(null);
    
    if (iframeRef.current) {
      iframeRef.current.src = validUrl;
    }
    
    // Add a timeout for loading
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };
  
  if (isHomePage) {
    // We're not using an iframe for the home page
    return (
      <div className="flex-1 overflow-y-auto p-4 bg-[#121212] text-white">
        <div className="container mx-auto max-w-4xl py-12">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Welcome to Centrifugal Browser</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Card className="p-6 bg-[#1a1a1a] border-[#333] text-white">
              <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
              <div className="space-y-2">
                <a href="https://google.com" className="block p-2 hover:bg-[#333] rounded transition-colors">Google</a>
                <a href="https://github.com" className="block p-2 hover:bg-[#333] rounded transition-colors">GitHub</a>
                <a href="https://youtube.com" className="block p-2 hover:bg-[#333] rounded transition-colors">YouTube</a>
                <a href="https://reddit.com" className="block p-2 hover:bg-[#333] rounded transition-colors">Reddit</a>
              </div>
            </Card>
            
            <Card className="p-6 bg-[#1a1a1a] border-[#333] text-white">
              <h2 className="text-2xl font-semibold mb-4">Integrated Apps</h2>
              <div className="space-y-2">
                <a href="/mail" className="block p-2 hover:bg-[#333] rounded transition-colors">Mail</a>
                <a href="/calendar" className="block p-2 hover:bg-[#333] rounded transition-colors">Calendar</a>
                <a href="/documents" className="block p-2 hover:bg-[#333] rounded transition-colors">Documents</a>
                <a href="/drive" className="block p-2 hover:bg-[#333] rounded transition-colors">Drive</a>
              </div>
            </Card>
          </div>
          
          <div className="mt-12">
            <Card className="p-6 bg-[#1a1a1a] border-[#333] text-white">
              <h2 className="text-2xl font-semibold mb-4">About Centrifugal Browser</h2>
              <p className="mb-4">
                A high-performance browser with integrated applications designed for productivity and security.
                Featuring CF Chip A supercomputer backend technology and 50GB storage per user.
              </p>
              <p>
                Type a URL in the address bar above to start browsing, or use one of the integrated applications from the sidebar.
              </p>
            </Card>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 overflow-hidden relative">
      {loading && (
        <div className="absolute inset-0 bg-[#121212] text-white z-10 p-4">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4 bg-[#333]" />
            <Skeleton className="h-4 w-1/2 bg-[#333]" />
            <Skeleton className="h-4 w-5/6 bg-[#333]" />
            <div className="py-6">
              <Skeleton className="h-40 w-full bg-[#333]" />
            </div>
            <Skeleton className="h-4 w-3/4 bg-[#333]" />
            <Skeleton className="h-4 w-2/3 bg-[#333]" />
            <Skeleton className="h-4 w-1/2 bg-[#333]" />
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 bg-[#121212] z-10 p-4 flex items-center justify-center">
          <Card className="max-w-md p-6 bg-[#1a1a1a] border-[#333] text-white">
            <h3 className="text-xl font-bold text-red-500 mb-2">Error Loading Page</h3>
            <p className="mb-4">{error}</p>
            <div className="flex justify-end">
              <Button onClick={reload} className="bg-primary hover:bg-primary/90">
                <RefreshCw className="h-4 w-4 mr-2" /> Retry
              </Button>
            </div>
          </Card>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        src={validUrl}
        title="Browser View"
        className="w-full h-full border-0"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
}
