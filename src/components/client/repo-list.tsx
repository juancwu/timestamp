"use client";

import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Organization } from "@/types/github";
import { Search, House, Table2 } from "lucide-react";
import { useMemo, useState } from "react";

export function RepoList({
	orgs,
	onRepoSelect,
}: {
	orgs: Organization[];
	onRepoSelect?: (repoFullName: string) => void;
}) {
	const [selectedOrgName, setSelectedOrgName] = useState("");
	const [searchQuery, setSearchQuery] = useState("");

	const handleRepoSelection = (repo: string) => {
		if (onRepoSelect) {
			onRepoSelect(repo ? `${selectedOrgName}/${repo}` : "");
		}
	};

	const repos = useMemo(() => {
		const org = orgs.find((o) => o.name === selectedOrgName);
		if (org) {
			return org.repos;
		}
		return [];
	}, [selectedOrgName, orgs]);

	return (
		<div className="grid grid-cols-2 gap-4">
			<Select onValueChange={setSelectedOrgName}>
				<SelectTrigger className="w-full">
					<div className="flex items-center">
						<House className="mr-2 h-4 w-4" />
						<SelectValue placeholder="Select namespace" />
					</div>
				</SelectTrigger>
				<SelectContent className="max-h-[400px]">
					<div className="px-2 pb-2">
						<div className="flex items-center border rounded-md px-2 mb-2">
							<Search className="h-4 w-4 text-muted-foreground mr-2" />
							<Input
								placeholder="Search repositories..."
								className="border-0 focus-visible:ring-0 px-0 py-2 h-8"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>
					{orgs.map((org) => (
						<SelectGroup key={org.name}>
							<SelectItem key={`${org.name}`} value={`${org.name}`}>
								{org.name}
							</SelectItem>
						</SelectGroup>
					))}
				</SelectContent>
			</Select>
			<Select onValueChange={handleRepoSelection} disabled={!selectedOrgName}>
				<SelectTrigger className="w-full">
					<div className="flex items-center">
						<Table2 className="mr-2 h-4 w-4" />
						<SelectValue placeholder="Select repository" />
					</div>
				</SelectTrigger>
				<SelectContent className="max-h-[400px]">
					<div className="px-2 pb-2">
						<div className="flex items-center border rounded-md px-2 mb-2">
							<Search className="h-4 w-4 text-muted-foreground mr-2" />
							<Input
								placeholder="Search repositories..."
								className="border-0 focus-visible:ring-0 px-0 py-2 h-8"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>
					{repos.map((repo) => (
						<SelectGroup key={repo.name}>
							<SelectItem key={`${repo.name}`} value={`${repo.name}`}>
								{repo.name}
							</SelectItem>
						</SelectGroup>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
