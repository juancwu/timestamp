"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import type { ComponentProps, ReactNode } from "react";

interface SignOutButtonProps extends ComponentProps<typeof Button> {
	children?: ReactNode;
}

function SignOutButton({ children, ...props }: SignOutButtonProps) {
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

	return (
		<Button onClick={handleSignOut} {...props}>
			{children || "Sign Out"}
		</Button>
	);
}

export { SignOutButton };
