import { EnumTree, Region } from '../interfaces/index.js';

/**
 * Account data for the authenticated TA account.
 */
export class Player {
	id = undefined as number | undefined;
	name = undefined as string | undefined;
	clanTag = undefined as string | undefined;
	rank = undefined as number | undefined;
	region = undefined as Region | undefined;
	team = undefined as number | undefined;

	constructor (data: EnumTree) {
		this.id = data['0348'];
		this.name = data['034A'];
		this.clanTag = data['003D'];
		this.rank = data['0296'];
		this.region = data['003D'];
		this.team = data['0452'];
	}
}
