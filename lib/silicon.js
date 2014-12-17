

var 
	Register = require('./register'),
	Bits = require('bits'),
	Machine = require('machine'),
	Arguments = require('./arguments'),
	types = require('./types'),
	util = require('util'),
	Argument = Machine.Argument,
	REG = Arguments.RegisterAndField,
	Rn = Arguments.Register,
	IMM = Arguments.Immediate,
	PI = Machine.PhysicalInstruction,
	VI = Machine.PseudoInstruction;


function bits(value, pos) {
	if (typeof value !== 'string') throw new TypeError();
	return Bits.Range(pos || 0, value, 31);
}

function op(name) {
	if (typeof opcodes[name] === 'undefined') throw new TypeError();
	return opcodes[name];
}

var opcodes = {
	loop: bits('0011000'),
	qbbs: bits('11010'),
	qbbc: bits('11001'),
	add:  bits('0000000'),
	adc:  bits('0000001'),
	sub:  bits('0000010'),
	suc:  bits('0000011'),
	lsl:  bits('0000100'),
	lsr:  bits('0000101'),
	rsb:  bits('0000110'),
	rsc:  bits('0000111'),
	and:  bits('0001000'),
	or:   bits('0001001'),
	xor:  bits('0001010'),
	min:  bits('0001100'),
	max:  bits('0001101'),
	clr:  bits('0001110'),
	set:  bits('0001111'),
	lmbd: bits('0010011'),
	not:  bits('0001011'),
	sbco: bits('1000'),
	lbco: bits('1001'),
	sbbo: bits('1110'),
	lbbo: bits('1111'),
	qbgt: bits('01100'),
	qbge: bits('01110'),
	qblt: bits('01001'),
	qble: bits('01011'),
	qbeq: bits('01010'),
	qbne: bits('01101'),
	jmp:  bits('0010000'),
	jal:  bits('00100011'),
	ldi:  bits('00100100'),
	halt: bits('00101010000000000000000000000000'),
	slp:  bits('00111110X00000000000000000000000'),
}



var instructions = [ ];

function describe(members, callback) {
	Array.prototype.push.apply(instructions, members.reduce(function(result, member) {
		return result.concat(callback(member));
	}, []));
}


describe(['add', 'adc','sub','suc', 'lsl', 'lsr','rsb','rsc','and','or','xor','min','max','clr','set','lmbd'], function(name) {
	return [
		PI(name, [ 
			REG('dst', 24), 
			REG('srcA', 16), 
			REG('srcB', 8) 
		], [ op(name), bits('0', 7) ]),
		PI(name, [ 
			REG('dst', 24), 
			REG('src', 16), 
			IMM('imm', {start: 8, length: 8}) 
		], [ op(name), bits('1', 7) ])
	];
})
	
//Bitwise not is a fucking stupid operation because it tries to conform to the rest
//of the logic instructions by using their three operand pattern. Unfortunately
//"not" is a unary operation coded as dst <- ~src. So the register form of "not"
//is actually the immediate form looking like: REG REG 0 and it ignores any value
//you store in the immediate field as well as the typical immediate instruction 
//bit so you can ONLY use registers on this instruction.
describe(['not'], function(name) {
	return [
		PI(name, [ REG('dst', 24), REG('src', 16) ], [op(name)])
	];
})

describe(['sbco', 'lbco'], function(name) {
	return [
		PI(name, [ 
			Rn('destination', 27), 
			IMM('source', { start: 19, length: 5 }), 
			REG('offset', 8),  
			IMM('bn', 'XXXXXXXXXXXXXXXXXXBXXXXXB') 
		], [ op(name), bits('0', 7), bits('111', 4), bits('11', 16) ]),
		PI(name, [ 
			Rn('destination', 27), 
			IMM('source', { start: 19, length: 5 }), 
			IMM('offset', { start: 8, length: 8 }), 
			IMM('bn', 'XXXXXXXXXXXXXXXXXXBXXXXXB') 
		], [ op(name), bits('1', 7), bits('111', 4), bits('11', 16) ] )
	];
})

describe(['sbbo', 'lbbo'], function(name) {
	return [
		PI(name, [ 
			Rn('destination', 27), 
			Rn('source', 19), 
			REG('offset', 8), 
			IMM('count', 'XXXXCCCXXXXXXXXXCCCXXXXXXXC', false, 0, 123) 
		], [ op(name), bits('0', 7) ]),
		PI(name, [ 
			Rn('destination', 27), 
			Rn('source', 19), 
			IMM('offset', { start: 8, length: 8 }),  
			IMM('count', 'XXXXCCCXXXXXXXXXCCCXXXXXXXC', false, 0, 123) 
		], [ op(name), bits('1', 7) ])
	];
})
	

