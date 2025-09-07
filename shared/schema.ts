import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  grade: varchar("grade", { length: 10 }).notNull(), // "6-8", "9-10", "11-12"
  fullName: text("full_name"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const gradeContent = pgTable("grade_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  grade: varchar("grade", { length: 10 }).notNull(),
  subject: text("subject").notNull(),
  topic: text("topic").notNull(),
  difficulty: varchar("difficulty", { length: 10 }).notNull(),
  content: text("content").notNull(), // JSON string of quiz data
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  grade: varchar("grade", { length: 10 }).notNull(),
  subject: text("subject").notNull(),
  topic: text("topic").notNull(),
  quizId: text("quiz_id").notNull(),
  score: integer("score").notNull(),
  totalPoints: integer("total_points").default(0),
  completedAt: timestamp("completed_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  grade: true,
  fullName: true,
});

export const gradeSchema = z.enum(["6-8", "9-10", "11-12"]);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type GradeContent = typeof gradeContent.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type Grade = z.infer<typeof gradeSchema>;
