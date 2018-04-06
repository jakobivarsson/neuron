import { add, remove } from "./immutable";

// OR-Set
export default class Set {
  constructor(init = {}) {
    this.entries = init;
  }

  get() {
    return Object.values(this.entries);
  }

  add(id, value) {
    return new Set(add(this.entries, id, value));
  }

  remove(id) {
    return new Set(remove(this.entries, id));
  }
}
