# TA Network API

An open interface for fetching data from the Tribes: Ascend servers.

Please see the [wiki](https://github.com/wilderzone/ta-network-api/wiki) for a detailed breakdown of TA's network protocol.

###


API includes functionality for:  
- [x] Fetching basic player data (clan tag, XP, Gold, etc).
- [x] Fetching server status data:
  - [x] Players online.
  - [x] Servers online.
- [ ] Fetching player rank and statistics.
- [ ] A web interface for controlling game servers.


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
let credentials = {
	username: '<your-username>',
	passwordHash: '<your-password-hash>',
	salt: new Uint8Array()
};

const connection = new LoginServerConnection('hirez', credentials);
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
	// Do something.
});
```

Events include:
- `connect`: Fired after a stable connection with the server has been established.
- `disconnect`: Fired after the connection with the server has closed.
- `send`:
- `receive`: Fired whenever the connection receives some data from the server. The data received (in the form of an EnumTree) is passed to any callbacks registered to this listener.


### Examples

Request a list of the top 30 online game servers and output the results to a JSON file:
```typescript
import { LoginServerConnection, GenericMessage, EnumTree } from 'ta-network-api';
const fs = require('fs');

let credentials = {
	username: '<your-username>',
	passwordHash: '<your-password-hash>',
	salt: new Uint8Array()
};

const connection = new LoginServerConnection('hirez', credentials);

connection.on('receive', (data: EnumTree) => {
	const path = 'results/';
	const date = new Date();
	const time = new Date(date.getTime() - (date.getTimezoneOffset() * 60 * 1000)).toISOString().split(':').join('-').split('.').join('-').split('Z')[0];
	const fileName = `output-${time}.json`;
	fs.writeFile(path + fileName, JSON.stringify(data, null, 4), 'utf8', function (err: any) {
		if (err) {
			console.log("An error occured while writing JSON Object to File.");
			return console.log(err);
		}
		console.log("JSON file has been saved.");
	});
});

connection.connect();

connection.queue(new GenericMessage(['1600d5000200280202000000e90000002b0000002d000000']));

```
