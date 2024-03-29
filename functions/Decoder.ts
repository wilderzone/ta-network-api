import { generalEnumfields, IngameMessageTypes, Items, Maps, Regions, Teams, WatchNowSections } from '../data/index.js';
import type { EnumTree, Map, Team } from '../interfaces/index.js';
import { hexToString } from './Utils.js';

export interface DecoderOptions {
	clean?: boolean,
	debug?: boolean
}

export class Decoder {
	#tree = {} as EnumTree;
	#enumfieldsParsed = 0;
	#output = {} as { [key: string]: any };
	#options = {} as DecoderOptions;

	constructor (tree: EnumTree, options?: DecoderOptions) {
		this.#tree = tree;
		this.#options = options ?? {} as DecoderOptions;
	}

	/**
	 * Decodes a machine-readable Enum Tree.
	 * @returns A human-readable Enum Tree.
	 */
	decode () {
		if (this.#options.debug) console.log('[Decoder] Decoding tree...');
		this.#enumfieldsParsed = this.#recurse(this.#output, this.#tree);
		if (this.#options.debug) console.log('[Decoder] Parsed', this.#enumfieldsParsed, 'enumfields.');
		return this.#output;
	}

	/**
	 * Decode the binary content of an enumfield as an expected field type.
	 * @param value The content of the enumfield.
	 * @param type The type of enumfield to attempt to decode as.
	 * @returns The decoded value. (Or the original value if decoding was not possible).
	 */
	decodeFieldValue (value: Uint8Array, type: string) {
		return this.#parseFieldValue([...value], type);
	}

	#recurse (parent: EnumTree, tree: EnumTree): number {
		// Stop if we have reached the end of the tree.
		if (Object.keys(tree).length <= 0) {
			return 0;
		}

		let fieldsProcessed = 0;

		Object.entries(tree).forEach(([enumerator, value]) => {
			// const newKey = generalEnumfields[enumerator]?.name ?? enumerator;
			const newKey = enumerator;
			// If the value is an ArrayOfEnumBlockArrays.
			if (Array.isArray(value) && value.length && typeof value[0] === 'object' && !Array.isArray(value[0])) {
				parent[newKey] = [] as { [key: string]: any }[];
				let indexOffset = 0;
				value.forEach((block: { [key: string]: any }, index) => {
					parent[newKey][index + indexOffset] = {} as { [key: string]: any };
					fieldsProcessed += this.#recurse(parent[newKey][index + indexOffset], block);

					// Clean option: Delete the branch if it is empty.
					if (this.#options.clean && Object.entries(parent[newKey][index + indexOffset]).length <= 0) {
						delete parent[newKey][index + indexOffset];
						indexOffset -= 1;
						// Prevent a possible null from remaining at the end of the branch.
						if (index >= value.length - 1) {
							parent[newKey].pop();
						}
					}
				});
			}

			// If the value is an EnumBlockArray.
			else if (value && typeof value === 'object' && !Array.isArray(value)) {
				parent[newKey] = {} as { [key: string]: any };
				fieldsProcessed += this.#recurse(parent[newKey], value);

				// Clean option: Delete the branch if it is empty.
				if (this.#options.clean && Object.entries(parent[newKey]).length <= 0) {
					delete parent[newKey];
				}
			}

			// If the value is a primative.
			else {
				parent[newKey] = this.#parseFieldValue(value as number[], generalEnumfields[enumerator]?.type);
			}
			fieldsProcessed++;
		});

		return fieldsProcessed;
	}

	#parseFieldValue (value: number[], type?: string): any {
		if (!type) {
			return value;
		}

		// Booleans are represented by a single byte, [ 00 ] = false, [ 01 ] = true.
		if (type === 'Boolean') {
			if (value.length !== 1) {
				if (this.#options.debug) console.warn('[Decoder] Error decoding boolean (', value, '). Enumfield may be incorrectly typed.');
				return value;
			}
			return value[0] === 1;
		}

		// Occasionally, Boolean values are also represented by single string characters. We refer to these as "string-booleans".
		// [ 6E ] = "n" = false, [ 79 ] = "y" = true.
		if (type === 'StringBoolean') {
			if (value.length !== 1 || (value[0] !== 0x6E && value[0] !== 0x79)) {
				if (this.#options.debug) console.warn('[Decoder] Error decoding string-boolean (', value, '). Enumfield may be incorrectly typed.');
				return value;
			}
			return value[0] === 0x79;
		}

		// Occasionally, Boolean values are also represented by integers. We refer to these as "integer-booleans".
		// [ 00 00 00 00 ] = false, [ 01 00 00 00 ] = true.
		if (type === 'IntegerBoolean') {
			if (value.length !== 4) {
				if (this.#options.debug) console.warn('[Decoder] Error decoding integer-boolean (', value, '). Enumfield may be incorrectly typed.');
				return value;
			}
			return parseInt(hexToString(new Uint8Array(value.reverse())), 16) === 1;
		}

		// Integers are represented by 4 bytes in reverse order.
		// These bytes must be swapped before they can be read as a normal integer:
		// [ 2A 38 59 01 ]  =>  [ 01 59 38 2A ]
		if (type === 'Integer') {
			if (value.length !== 4) {
				if (this.#options.debug) console.warn('[Decoder] Error decoding integer (', value, '). Enumfield may be incorrectly typed.');
				return value;
			}
			return parseInt(hexToString(new Uint8Array(value.reverse())), 16);
		}

		// Strings can be represented by any length of bytes.
		// Each byte in the string represents one ASCII-encoded character.
		// [ 54 72 69 62 65 73 ]
		//    │  │  │  │  │  │
		// "  T  r  i  b  e  s "
		if (type === 'String') {
			return value.map((v) => String.fromCharCode(v)).join('');
		}

		// Version numbers are represented by 4 bytes in reverse order.
		// The last two bytes represent the major and minor versions, and the first two bytes represent the patch version:
		//      [ 61 0B 04 01 ]
		// Patch ──┴──┘  │  └── Major
		//       Minor ──┘
		if (type === 'Version') {
			if (value.length !== 4) {
				if (this.#options.debug) console.warn('[Decoder] Error decoding version (', value, '). Enumfield may be incorrectly typed.');
				return value;
			}
			return `${value[3]}.${value[2]}.${parseInt(hexToString(new Uint8Array(value.slice(0, 2).reverse())), 16)}.0`;
		}

		// IP addresses are represented by 8 bytes:
		//        [ 00 00 00 00 00 00 00 00 ]
		// Unknown ──┴──┘  │  │  └──┴──┴──┴── IP
		//          Port ──┘──┘
		if (type === 'IP') {
			if (value.length !== 8) {
				if (this.#options.debug) console.warn('[Decoder] Error decoding IP address (', value, '). Enumfield may be incorrectly typed.');
				return value;
			}
			const unknownBytes = hexToString(new Uint8Array(value.slice(0, 2))); // The first two bytes are unknown (possibly either a region ID or just placeholders).
			const port = parseInt(hexToString(new Uint8Array(value.slice(2, 4))), 16); // The next two bytes represent the port number as a big-endian integer.
			// Each following byte is one integer of the IPv4 address.
			const [ip1, ip2, ip3, ip4] = value.splice(4, 4);
			return `${ip1}.${ip2}.${ip3}.${ip4}:${port} (${unknownBytes})`;
		}

		// Item IDs are represented by 4 byte integers.
		// A map of item IDs to item data is available in the `data` module.
		if (type === 'ItemID') {
			if (value.length !== 4) {
				if (this.#options.debug) console.warn('[Decoder] Error decoding Item ID (', value, '). Enumfield may be incorrectly typed.');
				return value;
			}
			const id = parseInt(hexToString(new Uint8Array(value.reverse())), 16).toString(); // Decode ID as integer.
			if (id in Items) {
				return Items[id];
			}
			return parseInt(id);
		}

		// Map IDs are represented by 4 byte integers.
		// A map of map IDs to map data is available in the `data` module.
		if (type === 'MapID') {
			if (value.length !== 4) {
				if (this.#options.debug) console.warn('[Decoder] Error decoding Map ID (', value, '). Enumfield may be incorrectly typed.');
				return value;
			}
			const id = parseInt(hexToString(new Uint8Array(value.reverse())), 16); // Decode ID as integer.
			let output = undefined as Map | undefined;
			Object.entries(Maps).forEach((map) => {
				if (map[1].id === id) {
					output = map[1];
				}
			});
			return output ?? id;
		}

		// Team IDs are represented by 4 byte integers.
		// A map of team IDs to team data is available in the `data` module.
		if (type === 'TeamID') {
			if (value.length !== 4) {
				if (this.#options.debug) console.warn('[Decoder] Error decoding Map ID (', value, '). Enumfield may be incorrectly typed.');
				return value;
			}
			const id = parseInt(hexToString(new Uint8Array(value.reverse())), 16); // Decode ID as integer.
			return Teams[id] ?? id;
		}

		// Region IDs are represented by 4 byte integers.
		// A map of region IDs to region data is available in the `data` module.
		if (type === 'Region') {
			if (value.length !== 4) {
				if (this.#options.debug) console.warn('[Decoder] Error decoding Region (', value, '). Enumfield may be incorrectly typed.');
				return value;
			}
			const id = parseInt(hexToString(new Uint8Array(value.reverse())), 16).toString(); // Decode ID as integer.
			if (id in Regions) {
				return Regions[id];
			}
			return parseInt(id);
		}

		// Watch-now section IDs are represented by 4 byte integers.
		// A map of section IDs to watch-now section data is available in the `data` module.
		if (type === 'WatchNowSection') {
			if (value.length !== 4) {
				if (this.#options.debug) console.warn('[Decoder] Error decoding Watch-now Section (', value, '). Enumfield may be incorrectly typed.');
				return value;
			}
			const id = parseInt(hexToString(new Uint8Array(value.reverse())), 16).toString(); // Decode ID as integer.
			if (id in WatchNowSections) {
				return WatchNowSections[id];
			}
			return parseInt(id);
		}

		// In-game Message types are represented by 4 byte integers.
		// A map of message types is available in the `data` module.
		if (type === 'IGMT') {
			if (value.length !== 4) {
				if (this.#options.debug) console.warn('[Decoder] Error decoding In-game Message Type (', value, '). Enumfield may be incorrectly typed.');
				return value;
			}
			const id = parseInt(hexToString(new Uint8Array(value.reverse())), 16).toString(); // Decode ID as integer.
			if (id in IngameMessageTypes) {
				return IngameMessageTypes[id];
			}
			return parseInt(id);
		}

		return value;
	}
}
