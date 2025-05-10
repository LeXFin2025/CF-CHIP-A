import { useEffect, useState } from 'react';
import { useAppState } from '@/hooks/use-app-state';
import { Cloud, CloudRain, Sun, Wind, Droplet, ThermometerSun, ThermometerSnowflake, MapPin, Calendar, Search, Plus, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type WeatherData = {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  high: number;
  low: number;
  feelsLike: number;
  precipitation: number;
  forecast: Array<{
    day: string;
    condition: string;
    high: number;
    low: number;
  }>;
  hourlyForecast: Array<{
    time: string;
    temperature: number;
    condition: string;
  }>;
};

type SavedLocation = {
  id: number;
  name: string;
  isCurrent: boolean;
};

export default function Weather() {
  const { setCurrentApp } = useAppState();
  const [searchInput, setSearchInput] = useState('');
  const [activeTab, setActiveTab] = useState('today');
  const [temperatureUnit, setTemperatureUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Sample saved locations
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([
    { id: 1, name: 'Current Location', isCurrent: true },
    { id: 2, name: 'New York', isCurrent: false },
    { id: 3, name: 'London', isCurrent: false },
    { id: 4, name: 'Tokyo', isCurrent: false },
  ]);

  // Set the current app when component mounts
  useEffect(() => {
    setCurrentApp('weather');
  }, [setCurrentApp]);

  // Fetch weather data (mock for demonstration)
  useEffect(() => {
    // Simulate API call
    const fetchWeatherData = async () => {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample weather data (in a real app, this would come from a weather API)
      const sampleData: WeatherData = {
        location: "New York, NY",
        temperature: 21,
        condition: "Partly Cloudy",
        humidity: 65,
        windSpeed: 12,
        high: 24,
        low: 18,
        feelsLike: 22,
        precipitation: 20,
        forecast: [
          { day: "Today", condition: "Partly Cloudy", high: 24, low: 18 },
          { day: "Thu", condition: "Sunny", high: 26, low: 19 },
          { day: "Fri", condition: "Cloudy", high: 23, low: 17 },
          { day: "Sat", condition: "Rain", high: 20, low: 15 },
          { day: "Sun", condition: "Sunny", high: 22, low: 16 },
          { day: "Mon", condition: "Partly Cloudy", high: 21, low: 15 },
          { day: "Tue", condition: "Sunny", high: 23, low: 17 },
        ],
        hourlyForecast: [
          { time: "Now", temperature: 21, condition: "Partly Cloudy" },
          { time: "1PM", temperature: 22, condition: "Partly Cloudy" },
          { time: "2PM", temperature: 23, condition: "Partly Cloudy" },
          { time: "3PM", temperature: 24, condition: "Sunny" },
          { time: "4PM", temperature: 24, condition: "Sunny" },
          { time: "5PM", temperature: 23, condition: "Sunny" },
          { time: "6PM", temperature: 22, condition: "Sunny" },
          { time: "7PM", temperature: 21, condition: "Partly Cloudy" },
          { time: "8PM", temperature: 20, condition: "Partly Cloudy" },
          { time: "9PM", temperature: 19, condition: "Partly Cloudy" },
          { time: "10PM", temperature: 19, condition: "Partly Cloudy" },
          { time: "11PM", temperature: 18, condition: "Partly Cloudy" },
        ]
      };
      
      setWeatherData(sampleData);
      setLoading(false);
    };
    
    fetchWeatherData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger a search for weather data
    console.log('Searching for:', searchInput);
    
    // Reset the search input
    setSearchInput('');
  };

  const toggleTemperatureUnit = () => {
    setTemperatureUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  const convertTemperature = (celsius: number): number => {
    if (temperatureUnit === 'fahrenheit') {
      return Math.round((celsius * 9/5) + 32);
    }
    return celsius;
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'partly cloudy':
        return <PartlyCloudy className="h-8 w-8 text-gray-500" />;
      case 'rain':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <Cloud className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-neutral-light p-4 flex flex-col">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-medium" />
            <Input 
              placeholder="Search city or zip code" 
              className="pl-10"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </form>
        
        <div className="space-y-1 mb-6">
          <h3 className="font-medium text-sm text-neutral-medium mb-2">SAVED LOCATIONS</h3>
          {savedLocations.map(location => (
            <Button
              key={location.id}
              variant="ghost"
              className="w-full justify-start text-left"
            >
              <div className="flex items-center w-full">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                <span className="flex-1">{location.name}</span>
                {location.isCurrent && (
                  <span className="text-xs bg-primary-light text-white px-1 py-0.5 rounded">Current</span>
                )}
              </div>
            </Button>
          ))}
          <Button variant="ghost" className="w-full justify-start text-primary">
            <Plus className="h-4 w-4 mr-2" /> Add Location
          </Button>
        </div>
        
        <div className="p-4 bg-neutral-light rounded-md">
          <h3 className="font-medium mb-2">Weather News</h3>
          <div className="space-y-3 text-sm">
            <p>Heavy rain expected in the Northeast region over the weekend.</p>
            <p>Hurricane warning issued for coastal areas. Stay informed and prepared.</p>
            <a href="#" className="text-primary hover:underline">More weather news...</a>
          </div>
        </div>
        
        <div className="mt-auto pt-4 text-sm text-neutral-medium">
          <div className="flex justify-between">
            <span>Data source: Weather API</span>
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 bg-white overflow-y-auto">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Cloud className="h-16 w-16 text-neutral-light mx-auto mb-4 animate-pulse" />
              <p className="text-neutral-medium">Loading weather data...</p>
            </div>
          </div>
        ) : weatherData ? (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold flex items-center">
                  {weatherData.location}
                  <MapPin className="h-5 w-5 ml-2 text-primary" />
                </h1>
                <p className="text-neutral-medium">
                  {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  onClick={toggleTemperatureUnit}
                  className="font-medium"
                >
                  °{temperatureUnit === 'celsius' ? 'C' : 'F'}
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Refresh</DropdownMenuItem>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuItem>Weather Maps</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="col-span-1 lg:col-span-2">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="flex items-center mr-8">
                      {getWeatherIcon(weatherData.condition)}
                      <div className="text-6xl font-bold ml-4">
                        {convertTemperature(weatherData.temperature)}°
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0">
                      <div className="text-xl font-medium">{weatherData.condition}</div>
                      <div className="text-neutral-medium">
                        Feels like {convertTemperature(weatherData.feelsLike)}° • 
                        High {convertTemperature(weatherData.high)}° • 
                        Low {convertTemperature(weatherData.low)}°
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <div className="text-center p-3 bg-neutral-light rounded-md">
                      <Wind className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                      <div className="text-sm font-medium">Wind</div>
                      <div className="text-lg">{weatherData.windSpeed} km/h</div>
                    </div>
                    
                    <div className="text-center p-3 bg-neutral-light rounded-md">
                      <Droplet className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                      <div className="text-sm font-medium">Humidity</div>
                      <div className="text-lg">{weatherData.humidity}%</div>
                    </div>
                    
                    <div className="text-center p-3 bg-neutral-light rounded-md">
                      <CloudRain className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                      <div className="text-sm font-medium">Precipitation</div>
                      <div className="text-lg">{weatherData.precipitation}%</div>
                    </div>
                    
                    <div className="text-center p-3 bg-neutral-light rounded-md">
                      <ThermometerSun className="h-6 w-6 mx-auto mb-2 text-red-500" />
                      <div className="text-sm font-medium">Feels Like</div>
                      <div className="text-lg">{convertTemperature(weatherData.feelsLike)}°</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium mb-4">7-Day Forecast</h3>
                  <div className="space-y-3">
                    {weatherData.forecast.map((day, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="w-16 font-medium">{day.day}</div>
                        <div className="flex-1 flex items-center justify-center">
                          {getWeatherIcon(day.condition)}
                          <span className="text-sm ml-2">{day.condition}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-medium">{convertTemperature(day.high)}°</span>
                          <span className="text-neutral-medium ml-2">{convertTemperature(day.low)}°</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="hourly">Hourly</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="today" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-4">Today's Forecast</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      {weatherData.hourlyForecast.slice(0, 8).map((hour, index) => (
                        <div key={index} className="text-center">
                          <div className="text-sm font-medium">{hour.time}</div>
                          <div className="my-2">
                            {getWeatherIcon(hour.condition)}
                          </div>
                          <div className="text-lg font-medium">{convertTemperature(hour.temperature)}°</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="hourly" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-4">Hourly Forecast</h3>
                    <div className="space-y-3">
                      {weatherData.hourlyForecast.map((hour, index) => (
                        <div key={index} className="flex items-center p-2 border-b last:border-b-0">
                          <div className="w-16 font-medium">{hour.time}</div>
                          <div className="w-16 text-center">
                            {getWeatherIcon(hour.condition)}
                          </div>
                          <div className="flex-1 text-sm">{hour.condition}</div>
                          <div className="text-lg font-medium">{convertTemperature(hour.temperature)}°</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="details" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-4">Weather Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm text-neutral-medium mb-2">TEMPERATURE</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Current Temperature</span>
                            <span className="font-medium">{convertTemperature(weatherData.temperature)}°</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Feels Like</span>
                            <span className="font-medium">{convertTemperature(weatherData.feelsLike)}°</span>
                          </div>
                          <div className="flex justify-between">
                            <span>High</span>
                            <span className="font-medium">{convertTemperature(weatherData.high)}°</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Low</span>
                            <span className="font-medium">{convertTemperature(weatherData.low)}°</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-neutral-medium mb-2">CONDITIONS</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Weather</span>
                            <span className="font-medium">{weatherData.condition}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Wind Speed</span>
                            <span className="font-medium">{weatherData.windSpeed} km/h</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Humidity</span>
                            <span className="font-medium">{weatherData.humidity}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Precipitation</span>
                            <span className="font-medium">{weatherData.precipitation}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Cloud className="h-16 w-16 text-neutral-light mx-auto mb-4" />
              <p className="text-neutral-medium">No weather data available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Component for partly cloudy icon
function PartlyCloudy(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12 2v2" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M18.4 5.6l-1.4 1.4" />
      <path d="M5.6 5.6l1.4 1.4" />
      <path d="M12 4a8 8 0 0 1 0 16H5.47A3.47 3.47 0 0 1 2 16.53v-.34A3.18 3.18 0 0 1 5.18 13h.14A8 8 0 0 1 12 4z" />
    </svg>
  );
}
