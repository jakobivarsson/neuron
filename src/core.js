import immutable from "immutable";

// A state-based 2P-Set
export const Set = (...init) =>
  immutable.Map({
    elements: immutable.Set(...init),
    tombstones: immutable.Set()
  });

export const add = (element, set) =>
  set.update(
    "elements",
    e => (set.get("tombstones").includes(element) ? e : e.add(element))
  );

export const remove = (element, set) =>
  set
    .update("elements", elements => elements.delete(element))
    .update("tombstones", tombstones => tombstones.add(element));

export const merge = (a, b) => {
  const temp = a.update("tombstones", t => t.union(b.get("tombstones")));
  return temp.update("elements", e =>
    e
      .union(b.get("elements"))
      .filterNot(e => temp.get("tombstones").includes(e))
  );
};

const values = set => set.get("elements");

export const toJS = set => values(set).toJS();
