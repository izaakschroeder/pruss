# PRU

Native nodejs support for Beaglebone's programmable real-time unit including debugger, assembler, disassembler and instructions not found in TI's default pasm package.

## Installation

Default BeagleBone Black installation as of November 1st 2013, (Angstrom v2012.12 (Core edition) rev 2ac8ed60f1c4152577f334b223b9203f57ed1722) does not come with the packages required for compiling nodejs C modules. This can be fixed by running:
```bash
opkg install python-compiler python-misc python-multiprocessing
```

Proceed with standard NPM installation:
```bash
npm install com.izaakschroeder.beaglebone.pru
```

Finally, make sure your device tree has the PRU UIO driver enabled. It will be automatically loaded with the correct device-tree overlay. The following fragment details part of such an overlay:
```
/dts-v1/;
/plugin/;
/{
	compatible = "ti,beaglebone-black";
	part-number = "YOURPART";
	version = "YOURVERSION"; 
	fragment@0{
		target = <&pruss>;
		__overlay__{
			status = "okay";			
		};
	};
};
```

This can then be enabled by compiling and loading the overlay via capemgr:
```bash
dtc -@ -O dtb -b 0 -o YOURPART-YOURVERSION.dtbo YOURPART-YOURVERSION.dts
mv YOURPART-YOURVERSION.dtbo /lib/firmware
echo "YOURPART" > /sys/devices/bone_capemgr.*/slots
```

You can verify the PRUSS subsystem is loaded by searching for it under platform devices:
```bash
ls /sys/bus/platform/devices/ | grep pruss # Should see 4a300000.pruss or similar
```

## Usage

```javascript
var pruss = require('com.izaakschroeder.beaglebone.pru'); //Load PRUSS
pruss.prus[0].run('./path/to/some/firmware'); //Run code on PRU0
```

## Supported Opcodes

add-register: 00000000FFFRRRRRFFFRRRRRFFFRRRRR
add-immediate: 00000001IIIIIIIIFFFRRRRRFFFRRRRR
adc-register: 00000010FFFRRRRRFFFRRRRRFFFRRRRR
adc-immediate: 00000011IIIIIIIIFFFRRRRRFFFRRRRR
sub-register: 00000100FFFRRRRRFFFRRRRRFFFRRRRR
sub-immediate: 00000101IIIIIIIIFFFRRRRRFFFRRRRR
suc-register: 00000110FFFRRRRRFFFRRRRRFFFRRRRR
suc-immediate: 00000111IIIIIIIIFFFRRRRRFFFRRRRR
lsl-register: 00001000FFFRRRRRFFFRRRRRFFFRRRRR
lsl-immediate: 00001001IIIIIIIIFFFRRRRRFFFRRRRR
lsr-register: 00001010FFFRRRRRFFFRRRRRFFFRRRRR
lsr-immediate: 00001011IIIIIIIIFFFRRRRRFFFRRRRR
rsb-register: 00001100FFFRRRRRFFFRRRRRFFFRRRRR
rsb-immediate: 00001101IIIIIIIIFFFRRRRRFFFRRRRR
rsc-register: 00001110FFFRRRRRFFFRRRRRFFFRRRRR
rsc-immediate: 00001111IIIIIIIIFFFRRRRRFFFRRRRR
and-register: 00010000FFFRRRRRFFFRRRRRFFFRRRRR
and-immediate: 00010001IIIIIIIIFFFRRRRRFFFRRRRR
or-register: 00010010FFFRRRRRFFFRRRRRFFFRRRRR
or-immediate: 00010011IIIIIIIIFFFRRRRRFFFRRRRR
xor-register: 00010100FFFRRRRRFFFRRRRRFFFRRRRR
xor-immediate: 00010101IIIIIIIIFFFRRRRRFFFRRRRR
not-register: 00010110FFFRRRRRFFFRRRRRFFFRRRRR
not-immediate: 00010111IIIIIIIIFFFRRRRRFFFRRRRR
min-register: 00011000FFFRRRRRFFFRRRRRFFFRRRRR
min-immediate: 00011001IIIIIIIIFFFRRRRRFFFRRRRR
max-register: 00011010FFFRRRRRFFFRRRRRFFFRRRRR
max-immediate: 00011011IIIIIIIIFFFRRRRRFFFRRRRR
clr-register: 00011100FFFRRRRRFFFRRRRRFFFRRRRR
clr-immediate: 00011101IIIIIIIIFFFRRRRRFFFRRRRR
set-register: 00011110FFFRRRRRFFFRRRRRFFFRRRRR
set-immediate: 00011111IIIIIIIIFFFRRRRRFFFRRRRR
lmbd-register: 00100110FFFRRRRRFFFRRRRRFFFRRRRR
lmbd-immediate: 00100111IIIIIIIIFFFRRRRRFFFRRRRR
sbco-a: 1000III0FFFRRRRRIIIIIIIIIXXRRRRR
sbco-b: 1000III1IIIIIIIIIIIIIIIIIXXRRRRR
sbco-c: 10001110FFFRRRRR11IIIIIIIXXRRRRR
sbco-d: 10001111IIIIIIII11IIIIIIIXXRRRRR
lbco-a: 1001III0FFFRRRRRIIIIIIIIIXXRRRRR
lbco-b: 1001III1IIIIIIIIIIIIIIIIIXXRRRRR
lbco-c: 10011110FFFRRRRR11IIIIIIIXXRRRRR
lbco-d: 10011111IIIIIIII11IIIIIIIXXRRRRR
sbbo-a: 1110III0FFFRRRRRIIIIIIIIIXXRRRRR
sbbo-b: 1110III1IIIIIIIIIIIIIIIIIXXRRRRR
sbbo-c: 11101110FFFRRRRR11IIIIIIIXXRRRRR
sbbo-d: 11101111IIIIIIII11IIIIIIIXXRRRRR
lbbo-a: 1111III0FFFRRRRRIIIIIIIIIXXRRRRR
lbbo-b: 1111III1IIIIIIIIIIIIIIIIIXXRRRRR
lbbo-c: 11111110FFFRRRRR11IIIIIIIXXRRRRR
lbbo-d: 11111111IIIIIIII11IIIIIIIXXRRRRR
qbgt-register: 01100II0FFFRRRRRFFFRRRRRIIIIIIII
qbgt-immediate: 01100II1IIIIIIIIFFFRRRRRIIIIIIII
qbge-register: 01110II0FFFRRRRRFFFRRRRRIIIIIIII
qbge-immediate: 01110II1IIIIIIIIFFFRRRRRIIIIIIII
qblt-register: 01001II0FFFRRRRRFFFRRRRRIIIIIIII
qblt-immediate: 01001II1IIIIIIIIFFFRRRRRIIIIIIII
qble-register: 01011II0FFFRRRRRFFFRRRRRIIIIIIII
qble-immediate: 01011II1IIIIIIIIFFFRRRRRIIIIIIII
qbeq-register: 01010II0FFFRRRRRFFFRRRRRIIIIIIII
qbeq-immediate: 01010II1IIIIIIIIFFFRRRRRIIIIIIII
qbne-register: 01101II0FFFRRRRRFFFRRRRRIIIIIIII
qbne-immediate: 01101II1IIIIIIIIFFFRRRRRIIIIIIII
qbbs-register: 11010II0FFFRRRRRFFFRRRRRIIIIIIII
qbbs-immediate: 11010II1IIIIIIIIFFFRRRRRIIIIIIII
qbbc-register: 11001II0FFFRRRRRFFFRRRRRIIIIIIII
qbbc-immediate: 11001II1IIIIIIIIFFFRRRRRIIIIIIII
loop-register: 00110000XXXXXFFFXIXRRRRRIIIIIIII
loop-immediate: 00110001XXXXXXXXXIXIIIIIIIIIIIII
jmp: 00100001IIIIIIIIIIIIIIIIXXXXXXXX
jal: 00100011IIIIIIIIIIIIIIIIFFFRRRRR
ldi: 00100100FFFRRRRRIIIIIIIIIIIIIIII
halt: 00101010000000000000000000000000
slp: 00011111000000000000000000000000

