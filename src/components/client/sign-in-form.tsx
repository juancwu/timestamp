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

	const handleSignIn = useCallback(async (email: string, password: string) => {
		try {
			setIsLoading(true);
			const data = await authClient.signIn.email({
				email: email,
				password: password,
			});
			console.log(data);
		} catch (e) {
			console.error(e);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const signInWithEmail = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			const formData = parseSignInForm(e.currentTarget);
			handleSignIn(formData.email, formData.password);
		},
		[handleSignIn],
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Sign In</CardTitle>
				<CardDescription>
					Enter your email and password to sign in to your account
				</CardDescription>
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
				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-background px-2 text-muted-foreground">
							Or continue with
						</span>
					</div>
				</div>
				<form onSubmit={signInWithEmail}>
					<div className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="signin-email">Email</Label>
							<Input
								id="signin-email"
								name="email"
								type="email"
								placeholder="name@example.com"
								required
							/>
						</div>
						<div className="grid gap-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="signin-password">Password</Label>
								<Link
									href="/forgot-password"
									className="text-xs text-muted-foreground underline-offset-4 hover:underline"
								>
									Forgot password?
								</Link>
							</div>
							<Input
								id="signin-password"
								name="password"
								type="password"
								required
							/>
						</div>
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Signing in..." : "Sign In"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}

export { SignInForm };
