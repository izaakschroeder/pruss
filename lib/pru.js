
'use strict';

function PRU(control, debug, ram, data, l3) {
	this.control = control;
	this._debug = debug;
	this._ram = ram;
	this.data = data;
	this.l3 = l3;
	this.enabled = false;
	this.singleStep = false;
	this.startAddress = 0x0;
	this.reset();
	for (var i = 0; i < 32; ++i) {
		this['r'+i] = 0;
	}
}

Object.defineProperty(PRU.prototype, 'registers', {
	get: function() {
		var registers = [ ];
		for (var i = 0; i < 32; ++i) {
			registers.push(this['r'+i]);
		}
		return registers;
	}
});

Object.defineProperty(PRU.prototype, 'ram', {
	get: function() {
		if (this.running) {
			throw new TypeError('Cannot access IRAM while running.');
		}
		return this._ram;
	}
});

Object.defineProperty(PRU.prototype, 'debug', {
	get: function() {
		if (this.running) {
			throw new TypeError('Cannot access debug memory while running.');
		}
		return this._debug;
	}
});

for(var i = 0; i < 32; ++i) {
	Object.defineProperty(PRU.prototype, 'r'+i, (function(i) { return {
		get: function() {
			return this.debug.readUInt32LE(i*4);
		},
		set: function(val) {
			this.debug.writeUInt32LE(val, i*4);
		}
	}; })(i));
}

for(var i = 0; i < 32; ++i) {
	Object.defineProperty(PRU.prototype, 'c'+i, (function(i) { return {
		get: function() {
			return this.debug.readUInt32LE(0x80 + i*4);
		},
		set: function(val) {
			if (i < 28 || i > 31) {
				throw new TypeError('Cannot set constant register.');
			}
			switch(i) {
			case 28:
				if ((val & 0xFF0000FF) !== 0x00000000) {
					throw new TypeError('Invalid address.');
				}
				this.control.writeUInt16LE((val >>> 8) & 0xFFFF, 0x28);
				break;
			case 29:
				if ((val & 0xFF0000FF) !== 0x49000000) {
					throw new TypeError('Invalid address.');
				}
				this.control.writeUInt16LE((val >>> 8) & 0xFFFF, 0x28+2);
				break;
			case 30:
				if ((val & 0xFF0000FF) !== 0x40000000)  {
					throw new TypeError('Invalid address.');
				}
				this.control.writeUInt16LE((val >>> 8) & 0xFFFF, 0x2C);
				break;
			case 31:
				if ((val & 0xFF0000FF) !== 0x80000000) {
					throw new TypeError('Invalid address.');
				}
				this.control.writeUInt16LE((val >>> 8) & 0xFFFF, 0x2C+2);
				break;
			}

		}
	}; })(i));
}


Object.defineProperty(PRU.prototype, 'startAddress', {
	get: function() {
		return this.control.readUInt16LE(2);
	},
	set: function(val) {
		this.control.writeUInt16LE(val, 2);
	}
});

Object.defineProperty(PRU.prototype, 'running', {
	get: function() {
		return !!(this.control[1] & (1 << 7));
	}
});

Object.defineProperty(PRU.prototype, 'singleStep', {
	get: function() {
		return !!(this.control[1] & (1 << 0));
	},
	set: function(val) {
		if (val) {
			this.control[1] |= (1 << 0);
		} else {
			this.control[1] &= ~(1 << 0);
		}
	}
});

Object.defineProperty(PRU.prototype, 'sleeping', {
	get: function() {
		return !!(this.control[0] & (1 << 2));
	},
	set: function(val) {
		if (val) {
			this.control[0] |= (1 << 2);
		} else {
			this.control[0] &= ~(1 << 2);
		}
	}
});

Object.defineProperty(PRU.prototype, 'enabled', {
	get: function() {
		return !!(this.control[0] & (1 << 1));
	},
	set: function(val) {
		if (val) {
			this.control[0] |= (1 << 1);
		} else {
			this.control[0] &= ~(1 << 1);
		}
	}
});

Object.defineProperty(PRU.prototype, 'cycleCountEnabled', {
	get: function() {
		return !!(this.control[0] & 1);
	},
	set: function(val) {
		if (val) {
			this.control[0] |= (1 << 3);
		} else {
			this.control[0] &= ~(1 << 3);
		}
	}
});

Object.defineProperty(PRU.prototype, 'cycles', {
	get:function() {
		return this.control.readUInt32LE(0xC);
	}
});

Object.defineProperty(PRU.prototype, 'programCounter', {
	get: function() {
		return this.control.readUInt16LE(0x4);
	}
});


PRU.prototype.break = function() {
	if (!this.running) {
		throw new TypeError('Cannot break while PRU is idle.');
	} else if (!this.enabled) {
		throw new TypeError('Cannot break while PRU is disabled.');
	}
	this.enabled = false;
	this.singleStep = true;
}

PRU.prototype.resume = function() {
	if (this.running) {
		throw new TypeError('Cannot resume while PRU is running.');
	}
	this.singleStep = false;
	this.enabled = true;
}

PRU.prototype.step = function() {
	if (this.running) {
		throw new TypeError('Cannot step while PRU is running.');
	}
	if (!this.singleStep) {
		this.singleStep = true;
	}
	this.enabled = true;
}

PRU.prototype.reset = function() {
	this.control[0] &= ~(1 << 0);
}

PRU.prototype.toString = function() {
	return ''+
		'enabled: '+this.enabled+'; '+
		'sleeping: '+this.sleeping+'; '+
		'running: '+this.running+'; '+
		'start address: 0x'+this.startAddress.toString(16)+'; '+
		'program counter: 0x'+this.programCounter.toString(16)+'; '+
		'single stepping: '+this.singleStep;
}

PRU.prototype.load = function(program) {
	if (this.running) {
		throw new TypeError('Cannot load new programs while PRU is running.');
	}
	if (Buffer.isBuffer(program)) {
		if (program.length % 4 !== 0) {
			throw new TypeError('Invalid number of instructions.');
		}
		program.copy(this.ram);
		this.ram.fill(0,program.length);
	} else if (Array.isArray(program)) {
		for (var i = 0; i < program.length; ++i) {
			this.ram.writeUInt32LE(program[i], i*4);
		}
		this.ram.fill(0,i*4);
	} else if (program instanceof Silicon.Program) {
		for (var i = 0; i < program.instructions.length; ++i) {
			this.ram.writeUInt32LE(program.instructions[i].encode(), i*4);
		}
		this.ram.fill(0,i*4);
	}
	else if (typeof program === 'string') {
		this.load(fs.readFileSync(program))
	}
	else {
		throw new TypeError('Invalid program.');
	}
}

PRU.prototype.disassemble = function(start, end) {
	if (typeof end === 'undefined') {
		start = end;
	}
	if (typeof start === 'undefined') {
		start = 0;
	}
	var results = [ ];
	for (var i = start*4 || 0; i < end*4; i+=4) {
		results.push(Silicon.disassemble(this.ram.readUInt32LE(i)));
	}
	return results;
}

PRU.prototype.run = function(program) {
	this.enabled = false;
	//	this.singleStep = false;
	this.startAddress = 0x0;
	this.load(program);
	this.enabled = true;
}

PRU.prototype.close = function() {
	this.enabled = false;
	this.reset();
}

module.exports = PRU;
