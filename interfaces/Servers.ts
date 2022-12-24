import { Player } from './Data.js'

export interface LoginServer {
	name: string,
	ip: string,
	port: number,
	isLoginServer: true,
	supportsGOTY: boolean,
	supportsOOTB: boolean,
	isSecure: boolean
}

export interface GameServer {
	id: Uint8Array,
	name: string,
	motd: string,
	password: boolean,
	players: Player[],
	ip: string,
	region: Uint8Array,
	map: Uint8Array,
	isLoginServer: false,
	supportsGOTY: boolean,
	supportsOOTB: boolean,
	isSecure: boolean
}
