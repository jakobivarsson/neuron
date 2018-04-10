import List from "../list";

describe("List", () => {
  test("insert", () => {
    let l = new List();
    expect(l.values()).toEqual([]);
    l = l.insert(undefined, "a", "0");
    expect(l.values()).toEqual(["a"]);
    l = l.insert("0", "b", "1");
    expect(l.values()).toEqual(["a", "b"]);
  });

  test("remove", () => {
    const l = new List()
      .insert(undefined, "a", "0")
      .insert("0", "b", "1")
      .insert("1", "c", "2")
      .remove("1");
    expect(l.values()).toEqual(["a", "c"]);
  });
});
