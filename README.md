# <img src="./logo.svg" style="width: 3em;"> TA Network API

![node tests](https://github.com/gigabyte5671/ta-network-api/actions/workflows/node-tests.yml/badge.svg?branch=main) [![npm version](https://badge.fury.io/js/ta-network-api.svg)](https://www.npmjs.com/package/ta-network-api)

An open interface for fetching data from the Tribes: Ascend servers.

Please see the [wiki](https://github.com/wilderzone/ta-network-api/wiki) for a detailed breakdown of TA's network protocol.

###


API includes functionality for:
- [x] Fetching basic player data (clan tag, XP, Gold, etc).
- [x] Fetching status data:
  - [x] Players online.
  - [x] Servers online.
- [ ] _(Coming soon)_ Fetching player statistics (midairs, caps, accolades, etc).


### Installation

Install TA Network API into your project with:
```
npm install ta-network-api
```


### Usage

To begin, import the `LoginServerConnection` class into your project:
```typescript
import { LoginServerConnection } from 'ta-network-api';
```

Create a new connection instance with:
```typescript
// Your login credentials:
let credentials = {
	username: '<your-username>',
	passwordHash: '<your-password-hash>',
	salt: new Uint8Array()
};

// Optional options:
let options = {
	authenticate: true,		// Tells the connection to attempt to automatically authenticate.
	debug: false,			// Tells the connection not to produce debugging output in the terminal.
	timeout: 15000,			// Allow the connection to idle for 15 seconds before timing out.

	buffer: {				// These options are passed through to the data Buffer.
		debug: false
	}

	decoder: {				// These options are passed through to the data Decoder.
		clean: true,		// Tells the Decoder to produce a clean output (remove empty enumfields, may improve performance).
		debug: false
	}
};

const connection = new LoginServerConnection('hirez', credentials, options);
```

Initiate the connection with:
```typescript
await connection.connect();
```

The API will connect to the specified login server using your credentials.


### Fetching Data

This is done by calling the connection's `fetch` method, and passing in the name of the dataset's endpoint. Currently available endpoints include:
- `AccountData`: Data about the currently authenticated TA account.
- `OnlinePlayerNumber`: The number of players who are currently in a match.
- `OnlinePlayerList`: A list of all players who are currently in a match.
- `GameServerList`: A list of the top 30 online game servers.
- `GameServerInfo`: Information about a specific game server (requires one argument).
- `WatchNowList`: A list of recommended TA videos and live streams.

The API uses an asynchronous syntax. This allows you to simply `await` any data that you want to retrieve:
```typescript
const result = await connection.fetch('OnlinePlayerList');
```

Some endpoints require extra information in order to fetch the correct data. TypeScript intellisense should tell you what data is required for each endpoint.
You can add any extra data as additional arguments to the `fetch` method:
```typescript
const serverId = 00000;
const result = await connection.fetch('GameServerInfo', serverId);
```


### Sending Data

`Messages` can be used to send data to the connected login server. To use this feature, import the `Messages` object into your project:
```typescript
import { Messages } from 'ta-network-api';
```

The API comes with a few handy message presets:
- AuthenticationMessage
  ```typescript
  let credentials = {
  	username: '<your-username>',
  	passwordHash: '<your-password-hash>',
  	salt: new Uint8Array(<your-session-salt>)
  };

  const message = new Messages.AuthenticationMessage(credentials);
  ```
- ServerListMessage
  ```typescript
  const message = new Messages.ServerListMessage();
  ```
- ServerInfoMessage
  ```typescript
  const serverId = 00000;
  const message = new Messages.ServerInfoMessage(serverId);
  ```
- DirectMessageMessage
  ```typescript
  const recipient = 'player-name';
  const content = 'Hello!';
  const message = new Messages.DirectMessageMessage(recipient, content);
  ```
- WatchNowMessage
  ```typescript
  const message = new Messages.WatchNowMessage();
  ```

Or you can also use the `GenericMessage` class to send raw data:
```typescript
// This class accepts an array of number arrays, Uint8Arrays, byte-like strings, or any combination of the three.
const message = new Messages.GenericMessage([
	[1, 23, 8, 74],				// number[]
	new Uint8Array([1, 23, 8, 74]),		// Uint8Array
	'0117084a'				// Byte-like string
]);
```

To send the message, call the connection's `send` method, passing in the message instance and a callback function.
```typescript
void connection.send(message, (data: any) => {
	// Do something awesome.
});
```


### Examples

Fetch a list of the top 30 online game servers:
```typescript
// Import TA Network API.
import { LoginServerConnection } from 'ta-network-api';

// Your account credentials for the login server.
let credentials = {
	username: '<your-username>',
	passwordHash: '<your-password-hash>',
	salt: new Uint8Array()
};

// Optional configuration for the login server connection.
let options = {
	authenticate: true,
	decoder: {
		clean: true
	}
};

// Create a new connection instance.
const connection = new LoginServerConnection('hirez', credentials, options);

// Initiate the connection with the server.
await connection.connect();

// Fetch the list of online game servers.
const servers = await connection.fetch('GameServerList');

console.log('Wow, look at all these servers!', servers);
```


Fetch a list of all players currently in-game:
```typescript
// Import TA Network API.
import { LoginServerConnection } from 'ta-network-api';

// Your account credentials for the login server.
let credentials = {
	username: '<your-username>',
	passwordHash: '<your-password-hash>',
	salt: new Uint8Array()
};

// Optional configuration for the login server connection.
let options = {
	authenticate: true,
	decoder: {
		clean: true
	}
};

// Create a new connection instance.
const connection = new LoginServerConnection('hirez', credentials, options);

// Initiate the connection with the server.
await connection.connect();

// Fetch the list of in-game players.
const players = await connection.fetch('OnlinePlayerList');

console.log('Wow, look at all these players!', players);
```

### Contribute
If you'd like to contribute to this project, please [submit an issue](https://github.com/wilderzone/ta-network-api/issues) or [create a pull request](https://github.com/wilderzone/ta-network-api/pulls).
All contributions are super welcome! :tada:
