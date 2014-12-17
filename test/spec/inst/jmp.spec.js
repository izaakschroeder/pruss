
describe('jmp', function() {
	describe('jmp 0xFFFF', check('jmp', 0x21ffff00, { target: 0xFFFF }));
	describe('jmp 0x0', check('jmp', 0x21000000, { target: 0x0 }));
	describe('jmp 0xCCCC', check('jmp', 0x21cccc00, { target: 0xCCCC }));
});
