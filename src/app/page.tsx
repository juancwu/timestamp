import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/client/app-sidebar";
import { WorkSessionDialog } from "@/components/client/work-session-dialog";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { db } from "@/db";
import { account as accountTable } from "@/db/schemas/auth-schema";
import { getUserOrgRepositories, getUserRepositories } from "@/lib/github";
import type { Organization } from "@/types/github";
import { eq } from "drizzle-orm";
import { Octokit } from "octokit";

export default async function HomePage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return redirect("/auth");
	}

	const account = await db.query.account.findFirst({
		where: eq(accountTable.userId, session.user.id),
	});

	const orgs: Organization[] = [];
	if (account) {
		const octokit = new Octokit({
			auth: account.accessToken,
		});

		const { data: ghUser } = await octokit.request("GET /user");

		const results = await Promise.allSettled([
			getUserRepositories(octokit),
			getUserOrgRepositories(octokit),
		]);

		if (results[0].status === "fulfilled") {
			orgs.push({
				name: ghUser.login,
				repos: results[0].value,
			});
		}
		if (results[1].status === "fulfilled") {
			orgs.push(...results[1].value);
		}
	}
	console.log(orgs.length);

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
					<h1 className="text-xl font-semibold">Home</h1>
					<div className="ml-auto">
						<WorkSessionDialog orgs={orgs} />
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-6 p-6">
					<section>
						<h2 className="text-lg font-medium mb-4">Recent Sessions</h2>
						<div className="grid auto-rows-min gap-4 md:grid-cols-3">
							<div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground">
								No recent sessions
							</div>
							<div className="aspect-video rounded-xl bg-muted/50 hidden md:flex md:items-center md:justify-center md:text-muted-foreground">
								Start a new session
							</div>
							<div className="aspect-video rounded-xl bg-muted/50 hidden md:flex md:items-center md:justify-center md:text-muted-foreground">
								Track your time
							</div>
						</div>
					</section>

					<section>
						<h2 className="text-lg font-medium mb-4">Summary</h2>
						<div className="rounded-xl border bg-card p-6 shadow-sm">
							<div className="text-center">
								<p className="text-muted-foreground">
									No data available. Start tracking your time to see statistics.
								</p>
							</div>
						</div>
					</section>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
