
describe('add', function() {
	describe('add r0, r0, #0xCC', check('add', 0x01cce0e0, { dst: S.r0, src: S.r0, imm: 0xCC }));
	describe('add r1, r0, #0x90', check('add', 0x0190e0e1, { dst: S.r1, src: S.r0, imm: 0x90 }));
	describe('add r0, r1, #0x35', check('add', 0x0135e1e0, { dst: S.r0, src: S.r1, imm: 0x35 }));
	describe('add r31, r25, #0x03', check('add', 0x0103f9ff, { dst: S.r31, src: S.r25, imm: 0x03 }));
	describe('add r31.w0, r25.w0, r26.w0', check('add', 0x009a999f, { dst: S.r31.w0, srcA:S.r25.w0,srcB:S.r26.w0 }));
	describe('add r31.w1, r25.w1, r26.w1', check('add', 0x00bab9bf, { dst: S.r31.w1, srcA:S.r25.w1,srcB:S.r26.w1 }));
	describe('add r31.w2, r25.w2, r26.w2', check('add', 0x00dad9df, { dst: S.r31.w2, srcA:S.r25.w2,srcB:S.r26.w2 }));
	describe('add r31.b0, r25.b0, r26.b0', check('add', 0x001a191f, { dst: S.r31.b0, srcA:S.r25.b0,srcB:S.r26.b0 }));
	describe('add r31.b1, r25.b1, r26.b1', check('add', 0x003a393f, { dst: S.r31.b1, srcA:S.r25.b1,srcB:S.r26.b1 }));
	describe('add r31.b2, r25.b2, r26.b2', check('add', 0x005a595f, { dst: S.r31.b2, srcA:S.r25.b2,srcB:S.r26.b2 }));
	describe('add r31.b3, r25.b3, r26.b3', check('add', 0x007a797f, { dst: S.r31.b3, srcA:S.r25.b3,srcB:S.r26.b3 }));
	describe('add r0, r0, r0', check('add', 0x00e0e0e0, { dst:S.r0,srcA:S.r0,srcB:S.r0 }));
});
