import fs from "fs";

const data = fs.readFileSync("data/ops.json");
const start = process.hrtime();
JSON.parse(data);
const end = process.hrtime(start);
console.log(`parsed data in ${end[0]} s + ${end[1]} ns`);
