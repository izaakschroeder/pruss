
describe('set', function() {
	describe('set r3, r1, r2', check('set', 0x1ee2e1e3, { dst: S.r3, srcA: S.r1, srcB: S.r2 }));
	describe('set r1.b1, r1.b0, 5', check('set', 0x1f050121, { dst: S.r1.b1, src: S.r1.b0, imm: 5  }));
	describe('set r3, r1', check('set', 0x1ee1e3e3, { dst: S.r3, srcA: S.r3, srcB: S.r1 }));
	describe('set r1.b1, 5', check('set', 0x1f052121, { dst: S.r1.b1, src: S.r1.b1, imm: 5 }));
	describe('set r3, r1.t2', check('set', 0x1f02e1e3, { dst: S.r3, src: S.r1, imm: 2 }));
	describe('set r1.b1, r1.b0.t5', check('set', 0x1f050121, { dst: S.r1.b1, src: S.r1.b0, imm: 5 }));
	describe('set r3.t2', check('set', 0x1f02e3e3, { dst: S.r3, src: S.r3, imm: 2 }));
});
