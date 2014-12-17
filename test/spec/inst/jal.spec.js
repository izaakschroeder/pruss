
describe('jal', function() {
	describe('jal r0, 0xEE', check('jal', 0x2300eee0, { ret: S.r0 ,target: 0xEE }));
	describe('jal r0, 0xCC', check('jal', 0x2300cce0, { ret: S.r0 ,target: 0xCC }));
	describe('jal r23.b3, 0xCC', check('jal', 0x2300cc77, { ret: S.r23.b3 ,target: 0xCC }))
});
