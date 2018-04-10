// Logical clock
export default class Clock {
  constructor(init = 0, id) {
    this.clock = init;
    this.id = id;
  }

  tick() {
    return new Clock(this.clock++, this.id);
  }

  timestamp() {
    return `${this.clock}.${this.id}`;
  }
}
