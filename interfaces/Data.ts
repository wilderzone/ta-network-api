export interface Player {
	id: Uint8Array,
	username: string,
	playername: string,
	clanTag: string,
	rank: number
}

export interface HiRezAccount {
	version: Uint8Array
	salt: Uint8Array,
	username: string,
	playername: string,
	clanTag: string,
	rank: number,
	rankProgress: number,
	xp: number,
	gold: number,
	region: Uint8Array
}

export interface HiRezCustomGameServer {
	name: string,
	description: string,
	password: string,
	rankLimit?: {
		lower: number,
		upper: number
	}
}
