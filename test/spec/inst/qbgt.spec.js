
describe('qbgt', function() {
	describe('qbgt 0, r2.w0, 5', check('qbgt', 0x61058200, { offset:0,src:S.r2.w0,imm:5 } ));
	describe('qbgt 0x2F, r2.w0, 5', check('qbgt', 0x6105822f, { offset:0x2F,src:S.r2.w0,imm:5 } ));
	describe('qbgt 0, r3, r4', check('qbgt', 0x60e4e300, { offset:0,srcA:S.r3,srcB:S.r4 } ));
	describe('qbgt -0x2F, r2.w0, 5', check('qbgt', 0x670582d1, { offset: -0x2F,src:S.r2.w0,imm:5 } ));
	describe('qbgt 0x1FF, r2.w0, 0xFF', check('qbgt', 0x63ff82ff, { offset: 0x1FF,src:S.r2.w0,imm:0xFF } ));
	describe('qbgt -0x200, r31, 0xCC', check('qbgt', 0x65ccff00, { offset: -0x200,src:S.r31,imm:0xCC } ));
});
