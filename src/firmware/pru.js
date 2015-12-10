
import { readFileSync } from 'fs';

export default class PRU {
  constructor(control, debug, ram, data, l3) {
    this._control = control;
    this._registers = debug;
    this._ram = ram;
    this.data = data;
    this.l3 = l3;
    this.enabled = false;
    this.singleStep = false;
    this.startAddress = 0x0;
    this.reset();
    this.registers = new Uint32Array(this._registers);
    this.control = new Uint32Array(this._control);
  }

  break() {
    if (!this.running) {
      throw new TypeError('Cannot break while PRU is idle.');
    } else if (!this.enabled) {
      throw new TypeError('Cannot break while PRU is disabled.');
    }
    this.enabled = false;
    this.singleStep = true;
  }

  resume() {
    if (this.running) {
      throw new TypeError('Cannot resume while PRU is running.');
    }
    this.singleStep = false;
    this.enabled = true;
  }

  step() {
    if (this.running) {
      throw new TypeError('Cannot step while PRU is running.');
    }
    if (!this.singleStep) {
      this.singleStep = true;
    }
    this.enabled = true;
  }

  reset() {
    this.control[0] &= ~(1 << 0);
  }

  toString() {
    return `
      enabled: ${this.enabled}
      sleeping: ${this.sleeping}
      running: ${this.running}
      start address: 0x${this.startAddress.toString(16)}
      program counter: 0x${this.programCounter.toString(16)}
      single stepping: ${this.singleStep}`;
  }

  load(program) {
    if (this.running) {
      throw new TypeError('Cannot load new programs while PRU is running.');
    }
    if (Buffer.isBuffer(program)) {
      if (program.length % 4 !== 0) {
        throw new TypeError('Invalid number of instructions.');
      }
      program.copy(this.ram);
      this.ram.fill(0, program.length);
    } else if (typeof program === 'string') {
      this.load(readFileSync(program));
    }
    throw new TypeError('Invalid program.');
  }

  run(program) {
    this.enabled = false;
    //  this.singleStep = false;
    this.startAddress = 0x0;
    this.load(program);
    this.enabled = true;
  }

  close() {
    this.enabled = false;
    this.reset();
  }

  get startAddress() {
    return this.control.readUInt16LE(2);
  }

  set startAddress(val) {
    this.control.writeUInt16LE(val, 2);
  }

  get running() {
    return !!(this.control[1] & (1 << 7));
  }

  get singleStep() {
    return !!(this.control[1] & (1 << 0));
  }

  set singleStep(val) {
    if (val) {
      this.control[1] |= (1 << 0);
    } else {
      this.control[1] &= ~(1 << 0);
    }
  }

  get sleeping() {
    return !!(this.control[0] & (1 << 2));
  }

  set sleeping(val) {
    if (val) {
      this.control[0] |= (1 << 2);
    } else {
      this.control[0] &= ~(1 << 2);
    }
  }

  get enabled() {
    return !!(this.control[0] & (1 << 1));
  }

  set enabled(val) {
    if (val) {
      this.control[0] |= (1 << 1);
    } else {
      this.control[0] &= ~(1 << 1);
    }
  }

  get cycleCountEnabled() {
    return !!(this.control[0] & 1);
  }

  set cycleCountEnabled(val) {
    if (val) {
      this.control[0] |= (1 << 3);
    } else {
      this.control[0] &= ~(1 << 3);
    }
  }

  get cycles() {
    return this.control.readUInt32LE(0xC);
  }

  get programCounter() {
    return this.control.readUInt16LE(0x4);
  }

  get ram() {
    if (this.running) {
      throw new TypeError('Cannot access IRAM while running.');
    }
    return this._ram;
  }
}
