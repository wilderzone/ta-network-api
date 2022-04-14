import base64
import socket
import functions.Buffer
import functions.Decode
import functions.XOR


data = {
	'buffer': '',
	'unpacked': [],
	'decoded': {
		'unknowns': []
	}
}


def connect(opts):
	with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
		# Set socket options
		s.settimeout(2.0)
		s_keep_alive = s.getsockopt(socket.SOL_SOCKET, socket.SO_KEEPALIVE)
		if(s_keep_alive == 0):
			s_keep_alive = s.setsockopt( socket.SOL_SOCKET, socket.SO_KEEPALIVE, 1)


		# Establish a TCP connection with the server
		s.connect((opts['login_server']['ip'], opts['login_server']['port']))

		# Request a login portal
		s.send(bytes.fromhex('1000bc0102009e04610b040189040c000000'))

		# Server version
		try:
			data['buffer'] += functions.Buffer.UnpackBytes(s.recv(24))
		except socket.timeout:
			return 'Login server is offline.'
		data['unpacked'] += functions.Buffer.ReadBuffer(data['buffer'])
		DecodeUnpackedBuffer()

		# Store the salt bytes returned by the server
		salt = s.recv(44)
		data['buffer'] += functions.Buffer.UnpackBytes(salt)
		data['unpacked'] += functions.Buffer.ReadBuffer(data['buffer'])
		DecodeUnpackedBuffer()
		salt = salt[14:30]

		# Confirm that the salt was recieved
		s.send(bytes.fromhex('12003a0001009e04610b04010000000000000000'))

		# Salt confirmation from server
		salt_confrmation = s.recv(48)

		# Construct the login message
		xor_hash = functions.XOR.XORPasswordHash(base64.b64decode(opts['hash']), salt)
		message = bytes.fromhex('b9003a000b00560060000000') + xor_hash + bytes.fromhex('94040c00') + bytes.fromhex(opts['user'].encode('utf-8').hex()) + bytes.fromhex('7106432800007206000000007306017706c3ee58437606d13f00007406de1000007506811b0000340400000000000000009e04610b04010000000000000000')
		s.send(message)

		# Receive account data
		data['buffer'] += functions.Buffer.UnpackBytes(s.recv(1440))
		if len(data['buffer']) <= functions.Buffer.Bytes(68):
			return 'Incorrect credentials, or the login server is offline.'
		data['buffer'] += functions.Buffer.UnpackBytes(s.recv(12))
		while True:
			try:
				data['buffer'] += functions.Buffer.UnpackBytes(s.recv(1440))

			except socket.timeout:
				print('Received account data.')
				break

			except:
				print('An unknown error occurred.')
				break

		data['unpacked'] += functions.Buffer.ReadBuffer(data['buffer'])
		DecodeUnpackedBuffer()

		# Request the server list
		# s.send(bytes.fromhex('1600d5000200280202000000e90000001700000015000000'))
		# s.send(bytes.fromhex('1600d5000200280202000000e90000002d0000002e000000'))
		s.send(bytes.fromhex('1600d5000200280202000000e90000002b0000002d000000'))
		# s.send(bytes.fromhex('1600d5000200280202000000e9000000260000002c000000'))
		# s.send(bytes.fromhex('1600d5000200280202000000e90000002b00000028000000'))

		while True:
			try:
				data['buffer'] += functions.Buffer.UnpackBytes(s.recv(1440))

			except socket.timeout:
				print('Received server list.')
				break

			except:
				print('An unknown error occurred.')
				break

		data['unpacked'] += functions.Buffer.ReadBuffer(data['buffer'])
		DecodeUnpackedBuffer()

		return data['decoded']


def DecodeUnpackedBuffer():
	for enumfield in data['unpacked']:
		if 'Unknown Field' in enumfield:
			# data['decoded']['unknowns'].append(enumfield.split(': ')[1])
			data['decoded']['unknowns'] = []
		elif enumfield != 'Undef Field':
			if enumfield.split(': ')[0] in data['decoded']:
				if enumfield.split(': ')[1] not in data['decoded'][enumfield.split(': ')[0]]:
					data['decoded'][enumfield.split(': ')[0]].append(enumfield.split(': ')[1])
			else:
				data['decoded'][enumfield.split(': ')[0]] = [enumfield.split(': ')[1]]
	data['buffer'] = ''