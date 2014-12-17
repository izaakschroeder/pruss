slp:  bits('00111110X00000000000000000000000'),

describe(['slp'], function(name) {
	return [
	PI(name, [ IMM('wakeOnEvents', { start: 8, length: 1 }) ], [op(name)])
	];
})
