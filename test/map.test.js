import Map from "../src/map";

describe("Map", () => {
  test("add", () => {
    let m = new Map();
    m = m.add("a", "b", 0);
    expect(m.get("a")).toBe("b");
    m = m.add("b", "c", 1);
    expect(m.get("b")).toBe("c");
  });

  test("remove", () => {
    let m = new Map();
    m = m.add("a", "b", 0);
    m = m.add("b", "c", 1);
    m = m.remove(0);
    expect(m.get("a")).toBeUndefined();
    expect(m.get("b")).toBe("c");
  });
});
