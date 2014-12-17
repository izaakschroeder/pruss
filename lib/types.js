
var 
	R = require('./register'),
	Type = require('machine').Type, 
	util = require('util');

function Immediate(min, max) {
	if (this instanceof Immediate === false) return new Immediate(min, max);
	if (typeof min !== 'number') throw new TypeError('Minimum must be a number.');
	if (typeof max !== 'number') throw new TypeError('Maximum must be a number.');
	if (min > max) throw new TypeError('Minimum must be smaller than maximum.');
	Type.call(this);
	this.min = min;
	this.max = max;
}
util.inherits(Immediate, Type);

Immediate.prototype.equals = function(other) {
	return (other instanceof Immediate) && (other.min === this.min) && (other.max === this.max);
}

Immediate.prototype.check = function(value) {
	if (typeof value !== 'number') return false;
	return value >= this.min && value <= this.max;
}

Immediate.prototype.toString = function() {
	return 'IMM['+this.max+']';
}

function Register() {
	if (this instanceof Register === false) return new Register();
	Type.call(this);
}
util.inherits(Register, Type);

Register.prototype.toString = function() {
	return 'Rn';
}

Register.prototype.check = function(value) {
	return (value instanceof R) && (value.field === 7);
}

Register.prototype.equals = function(other) {
	return other instanceof Register;
}

function RegisterAndField() {
	if (this instanceof RegisterAndField === false) return new RegisterAndField();
	Type.call(this);
}
util.inherits(RegisterAndField, Type);

RegisterAndField.prototype.check = function(value) {
	return (value instanceof R);
}

RegisterAndField.prototype.toString = function() {
	return 'REG';
}

RegisterAndField.prototype.equals = function(other) {
	return other instanceof RegisterAndField;
}


module.exports = {
	Register: Register,
	RegisterAndField: RegisterAndField,
	Immediate: Immediate
}