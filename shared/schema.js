const {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
} = require("drizzle-orm/pg-core");
const { createInsertSchema } = require("drizzle-zod");
const { z } = require("zod");

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Characters table - 角色信息
export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  avatar: varchar("avatar", { length: 255 }),
  personality: text("personality"),
  background: text("background"),
  playName: varchar("play_name", { length: 100 }).notNull(), // 剧本名称
  createdAt: timestamp("created_at").defaultNow(),
});

// Conversations table - 对话记录
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  characterId: integer("character_id").references(() => characters.id),
  messages: jsonb("messages").notNull(), // 存储对话历史
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Scripts table - 剧本信息
export const scripts = pgTable("scripts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content"),
  genre: varchar("genre", { length: 50 }),
  description: text("description"),
  userId: varchar("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Rehearsals table - 排练记录
export const rehearsals = pgTable("rehearsals", {
  id: serial("id").primaryKey(),
  scriptId: integer("script_id").references(() => scripts.id),
  userId: varchar("user_id").references(() => users.id),
  notes: text("notes"),
  performance: jsonb("performance"), // 存储表演数据
  createdAt: timestamp("created_at").defaultNow(),
});

// Types and schemas
const insertCharacterSchema = createInsertSchema(characters);
const insertConversationSchema = createInsertSchema(conversations);
const insertScriptSchema = createInsertSchema(scripts);
const insertRehearsalSchema = createInsertSchema(rehearsals);

module.exports = {
  sessions,
  users,
  characters,
  conversations,
  scripts,
  rehearsals,
  insertCharacterSchema,
  insertConversationSchema,
  insertScriptSchema,
  insertRehearsalSchema,
};