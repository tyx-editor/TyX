import path from "path"
import ts from "typescript"

const configPath = ts.findConfigFile("./", ts.sys.fileExists, "tsconfig.json")
const configFile = ts.readConfigFile(configPath!, ts.sys.readFile)
const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, "./")
const program = ts.createProgram(parsed.fileNames, parsed.options)

const formatFilePath = path.resolve(__dirname, "..", "src", "format.ts")
const sourceFile = program.getSourceFile(formatFilePath)
const checker = program.getTypeChecker()

if (!sourceFile) {
  throw new Error("Couldn't find format file")
}

function getTypeProperties(type: ts.Type, checker: ts.TypeChecker) {
  const properties: any = {}

  const apparentType = checker.getApparentType(type)
  const props = apparentType.getProperties()
  if (props.length === 0) {
    // Try to resolve the alias target
    if (type.aliasSymbol) {
      const aliasType = checker.getDeclaredTypeOfSymbol(type.aliasSymbol)
      if (aliasType !== type) {
        return { ...properties, ...getTypeProperties(aliasType, checker) }
      }
    }
  } else {
    props.forEach((prop) => {
      const decl = prop.valueDeclaration ?? prop.declarations?.[0]
      const propType = checker.getTypeOfSymbolAtLocation(prop, decl!)
      const typeStr = checker.typeToString(propType)
      properties[prop.name] = typeStr
    })
  }
  return properties
}

const schema: any = {}

sourceFile.forEachChild((node) => {
  if (
    ts.isTypeAliasDeclaration(node) &&
    node.modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
    )
  ) {
    const symbol = checker.getSymbolAtLocation(node.name)
    if (!symbol) return
    const type = checker.getDeclaredTypeOfSymbol(symbol)
    schema[node.name.text] = getTypeProperties(type, checker)
  }
})

console.log(JSON.stringify(schema, null, 4))
