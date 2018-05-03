// Logical clock
//
// Id needs to be a unique id for the process
export default class Clock {
  constructor(id, init = 0) {
    this.clock = init;
    this.id = id;
  }

  tick() {
    return new Clock(this.id, this.clock++);
  }

  update(other) {
    if (this.clock < other.clock) {
      this.clock = other.clock;
    }
  }

  // Since id is unique the timestamp is also unique
  timestamp() {
    return `${this.clock}.${this.id}`;
  }

  static parse(timestamp) {
    const [clockStr, id] = timestamp.split(".", 1);
    const clock = Number(clockStr);

    if (!clock) {
      throw new Error(`Cannot parse timestamp: ${timestamp}`);
    }
    return new Clock(id, clock);
  }
}
