import { writeFileSync } from "fs"
import { z } from "zod/v4"
import { TyXDocument, TyXSettings } from "../src/models"

writeFileSync(
  "schemas/tyx-settings.schema.json",
  JSON.stringify(z.toJSONSchema(TyXSettings, { target: "draft-7" }), null, 4),
)
writeFileSync(
  "schemas/tyx-document.schema.json",
  JSON.stringify(z.toJSONSchema(TyXDocument, { target: "draft-7" }), null, 4),
)
