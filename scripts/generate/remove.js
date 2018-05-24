import fs from "fs";
import * as ops from "../../src/ops";

const n = 10000;

// list
const slides = Array(n).fill(0);

const state = {
  slides
};

const getRandomIndex = max => {
  const r = Math.random();
  return Math.floor(r * max);
};
const operations = [];
for (let i = 0; i < n; i++) {
  const idx = getRandomIndex(n - i - 1);
  operations.push([["slides", idx], ops.REMOVE]);
}

const data = {
  state,
  operations
};

fs.writeFileSync("data/remove.json", JSON.stringify(data));
