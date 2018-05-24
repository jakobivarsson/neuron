import fs from "fs";
import * as ops from "../../src/ops";

const length = 500;
const n = 10000;

// list
const state = Array(n)
  .fill(0)
  .reduce((acc, v, i) => ({ ...acc, [i]: v }), {});

const getRandomIndex = max => {
  const r = Math.random();
  return Math.floor(r * max);
};
const operations = [];
for (let i = 0; i < n; i++) {
  const key = `${getRandomIndex(length - 1)}`;
  operations.push([[key], ops.SET, i]);
}

const data = {
  state,
  operations
};

fs.writeFileSync("data/set.json", JSON.stringify(data));
