import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	client: {
		// Add client-side environment variables here
		NEXT_PUBLIC_APP_ENV: z.enum(["development", "staging", "production"]),
	},
	experimental__runtimeEnv: {
		// Map client-side variables here
		NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
	},
});
