import { readFileSync } from "fs"

const version: string = JSON.parse(
  readFileSync("./src-tauri/tauri.conf.json").toString(),
).version

const changelog = readFileSync("CHANGELOG.md").toString()

const changelogLines = changelog.split("\n")
const startLine = changelogLines.findIndex((line) =>
  line.startsWith(`## [${version}]`),
)
const endLine = changelogLines.findIndex(
  (line, index) => index > startLine && line.startsWith("## ["),
)
const description = changelogLines
  .slice(startLine + 1, endLine)
  .join("\n")
  .trim()

console.log(description)
