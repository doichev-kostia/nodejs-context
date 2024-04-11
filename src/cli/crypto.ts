import { createCipheriv, createDecipheriv, pbkdf2Sync, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";

const RANDOM_BYTES = 16;
const IV_LENGTH = 12;

export function encrypt(value: string, encryptionKey: string): [string, null] | [null, Error]{
	try {
		const salt = randomBytes(RANDOM_BYTES);

		const key = pbkdf2Sync(encryptionKey, salt, 50_000, RANDOM_BYTES * 2, "sha256");

		const iv = randomBytes(IV_LENGTH);

		const cipher = createCipheriv(ALGORITHM, key, iv);

		let encryptedValue = cipher.update(value, 'utf-8', 'base64');
		encryptedValue += cipher.final('base64');

		const tag = cipher.getAuthTag();


		const encryptedData = [ALGORITHM, encryptedValue, iv.toString("base64"), salt.toString("base64"), tag.toString("base64")].join(",");

		return [encryptedData, null];
	} catch (error) {
		return [null, error];
	}
}

export function decrypt(encryptedValue: string, encryptionKey: string): [string, null] | [null, Error]{
	try {
		const [algorithm, value, ivBase64, saltBase64, tagBase64] = encryptedValue.split(",");

		if (algorithm !== ALGORITHM) {
			return [null, new Error("Invalid algorithm, expected aes-256-gcm")];
		}

		const salt = Buffer.from(saltBase64, "base64");
		const iv = Buffer.from(ivBase64, "base64");
		const tag = Buffer.from(tagBase64, "base64");

		const key = pbkdf2Sync(encryptionKey, salt, 50_000, RANDOM_BYTES * 2, "sha256");

		const decipher = createDecipheriv(algorithm, key, iv);

		decipher.setAuthTag(tag);

		let decryptedValue = decipher.update(value, 'base64', 'utf-8');
		decryptedValue += decipher.final('utf-8');

		return [decryptedValue, null];
	} catch (error) {
		return [null, error];
	}
}
