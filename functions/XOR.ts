import { hexToString } from './Utils';

/**
 * An iterator that aggregates elements from each of the iterables. If the iterables are of uneven length, missing values are filled-in with `fillValue`. Iteration continues until the longest iterable is exhausted.
 * 
 * From: https://docs.python.org/3/library/itertools.html#itertools.zip_longest
 * 
 * @param iterables An array of Uint8Arrays to zip.
 * @param fillValue Value to use in place of empty elements. 
 * @returns The aggregated (zipped) array.
 */
function zipLongest(iterables: Uint8Array[], fillValue = 0): Uint8Array[] {
	const longest = Math.max(...(iterables.map(el => el.length)));
	let zippedArray = [] as Uint8Array[];
	for (let i = 0; i < longest; i++) {
		let zippedBlock = new Uint8Array(iterables.length);
		iterables.forEach((value, index) => {
			zippedBlock[index] = value[i] ?? fillValue;
		});
		zippedArray[i] = zippedBlock;
	}
	return zippedArray;
}

/**
 * Perform an XOR operation on a hashed password and a salt value.
 * @param passwordHash 
 * @param salt 
 * @returns The XOR'ed value. Suitable for Login Server authentication.
 */
export function xorPasswordHash (passwordHash: string, salt: Uint8Array): Uint8Array {
	// Split the salt into groups of 4 bits (nibbles).
	let saltNibbles = [] as number[];
	salt.forEach((value) => {
		saltNibbles.push(value >> 4)
		saltNibbles.push(value & 0x0F)
	});

	// Convert each nibble into an XOR value.
	let xorValues = [] as number[];
	saltNibbles.forEach((value) => {
		xorValues.push(value <= 9 ? value : 0x47 + value)
	});

	// Create the XOR pattern from the list of values.
	const pattern = new Uint8Array([
		xorValues[6], 0,
		xorValues[7], 0,
		xorValues[4], 0,
		xorValues[5], 0,
		xorValues[2], 0,
		xorValues[3], 0,
		xorValues[0], 0,
		xorValues[1], 0,
		0, 0,
		xorValues[10], 0,
		xorValues[11], 0,
		xorValues[8], 0,
		xorValues[9], 0,
		0, 0,
		xorValues[14], 0,
		xorValues[15], 0,
		xorValues[12], 0,
		xorValues[13], 0,
		0, 0,
		xorValues[16], 0,
		xorValues[17], 0,
		xorValues[18], 0,
		xorValues[19], 0,
		0, 0,
		xorValues[20], 0,
		xorValues[21], 0,
		xorValues[22], 0,
		xorValues[23], 0,
		xorValues[24], 0,
		xorValues[25], 0,
		xorValues[26], 0,
		xorValues[27], 0,
		xorValues[28], 0,
		xorValues[29], 0,
		xorValues[30], 0,
		xorValues[31], 0,
	]);

	// Execute the XOR pattern on the password hash.
	const zip = zipLongest([Uint8Array.from(Buffer.from(passwordHash, 'base64')), pattern], 0);
	const processedPasswordHash = new Uint8Array(zip.length);

	zip.forEach((zippedBlock, index) => {
		let result = undefined as number | undefined;
		zippedBlock.forEach((value) => {
			if (typeof result === 'undefined') {
				result = value;
			} else {
				result = result ^ value;
			}
		});
		processedPasswordHash[index] = result ?? 0;
	});

	return processedPasswordHash;
}

/**
 * A substitute for the game's built-in `DecryptPassword` function.
 * @param password An encrypted password string, as found in `TribesUser.ini`.
 * @returns 
 */
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

/**
 * A substitute for the game's built-in `EncryptPassword` function.
 */
export function EncryptPassword () {}
