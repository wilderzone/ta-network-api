# TA Network API

An open interface for fetching data from the Tribes: Ascend servers.

###


Includes:
- Fetching status data:
  - Players online.
  - Servers online.
- Fetching player rank and statistics.
- A web interface for controlling game servers.

### Demo

This project is still deep in development, so the API is not very accessible yet. However, to test the current functionality, create a new Python script containing something like:

```python
import network_api

API_CONFIG = {
	'login_server': {
		'ip': '45.79.222.67',
		'port': 9000
	},
	'credentials': {
		'user': 'your_user_name',
		'hash': 'your_password_hash'
	}
}

print(
	network_api.connect({
		'login_server': API_CONFIG['login_server'],
		'user': API_CONFIG['credentials']['user'],
		'hash': API_CONFIG['credentials']['hash']
	})
)
```