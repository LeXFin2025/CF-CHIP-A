import { useEffect, useState } from 'react';
import { useAppState } from '@/hooks/use-app-state';
import { Settings as SettingsIcon, User, Bell, Shield, Globe, Monitor, Sun, Moon, Laptop, Info, Languages, Server, Download, Upload, LogOut, Database, Lock, Lightbulb, Keyboard, Save, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Settings() {
  const { setCurrentApp } = useAppState();
  const [activeTab, setActiveTab] = useState('general');
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoStart, setAutoStart] = useState(true);
  const [defaultSearchEngine, setDefaultSearchEngine] = useState('google');
  const [showBookmarksBar, setShowBookmarksBar] = useState(true);
  const [homePage, setHomePage] = useState('https://centrifugal.com');
  const [fontSize, setFontSize] = useState(14);
  const [storageUsed, setStorageUsed] = useState(12.4); // in GB
  const [languageSetting, setLanguageSetting] = useState('english');
  const [updateStatus, setUpdateStatus] = useState('up-to-date');
  const [backupFrequency, setBackupFrequency] = useState('weekly');
  const [systemInfo, setSystemInfo] = useState({
    version: '1.0.0',
    buildDate: 'May 10, 2025',
    os: 'Windows 11',
    processor: 'CF Chip A',
    ram: '16 GB',
    storage: '500 GB SSD',
    graphics: 'Intel Iris Xe',
  });
  
  // Set the current app when component mounts
  useEffect(() => {
    setCurrentApp('settings');
  }, [setCurrentApp]);

  // Simulate a save action
  const handleSave = () => {
    // In a real app, this would save settings to a database or local storage
    console.log('Settings saved');
  };
  
  // Simulate checking for updates
  const handleCheckForUpdates = () => {
    setUpdateStatus('checking');
    
    // Simulate a network request
    setTimeout(() => {
      setUpdateStatus('up-to-date');
    }, 2000);
  };
  
  return (
    <div className="flex flex-1 overflow-hidden bg-[#121212] text-white">
      {/* Sidebar */}
      <div className="w-64 bg-[#1a1a1a] border-r border-[#333] flex flex-col">
        <div className="p-4 border-b border-[#333] flex items-center">
          <SettingsIcon className="h-5 w-5 mr-2 text-primary" />
          <h2 className="font-bold">Settings</h2>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2">
            <Button
              variant={activeTab === 'general' ? 'secondary' : 'ghost'}
              className="w-full justify-start mb-1"
              onClick={() => setActiveTab('general')}
            >
              <Laptop className="h-4 w-4 mr-3" /> General
            </Button>
            
            <Button
              variant={activeTab === 'appearance' ? 'secondary' : 'ghost'}
              className="w-full justify-start mb-1"
              onClick={() => setActiveTab('appearance')}
            >
              <Sun className="h-4 w-4 mr-3" /> Appearance
            </Button>
            
            <Button
              variant={activeTab === 'browser' ? 'secondary' : 'ghost'}
              className="w-full justify-start mb-1"
              onClick={() => setActiveTab('browser')}
            >
              <Globe className="h-4 w-4 mr-3" /> Browser
            </Button>
            
            <Button
              variant={activeTab === 'notifications' ? 'secondary' : 'ghost'}
              className="w-full justify-start mb-1"
              onClick={() => setActiveTab('notifications')}
            >
              <Bell className="h-4 w-4 mr-3" /> Notifications
            </Button>
            
            <Button
              variant={activeTab === 'privacy' ? 'secondary' : 'ghost'}
              className="w-full justify-start mb-1"
              onClick={() => setActiveTab('privacy')}
            >
              <Shield className="h-4 w-4 mr-3" /> Privacy & Security
            </Button>
            
            <Button
              variant={activeTab === 'storage' ? 'secondary' : 'ghost'}
              className="w-full justify-start mb-1"
              onClick={() => setActiveTab('storage')}
            >
              <Database className="h-4 w-4 mr-3" /> Storage
            </Button>
            
            <Button
              variant={activeTab === 'language' ? 'secondary' : 'ghost'}
              className="w-full justify-start mb-1"
              onClick={() => setActiveTab('language')}
            >
              <Languages className="h-4 w-4 mr-3" /> Language
            </Button>
            
            <Button
              variant={activeTab === 'updates' ? 'secondary' : 'ghost'}
              className="w-full justify-start mb-1"
              onClick={() => setActiveTab('updates')}
            >
              <RefreshCw className="h-4 w-4 mr-3" /> Updates
            </Button>
            
            <Button
              variant={activeTab === 'account' ? 'secondary' : 'ghost'}
              className="w-full justify-start mb-1"
              onClick={() => setActiveTab('account')}
            >
              <User className="h-4 w-4 mr-3" /> Account
            </Button>
            
            <Button
              variant={activeTab === 'about' ? 'secondary' : 'ghost'}
              className="w-full justify-start mb-1"
              onClick={() => setActiveTab('about')}
            >
              <Info className="h-4 w-4 mr-3" /> About
            </Button>
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-[#333]">
          <Button variant="outline" className="w-full border-[#444]">
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 bg-[#121212] overflow-y-auto">
        <ScrollArea className="h-full">
          <div className="max-w-3xl mx-auto p-6">
            {activeTab === 'general' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">General Settings</h1>
                
                <Card className="bg-[#1a1a1a] border-[#333] mb-6">
                  <CardHeader>
                    <CardTitle>General Preferences</CardTitle>
                    <CardDescription className="text-[#999]">
                      Configure basic application settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="dark-mode">Dark Mode</Label>
                        <div className="text-sm text-[#999]">Enable dark theme across all applications</div>
                      </div>
                      <Switch 
                        id="dark-mode" 
                        checked={darkMode} 
                        onCheckedChange={setDarkMode}
                      />
                    </div>
                    
                    <Separator className="bg-[#333]" />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-start">Auto Start</Label>
                        <div className="text-sm text-[#999]">Launch Centrifugal Browser on system startup</div>
                      </div>
                      <Switch 
                        id="auto-start" 
                        checked={autoStart} 
                        onCheckedChange={setAutoStart}
                      />
                    </div>
                    
                    <Separator className="bg-[#333]" />
                    
                    <div className="space-y-3">
                      <Label htmlFor="font-size">Font Size</Label>
                      <div className="flex items-center space-x-4">
                        <Slider
                          id="font-size"
                          defaultValue={[fontSize]}
                          max={24}
                          min={8}
                          step={1}
                          onValueChange={(values) => setFontSize(values[0])}
                          className="flex-1"
                        />
                        <span className="w-12 text-center">{fontSize}px</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" /> Save Changes
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="bg-[#1a1a1a] border-[#333]">
                  <CardHeader>
                    <CardTitle>Keyboard Shortcuts</CardTitle>
                    <CardDescription className="text-[#999]">
                      Common keyboard shortcuts for quick navigation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-y-3">
                      <div className="text-sm">New Tab</div>
                      <div className="text-sm font-mono bg-[#252525] px-2 py-1 rounded">Ctrl + T</div>
                      
                      <div className="text-sm">Close Tab</div>
                      <div className="text-sm font-mono bg-[#252525] px-2 py-1 rounded">Ctrl + W</div>
                      
                      <div className="text-sm">Browser History</div>
                      <div className="text-sm font-mono bg-[#252525] px-2 py-1 rounded">Ctrl + H</div>
                      
                      <div className="text-sm">Find in Page</div>
                      <div className="text-sm font-mono bg-[#252525] px-2 py-1 rounded">Ctrl + F</div>
                      
                      <div className="text-sm">Refresh</div>
                      <div className="text-sm font-mono bg-[#252525] px-2 py-1 rounded">Ctrl + R</div>
                      
                      <div className="text-sm">Settings</div>
                      <div className="text-sm font-mono bg-[#252525] px-2 py-1 rounded">Ctrl + ,</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="border-[#444]">Customize Shortcuts</Button>
                  </CardFooter>
                </Card>
              </div>
            )}
            
            {activeTab === 'appearance' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Appearance</h1>
                
                <Card className="bg-[#1a1a1a] border-[#333] mb-6">
                  <CardHeader>
                    <CardTitle>Theme</CardTitle>
                    <CardDescription className="text-[#999]">
                      Customize the look and feel
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup defaultValue="dark" className="space-y-3">
                      <div className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value="dark" id="theme-dark" />
                        <Label htmlFor="theme-dark" className="flex items-center">
                          <Moon className="h-5 w-5 mr-2" /> Dark (Default)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value="light" id="theme-light" />
                        <Label htmlFor="theme-light" className="flex items-center">
                          <Sun className="h-5 w-5 mr-2" /> Light
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value="system" id="theme-system" />
                        <Label htmlFor="theme-system" className="flex items-center">
                          <Laptop className="h-5 w-5 mr-2" /> System
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#1a1a1a] border-[#333]">
                  <CardHeader>
                    <CardTitle>Display Settings</CardTitle>
                    <CardDescription className="text-[#999]">
                      Customize visual elements
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="smooth-scrolling">Enable Smooth Scrolling</Label>
                      <Switch id="smooth-scrolling" defaultChecked />
                    </div>
                    
                    <Separator className="bg-[#333]" />
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="animations">Enable Animations</Label>
                      <Switch id="animations" defaultChecked />
                    </div>
                    
                    <Separator className="bg-[#333]" />
                    
                    <div className="space-y-3">
                      <Label>Accent Color</Label>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer ring-2 ring-blue-500 ring-offset-2 ring-offset-[#1a1a1a]"></div>
                        <div className="w-8 h-8 rounded-full bg-purple-500 cursor-pointer"></div>
                        <div className="w-8 h-8 rounded-full bg-green-500 cursor-pointer"></div>
                        <div className="w-8 h-8 rounded-full bg-red-500 cursor-pointer"></div>
                        <div className="w-8 h-8 rounded-full bg-yellow-500 cursor-pointer"></div>
                        <div className="w-8 h-8 rounded-full bg-pink-500 cursor-pointer"></div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" /> Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
            
            {activeTab === 'browser' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Browser Settings</h1>
                
                <Card className="bg-[#1a1a1a] border-[#333] mb-6">
                  <CardHeader>
                    <CardTitle>Startup</CardTitle>
                    <CardDescription className="text-[#999]">
                      Configure browser startup behavior
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup defaultValue="homepage" className="space-y-3">
                      <div className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value="homepage" id="startup-homepage" />
                        <Label htmlFor="startup-homepage">Open the homepage</Label>
                      </div>
                      <div className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value="newtab" id="startup-newtab" />
                        <Label htmlFor="startup-newtab">Open the new tab page</Label>
                      </div>
                      <div className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value="restore" id="startup-restore" />
                        <Label htmlFor="startup-restore">Continue where you left off</Label>
                      </div>
                    </RadioGroup>
                    
                    <div className="space-y-2 pt-3">
                      <Label htmlFor="homepage">Homepage</Label>
                      <Input 
                        id="homepage" 
                        value={homePage} 
                        onChange={(e) => setHomePage(e.target.value)}
                        className="bg-[#252525] border-[#444] text-white"
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#1a1a1a] border-[#333] mb-6">
                  <CardHeader>
                    <CardTitle>Search Engine</CardTitle>
                    <CardDescription className="text-[#999]">
                      Set default search engine
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup 
                      value={defaultSearchEngine} 
                      onValueChange={setDefaultSearchEngine}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value="google" id="search-google" />
                        <Label htmlFor="search-google" className="flex items-center">
                          Google
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value="bing" id="search-bing" />
                        <Label htmlFor="search-bing" className="flex items-center">
                          Bing
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value="duckduckgo" id="search-duckduckgo" />
                        <Label htmlFor="search-duckduckgo" className="flex items-center">
                          DuckDuckGo
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value="custom" id="search-custom" />
                        <Label htmlFor="search-custom" className="flex items-center">
                          Custom
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#1a1a1a] border-[#333]">
                  <CardHeader>
                    <CardTitle>Display and Navigation</CardTitle>
                    <CardDescription className="text-[#999]">
                      Browser display preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="bookmarks-bar">Show Bookmarks Bar</Label>
                        <div className="text-sm text-[#999]">Display bookmarks below address bar</div>
                      </div>
                      <Switch 
                        id="bookmarks-bar" 
                        checked={showBookmarksBar} 
                        onCheckedChange={setShowBookmarksBar}
                      />
                    </div>
                    
                    <Separator className="bg-[#333]" />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="tab-previews">Show Tab Previews</Label>
                        <div className="text-sm text-[#999]">Display previews when hovering over tabs</div>
                      </div>
                      <Switch id="tab-previews" defaultChecked />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" /> Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
            
            {activeTab === 'storage' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Storage</h1>
                
                <Card className="bg-[#1a1a1a] border-[#333] mb-6">
                  <CardHeader>
                    <CardTitle>Storage Usage</CardTitle>
                    <CardDescription className="text-[#999]">
                      Manage your 50GB cloud storage
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Storage Used</span>
                        <span>{storageUsed.toFixed(1)} GB of 50 GB</span>
                      </div>
                      <div className="w-full bg-[#252525] rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${(storageUsed / 50) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <Separator className="bg-[#333]" />
                    
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Storage Breakdown</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                            Documents
                          </span>
                          <span>3.2 GB</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            Media
                          </span>
                          <span>7.1 GB</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                            Applications
                          </span>
                          <span>1.8 GB</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                            Other
                          </span>
                          <span>0.3 GB</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" className="border-[#444]">
                      <Download className="h-4 w-4 mr-2" /> Manage Storage
                    </Button>
                    <Button variant="outline" className="border-[#444]">
                      <Upload className="h-4 w-4 mr-2" /> Upgrade Plan
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="bg-[#1a1a1a] border-[#333]">
                  <CardHeader>
                    <CardTitle>Backup and Sync</CardTitle>
                    <CardDescription className="text-[#999]">
                      Configure backup frequency and settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label>Backup Frequency</Label>
                      <RadioGroup 
                        value={backupFrequency} 
                        onValueChange={setBackupFrequency}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-3 space-y-0">
                          <RadioGroupItem value="daily" id="backup-daily" />
                          <Label htmlFor="backup-daily">Daily</Label>
                        </div>
                        <div className="flex items-center space-x-3 space-y-0">
                          <RadioGroupItem value="weekly" id="backup-weekly" />
                          <Label htmlFor="backup-weekly">Weekly</Label>
                        </div>
                        <div className="flex items-center space-x-3 space-y-0">
                          <RadioGroupItem value="monthly" id="backup-monthly" />
                          <Label htmlFor="backup-monthly">Monthly</Label>
                        </div>
                        <div className="flex items-center space-x-3 space-y-0">
                          <RadioGroupItem value="manual" id="backup-manual" />
                          <Label htmlFor="backup-manual">Manual Only</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <Separator className="bg-[#333]" />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-sync">Auto Sync</Label>
                        <div className="text-sm text-[#999]">Automatically sync across devices</div>
                      </div>
                      <Switch id="auto-sync" defaultChecked />
                    </div>
                    
                    <div className="text-sm text-neutral-medium mt-2">
                      Last backup: May 9, 2025, 10:45 PM
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" className="border-[#444]">
                      <Download className="h-4 w-4 mr-2" /> Restore Backup
                    </Button>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" /> Backup Now
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
            
            {activeTab === 'updates' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Updates</h1>
                
                <Card className="bg-[#1a1a1a] border-[#333]">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Software Updates</CardTitle>
                      <div className="px-3 py-1 bg-green-900/50 text-green-400 text-xs rounded-full">
                        Up to date
                      </div>
                    </div>
                    <CardDescription className="text-[#999]">
                      Keep your software up to date with the latest features and security improvements
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Current Version</div>
                      <div className="text-lg">{systemInfo.version} <span className="text-xs text-[#777]">(Build 1052)</span></div>
                      <div className="text-sm text-[#777]">Released on {systemInfo.buildDate}</div>
                    </div>
                    
                    <Separator className="bg-[#333]" />
                    
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Update Settings</h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="auto-update">Automatic Updates</Label>
                          <div className="text-sm text-[#999]">Install updates automatically</div>
                        </div>
                        <Switch id="auto-update" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="beta-updates">Beta Updates</Label>
                          <div className="text-sm text-[#999]">Receive pre-release updates</div>
                        </div>
                        <Switch id="beta-updates" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={handleCheckForUpdates}
                      disabled={updateStatus === 'checking'}
                    >
                      {updateStatus === 'checking' ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Checking...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" /> Check for Updates
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
            
            {activeTab === 'about' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">About</h1>
                
                <Card className="bg-[#1a1a1a] border-[#333] mb-6">
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-tr from-primary-light to-primary p-3 rounded-lg">
                        <Shield className="h-10 w-10 text-white" />
                      </div>
                      <div>
                        <CardTitle>Centrifugal Browser</CardTitle>
                        <CardDescription className="text-[#999]">
                          The most secure browser powered by CF Chip A
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm text-[#999]">Version</div>
                        <div>{systemInfo.version}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-[#999]">Build Date</div>
                        <div>{systemInfo.buildDate}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-[#999]">Operating System</div>
                        <div>{systemInfo.os}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-[#999]">Processor</div>
                        <div>{systemInfo.processor}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-[#999]">Memory</div>
                        <div>{systemInfo.ram}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-[#999]">Storage</div>
                        <div>{systemInfo.storage}</div>
                      </div>
                    </div>
                    
                    <Separator className="bg-[#333]" />
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">CF Chip A Technology</h3>
                      <p className="text-sm text-[#999]">
                        Your browser is powered by the revolutionary CF Chip A, a quantum-based processor
                        that provides unmatched performance, security, and battery efficiency. The CF Chip A
                        allows complex calculations to be processed up to 100x faster than traditional chips.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex space-x-2">
                    <Button variant="outline" className="border-[#444]">
                      Check for Updates
                    </Button>
                    <Button variant="outline" className="border-[#444]">
                      License Agreement
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="bg-[#1a1a1a] border-[#333]">
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription className="text-[#999]">
                      System performance powered by CF Chip A
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-5">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Processor Utilization</span>
                          <span className="text-sm">12%</span>
                        </div>
                        <div className="w-full bg-[#252525] rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: "12%" }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Memory Usage</span>
                          <span className="text-sm">2.4 GB / 16 GB</span>
                        </div>
                        <div className="w-full bg-[#252525] rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Quantum Processing Units</span>
                          <span className="text-sm">24 / 128 QPUs</span>
                        </div>
                        <div className="w-full bg-[#252525] rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: "19%" }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Battery Impact</span>
                          <span className="text-sm">Low</span>
                        </div>
                        <div className="w-full bg-[#252525] rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "10%" }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}