
var pruss = require('../lib/pru'), assert = require('assert');

assert.ok(pruss.prus.length > 0);

var pru = pruss.prus[0];
pru.enabled = false;
pru.reset();
[ 0x20000, 0x48040000, 0x4802A000, 0x30000, 0x26000 ].forEach(function(val, i) {
	assert.strictEqual(val, pru['c'+i]);
})