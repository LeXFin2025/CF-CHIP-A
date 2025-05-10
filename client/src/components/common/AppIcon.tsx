import { AppDefinition } from '@/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface AppIconProps {
  app: AppDefinition;
  size?: 'sm' | 'md' | 'lg';
  tooltip?: boolean;
  className?: string;
}

export function AppIcon({ app, size = 'md', tooltip = false, className = '' }: AppIconProps) {
  const Icon = app.icon;
  
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };
  
  const iconElement = (
    <div className={`${app.color} p-1 rounded-md ${size === 'lg' ? 'p-3' : size === 'md' ? 'p-2' : 'p-1'} ${className}`}>
      <Icon className={sizeClasses[size]} />
    </div>
  );
  
  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {iconElement}
        </TooltipTrigger>
        <TooltipContent>
          <p>{app.name}</p>
        </TooltipContent>
      </Tooltip>
    );
  }
  
  return iconElement;
}
