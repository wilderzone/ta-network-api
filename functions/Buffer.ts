import { generalEnumfields } from '../data';
import { hexToString } from './Utils';

export class Buffer {
	_buffer = new Uint8Array;
	_bytesReadSinceCreation = 0;

	constructor (buffer = new Uint8Array) {
		this._buffer = buffer;
	}

	/**
	 * The length of the stored buffer.
	 */
	get length (): number {
		return this._buffer.length;
	}

	get lengthIsEven (): boolean {
		return this._buffer.length % 2 === 0;
	}

	/**
	 * The number of bytes read since the creation of the buffer. (Does not include peeked bytes).
	 */
	get bytesReadSinceCreation (): number {
		return this._bytesReadSinceCreation;
	}

	/**
	 * Have a peek at the first [bytes] number of bytes of the stored buffer without modifying the buffer.
	 * @param bytes The number of bytes to peek into the buffer by.
	 * @returns A new Uint8Array containing the peeked bytes.
	 */
	peek (bytes: number): Uint8Array {
		let peekedBytes = this._buffer.subarray(0, bytes);
		return peekedBytes;
	}

	/**
	 * Read the first [bytes] number of bytes of the stored buffer, removing those bytes from the buffer in the process.
	 * @param bytes The number of bytes to read into the buffer by.
	 * @returns A new Uint8Array containing the read bytes.
	 */
	read (bytes: number): Uint8Array {
		let readBytes = this._buffer.subarray(0, bytes);
		this._buffer = this._buffer.subarray(bytes);
		this._bytesReadSinceCreation += bytes;
		return readBytes;
	}

	/**
	 * Remove the first [bytes] number of bytes from the stored buffer, "advancing" the position of the buffer.
	 * @param bytes The number of bytes to advance the buffer by.
	 */
	advance (bytes: number) {
		this._buffer = this._buffer.subarray(bytes);
		this._bytesReadSinceCreation += bytes;
	}

	/**
	 * Add another buffer on to the end of the stored buffer. Similar to `Array.[prototype].push()`.
	 * @param buffer The new buffer to be appended.
	 */
	append (buffer: Uint8Array) {
		this._buffer = new Uint8Array([...this._buffer, ...buffer]);
	}

	/**
	 * Inverts the endianness of the stored buffer.
	 * @param bytes The number of bytes to invert (must be even).
	 * @returns A copy of the now inverted buffer.
	 */
	invertEndianness (bytes?: number): Uint8Array {
		if (bytes && bytes % 2 !== 0) {
			bytes += 1;
		}
		if (!bytes && !this.lengthIsEven) {
			this._buffer = new Uint8Array([...this._buffer, 0]);
		}
		let invertedBuffer = new Uint8Array(this.length);
		for (let i = 0; i < (bytes ?? this.length); i += 2) {
			invertedBuffer[i] = this._buffer[i + 1];
			invertedBuffer[i + 1] = this._buffer[i];
		}
		if (bytes) {
			for (let i = bytes; i < this.length; i++) {
				invertedBuffer[i] = this._buffer[i];
			}
		}

		this._buffer = new Uint8Array([...invertedBuffer]);
		return invertedBuffer;
	}

	/**
	 * Recursively parse the stored buffer into an Enum Tree.
	 * @returns An object of unknown shape (the Enum Tree).
	 */
	parse (): { [key: string]: any } {
		console.log('[Buffer] Parsing...');
		let output = {} as { [key: string]: any };
		const bytesProcessed = recurse(output, this);
		console.log('[Buffer] Bytes processed:', bytesProcessed);
		console.log('[Buffer] Done parsing.');
		return {...output};
	}
}

function recurse (parent: { [key: string]: any }, buffer: Buffer): number {
	let bytesProcessed = 0;
	buffer.invertEndianness(2);
	const enumerator = hexToString(buffer.read(2)).toUpperCase();
	bytesProcessed += 2;

	// Stop if we have reached the end of the buffer.
	if (buffer.length <= 0) {
		return bytesProcessed;
	}

	// Stop if the enumerator doesn't exist, since this likely indicates that we have lost track of our place in the buffer.
	if (!(enumerator in generalEnumfields)) {
		console.warn('Enumerator', enumerator, 'was not found.');
		return bytesProcessed;
	}

	if (generalEnumfields[enumerator].length === 'EnumBlockArray' || generalEnumfields[enumerator].length === 'ArrayOfEnumBlockArrays') {
		parent[enumerator] = {} as { [key: string]: any };
		buffer.advance(2);
		bytesProcessed += 2;
		bytesProcessed += recurse(parent[enumerator], buffer);
		return bytesProcessed;
	} else if (generalEnumfields[enumerator].length === 'Sized') {
		buffer.invertEndianness(2);
		const length = parseInt(hexToString(buffer.read(2)), 16);
		bytesProcessed += 2;
		const data = buffer.read(length);
		bytesProcessed += length;
		parent[enumerator] = [...data];
		bytesProcessed += recurse(parent, buffer);
		return bytesProcessed;
	} else {
		const length = generalEnumfields[enumerator].length as number;
		const data = buffer.read(length);
		bytesProcessed += length;
		parent[enumerator] = [...data];
		bytesProcessed += recurse(parent, buffer);
		return bytesProcessed;
	}
}
