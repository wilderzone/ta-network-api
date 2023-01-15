import { EnumTree, Region, UnlockableItem } from '../interfaces/index.js';

/**
 * Account data for the authenticated TA account.
 */
export class AccountData {
	id = undefined as number | undefined;
	name = undefined as string | undefined;
	clanTag = undefined as string | undefined;
	rank = undefined as number | undefined;
	rankProgress = undefined as number | undefined;
	xp = undefined as number | undefined;
	gold = undefined as number | undefined;
	region = undefined as Region | undefined;
	items = undefined as UnlockableItem[] | undefined;

	constructor (data: EnumTree) {
		if (!('003D' in data)) {
			return;
		}

		this.id = data['003D']['0348'];
		this.name = data['003D']['034A'];
		this.clanTag = data['003D']['06DE'];
		this.rank = data['003D']['0296'];
		this.rankProgress = data['003D']['05DC'];
		this.xp = data['003D']['04CB'];
		this.gold = data['003D']['05D3'];
		this.region = data['003D']['0448'];
	}
}
