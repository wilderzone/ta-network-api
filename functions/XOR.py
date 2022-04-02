import itertools


def XORPasswordHash(password_hash, salt):
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
