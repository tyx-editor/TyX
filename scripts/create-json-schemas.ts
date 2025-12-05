import { execSync } from "child_process"
import { readFileSync, writeFileSync } from "fs"
import { z } from "zod/v4"
import { TyXDocument, TyXSettings, TyXValue } from "../src/models"

for (const [path, type, title] of [
  ["schemas/tyx-settings.schema.json", TyXSettings, "TyXSettings"],
  ["schemas/tyx-document.schema.json", TyXDocument, "TyXDocument"],
  [
    "schemas/tyx.schema.json",
    z.union([TyXDocument, TyXSettings, TyXValue]),
    undefined,
  ],
] as const) {
  const output = z.toJSONSchema(type, { target: "draft-7" })
  if (title) {
    output.title = title
  }
  writeFileSync(path, JSON.stringify(output, null, 4))
}

const output = `python/src/tyx_schema/schema.py`
execSync(
  `python/.venv/bin/datamodel-codegen --input-file-type jsonschema --input schemas/tyx.schema.json --output ${output} --output-model-type pydantic_v2.BaseModel --use-title-as-name --use-schema-description --skip-root-model`,
)
let result = readFileSync(output).toString()
// TODO: fixes typing errors
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
