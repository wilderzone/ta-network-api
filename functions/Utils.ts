export function hexToString (hex: Uint8Array): string {
	return hex.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
}

export function stringToHexInt (string: string): number[] | null {
	if (string.length < 2 || string.length % 2 !== 0) {
		return null;
	}
	const splitString = string.match(/.{2}/g) as RegExpMatchArray;
	return splitString.map((byte) => parseInt(byte, 16));
}

export function textToHexInt (string: string): number[] {
	const splitString = string.split('');
	return splitString.map((char) => char.charCodeAt(0));
}
