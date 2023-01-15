import { performance } from 'perf_hooks';
import { generalEnumfields } from '../data/index.js';
import type { EnumTree } from '../interfaces/index.js';
import { hexToString } from './Utils.js';

export interface BufferOptions {
	debug?: boolean
}

export class Buffer {
	#buffer = new Uint8Array;
	#options = {} as BufferOptions;
	#bytesReadSinceCreation = 0;
	#lastByteRead = undefined as Uint8Array | undefined;
	#currentByteRead = undefined as Uint8Array | undefined;

	constructor (buffer = new Uint8Array, options?: BufferOptions) {
		this.#buffer = buffer;
		this.#options = options ?? {} as BufferOptions;
	}

	/**
	 * The length of the stored buffer.
	 */
	get length (): number {
		return this.#buffer.length;
	}

	/**
	 * Boolean indicating whether the length of the stored buffer is even (`true`) or odd (`false`).
	 */
	get lengthIsEven (): boolean {
		return this.#buffer.length % 2 === 0;
	}

	/**
	 * The number of bytes read since the creation of the buffer. (Does not include peeked bytes).
	 */
	get bytesReadSinceCreation (): number {
		return this.#bytesReadSinceCreation;
	}

	/**
	 * The last byte that was read by the buffer.
	 */
	get lastByteRead (): Uint8Array | undefined {
		return this.#lastByteRead;
	}

