import Store from "../src/core";
import Map from "../src/crdts/map";
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

describe("scenarios", () => {
  test("concurrent move and update on nested element", () => {
    const s = new Server();
    const a = new Store("a", []);
    const b = new Store("a", []);
    s.subscribe(a);
    s.subscribe(b);

    let op = a.update([0], ops.INSERT, new Map());
    s.publish(a, op);
    op = a.update([1], ops.INSERT, new Map());
    s.publish(a, op);
    op = a.update([1], ops.MOVE, 0);
    const concurrentOp = b.update([1, "a"], ops.ADD, new Register("b"));
    s.publish(a, op);
    s.publish(b, concurrentOp);

    const aOut = a.serialize();
    const bOut = b.serialize();
    expect(aOut).toEqual(bOut);
    expect(aOut).toEqual([{ a: "b" }, {}]);
  });
});
