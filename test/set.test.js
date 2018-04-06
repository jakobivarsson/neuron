import Set from "../src/set";

describe("Set", () => {
  test("add", () => {
    const s = new Set().add("a", 1);
    expect(s.get()).toEqual([1]);
  });

  test("remove", () => {
    const s = new Set().add("a", 1).remove("a");
    expect(s.get()).toEqual([]);
  });
});
