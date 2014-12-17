ldi:  bits('00100100'),

describe(['ldi'], function(name) {
	return [
	PI(name, [ REG('dst', 24), IMM('imm', { start: 8, length: 16 }) ], [op(name)])
	];
})
