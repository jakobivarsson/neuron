import fs from "fs";
import * as ops from "../src/ops";

const data = Array(1000)
  .fill(0)
  .map((a, i) => [
    [i],
    ops.INSERT,
    {
      title: "title",
      subtitle: "subtitle",
      bullets: ["bullet1", "bullet2", "bullet3"]
    }
  ]);

fs.writeFileSync("data/ops.json", JSON.stringify(data));
