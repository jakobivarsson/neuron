import * as set from "../src/core";

describe("2P-set", () => {
  test("add", () => {
    const s = set.add(1, set.Set());
    expect(set.toJS(s)).toEqual([1]);
  });

  test("remove", () => {
    const s = set.remove(1, set.Set([1]));
    expect(set.toJS(s)).toEqual([]);
  });

  test("a removed element can not be added again", () => {
    const s1 = set.remove(1, set.Set([1]));
    const s2 = set.add(1, s1);
    expect(s2).toEqual(s1);
  });

  test("merge", () => {
    const a = set.Set([1, 2]);
    const b = set.Set([2, 3]);
    const res = set.merge(a, b);
    expect(set.toJS(res)).toEqual([1, 2, 3]);
    expect(set.merge(a, b)).toEqual(set.merge(b, a));
  });

  test("merge add/remove conflict", () => {
    const start = set.Set([1]);
    const a = set.remove(1, start);
    expect(set.merge(start, a)).toEqual(a);
  });

  test("toJS", () => {
    let s = set.Set([1, 2]);
    s = set.remove(1, s);
    expect(set.toJS(s)).toEqual([2]);
  });
});
