import { Random as LCG } from 'lcg';

const computeSeed = () => Math.random() * Math.pow(2, 32);

class Random {
  constructor(seed) {
    this.rand = new LCG(computeSeed());
    if(typeof seed !== 'undefined') {
      this.rand._value = seed;
    }
  }

  set seed(seed) {
    this.rand._value = seed;
  }

  get seed() {
    return this.rand._value;
  }

  get(min = 0, max = 100) {
    const result = this.rand.getIntegerBetween(min, max - 1);

    return [this.next(), result];
  }

  next() {
    const next = this.rand.next();
    const res = new Random();
    res.rand = next;

    return res;
  }
}

export default Random;