op('loop', '0011000'),

//Quick branch if bit-set
		op('qbbs', '11010'),
		//Quick branch if bit-clear
		op('qbbc', '11001')
		//Unsigned integer add
		op('add',  '0000000'),
		//Unsigned integer add with carry
		op('adc',  '0000001'),
		//Unsigned integer subtract
		op('sub',  '0000010'),
		//Unsigned integer subract with carry
		op('suc',  '0000011'),
		//Logical shift left
		op('lsl',  '0000100'),
		//Logical shift right
		op('lsr',  '0000101'),
		//Reverse unsigned integer subtract
		op('rsb',  '0000110'),
		//Reverse unsigned integer subtract with carry
		op('rsc',  '0000111'),
		//Bitwise and
		op('and',  '0001000'),
		//Bitwise or
		op('or',   '0001001'),
		//Bitwise xor
		op('xor',  '0001010'),
		//Copy minimum
		op('min',  '0001100'),
		//Copy maximum
		op('max',  '0001101'),
		//Clear bit
		op('clr',  '0001110'),
		//Set bit
		op('set',  '0001111'),
		//Left-most bit detect
		op('lmbd', '0010011'),
		op('not',  '0001011')
		//Store byte burst with constant offset table
		op('sbco', '1000'),
		//Load byte burst with constant offset table
		op('lbco', '1001'),
		//Store byte burst
		op('sbbo', '1110'),
		//Load byte burst
		op('lbbo', '1111'),
		//Quick branch if greater than
		op('qbgt', '01100'),
		//Quick branch if greater than or equal
		op('qbge', '01110'),
		//Quick branch if less than
		op('qblt', '01001'),
		//Quick branch if less than or equal
		op('qble', '01011'),
		//Quick branch if equal
		op('qbeq', '01010'),
		//Quick branch if not equal
		op('qbne', '01101')
		opcode: op('jmp', '0010000'),
		opcode: op('jal', '00100011'),
	//Load immediate
	opcode: op('ldi', '00100100'),
	opcode: op('halt', '00101010000000000000000000000000')
	opcode: op('slp',  '00111110X00000000000000000000000'),