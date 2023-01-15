import { AccountData } from './AccountData.js';
export { AccountData } from './AccountData.js';
import { Player } from './Player.js';
export { Player } from './Player.js';
import { GameServerInfo } from './GameServerInfo.js';
export { GameServerInfo } from './GameServerInfo.js';
import { WatchNowItem } from './WatchNowItem.js';
export { WatchNowItem } from './WatchNowItem.js';

export type FetchableDataset =
	'AccountData'
	| 'OnlinePlayerList'
	| 'OnlinePlayerNumber'
	| 'GameServerList'
	| 'GameServerInfo'
	| 'WatchNowList';

export type FetchType<T> =
	T extends 'AccountData' ? AccountData :
	T extends 'OnlinePlayerList' ? Player[] :
	T extends 'OnlinePlayerNumber' ? number :
	T extends 'GameServerInfo' ? GameServerInfo :
	T extends 'GameServerList' ? GameServerInfo[] :
	T extends 'WatchNowList' ? WatchNowItem[] :
	never;

export type ListenableDatasets = 'PlayerOnlineNotification';

export interface PlayerOnlineNotification {
	id: number,
	name: string,
	rank: number
}
