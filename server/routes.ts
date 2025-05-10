import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Type definitions
interface Email {
  id: number;
  from: string;
  to: string;
  subject: string;
  content: string;
  read: boolean;
  folder: string;
  timestamp: string;
}

interface Document {
  id: number;
  title: string;
  content: string;
  folder: string;
  starred: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface Note {
  id: number;
  title: string;
  content: string;
  color?: string;
  createdAt: string;
  updatedAt?: string;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  priority?: string;
  list?: string;
  createdAt: string;
}

interface Event {
  id: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  location?: string;
  createdAt: string;
}

interface Contact {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
  createdAt: string;
}

interface File {
  id: number;
  name: string;
  type: string;
  size: number;
  path?: string;
  uploadedAt: string;
}

// Sample data for development
let emails: Email[] = [
  {
    id: 1,
    from: "system@centrifugalforce.free.nf",
    to: "user@centrifugalforce.free.nf",
    subject: "Welcome to Centrifugal Browser",
    content: "Thank you for using Centrifugal Browser. This powerful browser with integrated applications is designed to enhance your productivity and online experience.\n\nExplore the various apps in the sidebar to get started!",
    read: false,
    folder: "inbox",
    timestamp: new Date().toISOString(),
  }
];

let documents: Document[] = [];
let notes: Note[] = [];
let tasks: Task[] = [];
let events: Event[] = [];
let contacts: Contact[] = [];
let files: File[] = [];

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get('/api/user', (req: Request, res: Response) => {
    // For demo, we'll return a fixed user
    res.json({
      id: 1,
      username: "user",
      displayName: "Current User",
      email: "user@centrifugalforce.free.nf"
    });
  });

  // Email routes
  app.get('/api/emails', (req: Request, res: Response) => {
    res.json(emails);
  });

  app.post('/api/emails', async (req: Request, res: Response) => {
    try {
      const { sendEmail } = await import('./sendgrid');
      
      const newEmail = {
        id: emails.length > 0 ? Math.max(...emails.map(e => e.id)) + 1 : 1,
        ...req.body,
        read: true,
        folder: 'sent',
        timestamp: new Date().toISOString()
      };
      
      // Send email using SendGrid
      const emailSent = await sendEmail({
        to: newEmail.to,
        from: newEmail.from,
        subject: newEmail.subject,
        text: newEmail.content,
        html: `<div>${newEmail.content.replace(/\n/g, '<br>')}</div>`
      });
      
      if (emailSent) {
        // Add to sent folder
        emails.push(newEmail);
        
        // Also add to recipient's inbox if it's to a local address
        if (newEmail.to.includes('@centrifugalforce.free.nf')) {
          const recipientCopy = {
            id: emails.length > 0 ? Math.max(...emails.map(e => e.id)) + 1 : 1,
            from: newEmail.from,
            to: newEmail.to,
            subject: newEmail.subject,
            content: newEmail.content,
            read: false,
            folder: 'inbox',
            timestamp: new Date().toISOString()
          };
          
          emails.push(recipientCopy);
        }
        
        res.status(200).json(newEmail);
      } else {
        res.status(500).json({ error: 'Failed to send email through SendGrid' });
      }
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  });

  app.put('/api/emails/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = emails.findIndex(email => email.id === id);
    
    if (index !== -1) {
      emails[index] = { ...emails[index], ...req.body };
      res.json(emails[index]);
    } else {
      res.status(404).json({ error: 'Email not found' });
    }
  });

