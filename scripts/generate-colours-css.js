#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const coloursPath = path.join(__dirname, "../src/lib/colours.json");
const outputPath = path.join(__dirname, "../src/app/colours.generated.css");

const colours = JSON.parse(fs.readFileSync(coloursPath, "utf8"));
const css = `/* Generated from src/lib/colours.json - do not edit */

:root {
  --colour1: ${colours.colour1};
  --colour2: ${colours.colour2};
  --colour3: ${colours.colour3};
  --colour4: ${colours.colour4};
}
`;

fs.writeFileSync(outputPath, css);
console.log("Generated colours.generated.css");
