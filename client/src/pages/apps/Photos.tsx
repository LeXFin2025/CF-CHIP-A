import { useEffect, useState } from 'react';
import { useAppState } from '@/hooks/use-app-state';
import { Image, Search, Grid, Plus, Clock, Star, Trash, MoreVertical, Upload, Download, Share2, InfoIcon, Filter, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

type Photo = {
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
  album: string;
  date: string;
  favorite: boolean;
  tags: string[];
};

export default function Photos() {
  const { setCurrentApp } = useAppState();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [activeAlbum, setActiveAlbum] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSelecting, setIsSelecting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');
  const [photoDetailsOpen, setPhotoDetailsOpen] = useState(false);
  const [selectedPhotoForDetails, setSelectedPhotoForDetails] = useState<Photo | null>(null);
  
  // Set the current app when component mounts
  useEffect(() => {
    setCurrentApp('photos');
  }, [setCurrentApp]);
  
  // Fetch photos (mock data for demonstration)
  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample photo data (in a real app, this would come from an API)
      const samplePhotos: Photo[] = [
        {
          id: 1,
          title: "Sunset at the Beach",
          url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&h=600",
          thumbnailUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&h=200",
          album: "Vacation",
          date: "2023-08-15T18:30:00Z",
          favorite: true,
          tags: ["beach", "sunset", "vacation"]
        },
        {
          id: 2,
          title: "Mountain Landscape",
          url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&h=600",
          thumbnailUrl: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=300&h=200",
          album: "Hiking",
          date: "2023-07-22T14:45:00Z",
          favorite: false,
          tags: ["mountains", "nature", "hiking"]
        },
        {
          id: 3,
          title: "Urban Skyline",
          url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&h=600",
          thumbnailUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=300&h=200",
          album: "Cities",
          date: "2023-09-05T12:15:00Z",
          favorite: true,
          tags: ["city", "skyline", "urban"]
        },
        {
          id: 4,
          title: "Autumn Forest",
          url: "https://images.unsplash.com/photo-1478759615268-c21f4989bf6d?auto=format&fit=crop&w=800&h=600",
          thumbnailUrl: "https://images.unsplash.com/photo-1478759615268-c21f4989bf6d?auto=format&fit=crop&w=300&h=200",
          album: "Nature",
          date: "2023-09-18T09:30:00Z",
          favorite: false,
          tags: ["forest", "autumn", "nature"]
        },
        {
          id: 5,
          title: "Café Table",
          url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&h=600",
          thumbnailUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=300&h=200",
          album: "Food",
          date: "2023-09-10T11:20:00Z",
          favorite: false,
          tags: ["coffee", "café", "food"]
        },
        {
          id: 6,
          title: "Historical Architecture",
          url: "https://images.unsplash.com/photo-1558599803-f068d41bdc33?auto=format&fit=crop&w=800&h=600",
          thumbnailUrl: "https://images.unsplash.com/photo-1558599803-f068d41bdc33?auto=format&fit=crop&w=300&h=200",
          album: "Cities",
          date: "2023-08-28T15:40:00Z",
          favorite: true,
          tags: ["architecture", "history", "building"]
        },
        {
          id: 7,
          title: "Tropical Fish",
          url: "https://images.unsplash.com/photo-1504472478235-9bc48ba4d60f?auto=format&fit=crop&w=800&h=600",
          thumbnailUrl: "https://images.unsplash.com/photo-1504472478235-9bc48ba4d60f?auto=format&fit=crop&w=300&h=200",
          album: "Vacation",
          date: "2023-07-30T10:15:00Z",
          favorite: false,
          tags: ["ocean", "fish", "underwater"]
        },
        {
          id: 8,
          title: "Desert Landscape",
          url: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=800&h=600",
          thumbnailUrl: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=300&h=200",
          album: "Nature",
          date: "2023-06-18T16:50:00Z",
          favorite: false,
          tags: ["desert", "nature", "landscape"]
        },
        {
          id: 9,
          title: "Starry Night Sky",
          url: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=800&h=600",
          thumbnailUrl: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=300&h=200",
          album: "Nature",
          date: "2023-08-05T22:30:00Z",
          favorite: true,
          tags: ["stars", "night", "sky"]
        },
        {
          id: 10,
          title: "Busy Market",
          url: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&w=800&h=600",
          thumbnailUrl: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&w=300&h=200",
          album: "Travel",
          date: "2023-09-12T13:25:00Z",
          favorite: false,
          tags: ["market", "people", "travel"]
        },
        {
          id: 11,
          title: "Tranquil Lake",
          url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&h=600",
          thumbnailUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=300&h=200",
          album: "Nature",
          date: "2023-07-15T08:40:00Z",
          favorite: true,
          tags: ["lake", "water", "nature"]
        },
        {
          id: 12,
          title: "Modern Architecture",
          url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&h=600",
          thumbnailUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=300&h=200",
          album: "Cities",
          date: "2023-08-22T14:10:00Z",
          favorite: false,
          tags: ["architecture", "modern", "building"]
        }
      ];
      
      setPhotos(samplePhotos);
      setLoading(false);
    };
    
    fetchPhotos();
  }, []);
  
  // Get unique albums
  const albums = Array.from(new Set(photos.map(photo => photo.album))).sort();
  
  // Get filtered photos based on active tab, album, and search query
  const filteredPhotos = photos.filter(photo => {
    // Filter by tab
    if (activeTab === 'favorites' && !photo.favorite) {
      return false;
    } else if (activeTab === 'recent') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return new Date(photo.date) > oneMonthAgo;
    }
    
    // Filter by album
    if (activeAlbum && photo.album !== activeAlbum) {
      return false;
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        photo.title.toLowerCase().includes(query) ||
        photo.album.toLowerCase().includes(query) ||
        photo.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  const handleToggleFavorite = (id: number) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === id 
        ? { ...photo, favorite: !photo.favorite } 
        : photo
    ));
  };
  
  const handlePhotoClick = (photo: Photo) => {
    if (isSelecting) {
      // Toggle selection
      if (selectedPhotos.includes(photo.id)) {
        setSelectedPhotos(prev => prev.filter(id => id !== photo.id));
      } else {
        setSelectedPhotos(prev => [...prev, photo.id]);
      }
    } else {
      // Open photo details
      setSelectedPhotoForDetails(photo);
      setPhotoDetailsOpen(true);
    }
  };
  
  const handleSelectAll = () => {
    if (selectedPhotos.length === filteredPhotos.length) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(filteredPhotos.map(photo => photo.id));
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-neutral-light flex flex-col">
        <div className="p-4 border-b border-neutral-light">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-medium" />
            <Input 
              placeholder="Search photos" 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="p-4 border-b border-neutral-light">
          <Button variant="default" className="w-full">
            <Upload className="h-4 w-4 mr-2" /> Upload Photos
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4">
            <h3 className="font-medium text-sm text-neutral-medium mb-2">LIBRARIES</h3>
            <div className="space-y-1">
              <Button
                variant={activeTab === 'all' && !activeAlbum ? 'secondary' : 'ghost'}
                className="w-full justify-start text-left"
                onClick={() => {
                  setActiveTab('all');
                  setActiveAlbum(null);
                }}
              >
                <Grid className="h-4 w-4 mr-3" /> All Photos
              </Button>
              <Button
                variant={activeTab === 'favorites' ? 'secondary' : 'ghost'}
                className="w-full justify-start text-left"
                onClick={() => {
                  setActiveTab('favorites');
                  setActiveAlbum(null);
                }}
              >
                <Star className="h-4 w-4 mr-3" /> Favorites
              </Button>
              <Button
                variant={activeTab === 'recent' ? 'secondary' : 'ghost'}
                className="w-full justify-start text-left"
                onClick={() => {
                  setActiveTab('recent');
                  setActiveAlbum(null);
                }}
              >
                <Clock className="h-4 w-4 mr-3" /> Recent
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
              >
                <Trash className="h-4 w-4 mr-3" /> Trash
              </Button>
            </div>
            
            <h3 className="font-medium text-sm text-neutral-medium mt-6 mb-2">ALBUMS</h3>
            <div className="space-y-1">
              {albums.map(album => (
                <Button
                  key={album}
                  variant={activeAlbum === album ? 'secondary' : 'ghost'}
                  className="w-full justify-start text-left"
                  onClick={() => {
                    setActiveTab('all');
                    setActiveAlbum(album);
                  }}
                >
                  <FolderIcon className="h-4 w-4 mr-3" /> {album}
                </Button>
              ))}
              <Button
                variant="ghost"
                className="w-full justify-start text-left text-primary"
              >
                <Plus className="h-4 w-4 mr-3" /> Create Album
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 bg-white flex flex-col">
        {/* Photo Details Dialog */}
        <Dialog open={photoDetailsOpen} onOpenChange={setPhotoDetailsOpen}>
          <DialogContent className="max-w-4xl">
            {selectedPhotoForDetails && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex justify-between items-center">
                    <span>{selectedPhotoForDetails.title}</span>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleFavorite(selectedPhotoForDetails.id)}
                      >
                        <Star className={`h-5 w-5 ${selectedPhotoForDetails.favorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Share2 className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-5 w-5" />
                      </Button>
                    </div>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="mt-4">
                  <img 
                    src={selectedPhotoForDetails.url} 
                    alt={selectedPhotoForDetails.title}
                    className="max-h-[60vh] mx-auto rounded-md object-contain"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-medium">Date</span>
                        <span>{formatDate(selectedPhotoForDetails.date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-medium">Album</span>
                        <span>{selectedPhotoForDetails.album}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPhotoForDetails.tags.map(tag => (
                        <div 
                          key={tag} 
                          className="px-2 py-1 bg-neutral-light rounded-md text-xs"
                        >
                          {tag}
                        </div>
                      ))}
                      <Button variant="ghost" size="sm" className="h-6">
                        <Plus className="h-3 w-3 mr-1" /> Add Tag
                      </Button>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setPhotoDetailsOpen(false)}>Close</Button>
                  <Button>Edit Photo</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Toolbar */}
        <div className="p-4 border-b border-neutral-light flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="font-semibold text-lg">
              {activeAlbum || (activeTab === 'favorites' ? 'Favorites' : activeTab === 'recent' ? 'Recent Photos' : 'All Photos')}
            </h2>
            <span className="text-sm text-neutral-medium">
              {filteredPhotos.length} {filteredPhotos.length === 1 ? 'photo' : 'photos'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="border rounded-md overflow-hidden">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                size="sm" 
                className="rounded-none"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'detail' ? 'default' : 'ghost'} 
                size="sm" 
                className="rounded-none"
                onClick={() => setViewMode('detail')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            <Button 
              variant={isSelecting ? 'default' : 'outline'} 
              size="sm"
              onClick={() => {
                setIsSelecting(!isSelecting);
                if (!isSelecting) {
                  setSelectedPhotos([]);
                }
              }}
            >
              {isSelecting ? 'Cancel' : 'Select'}
            </Button>
            
            {isSelecting && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedPhotos.length === filteredPhotos.length ? 'Deselect All' : 'Select All'}
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={selectedPhotos.length === 0}
                    >
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" /> Download
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="h-4 w-4 mr-2" /> Share
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Star className="h-4 w-4 mr-2" /> Add to Favorites
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FolderIcon className="h-4 w-4 mr-2" /> Move to Album
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500">
                      <Trash className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
          </div>
        </div>
        
        {/* Photos Grid/List */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array(12).fill(0).map((_, i) => (
                <div key={i} className="aspect-square bg-neutral-light rounded-md animate-pulse"></div>
              ))}
            </div>
          ) : filteredPhotos.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Image className="h-16 w-16 mx-auto mb-4 text-neutral-light" />
                <p className="text-neutral-medium">No photos found</p>
                {searchQuery && (
                  <p className="mt-2 text-sm">
                    Try adjusting your search query or filters
                  </p>
                )}
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredPhotos.map(photo => (
                <div 
                  key={photo.id} 
                  className={`group relative aspect-square rounded-md overflow-hidden cursor-pointer ${
                    isSelecting && selectedPhotos.includes(photo.id) ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handlePhotoClick(photo)}
                >
                  <img 
                    src={photo.thumbnailUrl} 
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity">
                    {isSelecting && (
                      <div className="absolute top-2 left-2">
                        <div className={`h-6 w-6 rounded-full border-2 ${
                          selectedPhotos.includes(photo.id) 
                            ? 'bg-primary border-primary' 
                            : 'border-white'
                        }`}>
                          {selectedPhotos.includes(photo.id) && (
                            <Check className="h-4 w-4 text-white mx-auto mt-0.5" />
                          )}
                        </div>
                      </div>
                    )}
                    
                    {photo.favorite && !isSelecting && (
                      <div className="absolute top-2 left-2">
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      </div>
                    )}
                    
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="truncate text-sm font-medium">{photo.title}</p>
                      <p className="text-xs">{formatDate(photo.date)}</p>
                    </div>
                    
                    {!isSelecting && (
                      <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(photo.id);
                          }}
                        >
                          <Star className={`h-4 w-4 ${photo.favorite ? 'fill-yellow-500' : ''}`} />
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" /> Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="h-4 w-4 mr-2" /> Share
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <InfoIcon className="h-4 w-4 mr-2" /> Info
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500">
                              <Trash className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredPhotos.map(photo => (
                <div 
                  key={photo.id} 
                  className={`flex items-center p-2 rounded-md hover:bg-neutral-light cursor-pointer ${
                    isSelecting && selectedPhotos.includes(photo.id) ? 'bg-neutral-light' : ''
                  }`}
                  onClick={() => handlePhotoClick(photo)}
                >
                  {isSelecting && (
                    <div className="mr-4">
                      <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                        selectedPhotos.includes(photo.id) 
                          ? 'bg-primary border-primary' 
                          : 'border-neutral-medium'
                      }`}>
                        {selectedPhotos.includes(photo.id) && (
                          <Check className="h-4 w-4 text-white" />
                        )}
                      </div>
                    </div>
                  )}
                  
                  <img 
                    src={photo.thumbnailUrl} 
                    alt={photo.title}
                    className="h-16 w-16 object-cover rounded-md mr-4"
                  />
                  
                  <div className="flex-1">
                    <p className="font-medium">{photo.title}</p>
                    <div className="flex items-center text-sm text-neutral-medium">
                      <span>{formatDate(photo.date)}</span>
                      <span className="mx-2">•</span>
                      <span>{photo.album}</span>
                    </div>
                  </div>
                  
                  {photo.favorite && (
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-2" />
                  )}
                  
                  {!isSelecting && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem onClick={() => handleToggleFavorite(photo.id)}>
                          <Star className={`h-4 w-4 mr-2 ${photo.favorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                          {photo.favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" /> Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="h-4 w-4 mr-2" /> Share
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FolderIcon className="h-4 w-4 mr-2" /> Move to Album
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500">
                          <Trash className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Additional icons
function FolderIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function List(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function Check(props: React.SVGProps<SVGSVGElement>) {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
