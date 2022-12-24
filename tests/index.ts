import { execSync } from 'child_process';

// Utility functions:

console.log('Testing hexToString...');
execSync('node dist/tests/hexToString.test.js', {stdio: 'inherit'});

console.log('Testing stringToHex...');
execSync('node dist/tests/stringToHex.test.js', {stdio: 'inherit'});

console.log('Testing textToHex...');
execSync('node dist/tests/textToHex.test.js', {stdio: 'inherit'});

console.log('Testing invertEndianness...');
execSync('node dist/tests/invertEndianness.test.js', {stdio: 'inherit'});
