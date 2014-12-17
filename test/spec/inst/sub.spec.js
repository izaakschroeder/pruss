describe('sub', function() {
	describe('sub r3, r1, r2', check('sub', 0x04e2e1e3, { dst:S.r3, srcA:S.r1, srcB:S.r2 }));
	describe('sub r3, r1.b0, r2.w2', check('sub', 0x04c201e3, { dst:S.r3, srcA:S.r1.b0, srcB:S.r2.w2 }));
	describe('sub r3, r3, 10', check('sub', 0x050ae3e3, { dst:S.r3, src:S.r3, imm:10 }));
});
