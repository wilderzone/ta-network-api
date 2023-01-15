import { EnumTree, Map, Region } from '../interfaces/index.js';
import { Player } from './Player.js';

export class GameServerInfo {
	id = undefined as number | undefined;
	name = undefined as string | undefined;
	messageOfTheDay = undefined as string | undefined;
	passwordRequired = undefined as boolean | undefined;
	map = undefined as Map | undefined;
	timeRemaining = undefined as number | undefined;
	scores = {
		bloodEagle: undefined as number | undefined,
		diamondSword: undefined as number | undefined
	};
	numberOfPlayers = undefined as number | undefined;
	maxNumberOfPlayers = undefined as number | undefined;
	officialRules = undefined as boolean | undefined;
	region = undefined as Region | undefined;
	rankRequirement = {
		min: undefined as number | undefined,
		max: undefined as number | undefined,
		limit: undefined as number | undefined
	};
	ip = undefined as string | undefined;
	players = [] as Player[];

	constructor (data: EnumTree) {
		let subData = data;

		if ('01C6' in data && '00E9' in data['01C6']) {
			subData = data['01C6']['00E9'][0];
		}

		this.id = subData['02C7'];
		this.name = subData['0300'];
		this.messageOfTheDay = subData['01A4'];
		this.passwordRequired = subData['069C'];
		this.map = subData['02B2'];
		this.timeRemaining = subData['02F4'];
		this.numberOfPlayers = subData['0343'];
		this.maxNumberOfPlayers = subData['02D6'];
		this.officialRules = subData['0703'];
		this.region = subData['0448'];
		this.rankRequirement.min = subData['0299'];
		this.rankRequirement.max = subData['0298'];
		this.rankRequirement.limit = subData['06BF'];
		this.ip = subData['0246'];

		if ('0132' in subData) {
			(subData['0132'] as EnumTree[]).forEach((player) => {
				this.players.push(new Player(player));
			});
		}
	}
}