  app.delete('/api/emails/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = emails.findIndex(email => email.id === id);
    
    if (index !== -1) {
      const deletedEmail = emails[index];
      emails.splice(index, 1);
      res.json(deletedEmail);
    } else {
      res.status(404).json({ error: 'Email not found' });
    }
  });

  // Document routes
  app.get('/api/documents', (req: Request, res: Response) => {
    res.json(documents);
  });

  app.post('/api/documents', (req: Request, res: Response) => {
    const newDocument = {
      id: documents.length > 0 ? Math.max(...documents.map(d => d.id)) + 1 : 1,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    documents.push(newDocument);
    res.status(201).json(newDocument);
  });

  // Notes routes
  app.get('/api/notes', (req: Request, res: Response) => {
    res.json(notes);
  });

  app.post('/api/notes', (req: Request, res: Response) => {
    const newNote = {
      id: notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    notes.push(newNote);
    res.status(201).json(newNote);
  });

  // Tasks routes
  app.get('/api/tasks', (req: Request, res: Response) => {
    res.json(tasks);
  });

  app.post('/api/tasks', (req: Request, res: Response) => {
    const newTask = {
      id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
      ...req.body,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    res.status(201).json(newTask);
  });

  // Events routes
  app.get('/api/events', (req: Request, res: Response) => {
    res.json(events);
  });

  app.post('/api/events', (req: Request, res: Response) => {
    const newEvent = {
      id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    events.push(newEvent);
    res.status(201).json(newEvent);
  });

  // Contacts routes
  app.get('/api/contacts', (req: Request, res: Response) => {
    res.json(contacts);
  });

  app.post('/api/contacts', (req: Request, res: Response) => {
    const newContact = {
      id: contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    contacts.push(newContact);
    res.status(201).json(newContact);
  });

  // Files/Drive routes
  app.get('/api/files', (req: Request, res: Response) => {
    res.json(files);
  });

  app.post('/api/files', (req: Request, res: Response) => {
    const newFile = {
      id: files.length > 0 ? Math.max(...files.map(f => f.id)) + 1 : 1,
      ...req.body,
      uploadedAt: new Date().toISOString(),
      size: req.body.size || 0,
      type: req.body.type || 'document'
    };
    
    files.push(newFile);
    res.status(201).json(newFile);
  });
  
  // Domain management routes
  app.get('/api/domains', (req: Request, res: Response) => {
    const { getAllDomains } = require('./domains');
    res.json(getAllDomains());
  });
  
  app.post('/api/domains', (req: Request, res: Response) => {
    const { addDomain } = require('./domains');
    const { userId, domain } = req.body;
    
    if (!domain) {
      return res.status(400).json({ error: 'Domain name is required' });
    }
    
    try {
      const newDomain = addDomain(userId || 1, domain);
      
      // Send a verification email
      const sendVerificationEmail = async () => {
        const { sendEmail } = await import('./sendgrid');
        const verificationUrl = `https://centrifugalbrowser.com/verify-domain/${newDomain.id}/${newDomain.verificationToken}`;
        
        await sendEmail({
          to: `admin@${domain}`,
          from: 'verification@centrifugalforce.free.nf',
          subject: 'Verify your domain with Centrifugal Browser',
          text: `Please verify your domain ownership by visiting: ${verificationUrl}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Domain Verification</h2>
              <p>Thank you for adding <strong>${domain}</strong> to Centrifugal Browser.</p>
              <p>To verify your domain ownership, you need to:</p>
              <ol>
                <li>Add a DNS TXT record with the value: <code>${newDomain.verificationToken}</code></li>
                <li>Or click <a href="${verificationUrl}">this verification link</a></li>
              </ol>
              <p>Once verified, you'll be able to create up to ${newDomain.maxUsers} email accounts on your domain.</p>
            </div>
          `
        });
      };
      
      // Don't wait for the email to be sent
      sendVerificationEmail().catch(console.error);
      
      res.status(201).json(newDomain);
    } catch (error) {
      console.error('Error adding domain:', error);
      res.status(500).json({ error: 'Failed to add domain' });
    }
  });
  
  app.get('/api/domains/:id', (req: Request, res: Response) => {
    const { getDomain } = require('./domains');
    const domainId = parseInt(req.params.id);
    const domain = getDomain(domainId);
    
    if (!domain) {
      return res.status(404).json({ error: 'Domain not found' });
    }
    
    res.json(domain);
  });
  
  app.post('/api/domains/verify', (req: Request, res: Response) => {
    const { verifyDomain } = require('./domains');
    const { domainId, token } = req.body;
    
    if (!domainId || !token) {
      return res.status(400).json({ error: 'Domain ID and verification token are required' });
    }
    
    const verified = verifyDomain(parseInt(domainId), token);
    
    if (verified) {
      res.json({ success: true, message: 'Domain verified successfully' });
    } else {
      res.status(400).json({ success: false, error: 'Invalid verification token' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
