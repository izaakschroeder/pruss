
describe('xor', function() {
	describe('xor r3, r1, r2', check('xor', 0x14e2e1e3, { dst: S.r3, srcA: S.r1, srcB: S.r2 }));
	describe('xor r3, r1.b0, r2.w2', check('xor', 0x14c201e3, { dst: S.r3, srcA: S.r1.b0, srcB: S.r2.w2 }));
});
