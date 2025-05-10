import { useEffect, useRef, useState } from 'react';
import { useTabs } from '@/hooks/use-tabs';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function BrowserView() {
  const { currentUrl } = useTabs();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check if we should show the home page
  const isHomePage = currentUrl.includes('home.centrifugalbrowser.com');
  
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Add a timeout for loading
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    // Cleanup timeout
    return () => clearTimeout(timeoutId);
  }, [currentUrl]);
  
  const handleIframeLoad = () => {
    setLoading(false);
  };
  
  const handleIframeError = () => {
    setLoading(false);
    setError('Failed to load the requested page. Please check the URL and try again.');
  };
  
  if (isHomePage) {
    // We're not using an iframe for the home page
    return (
      <div className="flex-1 overflow-y-auto p-4 bg-neutral-lightest">
        {/* This will be replaced by the HomePage component in the actual implementation */}
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold">Welcome to Centrifugal Browser</h2>
          <p className="mt-4">The home page content will be displayed here.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 overflow-hidden relative">
      {loading && (
        <div className="absolute inset-0 bg-white z-10 p-4">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-5/6" />
            <div className="py-6">
              <Skeleton className="h-40 w-full" />
            </div>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 bg-white z-10 p-4 flex items-center justify-center">
          <Card className="max-w-md p-6">
            <h3 className="text-xl font-bold text-status-error mb-2">Error Loading Page</h3>
            <p>{error}</p>
          </Card>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        src={currentUrl}
        title="Browser View"
        className="w-full h-full border-0"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
}
