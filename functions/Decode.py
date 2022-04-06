from . import Buffer
from data.maps import MAP_NAMES_AND_TYPES


# Convert a string-byte buffer into UTF-8 text.
def DecodeUTF8Bytes(buffer):
	utf8_bytes = []
	i = 0
	while i < len(buffer):																										# UTF-8 characters are represented by 1 byte each. A string of characters can be any length of these bytes.
		utf8_bytes.append(buffer[i + Buffer.Bytes(1):i + Buffer.Bytes(2)] + buffer[i + Buffer.Bytes(0):i + Buffer.Bytes(1)])	# [ 69 47 61 67 ]  However, every pair of bytes is swapped. This must be reversed again before decoding.
		i += Buffer.Bytes(2)																									#   |<->| |<->|
	output = ''
	# Filter out any bytes that arent in the following array of valid UTF-8 bytes.
	filter_bytes = ['20','21','22','23','24','25','26','27','28','29','2A','2B','2C','2D','2E','2F','30','31','32','33','34','35','36','37','38','39','3A','3B','3C','3D','3E','3F','40','41','42','43','44','45','46','47','48','49','4A','4B','4C','4D','4E','4F','50','51','52','53','54','55','56','57','58','59','5A','5B','5C','5D','5E','5F','60','61','62','63','64','65','66','67','68','69','6A','6B','6C','6D','6E','6F','70','71','72','73','74','75','76','77','78','79','7A','7B','7C','7D','7E']
	good_bytes = ''
	error_bytes = []
	for byte in utf8_bytes:
		if byte.upper() not in filter_bytes:
			error_bytes.append(byte)
			good_bytes += '3F' # Replace with a question mark
		else:
			good_bytes += byte
	utf8_bytes = good_bytes
	if len(error_bytes) > 0:
		print("The following non-UTF-8 bytes weren't parsed: ")
		print(error_bytes)
	try:
		output = bytes.fromhex(utf8_bytes).decode('utf-8')
	except UnicodeDecodeError:
		print('UTF-8 decoding failed on bytes: ' + utf8_bytes + '.')
	return output


# Decode a string-byte buffer based on its enumfield type.
def DecodeByType(buffer, type):
	if type == 'String':
		return DecodeUTF8Bytes(buffer)
	elif type == 'Integer':																# [ 2138  0159 ]  Integers are represented by 4 bytes, with the high bytes on the right and the low bytes one the left.
		return str(int(buffer[Buffer.Bytes(2):] + buffer[:Buffer.Bytes(2)], 16))		#    |<---->|     These byte pairs must be swapped before they can be read as a normal integer.
	elif type == 'MapID':
		return MAP_NAMES_AND_TYPES.get(str(int(buffer[Buffer.Bytes(2):] + buffer[:Buffer.Bytes(2)], 16)), buffer)[0]
