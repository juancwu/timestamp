import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		BETTER_AUTH_SECRET: z.string().min(1),
		TURSO_DATABASE_URL: z.string().url(),
		TURSO_AUTH_TOKEN: z.string().min(1),
		GITHUB_CLIENT_ID: z.string().min(1),
		GITHUB_CLIENT_SECRET: z.string().min(1),
	},
	experimental__runtimeEnv: process.env,
});
