export type WatchNowSection = 'HiRez News' | 'Twitch' | 'Training' | 'Community' | 'Ticker';

export interface WatchNowItem {
	id: number,
	section: WatchNowSection,
	name: string,
	link: string,
	featured: boolean
}
