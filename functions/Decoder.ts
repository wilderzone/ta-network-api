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

	// Integers are represented by 4 bytes, with the two high bytes on the right and the two low bytes one the left.
	// These byte pairs must be swapped before they can be read as a normal integer:
	//     <----
	// [ 2A38  0159 ]  =>  [ 0159 2A38 ]
	//      ---->
	if (type === 'Integer') {
		if (value.length !== 4) {
			return value;
		}
		return parseInt(hexToString(new Uint8Array(value.reverse())), 16);
	}

	if (type === 'Version') {
		if (value.length !== 4) {
			return value;
		}
		return `${value[3]}.${value[2]}.${parseInt(hexToString(new Uint8Array(value.slice(0, 2).reverse())), 16)}.0`;
	}

	return value;
}
