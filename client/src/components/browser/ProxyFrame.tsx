import { useState, useEffect } from 'react';

interface ProxyFrameProps {
  url: string;
  onLoad?: () => void;
  onError?: () => void;
  className?: string;
}

/**
 * A component that renders an iframe with a public proxy for sites that have X-Frame-Options restrictions
 */
export function ProxyFrame({ url, onLoad, onError, className }: ProxyFrameProps) {
  const [proxyUrl, setProxyUrl] = useState('');
  
  useEffect(() => {
    if (!url) return;
    
    // Generate URL for a public proxy service
    // Using a basic URL proxy for demonstration
    const encodedUrl = encodeURIComponent(url);
    setProxyUrl(`https://api.allorigins.win/raw?url=${encodedUrl}`);
  }, [url]);
  
  return (
    <iframe
      src={proxyUrl}
      className={className || "w-full h-full border-0"}
      onLoad={onLoad}
      onError={onError}
      allowFullScreen
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
    />
  );
}