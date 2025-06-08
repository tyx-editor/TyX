// Attempt to get the documentation of all valid commands.

import { dirname, join } from "path"
import {
  createProgram,
  displayPartsToString,
  parseJsonConfigFileContent,
  readConfigFile,
  SymbolFlags,
  sys,
} from "typescript"

const tsconfigFile = join(__dirname, "..", "tsconfig.json")
const configFile = readConfigFile(tsconfigFile, sys.readFile)
const configParseResult = parseJsonConfigFileContent(
  configFile.config,
  sys,
  dirname(tsconfigFile),
)

const extensionFile = join(
  __dirname,
  "..",
  "src",
  "components",
  "editor",
  "extensions.ts",
)

// Create the program (don't create source file manually)
const program = createProgram([extensionFile], configParseResult.options)
const checker = program.getTypeChecker()
const sourceFile = program.getSourceFile(extensionFile)

if (!sourceFile) {
  throw new Error(`Could not find source file: ${extensionFile}`)
}

// Important: pass a node *inside* the sourceFile, e.g. the sourceFile itself or any node inside it
const commandsSymbol = checker.resolveName(
  "Commands",
  sourceFile, // node inside the source file
  SymbolFlags.Type, // broader than TypeAlias, includes type aliases & interfaces & type refs
  false,
)

if (!commandsSymbol) {
  throw new Error("Commands not found")
}

const commandsType = checker.getDeclaredTypeOfSymbol(commandsSymbol)
const commands = checker.getPropertiesOfType(commandsType)

for (const command of commands) {
  const commandTitle = "``" + command.getName() + "``"
  console.log(commandTitle)
  console.log(Array(commandTitle.length).fill("-").join(""))
  console.log(displayPartsToString(command.getDocumentationComment(checker)))
  console.log()
}
