import fs from "fs";
import * as ops from "../src/ops";

const length = 50;
const n = 1000;

// list
const state = Array(length)
  .fill(0)
  .reduce((acc, v, i) => ({ ...acc, [i]: "hello" }), {});

fs.writeFileSync("data/map/init.json", JSON.stringify(state));

const getRandomIndex = max => {
  const r = Math.random();
  return Math.floor(r * max);
};
const operations = [];
for (let i = 0; i < n / 3; i++) {
  const key1 = `${getRandomIndex(n - 1)}`;
  operations.push(
    [[key1], ops.ADD, "asdf"],
    [[key1], ops.SET, "qwerty"],
    [[key1], ops.REMOVE]
  );
}

fs.writeFileSync("data/map/ops.json", JSON.stringify(operations));
