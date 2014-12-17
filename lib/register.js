
var util = require('util');

function Register(id, field) {
	if (field > 7) throw new TypeError('Invalid register field.');
	Number.call(this, id);
	this.name = 'r'+id;
	this.id = id;
	this.field = field;
	this.address = id*4;
}
Register.b0 = 0;
Register.b1 = 1;
Register.b2 = 2;
Register.b3 = 3;
Register.w0 = 4;
Register.w1 = 5;
Register.w2 = 6;
Register.l0 = 7;
util.inherits(Register, Number);

Register.fieldToString = function(field) {
	switch(field) {
	case Register.b0: return 'b0';
	case Register.b1: return 'b1';
	case Register.b2: return 'b2';
	case Register.b3: return 'b3';
	case Register.w0: return 'w0';
	case Register.w1: return 'w1';
	case Register.w2: return 'w2';
	case Register.l0: return 'l0';
	default: throw new TypeError('Invalid field.');
	}
}

Register.prototype.instance = function(value) {
	var result = new Number(value);
	result.register = this;
	return result;
}

Register.prototype.toString = function() {
	return this.name + (this.field === Register.l0 ? '' : '.'+Register.fieldToString(this.field));
}

Register.prototype.valueOf = function() {
	return this.toString();
}

Object.defineProperty(Register.prototype, 'length', {
	get: function() {
		switch(this.field) {
		case Register.b0: case Register.b1: case Register.b2: case Register.b4: return 1;
		case Register.w0: case Register.w1: case Register.w2: return 2;
		case Register.l0: return 4;
		}
	}
})

Object.defineProperty(Register.prototype, 'b0', {
	get: function() {
		switch(this.field) {
		case Register.b0:
		case Register.b1:
		case Register.b2:
		case Register.b3: 
			return this;
		case Register.l0:
		case Register.w0:
			return new Register(this.id, Register.b0);
		case Register.w1:
			return new Register(this.id, Register.b1);
		case Register.w2:
			return new Register(this.id, Register.b2);
		default: 
			throw new TypeError();
		}
	}
});

Object.defineProperty(Register.prototype, 'b1', {
	get: function() {
		switch(this.field) {
		case Register.l0:
		case Register.w0:
			return new Register(this.id, Register.b1);
		case Register.w1:
			return new Register(this.id, Register.b3);
		default: 
			throw new TypeError();
		}
	}
});

Object.defineProperty(Register.prototype, 'b2', {
	get: function() {
		switch(this.field) {
		case Register.l0: return new Register(this.id, Register.b2);
		default: throw new TypeError();
		}
	}
});

Object.defineProperty(Register.prototype, 'b3', {
	get: function() {
		switch(this.field) {
		case Register.l0: return new Register(this.id, Register.b3);
		default: throw new TypeError();
		}
	}
});

Object.defineProperty(Register.prototype, 'w0', {
	get: function() {
		switch(this.field) {
		case Register.w0: case Register.w1: return this;
		case Register.l0: return new Register(this.id, Register.w0);
		default: throw new TypeError();
		}
	}
});

Object.defineProperty(Register.prototype, 'w1', {
	get: function() {
		switch(this.field) {
		case Register.l0: return new Register(this.id, Register.w1);
		default: throw new TypeError();
		}
	}
});

Object.defineProperty(Register.prototype, 'w2', {
	get: function() {
		switch(this.field) {
		case Register.l0: return new Register(this.id, Register.w2);
		default: throw new TypeError();
		}
	}
})

module.exports = Register;