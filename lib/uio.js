
var fs = require('fs'), mmap = require('mmap'), EventEmitter = require('events').EventEmitter;

//http://www.free-electrons.com/kerneldoc/latest/DocBook/uio-howto/
function UIO(id) {
	EventEmitter.call(this);
	var self = this, iBuffer = new Buffer(4);
	this.id = id;
	this.fd = fs.openSync('/dev/uio'+id, 'r+');
	(function check() {
		fs.read(this.fd, iBuffer, 0, iBuffer.length, 0, function(err, read, buffer) {
			if (err)
				return self.emit('error', err);
			var count = iBuffer.readInt32LE(0);
			if (count > 1)
				self.emit('overflow', count);
			self.emit('interrupt');
			check();
		})
	});
}
UIO.pageSize = 4096;

UIO.create = function(id) {
	return new UIO(id);
}

UIO.prototype.lock = function(id) {
	fs.writeFileSync('/var/lock/LCK..uio'+id, process.id)
}

UIO.prototype.map = function(id) {
	var 
		base = '/sys/class/uio/uio'+this.id+'/maps/map'+id;
		size = fs.readFileSync(base+'/size'),
		address = parseInt(fs.readFileSync(base+'/addr').toString('ascii'), 16),
		data = mmap(size, mmap.PROT_READ | mmap.PROT_WRITE, mmap.MAP_SHARED, this.fd, id * UIO.pageSize),
		slice = data.slice;
	data.address = address;
	data.slice = function(start, end) {
		var result = slice.apply(this, arguments);
		result.address = address + start;
		return result;
	}
	return data;
}

module.exports = UIO;

