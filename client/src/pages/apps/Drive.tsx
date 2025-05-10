import { useEffect, useState } from 'react';
import { useAppState } from '@/hooks/use-app-state';
import { FolderOpen, File, FileText, Image, FileCode, Music, Video, Search, Upload, Plus, Folder, Download, Share2, MoreVertical, Trash, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { format } from 'date-fns';

type FileItem = {
  id: number;
  name: string;
  type: 'folder' | 'document' | 'image' | 'code' | 'audio' | 'video' | 'other';
  size: number;
  path: string[];
  lastModified: string;
  shared: boolean;
};

export default function Drive() {
  const { setCurrentApp } = useAppState();
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<FileItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'modified' | 'size'>('name');
  
  // Set the current app when component mounts
  useEffect(() => {
    setCurrentApp('drive');
  }, [setCurrentApp]);
  
  // Sample files data (in a real app this would come from an API)
  const [files, setFiles] = useState<FileItem[]>([
    { 
      id: 1, 
      name: 'Documents', 
      type: 'folder', 
      size: 0,
      path: [],
      lastModified: '2023-08-15T14:30:00Z',
      shared: false
    },
    { 
      id: 2, 
      name: 'Images', 
      type: 'folder', 
      size: 0,
      path: [],
      lastModified: '2023-08-20T10:45:00Z',
      shared: true
    },
    { 
      id: 3, 
      name: 'Project Files', 
      type: 'folder', 
      size: 0,
      path: [],
      lastModified: '2023-09-05T09:15:00Z',
      shared: false
    },
    { 
      id: 4, 
      name: 'Project Proposal.docx', 
      type: 'document', 
      size: 2500000,
      path: [],
      lastModified: '2023-09-10T11:20:00Z',
      shared: false
    },
    { 
      id: 5, 
      name: 'Budget.xlsx', 
      type: 'document', 
      size: 1800000,
      path: [],
      lastModified: '2023-09-12T13:40:00Z',
      shared: false
    },
    { 
      id: 6, 
      name: 'Logo.png', 
      type: 'image', 
      size: 3200000,
      path: [],
      lastModified: '2023-09-08T16:10:00Z',
      shared: false
    },
    { 
      id: 7, 
      name: 'Meeting Notes.txt', 
      type: 'document', 
      size: 120000,
      path: ['Documents'],
      lastModified: '2023-09-15T15:30:00Z',
      shared: false
    },
    { 
      id: 8, 
      name: 'Product Roadmap.pdf', 
      type: 'document', 
      size: 4500000,
      path: ['Documents'],
      lastModified: '2023-09-18T09:45:00Z',
      shared: false
    },
    { 
      id: 9, 
      name: 'Team Photo.jpg', 
      type: 'image', 
      size: 5800000,
      path: ['Images'],
      lastModified: '2023-09-05T14:20:00Z',
      shared: true
    },
    { 
      id: 10, 
      name: 'Website Mockup.png', 
      type: 'image', 
      size: 7200000,
      path: ['Images'],
      lastModified: '2023-09-10T11:30:00Z',
      shared: false
    },
    { 
      id: 11, 
      name: 'main.js', 
      type: 'code', 
      size: 850000,
      path: ['Project Files'],
      lastModified: '2023-09-20T10:15:00Z',
      shared: false
    },
    { 
      id: 12, 
      name: 'styles.css', 
      type: 'code', 
      size: 320000,
      path: ['Project Files'],
      lastModified: '2023-09-20T10:20:00Z',
      shared: false
    }
  ]);
  
  const handleNavigate = (path: string[]) => {
    setCurrentPath(path);
    setSelectedItem(null);
  };
  
  const handleItemClick = (item: FileItem) => {
    if (item.type === 'folder') {
      setCurrentPath([...currentPath, item.name]);
    } else {
      setSelectedItem(item);
    }
  };
  
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    
    const newFolder: FileItem = {
      id: Math.max(...files.map(f => f.id)) + 1,
      name: newFolderName,
      type: 'folder',
      size: 0,
      path: [...currentPath],
      lastModified: new Date().toISOString(),
      shared: false
    };
    
    setFiles([...files, newFolder]);
    setNewFolderName('');
    setCreateFolderOpen(false);
  };
  
  const handleDeleteItem = (id: number) => {
    setFiles(files.filter(file => file.id !== id));
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };
  
  // Get current directory files
  const currentFiles = files.filter(file => 
    JSON.stringify(file.path) === JSON.stringify(currentPath) &&
    (searchTerm === '' || file.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Sort files
  let sortedFiles = [...currentFiles];
  if (sortBy === 'name') {
    sortedFiles.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'modified') {
    sortedFiles.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
  } else if (sortBy === 'size') {
    sortedFiles.sort((a, b) => b.size - a.size);
  }
  
  // Sort folders first
  sortedFiles = [
    ...sortedFiles.filter(file => file.type === 'folder'),
    ...sortedFiles.filter(file => file.type !== 'folder')
  ];
  
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'folder':
        return <Folder className="h-6 w-6 text-yellow-500" />;
      case 'document':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'image':
        return <Image className="h-6 w-6 text-green-500" />;
      case 'code':
        return <FileCode className="h-6 w-6 text-purple-500" />;
      case 'audio':
        return <Music className="h-6 w-6 text-red-500" />;
      case 'video':
        return <Video className="h-6 w-6 text-pink-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '—';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Calculate storage usage
  const totalStorage = 10 * 1024 * 1024 * 1024; // 10 GB
  const usedStorage = files.reduce((acc, file) => acc + file.size, 0);
  const usedPercentage = (usedStorage / totalStorage) * 100;
  
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-neutral-light p-4 flex flex-col">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-medium" />
            <Input 
              placeholder="Search files" 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2 mb-6">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => setCreateFolderOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
        </div>
        
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${currentPath.length === 0 && !searchTerm ? 'bg-neutral-light' : ''}`}
            onClick={() => handleNavigate([])}
          >
            <FolderOpen className="h-5 w-5 mr-2 text-primary" />
            My Drive
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start"
          >
            <Share2 className="h-5 w-5 mr-2 text-green-500" />
            Shared with me
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start"
          >
            <Clock className="h-5 w-5 mr-2 text-yellow-500" />
            Recent
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start"
          >
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Starred
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start"
          >
            <Trash className="h-5 w-5 mr-2 text-red-500" />
            Trash
          </Button>
        </div>
        
        <div className="mt-auto pt-4 border-t border-neutral-light">
          <div className="flex items-center justify-between text-sm">
            <span>Storage</span>
            <span>{formatFileSize(usedStorage)} / {formatFileSize(totalStorage)}</span>
          </div>
          <Progress value={usedPercentage} className="mt-2" />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 bg-white overflow-hidden flex flex-col">
        {/* Create Folder Dialog */}
        <Dialog open={createFolderOpen} onOpenChange={setCreateFolderOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="folderName" className="text-sm font-medium">Folder Name</label>
                <Input 
                  id="folderName" 
                  value={newFolderName} 
                  onChange={(e) => setNewFolderName(e.target.value)} 
                  autoFocus
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateFolderOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateFolder}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Breadcrumbs and Controls */}
        <div className="p-4 border-b border-neutral-light flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost"
              className="font-semibold"
              onClick={() => handleNavigate([])}
            >
              My Drive
            </Button>
            
            {currentPath.map((folder, index) => (
              <div key={index} className="flex items-center">
                <span className="mx-2 text-neutral-medium">/</span>
                <Button 
                  variant="ghost"
                  className="font-semibold"
                  onClick={() => handleNavigate(currentPath.slice(0, index + 1))}
                >
                  {folder}
                </Button>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex border rounded-md overflow-hidden">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                size="sm"
                className="rounded-none"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'ghost'} 
                size="sm"
                className="rounded-none"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            <select 
              className="text-sm border border-neutral-light rounded px-2 py-1"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'modified' | 'size')}
            >
              <option value="name">Name</option>
              <option value="modified">Last Modified</option>
              <option value="size">Size</option>
            </select>
          </div>
        </div>
        
        {/* File List */}
        <div className="flex-1 overflow-y-auto p-4">
          {sortedFiles.length === 0 ? (
            <div className="text-center py-10 text-neutral-medium">
              <FolderOpen className="h-16 w-16 mx-auto mb-4 text-neutral-light" />
              <p>{searchTerm ? 'No files matching your search' : 'This folder is empty'}</p>
              <div className="flex justify-center mt-4 gap-2">
                <Button variant="outline" onClick={() => setCreateFolderOpen(true)}>
                  <Folder className="h-4 w-4 mr-2" />
                  Create Folder
                </Button>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {sortedFiles.map((file) => (
                <div
                  key={file.id}
                  className="p-4 border rounded-lg hover:bg-neutral-light cursor-pointer transition-colors"
                  onClick={() => handleItemClick(file)}
                >
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 flex items-center justify-center mb-2">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="text-center">
                      <div className="font-medium truncate w-full">{file.name}</div>
                      <div className="text-xs text-neutral-medium">
                        {file.type !== 'folder' ? formatFileSize(file.size) : ''}
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 h-8 w-8"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {file.type !== 'folder' && (
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" /> Download
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Share2 className="h-4 w-4 mr-2" /> Share
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" /> Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(file.id);
                        }}
                        className="text-red-500"
                      >
                        <Trash className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-neutral-light">
                <tr>
                  <th className="text-left py-2 px-4">Name</th>
                  <th className="text-left py-2 px-4">Last Modified</th>
                  <th className="text-left py-2 px-4">Size</th>
                  <th className="py-2 px-4 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {sortedFiles.map((file) => (
                  <tr 
                    key={file.id}
                    className="border-b border-neutral-light hover:bg-neutral-light cursor-pointer"
                    onClick={() => handleItemClick(file)}
                  >
                    <td className="py-2 px-4">
                      <div className="flex items-center">
                        <div className="mr-2">
                          {getFileIcon(file.type)}
                        </div>
                        <span>{file.name}</span>
                        {file.shared && (
                          <Share2 className="h-3 w-3 ml-2 text-neutral-medium" />
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-4 text-neutral-medium">
                      {format(new Date(file.lastModified), 'MMM d, yyyy')}
                    </td>
                    <td className="py-2 px-4 text-neutral-medium">
                      {file.type !== 'folder' ? formatFileSize(file.size) : '—'}
                    </td>
                    <td className="py-2 px-4">
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
                          {file.type !== 'folder' && (
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" /> Download
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" /> Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" /> Rename
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteItem(file.id);
                            }}
                            className="text-red-500"
                          >
                            <Trash className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// Grid and List icons
function Grid(props: React.SVGProps<SVGSVGElement>) {
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
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
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

function Clock(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function Star(props: React.SVGProps<SVGSVGElement>) {
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
