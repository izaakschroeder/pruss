
describe('min', function() {
	describe('min r3, r1, r2', check('min', 0x18e2e1e3, { dst: S.r3, srcA: S.r1, srcB: S.r2 }));
	describe('min r1.w2, r1.b0, 127', check('min', 0x197f01c1, { dst: S.r1.w2, src: S.r1.b0, imm: 127 }));
});
