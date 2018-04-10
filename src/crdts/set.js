import { add, remove } from "../immutable";

// OR-Set
export default class Set {
  constructor(init = {}) {
    this.entries = init;
  }

  values() {
    return Object.values(this.entries);
  }

  get(id) {
    return this.entries[id];
  }

  has(id) {
    return !!this.get(id);
  }

  add(id, value) {
    return new Set(add(this.entries, id, value));
  }

  remove(id) {
    return new Set(remove(this.entries, id));
  }
}
