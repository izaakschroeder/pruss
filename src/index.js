import fs from 'fs';
import PRUSS from './firmware/pruss';
import UIO from './util/uio';

function find() {
  const uios = fs.readdirSync('/sys/bus/platform/devices/4a300000.pruss/uio/');
  if (uios.length <= 0) {
    throw new Error();
  }
  const id = parseInt(uios[0].replace('uio', ''), 10);
  // Create UIO subsystem for interaction with PRUSS
  const uio = new UIO(id);
  return new PRUSS(uio.map(0), uio.map(1));
}

export default find();
