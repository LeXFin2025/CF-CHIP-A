import { useEffect, useState } from 'react';
import { useAppState } from '@/hooks/use-app-state';
import { Music as MusicIcon, Search, Play, SkipBack, SkipForward, Pause, Volume2, Repeat, Shuffle, Heart, MoreVertical, List, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Album = {
  id: number;
  title: string;
  artist: string;
  coverArt: string;
  year: number;
  genre: string;
};

type Artist = {
  id: number;
  name: string;
  image: string;
};

type Song = {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverArt: string;
  favorite: boolean;
};

export default function Music() {
  const { setCurrentApp } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('songs');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  // Set the current app when component mounts
  useEffect(() => {
    setCurrentApp('music');
  }, [setCurrentApp]);
  
  // Sample data for music library (in a real app, this would come from an API)
  const songs: Song[] = [
    {
      id: 1,
      title: "Into the Groove",
      artist: "Madonna",
      album: "Like a Virgin",
      duration: 285,
      coverArt: "https://images.unsplash.com/photo-1456346068906-9e03e1ca7187?auto=format&fit=crop&w=300&h=300",
      favorite: true
    },
    {
      id: 2,
      title: "Bohemian Rhapsody",
      artist: "Queen",
      album: "A Night at the Opera",
      duration: 355,
      coverArt: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=300&h=300",
      favorite: false
    },
    {
      id: 3,
      title: "Imagine",
      artist: "John Lennon",
      album: "Imagine",
      duration: 183,
      coverArt: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=300&h=300",
      favorite: true
    },
    {
      id: 4,
      title: "Billie Jean",
      artist: "Michael Jackson",
      album: "Thriller",
      duration: 294,
      coverArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&h=300",
      favorite: false
    },
    {
      id: 5,
      title: "Hotel California",
      artist: "Eagles",
      album: "Hotel California",
      duration: 391,
      coverArt: "https://images.unsplash.com/photo-1485589149876-5a262026832e?auto=format&fit=crop&w=300&h=300",
      favorite: false
    },
    {
      id: 6,
      title: "Like a Rolling Stone",
      artist: "Bob Dylan",
      album: "Highway 61 Revisited",
      duration: 372,
      coverArt: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?auto=format&fit=crop&w=300&h=300",
      favorite: true
    }
  ];
  
  const albums: Album[] = [
    {
      id: 1,
      title: "Like a Virgin",
      artist: "Madonna",
      coverArt: "https://images.unsplash.com/photo-1456346068906-9e03e1ca7187?auto=format&fit=crop&w=300&h=300",
      year: 1984,
      genre: "Pop"
    },
    {
      id: 2,
      title: "A Night at the Opera",
      artist: "Queen",
      coverArt: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=300&h=300",
      year: 1975,
      genre: "Rock"
    },
    {
      id: 3,
      title: "Imagine",
      artist: "John Lennon",
      coverArt: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=300&h=300",
      year: 1971,
      genre: "Rock"
    },
    {
      id: 4,
      title: "Thriller",
      artist: "Michael Jackson",
      coverArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&h=300",
      year: 1982,
      genre: "Pop"
    }
  ];
  
  const artists: Artist[] = [
    {
      id: 1,
      name: "Madonna",
      image: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?auto=format&fit=crop&w=300&h=300"
    },
    {
      id: 2,
      name: "Queen",
      image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=300&h=300"
    },
    {
      id: 3,
      name: "John Lennon",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=300&h=300"
    },
    {
      id: 4,
      name: "Michael Jackson",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&h=300"
    }
  ];
  
  // Filter songs based on search query
  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.album.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter albums based on search query
  const filteredAlbums = albums.filter(album => 
    album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    album.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter artists based on search query
  const filteredArtists = artists.filter(artist => 
    artist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
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
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const handleToggleFavorite = (id: number) => {
    // In a real app, this would update the database
    // For now, we're just updating the local state
    const updatedSongs = songs.map(song => 
      song.id === id ? { ...song, favorite: !song.favorite } : song
    );
    // Note: In this demo, we're not actually updating the songs array
  };
  
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-neutral-light flex flex-col">
        <div className="p-4 border-b border-neutral-light">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-medium" />
            <Input 
              placeholder="Search music" 
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
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => setActiveTab('songs')}
              >
                <MusicIcon className="h-4 w-4 mr-3" /> Songs
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => setActiveTab('albums')}
              >
                <List className="h-4 w-4 mr-3" /> Albums
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => setActiveTab('artists')}
              >
                <MusicIcon className="h-4 w-4 mr-3" /> Artists
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
              >
                <Heart className="h-4 w-4 mr-3" /> Favorites
              </Button>
            </div>
            
            <h3 className="font-medium text-sm text-neutral-medium mt-6 mb-2">PLAYLISTS</h3>
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
              >
                <List className="h-4 w-4 mr-3" /> Recently Played
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
              >
                <List className="h-4 w-4 mr-3" /> My Top Tracks
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
              >
                <List className="h-4 w-4 mr-3" /> Running Mix
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
              >
                <List className="h-4 w-4 mr-3" /> Chill Vibes
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 bg-white flex flex-col">
        <div className="p-4 border-b border-neutral-light flex justify-between items-center">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-2/3">
            <TabsList>
              <TabsTrigger value="songs">Songs</TabsTrigger>
              <TabsTrigger value="albums">Albums</TabsTrigger>
              <TabsTrigger value="artists">Artists</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            >
              {viewMode === 'list' ? <Grid className="h-5 w-5" /> : <List className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4">
            <TabsContent value="songs" className="mt-0">
              <div className="space-y-4">
                {viewMode === 'list' ? (
                  <div className="space-y-1">
                    {filteredSongs.length === 0 ? (
                      <div className="text-center py-8 text-neutral-medium">
                        <MusicIcon className="h-16 w-16 mx-auto mb-4 text-neutral-light" />
                        No songs found
                      </div>
                    ) : (
                      filteredSongs.map(song => (
                        <div
                          key={song.id}
                          className={`flex items-center p-2 rounded-md hover:bg-neutral-light ${
                            currentSong?.id === song.id ? 'bg-neutral-light' : ''
                          }`}
                          onClick={() => handlePlaySong(song)}
                        >
                          <div className="h-10 w-10 mr-3 overflow-hidden rounded-md flex-shrink-0">
                            <img 
                              src={song.coverArt} 
                              alt={song.album}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{song.title}</div>
                            <div className="text-sm text-neutral-medium truncate">{song.artist} • {song.album}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-neutral-medium">{formatTime(song.duration)}</span>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorite(song.id);
                              }}
                            >
                              <Heart className={`h-4 w-4 ${song.favorite ? 'fill-red-500 text-red-500' : ''}`} />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>Add to playlist</DropdownMenuItem>
                                <DropdownMenuItem>View album</DropdownMenuItem>
                                <DropdownMenuItem>View artist</DropdownMenuItem>
                                <DropdownMenuItem>Share</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredSongs.length === 0 ? (
                      <div className="text-center py-8 text-neutral-medium col-span-full">
                        <MusicIcon className="h-16 w-16 mx-auto mb-4 text-neutral-light" />
                        No songs found
                      </div>
                    ) : (
                      filteredSongs.map(song => (
                        <div
                          key={song.id}
                          className="flex flex-col rounded-md overflow-hidden hover:bg-neutral-light cursor-pointer"
                          onClick={() => handlePlaySong(song)}
                        >
                          <div className="h-40 w-full overflow-hidden">
                            <img 
                              src={song.coverArt} 
                              alt={song.album}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <div className="font-medium truncate">{song.title}</div>
                            <div className="text-sm text-neutral-medium truncate">{song.artist}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="albums" className="mt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredAlbums.length === 0 ? (
                  <div className="text-center py-8 text-neutral-medium col-span-full">
                    <MusicIcon className="h-16 w-16 mx-auto mb-4 text-neutral-light" />
                    No albums found
                  </div>
                ) : (
                  filteredAlbums.map(album => (
                    <div
                      key={album.id}
                      className="flex flex-col rounded-md overflow-hidden hover:bg-neutral-light cursor-pointer"
                    >
                      <div className="h-40 w-full overflow-hidden">
                        <img 
                          src={album.coverArt} 
                          alt={album.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <div className="font-medium truncate">{album.title}</div>
                        <div className="text-sm text-neutral-medium truncate">{album.artist} • {album.year}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="artists" className="mt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredArtists.length === 0 ? (
                  <div className="text-center py-8 text-neutral-medium col-span-full">
                    <MusicIcon className="h-16 w-16 mx-auto mb-4 text-neutral-light" />
                    No artists found
                  </div>
                ) : (
                  filteredArtists.map(artist => (
                    <div
                      key={artist.id}
                      className="flex flex-col items-center rounded-md overflow-hidden hover:bg-neutral-light cursor-pointer p-4"
                    >
                      <div className="h-32 w-32 overflow-hidden rounded-full mb-3">
                        <img 
                          src={artist.image} 
                          alt={artist.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{artist.name}</div>
                        <div className="text-sm text-neutral-medium">Artist</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </div>
        </ScrollArea>
        
        {/* Player at the bottom */}
        <div className="p-3 border-t border-neutral-light flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center flex-1">
              {currentSong && (
                <>
                  <div className="h-12 w-12 mr-3 overflow-hidden rounded-md flex-shrink-0">
                    <img 
                      src={currentSong.coverArt} 
                      alt={currentSong.album}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{currentSong.title}</div>
                    <div className="text-sm text-neutral-medium truncate">{currentSong.artist}</div>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Shuffle className="h-4 w-4" />
              </Button>
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
              <Button variant="ghost" size="icon">
                <Repeat className="h-4 w-4" />
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
              {currentSong ? formatTime(progress * currentSong.duration / 100) : '0:00'}
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
              {currentSong ? formatTime(currentSong.duration) : '0:00'}
            </span>
          </div>
        </div>
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

function Trash(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function X(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}