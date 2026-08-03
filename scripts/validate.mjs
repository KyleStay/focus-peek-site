import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

for (const file of ["index.html", "privacy.html", "support.html", "404.html", "assets/styles.css", "assets/og.png", "assets/icon-128.png"]) {
  if (!fs.existsSync(path.join(root, file))) failures.push(`Missing ${file}`);
}

for (const file of ["index.html", "privacy.html", "support.html", "404.html"]) {
  const html = read(file);
  if (!/^<!doctype html>/i.test(html)) failures.push(`${file} is missing a doctype`);
  if (!html.includes('name="viewport"')) failures.push(`${file} is missing viewport metadata`);
  for (const match of html.matchAll(/(?:href|src)="((?!https?:|mailto:|#)[^"]+)"/g)) {
    const target = match[1].split(/[?#]/)[0];
    if (!fs.existsSync(path.resolve(root, target))) failures.push(`${file} references missing ${target}`);
  }
}

const privacy = read("privacy.html");
for (const expected of [
  "processed locally",
  "not collected by or sent to the publisher",
  "does not execute remotely hosted code",
  "Limited Use",
  "Third-party media previews and video-site embeds can be disabled",
  "does not request access to Chrome's browsing history",
  "personally identifiable information or personal communications",
  "does not read, store, or send authentication credentials",
  "same-origin Reddit post metadata",
  "no account or publisher-controlled user database"
]) {
  if (!privacy.includes(expected)) failures.push(`privacy.html is missing: ${expected}`);
}

const publicText = ["index.html", "privacy.html", "support.html", "README.md"].map(read).join("\n");
if (/github\.com\/KyleStay\/stay-in-focus/i.test(publicText)) failures.push("Public site links to the private source repository");
if (!publicText.includes("github.com/KyleStay/focus-peek-site/issues")) failures.push("Public issue tracker link is missing");

function pngDimensions(file) {
  const png = fs.readFileSync(path.join(root, file));
  return [png.readUInt32BE(16), png.readUInt32BE(20)];
}
if (JSON.stringify(pngDimensions("assets/og.png")) !== JSON.stringify([1200, 630])) failures.push("Social card must be 1200x630");
if (JSON.stringify(pngDimensions("assets/icon-128.png")) !== JSON.stringify([128, 128])) failures.push("Icon must be 128x128");

if (failures.length) {
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log("Focus Peek public site validation passed");
