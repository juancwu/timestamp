import { SignInForm } from "@/components/client/sign-in-form";
import { SignUpForm } from "@/components/client/sign-up-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (session) {
		return redirect("/");
	}

	return (
		<div className="flex w-screen items-center pt-20">
			<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div className="flex flex-col space-y-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight">
						Welcome to Timestamp
					</h1>
					<p className="text-sm text-muted-foreground">
						Sign in to your account or create a new one
					</p>
				</div>

				<Tabs defaultValue="signin" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="signin">Sign In</TabsTrigger>
						<TabsTrigger value="signup">Sign Up</TabsTrigger>
					</TabsList>

					<TabsContent value="signin">
						<SignInForm />
					</TabsContent>

					<TabsContent value="signup">
						<SignUpForm />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
