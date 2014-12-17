jal:  bits('00100011'),

describe(['jal'], function(name) {
	return [
	PI(name, [ REG('ret', 24), IMM('target', { start: 8, length: 16 }) ], [op(name)])
	];
})
