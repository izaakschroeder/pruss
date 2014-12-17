

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
