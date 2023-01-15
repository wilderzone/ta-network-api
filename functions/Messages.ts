import type { HashedCredentials } from '../interfaces/index.js';
import { stringToHex, textToHex, invertEndianness } from './Utils.js';
import { xorPasswordHash } from './Password.js';


function compileMessage (chunks: (string | number[] | Uint8Array)[]): Uint8Array {
	let result = [] as number[];
	chunks.forEach((chunk) => {
		if (typeof chunk === 'string') {
			const processedChunk = stringToHex(chunk);
			if (processedChunk) {
				result.push(...processedChunk);
			} else {
				console.warn('Message chunk processed incorrectly. Message may be malformed.');
			}
		} else if (typeof chunk === 'object' && chunk.length > 0) {
			result.push(...Array.from(chunk));
		} else {
			console.warn('Message chunk not processed. Message may be malformed.');
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
			textToHex(credentials.username),
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

export class ServerInfoMessage {
	buffer = {} as Uint8Array;

	constructor (serverId: number) {
		const idBytes = serverId.toString(16).padStart(8, '0');
		this.buffer = compileMessage([
			'1800', // Packet length.
			'c6010200c702',
			idBytes.substring(6, 8),
			idBytes.substring(4, 6),
			idBytes.substring(2, 4),
			idBytes.substring(0, 2),
			'2802020000003d00000029000000'
		]);
	}
}

export class WatchNowMessage {
	buffer = {} as Uint8Array;

	constructor () {
		this.buffer = compileMessage(['0c00b50100002d00000027000000']);
	}
}

export class DirectMessageMessage {
	buffer: Uint8Array;

	constructor (recipient: string, content: string) {
		const message = compileMessage([
			'700004009e00',
			'06000000', // Message type.
			'e602',
			invertEndianness(stringToHex(content.length.toString(16).padStart(4, '0'))), // Message content length.
			textToHex(content), // Message content.
			'4a03',
			invertEndianness(stringToHex(recipient.length.toString(16).padStart(4, '0'))), // Recipient name length.
			textToHex(recipient), // Recipient name.
			'740500',
			'2400000088010000'
		]);
		this.buffer = compileMessage([
			invertEndianness(stringToHex(message.length.toString(16).padStart(4, '0'))), // Packet length.
			message
		]);
	}
}
