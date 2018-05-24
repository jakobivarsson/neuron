import fs from "fs";
import Store from "../src/core";
import * as ops from "../src/ops";
import { fromJS } from "immutable";
import stringify from "csv-stringify/lib/sync";

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
const filename = `data/benchmark/${benchType}-${date}.csv`;

const data = JSON.parse(fs.readFileSync(`data/${benchType}.json`));
const s = new Store("a", data.state);

const measure = fn => {
  const start = process.hrtime();
  fn();
  const end = process.hrtime(start);
  const ns = end[0] * 1e9 + end[1];
  return ns;
};

let op;
const store = new Immutable(data.state);
const output = [];
data.operations.forEach((params, i) => {
  if (i > 0 && i % 100 === 0) {
    s.gc();
  }
  // Measure crdt store
  const prepare = measure(() => {
    op = s.prepare(...params);
  });
  const payload = JSON.stringify(op).length;
  const apply = measure(() => {
    s.apply(op);
  });
  const mem = JSON.stringify(s.store).length;

  // Measure baseline
  const baseline = measure(() => {
    store.update(...params);
  });
  const baselineMem = JSON.stringify(store.state.toJS()).length;

  // Add row to output
  output.push([i + 1, prepare, apply, baseline, mem, payload, baselineMem]);
});
const csv = stringify(output, {
  columns: [
    "operations",
    "prepare",
    "apply",
    "baseline",
    "memory",
    "payload",
    "baseline memory"
  ],
  header: true
});
fs.writeFileSync(filename, csv);
