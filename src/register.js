// LWW-register
// Implemented as an immutable class

export default class Register {
  constructor(value, timestamp = 0) {
    this.value = value;
    this.timestamp = timestamp;
  }

  get() {
    return this.value;
  }

  update(value, timestamp) {
    if (timestamp > this.timestamp) {
      return new Register(value, timestamp);
    }
    return this;
  }
}
