import { add, remove } from "../immutable";

describe("immutable helper functions", () => {
  test("add", () => {
    const a = {};
    const b = add(a, "a", 1);
    expect(b).not.toBe(a);
    expect(b).toEqual({ a: 1 });
  });

  test("remove", () => {
    const a = { a: 1, b: 2 };
    const b = remove(a, "c");
    expect(b).toBe(a);
    const c = remove(a, "b");
    expect(c).not.toBe(a);
    expect(c).toEqual({ a: 1 });
  });
});
