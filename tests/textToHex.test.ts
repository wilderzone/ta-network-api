import { performance } from 'perf_hooks';
import { textToHex } from '../functions/Utils.js';

const data = `!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstuvwxyz{|}~ Tribes`;

const expectedResult = `[33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,32,84,114,105,98,101,115]`;

// <Test>
const startTime = performance.now();
const array = textToHex(data);
const endTime = performance.now();
// </Test>

if (!array) {
	throw new Error('\x1b[31mOutput is null.\x1b[0m');
}

if (array.length !== data.length) {
	throw new Error(`\x1b[31mOutput has incorrect length. Expected ${data.length}, got ${array.length}.\x1b[0m`);
}

if (JSON.stringify([...array]) !== expectedResult) {
	throw new Error('\x1b[31mOutput value is incorrect.\x1b[0m');
}

console.log(`\x1b[32mPassed in ${(endTime - startTime).toFixed(3)}ms.\x1b[0m`);
