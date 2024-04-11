import { program } from "commander";
import { password } from "@inquirer/prompts";
import { CliProvider, useCli } from "./context.js";
import { decrypt, encrypt } from "./crypto.js";

program
	.command("encrypt")
	.argument("<value>")
	.action(async (value: string) => {
		const cli = useCli();

		const passphrase = await cli.prompt(password, {
			message: "Enter the passcode",
			mask: true
		});

		const [encrypted, err] = encrypt(value, passphrase);

		if (err) {
			console.error("Failed to encrypt", err);
		} else {
			console.info(encrypted);
		}
	});

program
	.command("decrypt")
	.argument("<value>")
	.action(async (value) => {
		const cli = useCli();

		const passphrase = await cli.prompt(password, {
			message: "Enter the passcode",
			mask: true
		});

		const [decrypted, err] = decrypt(value, passphrase);

		if (err) {
			console.error("Failed to decrypt", err);
		} else {
			console.info(decrypted);
		}
	});


CliProvider(() => {
	program.parse();
});
