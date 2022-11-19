# <img src="./logo.svg" style="width: 3em;"> TA Network API

An open interface for fetching data from the Tribes: Ascend servers.

Please see the [wiki](https://github.com/wilderzone/ta-network-api/wiki) for a detailed breakdown of TA's network protocol.

###


API includes functionality for:
- [x] Fetching basic player data (clan tag, XP, Gold, etc).
- [x] Fetching server status data:
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
	decoder: {				// These options are passed through to the data Decoder.
		clean: true			// Tells the Decoder to produce a clean output.
	}
};

const connection = new LoginServerConnection('hirez', credentials, options);
```

Initiate the connection with the login server with:
```typescript
connection.connect();
```

The API will connect to the specified login server using your credentials, proucing a log of the resulting conversation in the terminal.


### Event Listeners

You can use the `on(event, callback)` method to register an event listener with the login server connection. (Multiple callbacks can be attached to a single event).

```typescript
connection.on('receive', (data: EnumTree) => {
	// Do something awesome.
});
```

Events include:
- `connect`: Fired after a stable connection with the server has been established.
- `disconnect`: Fired after the connection with the server has closed.
- `receive`: Fired whenever the connection receives some data from the server. The data received (in the form of an EnumTree) is passed to any callbacks registered to this listener.


### Messages

The API comes with some handy presets for sending data to the logon server:
- AuthMessage
  ```typescript
  let credentials = {
  	username: '<your-username>',
  	passwordHash: '<your-password-hash>',
  	salt: new Uint8Array(<your-session-salt>)
  };
  const message = new AuthMessage(credentials);
  ```
- ServerListMessage
  ```typescript
  const message = new ServerListMessage();
  ```
- WatchNowMessage
  ```typescript
  const message = new WatchNowMessage();
  ```

Or you can also use the `GenericMessage` class to send raw data:
```typescript
// This class accepts an array of number arrays, Uint8Arrays, byte-like strings, or any combination of the three.
const message = new GenericMessage([
	[1, 23, 8, 74],			// number[]
	new Uint8Array([1, 23, 8, 74]),	// Uint8Array
	'0117084a'			// Byte-like string
]);
```


### Examples

Request a list of the top 30 online game servers and output the results to a JSON file:
```typescript
// Import TA Network API classes so that we can connect to a login server, request a list of game servers, and process the returned data.
import { LoginServerConnection, ServerListMessage, EnumTree } from 'ta-network-api';
// Import Node's built-in "fs" module for interacting with the file system.
import fs from 'fs';

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

// Output to a JSON file whenever we receive some data from the server.
connection.on('receive', (data: EnumTree) => {
	// Get the current date and time.
	const date = new Date();
	const time = new Date(date.getTime() - (date.getTimezoneOffset() * 60 * 1000)).toISOString().split(':').join('-').split('.').join('-').split('Z')[0];

	// Name the output file.
	const path = 'results/';
	const fileName = `output-${time}.json`;

	// Save the output file.
	fs.writeFile(path + fileName, JSON.stringify(data, null, 4), 'utf8', function (err: any) {
		if (err) {
			console.log("An error occured while writing JSON Object to File.");
			return console.log(err);
		}
		console.log("JSON file has been saved.");
	});
});

// Initiate the connection with the server.
connection.connect();

// Queue the messages we want to send.
connection.queue(new ServerListMessage());
```
