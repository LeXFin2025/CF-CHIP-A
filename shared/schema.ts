import { pgTable, text, serial, integer, timestamp, boolean, jsonb, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  email: text("email").unique(),
  avatar: text("avatar"),
  storageUsed: doublePrecision("storage_used").default(0), // in GB
  storageLimit: doublePrecision("storage_limit").default(50), // 50GB storage per user
  theme: text("theme").default("dark"), // Default to dark theme
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  preferences: jsonb("preferences"), // User preferences as JSON
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  email: true,
});

export const emails = pgTable("emails", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  from: text("from").notNull(),
  to: text("to").notNull(),
  subject: text("subject"),
  content: text("content"),
  attachments: jsonb("attachments"),
  read: boolean("read").default(false),
  folder: text("folder").default("inbox"),
  timestamp: timestamp("timestamp").defaultNow(),
  starred: boolean("starred").default(false),
  labels: jsonb("labels").default([]), // Email labels as JSON array
  draft: boolean("draft").default(false),
});

export const insertEmailSchema = createInsertSchema(emails).omit({
  id: true,
  read: true,
  timestamp: true,
});

export const domains = pgTable("domains", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  domain: text("domain").notNull().unique(),
  verified: boolean("verified").default(false),
  verificationToken: text("verification_token"),
  maxUsers: integer("max_users").default(10),
  currentUsers: integer("current_users").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDomainSchema = createInsertSchema(domains).omit({
  id: true, 
  verified: true, 
  verificationToken: true,
  currentUsers: true,
  createdAt: true,
});

export const tabs = pgTable("tabs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title"),
  url: text("url"),
  favicon: text("favicon"),
  active: boolean("active").default(false),
  lastAccessed: timestamp("last_accessed").defaultNow(),
  pinned: boolean("pinned").default(false),
  groupId: integer("group_id"), // For tab grouping feature
});

export const insertTabSchema = createInsertSchema(tabs).omit({
  id: true,
  lastAccessed: true,
});

export const browserHistory = pgTable("browser_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title"),
  url: text("url"),
  favicon: text("favicon"),
  visitTime: timestamp("visit_time").defaultNow(),
  visitCount: integer("visit_count").default(1),
});

export const insertHistorySchema = createInsertSchema(browserHistory).omit({
  id: true,
  visitTime: true,
  visitCount: true,
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  allDay: boolean("all_day").default(false),
  location: text("location"),
  color: text("color"),
  isRecurring: boolean("is_recurring").default(false),
  recurrencePattern: jsonb("recurrence_pattern"), // For recurring events
  reminders: jsonb("reminders"), // Reminders as JSON array
  attendees: jsonb("attendees"), // Event attendees as JSON array
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// New tables for additional features

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  email: text("email"),
  phone: text("phone"),
  company: text("company"),
  address: text("address"),
  notes: text("notes"),
  avatar: text("avatar"),
  favorite: boolean("favorite").default(false),
  group: text("group"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'folder', 'document', 'image', etc.
  mimeType: text("mime_type"),
  size: doublePrecision("size").default(0), // File size in bytes
  path: jsonb("path").notNull(), // File path as JSON array
  parentId: integer("parent_id"), // Parent folder ID for hierarchy
  content: text("content"), // For text-based files
  shared: boolean("shared").default(false),
  sharedWith: jsonb("shared_with"), // User IDs with access
  storageUrl: text("storage_url"), // URL for actual file storage
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
  lastAccessed: timestamp("last_accessed"),
  starred: boolean("starred").default(false),
  trashed: boolean("trashed").default(false),
});

export const insertFileSchema = createInsertSchema(files).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastAccessed: true,
});

export const music = pgTable("music", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  artist: text("artist"),
  album: text("album"),
  duration: integer("duration"), // Duration in seconds
  fileId: integer("file_id"), // Reference to the files table
  sourceType: text("source_type"), // 'spotify', 'amazon', 'local', etc.
  externalId: text("external_id"), // ID from external source
  coverArt: text("cover_art"),
  favorite: boolean("favorite").default(false),
  playCount: integer("play_count").default(0),
  addedAt: timestamp("added_at").defaultNow(),
  lastPlayed: timestamp("last_played"),
});

