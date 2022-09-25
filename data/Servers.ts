import { Server } from '../interfaces';

/**
 * All default login servers.
 */
export const loginServers = {
	hirez: {
		name: 'HiRez Login Server',
		ip: '45.79.222.67',
		port: 9000,
		isLoginServer: true,
		supportsGOTY: false,
		supportsOOTB: true,
		isSecure: false
	} as Server,
	community: {
		name: 'Community Login Server',
		ip: '18.197.240.229',
		port: 9000,
		isLoginServer: true,
		supportsGOTY: true,
		supportsOOTB: true,
		isSecure: true
	} as Server
};

export class LoginServer {
	name = '';
	ip = '';
	port = 9000;
	isLoginServer = true;
	supportsGOTY = false;
	supportsOOTB = false;
	isSecure = false;

	constructor (
		name: string,
		address: string,
		supportsGOTY: boolean,
		supportsOOTB: boolean,
		isSecure: boolean
	) {
		this.name = name;
		this.ip = address.split(':')[0];
		this.port = address.split(':')[1] ? parseInt(address.split(':')[1]) : 9000;
		this.supportsGOTY = supportsGOTY;
		this.supportsOOTB = supportsOOTB;
		this.isSecure = isSecure;
	}
}
