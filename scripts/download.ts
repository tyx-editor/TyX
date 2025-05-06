import { execSync } from "child_process"
import { existsSync, mkdirSync, renameSync, writeFileSync } from "fs"
import { join } from "path"

const version = "0.13.1"
const links: [string, string][] = {
  win32: [
    [
      "x86_64-pc-windows-msvc",
      `https://github.com/typst/typst/releases/download/v${version}/typst-x86_64-pc-windows-msvc.zip`,
    ],
  ],
  linux: [
    [
      "x86_64-unknown-linux-musl",
      `https://github.com/typst/typst/releases/download/v${version}/typst-x86_64-unknown-linux-musl.tar.xz`,
    ],
  ],
  darwin: [
    [
      "aarch64-apple-darwin",
      `https://github.com/typst/typst/releases/download/v${version}/typst-aarch64-apple-darwin.tar.xz`,
    ],
    [
      "x86_64-apple-darwin",
      `https://github.com/typst/typst/releases/download/v${version}/typst-x86_64-apple-darwin.tar.xz`,
    ],
  ],
}[process.platform]
const linkExtension = { win32: ".zip", linux: ".tar.xz", darwin: ".tar.xz" }[
  process.platform
]
const extension = process.platform === "win32" ? ".exe" : ""

const binFolder = join("src-tauri", "bin")
if (!existsSync(binFolder)) {
  mkdirSync(binFolder)
}

for (const [targetTriple, link] of links) {
  const output = join(
    binFolder,
    `typst-${targetTriple.replace("musl", "gnu")}${extension}`
  )

  if (existsSync(output)) {
    continue
  }

  fetch(link)
    .then((r) => r.arrayBuffer())
    .then((b) => {
      const filename = join(binFolder, `typst-${targetTriple}${linkExtension}`)
      const binaryName = `typst-${targetTriple}/typst${extension}`
      writeFileSync(filename, new Uint8Array(b))
      execSync(`tar xf ${filename} ${binaryName}`)
      renameSync(binaryName, output)
    })
}
