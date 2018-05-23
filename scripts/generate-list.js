import fs from "fs";
import * as ops from "../src/ops";

const length = 50;
const n = 10000;

// list
const slides = Array(length)
  .fill(0)
  .map(() => "hello");

const state = {
  slides
};

fs.writeFileSync("data/list/init.json", JSON.stringify(state));

const getRandomIndex = max => {
  const r = Math.random();
  return Math.floor(r * max);
};
const operations = [];
for (let i = 0; i < n / 3; i++) {
  const idx = getRandomIndex(length - 1);
  const removeIdx = getRandomIndex(length - 1);
  const moveFrom = getRandomIndex(length - 1);
  const moveTo = getRandomIndex(length - 1);
  operations.push(
    [["slides", idx], ops.INSERT, "asdf"],
    [["slides", removeIdx], ops.REMOVE],
    [["slides", moveFrom], ops.MOVE, moveTo]
  );
}

fs.writeFileSync("data/list/ops.json", JSON.stringify(operations));
