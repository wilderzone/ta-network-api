const { execSync } = require('child_process');

// Utility functions:

console.log('Testing hexToString...');
execSync('npx ts-node tests/hexToString.test.ts', {stdio: 'inherit'});

console.log('Testing stringToHex...');
execSync('npx ts-node tests/stringToHex.test.ts', {stdio: 'inherit'});
