import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppState } from '@/hooks/use-app-state';
import { Mail as MailIcon, Inbox, Send, Star, Archive, Trash, Plus, RefreshCw, Upload, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiRequest } from '@/lib/queryClient';
import { Email } from '@/types';
import { formatDistanceToNow } from 'date-fns';

export default function Mail() {
  const { setCurrentApp, user } = useAppState();
  const [activeFolder, setActiveFolder] = useState<string>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [newEmail, setNewEmail] = useState({
    to: '',
    subject: '',
    content: ''
  });
  
  // Set the current app when component mounts
  useEffect(() => {
    setCurrentApp('mail');
  }, [setCurrentApp]);
  
  // Fetch emails
  const { data: emails = [], isLoading, refetch } = useQuery<Email[]>({
    queryKey: ['/api/emails', activeFolder],
    refetchInterval: 10000 // Refetch every 10 seconds
  });
  
  const filteredEmails = emails.filter(email => email.folder === activeFolder);
  
  const handleSendEmail = async () => {
    try {
      await apiRequest('POST', '/api/emails', {
        from: user?.email || 'john.doe@centrifugalforce.free.nf',
        ...newEmail
      });
      
      // Reset form and close compose dialog
      setNewEmail({ to: '', subject: '', content: '' });
      setComposeOpen(false);
      
      // Refetch emails
      refetch();
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };
  
  const folders = [
    { id: 'inbox', name: 'Inbox', icon: <Inbox className="h-5 w-5" /> },
    { id: 'sent', name: 'Sent', icon: <Send className="h-5 w-5" /> },
    { id: 'starred', name: 'Starred', icon: <Star className="h-5 w-5" /> },
    { id: 'archive', name: 'Archive', icon: <Archive className="h-5 w-5" /> },
    { id: 'trash', name: 'Trash', icon: <Trash className="h-5 w-5" /> }
  ];

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-neutral-light p-4 flex flex-col">
        <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mb-4" size="lg">
              <Plus className="mr-2 h-4 w-4" /> Compose
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>New Message</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="to" className="text-sm font-medium">To</label>
                <Input 
                  id="to" 
                  value={newEmail.to} 
                  onChange={(e) => setNewEmail({ ...newEmail, to: e.target.value })} 
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <Input 
                  id="subject" 
                  value={newEmail.subject} 
                  onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })} 
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="content" className="text-sm font-medium">Message</label>
                <Textarea 
                  id="content" 
                  rows={10} 
                  value={newEmail.content} 
                  onChange={(e) => setNewEmail({ ...newEmail, content: e.target.value })} 
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setComposeOpen(false)}>Cancel</Button>
              <Button onClick={handleSendEmail}>Send</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
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
              {folder.id === 'inbox' && (
                <span className={`ml-auto ${activeFolder === 'inbox' ? 'bg-white text-primary' : 'bg-primary text-white'} px-2 py-0.5 rounded-full text-xs`}>
                  {filteredEmails.filter(e => !e.read).length}
                </span>
              )}
            </button>
          ))}
        </div>
        
        <div className="mt-auto pt-4 border-t border-neutral-light">
          <div className="flex items-center justify-between text-sm text-neutral-medium">
            <div>
              {user?.email || 'john.doe@centrifugalforce.free.nf'}
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Email List */}
      <div className="w-80 border-r border-neutral-light bg-white overflow-hidden flex flex-col">
        <div className="p-4 border-b border-neutral-light flex items-center justify-between">
          <h2 className="font-semibold">{folders.find(f => f.id === activeFolder)?.name}</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="p-4 text-center text-neutral-medium">Loading emails...</div>
          ) : filteredEmails.length === 0 ? (
            <div className="p-4 text-center text-neutral-medium">No emails in this folder</div>
          ) : (
            filteredEmails.map((email) => (
              <div
                key={email.id}
                className={`p-3 border-b border-neutral-light hover:bg-neutral-light cursor-pointer ${
                  selectedEmail?.id === email.id ? 'bg-neutral-light' : ''
                } ${!email.read ? 'font-semibold' : ''}`}
                onClick={() => setSelectedEmail(email)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="truncate">{email.from}</span>
                  <span className="text-xs text-neutral-medium whitespace-nowrap">
                    {formatDistanceToNow(new Date(email.timestamp), { addSuffix: true })}
                  </span>
                </div>
                <div className="text-sm font-medium truncate">{email.subject}</div>
                <div className="text-xs text-neutral-medium truncate">{email.content}</div>
              </div>
            ))
          )}
        </ScrollArea>
      </div>
      
      {/* Email Content */}
      <div className="flex-1 bg-white overflow-auto">
        {selectedEmail ? (
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-4">{selectedEmail.subject}</h1>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-semibold">From:</span> {selectedEmail.from}
                </div>
                <div className="text-neutral-medium">
                  {new Date(selectedEmail.timestamp).toLocaleString()}
                </div>
              </div>
              <div className="text-sm mb-2">
                <span className="font-semibold">To:</span> {selectedEmail.to}
              </div>
            </div>
            
            <div className="border-t border-neutral-light pt-6 whitespace-pre-wrap">
              {selectedEmail.content}
            </div>
            
            <div className="mt-6 pt-6 border-t border-neutral-light flex gap-2">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" /> Reply
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" /> Forward
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-neutral-medium">
            <div className="text-center">
              <MailIcon className="h-16 w-16 mx-auto mb-4 text-neutral-light" />
              <p>Select an email to read</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
