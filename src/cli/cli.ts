import * as inquirer from "@inquirer/type";

export type Cli = {
	prompt: typeof prompt;
}
export function prompt<Value, Config>(func: inquirer.Prompt<Value, Config>, config: Config): inquirer.CancelablePromise<Value> {
	return func(config);
}

