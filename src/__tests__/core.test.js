import * as ops from "../ops";
import Store from "../core";
import Register from "../crdts/register";

describe("core", () => {
  describe("constructor", () => {
    test("serialize", () => {
      // init + serialize
      let init = {
        a: "b",
        c: ["d", { e: "f" }]
      };
      expect(new Store("a", init).serialize()).toEqual(init);
      init = [1, 2, 3];
      expect(new Store("a", init).serialize()).toEqual(init);
    });
  });

  describe("prepare", () => {
    test("ADD", () => {
      const store = new Store("a");
      const value = new Register("world");
      const field = "hello";
      const op = store.prepare([field], ops.ADD, value);
      expect(op).toMatchObject({
        type: ops.ADD,
        value,
        field
      });
    });

    test("invalid path should throw", () => {
      const store = new Store("a");
      expect(() => {
        store.prepare(["hello", ["world"]], ops.ADD, new Register("asdf"));
      }).toThrow();
      expect(() => {
        store.prepare([], ops.ADD, new Register("asdf"));
      }).toThrow();
    });

    test("invalid operation should throw", () => {
      const store = new Store("a");
      expect(() => {
        store.prepare(["hello"], "asdf", new Register("asdf"));
      }).toThrow();
      expect(() => {
        store.prepare(["hello"], ops.INSERT, new Register("asdf"));
      }).toThrow();
    });

    test("INSERT", () => {
      const s = new Store("a", []);
      const op = s.prepare([0], ops.INSERT, "hello");
      expect(op).toMatchObject({
        type: ops.INSERT
      });
    });

    test("MOVE", () => {
      const s = new Store("a", [1, 2]);
      const op = s.prepare([1], ops.MOVE, 0);
      expect(op).toMatchObject({
        type: ops.MOVE
      });
    });
  });

  describe("apply", () => {
    test("ADD", () => {
      const s = new Store("a");
      const op = s.prepare(["hello"], ops.ADD, new Register("world"));
      s.apply(op);
      expect(s.serialize()).toEqual({ hello: "world" });
    });
    test("REMOVE map", () => {
      const s = new Store("a", { hello: "world", a: 1 });
      const op = s.prepare(["hello"], ops.REMOVE);
      s.apply(op);
      expect(s.serialize()).toEqual({ a: 1 });
    });
    test("REMOVE list", () => {
      const s = new Store("a", [1, 2, 3]);
      const op = s.prepare([1], ops.REMOVE);
      s.apply(op);
      expect(s.serialize()).toEqual([1, 3]);
    });
    test("INSERT", () => {
      const s = new Store("a", [1, 2, 3]);
      const op = s.prepare([1], ops.INSERT, new Register(4));
      s.apply(op);
      expect(s.serialize()).toEqual([1, 4, 2, 3]);
    });
    test("SET", () => {
      const s = new Store("a", { a: 1 });
      const op = s.prepare(["a"], ops.SET, 2);
      s.apply(op);
      expect(s.serialize()).toEqual({ a: 2 });
    });
    test("MOVE", () => {
      const s = new Store("a", [1, 2]);
      s.apply(s.prepare([1], ops.MOVE, 0));
      expect(s.serialize()).toEqual([2, 1]);
      s.apply(s.prepare([1], ops.MOVE, 0));
      expect(s.serialize()).toEqual([1, 2]);
    });
  });
});
