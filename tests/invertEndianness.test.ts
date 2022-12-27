import { performance } from 'perf_hooks';
import { invertEndianness } from '../functions/Utils.js';

const data = Uint8Array.from([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]);

const expectedResult = `[1,0,3,2,5,4,7,6,9,8,11,10,13,12,15,14,17,16,19,18,21,20,23,22,25,24,27,26,29,28,31,30,33,32,35,34,37,36,39,38,0,40]`;

// <Test>
const startTime = performance.now();
const array = invertEndianness(data);
const endTime = performance.now();
// </Test>

if (!array) {
	throw new Error('Output is null.');
}

if (array.length !== data.length + 1) {
	throw new Error(`Output has incorrect length. Expected ${data.length + 1}, got ${array.length}.`);
}

if (JSON.stringify([...array]) !== expectedResult) {
	throw new Error('Output value is incorrect.');
}

console.log(`Passed in ${(endTime - startTime).toFixed(3)}ms.`);
