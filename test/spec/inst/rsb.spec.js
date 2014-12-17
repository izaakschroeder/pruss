describe('rsb', function() {
	describe('rsb r3, r1, r2', check('rsb', 0x0ce2e1e3, { dst:S.r3,srcA:S.r1,srcB:S.r2}));
	describe('rsb r3, r1.b0, r2.w2', check('rsb', 0x0cc201e3, { dst:S.r3,srcA:S.r1.b0,srcB:S.r2.w2}));
	describe('rsb r3, r3, 10', check('rsb', 0x0d0ae3e3, { dst:S.r3,src:S.r3,imm:10}));
});
