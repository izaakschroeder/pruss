describe('lsl', function() {
	describe('lsl r3, r3, 2', check('lsl', 0x0902e3e3, { dst:S.r3, src:S.r3, imm:2 }));
	describe('lsl r3, r3, r1.b0', check('lsl', 0x0801e3e3, { dst:S.r3, srcA:S.r3,srcB:S.r1.b0 }));
	describe('lsl r3, r3.b0, 10', check('lsl', 0x090a03e3, { dst:S.r3, src: S.r3.b0, imm:10 }));
});
