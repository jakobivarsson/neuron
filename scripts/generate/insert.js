import fs from "fs";
import * as ops from "../../src/ops";

const n = 10000;

// list
const slides = [];

const state = {
  slides
};

const getRandomIndex = max => {
  const r = Math.random();
  return Math.floor(r * max);
};
const operations = [];
for (let i = 0; i < n; i++) {
  const idx = getRandomIndex(i);
  operations.push([["slides", idx], ops.INSERT, 0]);
}

const data = {
  state,
  operations
};

fs.writeFileSync("data/insert.json", JSON.stringify(data));
