
var pruss = require('pru'), AM33XX = require('am33xx'), pru = pruss.prus[0];

pruss.prus[0].program()
	
	//-----------------------------------------
	//----- INITIALIZATION
	//-----------------------------------------
	
	//There wil be 5 blinks
	.mov(r10, 5)

	.label('tick')
	//Load address of control register into r0
	.mov(r0, pru.control)
	//Move control register data into r1
	.lbbo(r1, r0, 0, 4)
	//Clear the "enable counter" bit so that it
	//stops counting and we can manipulate it
	.clr(r1, r1, 3)
	//Write the new value of the control register
	//back to memory
	.sbbo(r1, r0, 0, 4)
	//Write the new value of the cycle counter 
	//(zero in this case)
	.mov(r2, 0)
	//Store that data at the location of the cycle
	//count in memory
	.sbbo(r2, r0, 0xC, 4)
	//Go back and set the bit for enabling the cycle
	//counter
	.set(r1, r2, 3)
	//Store that back to memory so the cycle counter
	//is now at 0 and is counting up
	.sbbo(r1, r0, 0, 4)

	//-----------------------------------------
	//----- DELAY LOOP
	//-----------------------------------------

	//Calculate the number of cycles to wait given
	//the target number of ms (1 second in this case)
	.mov(r2, Math.round(pru.frequency / 1e6 * 1000) )
	//Load address of the control register to r0
	.mov(r0, pru.control)
	//Load cycle count from control register into r1
	.lbbo(r1, r0, 0xC, 4)
	//If cycles waiting (r2) is greater than cycles 
	//ran (r1), we still need to wait some more so
	//continue to spin.
	.qbgt(-1, r1, r2)

	//-----------------------------------------
	//----- ACTION
	//-----------------------------------------

	//If r11 is 0 then
	.qbeq(4, r11, 1)
		//Go to clear the LED
		.mov(r0, AM33XX.gpio[1].clear)
		//And set r11 to 1 for next time
		.mov(r11, 1)
		.qba(3)
		//Otherwise
		//Go to set the LED
		.mov(r0, AM33XX.gpio[1].clear)
		//And set r11 to 0 for the next time
		.mov(r11, 0)
	//Select GPIO1[7]
	.mov(r1, 1 << 7)
	//Write data to the port
	.sbbo(r1, r0, 0, 4)

	//-----------------------------------------
	//----- REPEAT
	//-----------------------------------------

	.sub(r10, r10, 1)
	.qbgt('tick', r10, 0)

	.halt();

