export type Repository = {
	name: string;
	description: string;
};

export type Organization = {
	name: string;
	repos: Repository[];
};
