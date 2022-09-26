import { loginServers } from '../data';
import { LoginServer, HiRezAccount } from '../interfaces';
import * as net from 'net';

export class LoginServerConnection {
	_isConnected = false;
	_serverKey = undefined as keyof typeof loginServers | undefined;
	_serverInstance = {} as LoginServer;

	constructor (server: keyof typeof loginServers | LoginServer) {
		if (typeof server === 'string') {
			this._serverKey = server;
		} else {
			this._serverInstance = server;
		}
	}

	async connect () {
		// net.connect()

		this._isConnected = true;
	}

	async disconnect () {
		this._isConnected = false;
	}

	async send () {}
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
