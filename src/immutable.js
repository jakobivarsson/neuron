// Immutable helper functions

export const add = (obj, k, v) => ({
  ...obj,
  [k]: v
});

export const remove = (obj, k) => {
  // eslint-disable-next-line no-unused-vars
  const { [k]: omit, ...s } = obj;
  return s;
};
