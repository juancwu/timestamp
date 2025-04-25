import { db } from "@/db";
import { account as accountTable } from "@/db/schemas/auth-schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "octokit";

export async function GET(req: NextRequest) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session || !session.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const account = await db.query.account.findFirst({
		where: eq(accountTable.userId, session.user.id),
	});

	if (!account) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const url = new URL(req.url);
	const query = url.searchParams.get("query");
	const repo = url.searchParams.get("repo");

	if (!query || !repo) {
		return NextResponse.json(
			{ error: "Query and repo parameters are required" },
			{ status: 400 },
		);
	}

	try {
		const [owner, repoName] = repo.split("/");

		if (!owner || !repoName) {
			return NextResponse.json(
				{ error: "Invalid repository format. Expected: owner/repo" },
				{ status: 400 },
			);
		}

		const octokit = new Octokit({
			auth: account.accessToken,
		});

		// Search for issues and PRs in the specified repository
		const issuesAndPRs = await octokit.request("GET /search/issues", {
			q: `${query} repo:${owner}/${repoName}`,
			per_page: 10,
		});

		const results = issuesAndPRs.data.items.map((item) => {
			const isPR = Boolean(item.pull_request);
			return {
				id: String(item.id),
				type: isPR ? "pr" : "issue",
				title: item.title,
				number: item.number,
				repo: `${owner}/${repoName}`,
				url: item.html_url,
			};
		});

		return NextResponse.json({ results });
	} catch (error) {
		console.error("GitHub API error:", error);
		return NextResponse.json(
			{ error: "Failed to search GitHub" },
			{ status: 500 },
		);
	}
}

