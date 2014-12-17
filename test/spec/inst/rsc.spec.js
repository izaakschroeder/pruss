
describe('rsc', function() {
	describe('rsc r3, r1, r2', check('rsc', 0x0ee2e1e3, { dst:S.r3,srcA:S.r1,srcB:S.r2}));
	describe('rsc r3, r1.b0, r2.w2', check('rsc', 0x0ec201e3, { dst:S.r3,srcA:S.r1.b0,srcB:S.r2.w2}));
	describe('rsc r3, r3, 10', check('rsc', 0x0f0ae3e3, { dst:S.r3,src:S.r3,imm:10}));
});
