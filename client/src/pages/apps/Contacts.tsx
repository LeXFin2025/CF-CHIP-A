import { useEffect, useState } from 'react';
import { useAppState } from '@/hooks/use-app-state';
import { Users, User, Plus, Search, Phone, Mail, MapPin, Building, Star, Trash, Edit, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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

type Contact = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  group: string;
  favorite: boolean;
  notes: string;
};

export default function Contacts() {
  const { setCurrentApp } = useAppState();
  const [activeGroup, setActiveGroup] = useState<string>('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [createContactOpen, setCreateContactOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    group: 'general',
    notes: ''
  });
  
  // Set the current app when component mounts
  useEffect(() => {
    setCurrentApp('contacts');
  }, [setCurrentApp]);
  
  // Sample contacts data (in a real app this would come from an API)
  const [contacts, setContacts] = useState<Contact[]>([
    { 
      id: 1, 
      firstName: 'John', 
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      company: 'Acme Inc.',
      address: '123 Main St, Anytown, USA',
      group: 'work',
      favorite: true,
      notes: 'Project manager for the new web platform.'
    },
    { 
      id: 2, 
      firstName: 'Jane', 
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '(555) 987-6543',
      company: 'XYZ Corp',
      address: '456 Oak Ave, Somewhere, USA',
      group: 'work',
      favorite: false,
      notes: 'Marketing director, good contact for promotional opportunities.'
    },
    { 
      id: 3, 
      firstName: 'Michael', 
      lastName: 'Johnson',
      email: 'michael.j@example.com',
      phone: '(555) 222-3333',
      company: '',
      address: '789 Pine Rd, Elsewhere, USA',
      group: 'friends',
      favorite: true,
      notes: 'College roommate, birthday is May 15.'
    },
    { 
      id: 4, 
      firstName: 'Sarah', 
      lastName: 'Williams',
      email: 'sarah.w@example.com',
      phone: '(555) 444-5555',
      company: 'ABC Partners',
      address: '321 Cedar Ln, Nowhere, USA',
      group: 'work',
      favorite: false,
      notes: 'Potential client, interested in our new services.'
    },
    { 
      id: 5, 
      firstName: 'Robert', 
      lastName: 'Brown',
      email: 'robert.brown@example.com',
      phone: '(555) 666-7777',
      company: '',
      address: '654 Elm St, Anytown, USA',
      group: 'family',
      favorite: true,
      notes: 'Brother-in-law, works in IT.'
    }
  ]);
  
  const groups = [
    { id: 'all', name: 'All Contacts', icon: <Users className="h-5 w-5" /> },
    { id: 'favorites', name: 'Favorites', icon: <Star className="h-5 w-5" /> },
    { id: 'work', name: 'Work', icon: <Building className="h-5 w-5" /> },
    { id: 'friends', name: 'Friends', icon: <Users className="h-5 w-5" /> },
    { id: 'family', name: 'Family', icon: <Users className="h-5 w-5" /> },
    { id: 'general', name: 'General', icon: <Users className="h-5 w-5" /> },
  ];
  
  const filteredContacts = contacts.filter(contact => {
    // Filter by group
    const groupMatch = 
      activeGroup === 'all' || 
      (activeGroup === 'favorites' && contact.favorite) ||
      contact.group === activeGroup;
    
    // Filter by search term
    const searchMatch = 
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    return groupMatch && searchMatch;
  });
  
  // Sort contacts alphabetically by last name
  const sortedContacts = [...filteredContacts].sort((a, b) => 
    a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName)
  );
  
  const handleCreateContact = () => {
    // In a real app this would be an API call
    const newContactObj: Contact = {
      id: contacts.length + 1,
      firstName: newContact.firstName,
      lastName: newContact.lastName,
      email: newContact.email,
      phone: newContact.phone,
      company: newContact.company,
      address: newContact.address,
      group: newContact.group,
      favorite: false,
      notes: newContact.notes
    };
    
    setContacts([...contacts, newContactObj]);
    setNewContact({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      group: 'general',
      notes: ''
    });
    setCreateContactOpen(false);
    setSelectedContact(newContactObj);
  };
  
  const handleUpdateContact = () => {
    if (!selectedContact) return;
    
    const updatedContacts = contacts.map(contact => {
      if (contact.id === selectedContact.id) {
        return selectedContact;
      }
      return contact;
    });
    
    setContacts(updatedContacts);
    setEditMode(false);
  };
  
  const handleDeleteContact = (id: number) => {
    setContacts(contacts.filter(contact => contact.id !== id));
    if (selectedContact?.id === id) {
      setSelectedContact(null);
    }
  };
  
  const handleToggleFavorite = (id: number) => {
    const updatedContacts = contacts.map(contact => {
      if (contact.id === id) {
        return { ...contact, favorite: !contact.favorite };
      }
      return contact;
    });
    
    setContacts(updatedContacts);
    
    if (selectedContact?.id === id) {
      setSelectedContact({ ...selectedContact, favorite: !selectedContact.favorite });
    }
  };
  
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
  
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-neutral-light p-4 flex flex-col">
        <Dialog open={createContactOpen} onOpenChange={setCreateContactOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mb-4" size="lg">
              <Plus className="mr-2 h-4 w-4" /> Add Contact
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Contact</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                  <Input 
                    id="firstName" 
                    value={newContact.firstName} 
                    onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })} 
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                  <Input 
                    id="lastName" 
                    value={newContact.lastName} 
                    onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })} 
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input 
                  id="email" 
                  type="email" 
                  value={newContact.email} 
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })} 
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                <Input 
                  id="phone" 
                  value={newContact.phone} 
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} 
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="company" className="text-sm font-medium">Company</label>
                <Input 
                  id="company" 
                  value={newContact.company} 
                  onChange={(e) => setNewContact({ ...newContact, company: e.target.value })} 
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="address" className="text-sm font-medium">Address</label>
                <Input 
                  id="address" 
                  value={newContact.address} 
                  onChange={(e) => setNewContact({ ...newContact, address: e.target.value })} 
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="group" className="text-sm font-medium">Group</label>
                <select
                  id="group"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newContact.group}
                  onChange={(e) => setNewContact({ ...newContact, group: e.target.value })}
                >
                  <option value="general">General</option>
                  <option value="work">Work</option>
                  <option value="friends">Friends</option>
                  <option value="family">Family</option>
                </select>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                <Input 
                  id="notes" 
                  value={newContact.notes} 
                  onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })} 
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateContactOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateContact}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-medium" />
            <Input 
              placeholder="Search contacts" 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-1">
          {groups.map((group) => (
            <button
              key={group.id}
              className={`w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-neutral-light ${
                activeGroup === group.id ? 'bg-primary text-white hover:bg-primary' : ''
              }`}
              onClick={() => setActiveGroup(group.id)}
            >
              <span className="mr-3">{group.icon}</span>
              {group.name}
              {group.id !== 'all' && (
                <span className="ml-auto">
                  {group.id === 'favorites' 
                    ? contacts.filter(c => c.favorite).length 
                    : contacts.filter(c => c.group === group.id).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Contact List */}
      <div className="w-80 border-r border-neutral-light bg-white overflow-hidden flex flex-col">
        <div className="p-4 border-b border-neutral-light flex items-center justify-between">
          <h2 className="font-semibold">{groups.find(g => g.id === activeGroup)?.name}</h2>
          <div className="text-sm text-neutral-medium">
            {filteredContacts.length} contacts
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {sortedContacts.length === 0 ? (
            <div className="p-4 text-center text-neutral-medium">
              No contacts found
            </div>
          ) : (
            sortedContacts.map((contact) => (
              <div
                key={contact.id}
                className={`p-3 border-b border-neutral-light hover:bg-neutral-light cursor-pointer ${
                  selectedContact?.id === contact.id ? 'bg-neutral-light' : ''
                }`}
                onClick={() => {
                  setSelectedContact(contact);
                  setEditMode(false);
                }}
              >
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback className="bg-primary text-white">
                      {getInitials(contact.firstName, contact.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium flex items-center">
                      {contact.firstName} {contact.lastName}
                      {contact.favorite && (
                        <Star className="h-3 w-3 ml-1 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    <div className="text-sm text-neutral-medium">
                      {contact.email || contact.phone}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Contact Details */}
      <div className="flex-1 bg-white overflow-auto">
        {selectedContact ? (
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-neutral-light flex justify-between items-center">
              <h1 className="text-xl font-bold">Contact Details</h1>
              
              <div className="flex items-center gap-2">
                {editMode ? (
                  <>
                    <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                    <Button onClick={handleUpdateContact}>Save</Button>
                  </>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setEditMode(true)}>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleToggleFavorite(selectedContact.id)}
                      >
                        <Star className="h-4 w-4 mr-2" /> 
                        {selectedContact.favorite ? 'Remove from favorites' : 'Add to favorites'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeleteContact(selectedContact.id)} 
                        className="text-red-500"
                      >
                        <Trash className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-6">
                <Avatar className="h-20 w-20 mr-6">
                  <AvatarFallback className="text-2xl bg-primary text-white">
                    {getInitials(selectedContact.firstName, selectedContact.lastName)}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  {editMode ? (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <Input 
                        value={selectedContact.firstName} 
                        onChange={(e) => setSelectedContact({...selectedContact, firstName: e.target.value})} 
                        placeholder="First Name"
                      />
                      <Input 
                        value={selectedContact.lastName} 
                        onChange={(e) => setSelectedContact({...selectedContact, lastName: e.target.value})} 
                        placeholder="Last Name"
                      />
                    </div>
                  ) : (
                    <h2 className="text-2xl font-bold mb-1">
                      {selectedContact.firstName} {selectedContact.lastName}
                      {selectedContact.favorite && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="ml-1 h-6 w-6"
                          onClick={() => handleToggleFavorite(selectedContact.id)}
                        >
                          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        </Button>
                      )}
                    </h2>
                  )}
                  
                  {selectedContact.company && !editMode && (
                    <div className="text-neutral-medium flex items-center">
                      <Building className="h-4 w-4 mr-2" />
                      {selectedContact.company}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Contact Information</h3>
                  
                  <div>
                    <div className="text-sm text-neutral-medium mb-1">Email</div>
                    {editMode ? (
                      <Input 
                        value={selectedContact.email} 
                        onChange={(e) => setSelectedContact({...selectedContact, email: e.target.value})} 
                      />
                    ) : (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-neutral-medium" />
                        <a href={`mailto:${selectedContact.email}`} className="text-primary hover:underline">
                          {selectedContact.email || 'No email provided'}
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="text-sm text-neutral-medium mb-1">Phone</div>
                    {editMode ? (
                      <Input 
                        value={selectedContact.phone} 
                        onChange={(e) => setSelectedContact({...selectedContact, phone: e.target.value})} 
                      />
                    ) : (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-neutral-medium" />
                        <a href={`tel:${selectedContact.phone}`} className="hover:underline">
                          {selectedContact.phone || 'No phone provided'}
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="text-sm text-neutral-medium mb-1">Company</div>
                    {editMode ? (
                      <Input 
                        value={selectedContact.company} 
                        onChange={(e) => setSelectedContact({...selectedContact, company: e.target.value})} 
                      />
                    ) : (
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-neutral-medium" />
                        {selectedContact.company || 'No company provided'}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Other Details</h3>
                  
                  <div>
                    <div className="text-sm text-neutral-medium mb-1">Address</div>
                    {editMode ? (
                      <Input 
                        value={selectedContact.address} 
                        onChange={(e) => setSelectedContact({...selectedContact, address: e.target.value})} 
                      />
                    ) : (
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mr-2 text-neutral-medium mt-0.5" />
                        <span>{selectedContact.address || 'No address provided'}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="text-sm text-neutral-medium mb-1">Group</div>
                    {editMode ? (
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={selectedContact.group}
                        onChange={(e) => setSelectedContact({...selectedContact, group: e.target.value})}
                      >
                        <option value="general">General</option>
                        <option value="work">Work</option>
                        <option value="friends">Friends</option>
                        <option value="family">Family</option>
                      </select>
                    ) : (
                      <div className="capitalize">{selectedContact.group}</div>
                    )}
                  </div>
                  
                  <div>
                    <div className="text-sm text-neutral-medium mb-1">Notes</div>
                    {editMode ? (
                      <Input 
                        value={selectedContact.notes} 
                        onChange={(e) => setSelectedContact({...selectedContact, notes: e.target.value})} 
                      />
                    ) : (
                      <div>{selectedContact.notes || 'No notes provided'}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-neutral-medium">
            <div className="text-center">
              <User className="h-16 w-16 mx-auto mb-4 text-neutral-light" />
              <p>Select a contact or create a new one</p>
              <Button 
                variant="link" 
                className="mt-2"
                onClick={() => setCreateContactOpen(true)}
              >
                Create a new contact
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
