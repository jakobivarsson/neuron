import Map from "../map";

describe("Map", () => {
  test("add", () => {
    let m = new Map();
    m = m.add("a", "b", 0);
    expect(m.get("a")).toBe("b");
    m = m.add("b", "c", 1);
    expect(m.get("b")).toBe("c");
  });

  test("concurrent add to the same key", () => {
    let m = new Map();
    m = m.add("a", "c", 1);
    m = m.add("a", "b", 0);
    expect(m.get("a")).toBe("c");
  });

  test("getId", () => {
    const m = new Map().add("a", 0, "b");
    expect(m.getId("a")).toBe("b");
  });

  test("remove", () => {
    let m = new Map();
    m = m.add("a", "b", 0);
    m = m.add("b", "c", 1);
    m = m.remove(0, "a");
    expect(m.get("a")).toBeUndefined();
    expect(m.get("b")).toBe("c");
  });
});
