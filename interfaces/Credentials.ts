export interface Credentials {
	username: string,
	password: string
}

export interface HashedCredentials {
	username: string,
	passwordHash: Uint8Array,
	salt: Uint8Array
}
