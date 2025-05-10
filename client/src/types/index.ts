export interface User {
  id: number;
  username: string;
  displayName?: string;
  email?: string;
  avatar?: string;
}

export interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  active: boolean;
}

export interface Email {
  id: number;
  from: string;
  to: string;
  subject?: string;
  content?: string;
  attachments?: any[];
  read: boolean;
  folder: string;
  timestamp: string;
}

export interface Domain {
  id: number;
  domain: string;
  verified: boolean;
  verificationToken?: string;
  maxUsers: number;
  currentUsers: number;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  location?: string;
  color?: string;
}

export interface AppDefinition {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  route: string;
  category: 'main' | 'productivity' | 'tools' | 'media' | 'more';
}

export type AppCategory = 'main' | 'productivity' | 'tools' | 'media' | 'more';

export interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  app: string;
}
