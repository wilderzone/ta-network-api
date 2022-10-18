import { HashedCredentials } from '../interfaces';
import { stringToHexInt, textToHexInt } from './Utils';
import { xorPasswordHash } from './XOR';


function compileMessage (chunks: (string | number[] | Uint8Array)[]): Uint8Array {
	let result = [] as number[];
	chunks.forEach((chunk) => {
		if (typeof chunk === 'string') {
			const processedChunk = stringToHexInt(chunk);
			if (processedChunk) {
				result.push(...processedChunk);
			} else {
				console.warn('Chunk processed incorrectly. Message may be malformed.');
			}
		} else if (typeof chunk === 'object' && chunk.length > 0) {
			result.push(...Array.from(chunk));
		} else {
			console.warn('Chunk not processed. Message may be malformed.');
		}
	});
	return new Uint8Array(result);
}

export class GenericMessage {
	buffer = {} as Uint8Array;

	constructor (content: (string | number[] | Uint8Array)[]) {
		this.buffer = compileMessage(content);
	}
}

export class AuthenticationMessage {
	buffer = {} as Uint8Array;

	constructor (credentials: HashedCredentials) {
		this.buffer = compileMessage([
			'b9003a000b00560060000000',
			xorPasswordHash(credentials.passwordHash, credentials.salt),
			'94040c00',
			textToHexInt(credentials.username),
			'7106432800007206000000007306017706c3ee58437606d13f00007406de1000007506811b0000340400000000000000009e04610b04010000000000000000'
		]);
	}
}

export class ServerListMessage {
	buffer = {} as Uint8Array;

	constructor () {
		this.buffer = compileMessage(['1600d5000200280202000000e90000002b0000002d000000']);
	}
}
