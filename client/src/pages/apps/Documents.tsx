import { useEffect, useState } from 'react';
import { useAppState } from '@/hooks/use-app-state';
import { FileText, Folder, Star, Clock, Trash, Plus, Search, Upload, MoreVertical, Download, Pencil, Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { Textarea } from '@/components/ui/textarea';

export default function Documents() {
  const { setCurrentApp } = useAppState();
  const [activeFolder, setActiveFolder] = useState<string>('my-documents');
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [createDocOpen, setCreateDocOpen] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: '',
    content: ''
  });
  
  // Set the current app when component mounts
  useEffect(() => {
    setCurrentApp('documents');
  }, [setCurrentApp]);
  
  // Sample documents data
  const documents = [
    { id: 1, title: 'Project Proposal', folder: 'my-documents', modified: '2023-09-10T14:30:00Z', starred: true },
    { id: 2, title: 'Meeting Notes', folder: 'my-documents', modified: '2023-09-15T09:45:00Z', starred: false },
    { id: 3, title: 'Budget Report', folder: 'my-documents', modified: '2023-09-18T16:15:00Z', starred: true },
    { id: 4, title: 'Marketing Plan', folder: 'my-documents', modified: '2023-09-20T11:20:00Z', starred: false },
    { id: 5, title: 'Client Feedback', folder: 'shared', modified: '2023-09-22T13:10:00Z', starred: false },
    { id: 6, title: 'Product Roadmap', folder: 'shared', modified: '2023-09-25T15:30:00Z', starred: true },
  ];
  
  const folders = [
    { id: 'my-documents', name: 'My Documents', icon: <FileText className="h-5 w-5" /> },
    { id: 'shared', name: 'Shared with me', icon: <Share2 className="h-5 w-5" /> },
    { id: 'starred', name: 'Starred', icon: <Star className="h-5 w-5" /> },
    { id: 'recent', name: 'Recent', icon: <Clock className="h-5 w-5" /> },
    { id: 'trash', name: 'Trash', icon: <Trash className="h-5 w-5" /> }
  ];
  
  const filteredDocs = activeFolder === 'starred' 
    ? documents.filter(doc => doc.starred)
    : activeFolder === 'recent'
    ? [...documents].sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime()).slice(0, 5)
    : documents.filter(doc => doc.folder === activeFolder);
  
  const handleCreateDoc = () => {
    // In a real app, this would create a document in the database
    setNewDoc({ title: '', content: '' });
    setCreateDocOpen(false);
  };
  
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-neutral-light p-4 flex flex-col">
        <Dialog open={createDocOpen} onOpenChange={setCreateDocOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mb-4" size="lg">
              <Plus className="mr-2 h-4 w-4" /> Create Document
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Document</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">Title</label>
                <Input 
                  id="title" 
                  value={newDoc.title} 
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })} 
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="content" className="text-sm font-medium">Content</label>
                <Textarea 
                  id="content" 
                  rows={10} 
                  value={newDoc.content} 
                  onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })} 
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDocOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateDoc}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-medium" />
            <Input 
              placeholder="Search documents" 
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-1">
          {folders.map((folder) => (
            <button
              key={folder.id}
              className={`w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-neutral-light ${
                activeFolder === folder.id ? 'bg-primary text-white hover:bg-primary' : ''
              }`}
              onClick={() => setActiveFolder(folder.id)}
            >
              <span className="mr-3">{folder.icon}</span>
              {folder.name}
            </button>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-neutral-light">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-medium">Storage</span>
            <span className="text-xs text-neutral-medium">2.4 GB / 15 GB</span>
          </div>
          <div className="w-full h-2 bg-neutral-light rounded-full mt-2">
            <div className="h-full bg-primary rounded-full" style={{ width: '16%' }}></div>
          </div>
        </div>
      </div>
      
      {/* Document List */}
      <div className="flex-1 bg-white overflow-hidden flex flex-col">
        <div className="p-4 border-b border-neutral-light flex items-center justify-between">
          <h2 className="font-semibold">{folders.find(f => f.id === activeFolder)?.name}</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" /> Upload
            </Button>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredDocs.length === 0 ? (
            <div className="col-span-full text-center py-10 text-neutral-medium">
              <FileText className="h-12 w-12 mx-auto mb-4 text-neutral-light" />
              <p>No documents found</p>
            </div>
          ) : (
            filteredDocs.map((doc) => (
              <div 
                key={doc.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors hover:border-primary ${
                  selectedDoc?.id === doc.id ? 'border-primary bg-neutral-light' : ''
                }`}
                onClick={() => setSelectedDoc(doc)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-primary mr-3" />
                    <div>
                      <div className="font-medium">{doc.title}</div>
                      <div className="text-xs text-neutral-medium">
                        {new Date(doc.modified).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
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
                      <DropdownMenuItem>
                        <Pencil className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" /> Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500">
                        <Trash className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
