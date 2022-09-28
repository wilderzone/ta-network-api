import { generalEnumfields } from '../data';

export interface EnumTree {
	[key: keyof typeof generalEnumfields]: any
}
