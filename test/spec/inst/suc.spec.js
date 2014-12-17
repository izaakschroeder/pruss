
describe('suc', function() {
	describe('suc r3, r1, r2', check('suc', 0x06e2e1e3, { dst:S.r3, srcA:S.r1, srcB:S.r2 }));
	describe('suc r3, r1.b0, r2.w2', check('suc', 0x06c201e3, { dst:S.r3, srcA:S.r1.b0, srcB:S.r2.w2 }));
	describe('suc r3, r3, 10', check('suc', 0x070ae3e3, { dst:S.r3, src:S.r3, imm:10 }));
});
