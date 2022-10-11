import * as net from 'net';
import { loginServers } from '../data';
import { LoginServer, HiRezAccount, HashedCredentials } from '../interfaces';
import { GenericMessage, AuthenticationMessage } from './Messages';
import { Buffer } from './Buffer';
import { Decoder } from './Decoder';
import { verifyPacketLength } from './Utils';

interface LoginServerConnectionCallbackMap {
	connect: Function[],
	disconnect: Function[],
	send: Function[],
	receive: Function[]
}

interface LoginServerConnectionMessage {
	buffer: Uint8Array
}

type LoginServerConnectionMessagePresets = 'authenticate' | LoginServerConnectionMessage;

export class LoginServerConnection {
	_isConnected = false;
	_serverKey = undefined as keyof typeof loginServers | undefined;
	_serverInstance = {} as LoginServer;
	_credentials = {} as HashedCredentials | undefined;
	_socket = {} as net.Socket;
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
		console.log('Connecting to login server on', this._serverInstance.ip, '...');

		this._socket = net.connect(
			this._serverInstance.port,
			this._serverInstance.ip
		);

		// this._socket.setEncoding('hex'); // Using the 'hex' encoding will cause the socket to produce a buffer containing nibbles.
		this._socket.setKeepAlive(false, 3000);
		this._socket.setTimeout(5000);

		// Set up event listeners.
		this._socket.on('connect', () => {
			console.log('Connected.');
			this._isConnected = true;
			this._callbacks.connect.forEach((callback) => { callback(); });
		});

		this._socket.on('timeout', () => {
			console.warn('Socket connection timed-out.');
			this._socket.end();
			this._isConnected = false;
			this._callbacks.disconnect.forEach((callback) => { callback(); });
		});

		this._socket.on('data', (data) => {
			console.log('Data:', data);
			const array = Uint8Array.from(data);
			if (!verifyPacketLength(array)) {
				console.warn('Length of received data is invalid. Packet may be malformed.');
				return;
			}
			const buffer = new Buffer(array);
			buffer.advance(2);
			const enumTree = buffer.parse();
			console.log('Parsed:', enumTree);

			const decoder = new Decoder(enumTree);
			const decodedData = decoder.decode();
			console.log('Decoded:', decodedData);

			if ('Auth Info' in decodedData && this._credentials) {
				// Acknowledge the server's auth info.
				const ackMessage = new GenericMessage(['12003a0001009e04610b04010000000000000000']);
				this._socket.write(ackMessage.buffer, 'hex', () => {
					console.log('Acknowledgement message sent.');
				});
			}

			if ('Auth Info Confirmation' in decodedData && this._credentials) {
				this._credentials.salt = new Uint8Array(decodedData['Auth Info Confirmation']['Salt']);
				const authMessage = new AuthenticationMessage({...this._credentials})
				console.log('Sending auth message...');
				console.log(authMessage);
				this._socket.write(authMessage.buffer, 'hex', () => {
					console.log('Auth message sent.');
				});
			}

			this._callbacks.receive.forEach((callback) => { callback(); });
		});

		// Start connection sequence.
		const initialMessage = new GenericMessage(['1000bc0102009e04610b040189040c000000']);
		this._socket.write(initialMessage.buffer, 'hex', () => {
			console.log('Initial message sent.');
		});
	}

	/**
	 * Disconnect from the login server.
	 */
	async disconnect () {
		this._socket.end();
		this._isConnected = false;
		this._callbacks.disconnect.forEach((callback) => { callback(); });
	}

	async send (message: LoginServerConnectionMessagePresets) {
		if (!this._isConnected) {
			throw new Error("Please connect to a login server first.");
		}

		const messagePresets = {
			authenticate: () => {
				if (!this._credentials) {
					return;
				}
				const message = new AuthenticationMessage(this._credentials);
				if (message.buffer) {
					this._socket.write(message.buffer, 'hex', () => {
						console.log('Auth message sent.');
					});
				}
			}
		};
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
