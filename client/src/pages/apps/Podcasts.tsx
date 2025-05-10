import { useEffect, useState } from 'react';
import { useAppState } from '@/hooks/use-app-state';
import { Headphones, Search, Play, Pause, SkipBack, SkipForward, Volume2, ListMusic, BarChart2, Clock, Heart, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Podcast = {
  id: number;
  title: string;
  host: string;
  coverArt: string;
  description: string;
  category: string;
  favorite: boolean;
  episodes: PodcastEpisode[];
};

type PodcastEpisode = {
  id: number;
  title: string;
  description: string;
  duration: number; // in seconds
  publishDate: string;
  listened: boolean;
  progress: number; // percentage listened
};

export default function Podcasts() {
  const { setCurrentApp } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('discover');
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(0);
  
  // Set the current app when component mounts
  useEffect(() => {
    setCurrentApp('podcasts');
  }, [setCurrentApp]);
  
  // Sample podcast data (in a real app, this would come from an API)
  const podcasts: Podcast[] = [
    {
      id: 1,
      title: "Tech Talk Weekly",
      host: "Sarah Johnson",
      coverArt: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=300&h=300",
      description: "Weekly discussions about the latest in technology, gadgets, and digital trends.",
      category: "Technology",
      favorite: true,
      episodes: [
        {
          id: 101,
          title: "The Future of AI in Everyday Life",
          description: "This week we discuss how artificial intelligence is becoming increasingly integrated into our daily routines and what that means for society.",
          duration: 2856, // 47:36
          publishDate: "2023-09-15T14:30:00Z",
          listened: true,
          progress: 100
        },
        {
          id: 102,
          title: "Are Foldable Phones Here to Stay?",
          description: "We review the latest foldable smartphones and discuss whether this form factor will become mainstream or remain a niche product.",
          duration: 2412, // 40:12
          publishDate: "2023-09-08T14:30:00Z",
          listened: true,
          progress: 100
        },
        {
          id: 103,
          title: "The Rise of Quantum Computing",
          description: "An exploration of quantum computing technology, its potential applications, and how it might change the tech landscape in the coming decade.",
          duration: 3240, // 54:00
          publishDate: "2023-09-01T14:30:00Z",
          listened: false,
          progress: 35
        }
      ]
    },
    {
      id: 2,
      title: "True Crime Stories",
      host: "Michael Roberts",
      coverArt: "https://images.unsplash.com/photo-1569144157591-c60f3f82f137?auto=format&fit=crop&w=300&h=300",
      description: "In-depth examinations of famous criminal cases, with expert analysis and interviews.",
      category: "True Crime",
      favorite: false,
      episodes: [
        {
          id: 201,
          title: "The Mysterious Disappearance of Amelia Thompson",
          description: "We investigate the strange case of Amelia Thompson, who vanished without a trace in 2018 and the theories surrounding her disappearance.",
          duration: 3660, // 1:01:00
          publishDate: "2023-09-12T10:00:00Z",
          listened: false,
          progress: 0
        },
        {
          id: 202,
          title: "The Bank Heist That Shocked a Nation",
          description: "The story of one of the most daring bank robberies in history and how it changed security protocols forever.",
          duration: 3125, // 52:05
          publishDate: "2023-09-05T10:00:00Z",
          listened: false,
          progress: 0
        }
      ]
    },
    {
      id: 3,
      title: "Mindful Meditation",
      host: "Dr. Emma Chen",
      coverArt: "https://images.unsplash.com/photo-1494972308805-463bc619d34e?auto=format&fit=crop&w=300&h=300",
      description: "Guided meditation sessions and discussions about mindfulness and mental health.",
      category: "Health & Wellness",
      favorite: true,
      episodes: [
        {
          id: 301,
          title: "10-Minute Morning Meditation",
          description: "Start your day with this quick but effective guided meditation designed to center you for the day ahead.",
          duration: 670, // 11:10
          publishDate: "2023-09-17T07:00:00Z",
          listened: false,
          progress: 0
        },
        {
          id: 302,
          title: "Stress Relief Meditation",
          description: "A 20-minute guided meditation specifically designed to help you release tension and reduce stress levels.",
          duration: 1260, // 21:00
          publishDate: "2023-09-10T07:00:00Z",
          listened: true,
          progress: 100
        },
        {
          id: 303,
          title: "The Science of Mindfulness",
          description: "Dr. Chen discusses the scientific research behind mindfulness practices and their proven benefits for mental health.",
          duration: 1845, // 30:45
          publishDate: "2023-09-03T07:00:00Z",
          listened: false,
          progress: 0
        }
      ]
    },
    {
      id: 4,
      title: "Business Insights",
      host: "James Wilson",
      coverArt: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=300&h=300",
      description: "Interviews with successful entrepreneurs and business leaders sharing their insights and strategies.",
      category: "Business",
      favorite: false,
      episodes: [
        {
          id: 401,
          title: "Building a Sustainable Business Model",
          description: "Learn how to create a business model that's not only profitable but also environmentally and socially sustainable.",
          duration: 2735, // 45:35
          publishDate: "2023-09-14T12:00:00Z",
          listened: false,
          progress: 0
        },
        {
          id: 402,
          title: "From Startup to Industry Leader: An Interview with CEO Lisa Grant",
          description: "Lisa Grant shares her journey of growing her startup into a major player in the tech industry.",
          duration: 3125, // 52:05
          publishDate: "2023-09-07T12:00:00Z",
          listened: false,
          progress: 0
        }
      ]
    }
  ];
  
  // Filter podcasts based on search query
  const filteredPodcasts = podcasts.filter(podcast => 
    podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    podcast.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
    podcast.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // List of categories from all podcasts
  const categories = Array.from(new Set(podcasts.map(podcast => podcast.category))).sort();
  
  const handlePlayEpisode = (podcast: Podcast, episode: PodcastEpisode) => {
    setSelectedPodcast(podcast);
    setCurrentEpisode(episode);
    setIsPlaying(true);
    // In a real app, this would trigger the actual audio playback
  };
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would control the actual audio playback
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    // In a real app, this would set the volume of the audio playback
  };
  
  const handleProgressChange = (value: number[]) => {
    setProgress(value[0]);
    // In a real app, this would seek to a specific position in the track
  };
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    } else {
      return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const handleToggleFavorite = (podcastId: number) => {
    // In a real app, this would update the database
    // For now, let's just pretend we're updating it
    console.log(`Toggling favorite for podcast ${podcastId}`);
  };
  
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-neutral-light flex flex-col">
        <div className="p-4 border-b border-neutral-light">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-medium" />
            <Input 
              placeholder="Search podcasts" 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4">
            <h3 className="font-medium text-sm text-neutral-medium mb-2">LIBRARY</h3>
            <div className="space-y-1">
              <Button
                variant={activeTab === 'discover' ? 'secondary' : 'ghost'}
                className="w-full justify-start text-left"
                onClick={() => setActiveTab('discover')}
              >
                <Headphones className="h-4 w-4 mr-3" /> Discover
              </Button>
              <Button
                variant={activeTab === 'subscribed' ? 'secondary' : 'ghost'}
                className="w-full justify-start text-left"
                onClick={() => setActiveTab('subscribed')}
              >
                <ListMusic className="h-4 w-4 mr-3" /> Subscribed
              </Button>
              <Button
                variant={activeTab === 'favorites' ? 'secondary' : 'ghost'}
                className="w-full justify-start text-left"
                onClick={() => setActiveTab('favorites')}
              >
                <Heart className="h-4 w-4 mr-3" /> Favorites
              </Button>
              <Button
                variant={activeTab === 'trending' ? 'secondary' : 'ghost'}
                className="w-full justify-start text-left"
                onClick={() => setActiveTab('trending')}
              >
                <BarChart2 className="h-4 w-4 mr-3" /> Trending
              </Button>
              <Button
                variant={activeTab === 'recent' ? 'secondary' : 'ghost'}
                className="w-full justify-start text-left"
                onClick={() => setActiveTab('recent')}
              >
                <Clock className="h-4 w-4 mr-3" /> Recently Played
              </Button>
            </div>
            
            <h3 className="font-medium text-sm text-neutral-medium mt-6 mb-2">CATEGORIES</h3>
            <div className="space-y-1">
              {categories.map(category => (
                <Button
                  key={category}
                  variant="ghost"
                  className="w-full justify-start text-left"
                >
                  <Headphones className="h-4 w-4 mr-3" /> {category}
                </Button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 bg-white flex flex-col">
        <div className="p-4 border-b border-neutral-light">
          <h2 className="text-xl font-bold">
            {activeTab === 'discover' 
              ? 'Discover Podcasts' 
              : activeTab === 'subscribed' 
                ? 'Subscribed Podcasts' 
                : activeTab === 'favorites' 
                  ? 'Favorite Podcasts' 
                  : activeTab === 'trending' 
                    ? 'Trending Podcasts' 
                    : 'Recently Played'}
          </h2>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4">
            {selectedPodcast ? (
              <div>
                <Button 
                  variant="ghost" 
                  className="mb-4"
                  onClick={() => setSelectedPodcast(null)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Podcasts
                </Button>
                
                <div className="flex items-center mb-6">
                  <img 
                    src={selectedPodcast.coverArt} 
                    alt={selectedPodcast.title}
                    className="h-32 w-32 object-cover rounded-md mr-4"
                  />
                  <div>
                    <h2 className="text-2xl font-bold">{selectedPodcast.title}</h2>
                    <div className="text-neutral-medium">{selectedPodcast.host}</div>
                    <div className="flex items-center mt-2">
                      <Badge variant="outline" className="mr-2">
                        {selectedPodcast.category}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleToggleFavorite(selectedPodcast.id)}
                      >
                        <Heart className={`h-4 w-4 ${selectedPodcast.favorite ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-neutral-medium mb-6">
                  {selectedPodcast.description}
                </p>
                
                <h3 className="font-semibold mb-4">Episodes</h3>
                {selectedPodcast.episodes.map(episode => (
                  <div 
                    key={episode.id} 
                    className={`p-4 border-b border-neutral-light hover:bg-neutral-light ${
                      currentEpisode?.id === episode.id ? 'bg-neutral-light' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{episode.title}</h4>
                        <div className="text-sm text-neutral-medium my-1">
                          {formatDate(episode.publishDate)} • {formatTime(episode.duration)}
                        </div>
                        <p className="text-sm text-neutral-medium line-clamp-2">
                          {episode.description}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-10 w-10 rounded-full ml-4 flex-shrink-0"
                        onClick={() => handlePlayEpisode(selectedPodcast, episode)}
                      >
                        {currentEpisode?.id === episode.id && isPlaying 
                          ? <Pause className="h-4 w-4" /> 
                          : <Play className="h-4 w-4" />}
                      </Button>
                    </div>
                    {episode.progress > 0 && episode.progress < 100 && (
                      <div className="mt-2">
                        <div className="h-1 bg-neutral-light rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${episode.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPodcasts.map(podcast => (
                  <div 
                    key={podcast.id} 
                    className="border border-neutral-light rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    onClick={() => setSelectedPodcast(podcast)}
                  >
                    <div className="relative">
                      <img 
                        src={podcast.coverArt} 
                        alt={podcast.title}
                        className="h-40 w-full object-cover"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2 h-8 w-8 bg-white bg-opacity-80 hover:bg-opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(podcast.id);
                        }}
                      >
                        <Heart className={`h-4 w-4 ${podcast.favorite ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium truncate">{podcast.title}</h3>
                      <div className="text-sm text-neutral-medium truncate">{podcast.host}</div>
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="outline" className="text-xs">
                          {podcast.category}
                        </Badge>
                        <div className="text-xs text-neutral-medium">
                          {podcast.episodes.length} episode{podcast.episodes.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Player at the bottom */}
        {currentEpisode && (
          <div className="p-3 border-t border-neutral-light flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center flex-1">
                {selectedPodcast && (
                  <>
                    <div className="h-12 w-12 mr-3 overflow-hidden rounded-md flex-shrink-0">
                      <img 
                        src={selectedPodcast.coverArt} 
                        alt={selectedPodcast.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{currentEpisode.title}</div>
                      <div className="text-sm text-neutral-medium truncate">{selectedPodcast.title}</div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-10 w-10 rounded-full"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-2 flex-1 justify-end">
                <Volume2 className="h-4 w-4 text-neutral-medium mr-2" />
                <div className="w-24">
                  <Slider
                    value={[volume]}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-xs text-neutral-medium">
                {formatTime(progress * currentEpisode.duration / 100)}
              </span>
              <div className="flex-1">
                <Slider
                  value={[progress]}
                  max={100}
                  step={0.1}
                  onValueChange={handleProgressChange}
                />
              </div>
              <span className="text-xs text-neutral-medium">
                {formatTime(currentEpisode.duration)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ArrowLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function Share(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  );
}

function Badge(props: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'outline' }) {
  const { variant = 'default', className, ...rest } = props;
  const baseClass = "inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold";
  const variantClass = variant === 'outline' 
    ? "border border-neutral-light text-neutral-deep" 
    : "bg-primary text-white";
  
  return (
    <div className={`${baseClass} ${variantClass} ${className || ''}`} {...rest} />
  );
}