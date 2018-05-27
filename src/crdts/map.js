import { Map as M } from "immutable";

// Id should be a globally unique id
const Entry = (key, value, id) => ({ key, value, id });

// Implementation of an optimized OR-set inspired Map
export default class Map {
  constructor(init = M()) {
    this.state = init;
  }

  entries() {
    return this.state
      .entrySeq()
      .map(([k, v]) => [k, v.id])
      .toArray();
  }

  get(k) {
    const e = this.state.get(k);
    return e && e.value;
  }

  getId(k) {
    const e = this.state.get(k);
    return e && e.id;
  }

  // Concurrent adds essentialy works as a LWW register where the add with the highest id wins.
  // TODO Do we need the MV-register which has the same behavior or can we just use immutable values with unique id? Would this work for the list type?
  add(k, v, id) {
    const prevId = this.getId(k);
    if (!prevId || id > prevId) {
      return new Map(this.state.set(k, Entry(k, v, id)));
    }
    return this;
  }

  remove(id, k) {
    if (id === this.getId(k)) {
      return new Map(this.state.remove(k));
    }
    return this;
  }
}
