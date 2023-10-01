import { performance } from 'perf_hooks';
import { generalEnumfields } from '../data/index.js';
import { EnumTree } from '../interfaces/index.js';
import { hexToString } from './Utils.js';

interface CheckpointPointer {
	pointer: number,
	treeReference: EnumTree
}

export class Buffer {
	_buffer = [] as number[];
	_parsedTree = {} as EnumTree
	_readPointer = 0;
	_errorPointer = 0;
	_zeroPointer = 0;
	_checkpointPointers = [] as CheckpointPointer[];

	constructor (buffer?: Uint8Array) {
		if (buffer) {
			this._buffer = [...buffer];
		}
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
		return this._readPointer;
	}

	/**
	 * The last byte that was read by the buffer.
	 */
	get lastByteRead (): number | undefined {
		return this._buffer[this._readPointer - 1];
	}

	/**
	 * Have a peek at the next `bytes` number of bytes of the stored buffer without modifying the buffer.
	 * @param bytes The number of bytes to peek into the buffer by.
	 * @returns A new Uint8Array containing the peeked bytes.
	 */
	peek (bytes: number): Uint8Array {
		let peekedBytes = [] as number[];
		if (Math.sign(bytes) === -1) {
			peekedBytes = this._buffer.slice(this._readPointer + bytes, this._readPointer);
		} else {
			peekedBytes = this._buffer.slice(this._readPointer, this._readPointer + bytes);
		}
		return new Uint8Array(peekedBytes);
	}

	/**
	 * Read the next `bytes` number of bytes of the stored buffer, removing those bytes from the buffer in the process.
	 * @param bytes The number of bytes to read into the buffer by.
	 * @returns A new Uint8Array containing the read bytes.
	 */
	read (bytes: number): Uint8Array {
		let readBytes = this._buffer.slice(this._readPointer, this._readPointer + bytes);
		this._readPointer += bytes;
		if (!this._errorPointer) { // If an error is not currently being evaluated.
			this._zeroPointer = this._readPointer;
		}
		return new Uint8Array(readBytes);
	}

	/**
	 * Read the next two bytes of the stored buffer as an enumerator, removing those bytes from the buffer in the process.
	 * @returns The enumerator.
	 */
	readAsEnumerator (): string {
		let readBytes = this.read(2);
		return hexToString(new Uint8Array(readBytes.reverse())).toUpperCase();
	}

	/**
	 * Remove the next `bytes` number of bytes from the stored buffer, "advancing" the position of the buffer.
	 * @param bytes The number of bytes to advance the buffer by.
	 */
	advance (bytes: number): void {
		this.read(bytes);
	}

	/**
	 * Add another buffer on to the end of the stored buffer.
	 * @param buffer The new buffer to be appended.
	 */
	append (buffer: Uint8Array) {
		this._buffer = this._buffer.concat([...buffer]);
	}

	/**
	 * Clones the contents of the stored buffer.
	 * @returns A clone of the stored buffer.
	 */
	clone (): Uint8Array {
		return new Uint8Array(this._buffer);
	}

	/**
	 * Clones the contents of the stored buffer that have been read.
	 * @returns A clone of the stored buffer.
	 */
	cloneRead (): Uint8Array {
		return new Uint8Array(this._buffer.slice(0, this._readPointer));
	}

	/**
	 * Clones the remaining, unread contents of the stored buffer.
	 * @returns A clone of the stored buffer.
	 */
	cloneUnread (): Uint8Array {
		return new Uint8Array(this._buffer.slice(this._readPointer));
	}

