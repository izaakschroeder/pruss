
describe('sbco', function() {
	describe('sbco r2, c1, 5, 8', check('sbco', 0x81056182, { destination: S.r2, source: 1, offset: 5, count: 7 }));
	//it('sbco r31, c1, 5, 8', check(0x8105619f))
	//it('sbco r0, c31, 5, 8 ', check(0x81057f80))
	//it('sbco r0, c0, 255, 8', check(0x81ff6080))
	//it('sbco r0, c0, 0, 123', check(0x8f00a000))
	//it('sbco r0, c0, 0, 124', check(0x8f00a080))
});
