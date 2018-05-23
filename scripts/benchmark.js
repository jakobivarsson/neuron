import fs from "fs";
import Store from "../src/core";
import * as ops from "../src/ops";
import { fromJS } from "immutable";

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
      case ops.MOVE:
        const fromIndex = path.pop();
        this.state = this.state.updateIn(path, list => {
          const item = list.get(fromIndex);
          return list.delete(fromIndex).insert(value, item);
        });
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

const benchType = process.argv[2];
const date = new Date().toISOString();
const dir = `data/benchmark/${benchType}-${date}`;
fs.mkdirSync(dir);

const init = JSON.parse(
  fs.readFileSync(`data/benchmark/${benchType}/init.json`)
);
const data = JSON.parse(
  fs.readFileSync(`data/benchmark/${benchType}/ops.json`)
);

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
  const store = new Immutable(init);
  const baseline = [];
  const baselineMem = [];
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
    // Measure crdt store
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

    // Measure baseline
    time = measure(() => {
      store.update(...params);
    });
    baseline.push([params[1], time]);
    const baselineSize = JSON.stringify(store.state.toJS()).length;
    baselineMem.push(baselineSize);
  });
  fs.writeFileSync(`${dir}/prepare.json`, JSON.stringify(prepare));
  fs.writeFileSync(`${dir}/apply.json`, JSON.stringify(apply));
  fs.writeFileSync(`${dir}/mem.json`, JSON.stringify(mem));
  fs.writeFileSync(`${dir}/payload.json`, JSON.stringify(payload));
  fs.writeFileSync(`${dir}/baseline.json`, JSON.stringify(baseline));
  fs.writeFileSync(`${dir}/baseline-mem.json`, JSON.stringify(baselineMem));
});

console.log(`Ran benchmark in ${crdt} ns`);

console.log(s.serialize());
