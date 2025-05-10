import { useEffect, useState } from 'react';
import { useAppState } from '@/hooks/use-app-state';
import { useParams, useLocation } from 'wouter';
import { ArrowLeft, Plus, Mail, Shield, Trash, Copy, Check, AlertTriangle, User, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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

interface EmailUser {
  id: number;
  domainId: number;
  username: string;
  displayName: string;
  active: boolean;
  createdAt: string;
}

export default function DomainEmailUsers() {
  const { setCurrentApp } = useAppState();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  const params = useParams();
  const domainId = params.id ? parseInt(params.id) : 0;
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    displayName: '',
  });
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<EmailUser | null>(null);
  
  // Set the current app when component mounts
  useEffect(() => {
    setCurrentApp('settings');
  }, [setCurrentApp]);
  
  // Fetch domain
  const { 
    data: domain, 
    isLoading: isDomainLoading,
    error: domainError
  } = useQuery<Domain>({
    queryKey: [`/api/domains/${domainId}`],
    enabled: domainId > 0,
  });
  
  // Fetch users
  const { 
    data: users = [] as EmailUser[],
    isLoading: isUsersLoading,
    error: usersError
  } = useQuery<EmailUser[]>({
    queryKey: [`/api/domains/${domainId}/users`],
    enabled: domainId > 0,
  });
  
  const isLoading = isDomainLoading || isUsersLoading;
  
  // Add user mutation
  const addUserMutation = useMutation({
    mutationFn: async (userData: typeof newUser) => {
      return apiRequest('POST', `/api/domains/${domainId}/users`, userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/domains/${domainId}/users`] });
      queryClient.invalidateQueries({ queryKey: [`/api/domains/${domainId}`] });
      setAddUserOpen(false);
      setNewUser({ username: '', displayName: '' });
      toast({
        title: "Success",
        description: "Email user created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to create email user",
        variant: "destructive"
      });
    }
  });
  
  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      return apiRequest('DELETE', `/api/domains/${domainId}/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/domains/${domainId}/users`] });
      queryClient.invalidateQueries({ queryKey: [`/api/domains/${domainId}`] });
      setConfirmDeleteOpen(false);
      setUserToDelete(null);
      toast({
        title: "Success",
        description: "Email user deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete email user",
        variant: "destructive"
      });
    }
  });
  
  const handleAddUser = () => {
    if (!newUser.username.trim()) {
      toast({
        title: "Error",
        description: "Username is required",
        variant: "destructive"
      });
      return;
    }
    
    // Validate username (only allow letters, numbers, periods, underscores, hyphens)
    if (!/^[a-zA-Z0-9._-]+$/.test(newUser.username)) {
      toast({
        title: "Error",
        description: "Username can only contain letters, numbers, periods, underscores, and hyphens",
        variant: "destructive"
      });
      return;
    }
    
    addUserMutation.mutate(newUser);
  };
  
  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    deleteUserMutation.mutate(userToDelete.id);
  };
  
  const openDeleteDialog = (user: EmailUser) => {
    setUserToDelete(user);
    setConfirmDeleteOpen(true);
  };
  
  if (!domainId) {
    return <div className="p-8 text-center">Invalid domain ID</div>;
  }
  
  if (domainError) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => setLocation('/settings')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
        </Button>
        
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load domain information. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => setLocation('/settings')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
      </Button>
      
      {isLoading ? (
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-7 bg-neutral-light rounded w-48 mb-2"></div>
            <div className="h-4 bg-neutral-light rounded w-32"></div>
          </CardHeader>
          <CardContent>
            <div className="h-4 bg-neutral-light rounded w-full mb-4"></div>
            <div className="h-4 bg-neutral-light rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-neutral-light rounded w-1/2"></div>
          </CardContent>
        </Card>
      ) : domain ? (
        <>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold">{domain.domain}</h1>
              <p className="text-neutral-medium mt-1">
                Manage email users for this domain
              </p>
            </div>
            
            <Badge variant={domain.verified ? "default" : "outline"} className="text-base py-1 px-3">
              {domain.verified ? "Verified" : "Unverified"}
            </Badge>
          </div>
          
          {!domain.verified ? (
            <Alert className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Domain Not Verified</AlertTitle>
              <AlertDescription>
                You need to verify domain ownership before adding email users.
                <Button 
                  variant="link" 
                  className="p-0 h-auto ml-2"
                  onClick={() => setLocation('/settings')}
                >
                  Go to verification
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-primary" />
                  <span className="text-lg font-medium">
                    Email Users ({domain.currentUsers} of {domain.maxUsers})
                  </span>
                </div>
                
                <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
                  <Button 
                    onClick={() => setAddUserOpen(true)}
                    disabled={domain.currentUsers >= domain.maxUsers}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Email User
                  </Button>
                  
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Email User</DialogTitle>
                      <DialogDescription>
                        Create a new email address on {domain.domain}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-[1fr,auto] items-end gap-2">
                        <div className="space-y-2">
                          <label htmlFor="username" className="text-sm font-medium">Username</label>
                          <Input
                            id="username"
                            placeholder="johnsmith"
                            value={newUser.username}
                            onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                          />
                        </div>
                        <span className="text-neutral-medium pb-2">@{domain.domain}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="displayName" className="text-sm font-medium">Display Name (optional)</label>
                        <Input
                          id="displayName"
                          placeholder="John Smith"
                          value={newUser.displayName}
                          onChange={(e) => setNewUser({...newUser, displayName: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAddUserOpen(false)}>Cancel</Button>
                      <Button 
                        onClick={handleAddUser}
                        disabled={addUserMutation.isPending}
                      >
                        {addUserMutation.isPending ? "Creating..." : "Create Email User"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              {isUsersLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader className="py-4">
                        <div className="h-5 bg-neutral-light rounded w-48"></div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : users.length === 0 ? (
                <Card className="text-center p-6">
                  <User className="h-12 w-12 mx-auto mb-3 text-neutral-light" />
                  <CardTitle className="mb-2">No Email Users</CardTitle>
                  <CardDescription>
                    Add your first email user to start using your custom domain for email.
                  </CardDescription>
                </Card>
              ) : (
                <div className="space-y-4">
                  {users.map(user => (
                    <Card key={user.id}>
                      <CardHeader className="py-4">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-medium flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-primary" />
                              {user.username}@{domain.domain}
                              {user.displayName && <span className="ml-2 text-neutral-medium">({user.displayName})</span>}
                            </div>
                            <div className="text-sm text-neutral-medium">Created on {new Date(user.createdAt).toLocaleDateString()}</div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                navigator.clipboard.writeText(`${user.username}@${domain.domain}`);
                                toast({
                                  title: "Copied",
                                  description: "Email address copied to clipboard",
                                });
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => openDeleteDialog(user)}
                            >
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
          
          <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Email User</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this email user? 
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              
              {userToDelete && (
                <div className="py-4">
                  <p className="font-medium">{userToDelete.username}@{domain.domain}</p>
                  <p className="text-sm text-neutral-medium">
                    All emails sent to this address will no longer be received.
                  </p>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
                <Button 
                  variant="destructive"
                  onClick={handleConfirmDelete}
                  disabled={deleteUserMutation.isPending}
                >
                  {deleteUserMutation.isPending ? "Deleting..." : "Delete User"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : null}
    </div>
  );
}