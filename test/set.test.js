import Set from "../src/set";

describe("Set", () => {
  test("add", () => {
    let s = new Set().add("a", 1);
    expect(s.values()).toEqual([1]);
    s = s.add("b", 2);
    expect(s.values()).toEqual([1, 2]);
  });

  test("remove", () => {
    const s = new Set().add("a", 1).remove("a");
    expect(s.values()).toEqual([]);
  });
});
