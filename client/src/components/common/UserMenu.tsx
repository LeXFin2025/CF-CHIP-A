import { ReactNode, useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { User } from '@/types';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { UserCog, LogOut } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UserMenuProps {
  user: User | null;
}

const UserMenu = ({ user }: UserMenuProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(user);
  const location = useLocation();

export default UserMenu;

  useEffect(() => {
    const handleAuthentication = (event: MessageEvent) => {
      if (event.origin === 'https://auth.util.repl.co') {
        setCurrentUser(event.data.user);
        window.removeEventListener('message', handleAuthentication);
      }
    };
    window.addEventListener('message', handleAuthentication);

    return () => {
      window.removeEventListener('message', handleAuthentication);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
    setTimeout(() => {
      window.location.href = `https://replit.com/auth_with_repl_site/logout?domain=${window.location.host}`;
    }, 100);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>{currentUser ? currentUser.username : 'Login / Sign Up'}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {currentUser ? (
          <>
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{currentUser.username}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <UserCog className="h-4 w-4 mr-2" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </>
        ) : (
          <div>
            <span>Please log in or sign up</span>
            <div>
              <script
                authed="location.reload()"
                src="https://auth.util.repl.co/script.js"
              ></script>
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
