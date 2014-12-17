
var S = require('../lib/silicon').create(), assert = require('assert'), util = require('util');

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

describe('add', function() {
	describe('add r0, r0, #0xCC', check('add', 0x01cce0e0, { dst: S.r0, src: S.r0, imm: 0xCC }));
	describe('add r1, r0, #0x90', check('add', 0x0190e0e1, { dst: S.r1, src: S.r0, imm: 0x90 }));
	describe('add r0, r1, #0x35', check('add', 0x0135e1e0, { dst: S.r0, src: S.r1, imm: 0x35 }));
	describe('add r31, r25, #0x03', check('add', 0x0103f9ff, { dst: S.r31, src: S.r25, imm: 0x03 }));
	describe('add r31.w0, r25.w0, r26.w0', check('add', 0x009a999f, { dst: S.r31.w0, srcA:S.r25.w0,srcB:S.r26.w0 }));
	describe('add r31.w1, r25.w1, r26.w1', check('add', 0x00bab9bf, { dst: S.r31.w1, srcA:S.r25.w1,srcB:S.r26.w1 }));
	describe('add r31.w2, r25.w2, r26.w2', check('add', 0x00dad9df, { dst: S.r31.w2, srcA:S.r25.w2,srcB:S.r26.w2 }));
	describe('add r31.b0, r25.b0, r26.b0', check('add', 0x001a191f, { dst: S.r31.b0, srcA:S.r25.b0,srcB:S.r26.b0 }));
	describe('add r31.b1, r25.b1, r26.b1', check('add', 0x003a393f, { dst: S.r31.b1, srcA:S.r25.b1,srcB:S.r26.b1 }));
	describe('add r31.b2, r25.b2, r26.b2', check('add', 0x005a595f, { dst: S.r31.b2, srcA:S.r25.b2,srcB:S.r26.b2 }));
	describe('add r31.b3, r25.b3, r26.b3', check('add', 0x007a797f, { dst: S.r31.b3, srcA:S.r25.b3,srcB:S.r26.b3 }));
	describe('add r0, r0, r0', check('add', 0x00e0e0e0, { dst:S.r0,srcA:S.r0,srcB:S.r0 }));
});

describe('adc', function() {
	describe('adc r3, r1, r2', check('adc', 0x02e2e1e3, { dst:S.r3, srcA:S.r1, srcB:S.r2 }));
	describe('adc r3, r1.b0, r2.w2', check('adc', 0x02c201e3, { dst:S.r3, srcA:S.r1.b0, srcB:S.r2.w2 }));
	describe('adc r3, r3, 10', check('adc', 0x030ae3e3, { dst: S.r3, src:S.r3, imm:10 }));
});

describe('sub', function() {
	describe('sub r3, r1, r2', check('sub', 0x04e2e1e3, { dst:S.r3, srcA:S.r1, srcB:S.r2 }));
	describe('sub r3, r1.b0, r2.w2', check('sub', 0x04c201e3, { dst:S.r3, srcA:S.r1.b0, srcB:S.r2.w2 }));
	describe('sub r3, r3, 10', check('sub', 0x050ae3e3, { dst:S.r3, src:S.r3, imm:10 }));
});

describe('suc', function() {
	describe('suc r3, r1, r2', check('suc', 0x06e2e1e3, { dst:S.r3, srcA:S.r1, srcB:S.r2 }));
	describe('suc r3, r1.b0, r2.w2', check('suc', 0x06c201e3, { dst:S.r3, srcA:S.r1.b0, srcB:S.r2.w2 }));
	describe('suc r3, r3, 10', check('suc', 0x070ae3e3, { dst:S.r3, src:S.r3, imm:10 }));
});

describe('lsl', function() {
	describe('lsl r3, r3, 2', check('lsl', 0x0902e3e3, { dst:S.r3, src:S.r3, imm:2 }));
	describe('lsl r3, r3, r1.b0', check('lsl', 0x0801e3e3, { dst:S.r3, srcA:S.r3,srcB:S.r1.b0 }));
	describe('lsl r3, r3.b0, 10', check('lsl', 0x090a03e3, { dst:S.r3, src: S.r3.b0, imm:10 }));
});

describe('lsr', function() {
	describe('lsr r3, r3, 2', check('lsr', 0x0b02e3e3, { dst:S.r3, src:S.r3,imm:2 }));
	describe('lsr r3, r3, r1.b0', check('lsr', 0x0a01e3e3, { dst:S.r3, srcA: S.r3, srcB: S.r1.b0 }));
	describe('lsr r3, r3.b0, 10', check('lsr', 0x0b0a03e3, { dst:S.r3, src: S.r3.b0, imm:10 }));
});

