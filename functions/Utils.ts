import { Buffer } from './Buffer';

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
 * Inverts the endianness of a Uint8Array.
 * @param array The array to invert.
 * @returns The now inverted array.
 */
export function invertEndianness (array: Uint8Array): Uint8Array {
	let invertedArray = new Buffer(array);
	invertedArray.invertEndianness();
	return invertedArray.clone();
}

/**
 * Verify that the length of a given network packet is correct (as per the packet's `length` byte).
 * @param packet A network packet, as received.
 * @returns `true` if the length of the packet is correct, `false` if not.
 */
export function verifyPacketLength (packet: Uint8Array): boolean {
	const length = parseInt(hexToString(new Uint8Array([packet[1], packet[0]])), 16);
	console.log('[verifyPacketLength] length:', length, `(${length + 2})`);
	if (packet.length === length + 2) {
		return true;
	}
	return false;
}
