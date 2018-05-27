import fs from "fs";
import * as ops from "../../src/ops";

const n = 10000;

// list
const state = Array(n)
  .fill(0)
  .reduce((acc, v, i) => ({ ...acc, [i]: v }), {});

const operations = [];
for (let i = 0; i < n; i++) {
  const key = `${i}`;
  operations.push([[key], ops.REMOVE]);
}

const data = {
  state,
  operations
};

fs.writeFileSync("data/remove-map.json", JSON.stringify(data));
