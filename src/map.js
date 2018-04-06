import { add, remove } from "./immutable";

// Id should be a globally unique id
const Entry = (key, value, id) => ({ key, value, id });

// Implementation of an optimized OR-set inspired Map
export default class Map {
  constructor(init = {}) {
    this.state = init;
  }

  add(k, v, id) {
    return new Map(add(this.state, k, Entry(k, v, id)));
  }

  get(k) {
    const e = this.state[k];
    return e && e.value;
  }

  getId(k) {
    const e = this.state[k];
    return e && e.id;
  }

  getKey(id) {
    return Object.values(this.state).find(entry => id === entry.id).key;
  }

  remove(id) {
    const k = this.getKey(id);
    return new Map(remove(this.state, k));
  }
}
