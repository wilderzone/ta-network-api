import * as net from 'net';
import { loginServers } from '../data/index.js';
import type { LoginServer, HashedCredentials, EnumTree } from '../interfaces/index.js';
import type { FetchableDataset, FetchType } from '../datasets/index.js';
import { AccountData, Player, GameServerInfo, WatchNowItem } from '../datasets/index.js';
import { BufferOptions, Buffer } from './Buffer.js';
import { DecoderOptions, Decoder } from './Decoder.js';
import * as Messages from './Messages.js';
import { verifyPacketLength } from './Utils.js';

interface LoginServerConnectionOptions {
	authenticate?: boolean,
	debug?: boolean,
	processMalformedPackets?: boolean,

	buffer?: BufferOptions,
	decoder?: DecoderOptions
}

export class LoginServerConnection {
	#credentials: HashedCredentials;
	#serverKey = undefined as keyof typeof loginServers | undefined;
	#serverInstance = {} as LoginServer;
	#options: LoginServerConnectionOptions;
	#timeToIdle = 3000;
	#idleTimers = [] as NodeJS.Timeout[];
	#timeToTimeout = 15000;
	#socket = {} as net.Socket;
	#messageQueue = [] as {
		message: Messages.GenericMessage,
		resolver: Function
	}[];
	#messageId = 0;
	#state = {
		authProgress: {
			initial: false,
			confirmation: false
		},
		isAuthenticated: false,
		isConnected: false,
		isListening: false,
		isReceivingStream: false,
		streamBuffer: {} as Buffer,
		accountData: undefined as AccountData | undefined,
		globalResolver: (decodedData: { [key: string]: any }): void => {}
	}


	constructor (server: keyof typeof loginServers | LoginServer, credentials: HashedCredentials, options?: LoginServerConnectionOptions) {
		if (typeof server === 'string' && server in loginServers) {
			this.#serverKey = server;
			this.#serverInstance = loginServers[server];
		} else {
			this.#serverInstance = server as LoginServer;
		}
		this.#credentials = credentials;
		this.#options = options ?? {} as LoginServerConnectionOptions;
		this.#state.streamBuffer = new Buffer(new Uint8Array(), this.#options.buffer);
	}


	get accountData (): AccountData | undefined {
		if (this.#state.accountData) {
			return this.#state.accountData;
		}

		void this.fetch('AccountData');
	}

	#resetState (): void {
		this.#state.authProgress.initial = false;
		this.#state.authProgress.confirmation = false;
		this.#state.isAuthenticated = false;
		this.#state.isConnected = false;
		this.#state.isReceivingStream = false;
		this.#state.streamBuffer.clear();
		this.#state.accountData = undefined;
	}

	/**
	 * Connect to the login server.
	 */
	connect (): Promise<void> {
		return new Promise((resolve, reject) => {
			if (this.#options.debug) console.log('[LSC] Connecting to login server on', this.#serverInstance.ip, '...');

			try {
				this.#socket = net.connect(this.#serverInstance.port, this.#serverInstance.ip);
				this.#socket.setKeepAlive(true, this.#timeToIdle);
				this.#socket.setTimeout(this.#timeToTimeout);

				this.#socket.on('connect', async () => {
					if (this.#options.debug) console.log('[LSC] Connected.');
					this.#resetState();
					this.#state.isConnected = true;
					this.#idleTimers.forEach((timer) => { clearTimeout(timer); });
					this.#idleTimers.push(setTimeout(() => { this.#idle(); }, this.#timeToIdle));

					if (this.#options.authenticate) {
						this.#state.isAuthenticated = await this.#authenticate();
					}

					return resolve();
				});

				this.#socket.on('timeout', () => {
					console.warn('Socket connection timed-out.');
					this.disconnect();
				});

				this.#socket.on('data', async (data) => {
					// Don't process data when we're not expecting any.
					if (!this.#state.isListening) {
						return;
					}

					if (this.#options.debug) console.log('[LSC] Received data:', data);
					const array = Uint8Array.from(data);

					this.#idleTimers.forEach((timer) => { clearTimeout(timer); });
					this.#idleTimers.push(setTimeout(() => { this.#idle(); }, this.#timeToIdle));

					// Process an existing packet stream.
					if (this.#state.isReceivingStream) {
						if (this.#options.debug) console.log('[LSC] Received stream packet.');
						// Append all received packets to the same Buffer.
						this.#state.streamBuffer.append(array);
						// TODO: Figure out a definitive way to detect when a stream has ended.
					}

					// Detect the start of a packet stream.
					else if (array[0] === 0 && array[1] === 0) { // data[00 00 ...] Indicates the start of a packet stream.
						this.#state.isReceivingStream = true;
						if (this.#options.debug) console.log('[LSC] Packet stream started.');
						this.#state.streamBuffer.clear();
						this.#state.streamBuffer.append(array);
						this.#state.streamBuffer.advance(2);
					}

					// Process a single packet.
					else {
						const decoded = await this.#processPacket(array) ?? {};
						this.#state.globalResolver(decoded);
						// Prevent the global resolver from being called multiple times.
						this.#state.isListening = false;
						this.#state.globalResolver = () => {};
					}
				});
			} catch(error) {
				return reject(error);
			}
		});
	}

	/**
	 * Disconnect from the login server.
	 */
	async disconnect (): Promise<void> {
		this.#socket.end();
		this.#resetState();
	}

	#authenticate (): Promise<boolean> {
		return new Promise((resolve, reject) => {
			if (this.#options.debug) console.log('[LSC] Authenticating...');

			// Start the authentication sequence.
			const initialMessage = new Messages.GenericMessage(['1000bc0102009e04610b040189040c000000']);
			this.#socket.write(initialMessage.buffer, 'hex', () => {
				if (this.#options.debug) console.log('[AUTH] Auth request sent.');
			});

			// Listen for auth packets.
			this.#socket.on('data', async (data) => {
				if (!this.#state.authProgress.initial || !this.#state.authProgress.confirmation) {
					const decodedData = await this.#processPacket(Uint8Array.from(data));

					if (!decodedData) {
						resolve(false);
						return; // TODO: Error.
					}

					if ('0197' in decodedData && this.#credentials) { // 0197 = 'Auth Info'.
						// Acknowledge the server's auth info.
						const ackMessage = new Messages.GenericMessage(['12003a0001009e04610b04010000000000000000']);
						this.#socket.write(ackMessage.buffer, 'hex', () => {
							this.#state.authProgress.initial = true;
							if (this.#options.debug) console.log('[AUTH] Acknowledgement message sent.');
						});
					}
					else if ('003A' in decodedData && this.#credentials) { // 003A = 'Auth Info Confirmation'.
						this.#credentials.salt = new Uint8Array(decodedData['003A']['03E3']);
						const authMessage = new Messages.AuthenticationMessage(this.#credentials);
						if (this.#options.debug) console.log('[AUTH] Sending credentials...\n', authMessage);
						this.#socket.write(authMessage.buffer, 'hex', () => {
							this.#state.authProgress.confirmation = true;
							if (this.#options.debug) console.log('[AUTH] Credentials sent.');
						});
					}

					// TODO: Handle auth failure (server offline, incorrect credentials, etc).
				} else {
					return resolve(true);
				}
			});
		});
	}

	async send (message: Messages.GenericMessage, callback: Function): Promise<void> {
		this.#messageQueue.push({
			message,
			resolver: callback
		});
	}

	async #sendNextMessageInQueue (): Promise<void | Error> {
		const message = this.#messageQueue.shift();
		if (!message) {
			return new Error('Message queue is empty.');
		}

		this.#messageId++;
		this.#state.globalResolver = (decodedData: EnumTree): void => {
			message.resolver(decodedData);
		};
		this.#state.isListening = true;
		this.#socket.write(message.message.buffer, 'hex', (error) => {
			if (error) {
				if (this.#options.debug) console.log(`[LSC] Failed to send message #${this.#messageId}.`, error.message);
				return error;
			}
			if (this.#options.debug) console.log(`[LSC] Sent message #${this.#messageId}.`);
			return;
		});
	}

	async #flushStreamBuffer (): Promise<void> {
		// Flush the stream buffer.
		if (this.#state.streamBuffer.length > 0) {
			if (this.#options.debug) console.log('[LSC] Flushing stream buffer...');
			const enumTree = await this.#state.streamBuffer.parse();
			if (this.#options.debug) console.log('[LSC] Parsed:', enumTree);
			const decoder = new Decoder(enumTree, this.#options.decoder ?? {});
			const decodedData = decoder.decode();
			this.#state.globalResolver(decodedData);
			// Prevent the global resolver from being called multiple times.
			this.#state.isListening = false;
			this.#state.globalResolver = () => {};
			if (this.#options.debug) console.log('[LSC] Decoded:', decodedData);
			if (this.#options.debug) console.log('[LSC] End of stream data.');
		}
	}

	async #idle (): Promise<void> {
		this.#idleTimers.forEach((timer) => { clearTimeout(timer); });
		this.#state.isReceivingStream = false;
		await this.#flushStreamBuffer();
		this.#sendNextMessageInQueue();
	}

	fetch <T extends FetchableDataset> (dataset: T, ...data: (T extends 'GameServerInfo' ? [number] : [])): Promise<FetchType<T>> {
		return new Promise(async (resolve, reject) => {
			// Make sure we are already connected to the server.
			if (!this.#state.isConnected) {
				await this.connect();
				// Check if the connection was unsuccessful.
				if (!this.#state.isConnected) {
					return reject('Connection failed.');
				}
			}

			// Make sure we are already authenticated.
			if (!this.#state.isAuthenticated) {
				await this.#authenticate();
				// Check if the connection was unsuccessful.
				if (!this.#state.isAuthenticated) {
					return reject('Connection failed.');
				}
			}

			// Fetch the requested data from the connected server.
			switch (dataset) {
				case 'AccountData':
					if (!this.#state.accountData) {
						this.#state.globalResolver = (decodedData: EnumTree): void => {
							this.#state.accountData = new AccountData(decodedData);
							return resolve(this.#state.accountData as FetchType<T>);
						};
						this.#state.isListening = true;
					} else {
						return resolve(this.#state.accountData as FetchType<T>);
					}
				break;

				case 'OnlinePlayerList':
					{
						// Fetch the list of online game servers.
						const serverList = await this.fetch('GameServerList');
						const onlinePlayers = [] as Player[];
						for (const server of serverList) {
							if (server.id && typeof server.numberOfPlayers !== 'undefined' && server.numberOfPlayers > 0) {
								const serverInfo = await this.fetch('GameServerInfo', server.id);
								onlinePlayers.push(...serverInfo.players);
							}
						}
						return resolve(onlinePlayers as FetchType<T>);
					}

				case 'OnlinePlayerNumber':
					{
						// Fetch the list of online game servers.
						const serverList = await this.fetch('GameServerList');
						let onlinePlayers = 0;
						if (!serverList) {
							return resolve(onlinePlayers as FetchType<T>);
						}
						// Sum the number of players in each game server.
						serverList.forEach((server) => {
							onlinePlayers += server.numberOfPlayers ?? 0;
						});
						return resolve(onlinePlayers as FetchType<T>);
					}

				case 'GameServerList':
					this.send(
						new Messages.ServerListMessage(),
						(reply: EnumTree) => {
							if (!('00D5' in reply) || !('00E9' in reply['00D5'])) {
								return reject('Failed to fetch server list.');
							}
							const serverList = [] as GameServerInfo[];
							(reply['00D5']['00E9'] as EnumTree[]).forEach((server) => {
								serverList.push(new GameServerInfo(server));
							});
							return resolve(serverList as FetchType<T>);
						}
					);
					break;

				case 'GameServerInfo':
					if (typeof data[0] === undefined) {
						return reject('Invalid server ID.');
					}
					this.send(
						new Messages.ServerInfoMessage(Number(data[0])),
						(reply: EnumTree) => {
							return resolve(new GameServerInfo(reply) as FetchType<T>);
						}
					);
					break;

				case 'WatchNowList':
					this.send(
						new Messages.WatchNowMessage(),
						(reply: EnumTree) => {
							if (!('01B5' in reply) || !('06BB' in reply['01B5'])) {
								return reject('Failed to fetch watch-now list.');
							}
							const watchNowList = [] as WatchNowItem[];
							(reply['01B5']['06BB'] as EnumTree[]).forEach((item) => {
								watchNowList.push(new WatchNowItem(item));
							});
							return resolve(watchNowList as FetchType<T>);
						}
					);
					break;

				default:
					return reject('Invalid dataset.');
			}
		});
	}


	async #processPacket (packet: Uint8Array): Promise<{ [key: string]: any } | undefined> {
		// Verify the length of the packet.
		if (!verifyPacketLength(packet)) {
			if (!this.#options.processMalformedPackets) {
				console.warn(
					'Length of received data is invalid. Packet may be malformed.\n',
					packet
				);
				return;
			}
			console.warn('Length of received data is invalid. Packet may be malformed. Attempting to process anyway...');
		}

		// Parse the packet.
		const buffer = new Buffer(packet, this.#options.buffer);
		buffer.advance(2);
		const enumTree = await buffer.parse();
		const decoder = new Decoder(enumTree, this.#options.decoder);
		const decodedData = decoder.decode();
		return decodedData;
	}
}
