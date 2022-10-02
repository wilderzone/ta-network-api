# TA Network API

An open interface for fetching data from the Tribes: Ascend servers.

Please see the [wiki](https://github.com/wilderzone/ta-network-api/wiki) for a detailed breakdown of TA's network protocol.

###


API includes functionality for:  
- [x] Fetching basic player data (clan tag, XP, Gold, etc).
- [ ] Fetching server status data:
  - [ ] Players online.
  - [x] Servers online.
- [ ] Fetching player rank and statistics.
- [ ] A web interface for controlling game servers.

### Demo

This project is still in development. To test the current functionality, create a new TypeScript file containing:

```typescript
import { LoginServerConnection } from './index';

let credentials = {
	username: '<your-username>',
	passwordHash: '<your-password-hash>',
	salt: new Uint8Array()
};

const connection = new LoginServerConnection('hirez', credentials);

connection.connect();
```

Install dependencies with:
```
npm install
```

Run with:
```
npx ts-node test.ts
```

The API will connect to the specified login server using your credentials, proucing a log of the resulting conversation in the terminal.
