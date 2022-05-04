from . import Buffer
from data.maps import MAP_NAMES_AND_TYPES


# Convert a string-byte buffer into UTF-8 text.
def DecodeUTF8Bytes(buffer):
	# Filter out any bytes that arent in the following array of valid UTF-8 bytes.
	valid_utf8_bytes = ['20','21','22','23','24','25','26','27','28','29','2A','2B','2C','2D','2E','2F','30','31','32','33','34','35','36','37','38','39','3A','3B','3C','3D','3E','3F','40','41','42','43','44','45','46','47','48','49','4A','4B','4C','4D','4E','4F','50','51','52','53','54','55','56','57','58','59','5A','5B','5C','5D','5E','5F','60','61','62','63','64','65','66','67','68','69','6A','6B','6C','6D','6E','6F','70','71','72','73','74','75','76','77','78','79','7A','7B','7C','7D','7E']
	filtered_buffer = ''
	error_bytes = []
	i = 0
	while i < len(buffer):
		byte = buffer[i + Buffer.Bytes(0):i + Buffer.Bytes(1)] # UTF-8 characters are represented by 1 byte each. A string of characters can be any length of these bytes.
		if byte not in valid_utf8_bytes:
			error_bytes.append(byte)
			filtered_buffer += '3F' # Replace with a question mark
		else:
			filtered_buffer += byte
		i += Buffer.Bytes(1)
	if len(error_bytes) > 0:
		print("The following non-UTF-8 bytes weren't parsed: ")
		print(error_bytes)
	return bytes.fromhex(filtered_buffer).decode('utf-8')


# Decode a string-byte buffer based on its enumfield type.
def DecodeByType(buffer, type):
	if type == 'String':
		return DecodeUTF8Bytes(buffer)
	elif type == 'Integer':																											# [ 2138  0159 ]  Integers are represented by 4 bytes, with the high bytes on the right and the low bytes one the left.
		return str(int(Buffer.InvertEndianness(buffer[Buffer.Bytes(2):]) + Buffer.InvertEndianness(buffer[:Buffer.Bytes(2)]), 16))	#    |<---->|     These byte pairs must be swapped before they can be read as a normal integer.
	elif type == 'MapID':
		return MAP_NAMES_AND_TYPES.get(str(int(buffer[Buffer.Bytes(2):] + buffer[:Buffer.Bytes(2)], 16)), buffer)[0]
	elif type == 'IP':
		ub = buffer[:Buffer.Bytes(2)] # First two bytes are unknown.
		port = str(int(buffer[Buffer.Bytes(2):Buffer.Bytes(4)], 16)) # The next two bytes represent the port number as a big-endian integer.
		ip = str(int(buffer[Buffer.Bytes(4):Buffer.Bytes(5)], 16)) + '.' + str(int(buffer[Buffer.Bytes(5):Buffer.Bytes(6)], 16)) + '.' + str(int(buffer[Buffer.Bytes(6):Buffer.Bytes(7)], 16)) + '.' + str(int(buffer[Buffer.Bytes(7):Buffer.Bytes(8)], 16)) # Each following byte is one integer in the IP address.
		return '(' + ub + ') ' + ip + ':' + port


def DecodeEnumBlockArray(buffer, type):
	output = [[], 0]
	if type == 'ServerList':
		block_array_buffer = Buffer.Read(buffer, 6)
		block_array_enum = block_array_buffer[0][:Buffer.Bytes(2)]
		block_array_extra = block_array_buffer[0][Buffer.Bytes(2):Buffer.Bytes(4)]
		delimiter = block_array_buffer[0][Buffer.Bytes(4):Buffer.Bytes(6)]
		block_array_buffer = block_array_buffer[1]

		while delimiter == '2000':
			# Decode the data for each server.
			new_server = {
				'ID': '',
				'Region': '',
				'Password': False,
				'PlayerNum': '',
				'Name': '',
				'MOTD': '',
				'Map': '',
				'IP': ''
			}

			data = Buffer.ReadBuffer(block_array_buffer, '2000')
			block_length = data[1]
			new_server = data[0]

			output[0].append(new_server)
			# Move to the next block.
			block_array_buffer = Buffer.Read(block_array_buffer, block_length)[1]
			delimiter = Buffer.Read(block_array_buffer, 2)[0]
			block_array_buffer = Buffer.Read(block_array_buffer, 2)[1]
	
	return output



# Server list enum block array format:

# ENUM: 00E9
# Followed by 2 bytes
# Repeating:
#	20 00
#	[0385] -> 4 Bytes
#	[06EE] -> 4 Bytes
#	[02C7] -> 4 Bytes (Server ID)
#	[0008] -> 8 Bytes
#	[02FF] -> 4 Bytes
#	[02ED] -> 4 Bytes
#	[02D8] -> 4 Bytes
#	[02EC] -> 4 Bytes
#	[02D7] -> 4 Bytes
#	[02AF] -> Sized
#	[0013] -> Sized
#	[00AA] -> Sized
#	[01A6] -> Sized
#	[06F1] -> 4 Bytes
#	[0703] -> 1 Byte
#	[0343] -> 4 Bytes (Number of Players)
#	[0344] -> 4 Bytes
#	[0259] -> 4 Bytes
#	[03FD] -> 4 Bytes
#	[02B3] -> 4 Bytes
#	[0448] -> 4 Bytes (Region ID)
#	[02D6] -> 4 Bytes
#	[06F5] -> 4 Bytes
#	[0299] -> 4 Bytes
#	[0298] -> 4 Bytes
#	[06BF] -> 4 Bytes
#	[069C] -> 1 Byte (Password Required)
#	[069B] -> 1 Byte (Always 0000)
#	[0300] -> Sized (Server Name)
#	[01A4] -> Sized (MOTD)
#	[02B2] -> 4 Bytes (Map ID)

# The following sometimes occurs.
#	[02B5] -> 7e918900 4703 02000000 f402 d9040000 3500 0000 0000 9701 0000 0000
#		[02F4] -> 4 Bytes (Remaining Time in Seconds)

#	[0246] -> 8 Bytes (Server Address)
# End
# [069F] -> 4 Bytes
# [0347] -> 4 Bytes
# 06 00 00 00 2B 00 00 00
