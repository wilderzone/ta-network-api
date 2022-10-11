import { hexToString } from './Utils';

export function DecryptPassword (password: string) {
	const stringArray = password.match(/.{3}/g);
	if (!stringArray) {
		return;
	}
	const integerArray = stringArray.map((value) => parseInt(value));
	const byteArray = new Uint8Array(integerArray);
	const byteString = hexToString(byteArray);
	return byteString;
}

export function EncryptPassword () {}
