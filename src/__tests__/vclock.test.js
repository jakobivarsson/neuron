import * as c from "../vclock";

describe("vclock", () => {
  test("lt", () => {
    const a = { a: 1 };
    const b = { a: 1, b: 2 };
    expect(c.lt(a, b)).toBe(true);
    expect(c.gt(b, a)).toBe(true);
    a.a = 2;
    expect(c.lt(a, b)).toBe(false);
  });

  test("wasConcurrent", () => {
    const a = { a: 1 };
    const b = { a: 1, b: 2 };
    expect(c.wasConcurrent(a, b)).toBe(false);
    a.a = 2;
    expect(c.wasConcurrent(a, b)).toBe(true);
  });

  test("merge", () => {
    const a = { a: 1, b: 3, c: 5 };
    const b = { b: 2, c: 6, d: 2 };
    expect(c.merge(a, b)).toEqual({ a: 1, b: 3, c: 6, d: 2 });
  });
});
