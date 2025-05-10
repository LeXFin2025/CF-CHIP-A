import { useEffect, useState } from 'react';
import { useAppState } from '@/hooks/use-app-state';
import { Film, Search, Play, MoreVertical, Clock, Grid, List, Filter, Bookmark, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

type Video = {
  id: number;
  title: string;
  thumbnail: string;
  duration: number; // in seconds
  views: number;
  uploadDate: string;
  creator: string;
  category: string;
  bookmarked: boolean;
};

export default function Videos() {
  const { setCurrentApp } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  
  // Set the current app when component mounts
  useEffect(() => {
    setCurrentApp('videos');
  }, [setCurrentApp]);
  
  // Sample video data (in a real app, this would come from an API)
  const videos: Video[] = [
    {
      id: 1,
      title: "Introduction to Web Development",
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=640&h=360",
      duration: 1825, // 30:25
      views: 24589,
      uploadDate: "2023-08-15T14:30:00Z",
      creator: "Tech Academy",
      category: "education",
      bookmarked: true
    },
    {
      id: 2,
      title: "Tropical Island Vacation Guide",
      thumbnail: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=640&h=360",
      duration: 892, // 14:52
      views: 18745,
      uploadDate: "2023-09-02T10:15:00Z",
      creator: "Travel Guides",
      category: "travel",
      bookmarked: false
    },
    {
      id: 3,
      title: "Easy Dinner Recipes for Beginners",
      thumbnail: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=640&h=360",
      duration: 1250, // 20:50
      views: 32104,
      uploadDate: "2023-09-10T16:45:00Z",
      creator: "Cooking with Claire",
      category: "food",
      bookmarked: false
    },
    {
      id: 4,
      title: "Advanced JavaScript Techniques",
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=640&h=360",
      duration: 2348, // 39:08
      views: 15678,
      uploadDate: "2023-08-28T09:20:00Z",
      creator: "Code Masters",
      category: "education",
      bookmarked: true
    },
    {
      id: 5,
      title: "Home Workout: Full Body Fitness",
      thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=640&h=360",
      duration: 1578, // 26:18
      views: 45290,
      uploadDate: "2023-09-05T11:30:00Z",
      creator: "Fitness First",
      category: "fitness",
      bookmarked: false
    },
    {
      id: 6,
      title: "Wildlife Documentary: Amazon Rainforest",
      thumbnail: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=640&h=360",
      duration: 3125, // 52:05
      views: 29876,
      uploadDate: "2023-07-20T15:10:00Z",
      creator: "Nature Channel",
      category: "nature",
      bookmarked: false
    }
  ];
  
  const categories = [
    { id: "all", name: "All Videos" },
    { id: "education", name: "Education" },
    { id: "travel", name: "Travel" },
    { id: "food", name: "Food & Cooking" },
    { id: "fitness", name: "Fitness" },
    { id: "nature", name: "Nature" },
    { id: "technology", name: "Technology" },
    { id: "entertainment", name: "Entertainment" }
  ];
  
  // Filter videos based on active tab, category, and search query
  const filteredVideos = videos.filter(video => {
    // Filter by tab
    if (activeTab === 'bookmarked' && !video.bookmarked) {
      return false;
    }
    
    // Filter by category
    if (activeCategory && video.category !== activeCategory) {
      return false;
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        video.title.toLowerCase().includes(query) ||
        video.creator.toLowerCase().includes(query) ||
        video.category.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  const handleToggleBookmark = (id: number) => {
    // In a real app, this would update the database
    // For now, let's just pretend we're updating it
    console.log(`Toggling bookmark for video ${id}`);
  };
  
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    } else {
      return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
  };
  
  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${Math.floor(views / 100000) / 10}M views`;
    } else if (views >= 1000) {
      return `${Math.floor(views / 100) / 10}K views`;
    } else {
      return `${views} views`;
    }
  };
  
  const formatUploadDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
    } else {
      return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
    }
  };
  
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-neutral-light flex flex-col">
        <div className="p-4 border-b border-neutral-light">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-medium" />
            <Input 
              placeholder="Search videos" 
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
                variant={activeTab === 'all' ? 'secondary' : 'ghost'}
                className="w-full justify-start text-left"
                onClick={() => {
                  setActiveTab('all');
                  setActiveCategory(null);
                }}
              >
                <Film className="h-4 w-4 mr-3" /> All Videos
              </Button>
              <Button
                variant={activeTab === 'bookmarked' ? 'secondary' : 'ghost'}
                className="w-full justify-start text-left"
                onClick={() => {
                  setActiveTab('bookmarked');
                  setActiveCategory(null);
                }}
              >
                <Bookmark className="h-4 w-4 mr-3" /> Bookmarked
              </Button>
              <Button
                variant={activeTab === 'recent' ? 'secondary' : 'ghost'}
                className="w-full justify-start text-left"
                onClick={() => {
                  setActiveTab('recent');
                  setActiveCategory(null);
                }}
              >
                <Clock className="h-4 w-4 mr-3" /> Recently Watched
              </Button>
            </div>
            
            <h3 className="font-medium text-sm text-neutral-medium mt-6 mb-2">CATEGORIES</h3>
            <div className="space-y-1">
              {categories.slice(1).map(category => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? 'secondary' : 'ghost'}
                  className="w-full justify-start text-left capitalize"
                  onClick={() => {
                    setActiveTab('all');
                    setActiveCategory(category.id);
                  }}
                >
                  <Film className="h-4 w-4 mr-3" /> {category.name}
                </Button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 bg-white flex flex-col">
        <div className="p-4 border-b border-neutral-light flex justify-between items-center">
          <h2 className="font-semibold">
            {activeCategory 
              ? categories.find(c => c.id === activeCategory)?.name 
              : categories.find(c => c.id === 'all')?.name}
          </h2>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon">
              <Filter className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4">
            {filteredVideos.length === 0 ? (
              <div className="text-center py-16">
                <Film className="h-16 w-16 text-neutral-light mx-auto mb-4" />
                <h3 className="font-medium text-xl mb-2">No videos found</h3>
                <p className="text-neutral-medium">
                  {searchQuery 
                    ? "Try a different search term or category" 
                    : "There are no videos in this category"}
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map(video => (
                  <div 
                    key={video.id} 
                    className="flex flex-col rounded-lg overflow-hidden border border-neutral-light hover:shadow-md transition-shadow"
                  >
                    <div className="relative">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="h-[180px] w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-30">
                        <Button 
                          variant="default" 
                          size="icon" 
                          className="h-12 w-12 rounded-full"
                          onClick={() => setSelectedVideo(video)}
                        >
                          <Play className="h-6 w-6" />
                        </Button>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
                        {formatDuration(video.duration)}
                      </div>
                    </div>
                    
                    <div className="p-3 flex-1 flex flex-col">
                      <h3 className="font-medium line-clamp-2">{video.title}</h3>
                      <div className="text-sm text-neutral-medium mt-1">{video.creator}</div>
                      <div className="text-xs text-neutral-medium mt-1 flex items-center space-x-2">
                        <span>{formatViews(video.views)}</span>
                        <span>•</span>
                        <span>{formatUploadDate(video.uploadDate)}</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-neutral-light flex justify-between">
                        <Badge variant="outline" className="text-xs capitalize">
                          {video.category}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleToggleBookmark(video.id)}
                          >
                            <Bookmark className={`h-4 w-4 ${video.bookmarked ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>Add to playlist</DropdownMenuItem>
                              <DropdownMenuItem>Share</DropdownMenuItem>
                              <DropdownMenuItem>Download</DropdownMenuItem>
                              <DropdownMenuItem>Not interested</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredVideos.map(video => (
                  <div 
                    key={video.id} 
                    className="flex border border-neutral-light rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative w-48 flex-shrink-0">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-30">
                        <Button 
                          variant="default" 
                          size="icon" 
                          className="h-10 w-10 rounded-full"
                          onClick={() => setSelectedVideo(video)}
                        >
                          <Play className="h-5 w-5" />
                        </Button>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
                        {formatDuration(video.duration)}
                      </div>
                    </div>
                    
                    <div className="p-3 flex-1 flex flex-col">
                      <div className="flex justify-between">
                        <h3 className="font-medium line-clamp-2 flex-1">{video.title}</h3>
                        <div className="flex space-x-1 ml-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleToggleBookmark(video.id)}
                          >
                            <Bookmark className={`h-4 w-4 ${video.bookmarked ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>Add to playlist</DropdownMenuItem>
                              <DropdownMenuItem>Share</DropdownMenuItem>
                              <DropdownMenuItem>Download</DropdownMenuItem>
                              <DropdownMenuItem>Not interested</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="text-sm text-neutral-medium mt-1">{video.creator}</div>
                      <div className="text-xs text-neutral-medium mt-1 flex items-center space-x-2">
                        <span>{formatViews(video.views)}</span>
                        <span>•</span>
                        <span>{formatUploadDate(video.uploadDate)}</span>
                      </div>
                      <div className="mt-auto pt-2 flex justify-between items-center">
                        <Badge variant="outline" className="text-xs capitalize">
                          {video.category}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-8">
                          <Share2 className="h-4 w-4 mr-1" /> Share
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

function CustomGrid(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="7" height="7" x="3" y="3" />
      <rect width="7" height="7" x="14" y="3" />
      <rect width="7" height="7" x="14" y="14" />
      <rect width="7" height="7" x="3" y="14" />
    </svg>
  );
}