import { execSync } from "child_process"
import { readFileSync, writeFileSync } from "fs"
import { z } from "zod/v4"
import { TyXDocument, TyXSettings } from "../src/models"

for (const [path, type, title] of [
  ["schemas/tyx-settings.schema.json", TyXSettings, "TyXSettings"],
  ["schemas/tyx-document.schema.json", TyXDocument, "TyXDocument"],
] as const) {
  const output = z.toJSONSchema(type, { target: "draft-7" })
  output.title = title
  writeFileSync(path, JSON.stringify(output, null, 4))
}

for (const [inputFilename, outputFilename, className] of [
  ["tyx-settings", "settings", "TyXSettings"],
  ["tyx-document", "document", "TyXDocument"],
]) {
  const output = `python/src/tyx_schema/${outputFilename}.py`
  execSync(
    `python/.venv/bin/datamodel-codegen --input schemas/${inputFilename}.schema.json --output ${output} --output-model-type pydantic_v2.BaseModel --class-name ${className} --use-schema-description`,
  )
  let result = readFileSync(output).toString()
  result = result.replace(/Union\[([^\]]+)\]/g, (match, group) => {
    const g = group as string
    const types = g.split(",").map((t) => t.trim())
    const quoted = types
      .filter((t) => t !== "")
      .map((t) => (t.startsWith('"') ? t : `"${t.replace(/"/g, "")}"`))
      .join(", ")
    return `Union[${quoted}]`
  })
  writeFileSync(output, result)
  execSync(`python/.venv/bin/black ${output}`)
}
