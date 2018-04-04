// class Clock {
//   constructor(id) {
//     this.id = id;
//     this.timestamp = () =>
//   }
// }

export const Clock = id => ({
  [id]: 0
});

export const tick = (clock, id) => ({
  ...clock,
  id: clock[id]++
});

export const lt = (a, b) => {
  const keys = Object.keys(Object.assign({}, a, b));
  return (
    keys.every(k => (a[k] || 0) <= (b[k] || 0)) &&
    keys.some(k => (a[k] || 0) < (b[k] || 0))
  );
};

export const gt = (a, b) => lt(b, a);

export const eq = (a, b) => Object.entries(a).every(([k, v]) => v === b[k]);

export const wasConcurrent = (a, b) => !eq(a, b) && (!gt(a, b) || !lt(a, b));

export const merge = (a, b) =>
  Object.keys(a).reduce((acc, k) => {
    acc[k] = Math.max(acc[k], a[k] || 0);
    return acc;
  }, Object.assign({}, a, b));
