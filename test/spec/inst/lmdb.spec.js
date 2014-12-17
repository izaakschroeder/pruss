
describe('lmbd', function() {
	describe('lmbd r7, r8, r9', check('lmbd', 0x26e9e8e7, { dst: S.r7, srcA: S.r8, srcB: S.r9 }));
	describe('lmbd r7, r8, 0x65', check('lmbd', 0x2765e8e7, { dst: S.r7, src: S.r8, imm: 0x65}));
	describe('lmbd r3, r1, r2', check('lmbd', 0x26e2e1e3, { dst: S.r3, srcA: S.r1, srcB: S.r2 }));
	describe('lmbd r3, r1, 1', check('lmbd', 0x2701e1e3, { dst: S.r3, src: S.r1, imm: 1 }));
	describe('lmbd r3.b3, r3.w0, 0', check('lmbd', 0x27008363, { dst: S.r3.b3, src: S.r3.w0, imm: 0 }));
});
