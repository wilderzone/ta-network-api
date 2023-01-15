import { Buffer } from './Buffer.js';

/**
 * Convert a Uint8Array of bytes into a byte-like string.
 * @example
 * hexToString(Uint8Array.from([ 11, 81, 203 ]));
 * > "0b51cb"
 * @param hex The array to convert.
 * @returns The resulting byte-like string.
 */
export function hexToString (hex: Uint8Array): string {
	return hex.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
}

/**
 * Convert a byte-like string into an array of bytes.
 * @example
 * stringToHex("0b51cb");
 * > [ 11, 81, 203 ]
 * @param string The byte-like string to convert.
 * @returns The resulting byte array.
 */
export function stringToHex (string: string): Uint8Array {
	let normalisedString = string;
	if (string.length <= 0) {
		normalisedString = '00';
	}
	if (string.length < 2 || string.length % 2 !== 0) {
		normalisedString = string.padStart(string.length + 1, '0');
	}
	const splitString = normalisedString.match(/.{2}/g) as RegExpMatchArray;
	return Uint8Array.from(splitString.map((byte) => parseInt(byte, 16)));
}

/**
 * Convert UTF-8 text into an array of bytes.
 * @example
 * textToHex("Tribes");
 * > [ 84, 114, 105, 98, 101, 115 ]
 * @param text The text to convert.
 * @returns The resulting byte array.
 */
export function textToHex (text: string): Uint8Array {
	const splitString = text.split('');
	return Uint8Array.from(splitString.map((char) => char.charCodeAt(0)));
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
	if (packet.length === length + 2) {
		return true;
	}
	return false;
}
