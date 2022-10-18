import { generalEnumfields } from '../data';
import { EnumTree } from '../interfaces';
import { hexToString } from './Utils';
const { performance } = require('perf_hooks');

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

	/**
	 * Boolean indicating whether the length of the stored buffer is even (`true`) or odd (`false`).
	 */
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
	 * Have a peek at the first `bytes` number of bytes of the stored buffer without modifying the buffer.
	 * @param bytes The number of bytes to peek into the buffer by.
	 * @returns A new Uint8Array containing the peeked bytes.
	 */
	peek (bytes: number): Uint8Array {
		let peekedBytes = this._buffer.subarray(0, bytes);
		return peekedBytes;
	}

	/**
	 * Read the first `bytes` number of bytes of the stored buffer, removing those bytes from the buffer in the process.
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
	 * Remove the first `bytes` number of bytes from the stored buffer, "advancing" the position of the buffer.
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
	 * Clones the contents of the stored buffer.
	 * @returns The cloned buffer.
	 */
	clone (): Uint8Array {
		return Uint8Array.from(this._buffer);
	}

	/**
	 * Clears the contents of the stored buffer.
	 */
	clear () {
		this._buffer = new Uint8Array;
		this._bytesReadSinceCreation = 0;
	}

	/**
	 * Inverts the endianness of the stored buffer.
	 * @param bytes The number of bytes to invert (optional, but must be even).
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
	 * @returns An Enum Tree.
	 */
	parse (): EnumTree {
		console.log('[Buffer] Parsing...');
		let output = {} as EnumTree;
		const startTime = performance.now();
		const bytesProcessed = branch(output, this);
		console.log('[Buffer] Bytes processed:', bytesProcessed);
		const endTime = performance.now();
		console.log('[Buffer] Done parsing in', endTime - startTime, 'milliseconds.');
		return { ...output } as EnumTree;
	}
}

/**
 * Resursively parse buffer enumerators by field type to produce an Enum Tree.
 * @param parent The parent object (trunk) of the current branch.
 * @param buffer The buffer to parse.
 * @param length The length of the branch (number of enumerators to process, optional).
 * @returns The number of bytes processed by the branch.
 */
function branch (parent: EnumTree, buffer: Buffer, length = 1): number {
	// Initialise the branch.
	let bytesProcessed = 0;
	let fieldsProcessed = 0;

	// Process enumfields for the length of the branch.
	while (fieldsProcessed < length) {
		buffer.invertEndianness(2);
		let enumerator = hexToString(buffer.read(2)).toUpperCase();
		bytesProcessed += 2;

		// Skip over the enumerator if it is '0000'.
		while (enumerator === '0000') {
			buffer.invertEndianness(2);
			enumerator = hexToString(buffer.read(2)).toUpperCase();
			bytesProcessed += 2;
		}

		// Prune the branch if we have reached the end of the buffer.
		if (buffer.length <= 0) {
			return bytesProcessed;
		}

		// Prune the branch if the enumerator doesn't exist, since this likely indicates that we have lost track of our place in the buffer.
		if (!(enumerator in generalEnumfields)) {
			console.warn('[Buffer] Enumerator', enumerator, 'was not found.');
			return bytesProcessed;
		}

		// ArrayOfEnumBlockArrays.
		// ENUM + fieldLength --> [ { branch() x arrayLength } x fieldLength ]
		if (generalEnumfields[enumerator].length === 'ArrayOfEnumBlockArrays') {
			parent[enumerator] = [] as EnumTree[];
			buffer.invertEndianness(2);
			const fieldLength = parseInt(hexToString(buffer.read(2)), 16);
			bytesProcessed += 2;
			console.log('[Buffer] ArrayOfEnumBlockArrays encountered was:', enumerator, '. With length:', fieldLength);
			let arraysProcessed = 0;
			while (arraysProcessed < fieldLength) { // TODO: This loop does not check for buffer errors.
				buffer.invertEndianness(2);
				const arrayLength = parseInt(hexToString(buffer.read(2)), 16);
				bytesProcessed += 2;
				parent[enumerator][arraysProcessed] = {} as EnumTree;
				bytesProcessed += branch(parent[enumerator][arraysProcessed], buffer, arrayLength);
				arraysProcessed++;
			}
		}

		// EnumBlockArray.
		// ENUM + arrayLength --> { branch() x arrayLength }
		else if (generalEnumfields[enumerator].length === 'EnumBlockArray') {
			parent[enumerator] = {} as EnumTree;
			buffer.invertEndianness(2);
			const arrayLength = parseInt(hexToString(buffer.read(2)), 16);
			bytesProcessed += 2;
			console.log('[Buffer] EnumBlockArray encountered was:', enumerator, '. With length:', arrayLength);
			bytesProcessed += branch(parent[enumerator], buffer, arrayLength);
		}

		// Sized.
		// ENUM + fieldLength --> [ 00 x fieldLength ]
		else if (generalEnumfields[enumerator].length === 'Sized') {
			buffer.invertEndianness(2);
			const fieldLength = parseInt(hexToString(buffer.read(2)), 16);
			bytesProcessed += 2;
			const data = buffer.read(fieldLength);
			bytesProcessed += fieldLength;
			parent[enumerator] = [...data];
		}

		// Generic.
		// ENUM --> [ 00 x fieldLength ]
		else {
			const fieldLength = generalEnumfields[enumerator].length as number;
			const data = buffer.read(fieldLength);
			bytesProcessed += fieldLength;
			parent[enumerator] = [...data];
		}

		fieldsProcessed++;
	}

	return bytesProcessed;
}
