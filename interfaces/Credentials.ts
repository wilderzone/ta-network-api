export interface Credentials {
	username: string,
	password: string
}

export interface HashedCredentials {
	username: string,
	passwordHash: string,
	salt: Uint8Array
}
