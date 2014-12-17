jmp:  bits('0010000'),

describe(['jmp'], function(name) {
	return [
	//OPCODE #Im65535, Rcnt
	PI(name, [ REG('target', 8) ], [ op(name), bits('0', 7) ]),
	//OPCODE #Im65535, #Im255
	PI(name, [ IMM('target', { start: 8, length: 16 }) ], [ op(name), bits('1', 7) ])
	];
})
