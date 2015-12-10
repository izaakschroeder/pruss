# PRU

Assembler, disassembler, driver for TI's PRUSS-v2 stack.

![build status](http://img.shields.io/travis/izaakschroeder/pruss.svg?branch=master&style=flat)
![coverage](http://img.shields.io/coveralls/izaakschroeder/pruss.svg?branch=master&style=flat)
![license](http://img.shields.io/npm/l/pruss.svg?style=flat)
![version](http://img.shields.io/npm/v/pruss.svg?style=flat)
![downloads](http://img.shields.io/npm/dm/pruss.svg?style=flat)


Native support for Beaglebone's programmable real-time unit including debugger, assembler, disassembler and instructions not found in TI's default `pasm` package.

## Usage

### Driver

```javascript
var pruss = require('pruss');
// ...
// Run code on PRU0
pruss.prus[0].run('./path/to/some/firmware');
```

### Assembler

```sh
pasm --help
```

### Disassembler

```sh
pdasm --help
```

## Installation

Default BeagleBone Black installation as of November 1st 2013, (Angstrom v2012.12 (Core edition) rev 2ac8ed60f1c4152577f334b223b9203f57ed1722) does not come with the packages required for compiling nodejs C modules. This can be fixed by running:
```bash
opkg install python-compiler python-misc python-multiprocessing
```

Proceed with standard NPM installation:
```bash
npm install pruss
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

[Instruction Reference]: http://processors.wiki.ti.com/index.php/PRU_Assembly_Instructions
