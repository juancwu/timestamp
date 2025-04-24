import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";

export const tasks = sqliteTable("tasks", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	description: text("description").notNull(),
	ticketReference: text("ticket_reference"),
	// GitHub specific fields
	githubIssueId: text("github_issue_id"),
	githubPrId: text("github_pr_id"),
	githubRepoName: text("github_repo_name"),
	// Time tracking
	startTime: integer("start_time", { mode: "timestamp" }).notNull(),
	endTime: integer("end_time", { mode: "timestamp" }),
	duration: integer("duration"), // in minutes, calculated
	// Metadata
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
});

export const workflows = sqliteTable("workflows", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	description: text("description"),
	template: text("template").notNull(), // JSON string with template details
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
});

export const payRates = sqliteTable("pay_rates", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	rate: text("rate").notNull(), // Store as string to handle decimal values accurately
	description: text("description"),
	startDate: integer("start_date", { mode: "timestamp" }).notNull(),
	endDate: integer("end_date", { mode: "timestamp" }),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
});