export const insertMusicSchema = createInsertSchema(music).omit({
  id: true,
  addedAt: true,
  lastPlayed: true,
  playCount: true,
});

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  duration: integer("duration"), // Duration in seconds
  fileId: integer("file_id"), // Reference to the files table
  sourceType: text("source_type"), // 'youtube', 'local', etc.
  externalId: text("external_id"), // ID from external source
  thumbnail: text("thumbnail"),
  favorite: boolean("favorite").default(false),
  viewCount: integer("view_count").default(0),
  addedAt: timestamp("added_at").defaultNow(),
  lastViewed: timestamp("last_viewed"),
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  addedAt: true,
  lastViewed: true,
  viewCount: true,
});

export const podcasts = pgTable("podcasts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  host: text("host"),
  description: text("description"),
  coverArt: text("cover_art"),
  category: text("category"),
  sourceType: text("source_type"), // 'spotify', 'apple', etc.
  externalId: text("external_id"), // ID from external source
  favorite: boolean("favorite").default(false),
  subscribed: boolean("subscribed").default(false),
  addedAt: timestamp("added_at").defaultNow(),
});

export const insertPodcastSchema = createInsertSchema(podcasts).omit({
  id: true,
  addedAt: true,
});

export const podcastEpisodes = pgTable("podcast_episodes", {
  id: serial("id").primaryKey(),
  podcastId: integer("podcast_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  duration: integer("duration"), // Duration in seconds
  publishDate: timestamp("publish_date"),
  listened: boolean("listened").default(false),
  progress: integer("progress").default(0), // Progress percentage
  fileId: integer("file_id"), // Reference to the files table
  externalId: text("external_id"), // ID from external source
});

export const insertPodcastEpisodeSchema = createInsertSchema(podcastEpisodes).omit({
  id: true,
});

export const maps = pgTable("maps", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name"),
  startLocation: jsonb("start_location"), // JSON with lat/long coords
  endLocation: jsonb("end_location"), // JSON with lat/long coords
  waypoints: jsonb("waypoints"), // Array of waypoints as JSON
  travelMode: text("travel_mode").default("driving"), // driving, walking, transit, etc.
  distance: doublePrecision("distance"), // in meters
  duration: integer("duration"), // in seconds
  savedAt: timestamp("saved_at").defaultNow(),
  favorite: boolean("favorite").default(false),
});

export const insertMapSchema = createInsertSchema(maps).omit({
  id: true,
  savedAt: true,
});

export const translations = pgTable("translations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  sourceText: text("source_text").notNull(),
  sourceLanguage: text("source_language").notNull(),
  targetText: text("target_text").notNull(),
  targetLanguage: text("target_language").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  favorite: boolean("favorite").default(false),
});

export const insertTranslationSchema = createInsertSchema(translations).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertEmail = z.infer<typeof insertEmailSchema>;
export type Email = typeof emails.$inferSelect;

export type InsertDomain = z.infer<typeof insertDomainSchema>;
export type Domain = typeof domains.$inferSelect;

export type InsertTab = z.infer<typeof insertTabSchema>;
export type Tab = typeof tabs.$inferSelect;

export type InsertHistory = z.infer<typeof insertHistorySchema>;
export type BrowserHistory = typeof browserHistory.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

export type InsertFile = z.infer<typeof insertFileSchema>;
export type File = typeof files.$inferSelect;

export type InsertMusic = z.infer<typeof insertMusicSchema>;
export type Music = typeof music.$inferSelect;

export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;

export type InsertPodcast = z.infer<typeof insertPodcastSchema>;
export type Podcast = typeof podcasts.$inferSelect;

export type InsertPodcastEpisode = z.infer<typeof insertPodcastEpisodeSchema>;
export type PodcastEpisode = typeof podcastEpisodes.$inferSelect;

export type InsertMap = z.infer<typeof insertMapSchema>;
export type Map = typeof maps.$inferSelect;

export type InsertTranslation = z.infer<typeof insertTranslationSchema>;
export type Translation = typeof translations.$inferSelect;