	#updateLastReadByte (currentByte: Uint8Array) {
		this.#lastByteRead = this.#currentByteRead;
		this.#currentByteRead = currentByte;
	}

	/**
	 * Have a peek at the first `bytes` number of bytes of the stored buffer without modifying the buffer.
	 * @param bytes The number of bytes to peek into the buffer by.
	 * @returns A new Uint8Array containing the peeked bytes.
	 */
	peek (bytes: number): Uint8Array {
		let peekedBytes = this.#buffer.subarray(0, bytes);
		return peekedBytes;
	}

	/**
	 * Read the first `bytes` number of bytes of the stored buffer, removing those bytes from the buffer in the process.
	 * @param bytes The number of bytes to read into the buffer by.
	 * @returns A new Uint8Array containing the read bytes.
	 */
	read (bytes: number): Uint8Array {
		let readBytes = this.#buffer.subarray(0, bytes);
		this.#buffer = this.#buffer.subarray(bytes);
		this.#bytesReadSinceCreation += bytes;
		this.#updateLastReadByte(readBytes.subarray(readBytes.length - 2, readBytes.length));
		return readBytes;
	}

	/**
	 * Remove the first `bytes` number of bytes from the stored buffer, "advancing" the position of the buffer.
	 * @param bytes The number of bytes to advance the buffer by.
	 */
	advance (bytes: number) {
		this.#updateLastReadByte(this.#buffer.subarray(bytes - 2, bytes));
		this.#buffer = this.#buffer.subarray(bytes);
		this.#bytesReadSinceCreation += bytes;
	}

	/**
	 * Add another buffer on to the end of the stored buffer. Similar to `Array.[prototype].push()`.
	 * @param buffer The new buffer to be appended.
	 */
	append (buffer: Uint8Array) {
		this.#buffer = new Uint8Array([...this.#buffer, ...buffer]);
	}

	/**
	 * Clones the contents of the stored buffer.
	 * @returns The cloned buffer.
	 */
	clone (): Uint8Array {
		return Uint8Array.from(this.#buffer);
	}

	/**
	 * Clears the contents of the stored buffer.
	 */
	clear () {
		this.#buffer = new Uint8Array;
		this.#bytesReadSinceCreation = 0;
	}

	/**
	 * Inverts the endianness of the stored buffer.
	 * @param bytes The number of bytes to invert (optional, but must be even).
	 * @returns A copy of the now inverted buffer.
	 */
	invertEndianness (bytes?: number): Uint8Array {
		// Prevent `bytes` from being odd.
		if (bytes && bytes % 2 !== 0) {
			bytes += 1;
		}
		// Pad the length of the buffer to make it even.
		if (!bytes && !this.lengthIsEven) {
			this.append(new Uint8Array([0]));
		}
		// Invert the endianness of the buffer.
		for (let i = 0; i < (bytes ?? this.length); i += 2) {
			const x = this.#buffer[i];
			const y = this.#buffer[i + 1];
			this.#buffer[i] = y;
			this.#buffer[i + 1] = x;
		}
		return this.#buffer;
	}

	/**
	 * Recursively parse the stored buffer into an Enum Tree.
	 * @returns An Enum Tree.
	 */
	async parse (): Promise<EnumTree> {
		if (this.#options.debug) console.log('[Buffer] Parsing...');
		let output = {} as EnumTree;
		const startTime = performance?.now();
		const bytesProcessed = this.#branch(output);
		const endTime = performance?.now();
		if (performance) {
			if (this.#options.debug) console.log('[Buffer] Done parsing', bytesProcessed, 'bytes in', endTime - startTime, 'milliseconds.');
		} else {
			if (this.#options.debug) console.log('[Buffer] Done parsing', bytesProcessed, 'bytes.');
		}
		return output as EnumTree;
	}

	/**
	 * Resursively parse buffer enumerators by field type to produce an Enum Tree.
	 * @param parent The parent object (trunk) of the current branch.
	 * @param length The length of the branch (number of enumerators to process, optional).
	 * @returns The number of bytes processed by the branch.
	 */
	#branch (parent: EnumTree, length = 1): number {
		// Initialise the branch.
		let bytesProcessed = 0;
		let fieldsProcessed = 0;

		// Process enumfields for the length of the branch.
		while (fieldsProcessed < length) {
			this.invertEndianness(2);
			let enumerator = hexToString(this.read(2)).toUpperCase();
			bytesProcessed += 2;

			// Skip over the enumerator if it is '0000'.
			while (enumerator === '0000') {
				this.invertEndianness(2);
				enumerator = hexToString(this.read(2)).toUpperCase();
				bytesProcessed += 2;
			}

			// Prune the branch if we have reached the end of the buffer.
			if (this.length <= 0) {
				return bytesProcessed;
			}

			// Prune the branch if the enumerator doesn't exist, since this likely indicates that we have lost track of our place in the buffer.
			if (!(enumerator in generalEnumfields)) {
				if (this.#options.debug) console.warn('[Buffer] Enumerator', enumerator, 'was not found at byte #', this.bytesReadSinceCreation, '.\n', hexToString(this.peek(64)).toUpperCase());
				/* this.invertEndianness(2);
				enumerator = hexToString(this.read(2)).toUpperCase();
				bytesProcessed += 2; */
				return bytesProcessed;
			}

			// Process as an ArrayOfEnumBlockArrays.
			// ENUM + fieldLength --> [ { branch() × arrayLength } × fieldLength ]
			if (generalEnumfields[enumerator].length === 'ArrayOfEnumBlockArrays') {
				parent[enumerator] = [] as EnumTree[];
				this.invertEndianness(2);
				const fieldLength = parseInt(hexToString(this.read(2)), 16);
				bytesProcessed += 2;
				if (this.#options.debug) console.log('[Buffer] ArrayOfEnumBlockArrays encountered was:', enumerator, '. With length:', fieldLength);
				let arraysProcessed = 0;
				while (arraysProcessed < fieldLength) { // TODO: This loop does not check for buffer errors.
					this.invertEndianness(2);
					const arrayLength = parseInt(hexToString(this.read(2)), 16);
					bytesProcessed += 2;
					parent[enumerator][arraysProcessed] = {} as EnumTree;
					bytesProcessed += this.#branch(parent[enumerator][arraysProcessed], arrayLength);
					arraysProcessed++;
				}
			}

			// Process as an EnumBlockArray.
			// ENUM + arrayLength --> { branch() × arrayLength }
			else if (generalEnumfields[enumerator].length === 'EnumBlockArray') {
				parent[enumerator] = {} as EnumTree;
				this.invertEndianness(2);
				const arrayLength = parseInt(hexToString(this.read(2)), 16);
				bytesProcessed += 2;
				if (this.#options.debug) console.log('[Buffer] EnumBlockArray encountered was:', enumerator, '. With length:', arrayLength);
				bytesProcessed += this.#branch(parent[enumerator], arrayLength);
			}

			// Process as a Sized field.
			// ENUM + fieldLength --> [ 00 × fieldLength ]
			else if (generalEnumfields[enumerator].length === 'Sized') {
				this.invertEndianness(2);
				const fieldLength = parseInt(hexToString(this.read(2)), 16);
				bytesProcessed += 2;
				const data = this.read(fieldLength);
				bytesProcessed += fieldLength;
				parent[enumerator] = [...data];
			}

			// Process as a Generic.
			// ENUM --> [ 00 × fieldLength ]
			else {
				const fieldLength = generalEnumfields[enumerator].length as number;
				const data = this.read(fieldLength);
				bytesProcessed += fieldLength;
				parent[enumerator] = [...data];
			}

			fieldsProcessed++;
		}

		return bytesProcessed;
	}
}
