import { useEffect, useState } from 'react';
import { useAppState } from '@/hooks/use-app-state';
import { MapPin, Search, Navigation, Compass, LocateFixed, Plus, Minus, Map, Layers, Info, Route, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function Maps() {
  const { setCurrentApp } = useAppState();
  const [searchValue, setSearchValue] = useState('');
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain'>('roadmap');
  const [zoom, setZoom] = useState(12);
  const [activeTab, setActiveTab] = useState('explore');
  
  // Set the current app when component mounts
  useEffect(() => {
    setCurrentApp('maps');
  }, [setCurrentApp]);
  
  // Sample locations for quick access
  const savedLocations = [
    { id: 1, name: 'Home', address: '123 Main St, Anytown, USA', coords: { lat: 40.7128, lng: -74.0060 } },
    { id: 2, name: 'Work', address: '456 Market St, Somewhere, USA', coords: { lat: 37.7749, lng: -122.4194 } },
    { id: 3, name: 'Gym', address: '789 Fitness Ave, Exerciseville, USA', coords: { lat: 34.0522, lng: -118.2437 } },
    { id: 4, name: 'Favorite Restaurant', address: '321 Food Blvd, Tastyton, USA', coords: { lat: 41.8781, lng: -87.6298 } },
  ];
  
  // Sample search results
  const searchResults = [
    { id: 1, name: 'Central Park', address: 'New York, NY 10022', type: 'Park' },
    { id: 2, name: 'Empire State Building', address: '20 W 34th St, New York, NY 10001', type: 'Landmark' },
    { id: 3, name: 'Times Square', address: 'Manhattan, NY 10036', type: 'Plaza' },
    { id: 4, name: 'Statue of Liberty', address: 'New York, NY 10004', type: 'Monument' },
    { id: 5, name: 'Brooklyn Bridge', address: 'New York, NY 10038', type: 'Bridge' },
  ];
  
  // Sample recent searches
  const recentSearches = [
    { id: 1, query: 'Coffee shops near me', timestamp: '2023-09-20T10:15:00Z' },
    { id: 2, query: 'Gas stations', timestamp: '2023-09-19T14:30:00Z' },
    { id: 3, query: 'Italian restaurants', timestamp: '2023-09-18T19:45:00Z' },
    { id: 4, query: 'Hotels in Chicago', timestamp: '2023-09-15T08:20:00Z' },
  ];
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchValue);
    // In a real app, this would trigger an API call
  };
  
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 1, 20));
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 1, 1));
  };
  
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-neutral-light p-4 flex flex-col z-10">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-medium" />
            <Input 
              placeholder="Search places or addresses" 
              className="pl-10 pr-10"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {searchValue && (
              <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-2 h-5 w-5 p-0.5"
                onClick={() => setSearchValue('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button type="submit" className="sr-only">Search</Button>
        </form>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="explore">Explore</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
          
          <TabsContent value="explore" className="mt-2">
            {searchValue ? (
              <div>
                <h3 className="font-medium mb-2">Search Results</h3>
                <div className="space-y-2">
                  {searchResults.map(result => (
                    <div 
                      key={result.id} 
                      className="p-3 rounded-md hover:bg-neutral-light cursor-pointer"
                    >
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-2 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">{result.name}</div>
                          <div className="text-sm text-neutral-medium">{result.address}</div>
                          <div className="text-xs text-neutral-medium">{result.type}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Nearby</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="justify-start h-auto py-2">
                      <Coffee className="h-4 w-4 mr-2" />
                      Restaurants
                    </Button>
                    <Button variant="outline" className="justify-start h-auto py-2">
                      <Hotel className="h-4 w-4 mr-2" />
                      Hotels
                    </Button>
                    <Button variant="outline" className="justify-start h-auto py-2">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Shopping
                    </Button>
                    <Button variant="outline" className="justify-start h-auto py-2">
                      <Car className="h-4 w-4 mr-2" />
                      Gas Stations
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Popular Destinations</h3>
                  <div className="space-y-2">
                    {searchResults.slice(0, 3).map(result => (
                      <div 
                        key={result.id} 
                        className="p-3 rounded-md hover:bg-neutral-light cursor-pointer"
                      >
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 mr-2 text-primary mt-0.5" />
                          <div>
                            <div className="font-medium">{result.name}</div>
                            <div className="text-sm text-neutral-medium">{result.address}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="saved" className="mt-2">
            <div className="space-y-2">
              {savedLocations.map(location => (
                <div 
                  key={location.id} 
                  className="p-3 rounded-md hover:bg-neutral-light cursor-pointer"
                >
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium">{location.name}</div>
                      <div className="text-sm text-neutral-medium">{location.address}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add New Place
            </Button>
          </TabsContent>
          
          <TabsContent value="recent" className="mt-2">
            <div className="space-y-2">
              {recentSearches.map(search => (
                <div 
                  key={search.id} 
                  className="p-3 rounded-md hover:bg-neutral-light cursor-pointer"
                >
                  <div className="flex items-start">
                    <History className="h-5 w-5 mr-2 text-neutral-medium mt-0.5" />
                    <div>
                      <div className="font-medium">{search.query}</div>
                      <div className="text-xs text-neutral-medium">
                        {new Date(search.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              <Trash className="h-4 w-4 mr-2" />
              Clear History
            </Button>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Map View */}
      <div className="flex-1 bg-neutral-lightest relative">
        {/* Map content - In a real app, this would be a map component */}
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-center">
            <Map className="h-32 w-32 text-neutral-light mx-auto mb-4" />
            <p className="text-neutral-medium">
              In a real application, this would display an interactive map using a library like Google Maps, Mapbox, or Leaflet.
            </p>
          </div>
        </div>
        
        {/* Map Controls */}
        <div className="absolute top-4 right-4 bg-white rounded-md shadow-md">
          <div className="p-2 flex flex-col items-center space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleZoomIn}>
                  <Plus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
            
            <div className="text-sm font-medium">{zoom}</div>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleZoomOut}>
                  <Minus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>
          </div>
        </div>
        
        <div className="absolute bottom-4 right-4 bg-white rounded-md shadow-md">
          <div className="p-2 flex flex-col items-center space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={mapType === 'roadmap' ? 'default' : 'ghost'} 
                  size="icon"
                  onClick={() => setMapType('roadmap')}
                >
                  <Map className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Road Map</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={mapType === 'satellite' ? 'default' : 'ghost'} 
                  size="icon"
                  onClick={() => setMapType('satellite')}
                >
                  <Satellite className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Satellite</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={mapType === 'terrain' ? 'default' : 'ghost'} 
                  size="icon"
                  onClick={() => setMapType('terrain')}
                >
                  <Mountain className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Terrain</TooltipContent>
            </Tooltip>
          </div>
        </div>
        
        <div className="absolute bottom-4 left-4 bg-white rounded-md shadow-md">
          <div className="p-2 flex flex-col items-center space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <LocateFixed className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>My Location</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Compass className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Compass</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Route className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Directions</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}

// Additional icons
function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function Coffee(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  );
}

function Hotel(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M3 14h18" />
      <path d="M3 14v7h18v-7" />
      <path d="M21 12a9 9 0 0 0-18 0" />
      <path d="M12 12h.01" />
      <path d="M19 6.3a9 9 0 0 0-14 0" />
      <path d="M8 12h.01" />
      <path d="M16 12h.01" />
    </svg>
  );
}

function ShoppingCart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function Car(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" />
      <circle cx="6.5" cy="16.5" r="2.5" />
      <circle cx="16.5" cy="16.5" r="2.5" />
    </svg>
  );
}

function Satellite(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
      <circle cx="12" cy="12" r="2" />
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
    </svg>
  );
}

function Mountain(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M8 3L4 15l4-2 4 2-3-12" />
      <path d="M12 3l4 12 4-2-4-10" />
      <path d="M2 21h20" />
    </svg>
  );
}

function Trash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
