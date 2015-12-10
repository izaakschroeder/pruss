
import PRU from './pru';

export default class PRUManager {

  static firmware = [ {
    name: 'AM33XX',
    rev: 0x4E82A900,
    intc: { start: 0x20000, end: 0x22000 },
    control: { start: 0x26000, end: 0x28000 },
    frequency: 200000000, // 200 MHz
    prus: [
      {
        control: { start: 0x22000, end: 0x22400 },
        debug: { start: 0x22400, end: 0x24000 },
        ram: { start: 0x34000, end: 0x38000 },
        data: { start: 0x0000, end: 0x2000 },
      },
      {
        control: { start: 0x24000, end: 0x24400 },
        debug: { start: 0x24400, end: 0x26000 },
        ram: { start: 0x38000, end: 0x40000 },
        data: { start: 0x2000, end: 0x4000 },
      },
    ],
    shared: 0x10000,
  } ]

  constructor(base, l3) {
    // Search for valid PRUSS by checking for specific firmware revisions
    const firmwares = PRUManager.firmware.filter(firmware => {
      return (base.readUInt32LE(firmware.intc.start) === firmware.rev);
    });

    // If we can't find firmware then bail
    if (firmwares.length !== 1) {
      throw new TypeError('Unable to find valid firmware for PRU.');
    }

    // Setup the firmware
    const firmware = this.firmware = firmwares[0];

    // Map in the L3 shared RAM
    this.data = l3;
    // Map in useful memory locations
    this.base = base;
    this.control = base.slice(firmware.control.start, firmware.control.end);
    this.intc = base.slice(firmware.intc.start, firmware.intc.end);

    // Copy in some useful firmware properties
    this.name = firmware.name;
    this.frequency = firmware.frequency;

    // Enable OCP by default
    this.ocp = true;

    // Assign all PRUs
    this.prus = firmware.prus.map(function(pru) {
      return new PRU(
        base.slice(pru.control.start, pru.control.end),
        base.slice(pru.debug.start, pru.debug.end),
        base.slice(pru.ram.start, pru.ram.end),
        base.slice(pru.data.start, pru.data.end),
        l3
      );
    });

    process.on('exit', () => {
      this.prus.forEach(pru => pru.close());
      this.close();
    });
  }

  get ocp() {
    return !(this.control[4] & (1 << 4));
  }

  set ocp(val) {
    if (!val) {
      this.control[4] |= (1 << 4);
    } else {
      this.control[4] &= ~(1 << 4);
    }
  }

  close() {

  }

  toString() {
    return `
      firmware: ${this.firmware.name} (0x${this.firmware.rev.toString(16)})
      ocp enabled: ${this.ocp}`;
  }
}
