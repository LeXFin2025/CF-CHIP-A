import { useTabs } from '@/hooks/use-tabs';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TabBar() {
  const { tabs, addTab, closeTab, activateTab } = useTabs();
  
  return (
    <div className="bg-white border-b border-neutral-light px-2 py-1 flex items-center">
      <div className="flex-1 flex items-center overflow-x-auto space-x-1 pr-2">
        {tabs.map((tab) => (
          <div 
            key={tab.id}
            className={`browser-tab flex items-center ${tab.active 
              ? 'bg-white border-b-2 border-primary rounded-t' 
              : 'bg-neutral-light rounded'
            } px-3 py-1.5 text-sm max-w-xs cursor-pointer`}
            onClick={() => activateTab(tab.id)}
          >
            {tab.favicon && (
              <img 
                src={tab.favicon} 
                alt="Tab favicon" 
                className="h-4 w-4 mr-2"
                onError={(e) => {
                  // If image fails to load, replace with default icon
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1656618020911-1c7a937175fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=16&h=16';
                }}
              />
            )}
            <span className="truncate">{tab.title}</span>
            <Button
              variant="ghost"
              size="icon"
              className="tab-close ml-2 text-neutral-medium hover:text-neutral-dark h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        ))}
        
        <Button
          variant="ghost"
          size="icon"
          className="text-neutral-medium hover:text-neutral-dark p-1"
          onClick={() => addTab()}
        >
          <PlusCircle className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
