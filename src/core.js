import immutable from "immutable";

// A state-based 2P-Set
export const Set = () =>
  immutable.Map({
    elements: immutable.Set(),
    tombstones: immutable.Set()
  });

export const add = (element, set) => {
  return set.update("elements", elements => elements.add(element));
};

export const remove = (element, set) => {
  set
    .update("elements", elements => elements.delete(element))
    .update("tombstones", tombstones => tombstones.add(element));
};

export const merge = (a, b) => {
  const temp = a.update("tombstones", t => t.union(b.get("tombstones")));
  return temp.update("elements", e =>
    e.union(b.get("elements")).filter(e => temp.get("tombstones").includes(e))
  );
};

export const toJS = set => set.get("elements").toJS();
