import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Sample data for development
let emails = [
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

let documents = [];
let notes = [];
let tasks = [];
let events = [];
let contacts = [];
let files = [];

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

  app.post('/api/emails', (req: Request, res: Response) => {
    const newEmail = {
      id: emails.length > 0 ? Math.max(...emails.map(e => e.id)) + 1 : 1,
      ...req.body,
      read: false,
      folder: 'sent',
      timestamp: new Date().toISOString()
    };
    
    emails.push(newEmail);
    
    // Also add a copy to the recipient's inbox
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
    
    res.status(200).json(newEmail);
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

  const httpServer = createServer(app);
  return httpServer;
}
