import type { Selectable } from "kysely";
import type { User } from "./types.js";
import { createTransaction, useTransaction } from "./transaction.js";

type InsertUserData = {
	firstName: string;
}

async function insert(data: InsertUserData): Promise<[Selectable<User>, null] | [null, Error]> {
	try {
		const result = await createTransaction(async tx => {
			const user = await tx
				.insertInto("user")
				.values({
					firstName: data.firstName
				})
				.returningAll()
				.executeTakeFirstOrThrow();

			return user;
		});

		return [result, null]
	} catch (error) {
		return [null, error];
	}
}


async function retrieve(id: string): Promise<[Selectable<User>, null] | [null, Error]> {
	try {
		const result = await useTransaction(async tx => {
			const user = await tx
				.selectFrom("user")
				.selectAll()
				.where("id", "=", id)
				.executeTakeFirstOrThrow();

			return user;
		});

		return [result, null]
	} catch (error) {
		return [null, error];
	}
}

export const UserRepository = {
	insert,
	retrieve
}
