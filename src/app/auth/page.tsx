import { SignInForm } from "@/components/client/sign-in-form";
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
		<div className="w-screen pt-20 flex items-center justify-center">
			<div className="flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div className="flex flex-col space-y-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight">
						Welcome to Timestamp
					</h1>
				</div>
				<SignInForm />
			</div>
		</div>
	);
}
