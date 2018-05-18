import fs from "fs";
import Store from "../src/core";
import * as ops from "../src/ops";
import { fromJS } from "immutable";

let init = JSON.parse(fs.readFileSync("data/init.json"));
let data = JSON.parse(fs.readFileSync("data/ops.json"));

const s = new Store("a", init);

const measure = fn => {
  const start = process.hrtime();
  fn();
  const end = process.hrtime(start);
  const ns = end[0] * 1e9 + end[1];
  return ns;
};

const crdt = measure(() => {
  let op;
  let time;
  const prepare = [];
  const apply = [];
  const mem = [];
  const payload = [];
  const gc = [];
  data.forEach((params, i) => {
    if (i > 0 && i % 100 === 0) {
      time = measure(() => {
        s.gc();
      });
      gc.push(time);
    }
    time = measure(() => {
      op = s.prepare(...params);
    });
    prepare.push([params[1], time]);
    const payloadSize = JSON.stringify(op).length;
    payload.push(payloadSize);
    time = measure(() => {
      s.apply(op);
    });
    apply.push([params[1], time]);
    const size = JSON.stringify(s.store).length;
    mem.push(size);
  });
  fs.writeFileSync("data/benchmark-prepare.json", JSON.stringify(prepare));
  fs.writeFileSync("data/benchmark-apply.json", JSON.stringify(apply));
  fs.writeFileSync("data/benchmark-crdt-mem.json", JSON.stringify(mem));
  fs.writeFileSync("data/benchmark-crdt-payload.json", JSON.stringify(payload));
});

console.log(`Ran CRDT benchmark in ${crdt} ns`);

class Immutable {
  constructor(init) {
    this.state = fromJS(init);
  }

  update(path, op, value) {
    switch (op) {
      case ops.ADD:
      case ops.SET:
        this.state = this.state.setIn(path, fromJS(value));
        break;
      case ops.REMOVE:
        this.state = this.state.removeIn(path);
        break;
      case ops.INSERT:
        const index = path.pop();
        this.state = this.state.updateIn(path, list =>
          list.insert(index, fromJS(value))
        );
        break;
    }
  }
}

init = JSON.parse(fs.readFileSync("data/init.json"));
data = JSON.parse(fs.readFileSync("data/ops.json"));

const baseline = measure(() => {
  const store = new Immutable(init);
  const bench = [];
  const mem = [];
  const payload = [];
  data.forEach(params => {
    const time = measure(() => {
      store.update(...params);
    });
    bench.push([params[1], time]);
    const size = JSON.stringify(store.state.toJS()).length;
    mem.push(size);
    payload.push(JSON.stringify(store.state.toJS()).length);
  });
  fs.writeFileSync("data/benchmark-baseline.json", JSON.stringify(bench));
  fs.writeFileSync("data/benchmark-baseline-mem.json", JSON.stringify(mem));
  fs.writeFileSync(
    "data/benchmark-baseline-payload.json",
    JSON.stringify(payload)
  );
});
console.log(`Ran baseline benchmark in ${baseline} ns`);
