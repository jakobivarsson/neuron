import { Map } from "immutable";

// OR-Set
export default class Set {
  constructor(init = Map()) {
    this.entries = init;
  }

  values() {
    return Array.from(this.entries.values());
  }

  keys() {
    return Array.from(this.entries.keys());
  }

  get(id) {
    return this.entries.get(id);
  }

  has(id) {
    return this.has(id);
  }

  add(id, value) {
    return new Set(this.entries.set(id, value));
  }

  remove(id) {
    return new Set(this.entries.delete(id));
  }
}