describe('rsb', function() {
	describe('rsb r3, r1, r2', check('rsb', 0x0ce2e1e3, { dst:S.r3,srcA:S.r1,srcB:S.r2}));
	describe('rsb r3, r1.b0, r2.w2', check('rsb', 0x0cc201e3, { dst:S.r3,srcA:S.r1.b0,srcB:S.r2.w2}));
	describe('rsb r3, r3, 10', check('rsb', 0x0d0ae3e3, { dst:S.r3,src:S.r3,imm:10}));
});

describe('rsc', function() {
	describe('rsc r3, r1, r2', check('rsc', 0x0ee2e1e3, { dst:S.r3,srcA:S.r1,srcB:S.r2}));
	describe('rsc r3, r1.b0, r2.w2', check('rsc', 0x0ec201e3, { dst:S.r3,srcA:S.r1.b0,srcB:S.r2.w2}));
	describe('rsc r3, r3, 10', check('rsc', 0x0f0ae3e3, { dst:S.r3,src:S.r3,imm:10}));
});

describe('and', function() {
	describe('and r3, r1, r2', check('and', 0x10e2e1e3, { dst:S.r3,srcA:S.r1,srcB:S.r2}));
	describe('and r3, r1.b0, r2.w2', check('and', 0x10c201e3, { dst:S.r3,srcA:S.r1.b0,srcB:S.r2.w2}));
});

describe('or', function() {
	describe('or r3, r1, r2', check('or', 0x12e2e1e3, { dst: S.r3, srcA: S.r1, srcB: S.r2 }));
	describe('or r3, r1.b0, r2.w2', check('or', 0x12c201e3, { dst: S.r3, srcA: S.r1.b0, srcB: S.r2.w2 }));
});

describe('xor', function() {
	describe('xor r3, r1, r2', check('xor', 0x14e2e1e3, { dst: S.r3, srcA: S.r1, srcB: S.r2 }));
	describe('xor r3, r1.b0, r2.w2', check('xor', 0x14c201e3, { dst: S.r3, srcA: S.r1.b0, srcB: S.r2.w2 }));
});

describe('not', function() {
	describe('not r3, r3', check('not', 0x1700e3e3, { dst: S.r3, src: S.r3 }));
	describe('not r1.w0, r1.b0', check('not', 0x17000181, { dst: S.r1.w0, src: S.r1.b0 }));
	describe('not r0, r0, 0xA0', check('not', 0x16a0e0e0, { dst: S.r0, src: S.r0 }));
	describe('not r1, r1, r2', check('not', 0x16e2e1e1, { dst: S.r1, src: S.r1 }));
	describe('not r3, r1, r5', check('not', 0x16e5e1e3, { dst: S.r3, src: S.r1 }));
});

describe('min', function() {
	describe('min r3, r1, r2', check('min', 0x18e2e1e3, { dst: S.r3, srcA: S.r1, srcB: S.r2 }));
	describe('min r1.w2, r1.b0, 127', check('min', 0x197f01c1, { dst: S.r1.w2, src: S.r1.b0, imm: 127 }));
});

describe('max', function() {
	describe('max r3, r1, r2', check('max', 0x1ae2e1e3, { dst: S.r3, srcA: S.r1, srcB: S.r2 }));
	describe('max r1.w2, r1.b0, 127', check('max', 0x1b7f01c1, { dst: S.r1.w2, src: S.r1.b0, imm: 127 }));
});

describe('clr', function() {
	describe('clr r3, r1, r2', check('clr', 0x1ce2e1e3, { dst: S.r3, srcA: S.r1, srcB: S.r2 }));
	describe('clr r1.b1, r1.b0, 5', check('clr', 0x1d050121, { dst: S.r1.b1, src: S.r1.b0, imm: 5 }));
	describe('clr r3, r1', check('clr', 0x1ce1e3e3, { dst: S.r3, srcA: S.r3, srcB: S.r1 }));
	describe('clr r1.b1, 5', check('clr', 0x1d052121, { dst: S.r1.b1, src: S.r1.b1, imm: 5 }));
	describe('clr r3, r1.t2', check('clr', 0x1d02e1e3, { dst: S.r3, src: S.r1, imm: 2 }));
	describe('clr r1.b1, r1.b0.t5', check('clr', 0x1d050121, { dst: S.r1.b1, src: S.r1.b0, imm: 5 }));
	describe('clr r3.t2', check('clr', 0x1d02e3e3, { dst: S.r3, src: S.r3, imm: 2 })); 
});

