import * as net from 'net';
import { loginServers } from '../data';
import { LoginServer, HiRezAccount, HashedCredentials } from '../interfaces';
import { GenericMessage, AuthenticationMessage } from './Messages';
import { Buffer } from './Buffer';
import { Decoder } from './Decoder';
import { hexToString, verifyPacketLength } from './Utils';
const fs = require('fs');

interface LoginServerConnectionCallbackMap {
	connect: Function[],
	disconnect: Function[],
	send: Function[],
	receive: Function[]
}

interface LoginServerConnectionMessage {
	buffer: Uint8Array
}

export class LoginServerConnection {
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

	constructor (server: keyof typeof loginServers | LoginServer, credentials: HashedCredentials) {
		if (typeof server === 'string' && server in loginServers) {
			this._serverKey = server;
			this._serverInstance = loginServers[server];
		} else {
			this._serverInstance = server as LoginServer;
		}
		this._credentials = credentials;
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
		console.log('[Main] Connecting to login server on', this._serverInstance.ip, '...');

		this._socket = net.connect(
			this._serverInstance.port,
			this._serverInstance.ip
		);

		// this._socket.setEncoding('hex'); // Using the 'hex' encoding will cause the socket to produce a buffer containing nibbles.
		this._socket.setKeepAlive(false, this._timeToIdle);
		this._socket.setTimeout(6000);

		// Set up event listeners.
		this._socket.on('connect', () => {
			console.log('[Main] Connected.');
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
			console.log('[Main] Data:', data);
			const array = Uint8Array.from(data);
			
			this._idleTimers.forEach((timer) => { clearTimeout(timer); });
			this._idleTimers.push(setTimeout(() => { this._idle(); }, this._timeToIdle));

			// Process an existing packet stream.
			if (this._isReceivingStream) {
				console.log('[Main] Received stream packet.')
				// Append all received packets to the same Buffer.
				this._streamBuffer.append(array);
				// TODO: Figure out a definitive way to detect when a stream has ended.
			}
			
			// Detect the start of a packet stream.
			else if (array[0] === 0 && array[1] === 0) { // data[00 00 ...] Indicates the start of a packet stream.
				this._isReceivingStream = true;
				console.log('[Main] Packet stream started.');
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
				console.log('[Main] Parsed:', enumTree);

				const decoder = new Decoder(enumTree);
				const decodedData = decoder.decode();
				console.log('[Main] Decoded:', decodedData);

				// If the connection hasn't yet been authenticated, attempt to authenticate.
				if (!this._authProgress.initial && 'Auth Info' in decodedData && this._credentials) {
					// Acknowledge the server's auth info.
					const ackMessage = new GenericMessage(['12003a0001009e04610b04010000000000000000']);
					this._socket.write(ackMessage.buffer, 'hex', () => {
						this._authProgress.initial = true;
						console.log('[AUTH] Acknowledgement message sent.');
					});
				}

				if (!this._authProgress.confirmation && 'Auth Info Confirmation' in decodedData && this._credentials) {
					this._credentials.salt = new Uint8Array(decodedData['Auth Info Confirmation']['Salt']);
					const authMessage = new AuthenticationMessage({...this._credentials})
					console.log('[AUTH] Sending credentials...');
					console.log(authMessage);
					this._socket.write(authMessage.buffer, 'hex', () => {
						this._authProgress.confirmation = true;
						console.log('[AUTH] Credentials sent.');
					});
				}

				this._callbacks.receive.forEach((callback) => { callback(); });
			}
		});

		// Start connection sequence.
		const initialMessage = new GenericMessage(['1000bc0102009e04610b040189040c000000']);
		this._socket.write(initialMessage.buffer, 'hex', () => {
			console.log('[Main] Connection request sent.');
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
			throw new Error("Please connect to a login server first.");
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
				console.log(`[Main] Sent message ${this._messageId}.`);
			});
		}
	}

	_flushStreamBuffer () {
		// Flush the stream buffer.
		if (this._streamBuffer.length > 0) {
			console.log('[Main] Flushing stream buffer...');
			const enumTree = this._streamBuffer.parse();
			console.log('[Main] Parsed:', enumTree);

			const decoder = new Decoder(enumTree);
			const decodedData = decoder.decode();
			console.log('[Main] Decoded:', decodedData);

			console.log('[Main] End of stream data.');

			fs.writeFile("dumps/output.json", JSON.stringify(decodedData, null, 4), 'utf8', function (err: any) {
				if (err) {
					console.log("An error occured while writing JSON Object to File.");
					return console.log(err);
				}
				console.log("[Main] JSON file has been saved.");
			});
		}
	}

	_idle () {
		this._idleTimers.forEach((timer) => { clearTimeout(timer); });
		this._flushStreamBuffer();
		this._sendNextMessageInQueue();
	}

	get isConnected () {
		return this._isConnected;
	}

	get accountData (): HiRezAccount {
		if (!this._isConnected) {
			throw new Error("Please connect to a login server first.");
		}

		let data = {} as HiRezAccount;

		// Request account data from the connected login server.

		return data;
	}
}
