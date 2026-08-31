import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

for (const directory of ["workflows", "examples"]) {
  for (const file of await readdir(directory)) {
    if (!file.endsWith(".json")) continue;
    JSON.parse(await readFile(join(directory, file), "utf8"));
    console.log(`valid JSON: ${directory}/${file}`);
  }
}

