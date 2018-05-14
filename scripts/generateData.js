import fs from "fs";
import * as ops from "../src/ops";

const data = Array(1000)
  .fill(0)
  .map((a, i) => [
    [
      [i],
      ops.INSERT,
      {
        title: "title",
        subtitle: "subtitle",
        bullets: ["bullet1", "bullet2", "bullet3"]
      }
    ],
    [[i, "title"], ops.ADD, "title"],
    [[i, "subtitle"], ops.ADD, "subtitle"],
    [[i, "bullets"], ops.ADD, []],
    [[i, "bullets", 0], ops.INSERT, "bullet1"],
    [[i, "bullets", 1], ops.INSERT, "bullet2"],
    [[i, "bullets", 2], ops.INSERT, "bullet3"]
  ]);

fs.writeFileSync("data/ops.json", JSON.stringify(data));
