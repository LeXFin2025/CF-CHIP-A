import { ReactNode, useState } from 'react';
import { useLocation } from 'wouter';
import { User } from '@/types';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserCog, LogOut, Mail, User as UserIcon } from 'lucide-react';

interface UserMenuProps {
  user: User | null;
  trigger: ReactNode;
}

export function UserMenu({ user, trigger }: UserMenuProps) {
  const [, navigate] = useLocation();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          {trigger}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user?.displayName || user?.username || 'Guest'}</p>
            <p className="text-xs text-muted-foreground">{user?.email || 'No email'}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/mail')}>
          <Mail className="h-4 w-4 mr-2" />
          <span>Inbox</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          <UserCog className="h-4 w-4 mr-2" />
          <span>Account Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="h-4 w-4 mr-2" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
