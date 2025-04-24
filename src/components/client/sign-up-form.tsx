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
import type React from "react";
import { useCallback, useState } from "react";

function parseSignUpForm(form: HTMLFormElement) {
	const formData = new FormData(form);
	return {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
		confirmPassword: formData.get("confirm-password") as string,
		name: formData.get("name") as string,
	};
}

function SignUpForm() {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleSignUpWithProvider = useCallback(async (provider: "github") => {
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

	const signUpWithProvider = useCallback(
		(provider: "github") => {
			return () => {
				handleSignUpWithProvider(provider);
			};
		},
		[handleSignUpWithProvider],
	);

	const handleSignUp = useCallback(
		async (email: string, password: string, name: string) => {
			try {
				setIsLoading(true);

				const data = await authClient.signUp.email({
					email,
					password,
					name,
					callbackURL: "/",
				});
				console.log(data);
			} catch (e) {
				console.error(e);
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	const signUpWithEmail = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			const formData = parseSignUpForm(e.currentTarget);
			handleSignUp(formData.email, formData.password, formData.name);
		},
		[handleSignUp],
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Sign Up</CardTitle>
				<CardDescription>Create a new account to get started</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid gap-4">
					<Button
						variant="outline"
						className="w-full"
						onClick={signUpWithProvider("github")}
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
				<form onSubmit={signUpWithEmail}>
					<div className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="name">Full Name</Label>
							<Input
								id="name"
								name="name"
								type="text"
								placeholder="John Doe"
								required
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="signup-email">Email</Label>
							<Input
								id="signup-email"
								name="email"
								type="email"
								placeholder="name@example.com"
								required
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="signup-password">Password</Label>
							<Input
								id="signup-password"
								name="password"
								type="password"
								required
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="confirm-password">Confirm Password</Label>
							<Input
								id="confirm-password"
								name="confirm-password"
								type="password"
								required
							/>
						</div>
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Creating account..." : "Create Account"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}

export { SignUpForm };
