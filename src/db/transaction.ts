import { type Kysely, type Transaction } from "kysely";
import type { Database } from "./types.js";
import { Context } from "../context-1.js";
import { db } from "./db.js";

export type TxOrDb = Transaction<Database> | Kysely<Database>;

const TransactionContext = Context.create<{
	tx: TxOrDb;
}>("TransactionContext");

export async function useTransaction<T>(callback: (trx: TxOrDb) => Promise<T>) {
	const [ctx, error] = TransactionContext.use();

	if (error) {
		return callback(db);
	} else {
		return callback(ctx.tx);
	}
}

export async function createTransaction<T>(callback: (tx: TxOrDb) => Promise<T>) {
	const [ctx, error] = TransactionContext.use();

	if (ctx) {
		return callback(ctx.tx);
	} else {
		return db
			.transaction()
			.execute(async tx => {
				return await TransactionContext.with({tx}, () => {
					return callback(tx);
				});
			});
	}
}