describe(['qbgt', 'qbge', 'qblt', 'qble', 'qbeq', 'qbne'], function(name) {
	return [
		//OPCODE LABEL, REG1, Rn
		PI(name, [ 
			IMM('offset', 'XXXXXOOXXXXXXXXXXXXXXXXXOOOOOOOO', true), 
			REG('srcA', 16), 
			REG('srcB', 8) 
		], [ op(name), bits('0', 7) ]),
		//OPCODE LABEL, REG1, IMM(255)
		PI(name, [ 
			IMM('offset', 'XXXXXOOXXXXXXXXXXXXXXXXXOOOOOOOO', true), 
			REG('src', 16), 
			IMM('imm', { start: 8, length: 8 }) 
		], [ op(name), bits('1', 7) ])
	];
})

describe(['qbbs', 'qbbc'], function(name) {
	return [
		//OPCODE LABEL, Rn.tx
		PI(name, [ 
			IMM('location', 'XXXXXLLXXXXXXXXXXXXXXXXXLLLLLLLL'), 
			REG('srcA', 16), 
			REG('srcB', 8) 
		], [ op(name), bits('0', 7) ]),
		//OPCODE LABEL, REG1, OP(31)
		PI(name, [ 
			IMM('location', 'XXXXXLLXXXXXXXXXXXXXXXXXLLLLLLLL'), 
			REG('src', 16), 
			IMM('imm', { start: 8, length: 8 }) 
		], [ op(name), bits('1', 7) ])
	];
})

describe(['loop'], function(name) {
	return [
		//OPCODE #Im65535, Rcnt
		PI(name, [ 
			IMM('interruptable', { start: 17, length: 1 }), 
			IMM('location', { start: 24, length: 8 }), 
			REG('count', 13, 19) 
		], [ op(name), bits('0', 7) ]),
		//OPCODE #Im65535, #Im255
		PI(name, [ 
			IMM('interruptable', { start: 17, length: 1 }), 
			IMM('location', { start: 24, length: 8 }), 
			IMM('count', { start: 19, length: 5 }) 
		], [ op(name), bits('1', 7) ])
	];
})

describe(['jmp'], function(name) {
	return [
		//OPCODE #Im65535, Rcnt
		PI(name, [ REG('target', 8) ], [ op(name), bits('0', 7) ]),
		//OPCODE #Im65535, #Im255
		PI(name, [ IMM('target', { start: 8, length: 16 }) ], [ op(name), bits('1', 7) ])
	];
})

describe(['jal'], function(name) {
	return [
		PI(name, [ REG('ret', 24), IMM('target', { start: 8, length: 16 }) ], [op(name)])
	];
})

describe(['ldi'], function(name) {
	return [
		PI(name, [ REG('dst', 24), IMM('imm', { start: 8, length: 16 }) ], [op(name)])
	];
})

describe(['halt'], function(name) {
	return [
		PI(name, [], [op(name)])
	]
})

describe(['slp'], function(name) {
	return [
		PI(name, [ IMM('wakeOnEvents', { start: 8, length: 1 }) ], [op(name)])
	];
})

/*
describe(['xin', 'xout', 'xchg'], function(name) {
	return [
		//OPCODE #Im253, Rdst, #Im124
		//OPCODE #Im253, Rdst, bn
	];
})
*/

describe(['mov'], function(name) {
	return [
		VI(name, [ Argument('dst', types.RegisterAndField()), Argument('imm', types.Immediate(0xFFFF, 0xFFFFFFFF)) ], [ 
			{ opcode: 'ldi', values: [ 'dst', {
				target: 'imm',
				marshal: types.Immediate(0, 0xFFFF),
				encode: function(val) { return val >>> 16; },
				decode: function(val) { return (val << 16) >>> 0; }
			} ] },
			{ opcode: 'ldi', values: [ 'dst', {
				target: 'imm', 
				marshal: types.Immediate(0, 0xFFFF),
				encode: function(val) { return val & 0xFFFF; },
				decode: function(val) { return val; }
			} ] }, 
		], instructions),
		VI(name, [ Argument('dst', types.RegisterAndField()), Argument('imm', types.Immediate(0, 0xFFFF)) ], [
			{ opcode: 'ldi', values: [ 'dst', 'imm' ] }, 
		], instructions),
		VI(name, [ Argument('dst', types.RegisterAndField()), Argument('src', types.RegisterAndField()) ], [
			{ opcode: 'and', values: [ 'dst', 'src', 'src' ] }
		], instructions)
	];
});

function Silicon() {
	Machine.Machine.call(this, instructions);
	for (var i = 0; i < 32; ++i)
		this['r'+i] = new Register(i, Register.l0);
	this.b0 = Register.b0;
	this.b1 = Register.b1;
	this.b2 = Register.b2;
	this.b3 = Register.b3;
	this.w0 = Register.w0;
	this.w1 = Register.w1;
	this.w2 = Register.w2;
	this.l0 = Register.l0;
}
util.inherits(Silicon, Machine.Machine);
Silicon.Program = Machine.Program;

Silicon.create = function() {
	return new Silicon();
}

module.exports = Silicon;

if (!module.parent)
	console.log(''+(new Silicon()));