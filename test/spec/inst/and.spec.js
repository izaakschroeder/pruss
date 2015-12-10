
'use strict';

describe('and', function() {
	describe('and r3, r1, r2', check('and', 0x10e2e1e3, { dst:S.r3,srcA:S.r1,srcB:S.r2}));
	describe('and r3, r1.b0, r2.w2', check('and', 0x10c201e3, { dst:S.r3,srcA:S.r1.b0,srcB:S.r2.w2}));
});
