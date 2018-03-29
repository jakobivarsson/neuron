import * as set from "../src/core";

test("2P-Set add", () => {
  const s = set.add(1, set.Set());
  expect(set.toJS(s)).toEqual([1]);
});
