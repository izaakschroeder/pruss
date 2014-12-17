
var silicon = require('../lib/silicon');

var program = silicon.instructions;

//console.log(silicon.instructions[0].encode([0, 0, [0x0, 0x7], [0x0, 0x7], [0x0, 0x7]]));
//console.log(''+silicon.instructions[0].decode(0x009a999f))

//console.log(silicon.instructions[0].bits);
console.log(''+program.adc(silicon.r4, silicon.r0, 0xFF));
console.log(''+program.mov(silicon.r0, silicon.r1).split());
console.log(''+program.mov(silicon.r5, 0x32A5).split());
console.log(''+program.mov(silicon.r1, 0xFFEEEEDD).split());