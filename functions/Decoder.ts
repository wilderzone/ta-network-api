import { generalEnumfields } from '../data';
import { EnumTree } from '../interfaces';
import { hexToString, invertEndianness } from './Utils';

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
		const newKey = generalEnumfields[enumerator].name ?? enumerator;
		if (value && typeof value === 'object' && !Array.isArray(value)) {
			parent[newKey] = {} as { [key: string]: any };
			fieldsProcessed += recurse(parent[newKey], value);
		} else {
			parent[newKey] = parseFieldValue(value as number[], generalEnumfields[enumerator].type);
		}
		fieldsProcessed++;
	});

	return fieldsProcessed;
}

function parseFieldValue (value: number[], type?: string): any {
	if (!type) {
		return value;
	}

	// Integers are represented by 4 bytes in reverse order.
	// These bytes must be swapped before they can be read as a normal integer:
	// [ 2A 38 59 01 ]  =>  [ 01 59 38 2A ]
	if (type === 'Integer') {
		if (value.length !== 4) {
			return value;
		}
		return parseInt(hexToString(new Uint8Array(value.reverse())), 16);
	}

	// Version numbers are represented by 4 bytes in reverse order.
	// The last two bytes represent the major and minor versions, and the first two bytes represent the patch version:
	//      [ 61 0B 04 01 ]
	// Patch ──┴──┘  │  └── Major
	//       Minor ──┘
	if (type === 'Version') {
		if (value.length !== 4) {
			return value;
		}
		return `${value[3]}.${value[2]}.${parseInt(hexToString(new Uint8Array(value.slice(0, 2).reverse())), 16)}.0`;
	}

	return value;
}
