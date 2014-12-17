
describe('or', function() {
	describe('or r3, r1, r2', check('or', 0x12e2e1e3, { dst: S.r3, srcA: S.r1, srcB: S.r2 }));
	describe('or r3, r1.b0, r2.w2', check('or', 0x12c201e3, { dst: S.r3, srcA: S.r1.b0, srcB: S.r2.w2 }));
});
