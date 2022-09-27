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

/**
 * Inverts the endianness of a Uint8Array buffer.
 * @param buffer The buffer to invert.
 * @returns The now inverted buffer.
 */
export function invertEndianness (buffer: Uint8Array): Uint8Array {
	if (buffer.length % 2 !== 0) {
		buffer = new Uint8Array([...buffer, 0]);
	}
	let invertedBuffer = new Uint8Array(buffer.length);
	for (let i = 0; i < buffer.length; i += 2) {
		invertedBuffer[i] = buffer[i + 1];
		invertedBuffer[i + 1] = buffer[i];
	}
	return invertedBuffer;
}