describe('set', function() {
	describe('set r3, r1, r2', check('set', 0x1ee2e1e3, { dst: S.r3, srcA: S.r1, srcB: S.r2 }));
	describe('set r1.b1, r1.b0, 5', check('set', 0x1f050121, { dst: S.r1.b1, src: S.r1.b0, imm: 5  }));
	describe('set r3, r1', check('set', 0x1ee1e3e3, { dst: S.r3, srcA: S.r3, srcB: S.r1 }));
	describe('set r1.b1, 5', check('set', 0x1f052121, { dst: S.r1.b1, src: S.r1.b1, imm: 5 }));
	describe('set r3, r1.t2', check('set', 0x1f02e1e3, { dst: S.r3, src: S.r1, imm: 2 }));
	describe('set r1.b1, r1.b0.t5', check('set', 0x1f050121, { dst: S.r1.b1, src: S.r1.b0, imm: 5 }));
	describe('set r3.t2', check('set', 0x1f02e3e3, { dst: S.r3, src: S.r3, imm: 2 }));
});

describe('lmbd', function() {
	describe('lmbd r7, r8, r9', check('lmbd', 0x26e9e8e7, { dst: S.r7, srcA: S.r8, srcB: S.r9 }));
	describe('lmbd r7, r8, 0x65', check('lmbd', 0x2765e8e7, { dst: S.r7, src: S.r8, imm: 0x65}));
	describe('lmbd r3, r1, r2', check('lmbd', 0x26e2e1e3, { dst: S.r3, srcA: S.r1, srcB: S.r2 }));
	describe('lmbd r3, r1, 1', check('lmbd', 0x2701e1e3, { dst: S.r3, src: S.r1, imm: 1 }));
	describe('lmbd r3.b3, r3.w0, 0', check('lmbd', 0x27008363, { dst: S.r3.b3, src: S.r3.w0, imm: 0 }));
});

describe('sbco', function() {
	describe('sbco r2, c1, 5, 8', check('sbco', 0x81056182, { destination: S.r2, source: 1, offset: 5, count: 7 }));
	//it('sbco r31, c1, 5, 8', check(0x8105619f))
	//it('sbco r0, c31, 5, 8 ', check(0x81057f80))
	//it('sbco r0, c0, 255, 8', check(0x81ff6080))
	//it('sbco r0, c0, 0, 123', check(0x8f00a000))
	//it('sbco r0, c0, 0, 124', check(0x8f00a080))
});

describe('lbco', function() {
	
});

describe('sbbo', function() {
	
});

describe('lbbo', function() {
	
});




describe('qbgt', function() {
	describe('qbgt 0, r2.w0, 5', check('qbgt', 0x61058200, { offset:0,src:S.r2.w0,imm:5 } ));
	describe('qbgt 0x2F, r2.w0, 5', check('qbgt', 0x6105822f, { offset:0x2F,src:S.r2.w0,imm:5 } ));
	describe('qbgt 0, r3, r4', check('qbgt', 0x60e4e300, { offset:0,srcA:S.r3,srcB:S.r4 } ));
	describe('qbgt -0x2F, r2.w0, 5', check('qbgt', 0x670582d1, { offset: -0x2F,src:S.r2.w0,imm:5 } ));
	describe('qbgt 0x1FF, r2.w0, 0xFF', check('qbgt', 0x63ff82ff, { offset: 0x1FF,src:S.r2.w0,imm:0xFF } ));
	describe('qbgt -0x200, r31, 0xCC', check('qbgt', 0x65ccff00, { offset: -0x200,src:S.r31,imm:0xCC } ));
});



describe('qbge', function() {
	
});

describe('qblt', function() {
	
});

describe('qble', function() {
	
});

describe('qbeq', function() {
	
});

describe('qbne', function() {
	
});

describe('qbbs', function() {
	
});

describe('qbbc', function() {
	
});

describe('loop', function() {
	
});

describe('jmp', function() {
	describe('jmp 0xFFFF', check('jmp', 0x21ffff00, { target: 0xFFFF }));
	describe('jmp 0x0', check('jmp', 0x21000000, { target: 0x0 }));
	describe('jmp 0xCCCC', check('jmp', 0x21cccc00, { target: 0xCCCC }));
});

describe('jal', function() {
	describe('jal r0, 0xEE', check('jal', 0x2300eee0, { ret: S.r0 ,target: 0xEE }));
	describe('jal r0, 0xCC', check('jal', 0x2300cce0, { ret: S.r0 ,target: 0xCC }));
	describe('jal r23.b3, 0xCC', check('jal', 0x2300cc77, { ret: S.r23.b3 ,target: 0xCC }))
});

describe('ldi', function() {
	describe('ldi r1, 10', check('ldi', 0x24000ae1, { dst:S.r1, imm:10 }));
	describe('ldi r30.b0, &r2', check('ldi', 0x2400081e, { dst: S.r30.b0, imm:0x08 }));
});

describe('halt', function() {
	describe('halt', check('halt', 0x2a000000, { }));
});

describe('slp', function() {
	describe('slp 1', check('slp', 0x3e800000, { wakeOnEvents: 1 }));
	describe('slp 0', check('slp', 0x3e000000, { wakeOnEvents: 0 }));
});

