
'use strict';

var
	fs = require('fs'),
	//Silicon = require('./silicon'),
	UIO = require('./uio'),
	PRU = require('./pru'),
	util = require('util');

function Silicon() {

}



function PRUManager(id) {
	Silicon.call(this);
	var
		self = this,
		//Create UIO subsystem for interaction with PRUSS
		uio = UIO.create(id),
		//Map in the PRUSS main memory
		base = this.base = uio.map(0),
		//Search for valid PRU subsystem by checking for specific firmware revisions
		firmwares = PRUManager.firmware.filter(function(firmware) {
			return (base.readUInt32LE(firmware.intc.start) === firmware.rev);
		}),
		firmware = undefined;

	//If we can't find firmware then bail
	if (firmwares.length !== 1)
		throw new TypeError('Unable to find valid firmware for PRU.');
	//Assign local silicon
	this.silicon = Silicon;
	//Setup the firmware
	firmware = this.firmware = firmwares[0];

	//Map in the L3 shared RAM
	var l3 = this.data = uio.map(1);
	//Map in useful memory locations
	this.base = base;
	this.control = base.slice(this.firmware.control.start, this.firmware.control.end);
	this.intc = base.slice(this.firmware.intc.start, this.firmware.intc.end);

	//Copy in some useful firmware properties
	this.name = firmware.name;
	this.frequency = firmware.frequency;

	//Enable OCP by default
	this.ocp = true;

	//Assign all PRUs
	this.prus = firmware.prus.map(function(pru) {
		var pru = new PRU(
			base.slice(pru.control.start, pru.control.end),
			base.slice(pru.debug.start, pru.debug.end),
			base.slice(pru.ram.start, pru.ram.end),
			base.slice(pru.data.start, pru.data.end),
			l3
		);
		return pru;
	});

	process.on('exit', function() {
		self.prus.forEach(function(pru) { pru.close(); });
		self.close();
	});
}
util.inherits(PRUManager, Silicon);
PRUManager.firmware = [{
	name: 'AM33XX',
	rev: 0x4E82A900,
	intc: { start: 0x20000, end: 0x22000 },
	control: { start: 0x26000, end: 0x28000 },
	frequency: 200000000, //200 MHz
	prus: [
		{
			control: { start: 0x22000, end: 0x22400 },
			debug: { start: 0x22400, end: 0x24000 },
			ram: { start: 0x34000, end: 0x38000 },
			data: { start: 0x0000, end: 0x2000 }
		},
		{
			control: { start: 0x24000, end: 0x24400 },
			debug: { start: 0x24400, end: 0x26000 },
			ram: { start: 0x38000, end: 0x40000 },
			data: { start: 0x2000, end: 0x4000 }
		}
	],
	shared: 0x10000
}];

PRUManager.create = function(id) {
	return new PRUManager(id);
}

//set SRSR0 in firmware to trigger interrupt

Object.defineProperty(PRUManager.prototype, 'ocp', {
	get: function() {
		return !(this.control[4] & (1 << 4))
	},
	set: function(val) {
		if (!val)
			this.control[4] |= (1 << 4);
		else
			this.control[4] &= ~(1 << 4);
	}
})

PRUManager.prototype.toString = function() {
	return ''+
		'firmware: '+this.firmware.name+' (0x'+this.firmware.rev.toString(16)+'); '+
		'ocp enabled: '+this.ocp;
}

PRUManager.prototype.close = function() {
	this.base.unmap();
	this.data.unmap();
}

function find() {
	var uios = fs.readdirSync('/sys/bus/platform/devices/4a300000.pruss/uio/');
	if (uios.length <= 0) throw new Error();
	return PRUManager.create(parseInt(uios[0].replace('uio', ''), 10));
}

module.exports = find();
