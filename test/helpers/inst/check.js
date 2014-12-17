
var assert = require('assert');

function check(mnemonic, encoded, decoded) {
	if (typeof mnemonic !== 'string') throw new TypeError('Must supply valid mnemonic.');
	if (typeof decoded !== 'object') throw new TypeError('Must supply valid decoded object.');
	if (typeof encoded === 'number') {
		var tmp = new Buffer(4);
		tmp.writeUInt32BE(encoded, 0);
		encoded = tmp;
	}
	else if (Array.isArray(encoded)) {
		encoded = new Buffer(encoded);
	}
	if (!Buffer.isBuffer(encoded)) throw new TypeError();

	return function() {
		it('should disassemble properly', function() {
			var instance = S.disassemble(encoded);
			for (var key in decoded)
				assert.deepEqual(instance[key], decoded[key], 'Decoded instruction has incorrect property '+key+'; expected: '+decoded[key]+', got '+instance[key]+'.');
		});
		it('should assemble properly', function() {
			var result = new Buffer(4);
			result[0] = result[1] = result[2] = result[3] = 0;
			var instance = S.instruction(mnemonic, decoded), value = instance.encode(result);
			assert.strictEqual(value, check, 'Assembled instruction mismatch '+instance.instruction+'; expected: '+util.inspect(encoded)+'; got: '+util.inspect(value)+'.');
		})
	}
}
