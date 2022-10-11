import * as net from 'net';
import { loginServers } from '../data';
import { LoginServer, HiRezAccount, HashedCredentials } from '../interfaces';
import { GenericMessage, AuthenticationMessage } from './Messages';
import { Buffer } from './Buffer';
import { Decoder } from './Decoder';
import { hexToString, verifyPacketLength } from './Utils';

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
	_socket = {} as net.Socket;
	_isReceivingStream = false;
	_streamBuffer = new Buffer();
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
			console.log('Data:', hexToString(array));

			// Process an existing packet stream.
			if (this._isReceivingStream) {
				console.log('Received stream packet.')
				// Append all received packets to the same Buffer.
				this._streamBuffer.append(array);
				// TODO: Figure out a definitive way to detect when a stream has ended.
			}
			
			// Detect the start of a packet stream.
			else if (array[0] === 0 && array[1] === 0) { // data[00 00 ...] Indicates the start of a packet stream.
				this._isReceivingStream = true;
				console.log('Packet stream started.');
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
				console.log('Parsed:', enumTree);

				const decoder = new Decoder(enumTree);
				const decodedData = decoder.decode();
				console.log('Decoded:', decodedData);


				this._callbacks.receive.forEach((callback) => { callback(); });
			}
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

	async send (message: LoginServerConnectionMessage) {
		if (!this._isConnected) {
			throw new Error("Please connect to a login server first.");
		}

				}
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
