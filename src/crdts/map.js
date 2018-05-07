import { add, remove } from "../immutable";

// Id should be a globally unique id
const Entry = (key, value, id) => ({ key, value, id });

// Implementation of an optimized OR-set inspired Map
export default class Map {
  constructor(init = {}) {
    this.state = init;
  }

  entries() {
    return Object.entries(this.state).map(([k, v]) => [k, v.id]);
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
    const e = Object.values(this.state).find(entry => id === entry.id);
    return e && e.key;
  }

  // Concurrent adds essentialy works as a LWW register where the add with the highest id wins.
  // TODO Do we need the MV-register which has the same behavior or can we just use immutable values with unique id? Would this work for the list type?
  add(k, v, id) {
    const prevId = this.getId(k);
    if (!prevId || id > prevId) {
      return new Map(add(this.state, k, Entry(k, v, id)));
    }
    return this;
  }

  remove(id, k) {
    if (id === this.getId(k)) {
      return new Map(remove(this.state, k));
    }
    return this;
  }
}
