const remove = (obj, k) => {
  // eslint-disable-next-line no-unused-vars
  const { [k]: omit, ...s } = obj;
  return s;
};

// Implementation of an optimized OR-set inspired Map
export default class Map {
  constructor(init = {}) {
    this.state = init;

    this.add = (k, v, id) =>
      new Map({
        ...this.state,
        [k]: [v, id]
      });

    this.get = k => this.state[k] && this.state[k][0];

    this.getKey = id =>
      Object.entries(this.state).find(([, [, i]]) => id === i)[0];

    this.remove = id => {
      const k = this.getKey(id);
      if (k) {
        return new Map(remove(this.state, k));
      }
      return this;
    };
  }
}
