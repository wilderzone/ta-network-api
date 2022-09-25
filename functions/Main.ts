import { loginServers, LoginServer } from '../data';
const net = require('net');

export class LoginServerConnection {
	isConnected = false;
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

		this.isConnected = true;
	}

	async disconnect () {
		this.isConnected = false;
	}

	async send () {}

	get accountData () {
		if (!this.isConnected) {
			throw new Error("Please connect to a login server first.");
		}

		let data = {};

		// Request account data from the connected login server.

		return data;
	}
}
