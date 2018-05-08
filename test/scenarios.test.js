import Store from "../src/core";
import Map from "../src/crdts/map";
import List from "../src/crdts/list";
import Register from "../src/crdts/register";
import * as ops from "../src/ops";

// Emulates a simple publish subscribe server
class Server {
  constructor() {
    this.clients = [];
  }

  subscribe(client) {
    this.clients.push(client);
  }

  publish(client, message) {
    this.clients.forEach(c => {
      if (c !== client) {
        c.apply(message);
      }
    });
  }
}

class Client extends Store {
  constructor(id, init, server) {
    super(id, init);
    server.subscribe(this);
    this.server = server;
    this.pending = [];
  }

  // All pending must be published since we require causal ordering
  publish() {
    this.pending.forEach(op => {
      this.server.publish(this, op);
    });
    this.pending = [];
    return this;
  }

  update(...args) {
    const op = this.prepare(...args);
    this.apply(op);
    this.pending.push(op);
    return this;
  }
}

const Create = init => {
  const server = new Server();
  return {
    server,
    a: new Client("a", init, server),
    b: new Client("b", init, server),
    expect(toEqualValue) {
      const aOut = this.a.serialize();
      const bOut = this.b.serialize();
      expect(aOut).toEqual(bOut);
      expect(aOut).toEqual(toEqualValue);
    },
    sync() {
      this.a.publish();
      this.b.publish();
      return this;
    }
  };
};

describe("scenarios", () => {
  test("concurrent move and update on nested element", () => {
    // Start state
    const c = Create([]);
    c.a
      .update([0], ops.INSERT, new Map())
      .update([1], ops.INSERT, new Map())
      .publish();

    // Concurrent operations
    c.a.update([1], ops.MOVE, 0);
    c.b.update([1, "a"], ops.ADD, new Register("b"));

    c.sync().expect([{ a: "b" }, {}]);
  });

  test("concurrent move and insertion on nested element", () => {
    // Start state
    const c = Create([]);
    c.a
      .update([0], ops.INSERT, new Register("a"))
      .update([1], ops.INSERT, new Register("b"))
      .publish();

    // Concurrent operations
    c.a.update([1], ops.MOVE, 0);
    c.b.update([2], ops.INSERT, new Register("c"));

    c.sync().expect(["b", "a", "c"]);
  });

  test("concurrent map add to the same key and perform nested update", () => {
    const c = Create({});

    // Conccurent operations
    c.a.update(["theme"], ops.ADD, new Map());
    c.a.update(["theme", "backgroundColor"], ops.ADD, new Register("white"));
    c.b.update(["theme"], ops.ADD, new Map());
    c.b.update(["theme", "textColor"], ops.ADD, new Register("black"));

    // Updates are not merged
    c.sync().expect({ theme: { textColor: "black" } });
  });

  test("concurrent insertions to same list", () => {
    const c = Create({});
    c.a.update(["title"], ops.ADD, new List()).publish();

    // Conccurent operations
    c.a
      .update(["title", 0], ops.INSERT, new Register("l"))
      .update(["title", 1], ops.INSERT, new Register("l"))
      .update(["title", 2], ops.INSERT, new Register("o"));
    c.b
      .update(["title", 0], ops.INSERT, new Register("h"))
      .update(["title", 1], ops.INSERT, new Register("e"));

    c.sync().expect({ title: ["h", "e", "l", "l", "o"] });
  });

  test("concurrent map add to different keys", () => {
    const c = Create({});
    const title = "hello";
    const description = "A presentation about something";

    // Conccurent operations
    c.a.update(["title"], ops.ADD, new Register(title));
    c.b.update(["description"], ops.ADD, new Register(description));

    c.sync().expect({ title, description });
  });
});
