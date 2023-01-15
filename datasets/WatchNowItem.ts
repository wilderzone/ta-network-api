import { EnumTree, WatchNowSection } from '../interfaces/index.js';

export class WatchNowItem {
	id = undefined as number | undefined;
	section = undefined as WatchNowSection | undefined;
	name = undefined as string | undefined;
	link = undefined as string | undefined;
	featured = undefined as boolean | undefined;
	official = undefined as boolean | undefined;

	constructor (data: EnumTree) {
		this.id = data['06B7'];
		this.section = data['06B9'];
		this.name = data['02FE'];
		this.link = data['06B8'];
		this.featured = data['06BA'];
		this.official = data['0013'];
	}
}
