import { generalEnumfields, Items, Maps, Regions } from '../data';
import { EnumTree, Item, Map } from '../interfaces';
import { hexToString } from './Utils';

export class Decoder {
	_tree = {} as EnumTree;
	_enumfieldsParsed = 0;
	_output = {} as { [key: string]: any };

	constructor (tree: EnumTree) {
		this._tree = tree;
	}

	/**
	 * Decodes a machine-readable Enum Tree.
	 * @returns A human-readable Enum Tree.
	 */
	decode () {
		console.log('[Decoder] Decoding tree...');
		this._enumfieldsParsed = recurse(this._output, this._tree);
		console.log('[Decoder] Parsed', this._enumfieldsParsed, 'enumfields.');
		return this._output;
	}
}

function recurse (parent: EnumTree, tree: EnumTree): number {
	// Stop if we have reached the end of the tree.
	if (Object.keys(tree).length <= 0) {
		return 0;
	}
	
	let fieldsProcessed = 0;

	Object.entries(tree).forEach(([enumerator, value]) => {
		const newKey = generalEnumfields[enumerator]?.name ?? enumerator;
		// If the value is an ArrayOfEnumBlockArrays.
		if (Array.isArray(value) && value.length && typeof value[0] === 'object' && !Array.isArray(value[0])) {
			parent[newKey] = [] as { [key: string]: any }[];
			value.forEach((block: { [key: string]: any }, index) => {
				parent[newKey][index] = {} as { [key: string]: any };
				fieldsProcessed += recurse(parent[newKey][index], block);
			});
		}
		
		// If the value is an EnumBlockArray.
		else if (value && typeof value === 'object' && !Array.isArray(value)) {
			parent[newKey] = {} as { [key: string]: any };
			fieldsProcessed += recurse(parent[newKey], value);
		}
		
		// If the value is a primative.
		else {
			parent[newKey] = parseFieldValue(value as number[], generalEnumfields[enumerator]?.type);
		}
		fieldsProcessed++;
	});

	return fieldsProcessed;
}

function parseFieldValue (value: number[], type?: string): any {
	if (!type) {
		return value;
	}

	// Booleans are represented by a single byte, [ 00 ] = false, [ 01 ] = true.
	if (type === 'Boolean') {
		if (value.length !== 1) {
			console.warn('[Decoder] Error decoding boolean (', value, '). Enumfield may be incorrectly typed.');
			return value;
		}
		return value[0] === 1;
	}

	// Integers are represented by 4 bytes in reverse order.
	// These bytes must be swapped before they can be read as a normal integer:
	// [ 2A 38 59 01 ]  =>  [ 01 59 38 2A ]
	if (type === 'Integer') {
		if (value.length !== 4) {
			console.warn('[Decoder] Error decoding integer (', value, '). Enumfield may be incorrectly typed.');
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
			console.warn('[Decoder] Error decoding version (', value, '). Enumfield may be incorrectly typed.');
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
			console.warn('[Decoder] Error decoding IP address (', value, '). Enumfield may be incorrectly typed.');
			return value;
		}
		const unknownBytes = hexToString(new Uint8Array(value.slice(0, 2))); // The first two bytes are unknown (possibly either a region ID or just placeholders).
		const port = parseInt(hexToString(new Uint8Array(value.slice(2, 4))), 16); // The next two bytes represent the port number as a big-endian integer.
		// Each following byte is one integer of the IPv4 address.
		const ip1 = value[4];
		const ip2 = value[5];
		const ip3 = value[6];
		const ip4 = value[7]; 
		return `${ip1}.${ip2}.${ip3}.${ip4}:${port} (${unknownBytes})`;
	}

	// Item IDs are represented by 4 byte integers.
	if (type === 'ItemID') {
		if (value.length !== 4) {
			console.warn('[Decoder] Error decoding Item ID (', value, '). Enumfield may be incorrectly typed.');
			return value;
		}
		const id = parseInt(hexToString(new Uint8Array(value.reverse())), 16).toString(); // Decode ID as integer.
		let output = {} as Item;
		if (id in Items) {
			output = Items[id];
		}
		return output;
	}

	// Map IDs are represented by 4 byte integers.
	if (type === 'MapID') {
		if (value.length !== 4) {
			console.warn('[Decoder] Error decoding Map ID (', value, '). Enumfield may be incorrectly typed.');
			return value;
		}
		const id = parseInt(hexToString(new Uint8Array(value.reverse())), 16); // Decode ID as integer.
		let output = {} as Map;
		Object.entries(Maps).forEach((map) => {
			if (map[1].id === id) {
				output = map[1];
			}
		});
		return output;
	}

	// Region IDs are represented by 4 byte integers.
	if (type === 'Region') {
		if (value.length !== 4) {
			console.warn('[Decoder] Error decoding Region (', value, '). Enumfield may be incorrectly typed.');
			return value;
		}
		const id = parseInt(hexToString(new Uint8Array(value.reverse())), 16); // Decode ID as integer.
		if (id in Regions) {
			return Regions[id.toString()];
		}
		return id;
	}

	return value;
}
