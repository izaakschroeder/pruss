var 
	Silicon = require('./silicon'),
	Stream = require('stream'), 
	util = require('util');

function Disassembler(opts) {
	Stream.Transform.call(this, opts);
}
util.inherits(Disassembler, Stream.Transform)

Disassembler.prototype._transform = function() {
	chunk, encoding, callback
}

function Assembler() {

}

Assembler.prototype._transform = function() {
	
}

function swap(val) {
	return (((val & 0xFF) << 24) | ((val & 0xFF00) << 8) | ((val >> 8) & 0xFF00) | ((val >> 24) & 0xFF)) >>> 0;
}

/*
wbs: function(reg, val) {
		if (typeof val !== 'undefined')
			return this.qbne(0, reg, val);
		else
			return this.qbbc(0, reg);
	}

	wbc: function(reg, val) {
		if (typeof val !== 'undefined')
			return this.qbeq(0, reg, val);
		else
			return this.qbbs(0, reg);
	}

	

	call: {

	},

	ret: {

	},

	zero: {

	},

	mvib: {

	},

	mviw: {

	},

	mvid: {

	},

	//ZERO  &Rdst,  #Im124
	//ZERO  &Rdst,  bn
	//ZERO  #Im123, #Im124
	//ZERO  #Im123, bn
	zero: {
		format: opcode().either(
			register().immediate(),
			register().registerBase(),
			immediate().immediate(),
			immediate().registerBase()
		)
	},

	// Instruction in the form of:
	//FILL  &Rdst,  #Im124
	//FILL  &Rdst,  bn
	//FILL  #Im123, #Im124
	//FILL  #Im123, bn
	fill: {
		format: opcode().either(
			register().immediate(),
			register().registerBase(),
			immediate().immediate(),
			immediate().registerBase()
		)
	},
	mov: {
		//format: format.opcode().register('dst').either(format.immediate('src'), format.address('src'), format.register('src'))
	},

*/