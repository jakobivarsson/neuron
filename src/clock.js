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

  update(clock) {
    if (this.clock < clock) {
      this.clock = clock;
    }
  }

  // Since id is unique the timestamp is also unique
  timestamp() {
    return `${this.clock}.${this.id}`;
  }
}
