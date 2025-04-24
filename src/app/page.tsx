import { SignOutButton } from "@/components/client/sign-out-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return redirect("/auth");
	}

	return (
		<div className="flex min-h-screen flex-col">
			<div className="flex flex-1">
				<main className="flex-1 p-6">
					<SignOutButton />
				</main>
			</div>
		</div>
	);
}
