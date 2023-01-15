export interface Item {
	key: string,
	name: string,
	class?: string,
	type: string,
	category?: string
}

export interface UnlockableItem extends Item {
	id: number,
	purchaseIndex: number,
	unlocked: boolean
}
