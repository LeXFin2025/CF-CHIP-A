// Define types
interface EmailUser {
  id: number;
  domainId: number;
  username: string;
  displayName: string;
  active: boolean;
  createdAt: Date;
}

// In-memory storage for email users
let domainUsers: EmailUser[] = [];

/**
 * Get all users for a domain
 */
export function getDomainUsers(domainId: number): EmailUser[] {
  return domainUsers.filter(user => user.domainId === domainId);
}

/**
 * Get user by ID
 */
export function getDomainUser(userId: number): EmailUser | undefined {
  return domainUsers.find(user => user.id === userId);
}

/**
 * Add a user to a domain
 */
export function addDomainUser(domainId: number, username: string, displayName: string = ''): EmailUser {
  const newUser: EmailUser = {
    id: domainUsers.length > 0 ? Math.max(...domainUsers.map(u => u.id)) + 1 : 1,
    domainId,
    username,
    displayName,
    active: true,
    createdAt: new Date()
  };
  
  domainUsers.push(newUser);
  return newUser;
}

/**
 * Delete a user
 */
export function deleteDomainUser(userId: number): boolean {
  const index = domainUsers.findIndex(user => user.id === userId);
  
  if (index === -1) {
    return false;
  }
  
  domainUsers.splice(index, 1);
  return true;
}

/**
 * Update a user
 */
export function updateDomainUser(userId: number, updates: Partial<EmailUser>): EmailUser | undefined {
  const user = domainUsers.find(user => user.id === userId);
  
  if (!user) {
    return undefined;
  }
  
  Object.assign(user, updates);
  return user;
}

/**
 * Check if a username exists for a domain
 */
export function isDomainUsernameTaken(domainId: number, username: string): boolean {
  return domainUsers.some(user => 
    user.domainId === domainId && 
    user.username.toLowerCase() === username.toLowerCase()
  );
}

/**
 * Get count of users for a domain
 */
export function getDomainUserCount(domainId: number): number {
  return domainUsers.filter(user => user.domainId === domainId).length;
}