import { useEffect, useState } from 'react';
import { useAppState } from '@/hooks/use-app-state';
import { PencilLine, Folder, Plus, Search, MoreVertical, Trash, Copy, Tag, Archive } from 'lucide-react';
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
import { format } from 'date-fns';

type Note = {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
};

export default function Notes() {
  const { setCurrentApp } = useAppState();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [createNoteOpen, setCreateNoteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: 'personal'
  });
  
  // Set the current app when component mounts
  useEffect(() => {
    setCurrentApp('notes');
  }, [setCurrentApp]);
  
  // Sample notes data (in a real app this would come from an API)
  const [notes, setNotes] = useState<Note[]>([
    { 
      id: 1, 
      title: 'Meeting notes', 
      content: 'Discussed project timeline and deliverables. Next steps: follow up with design team on UI mockups.',
      category: 'work',
      createdAt: '2023-09-15T10:30:00Z',
      updatedAt: '2023-09-15T11:45:00Z'
    },
    { 
      id: 2, 
      title: 'Shopping list', 
      content: '- Milk\n- Eggs\n- Bread\n- Apples\n- Coffee',
      category: 'personal',
      createdAt: '2023-09-16T08:15:00Z',
      updatedAt: '2023-09-16T08:15:00Z'
    },
    { 
      id: 3, 
      title: 'Project ideas', 
      content: '1. Build a personal website\n2. Learn a new programming language\n3. Create a mobile app',
      category: 'ideas',
      createdAt: '2023-09-14T16:20:00Z',
      updatedAt: '2023-09-17T09:30:00Z'
    },
    { 
      id: 4, 
      title: 'Book recommendations', 
      content: '- "Atomic Habits" by James Clear\n- "Deep Work" by Cal Newport\n- "The Psychology of Money" by Morgan Housel',
      category: 'personal',
      createdAt: '2023-09-12T14:10:00Z',
      updatedAt: '2023-09-12T14:10:00Z'
    }
  ]);
  
  const categories = [
    { id: 'all', name: 'All Notes', icon: <PencilLine className="h-5 w-5" /> },
    { id: 'personal', name: 'Personal', icon: <Folder className="h-5 w-5" /> },
    { id: 'work', name: 'Work', icon: <Folder className="h-5 w-5" /> },
    { id: 'ideas', name: 'Ideas', icon: <Folder className="h-5 w-5" /> },
    { id: 'archive', name: 'Archive', icon: <Archive className="h-5 w-5" /> },
    { id: 'trash', name: 'Trash', icon: <Trash className="h-5 w-5" /> }
  ];
  
  const filteredNotes = notes.filter(note => {
    // Filter by category
    const categoryMatch = activeCategory === 'all' || note.category === activeCategory;
    
    // Filter by search term
    const searchMatch = 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    return categoryMatch && searchMatch;
  });
  
  const handleCreateNote = () => {
    // In a real app this would be an API call
    const currentDate = new Date().toISOString();
    const newNoteObj: Note = {
      id: notes.length + 1,
      title: newNote.title,
      content: newNote.content,
      category: newNote.category,
      createdAt: currentDate,
      updatedAt: currentDate
    };
    
    setNotes([...notes, newNoteObj]);
    setNewNote({ title: '', content: '', category: 'personal' });
    setCreateNoteOpen(false);
    setSelectedNote(newNoteObj);
  };
  
  const handleUpdateNote = () => {
    if (!selectedNote) return;
    
    const updatedNotes = notes.map(note => {
      if (note.id === selectedNote.id) {
        return {
          ...selectedNote,
          updatedAt: new Date().toISOString()
        };
      }
      return note;
    });
    
    setNotes(updatedNotes);
    setEditMode(false);
  };
  
  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };
  
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-neutral-light p-4 flex flex-col">
        <Dialog open={createNoteOpen} onOpenChange={setCreateNoteOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mb-4" size="lg">
              <Plus className="mr-2 h-4 w-4" /> New Note
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Note</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">Title</label>
                <Input 
                  id="title" 
                  value={newNote.title} 
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} 
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newNote.category}
                  onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                >
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="ideas">Ideas</option>
                </select>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="content" className="text-sm font-medium">Content</label>
                <Textarea 
                  id="content" 
                  rows={10} 
                  value={newNote.content} 
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })} 
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateNoteOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateNote}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-medium" />
            <Input 
              placeholder="Search notes" 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-neutral-light ${
                activeCategory === category.id ? 'bg-primary text-white hover:bg-primary' : ''
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              <span className="mr-3">{category.icon}</span>
              {category.name}
              {category.id !== 'all' && category.id !== 'archive' && category.id !== 'trash' && (
                <span className="ml-auto">
                  {notes.filter(note => note.category === category.id).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Note List */}
      <div className="w-80 border-r border-neutral-light bg-white overflow-hidden flex flex-col">
        <div className="p-4 border-b border-neutral-light flex items-center justify-between">
          <h2 className="font-semibold">{categories.find(c => c.id === activeCategory)?.name}</h2>
          <div className="flex items-center gap-2">
            <select 
              className="text-sm border border-neutral-light rounded px-2 py-1"
              defaultValue="updated"
            >
              <option value="updated">Last Updated</option>
              <option value="created">Date Created</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <div className="p-4 text-center text-neutral-medium">
              No notes found
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className={`p-3 border-b border-neutral-light hover:bg-neutral-light cursor-pointer ${
                  selectedNote?.id === note.id ? 'bg-neutral-light border-l-4 border-l-primary' : ''
                }`}
                onClick={() => {
                  setSelectedNote(note);
                  setEditMode(false);
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium truncate">{note.title}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNote(note);
                        setEditMode(true);
                      }}>
                        <PencilLine className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Tag className="h-4 w-4 mr-2" /> Change Category
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500" onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}>
                        <Trash className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="text-sm text-neutral-medium truncate">{note.content}</div>
                <div className="text-xs text-neutral-medium mt-1">
                  {format(new Date(note.updatedAt), 'MMM d, yyyy')}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Note Content */}
      <div className="flex-1 bg-white overflow-auto">
        {selectedNote ? (
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-neutral-light flex justify-between items-center">
              {editMode ? (
                <Input 
                  value={selectedNote.title} 
                  onChange={(e) => setSelectedNote({...selectedNote, title: e.target.value})} 
                  className="text-xl font-bold"
                />
              ) : (
                <h1 className="text-xl font-bold">{selectedNote.title}</h1>
              )}
              
              <div className="flex items-center gap-2">
                {editMode ? (
                  <>
                    <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                    <Button onClick={handleUpdateNote}>Save</Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={() => setEditMode(true)}>
                    <PencilLine className="h-4 w-4 mr-2" /> Edit
                  </Button>
                )}
              </div>
            </div>
            
            <div className="p-4 text-sm text-neutral-medium">
              Last updated: {format(new Date(selectedNote.updatedAt), 'MMM d, yyyy h:mm a')}
            </div>
            
            <div className="flex-1 p-4">
              {editMode ? (
                <Textarea 
                  value={selectedNote.content} 
                  onChange={(e) => setSelectedNote({...selectedNote, content: e.target.value})} 
                  className="w-full h-full min-h-[300px]" 
                />
              ) : (
                <div className="whitespace-pre-wrap">{selectedNote.content}</div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-neutral-medium">
            <div className="text-center">
              <PencilLine className="h-16 w-16 mx-auto mb-4 text-neutral-light" />
              <p>Select a note or create a new one</p>
              <Button 
                variant="link" 
                className="mt-2"
                onClick={() => setCreateNoteOpen(true)}
              >
                Create a new note
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
