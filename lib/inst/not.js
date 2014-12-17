not:  bits('0001011'),

// Bitwise not is a fucking stupid operation because it tries to conform to the
// rest of the logic instructions by using their three operand pattern.
// Unfortunately "not" is a unary operation coded as dst <- ~src. So the
// register form of "not" is actually the immediate form looking like:
// REG REG 0 and it ignores any value you store in the immediate field as well
// as the typical immediate instruction  bit so you can ONLY use registers on
// this instruction.
describe(['not'], function(name) {
	return [
	PI(name, [ REG('dst', 24), REG('src', 16) ], [op(name)])
	];
})
