
describe('max', function() {
	describe('max r3, r1, r2', check('max', 0x1ae2e1e3, { dst: S.r3, srcA: S.r1, srcB: S.r2 }));
	describe('max r1.w2, r1.b0, 127', check('max', 0x1b7f01c1, { dst: S.r1.w2, src: S.r1.b0, imm: 127 }));
});
