
describe('lsr', function() {
	describe('lsr r3, r3, 2', check('lsr', 0x0b02e3e3, { dst:S.r3, src:S.r3,imm:2 }));
	describe('lsr r3, r3, r1.b0', check('lsr', 0x0a01e3e3, { dst:S.r3, srcA: S.r3, srcB: S.r1.b0 }));
	describe('lsr r3, r3.b0, 10', check('lsr', 0x0b0a03e3, { dst:S.r3, src: S.r3.b0, imm:10 }));
});
