import * as net from 'net';
import { loginServers } from '../data/index.js';
import type { LoginServer, HiRezAccount, HashedCredentials } from '../interfaces/index.js';
import { GenericMessage, AuthenticationMessage } from './Messages.js';
import { Buffer } from './Buffer.js';
import { DecoderOptions, Decoder } from './Decoder.js';
import { verifyPacketLength } from './Utils.js';

interface LoginServerConnectionCallbackMap {
	connect: Function[],
	disconnect: Function[],
	send: Function[],
	receive: Function[]
}

interface LoginServerConnectionMessage {
	buffer: Uint8Array
}

interface LoginServerConnectionOptions {
	authenticate?: boolean,
	decoder?: DecoderOptions
}

export class LoginServerConnection {
	_options = {} as LoginServerConnectionOptions;
	_isConnected = false;
	_serverKey = undefined as keyof typeof loginServers | undefined;
	_serverInstance = {} as LoginServer;
	_credentials = {} as HashedCredentials | undefined;
	_authProgress = {
		initial: false,
		confirmation: false
	};
	_socket = {} as net.Socket;
	_isReceivingStream = false;
	_streamBuffer = new Buffer();
	_timeToIdle = 3000;
	_idleTimers = [] as NodeJS.Timeout[];
	_messageQueue = [] as LoginServerConnectionMessage[];
	_messageId = 0;
	_callbacks = {
		connect: [],
		disconnect: [],
		send: [],
		receive: []
	} as LoginServerConnectionCallbackMap;

	constructor (server: keyof typeof loginServers | LoginServer, credentials: HashedCredentials, options?: LoginServerConnectionOptions) {
		if (typeof server === 'string' && server in loginServers) {
			this._serverKey = server;
			this._serverInstance = loginServers[server];
		} else {
			this._serverInstance = server as LoginServer;
		}
		this._credentials = credentials;
		this._options = options ?? {} as LoginServerConnectionOptions;
	}

	/**
	 * Attach a callback function to any of the available connection events. (Multiple callbacks can be attached to a single event).
	 * @param event The event to listen for. (Eg: `connect`, `receive`, etc).
	 * @param callback Callback function to attach to the event.
	 * @returns `true` if the callback was successfully attached, `false` if not.
	 */
	on (event: keyof LoginServerConnectionCallbackMap, callback: Function): boolean {
		if (event in this._callbacks) {
			this._callbacks[event].push(callback);
			return true;
		}
		return false;
	}

