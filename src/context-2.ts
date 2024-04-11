import { AsyncLocalStorage } from "node:async_hooks";

const ErrorCode = Symbol('ContextError');

export class ContextNotFoundError extends Error {
	readonly code = ErrorCode;

	constructor(public name: string) {
		super(`${name} context was not provided.`);
	}
}

const keys = {
	storage: Symbol('context:storage')
} as const;

type Ctx<T> = {
	name: string;
	default?: T;
	[key: symbol]: any
}

export function createContext<T>(name: string, defaultValue: T) {
	const storage = new AsyncLocalStorage<T>();

	const ctx: Ctx<T> = {
		name,
		default: defaultValue,
		[keys.storage]: storage,
	}

	return ctx;
}

export function use<T>(ctx: Ctx<T>): T {
	const result = ctx[keys.storage].getStore();
	if (result !== undefined) {
		return result;
	}

	if (ctx.default !== undefined) {
		return ctx.default
	} else {
		throw new ContextNotFoundError(ctx.name)
	}
}

export function wrap<T, Result>(ctx: Ctx<T>, value: T, cb: (value: T) => Result): Result {
	return ctx[keys.storage].run(value, cb, value);
}
