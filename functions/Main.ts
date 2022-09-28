import { loginServers } from '../data';
import { LoginServer, HiRezAccount, HashedCredentials } from '../interfaces';
import { GenericMessage, AuthenticationMessage } from './Messages';
import * as net from 'net';

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
	 * @param event
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

	async connect () {
		this._socket = net.connect(
			this._serverInstance.port,
			this._serverInstance.ip,
			() => { this._callbacks.connect.forEach((callback) => { callback(); }) }
		)
		);

		this._isConnected = true;
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
