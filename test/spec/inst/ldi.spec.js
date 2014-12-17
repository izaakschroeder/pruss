
describe('ldi', function() {
	describe('ldi r1, 10', check('ldi', 0x24000ae1, { dst:S.r1, imm:10 }));
	describe('ldi r30.b0, &r2', check('ldi', 0x2400081e, { dst: S.r30.b0, imm:0x08 }));
});
