import fs from "fs";
import * as ops from "../../src/ops";

const length = 500;
const n = 10000;

// list
const slides = Array(length).fill(0);

const state = {
  slides
};

const getRandomIndex = max => {
  const r = Math.random();
  return Math.floor(r * max);
};
const operations = [];
for (let i = 0; i < n; i++) {
  const moveFrom = getRandomIndex(length - 1);
  const moveTo = getRandomIndex(length - 1);
  operations.push([["slides", moveFrom], ops.MOVE, moveTo]);
}

const data = {
  state,
  operations
};

fs.writeFileSync("data/move.json", JSON.stringify(data));
