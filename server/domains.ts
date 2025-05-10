import { randomBytes } from 'crypto';
// Define a simplified Domain interface for in-memory storage
interface Domain {
  id: number;
  userId: number;
  domain: string;
  verified: boolean;
  verificationToken: string;
  maxUsers: number;
  currentUsers: number;
  createdAt: Date;
}

// In-memory domains storage (would use DB in production)
let domains: Domain[] = [];

/**
 * Adds a new domain for verification
 */
export function addDomain(userId: number, domainName: string): Domain {
  // Generate a random verification token
  const verificationToken = randomBytes(16).toString('hex');
  
  const newDomain: Domain = {
    id: domains.length > 0 ? Math.max(...domains.map(d => d.id)) + 1 : 1,
    userId,
    domain: domainName,
    verified: false,
    verificationToken,
    maxUsers: 10,
    currentUsers: 1,
    createdAt: new Date()
  };
  
  domains.push(newDomain);
  return newDomain;
}

/**
 * Verify domain ownership
 */
export function verifyDomain(domainId: number, token: string): boolean {
  const domain = domains.find(d => d.id === domainId);
  
  if (!domain) {
    return false;
  }
  
  if (domain.verificationToken === token) {
    domain.verified = true;
    return true;
  }
  
  return false;
}

/**
 * Get domains for a user
 */
export function getUserDomains(userId: number): Domain[] {
  return domains.filter(d => d.userId === userId);
}

/**
 * Get domain by ID
 */
export function getDomain(id: number): Domain | undefined {
  return domains.find(d => d.id === id);
}

/**
 * Get all domains
 */
export function getAllDomains(): Domain[] {
  return domains;
}

/**
 * Check if an email is from a verified domain
 */
export function isVerifiedDomainEmail(email: string): boolean {
  // Default centrifugalforce.free.nf emails are always valid
  if (email.endsWith('@centrifugalforce.free.nf')) {
    return true;
  }
  
  // Check for verified custom domains
  const domain = email.split('@')[1];
  return domains.some(d => d.domain === domain && d.verified);
}

/**
 * Add a user to a domain
 */
export function addUserToDomain(domainId: number): boolean {
  const domain = domains.find(d => d.id === domainId);
  
  if (!domain) {
    return false;
  }
  
  // Safely check if domain currentUsers exceeds maxUsers
  const currentUsers = domain.currentUsers || 1;
  const maxUsers = domain.maxUsers || 10;
  
  if (currentUsers >= maxUsers) {
    return false;
  }
  
  domain.currentUsers = currentUsers + 1;
  return true;
}