import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	client: {
		// Add client-side environment variables here
		NEXT_PUBLIC_APP_ENV: z.enum(["development", "staging", "production"]),
		NEXT_PUBLIC_BETTER_AUTH_URL: z.string().url(),
	},
	experimental__runtimeEnv: {
		// Map client-side variables here
		NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
		NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
	},
});
