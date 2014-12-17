
describe('not', function() {
	describe('not r3, r3', check('not', 0x1700e3e3, { dst: S.r3, src: S.r3 }));
	describe('not r1.w0, r1.b0', check('not', 0x17000181, { dst: S.r1.w0, src: S.r1.b0 }));
	describe('not r0, r0, 0xA0', check('not', 0x16a0e0e0, { dst: S.r0, src: S.r0 }));
	describe('not r1, r1, r2', check('not', 0x16e2e1e1, { dst: S.r1, src: S.r1 }));
	describe('not r3, r1, r5', check('not', 0x16e5e1e3, { dst: S.r3, src: S.r1 }));
});
