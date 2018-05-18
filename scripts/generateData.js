import fs from "fs";
import * as ops from "../src/ops";

const length = 20;
const n = 10000;

const slides = Array(length)
  .fill(0)
  .map(() => ({
    title: "title",
    bullets: ["bullet1", "bullet2", "bullet3"]
  }));

const state = {
  slides
};

fs.writeFileSync("data/init.json", JSON.stringify(state));

const getRandomIndex = max => {
  const r = Math.random();
  return Math.floor(r * max);
};
const operations = [];
for (let i = 0; i < n / 4; i++) {
  const idx = getRandomIndex(length - 1);
  // const moveTo = getRandomIndex(length - 1);
  operations.push(
    [["slides", idx], ops.INSERT, {}],
    [["slides", idx, "title"], ops.ADD, "title"],
    [["slides", idx, "title"], ops.SET, "updated title"],
    [["slides", idx], ops.REMOVE]
  );
}

fs.writeFileSync("data/ops.json", JSON.stringify(operations));
