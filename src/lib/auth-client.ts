import { env } from "@/env/client";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
});

export async function signInWithProvider(provider: "github") {
	const data = await authClient.signIn.social({ provider });
	return data;
}
