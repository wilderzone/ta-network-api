import struct
from . import Decode
from data.enumfields import ENUMFIELDS


# Return a desired number of bytes as a number of characters.
def Bytes(number_of_bytes):
	return number_of_bytes * 2


# Return the first [length] bytes of a string-byte buffer without modifying the buffer.
def Peek(buffer, length):
	if(len(buffer) >= Bytes(length)):
		return buffer[:Bytes(length)] # Start of buffer ---> length.
	return buffer


# Return the first [length] bytes of a string-byte buffer. Also return the same buffer reduced by [length] bytes.
def Read(buffer, length):
	if(len(buffer) >= Bytes(length)):
		return [buffer[:Bytes(length)], buffer[Bytes(length):]] # [0] Start of buffer ---> length.
		                                                        # [1] Length          ---> end of buffer.
	return [buffer, '']


# Convert a bytes formatted buffer (b'\xAB\xCD') into a string-byte formatted buffer ('ABCD').
def UnpackBytes(hex_buffer):
	output = ''
	i = 0
	while i < len(hex_buffer): # i increases by 2, so for every pair of bytes ('\xAB\xCD').
		if hex_buffer[i:i + 2]:
			try:
				unpacked = str(
					hex(
						struct.unpack('<H', hex_buffer[i:i + 2])[0] # [0] returns the integer value of the byte pair.
					)[2:]                                           # Hex returns the byte representation (but not b'') of the integer prepended by '0x', so we strip that off the front with [2:].
				)                                                   # Ensure that this all returns a string.
				# Zero-pad to ensure that the unpacked byte pair is signed 2's complement.
				zero_pad = ['', '000', '00', '0', '']
				output += zero_pad[len(unpacked)] + unpacked
			except struct.error: # This can occur if struct.unpack was passed a length other than exactly 2 bytes.
				print('struct.unpack failed on: ' + hex_buffer[i:i + 2])
		i += 2
	return output


def ReadBuffer(buffer):
	l = len(buffer) / 2 # The buffer is formatted as string-bytes ('ABCD'), so the actual length in bytes is half the string length.
	output = []
	i = 0
	while i < l:
		# Peek at the enumerator of the current field.
		enum = Peek(buffer, 2)
		enum = enum.upper()
		# Process the enumerated data if we have a reference for the enumerator.
		if enum in ENUMFIELDS:
			if ENUMFIELDS[enum]['length'] == 'Sized':
				r = Read(buffer, 2 + 2) # Read the size of the data field. (2-byte enumerator + 2-byte size indicator).
				if r is not None:
					buffer = r[1]
					sized_length = struct.unpack('>H', bytes.fromhex(r[0][Bytes(2):]))[0] # The size indicator is a big-endian encoded integer representing the number of bytes in the data field. We use struct.unpack to convert this from string-bytes ('000C') to an integer (12).
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
			r = Read(buffer, Bytes(1))
			if r is not None:
				buffer = r[1]
				output.append('Undef Field')
			i += 2
	return output