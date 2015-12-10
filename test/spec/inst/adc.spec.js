
'use strict';

describe('adc', function() {
	describe('adc r3, r1, r2', check('adc', 0x02e2e1e3, { dst:S.r3, srcA:S.r1, srcB:S.r2 }));
	describe('adc r3, r1.b0, r2.w2', check('adc', 0x02c201e3, { dst:S.r3, srcA:S.r1.b0, srcB:S.r2.w2 }));
	describe('adc r3, r3, 10', check('adc', 0x030ae3e3, { dst: S.r3, src:S.r3, imm:10 }));
});
