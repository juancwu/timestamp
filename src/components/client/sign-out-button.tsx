"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

function SignOutButton() {
	const router = useRouter();
	const handleSignOut = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/auth");
				},
			},
		});
	};

	return <Button onClick={handleSignOut}>Sign Out</Button>;
}

export { SignOutButton };
