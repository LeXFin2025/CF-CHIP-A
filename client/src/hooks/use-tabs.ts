import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tab } from '@/types';
import { nanoid } from 'nanoid';

interface TabsState {
  tabs: Tab[];
  currentUrl: string;
  addTab: (tab?: Partial<Tab>) => void;
  closeTab: (id: string) => void;
  updateTab: (id: string, updates: Partial<Tab>) => void;
  activateTab: (id: string) => void;
  setUrl: (url: string) => void;
  updateActiveTabUrl: (url: string) => void;
  getActiveTab: () => Tab | undefined;
}

export const useTabs = create<TabsState>()(
  persist(
    (set, get) => ({
      tabs: [
        {
          id: nanoid(),
          title: 'New Tab',
          url: 'https://home.centrifugalbrowser.com',
          favicon: 'https://images.unsplash.com/photo-1612810806695-30f7a8258391?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=16&h=16',
          active: true,
        }
      ],
      currentUrl: 'https://home.centrifugalbrowser.com',
      
      addTab: (tab = {}) => set((state) => {
        // First deactivate all tabs
        const updatedTabs = state.tabs.map((t) => ({
          ...t,
          active: false,
        }));
        
        // Create new tab with passed properties or defaults
        const newTab: Tab = {
          id: nanoid(),
          title: tab.title || 'New Tab',
          url: tab.url || 'https://home.centrifugalbrowser.com',
          favicon: tab.favicon || 'https://images.unsplash.com/photo-1656618020911-1c7a937175fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=16&h=16',
          active: true, // New tab is always active
        };
        
        return { 
          tabs: [...updatedTabs, newTab],
          currentUrl: newTab.url
        };
      }),
      
      closeTab: (id) => set((state) => {
        // If we're closing the active tab, we need to activate another one
        const isActiveTab = state.tabs.find((t) => t.id === id)?.active;
        const remainingTabs = state.tabs.filter((t) => t.id !== id);
        
        // If there are no tabs left, add a new default tab
        if (remainingTabs.length === 0) {
          const newTab: Tab = {
            id: nanoid(),
            title: 'New Tab',
            url: 'https://home.centrifugalbrowser.com',
            favicon: 'https://images.unsplash.com/photo-1656618020911-1c7a937175fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=16&h=16',
            active: true,
          };
          return { 
            tabs: [newTab],
            currentUrl: newTab.url
          };
        }
        
        // If we closed the active tab, activate the tab to the left or the first tab
        if (isActiveTab && remainingTabs.length > 0) {
          const indexOfClosedTab = state.tabs.findIndex((t) => t.id === id);
          const newActiveIndex = Math.max(0, indexOfClosedTab - 1);
          
          const updatedTabs = remainingTabs.map((t, index) => ({
            ...t,
            active: index === newActiveIndex,
          }));
          
          return { 
            tabs: updatedTabs,
            currentUrl: updatedTabs[newActiveIndex].url
          };
        }
        
        return { tabs: remainingTabs };
      }),
      
      updateTab: (id, updates) => set((state) => ({
        tabs: state.tabs.map((tab) =>
          tab.id === id ? { ...tab, ...updates } : tab
        ),
      })),
      
      activateTab: (id) => set((state) => {
        const updatedTabs = state.tabs.map((tab) => ({
          ...tab,
          active: tab.id === id,
        }));
        
        const activeTab = updatedTabs.find(tab => tab.id === id);
        
        return { 
          tabs: updatedTabs,
          currentUrl: activeTab ? activeTab.url : state.currentUrl
        };
      }),
      
      setUrl: (url) => set({ currentUrl: url }),
      
      updateActiveTabUrl: (url) => set((state) => {
        const updatedTabs = state.tabs.map((tab) => {
          if (tab.active) {
            return {
              ...tab,
              url,
              // Update title based on URL for simplicity, in a real app this would be fetched from the page
              title: url.includes('home.centrifugalbrowser.com') 
                ? 'Centrifugal Browser - Home' 
                : url.split('//')[1]?.split('/')[0] || 'New Tab'
            };
          }
          return tab;
        });
        
        return { 
          tabs: updatedTabs,
          currentUrl: url
        };
      }),
      
      getActiveTab: () => {
        return get().tabs.find(tab => tab.active);
      }
    }),
    {
      name: 'centrifugal-tabs-storage',
    }
  )
);
