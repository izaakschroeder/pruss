
describe('slp', function() {
	describe('slp 1', check('slp', 0x3e800000, { wakeOnEvents: 1 }));
	describe('slp 0', check('slp', 0x3e000000, { wakeOnEvents: 0 }));
});
