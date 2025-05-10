import { useState, KeyboardEvent } from 'react';
import { useAppState } from '@/hooks/use-app-state';
import { useTabs } from '@/hooks/use-tabs';
import { ArrowLeft, ArrowRight, RefreshCw, Lock, MoreVertical, User, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function AddressBar() {
  const { currentUrl, updateActiveTabUrl } = useTabs();
  const [inputUrl, setInputUrl] = useState(currentUrl);
  
  // Update input when active tab changes
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(e.target.value);
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigateToUrl();
    }
  };
  
  const navigateToUrl = () => {
    let url = inputUrl.trim();
    
    // Check if the URL has a protocol, if not add https://
    if (!/^https?:\/\//i.test(url)) {
      // Check if it's a domain-like string
      if (/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(url)) {
        url = `https://${url}`;
      } 
      // Treat as a search query if not a valid URL
      else if (!url.includes(' ') && /\.[a-z]{2,}$/i.test(url)) {
        url = `https://${url}`;
      } else {
        // Convert to a search query
        url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      }
    }
    
    updateActiveTabUrl(url);
    setInputUrl(url);
  };
  
  const handleRefresh = () => {
    // In a real browser, this would reload the page
    // For demonstration, we'll just re-navigate to the current URL
    updateActiveTabUrl(currentUrl);
  };
  
  const isSecure = currentUrl.startsWith('https://');
  
  return (
    <div className="bg-white px-4 py-2 flex items-center space-x-2 border-b border-neutral-light">
      <Button 
        variant="ghost" 
        size="icon" 
        className="p-1 text-neutral-medium hover:text-neutral-dark rounded-full hover:bg-neutral-light"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="p-1 text-neutral-medium hover:text-neutral-dark rounded-full hover:bg-neutral-light"
      >
        <ArrowRight className="h-5 w-5" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="p-1 text-neutral-medium hover:text-neutral-dark rounded-full hover:bg-neutral-light"
        onClick={handleRefresh}
      >
        <RefreshCw className="h-5 w-5" />
      </Button>
      
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isSecure ? (
            <Lock className="h-4 w-4 text-status-success" />
          ) : (
            <Info className="h-4 w-4 text-status-warning" />
          )}
        </div>
        <Input 
          type="text" 
          value={inputUrl}
          onChange={handleUrlChange}
          onKeyDown={handleKeyDown}
          className="block w-full pl-10 pr-10 py-1.5 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light text-sm"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-neutral-medium hover:text-neutral-dark p-1"
              >
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Site information</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="p-1 text-neutral-medium hover:text-neutral-dark rounded-full hover:bg-neutral-light"
      >
        <MoreVertical className="h-5 w-5" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="p-1 text-neutral-medium hover:text-neutral-dark rounded-full hover:bg-neutral-light"
      >
        <User className="h-5 w-5" />
      </Button>
    </div>
  );
}
