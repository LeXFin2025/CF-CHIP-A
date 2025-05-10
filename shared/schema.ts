import { pgTable, text, serial, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  email: text("email").unique(),
  avatar: text("avatar"),
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
});

export const insertDomainSchema = createInsertSchema(domains).omit({
  id: true, 
  verified: true, 
  verificationToken: true,
  currentUsers: true,
});

export const tabs = pgTable("tabs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title"),
  url: text("url"),
  favicon: text("favicon"),
  active: boolean("active").default(false),
  lastAccessed: timestamp("last_accessed").defaultNow(),
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
});

export const insertHistorySchema = createInsertSchema(browserHistory).omit({
  id: true,
  visitTime: true,
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
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
});

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
