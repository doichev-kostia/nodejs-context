import { createContext, use, wrap } from "../context-2.js";
import { type Cli, prompt } from "./cli.js";

export const CliContext = createContext<Cli>("CLI", {
	prompt() {
		throw new Error('Boo!')
	}
});

export function useCli() {
	return use(CliContext)
}

export function CliProvider(cb: (v: Cli) => any) {
	const cli: Cli = {
		prompt,
	}

	wrap(CliContext, cli, cb);
}
