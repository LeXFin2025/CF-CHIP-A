import { useEffect, useState } from 'react';
import { useAppState } from '@/hooks/use-app-state';
import { useLocation } from 'wouter';
import { Globe, Plus, RefreshCw, Trash, Check, X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface Domain {
  id: number;
  userId: number;
  domain: string;
  verified: boolean;
  verificationToken?: string;
  maxUsers: number;
  currentUsers: number;
  createdAt: string;
}

export default function Settings() {
  const { setCurrentApp } = useAppState();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [_, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('domains');
  const [addDomainOpen, setAddDomainOpen] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [verifyDomainOpen, setVerifyDomainOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  
  // Set the current app when component mounts
  useEffect(() => {
    setCurrentApp('settings');
  }, [setCurrentApp]);
  
  // Fetch domains
  const { data: domains = [] as Domain[], isLoading } = useQuery<Domain[]>({
    queryKey: ['/api/domains'],
  });
  
  // Add domain mutation
  const addDomainMutation = useMutation({
    mutationFn: async (domain: string) => {
      return apiRequest('POST', '/api/domains', { domain });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/domains'] });
      setAddDomainOpen(false);
      setNewDomain('');
      toast({
        title: "Success",
        description: "Domain added successfully. A verification email has been sent.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add domain",
        variant: "destructive"
      });
    }
  });
  
  // Verify domain mutation
  const verifyDomainMutation = useMutation({
    mutationFn: async ({ domainId, token }: { domainId: number, token: string }) => {
      return apiRequest('POST', '/api/domains/verify', { domainId, token });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/domains'] });
      setVerifyDomainOpen(false);
      setSelectedDomain(null);
      toast({
        title: "Success",
        description: "Domain verified successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to verify domain. Please check the verification code.",
        variant: "destructive"
      });
    }
  });
  
  const handleAddDomain = () => {
    if (!newDomain.trim()) {
      toast({
        title: "Error",
        description: "Please enter a domain name",
        variant: "destructive"
      });
      return;
    }
    
    addDomainMutation.mutate(newDomain);
  };
  
  const handleVerifyDomain = () => {
    if (!selectedDomain) return;
    
    verifyDomainMutation.mutate({
      domainId: selectedDomain.id,
      token: verificationCode
    });
  };
  
  const openVerifyDialog = (domain: Domain) => {
    setSelectedDomain(domain);
    setVerificationCode(domain.verificationToken || '');
    setVerifyDomainOpen(true);
  };
  
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-neutral-medium mt-1">Manage your account settings and preferences</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="domains">Domains</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="domains">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Domain Management</h2>
                <p className="text-neutral-medium">Add and manage custom domains for email</p>
              </div>
              
              <Dialog open={addDomainOpen} onOpenChange={setAddDomainOpen}>
                <Button onClick={() => setAddDomainOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Domain
                </Button>
                
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Custom Domain</DialogTitle>
                    <DialogDescription>
                      Add a custom domain for email addresses. You'll need to verify ownership.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="domain" className="text-sm font-medium">Domain Name</label>
                      <Input
                        id="domain"
                        placeholder="example.com"
                        value={newDomain}
                        onChange={(e) => setNewDomain(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddDomainOpen(false)}>Cancel</Button>
                    <Button 
                      onClick={handleAddDomain}
                      disabled={addDomainMutation.isPending}
                    >
                      {addDomainMutation.isPending ? "Adding..." : "Add Domain"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Domain Verification</AlertTitle>
              <AlertDescription>
                After adding a domain, you'll need to verify ownership by adding a TXT record
                or clicking the verification link sent to your admin email address.
              </AlertDescription>
            </Alert>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-neutral-light rounded w-36 mb-2"></div>
                      <div className="h-4 bg-neutral-light rounded w-24"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-neutral-light rounded w-full mb-3"></div>
                      <div className="h-4 bg-neutral-light rounded w-3/4"></div>
                    </CardContent>
                    <CardFooter>
                      <div className="h-9 bg-neutral-light rounded w-full"></div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : domains.length === 0 ? (
              <Card className="text-center p-8">
                <Globe className="h-12 w-12 text-neutral-light mx-auto mb-4" />
                <CardTitle className="mb-2">No Custom Domains</CardTitle>
                <CardDescription>
                  You can still use your default centrifugalforce.free.nf address.
                  Add a custom domain to use your own branded email addresses.
                </CardDescription>
                <Button className="mt-4" onClick={() => setAddDomainOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Domain
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {domains.map((domain: Domain) => (
                  <Card key={domain.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{domain.domain}</CardTitle>
                        <Badge variant={domain.verified ? "default" : "outline"}>
                          {domain.verified ? "Verified" : "Unverified"}
                        </Badge>
                      </div>
                      <CardDescription>Added on {new Date(domain.createdAt).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-neutral-medium">Users:</span>
                          <span>{domain.currentUsers} / {domain.maxUsers}</span>
                        </div>
                        {domain.verified ? (
                          <div className="flex items-center text-green-600">
                            <ShieldCheck className="h-4 w-4 mr-1" />
                            <span>Domain verified and active</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-amber-600">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            <span>Verification required</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      {domain.verified ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => setLocation(`/domain-users/${domain.id}`)}
                        >
                          <Plus className="h-4 w-4 mr-2" /> Manage Users
                        </Button>
                      ) : (
                        <Button size="sm" className="w-full" onClick={() => openVerifyDialog(domain)}>
                          <Check className="h-4 w-4 mr-2" /> Verify Domain
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          <Dialog open={verifyDomainOpen} onOpenChange={setVerifyDomainOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Verify Domain Ownership</DialogTitle>
                {selectedDomain && (
                  <DialogDescription>
                    Verify ownership of {selectedDomain.domain}
                  </DialogDescription>
                )}
              </DialogHeader>
              
              {selectedDomain && (
                <div className="space-y-4">
                  <div className="bg-neutral-light p-4 rounded-md">
                    <h3 className="font-medium mb-2">Option 1: Add TXT Record</h3>
                    <p className="text-sm mb-2">
                      Add a TXT record to your domain's DNS settings with the following value:
                    </p>
                    <code className="block bg-background p-2 rounded text-sm break-all">
                      {selectedDomain.verificationToken}
                    </code>
                  </div>
                  
                  <div className="bg-neutral-light p-4 rounded-md">
                    <h3 className="font-medium mb-2">Option 2: Use Verification Code</h3>
                    <p className="text-sm mb-2">
                      Enter the verification code sent to admin@{selectedDomain.domain}:
                    </p>
                    <Input
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Verification code"
                    />
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setVerifyDomainOpen(false)}>Cancel</Button>
                <Button 
                  onClick={handleVerifyDomain}
                  disabled={verifyDomainMutation.isPending}
                >
                  {verifyDomainMutation.isPending ? "Verifying..." : "Verify Domain"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        <TabsContent value="account">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Account Settings</h2>
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="displayName" className="text-sm font-medium">Display Name</label>
                    <Input id="displayName" defaultValue="Current User" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                    <Input id="email" defaultValue="user@centrifugalforce.free.nf" readOnly />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto">Save Changes</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="appearance">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Appearance</h2>
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
                <CardDescription>Manage your visual preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Theme Mode</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 justify-start">
                        Dark (Default)
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="security">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Security Settings</h2>
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Update your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="current-password" className="text-sm font-medium">Current Password</label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="new-password" className="text-sm font-medium">New Password</label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="text-sm font-medium">Confirm New Password</label>
                  <Input id="confirm-password" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto">Update Password</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}