	/**
	 * Establish a live connection to the Login Server.
	 */
	async connect () {
		console.log('[LSC] Connecting to login server on', this._serverInstance.ip, '...');

		this._socket = net.connect(
			this._serverInstance.port,
			this._serverInstance.ip
		);

		// this._socket.setEncoding('hex'); // Using the 'hex' encoding will cause the socket to produce a buffer containing nibbles.
		this._socket.setKeepAlive(true, this._timeToIdle);
		this._socket.setTimeout(40000);

		// Set up event listeners.
		this._socket.on('connect', () => {
			console.log('[LSC] Connected.');
			this._isConnected = true;
			this._idleTimers.forEach((timer) => { clearTimeout(timer); });
			this._idleTimers.push(setTimeout(() => { this._idle(); }, this._timeToIdle));
			this._callbacks.connect.forEach((callback) => { callback(); });
		});

		this._socket.on('timeout', () => {
			console.warn('Socket connection timed-out.');
			this.disconnect();
			this._callbacks.disconnect.forEach((callback) => { callback(); });
		});

		this._socket.on('data', (data) => {
			console.log('[LSC] Data:', data);
			const array = Uint8Array.from(data);

			this._idleTimers.forEach((timer) => { clearTimeout(timer); });
			this._idleTimers.push(setTimeout(() => { this._idle(); }, this._timeToIdle));

			// Process an existing packet stream.
			if (this._isReceivingStream) {
				console.log('[LSC] Received stream packet.')
				// Append all received packets to the same Buffer.
				this._streamBuffer.append(array);
				// TODO: Figure out a definitive way to detect when a stream has ended.
			}

			// Detect the start of a packet stream.
			else if (array[0] === 0 && array[1] === 0) { // data[00 00 ...] Indicates the start of a packet stream.
				this._isReceivingStream = true;
				console.log('[LSC] Packet stream started.');
				this._streamBuffer.clear();
				this._streamBuffer.append(array);
				this._streamBuffer.advance(2);
			}

			// Process a single packet.
			else {
				if (!verifyPacketLength(array)) {
					console.warn('Length of received data is invalid. Packet may be malformed.');
					return;
				}
				const buffer = new Buffer(array);
				buffer.advance(2);
				const enumTree = buffer.parse();
				console.log('[LSC] Parsed:', enumTree);

				const decoder = new Decoder(enumTree, this._options.decoder ?? {});
				const decodedData = decoder.decode();
				console.log('[LSC] Decoded:', decodedData);

				if (!this._options.authenticate || (this._authProgress.initial && this._authProgress.confirmation)) {
					this._callbacks.receive.forEach((callback) => { callback(decodedData); });
					return;
				}

				if (this._options.authenticate) {
					// If the connection hasn't yet been authenticated, attempt to authenticate.
					if ('Auth Info' in decodedData && this._credentials) {
						// Acknowledge the server's auth info.
						const ackMessage = new GenericMessage(['12003a0001009e04610b04010000000000000000']);
						this._socket.write(ackMessage.buffer, 'hex', () => {
							this._authProgress.initial = true;
							console.log('[AUTH] Acknowledgement message sent.');
						});
					}

					if ('Auth Info Confirmation' in decodedData && this._credentials) {
						this._credentials.salt = new Uint8Array(decodedData['Auth Info Confirmation']['Salt']);
						const authMessage = new AuthenticationMessage({...this._credentials})
						console.log('[AUTH] Sending credentials...');
						console.log(authMessage);
						this._socket.write(authMessage.buffer, 'hex', () => {
							this._authProgress.confirmation = true;
							console.log('[AUTH] Credentials sent.');
						});
					}
				}
			}
		});

		// Start connection sequence.
		const initialMessage = new GenericMessage(['1000bc0102009e04610b040189040c000000']);
		this._socket.write(initialMessage.buffer, 'hex', () => {
			console.log('[LSC] Connection request sent.');
		});
	}

	/**
	 * Disconnect from the login server.
	 */
	async disconnect () {
		this._socket.end();
		this._isConnected = false;
		this._authProgress.initial = false;
		this._authProgress.confirmation = false;
		this._callbacks.disconnect.forEach((callback) => { callback(); });
	}

	/**
	 * Immediately send a message to the connected server, bypassing the message queue.
	 * @param message The message to send.
	 */
	async send (message: LoginServerConnectionMessage) {
		if (!this._isConnected) {
			throw new Error('Please connect to a login server first.');
		}
		// Add the requested message to the queue.
		this._messageQueue.push(message);
	}

	/**
	 * Add a message to the message queue so that it can be automatically sent when the connection next becomes idle.
	 * @param message The message to add to the queue.
	 */
	async queue (message: LoginServerConnectionMessage) {
		// Add the requested message to the queue.
		if (message) {
			this._messageQueue.push(message);
		}
	}

	async _sendNextMessageInQueue () {
		const message = this._messageQueue.shift();
		if (message) {
			this._messageId++;
			this._socket.write(message.buffer, 'hex', () => {
				console.log(`[LSC] Sent message ${this._messageId}.`);
			});
		}
	}

	_flushStreamBuffer () {
		// Flush the stream buffer.
		if (this._streamBuffer.length > 0) {
			console.log('[LSC] Flushing stream buffer...');
			const enumTree = this._streamBuffer.parse();
			console.log('[LSC] Parsed:', enumTree);

			const decoder = new Decoder(enumTree, this._options.decoder ?? {});
			const decodedData = decoder.decode();
			console.log('[LSC] Decoded:', decodedData);

			console.log('[LSC] End of stream data.');

			this._callbacks.receive.forEach((callback) => { callback(decodedData); });
		}
	}

	_idle () {
		this._idleTimers.forEach((timer) => { clearTimeout(timer); });
		this._isReceivingStream = false;
		this._flushStreamBuffer();
		this._sendNextMessageInQueue();
	}

	get isConnected () {
		return this._isConnected;
	}

	get accountData (): HiRezAccount {
		if (!this._isConnected) {
			throw new Error('Please connect to a login server first.');
		}

		let data = {} as HiRezAccount;

		// Request account data from the connected login server.

		return data;
	}
}
