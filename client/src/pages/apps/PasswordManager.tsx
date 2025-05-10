import { useEffect, useState } from 'react';
import { useAppState } from '@/hooks/use-app-state';
import { 
  KeyRound, Search, EyeOff, Eye, Copy, Trash, Edit, 
  PlusCircle, Shield, ShieldCheck, AlertCircle, Lock, 
  RefreshCw, Download, Upload, X, Check, MoreVertical, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';

type PasswordEntry = {
  id: number;
  website: string;
  username: string;
  password: string;
  url: string;
  notes?: string;
  category: string;
  strength: 'weak' | 'medium' | 'strong';
  favorite: boolean;
  lastUpdated: string;
  icon?: string;
};

export default function PasswordManager() {
  const { setCurrentApp } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<PasswordEntry | null>(null);
  const [passwordVisible, setPasswordVisible] = useState<{[key: number]: boolean}>({});
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Form states for adding/editing passwords
  const [newEntry, setNewEntry] = useState<Omit<PasswordEntry, 'id' | 'strength' | 'lastUpdated'>>({
    website: '',
    username: '',
    password: '',
    url: '',
    notes: '',
    category: 'general',
    favorite: false,
    icon: ''
  });
  
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  
  // Sample password entries (in a real app, this would come from a secure database)
  const [passwordEntries, setPasswordEntries] = useState<PasswordEntry[]>([
    {
      id: 1,
      website: 'Google',
      username: 'user@example.com',
      password: 'P@ssw0rd123!',
      url: 'https://google.com',
      notes: 'Main Google account',
      category: 'personal',
      strength: 'strong',
      favorite: true,
      lastUpdated: '2023-09-15T14:30:00Z',
      icon: '🌐'
    },
    {
      id: 2,
      website: 'Facebook',
      username: 'user@example.com',
      password: 'Fb54321!',
      url: 'https://facebook.com',
      category: 'social',
      strength: 'medium',
      favorite: false,
      lastUpdated: '2023-08-22T10:15:00Z',
      icon: '📱'
    },
    {
      id: 3,
      website: 'Amazon',
      username: 'shop_user',
      password: 'ShopPass2023',
      url: 'https://amazon.com',
      notes: 'Shopping account',
      category: 'shopping',
      strength: 'medium',
      favorite: true,
      lastUpdated: '2023-09-02T08:45:00Z',
      icon: '🛒'
    },
    {
      id: 4,
      website: 'Bank of America',
      username: 'financial_user',
      password: 'V3ryS3cur3P@ss!',
      url: 'https://bankofamerica.com',
      notes: 'Main checking account',
      category: 'financial',
      strength: 'strong',
      favorite: true,
      lastUpdated: '2023-09-10T16:30:00Z',
      icon: '🏦'
    },
    {
      id: 5,
      website: 'Twitter',
      username: 'social_user',
      password: 'Tweet2023!',
      url: 'https://twitter.com',
      category: 'social',
      strength: 'medium',
      favorite: false,
      lastUpdated: '2023-07-15T11:20:00Z',
      icon: '🐦'
    },
    {
      id: 6,
      website: 'Netflix',
      username: 'streaming_user',
      password: 'WatchMovies123',
      url: 'https://netflix.com',
      category: 'entertainment',
      strength: 'weak',
      favorite: false,
      lastUpdated: '2023-06-28T19:45:00Z',
      icon: '🎬'
    }
  ]);
  
  // Set the current app when component mounts
  useEffect(() => {
    setCurrentApp('password-manager');
  }, [setCurrentApp]);
  
  // Get all unique categories from password entries
  const categories = Array.from(new Set(passwordEntries.map(entry => entry.category)));
  
  // Filter password entries based on search query, active category, and tab
  const filteredEntries = passwordEntries.filter(entry => {
    // Filter by search query
    const matchesSearch = searchQuery === '' ||
      entry.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.notes && entry.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by category
    const matchesCategory = activeCategory === null || entry.category === activeCategory;
    
    // Filter by tab
    let matchesTab = true;
    if (activeTab === 'favorites') {
      matchesTab = entry.favorite;
    } else if (activeTab === 'weak') {
      matchesTab = entry.strength === 'weak';
    } else if (activeTab === 'strong') {
      matchesTab = entry.strength === 'strong';
    }
    
    return matchesSearch && matchesCategory && matchesTab;
  });
  
  const togglePasswordVisibility = (id: number) => {
    setPasswordVisible(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const handleCopyPassword = (password: string) => {
    navigator.clipboard.writeText(password);
    // In a real app, you would show a toast notification here
  };
  
  const toggleFavorite = (id: number) => {
    setPasswordEntries(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, favorite: !entry.favorite } : entry
      )
    );
  };
  
  const deleteEntry = (id: number) => {
    setPasswordEntries(prev => prev.filter(entry => entry.id !== id));
    if (selectedEntry?.id === id) {
      setSelectedEntry(null);
    }
  };
  
  const handleAddEntry = () => {
    // Calculate password strength
    const strength = calculatePasswordStrength(newEntry.password);
    
    // Create new entry
    const entry: PasswordEntry = {
      id: Date.now(),
      ...newEntry,
      strength,
      lastUpdated: new Date().toISOString()
    };
    
    // Add to entries
    setPasswordEntries(prev => [...prev, entry]);
    
    // Reset form
    setNewEntry({
      website: '',
      username: '',
      password: '',
      url: '',
      notes: '',
      category: 'general',
      favorite: false,
      icon: ''
    });
    
    // Close dialog
    setShowAddDialog(false);
  };
  
  const handleEditEntry = () => {
    if (!selectedEntry) return;
    
    // Calculate password strength
    const strength = calculatePasswordStrength(selectedEntry.password);
    
    // Update entry
    setPasswordEntries(prev => 
      prev.map(entry => 
        entry.id === selectedEntry.id 
          ? { ...selectedEntry, strength, lastUpdated: new Date().toISOString() } 
          : entry
      )
    );
    
    // Close dialog
    setShowEditDialog(false);
  };
  
  const calculatePasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    // Simple password strength calculation logic
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^a-zA-Z0-9]/.test(password);
    const isLongEnough = password.length >= 12;
    
    const score = [hasLowercase, hasUppercase, hasNumbers, hasSymbols, isLongEnough].filter(Boolean).length;
    
    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
  };
  
  const generatePassword = () => {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_-+=[]{}|:;<>,.?/~';
    
    let validChars = lowercaseChars;
    if (includeUppercase) validChars += uppercaseChars;
    if (includeNumbers) validChars += numberChars;
    if (includeSymbols) validChars += symbolChars;
    
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * validChars.length);
      password += validChars.charAt(randomIndex);
    }
    
    if (showAddDialog) {
      setNewEntry(prev => ({ ...prev, password }));
    } else if (showEditDialog && selectedEntry) {
      setSelectedEntry(prev => prev ? { ...prev, password } : null);
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
  
  const getStrengthColor = (strength: 'weak' | 'medium' | 'strong') => {
    switch (strength) {
      case 'weak':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'strong':
        return 'text-green-500';
    }
  };
  
  const getStrengthProgress = (strength: 'weak' | 'medium' | 'strong') => {
    switch (strength) {
      case 'weak':
        return 33;
      case 'medium':
        return 66;
      case 'strong':
        return 100;
    }
  };
  
  return (
    <div className="flex flex-1 overflow-hidden bg-[#121212] text-white">
      {/* Sidebar */}
      <div className="w-64 bg-[#1a1a1a] border-r border-[#333] flex flex-col">
        <div className="p-4 border-b border-[#333] flex items-center">
          <Shield className="h-5 w-5 mr-2 text-primary" />
          <h2 className="font-bold">Password Vault</h2>
        </div>
        
        <div className="p-4 border-b border-[#333]">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#777]" />
            <Input 
              placeholder="Search passwords" 
              className="pl-10 bg-[#252525] border-[#444] text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="p-4 border-b border-[#333]">
          <Button 
            className="w-full"
            onClick={() => setShowAddDialog(true)}
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Add Password
          </Button>
        </div>
        
        <div className="p-4 border-b border-[#333]">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-[#252525]">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary">All</TabsTrigger>
              <TabsTrigger value="favorites" className="data-[state=active]:bg-primary">Favorites</TabsTrigger>
              <TabsTrigger value="weak" className="data-[state=active]:bg-primary">Weak</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4">
            <h3 className="font-medium text-sm text-[#999] mb-2">CATEGORIES</h3>
            <div className="space-y-1">
              <Button
                variant={activeCategory === null ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveCategory(null)}
              >
                <KeyRound className="h-4 w-4 mr-3" /> All Passwords
              </Button>
              
              {categories.map(category => (
                <Button
                  key={category}
                  variant={activeCategory === category ? 'secondary' : 'ghost'}
                  className="w-full justify-start capitalize"
                  onClick={() => setActiveCategory(category)}
                >
                  {getCategoryIcon(category)}
                  <span className="ml-3 capitalize">{category}</span>
                </Button>
              ))}
            </div>
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-[#333] flex items-center justify-between text-sm text-[#777]">
          <div className="flex items-center">
            <Lock className="h-4 w-4 mr-2" />
            <span>CF-Secured</span>
          </div>
          <div>
            {passwordEntries.length} Passwords
          </div>
        </div>
      </div>
      
      {/* Password List */}
      <div className="w-80 border-r border-[#333] bg-[#1a1a1a] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#333] flex justify-between items-center">
          <h2 className="font-semibold">
            {activeCategory ? (
              <span className="capitalize">{activeCategory}</span>
            ) : activeTab === 'favorites' ? (
              'Favorites'
            ) : activeTab === 'weak' ? (
              'Weak Passwords'
            ) : (
              'All Passwords'
            )}
          </h2>
          
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <KeyRound className="h-16 w-16 mx-auto mb-4 text-[#444]" />
              <p className="text-[#777]">No passwords found</p>
              <p className="text-sm text-[#555] mt-2">
                {searchQuery ? 'Try a different search term' : 'Add a new password to get started'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#333]">
              {filteredEntries.map(entry => (
                <div
                  key={entry.id}
                  className={`p-4 cursor-pointer hover:bg-[#252525] ${
                    selectedEntry?.id === entry.id ? 'bg-[#252525]' : ''
                  }`}
                  onClick={() => setSelectedEntry(entry)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{entry.icon || '🔒'}</div>
                      <div>
                        <h3 className="font-medium">{entry.website}</h3>
                        <div className="text-sm text-[#999]">{entry.username}</div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-yellow-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(entry.id);
                      }}
                    >
                      <Star className={entry.favorite ? "fill-yellow-500 h-4 w-4" : "h-4 w-4"} />
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <Badge 
                      variant={
                        entry.strength === 'weak' ? 'destructive' : 
                        entry.strength === 'medium' ? 'secondary' : 
                        'outline'
                      }
                      className={`capitalize ${
                        entry.strength === 'weak' ? 'bg-red-500/10 text-red-500' : 
                        entry.strength === 'medium' ? 'bg-yellow-500/10 text-yellow-500' : 
                        'bg-green-500/10 text-green-500'
                      }`}
                    >
                      {entry.strength}
                    </Badge>
                    <div className="text-xs text-[#777]">
                      Updated {formatDate(entry.lastUpdated)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
      
      {/* Password Details */}
      <div className="flex-1 bg-[#121212] overflow-auto">
        {selectedEntry ? (
          <div className="max-w-3xl mx-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <div className="text-4xl mr-4">{selectedEntry.icon || '🔒'}</div>
                <div>
                  <h1 className="text-2xl font-bold">{selectedEntry.website}</h1>
                  <div className="text-[#999]">{selectedEntry.url}</div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="border-[#333]"
                  onClick={() => {
                    setSelectedEntry(selectedEntry);
                    setShowEditDialog(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => deleteEntry(selectedEntry.id)}
                >
                  <Trash className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </div>
            
            <div className="bg-[#1a1a1a] rounded-lg border border-[#333] divide-y divide-[#333]">
              <div className="p-4">
                <div className="text-sm text-[#999] mb-1">Username</div>
                <div className="flex justify-between items-center">
                  <div>{selectedEntry.username}</div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleCopyPassword(selectedEntry.username)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="text-sm text-[#999] mb-1">Password</div>
                <div className="flex justify-between items-center">
                  <div className="font-mono">
                    {passwordVisible[selectedEntry.id] 
                      ? selectedEntry.password 
                      : '••••••••••••••••'}
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => togglePasswordVisibility(selectedEntry.id)}
                    >
                      {passwordVisible[selectedEntry.id] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleCopyPassword(selectedEntry.password)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="text-sm text-[#999] mb-1">Password Strength</div>
                <div className="space-y-2">
                  <Progress 
                    value={getStrengthProgress(selectedEntry.strength)} 
                    className="h-2"
                    style={{
                      background: '#333',
                      '--progress-background': selectedEntry.strength === 'weak' 
                        ? 'rgb(239, 68, 68)' 
                        : selectedEntry.strength === 'medium' 
                          ? 'rgb(234, 179, 8)' 
                          : 'rgb(34, 197, 94)'
                    } as React.CSSProperties}
                  />
                  <div className={`text-sm ${getStrengthColor(selectedEntry.strength)}`}>
                    {selectedEntry.strength === 'weak' 
                      ? 'Weak - Consider updating this password' 
                      : selectedEntry.strength === 'medium' 
                        ? 'Medium - This password is acceptable' 
                        : 'Strong - This password is very secure'}
                  </div>
                </div>
              </div>
              
              {selectedEntry.notes && (
                <div className="p-4">
                  <div className="text-sm text-[#999] mb-1">Notes</div>
                  <div>{selectedEntry.notes}</div>
                </div>
              )}
              
              <div className="p-4">
                <div className="text-sm text-[#999] mb-1">Category</div>
                <Badge variant="outline" className="capitalize border-[#444]">
                  {selectedEntry.category}
                </Badge>
              </div>
              
              <div className="p-4">
                <div className="text-sm text-[#999] mb-1">Last Updated</div>
                <div>{formatDate(selectedEntry.lastUpdated)}</div>
              </div>
            </div>
            
            <div className="mt-6 bg-[#1a1a1a] rounded-lg border border-[#333] p-4">
              <div className="flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-semibold">CF Chip A Quantum Security</h3>
              </div>
              <p className="text-sm text-[#999] mt-2">
                This password is secured with quantum-resistant encryption and protected by the CF Chip A supercomputer, 
                making it virtually immune to brute force attacks.
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-center p-6">
            <div>
              <Shield className="h-24 w-24 mx-auto mb-6 text-[#333]" />
              <h2 className="text-xl font-bold mb-2">Select a password to view details</h2>
              <p className="text-[#777] max-w-md mx-auto">
                Your passwords are protected with quantum-resistant encryption
                powered by the CF Chip A supercomputer technology.
              </p>
              <Button 
                className="mt-4"
                onClick={() => setShowAddDialog(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Add New Password
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Add Password Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-[#1a1a1a] text-white border-[#333] max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Password</DialogTitle>
            <DialogDescription className="text-[#999]">
              Add a new password to your secure vault.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Website</label>
                <Input 
                  placeholder="Google"
                  value={newEntry.website}
                  onChange={(e) => setNewEntry({...newEntry, website: e.target.value})}
                  className="bg-[#252525] border-[#444] text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Category</label>
                <select
                  value={newEntry.category}
                  onChange={(e) => setNewEntry({...newEntry, category: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-[#444] bg-[#252525] px-3 py-2 text-sm text-white"
                >
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="financial">Financial</option>
                  <option value="social">Social</option>
                  <option value="shopping">Shopping</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">URL</label>
              <Input 
                placeholder="https://google.com"
                value={newEntry.url}
                onChange={(e) => setNewEntry({...newEntry, url: e.target.value})}
                className="bg-[#252525] border-[#444] text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Username / Email</label>
              <Input 
                placeholder="user@example.com"
                value={newEntry.username}
                onChange={(e) => setNewEntry({...newEntry, username: e.target.value})}
                className="bg-[#252525] border-[#444] text-white"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-white">Password</label>
                <Button 
                  variant="link" 
                  className="text-xs text-primary p-0 h-auto"
                  onClick={generatePassword}
                >
                  Generate Password
                </Button>
              </div>
              <div className="relative">
                <Input 
                  type={passwordVisible[-1] ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={newEntry.password}
                  onChange={(e) => setNewEntry({...newEntry, password: e.target.value})}
                  className="bg-[#252525] border-[#444] text-white pr-10"
                />
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => togglePasswordVisibility(-1)}
                >
                  {passwordVisible[-1] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-4 bg-[#252525] p-4 rounded-md">
              <h4 className="text-sm font-medium text-white">Password Generator</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Password Length: {passwordLength}</span>
                </div>
                <Slider
                  value={[passwordLength]}
                  min={8}
                  max={32}
                  step={1}
                  onValueChange={(values) => setPasswordLength(values[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="includeUppercase" 
                    checked={includeUppercase}
                    onCheckedChange={(checked) => setIncludeUppercase(!!checked)}
                  />
                  <label
                    htmlFor="includeUppercase"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Include Uppercase Letters
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="includeNumbers" 
                    checked={includeNumbers}
                    onCheckedChange={(checked) => setIncludeNumbers(!!checked)}
                  />
                  <label
                    htmlFor="includeNumbers"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Include Numbers
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="includeSymbols" 
                    checked={includeSymbols}
                    onCheckedChange={(checked) => setIncludeSymbols(!!checked)}
                  />
                  <label
                    htmlFor="includeSymbols"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Include Symbols
                  </label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Notes (Optional)</label>
              <textarea
                placeholder="Add notes about this password"
                value={newEntry.notes}
                onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                className="flex min-h-[80px] w-full rounded-md border border-[#444] bg-[#252525] px-3 py-2 text-sm text-white"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="favorite" 
                checked={newEntry.favorite}
                onCheckedChange={(checked) => setNewEntry({...newEntry, favorite: !!checked})}
              />
              <label
                htmlFor="favorite"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Add to Favorites
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)} className="border-[#444]">
              Cancel
            </Button>
            <Button onClick={handleAddEntry}>Add Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Password Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-[#1a1a1a] text-white border-[#333] max-w-md">
          {selectedEntry && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Password</DialogTitle>
                <DialogDescription className="text-[#999]">
                  Update your password details.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Website</label>
                    <Input 
                      value={selectedEntry.website}
                      onChange={(e) => setSelectedEntry({...selectedEntry, website: e.target.value})}
                      className="bg-[#252525] border-[#444] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Category</label>
                    <select
                      value={selectedEntry.category}
                      onChange={(e) => setSelectedEntry({...selectedEntry, category: e.target.value})}
                      className="flex h-10 w-full rounded-md border border-[#444] bg-[#252525] px-3 py-2 text-sm text-white"
                    >
                      <option value="personal">Personal</option>
                      <option value="work">Work</option>
                      <option value="financial">Financial</option>
                      <option value="social">Social</option>
                      <option value="shopping">Shopping</option>
                      <option value="entertainment">Entertainment</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">URL</label>
                  <Input 
                    value={selectedEntry.url}
                    onChange={(e) => setSelectedEntry({...selectedEntry, url: e.target.value})}
                    className="bg-[#252525] border-[#444] text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Username / Email</label>
                  <Input 
                    value={selectedEntry.username}
                    onChange={(e) => setSelectedEntry({...selectedEntry, username: e.target.value})}
                    className="bg-[#252525] border-[#444] text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-white">Password</label>
                    <Button 
                      variant="link" 
                      className="text-xs text-primary p-0 h-auto"
                      onClick={generatePassword}
                    >
                      Generate Password
                    </Button>
                  </div>
                  <div className="relative">
                    <Input 
                      type={passwordVisible[-2] ? 'text' : 'password'}
                      value={selectedEntry.password}
                      onChange={(e) => setSelectedEntry({...selectedEntry, password: e.target.value})}
                      className="bg-[#252525] border-[#444] text-white pr-10"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => togglePasswordVisibility(-2)}
                    >
                      {passwordVisible[-2] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Notes (Optional)</label>
                  <textarea
                    value={selectedEntry.notes || ''}
                    onChange={(e) => setSelectedEntry({...selectedEntry, notes: e.target.value})}
                    className="flex min-h-[80px] w-full rounded-md border border-[#444] bg-[#252525] px-3 py-2 text-sm text-white"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="edit-favorite" 
                    checked={selectedEntry.favorite}
                    onCheckedChange={(checked) => setSelectedEntry({...selectedEntry, favorite: !!checked})}
                  />
                  <label
                    htmlFor="edit-favorite"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Add to Favorites
                  </label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEditDialog(false)} className="border-[#444]">
                  Cancel
                </Button>
                <Button onClick={handleEditEntry}>Save Changes</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper function to get icon based on category
function getCategoryIcon(category: string) {
  switch (category) {
    case 'personal':
      return <User className="h-4 w-4" />;
    case 'work':
      return <Briefcase className="h-4 w-4" />;
    case 'financial':
      return <DollarSign className="h-4 w-4" />;
    case 'social':
      return <Users className="h-4 w-4" />;
    case 'shopping':
      return <ShoppingCart className="h-4 w-4" />;
    case 'entertainment':
      return <Film className="h-4 w-4" />;
    default:
      return <Folder className="h-4 w-4" />;
  }
}

// Missing icon components
function Star(props: React.SVGProps<SVGSVGElement>) {
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function User(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function Briefcase(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function DollarSign(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function Users(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ShoppingCart(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function Film(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18" />
      <line x1="7" x2="7" y1="2" y2="22" />
      <line x1="17" x2="17" y1="2" y2="22" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <line x1="2" x2="7" y1="7" y2="7" />
      <line x1="2" x2="7" y1="17" y2="17" />
      <line x1="17" x2="22" y1="17" y2="17" />
      <line x1="17" x2="22" y1="7" y2="7" />
    </svg>
  );
}

function Folder(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    </svg>
  );
}