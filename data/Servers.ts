import type { LoginServer } from '../interfaces/index.js';

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
	} as LoginServer,
	community: {
		name: 'Community Login Server',
		ip: '18.197.240.229',
		port: 9000,
		isLoginServer: true,
		supportsGOTY: true,
		supportsOOTB: true,
		isSecure: true
	} as LoginServer
};
