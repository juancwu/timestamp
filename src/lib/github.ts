import type { Organization, Repository } from "@/types/github";
import type { Octokit } from "octokit";

export async function getUserRepositories(octokit: Octokit) {
	const res = await octokit.request("GET /user/repos");
	return res.data.map(
		(item) =>
			({
				name: item.name,
				description: item.description || "",
			}) as Repository,
	);
}

export async function getUserOrgRepositories(octokit: Octokit) {
	const orgs = await getUserOrgs(octokit);
	const res = await Promise.allSettled(
		orgs.map(async (org) => {
			const res = await octokit.request("GET /orgs/{org}/repos", {
				org: org.login,
			});
			return {
				name: org.login,
				repos: res.data.map(
					(item) =>
						({
							name: item.name,
							description: item.description || "",
						}) as Repository,
				),
			} as Organization;
		}),
	);
	return res
		.filter((item) => item.status === "fulfilled")
		.map((item) => item.value);
}

export async function getUserOrgs(octokit: Octokit) {
	const res = await octokit.request("GET /user/orgs");
	return res.data;
}
