// Immutable helper functions

export const add = (obj, k, v) => ({
  ...obj,
  [k]: v
});

export const remove = (obj, k) => {
  if (!obj[k]) {
    return obj;
  }
  // eslint-disable-next-line no-unused-vars
  const { [k]: omit, ...s } = obj;
  return s;
};
