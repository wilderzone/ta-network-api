import base64
import gevent
import socket
import json
import time
import struct
import itertools
import codecs
from enumfields import ENUMFIELDS


data = {
	'buffer': '',
	'unpacked': [],
	'decoded': {
		'unknowns': []
	}
}


def connect(opts):
	with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
		# Establish a TCP connection with the server
		s.connect((opts['login_server']['ip'], opts['login_server']['port']))

		# Request a login portal
		s.send(bytes.fromhex('1000bc0102009e04610b040189040c000000'))

		# Server version
		data['buffer'] += unpack_bytes(s.recv(24))
		read_buffer()
		decode_unpacked_buffer()

		# Store the salt bytes returned by the server
		salt = s.recv(44)
		data['buffer'] += unpack_bytes(salt)
		read_buffer()
		decode_unpacked_buffer()
		salt = salt[14:30]

		# Confirm that the salt was recieved
		s.send(bytes.fromhex('12003a0001009e04610b04010000000000000000'))

		# Salt confirmation from server
		salt_confrmation = s.recv(48)

		# Construct the login message
		xor_hash = xor_password_hash(base64.b64decode(opts['hash']), salt)
		print(len(xor_hash))
		message = bytes.fromhex('b9003a000b00560060000000') + xor_hash + bytes.fromhex('94040c00') + bytes.fromhex(opts['user'].encode('utf-8').hex()) + bytes.fromhex('7106432800007206000000007306017706c3ee58437606d13f00007406de1000007506811b0000340400000000000000009e04610b04010000000000000000')
		s.send(message)

		# Receive account data
		data['buffer'] += unpack_bytes(s.recv(1440))
		data['buffer'] += unpack_bytes(s.recv(12))

		read_buffer()
		decode_unpacked_buffer()
		print(data['decoded'])

		# data['buffer'] += unpack_bytes(s.recv(10485760))
		# data['buffer'] += unpack_bytes(s.recv(10485760))

		# Request the server list
		# s.send(bytes.fromhex('1600d5000200280202000000e90000002d0000002e000000'))
		# s.send(bytes.fromhex('1600d5000200280202000000e90000002b0000002d000000'))
		# s.send(bytes.fromhex('1600d5000200280202000000e9000000260000002c000000'))

		return 'Done.'


def unpack_bytes(hex_buffer):
	output = ''
	i = 0
	while i < len(hex_buffer):
		unpacked = str(hex( struct.unpack('<H', hex_buffer[i:i + 2])[0] )[2:])
		if len(unpacked) == 1:
			unpacked = '000' + unpacked
		elif len(unpacked) == 2:
			unpacked = '00' + unpacked
		elif len(unpacked) % 2 != 0:
			unpacked = '0' + unpacked
		output += unpacked
		i += 2
	return output


def read_buffer():
	l = len(data['buffer']) / 2
	output = []
	i = 1
	while i < l:
		enum = peek(data['buffer'], 2)
		enum = enum.upper()
		if enum in ENUMFIELDS:
			print(enum)
			if ENUMFIELDS[enum]['length'] == 'Sized':
				r = read(data['buffer'], 2 + 2)
				if r is not None:
					data['buffer'] = r[1]
					sized_length = struct.unpack('>H', bytes.fromhex(r[0][4:]))[0]
					r = read(data['buffer'], sized_length)
					if r is not None:
						data['buffer'] = r[1]
						name = ENUMFIELDS[enum]['name']
						if name == False:
							name = 'Unknown Field'
						if 'type' in ENUMFIELDS[enum] and ENUMFIELDS[enum]['type'] == 'String':
							output.append(name + ': ' + decode_utf8_bytes(r[0]))
						else:
							output.append(name + ': ' + r[0])
				else:
					sized_length = 0
				i += sized_length + 4
			else:
				r = read(data['buffer'], ENUMFIELDS[enum]['length'] + 2)
				if r is not None:
					data['buffer'] = r[1]
					name = ENUMFIELDS[enum]['name']
					if name == False:
						name = 'Unknown Field'
					output.append(name + ': ' + r[0][4:])
				i += ENUMFIELDS[enum]['length'] + 2
		else:
			r = read(data['buffer'], 2)
			if r is not None:
				data['buffer'] = r[1]
				output.append('Undef Field')
			i += 2
	data['unpacked'] += output


def decode_unpacked_buffer():
	for enumfield in data['unpacked']:
		if 'Unknown Field' in enumfield:
			data['decoded']['unknowns'].append(enumfield.split(': ')[1])
		elif enumfield != 'Undef Field':
			data['decoded'][enumfield.split(': ')[0]] = enumfield.split(': ')[1]
	data['buffer'] = ''

def decode_utf8_bytes(buffer):
	utf8_bytes = ''
	i = 0
	while i < len(buffer):
		utf8_bytes += buffer[i + 2:i + 4] + buffer[i:i + 2]
		i += 4
	return bytes.fromhex(utf8_bytes).decode('utf-8')

def peek(buffer, length):
	if(len(buffer) >= length * 2):
		return buffer[:length * 2]


def read(buffer, length):
	if(len(buffer) >= length * 2):
		return [buffer[:length * 2], buffer[length * 2:]]


def xor_password_hash(password_hash, salt):
	# Split the salt into groups of 4 bits
	salt_nibbles = []
	for value in salt:
		salt_nibbles.append(value >> 4)
		salt_nibbles.append(value & 0x0F)

	# Convert each nibble into an XOR value
	xor_values = [(value if value <= 9 else 0x47 + value) for value in salt_nibbles]

	# Create the XOR pattern from the list of values
	xor_pattern = [
		xor_values[6], 0,
		xor_values[7], 0,
		xor_values[4], 0,
		xor_values[5], 0,
		xor_values[2], 0,
		xor_values[3], 0,
		xor_values[0], 0,
		xor_values[1], 0,
		0, 0,
		xor_values[10], 0,
		xor_values[11], 0,
		xor_values[8], 0,
		xor_values[9], 0,
		0, 0,
		xor_values[14], 0,
		xor_values[15], 0,
		xor_values[12], 0,
		xor_values[13], 0,
		0, 0,
		xor_values[16], 0,
		xor_values[17], 0,
		xor_values[18], 0,
		xor_values[19], 0,
		0, 0,
		xor_values[20], 0,
		xor_values[21], 0,
		xor_values[22], 0,
		xor_values[23], 0,
		xor_values[24], 0,
		xor_values[25], 0,
		xor_values[26], 0,
		xor_values[27], 0,
		xor_values[28], 0,
		xor_values[29], 0,
		xor_values[30], 0,
		xor_values[31], 0,
	]

	# Execute the XOR pattern on the password hash
	xored_password_hash = [
		p ^ x for p, x in itertools.zip_longest(password_hash, xor_pattern, fillvalue = 0)
	]

	return bytes(xored_password_hash)