	/**
	 * Clears the contents of the stored buffer.
	 */
	clear () {
		this._buffer = [] as number[];
		this._readPointer = 0;
		this._errorPointer = 0;
		this._zeroPointer = 0;
		this._checkpointPointers = [] as CheckpointPointer[];
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
			this._buffer = this._buffer.concat([0]);
		}
		// Invert the endianness of the buffer.
		for (let i = 0; i < (bytes ?? this.length); i += 2) {
			const x = this._buffer[i];
			const y = this._buffer[i + 1];
			this._buffer[i] = y;
			this._buffer[i + 1] = x;
		}
		return new Uint8Array(this._buffer);
	}

	_findPreviousZeros (): void {
		// Move the zero pointer backwards until buffer[zp] && buffer[zp + 1] are both 0, or the pointer hits the start of the buffer.
		if (this._zeroPointer > 0) {
			this._zeroPointer--;
			while (this._zeroPointer > 0 && this._buffer[this._zeroPointer] !== 0 && this._buffer[this._zeroPointer + 1] !== 0) {
				this._zeroPointer--;
			}
		}
	}

	_findNextZeros (): void {
		// Move the zero pointer forwards until buffer[zp] && buffer[zp + 1] are both 0, or the pointer hits the end of the buffer.
		if (this._zeroPointer < this.length) {
			this._zeroPointer++;
			while (this._zeroPointer < this.length && this._buffer[this._zeroPointer] !== 0 && this._buffer[this._zeroPointer + 1] !== 0) {
				this._zeroPointer++;
			}
		}
	}

	_removeZeros (): void {
		this._buffer.splice(this._zeroPointer, 2);
		this._errorPointer -= 2;
	}

	_insertZeros (): void {
		this._buffer.splice(this._zeroPointer, 0, 0, 0);
		this._errorPointer += 2;
	}

	_addCheckpoint (treeReference: EnumTree): void {
		this._checkpointPointers.push({
			pointer: this._readPointer,
			treeReference
		});
	}

	_rewindToCheckpoint (checkpoint = this._checkpointPointers[this._checkpointPointers.length - 1]): void {
		// Rewind to a checkpoint that preceeds the zero pointer.
		while (checkpoint && checkpoint.pointer >= this._zeroPointer) {
			checkpoint = this._checkpointPointers[this._checkpointPointers.indexOf(checkpoint) - 1];
		}
		if (!checkpoint) {
			this._readPointer = 0;
			this._parsedTree = {} as EnumTree;
			return;
		}
		this._readPointer = checkpoint.pointer;
		checkpoint.treeReference = {} as EnumTree; // Clear the content of the referenced Enum Tree branch.
	}

	/**
	 * Recursively parse the stored buffer into an Enum Tree.
	 * @returns An Enum Tree.
	 */
	parse (): EnumTree {
		console.log('[Buffer] Parsing...');
		const startTime = performance.now();
		this._parsedTree = {} as EnumTree;
		this._addCheckpoint(this._parsedTree);
		const success = this._branch(this._parsedTree);
		console.log('Main branch', success ? 'was successful.' : 'failed.');
		const endTime = performance.now();
		console.log('[Buffer] Done parsing', this.bytesReadSinceCreation, 'bytes in', endTime - startTime, 'milliseconds.');
		return { ...this._parsedTree } as EnumTree;
	}

	_branch (parent: EnumTree, length = 1): boolean {
		// Process enumfields for the length of the branch.
		let fieldsProcessed = 0;

		while (fieldsProcessed < length) {
			let enumerator = this.readAsEnumerator();
			// Skip over the enumerator if it is '0000'.
			while (enumerator === '0000') {
				enumerator = this.readAsEnumerator();
			}

			const field = generalEnumfields[enumerator];

			// Invoke error checking if the field was not found.
			if (!field) {
				console.warn('[Buffer] Enumerator', enumerator, 'was not found at byte #', this.bytesReadSinceCreation, '.');
				console.log('├', hexToString(this.peek(-16)).toUpperCase() + hexToString(this.peek(32)).toUpperCase());
				console.log('└                             ^');

				// Start checking for errors.
				if (!!this._errorPointer && this._readPointer <= this._errorPointer) { // If an error is currently being evaluated and the read pointer has not passed it.
					this._insertZeros();
					this._findPreviousZeros();
					this._rewindToCheckpoint();
					this._removeZeros();
				} else {
					this._errorPointer = this._readPointer;
					this._zeroPointer = this._readPointer;
					this._findPreviousZeros();
					this._rewindToCheckpoint();
					this._removeZeros();
				}

				return false; // Break the loop and prune the branch.
			}

			// Process as an ArrayOfEnumBlockArrays.
			// ENUM + fieldLength --> [ { branch() × arrayLength } × fieldLength ]
			if (field.length === 'ArrayOfEnumBlockArrays') {
				parent[enumerator] = [] as EnumTree[];
				const fieldLength = parseInt(this.readAsEnumerator(), 16);
				console.log('[Buffer] ArrayOfEnumBlockArrays encountered was:', enumerator, '. With length:', fieldLength);
				let arraysProcessed = 0;
				while (arraysProcessed < fieldLength) { // TODO: This loop does not check for buffer errors.
					this._addCheckpoint(parent[enumerator][arraysProcessed]);
					const arrayLength = parseInt(this.readAsEnumerator(), 16);
					parent[enumerator][arraysProcessed] = {} as EnumTree;
					const success = this._branch(parent[enumerator][arraysProcessed], arrayLength);
					if (!success) {
						this._branch(parent, length); // Create a new, identical branch.
						return false; // Break the loop and prune the branch.
					}
					arraysProcessed++;
				}
			}

			// Process as an EnumBlockArray.
			// ENUM + arrayLength --> { branch() × arrayLength }
			else if (field.length === 'EnumBlockArray') {
				parent[enumerator] = {} as EnumTree;
				this._addCheckpoint(parent[enumerator]);
				const arrayLength = parseInt(this.readAsEnumerator(), 16);
				console.log('[Buffer] EnumBlockArray encountered was:', enumerator, '. With length:', arrayLength);
				const success = this._branch(parent[enumerator], arrayLength);
				if (!success) {
					this._branch(parent, length); // Create a new, identical branch.
					return false; // Break the loop and prune the branch.
				}
			}

			// Process as a Sized field.
			// ENUM + fieldLength --> [ 00 × fieldLength ]
			else if (field.length === 'Sized') {
				const fieldLength = parseInt(this.readAsEnumerator(), 16);
				const data = this.read(fieldLength);
				parent[enumerator] = [...data];
			}

			// Process as a Generic.
			// ENUM --> [ 00 × fieldLength ]
			else {
				const data = this.read(field.length);
				parent[enumerator] = [...data];
			}

			fieldsProcessed++;
		}

		return true;
	}
}
