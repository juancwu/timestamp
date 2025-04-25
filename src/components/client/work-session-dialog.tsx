"use client";

import { GitPullRequestIcon, CircleDot, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { RepoList } from "@/components/client/repo-list";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Organization } from "@/types/github";
import { Card, CardContent, CardTitle } from "../ui/card";

type GitHubSearchResult = {
	id: string;
	type: "issue" | "pr";
	title: string;
	number: number;
	repo: string;
	url: string;
};

export function WorkSessionDialog({ orgs }: { orgs: Organization[] }) {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<GitHubSearchResult[]>([]);
	const [selectedItem, setSelectedItem] = useState<GitHubSearchResult | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const [error, setError] = useState("");
	const [selectedRepo, setSelectedRepo] = useState<string | null>(null);

	const resetAndClose = () => {
		setIsOpen(false);
		setSelectedRepo(null);
		setSelectedItem(null);
		setError("");
		setSearchResults([]);
		setSearchQuery("");
		setIsLoading(false);
		setIsCreating(false);
	};

	const handleRepoSelect = (value: string) => {
		if (!value || selectedRepo !== value) {
			setSelectedItem(null);
			setSearchQuery("");
			setSearchResults([]);
		}
		setSelectedRepo(value);
	};

	const handleSearch = async () => {
		if (!searchQuery.trim()) return;
		if (!selectedRepo) {
			setError("Please select a repository first");
			return;
		}

		setIsLoading(true);
		setError("");

		try {
			const response = await fetch(
				`/api/github/search?query=${encodeURIComponent(searchQuery)}&repo=${encodeURIComponent(selectedRepo)}`,
			);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to search GitHub");
			}

			setSearchResults(data.results || []);
		} catch (error) {
			console.error("Search error:", error);
			setError("Failed to search GitHub. Please try again.");
			setSearchResults([]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleStartSession = async () => {
		if (!selectedItem) return;

		setIsCreating(true);
		setError("");

		try {
			// Determine if it's an issue or PR
			const isIssue = selectedItem.type === "issue";

			const response = await fetch("/api/tasks", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					description: selectedItem.title,
					ticketReference: `${selectedItem.repo}#${selectedItem.number}`,
					githubIssueId: isIssue ? String(selectedItem.number) : undefined,
					githubPrId: !isIssue ? String(selectedItem.number) : undefined,
					githubRepoName: selectedItem.repo,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to create task");
			}

			// Reset state and close dialog
			setIsOpen(false);
			setSearchQuery("");
			setSearchResults([]);
			setSelectedItem(null);

			// Refresh the page to show the new task
			router.refresh();
		} catch (error) {
			console.error("Task creation error:", error);
			setError("Failed to create task. Please try again.");
		} finally {
			setIsCreating(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className="w-full sm:w-auto">
					<GitPullRequestIcon className="mr-2 h-4 w-4" />
					Start Work Session
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Start a new work session</DialogTitle>
					<DialogDescription>
						Search for a GitHub issue or pull request to track your work.
					</DialogDescription>
				</DialogHeader>

				{error && (
					<div className="bg-destructive/10 text-destructive text-sm p-2 rounded-md">
						{error}
					</div>
				)}

				<div>
					<RepoList orgs={orgs} onRepoSelect={handleRepoSelect} />
				</div>

				<div className="flex items-center space-x-2">
					<div className="grid flex-1 gap-2">
						<Label htmlFor="search" className="sr-only">
							Search
						</Label>
						<Input
							id="search"
							placeholder="Search issues or PRs..."
							value={searchQuery}
							onChange={(e) => {
								setSearchQuery(e.target.value);
								if (!e.target.value) {
									setSearchResults([]);
								}
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleSearch();
								}
							}}
						/>
					</div>
					<Button
						type="submit"
						size={isLoading ? "default" : "icon"}
						onClick={handleSearch}
						disabled={isLoading}
					>
						{isLoading ? (
							"Searching..."
						) : (
							<>
								<Search className="h-4 w-4" />
								<span className="sr-only">Search</span>
							</>
						)}
					</Button>
				</div>

				{searchResults.length > 0 && (
					<div className="max-h-[200px] overflow-y-auto border rounded-md p-2">
						<ul className="space-y-2">
							{searchResults.map((result) => (
								<li key={result.id}>
									<Button
										variant="outline"
										className={`w-full h-auto flex items-center justify-start`}
										onClick={() => {
											setSelectedItem(result);
											setSearchResults([]);
										}}
									>
										{result.type === "issue" ? (
											<CircleDot className="mr-2 h-4 w-4" />
										) : (
											<GitPullRequestIcon className="mr-2 h-4 w-4" />
										)}
										<div className="flex flex-col">
											<span className="font-medium text-wrap">
												{result.title}
											</span>
											<span className="text-xs text-muted-foreground text-wrap">
												{result.repo} #{result.number}
											</span>
										</div>
									</Button>
								</li>
							))}
						</ul>
					</div>
				)}

				{!!selectedItem && (
					<Card>
						<CardContent>
							{selectedItem.type === "issue" ? (
								<CircleDot className="mr-2 h-4 w-4" />
							) : (
								<GitPullRequestIcon className="mr-2 h-4 w-4" />
							)}
							<div className="flex flex-col">
								<span className="font-medium text-wrap">
									{selectedItem.title}
								</span>
								<span className="text-xs text-muted-foreground text-wrap">
									{selectedItem.repo} #{selectedItem.number}
								</span>
							</div>
						</CardContent>
					</Card>
				)}

				<DialogFooter className="sm:justify-between">
					<Button variant="ghost" onClick={resetAndClose}>
						Cancel
					</Button>
					<Button
						type="button"
						disabled={!selectedItem || isCreating}
						onClick={handleStartSession}
					>
						{isCreating ? "Creating..." : "Start Session"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
