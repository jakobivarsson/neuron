import Clock from "../clock.js";
// LWW-register
// Implemented as an immutable class

export default class Register {
  constructor(init, timestamp = "0") {
    this.value = init;
    this.timestamp = timestamp;
  }

  get() {
    return this.value;
  }

  // timestamp must be a string
  update(value, timestamp) {
    if (Clock.lt(this.timestamp, timestamp)) {
      return new Register(value, timestamp);
    }
    return this;
  }
}
