
var pruss = require('../lib/pru'), AM33XX = require('am33xx');

var program = pruss.createProgram()
	.mov(pruss.r0, AM33XX.gpio[1].set)
	.mov(pruss.r1, 1 << 7)
	.sbbo(pruss.r1, pruss.r0, 0, 4)
	.halt();

pruss.prus[0].run(program);