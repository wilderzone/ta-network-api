import { generalEnumfields } from '../data/index.js';

export interface EnumTree {
	[key: keyof typeof generalEnumfields]: any
}
