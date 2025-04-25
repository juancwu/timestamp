import * as authSchema from "@/db/schemas/auth-schema";
import * as githubSchema from "@/db/schemas/github-schema";
import * as taskSchema from "@/db/schemas/task-schema";
import { drizzle } from "drizzle-orm/libsql";

export const db = drizzle({
	schema: {
		...authSchema,
		...githubSchema,
		...taskSchema,
	},
	connection: {
		url: process.env.TURSO_DATABASE_URL || "",
		authToken: process.env.TURSO_AUTH_TOKEN || "",
	},
});
