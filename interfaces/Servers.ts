export interface Server {
	name: string,
	ip: string,
	port: number,
	isLoginServer: boolean,
	supportsGOTY: boolean,
	supportsOOTB: boolean,
	isSecure: boolean
}
