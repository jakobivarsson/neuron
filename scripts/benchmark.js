import fs from "fs";

const data = fs.readFileSync("data/ops.json");
JSON.parse(data);
