import type { Generated } from "kysely";

export type User = {
	id: Generated<string>;
	firstName: string;
};

export type Database = {
	user: User
}

