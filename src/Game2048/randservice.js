import { Random as LCG } from 'lcg';

class Random {
  constructor(rand = new LCG(Math.random() * (1 << 32))) {
    this.rand = rand;
  }

  get(min = 0, max = 100) {
    const result = this.rand.getIntegerBetween(min, max - 1);

    return [this.next(), result];
  }

  next() {
    const next = this.rand.next();

    return new Random(next);
  }
}

export function seedFactory(seed = 0) {
  return new Random(new LCG(seed));
};

export default Random;
