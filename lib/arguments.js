
var 
	Bits = require('bits'), 
	Machine = require('machine'),
	BitArgument = Machine.BitArgument,
	Register = require('./register'),
	types = require('./types'),
	util = require('util');

function RegisterAndFieldArgument(name, fieldOffset, registerOffset) {
	if (this instanceof RegisterAndFieldArgument === false) 
		return new RegisterAndFieldArgument(name, fieldOffset, registerOffset);
	if (typeof fieldOffset !== 'number') throw new TypeError();
	if (typeof registerOffset === 'undefined') registerOffset = fieldOffset + 3;
	if (typeof registerOffset !== 'number') throw new TypeError();
	var label = name.charAt(0).toUpperCase();
	BitArgument.call(this, name, types.RegisterAndField(), [
		Bits.Range(fieldOffset, Bits.Block(label, 3), 31), 
		Bits.Range(registerOffset, Bits.Block(label, 5), 31)
	]);
}
util.inherits(RegisterAndFieldArgument, BitArgument);

RegisterAndFieldArgument.prototype.encode = function(register) {
	if (register instanceof Register === false) throw new TypeError();
	return [register.field, register.id];
}

RegisterAndFieldArgument.prototype.decode = function(parts) {
	return new Register(parts[1], parts[0]);
}

function RegisterArgument(name, offset) {
	if (this instanceof RegisterArgument === false) 
		return new RegisterArgument(name, offset);
	var label = name.charAt(0).toUpperCase();
	BitArgument.call(this, name, types.Register(), Bits.Range(offset, Bits.Block(label, 5), 31));
}
util.inherits(RegisterArgument, BitArgument);

RegisterArgument.prototype.encode = function(register) {
	if (register instanceof Register === false) throw new TypeError();
	if (register.field !== 7) throw new TypeError();
	return register.id;
}

RegisterArgument.prototype.decode = function(parts) {
	return new Register(parts, 7);
}

function ImmediateArgument(name, bits, signed, min, max) {
	if (this instanceof ImmediateArgument === false) 
		return new ImmediateArgument(name, bits, signed, min, max);
	var label = name.charAt(0).toUpperCase();
	if (typeof bits === 'string')
		bits = Bits.Range(0, bits, 31);
	else if (typeof bits === 'object')
		bits = Bits.Range(bits.start, Bits.Block(label, bits.length), 31);
	else
		throw new TypeError();
	var length = bits.count(label);
	if (length <= 0) throw new TypeError();
	var trueMin = !signed ? 0 : -Math.pow(2, length-1),
		trueMax = !signed ? Math.pow(2, length)-1 : Math.pow(2, length-1)-1;
	if (typeof min === 'undefined') min = trueMin;
	if (typeof max === 'undefined') max = trueMax;
	if (typeof min !== 'number') throw new TypeError();
	if (typeof max !== 'number') throw new TypeError();
	if (min < trueMin) throw new TypeError();
	if (max > trueMax) throw new TypeError();
	if (min > max) throw new TypeError();
	BitArgument.call(this, name, types.Immediate(min, max), bits);
	this.signed = signed || false;
	this.length = length;
}
util.inherits(ImmediateArgument, BitArgument)



ImmediateArgument.prototype.encode = function(value) {
	return [ this.signed ? ((value >> this.length-1) * (-Math.pow(2,this.length))) + value : value ]
}

ImmediateArgument.prototype.decode = function(value) {
	value = value[0];
	return this.signed ? ((value >> this.length-1) * (-Math.pow(2,this.length))) + value : value
}

module.exports = {
	Immediate: ImmediateArgument,
	Register: RegisterArgument,
	RegisterAndField: RegisterAndFieldArgument
}
