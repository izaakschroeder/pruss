
describe('clr', function() {
	describe('clr r3, r1, r2', check('clr', 0x1ce2e1e3, { dst: S.r3, srcA: S.r1, srcB: S.r2 }));
	describe('clr r1.b1, r1.b0, 5', check('clr', 0x1d050121, { dst: S.r1.b1, src: S.r1.b0, imm: 5 }));
	describe('clr r3, r1', check('clr', 0x1ce1e3e3, { dst: S.r3, srcA: S.r3, srcB: S.r1 }));
	describe('clr r1.b1, 5', check('clr', 0x1d052121, { dst: S.r1.b1, src: S.r1.b1, imm: 5 }));
	describe('clr r3, r1.t2', check('clr', 0x1d02e1e3, { dst: S.r3, src: S.r1, imm: 2 }));
	describe('clr r1.b1, r1.b0.t5', check('clr', 0x1d050121, { dst: S.r1.b1, src: S.r1.b0, imm: 5 }));
	describe('clr r3.t2', check('clr', 0x1d02e3e3, { dst: S.r3, src: S.r3, imm: 2 }));
});
