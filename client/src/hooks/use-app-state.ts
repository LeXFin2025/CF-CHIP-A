import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppDefinition, Notification, User } from '@/types';
import { Globe, Mail, CalendarDays, FileText, PencilLine, ListTodo, Users, FolderOpen, MapPin, Languages, Cloud, Newspaper, Image, Music, Video, Mic, Calculator, Code, KeyRound, Settings } from 'lucide-react';

interface AppState {
  currentApp: string;
  sidebarOpen: boolean;
  searchQuery: string;
  appLauncherOpen: boolean;
  notifications: Notification[];
  user: User | null;
  setSidebarOpen: (open: boolean) => void;
  setCurrentApp: (app: string) => void;
  setSearchQuery: (query: string) => void;
  setAppLauncherOpen: (open: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
  markNotificationAsRead: (id: number) => void;
  clearAllNotifications: () => void;
  setUser: (user: User | null) => void;
}

export const apps: AppDefinition[] = [
  {
    id: 'browser',
    name: 'Browser',
    icon: Globe,
    color: 'bg-primary text-white',
    route: '/browser',
    category: 'main'
  },
  {
    id: 'mail',
    name: 'Mail',
    icon: Mail,
    color: 'bg-primary text-white',
    route: '/mail',
    category: 'main'
  },
  {
    id: 'calendar',
    name: 'Calendar',
    icon: CalendarDays,
    color: 'bg-accent text-white',
    route: '/calendar',
    category: 'main'
  },
  {
    id: 'documents',
    name: 'Documents',
    icon: FileText,
    color: 'bg-primary-light text-white',
    route: '/documents',
    category: 'main'
  },
  {
    id: 'notes',
    name: 'Notes',
    icon: PencilLine,
    color: 'bg-status-success text-white',
    route: '/notes',
    category: 'productivity'
  },
  {
    id: 'tasks',
    name: 'Tasks',
    icon: ListTodo,
    color: 'bg-status-warning text-white',
    route: '/tasks',
    category: 'productivity'
  },
  {
    id: 'contacts',
    name: 'Contacts',
    icon: Users,
    color: 'bg-secondary text-white',
    route: '/contacts',
    category: 'productivity'
  },
  {
    id: 'drive',
    name: 'Drive',
    icon: FolderOpen,
    color: 'bg-secondary-dark text-white',
    route: '/drive',
    category: 'productivity'
  },
  {
    id: 'maps',
    name: 'Maps',
    icon: MapPin,
    color: 'bg-primary text-white',
    route: '/maps',
    category: 'tools'
  },
  {
    id: 'translate',
    name: 'Translate',
    icon: Languages,
    color: 'bg-accent text-white',
    route: '/translate',
    category: 'tools'
  },
  {
    id: 'weather',
    name: 'Weather',
    icon: Cloud,
    color: 'bg-primary-light text-white',
    route: '/weather',
    category: 'tools'
  },
  {
    id: 'news',
    name: 'News',
    icon: Newspaper,
    color: 'bg-status-warning text-white',
    route: '/news',
    category: 'tools'
  },
  {
    id: 'photos',
    name: 'Photos',
    icon: Image,
    color: 'bg-secondary text-white',
    route: '/photos',
    category: 'media'
  },
  {
    id: 'music',
    name: 'Music',
    icon: Music,
    color: 'bg-secondary-dark text-white',
    route: '/music',
    category: 'media'
  },
  {
    id: 'videos',
    name: 'Videos',
    icon: Video,
    color: 'bg-primary text-white',
    route: '/videos',
    category: 'media'
  },
  {
    id: 'podcasts',
    name: 'Podcasts',
    icon: Mic,
    color: 'bg-accent text-white',
    route: '/podcasts',
    category: 'media'
  },
  {
    id: 'calculator',
    name: 'Calculator',
    icon: Calculator,
    color: 'bg-primary-light text-white',
    route: '/calculator',
    category: 'more'
  },
  {
    id: 'code-editor',
    name: 'Code Editor',
    icon: Code,
    color: 'bg-status-warning text-white',
    route: '/code-editor',
    category: 'more'
  },
  {
    id: 'password-manager',
    name: 'Password Manager',
    icon: KeyRound,
    color: 'bg-secondary text-white',
    route: '/password-manager',
    category: 'more'
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: Settings,
    color: 'bg-secondary-dark text-white',
    route: '/settings',
    category: 'more'
  }
];

export const getAppsByCategory = (category: string) => {
  return apps.filter(app => app.category === category);
};

export const useAppState = create<AppState>()(
  persist(
    (set) => ({
      currentApp: 'browser',
      sidebarOpen: true,
      searchQuery: '',
      appLauncherOpen: false,
      notifications: [
        {
          id: 1,
          title: 'New Email',
          message: 'You have a new email from Team Centrifugal',
          read: false,
          timestamp: new Date().toISOString(),
          type: 'info',
          app: 'mail'
        },
        {
          id: 2,
          title: 'Calendar Event',
          message: 'Team Meeting in 15 minutes',
          read: false,
          timestamp: new Date().toISOString(),
          type: 'warning',
          app: 'calendar'
        },
        {
          id: 3,
          title: 'System Update',
          message: 'Centrifugal Browser was updated to the latest version',
          read: false,
          timestamp: new Date().toISOString(),
          type: 'success',
          app: 'settings'
        }
      ],
      user: {
        id: 1,
        username: 'johndoe',
        displayName: 'John Doe',
        email: 'john.doe@centrifugalforce.free.nf',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&h=250'
      },
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setCurrentApp: (app) => set({ currentApp: app }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setAppLauncherOpen: (open) => set({ appLauncherOpen: open }),
      addNotification: (notification) => set((state) => ({ 
        notifications: [
          ...state.notifications, 
          { 
            ...notification, 
            id: state.notifications.length + 1, 
            read: false, 
            timestamp: new Date().toISOString()
          }
        ] 
      })),
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        )
      })),
      clearAllNotifications: () => set({ notifications: [] }),
      setUser: (user) => set({ user })
    }),
    {
      name: 'centrifugal-app-storage',
    }
  )
);
