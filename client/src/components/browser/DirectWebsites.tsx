import { Search, Github, Youtube, Mail, Twitter, Facebook, Linkedin, Instagram } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface DirectWebsiteProps {
  onNavigate: (url: string) => void;
}

export function DirectWebsites({ onNavigate }: DirectWebsiteProps) {
  const websites = [
    { name: 'Google', url: 'https://google.com', icon: Search },
    { name: 'YouTube', url: 'https://youtube.com', icon: Youtube },
    { name: 'GitHub', url: 'https://github.com', icon: Github },
    { name: 'Gmail', url: 'https://mail.google.com', icon: Mail },
    { name: 'Twitter', url: 'https://twitter.com', icon: Twitter },
    { name: 'Facebook', url: 'https://facebook.com', icon: Facebook },
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: Linkedin },
    { name: 'Instagram', url: 'https://instagram.com', icon: Instagram },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Quick Access</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {websites.map((site) => (
          <Card 
            key={site.name}
            className="cursor-pointer hover:bg-neutral-light transition-colors"
            onClick={() => onNavigate(site.url)}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <site.icon className="h-8 w-8 mb-2 text-primary" />
              <span>{site.name}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}