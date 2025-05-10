import { useAppState } from '@/hooks/use-app-state';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, InfoIcon, BadgeAlert, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NotificationCenterProps {
  onClose: () => void;
}

export function NotificationCenter({ onClose }: NotificationCenterProps) {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useAppState();
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-status-success" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-status-warning" />;
      case 'error':
        return <BadgeAlert className="h-5 w-5 text-status-error" />;
      default:
        return <InfoIcon className="h-5 w-5 text-primary" />;
    }
  };
  
  return (
    <Card className="absolute top-10 right-0 w-80 z-50 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Notifications</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>You have {notifications.filter(n => !n.read).length} unread notifications</CardDescription>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-4 text-neutral-medium">
            <p>No notifications</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-2 rounded-md ${notification.read ? 'bg-neutral-light bg-opacity-50' : 'bg-neutral-light'}`}
                onClick={() => markNotificationAsRead(notification.id)}
              >
                <div className="flex items-start gap-2">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <div className="font-medium text-sm">{notification.title}</div>
                    <p className="text-xs text-neutral-medium">{notification.message}</p>
                    <div className="text-xs text-neutral-medium mt-1">
                      {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-2">
        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" className="w-full text-xs" onClick={clearAllNotifications}>
            Clear all
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
