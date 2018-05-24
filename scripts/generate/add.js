import fs from "fs";
import * as ops from "../../src/ops";

const n = 10000;

// list
const state = {};

const operations = [];
for (let i = 0; i < n; i++) {
  const key = `${i}`;
  operations.push([[key], ops.ADD, "asdf"]);
}

const data = {
  state,
  operations
};

fs.writeFileSync("data/add.json", JSON.stringify(data));
