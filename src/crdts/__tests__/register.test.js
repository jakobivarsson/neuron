import Register from "../register";

describe("Register", () => {
  test("get", () => {
    const r = new Register("c");
    expect(r.get()).toBe("c");
  });

  test("update", () => {
    const r = new Register("a");
    const r1 = r.update("b", "1");
    expect(r1.get()).toBe("b");
    const r2 = r1.update("c", "0");
    expect(r2).toBe(r1);
  });
});
