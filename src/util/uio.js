
import { readFileSync, read, openSync, writeFileSync } from 'fs';
import mmap from 'mmap-io';
import EventEmitter from 'events';

export default class UIO extends EventEmitter {
  static pageSize = 4096;

  constructor(id) {
    super();
    this.id = id;
    this.fd = openSync(`/dev/uio${id}`, 'r+');
  }

  check() {
    const iBuffer = new Buffer(4);
    read(this.fd, iBuffer, 0, iBuffer.length, 0, (err) => {
      if (err) {
        this.emit('error', err);
      } else {
        const count = iBuffer.readInt32LE(0);
        if (count > 1) {
          this.emit('overflow', count);
        }
        this.emit('interrupt');
        this.check();
      }
    });
  }

  map(id) {
    const base = `/sys/class/uio/uio${this.id}/maps/map${id}`;
    const size = readFileSync(`${base}/size`);
    const addr = parseInt(readFileSync(`${base}/addr`).toString('ascii'), 16);
    const data = mmap.map(
      size,
      mmap.PROT_READ | mmap.PROT_WRITE,
      mmap.MAP_SHARED,
      this.fd,
      id * mmap.PAGESIZE
    );
    const slice = data.slice;
    data.address = addr;
    data.slice = function(start) {
      const result = slice.apply(this, arguments);
      result.address = addr + start;
      return result;
    };
    return data;
  }

  // TODO: Something sensible here.
  lock() {
    writeFileSync(`/var/lock/LCK..uio${this.id}`, process.id);
  }

  unlock() {

  }
}
