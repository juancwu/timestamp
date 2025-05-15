"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Github } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useCallback, useState } from "react";

function parseSignInForm(form: HTMLFormElement) {
	const formData = new FormData(form);
	return {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};
}

function SignInForm() {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleSignInWithProvider = useCallback(async (provider: "github") => {
		try {
			setIsLoading(true);
			const data = await authClient.signIn.social({
				provider,
				callbackURL: "/",
			});
			console.log(data);
		} catch (e) {
			console.error(e);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const signInWithProvider = useCallback(
		(provider: "github") => {
			return () => {
				handleSignInWithProvider(provider);
			};
		},
		[handleSignInWithProvider],
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Sign In</CardTitle>
				<CardDescription>Continue with GitHub</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid gap-4">
					<Button
						variant="outline"
						className="w-full"
						onClick={signInWithProvider("github")}
					>
						<Github className="mr-2 h-4 w-4" />
						Github
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

export { SignInForm };
