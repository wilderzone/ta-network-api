import struct
from . import Decode
from data.enumfields import ENUMFIELDS


# Return a desired number of bytes as a number of characters.
def Bytes(number_of_bytes):
	return number_of_bytes * 2


# Return the first [length] bytes of a string-byte buffer without modifying the buffer.
def Peek(buffer, length):
	if(len(buffer) >= Bytes(length)):
		return buffer[:Bytes(length)]
	return buffer


# Return the first [length] bytes of a string-byte buffer. Also return the same buffer reduced by [length] bytes.
def Read(buffer, length):
	if(len(buffer) >= Bytes(length)):
		return [buffer[:Bytes(length)], buffer[Bytes(length):]]
	return [buffer, '']


# Convert a bytes formatted buffer (b'\xAB\xCD') into a string-byte formatted buffer ('ABCD').
def UnpackBytes(hex_buffer):
	output = ''
	i = 0
	while i < len(hex_buffer):
		if hex_buffer[i:i + 2]:
			try:
				unpacked = str(hex( struct.unpack('<H', hex_buffer[i:i + 2])[0] )[2:])
				if len(unpacked) == 1:
					unpacked = '000' + unpacked
				elif len(unpacked) == 2:
					unpacked = '00' + unpacked
				elif len(unpacked) % 2 != 0:
					unpacked = '0' + unpacked
				output += unpacked
			except struct.error:
				print('struct.unpack failed on: ' + hex_buffer[i:i + 2])
		i += 2
	return output


def ReadBuffer(buffer):
	l = len(buffer) / 2
	output = []
	i = 1
	while i < l:
		enum = Peek(buffer, 2)
		enum = enum.upper()
		if enum in ENUMFIELDS:
			if ENUMFIELDS[enum]['length'] == 'Sized':
				r = Read(buffer, 2 + 2)
				if r is not None:
					buffer = r[1]
					sized_length = struct.unpack('>H', bytes.fromhex(r[0][4:]))[0]
					r = Read(buffer, sized_length)
					if r is not None:
						buffer = r[1]
						name = ENUMFIELDS[enum]['name']
						if name == False:
							name = 'Unknown Field'
						if 'type' in ENUMFIELDS[enum]:
							output.append(name + ': ' + Decode.DecodeByType(r[0], ENUMFIELDS[enum]['type']))
						else:
							output.append(name + ': ' + r[0])
				else:
					sized_length = 0
				i += sized_length + 4
			else:
				r = Read(buffer, ENUMFIELDS[enum]['length'] + 2)
				if r is not None:
					buffer = r[1]
					name = ENUMFIELDS[enum]['name']
					if name == False:
						name = 'Unknown Field'
					if 'type' in ENUMFIELDS[enum]:
						output.append(name + ': ' + Decode.DecodeByType(r[0][4:], ENUMFIELDS[enum]['type']))
					else:
						output.append(name + ': ' + r[0][4:])
				i += ENUMFIELDS[enum]['length'] + 2
		else:
			r = Read(buffer, 2)
			if r is not None:
				buffer = r[1]
				output.append('Undef Field')
			i += 2
	return output