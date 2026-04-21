import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const contactSubmissions = pgTable("contact_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  hasLot: text("has_lot").notNull().default(""),
  timeline: text("timeline").notNull().default(""),
  homeType: text("home_type").notNull().default(""),
  bedrooms: text("bedrooms").notNull().default(""),
  bathrooms: text("bathrooms").notNull().default(""),
  idealBudget: text("ideal_budget").notNull().default(""),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type NewContactSubmission = typeof contactSubmissions.$inferInsert;
